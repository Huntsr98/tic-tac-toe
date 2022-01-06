import * as express from 'express'
import * as cors from 'cors'
import { convertStatetoBrowserState, findGame, findWaitingGame, gameFactory, getState, updateState } from './update-state';
import { Action, Game, ServerState } from './types';
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
    console.log('boo')
    const userId = req.body.userId || uuidv4()
    const state = getState()
    const existingGame = findWaitingGame(state.games)
    if (existingGame === undefined) {
        const newGame = gameFactory()
        // clone state.games so you don't mutate state
        
        updateState({action: Action.addGame, payload: newGame})
        newGame.players.X = userId

        // if there is no existing Game, then make a new game
        // assign userId to player X inside of the new game
    } else {
        existingGame.players.O = userId
        // if there is an existing game, then assign userId to player O
    }

    const serverState: ServerState = updateState({ action: Action.join, payload: userId })

    const gameOnly: Game = findGame(serverState, existingGame.gameId)
    const browserState = convertStatetoBrowserState(gameOnly, userId)
    res.send(browserState)
})



//make /move endpoint


app.listen(port, () => {
    logger(`Example app listening on port ${port}!`)
});