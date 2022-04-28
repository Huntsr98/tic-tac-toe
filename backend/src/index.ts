import * as express from 'express'
import * as cors from 'cors'
import { utils, findWaitingGame, gameFactory, getState, state, updateState } from './update-state';
import { Action, Game, GameId, GamePiece, ServerState, UserId, UserPlayerIds, WhoseTurn, ServerResponse, Move } from './types';
import { v4 as uuidv4 } from 'uuid'
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


app.post('/get-state', (req, res) => {
    // const serverState: ServerState = updateState({
    //     action: Action.getState,
    //     payload: {
    //         userId,
    //         gameId,
    //         gamePiece
    //     }
    // })

    const gameOnly: Game = utils.findGame(getState(), req.body.gameId)
    const serverResponse = utils.convertStateToResponse(gameOnly, req.body.userId)

    res.send(serverResponse)
})

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
        // updateState({action: Action.switchWhoseTurn, payload: {gameId: gameId, whoseTurn: gamePiece as unknown as WhoseTurn}})
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

    const gameOnly: Game = utils.findGame(serverState, game.gameId)
    const serverResponse = utils.convertStateToResponse(gameOnly, userId)

    res.send(serverResponse)
})

// sample request looks like this: 
// const req = {
//     move: { x: 1, y: 2 },
//     userId: '12345',
//     gameId: '56789',
//     isItMyTurn: true
// }
//     move: {x, y}
//     userId: serverResponse.userId
//     gamePiece: serverResponse.gamePiece
//     game: serverResponse.gameId
// }

const isItMyTurn = (userId: UserId, players: UserPlayerIds, whoseTurn: WhoseTurn): boolean => {
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



export const makeAMove = (
    req: {
        body: {
            userId: UserId,
            gameId: GameId,
            move: {
                x: number,
                y: number
            }
            // isItMyTurn: boolean
        }
    },
    res: {
        send: (serverResponse: ServerResponse) => unknown
    }
) => {
    // find gameOnly
    let gameOnly = utils.findGame(getState(), req.body.gameId)
    // this is undefined???


    // is this in the wrong order?????
    if (isItMyTurn(req.body.userId, gameOnly.players, gameOnly.whoseTurn)) {
        const serverState: ServerState = updateState({
            action: Action.makeAMove,
            payload: {
                gameId: req.body.gameId,
                move: {
                    x: req.body.move.x,
                    y: req.body.move.y,
                    userId: req.body.userId
                },
            }
        })
        gameOnly = utils.findGame(serverState, req.body.gameId)

        const winner = checkForWin(req.body.userId, gameOnly.board)
        // check for winner. 

        // const checkForConflictingMove = (moves: Move[]): Move | undefined => {
        //     return moves.find((move) => {
        //         req.body.move.x === move.x && req.body.move.y === move.y && move.userId
        //     })
        // }

        let newServerState: ServerState

        // check if the move has already been made
        // callback function -- if playermove coordinates are the same as boardmove coordinates, 
        // and there is a userId for the move already, then 
        // const checkForConflictingMove = (boardMove: Move, playerMove: { x: number, y: number }) => {

        const conflictingMove = utils.checkForConflictingMove(gameOnly.board, req.body.move)
        // fix conflictingMove
        if (conflictingMove) {
            console.log('conflicting move!')
        } else if (winner) {
            newServerState = updateState({
                action: Action.updateWinner,
                payload: {
                    gameId: req.body.gameId,
                    winner: req.body.userId
                }
            })

        } else {
            // figure out why frontend is not switching turns
            newServerState = updateState({
                action: Action.switchWhoseTurn,
                payload: {
                    gameId: req.body.gameId,
                    whoseTurn: gameOnly.whoseTurn
                }
            })

        }

        // HW: 
        // check adding second player to existing game
        // why is it allowing two moves in the same square? 
        // only updates when you click....


        // how do you get it to update by itself???
        // clearinterval w/ (state, setstate in frontend?)
        // if (isItMyTurn(currentState) === true) {
        //     clearInterval(timerId)

        //     setState(currentState)
        // }

        // if there is no winner, switch turns.
        gameOnly = utils.findGame(newServerState, req.body.gameId)

    } else {
        gameOnly = utils.findGame(getState(), req.body.gameId)
    } // do I still need this else? 


    console.log({ gameOnly })




    const serverResponse: ServerResponse = utils.convertStateToResponse(gameOnly, req.body.userId)
    res.send(serverResponse)

    // send serverResponse




}
app.post('/make-a-move', makeAMove)

//make /move endpoint


app.listen(port, () => {
    // logger(`Example app listening on port ${port}!`)
});