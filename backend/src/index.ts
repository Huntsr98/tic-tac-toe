import * as express from 'express'
import * as cors from 'cors'
import { convertStateToResponse, findGame, findWaitingGame, gameFactory, getState, state, updateState } from './update-state';
import { Action, Game, GameId, GamePiece, ServerState, UserId, WhoseTurn } from './types';
import { v4 as uuidv4 } from 'uuid'
import { ServerResponse } from 'http';
import { checkForWin } from './check-for-win';

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

// sample request looks like this: 
// const req = {
//     coordinates: { x: 1, y: 2 },
//     userId: '12345',
//     gameId: '56789',
//     isItMyTurn: true
// }
//     coordinates: {x, y}
//     userId: serverResponse.userId
//     gamePiece: serverResponse.gamePiece
//     game: serverResponse.gameId
// }

export const makeAMove = (req, res) => {
    console.log(req.body)

    // find gameOnly
    let gameOnly
    gameOnly = findGame(getState(), req.body.gameId)
    // this is undefined???
    console.log(gameOnly)

    const isItMyTurn = (userId: UserId, players, whoseTurn: WhoseTurn): boolean => {
        // which player matches the userId? 
        let userPiece
        if (players.X === userId) {
            userPiece = 'X'
        }
        else if (players.O === userId) {
            userPiece = 'O'
        }

        // if the player matches whoseTurn, it is my turn
        
        return (userPiece === whoseTurn) 
    }

    
    if (isItMyTurn(req.body.userId, gameOnly.players, gameOnly.whoseTurn)) {
        const serverState: ServerState = updateState({
            action: Action.makeAMove,
            payload: {
                gameId: req.body.gameId,
                move: {
                    x: req.body.coordinates.x,
                    y: req.body.coordinates.y,
                    userId: req.body.userId
                },
            }
        })
        gameOnly = findGame(serverState, req.body.gameId)
    } else {
        gameOnly = findGame(getState(), req.body.gameId)
    } // do I still need this else? 


    const winner = checkForWin(gameOnly.whoseTurn, gameOnly.board)
    // check for winner. 
    if (winner) {
        // declare winner
    } else {
        //switch turns
    }
    // if there is no winner, switch turns.

    const serverResponse = convertStateToResponse(gameOnly, req.body.move.userId)
    res.send(serverResponse)




    // send serverResponse




}
app.post('/make-a-move', makeAMove)

//make /move endpoint


app.listen(port, () => {
    logger(`Example app listening on port ${port}!`)
});