import * as express from 'express'
import * as cors from 'cors'
import { convertStateToResponse, findGame, findWaitingGame, gameFactory, getState, updateState } from './update-state';
import { Action, Game, GameId, GamePiece, ServerState } from './types';
import { v4 as uuidv4 } from 'uuid'

// import state, updateState, Action from new file called update-state?

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const port = 3000
export const logging = true
export type Logger = (...args: any[]) => void
export const logger: Logger = function (...args) {
    if (logging === true) {
        console.log(...args)
    }
}

let cache = ['hello']
const myDB = {}

const origin = `http://localhost:1234`
const corsOptions = {
    origin,
    optionsSuccessStatus: 200

}
app.use(cors(corsOptions))





//START ENDPOINTS HERE


app.post('/join', (req, res) => {
    console.log(req.body)
    const userId = req.body.userId || uuidv4()
    const state = getState()
   let game = findWaitingGame(state.games)
    let gameId: GameId
    let gamePiece: GamePiece
    if (game === undefined) {
        game = gameFactory()
        // clone state.games so you don't mutate state
        gameId = game.gameId
        updateState({ action: Action.addGame, payload: game })
        gamePiece = GamePiece.X
        // if there is no existing Game, then make a new game
        // assign userId to player X inside of the new game
    } else {
        gameId = game.gameId
        gamePiece = GamePiece.O
        // if there is an existing game, then assign userId to player O
    }

    const serverState: ServerState = updateState({
        action: Action.join,
        payload: {
            userId,
            gameId,
            gamePiece
        }
    })

    const gameOnly: Game = findGame(serverState, game.gameId)
    const serverResponse = convertStateToResponse(gameOnly, userId)

    res.send(serverResponse)
})


//make /move endpoint


app.listen(port, () => {
    logger(`Example app listening on port ${port}!`)
});