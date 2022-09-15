import { Action, ServerResponse, Game, GameId, GamePiece, Games, ServerState, StateUpdate, UserId, WhoseTurn, Move, BrowserMove, UserPlayerIds, MaybeGamePiece } from "./types"
import { v4 as uuidv4 } from 'uuid';
import { extractPlayersMoves } from "./check-for-win";
import { saveGame } from "./mongoDb";

export const getPlayersPiece = (game: Game, playerId: string) => {
    if (game.players.O === playerId) {
        return GamePiece.O
    } else {
        return GamePiece.X
    }
}

export const utils = {
    findGame: (state: ServerState, gameId: GameId): Game => {
        return state.games.find((game) => {
            return game._id === gameId
        })
    },
    convertStateToResponse: (gameOnly: Game, userId: UserId): ServerResponse => {

        const { players, whoseTurn, board, winner, _id, ...remainingState } = gameOnly

        // explod..e out the contents of remainingState and capture them in a new object
        // we're separating state into an object with the components players, and remainingstate so that we dont' have to have 
        // players in ServerResponse
        // AKA we're taking players out of state

        const gamePiece: GamePiece = utils.findGamePiece(userId, players)

        const browserBoard = board.map((move: Move): BrowserMove => {
            const browserMove: BrowserMove = {
                x: move.x,
                y: move.y,
                type: null
            }
            if (move.userId === gameOnly.players.X) {
                browserMove.type = GamePiece.X
            } else {
                browserMove.type = GamePiece.O
            }
            return browserMove

        })

        
        const convertBrowserWinner = (players: UserPlayerIds, winner: null | UserId ): MaybeGamePiece => {
            let convertedWinner
            if (winner === players.X) {
                convertedWinner = 'X' as GamePiece.X
            } else if (winner === players.O) {
                convertedWinner = 'O' as GamePiece.O
            } else if (!winner) {
                convertedWinner = null
            }
            return convertedWinner
        }

        const browserWinner: MaybeGamePiece = convertBrowserWinner(gameOnly.players, gameOnly.winner)

        const serverResponse: ServerResponse = { userId, gamePiece, whoseTurn, board: browserBoard, winner: browserWinner, gameId: _id, ...remainingState }

        return serverResponse
    },
    
    checkForConflictingMove: (boardMoves: Move[], proposedMove: { x: number, y: number }): Move | undefined => {
        return boardMoves.find((move) => {
            proposedMove.x === move.x && proposedMove.y === move.y && move.userId
        })
    },
    findGamePiece: (userId: UserId, players: UserPlayerIds): GamePiece => {
        let gamePiece
        if (userId === players.X) {
            gamePiece = GamePiece.X
        } else if (userId === players.O) {
            gamePiece = GamePiece.O
        }
        return gamePiece
    }
}




// type UpdateStateWinner =  {action: Action.winner, payload: PieceColor} 
// type UpdateStateStart = {action: Action.start, payload: UserId}
// type UpdateStateArgs = UpdateStateWinner | UpdateStateStart
// type UpdateState = (arg: UpdateStateArgs) => ServerState 



export let state: ServerState = {
    games: []
}

export const findWaitingGame = (games: Games): Game | undefined => {
    return games.find((game) => !game.players.O || !game.players.X)
}





export const gameFactory = (): Game => {
    return {
        players: {
            X: null,
            O: null
        },
        board: [],
        whoseTurn: WhoseTurn.X,
        _id: uuidv4() as GameId,
        winner: null
    }
}

export const getState = (): ServerState => state

export const otherPlayer = (whoAmI: WhoseTurn) => {
    if (whoAmI === WhoseTurn.X) {
        return WhoseTurn.O
    } else if (whoAmI === WhoseTurn.O) {
        return WhoseTurn.X
    }
}


export const updateState = async (stateUpdate: StateUpdate) => {
    let game
    switch (stateUpdate.action) {
        // initialize the let games?

        case Action.join:
            //clone state.games before you mutate
            state.games = [...state.games]
            console.log(state)
            // find game with GameId
            game = utils.findGame(state, stateUpdate.payload.gameId)
            // populate player[gamePiece] of game with UserId
            game.players[stateUpdate.payload.gamePiece] = stateUpdate.payload.userId
            break
        case Action.addGame:
            await saveGame(stateUpdate.payload)

            //clone state.games before you mutate
            state.games = [...state.games]

            state.games.push(stateUpdate.payload)
            break
        case Action.makeAMove:
            state.games = [...state.games]
            game = utils.findGame(state, stateUpdate.payload.gameId)
            game.board.push(stateUpdate.payload.move)
            break
        case Action.switchWhoseTurn:
            state.games = [...state.games]
            game = utils.findGame(state, stateUpdate.payload.gameId)
            game.whoseTurn = otherPlayer(stateUpdate.payload.whoseTurn)
            break
        case Action.updateWinner:
            state.games = [...state.games]
            game = utils.findGame(state, stateUpdate.payload.gameId)
            game.winner = stateUpdate.payload.winner
            break
        // case Action.getState:
        //     state.games = [...state.games]
        //     game = utils.findGame(state, stateUpdate.payload.gameId)
        //     break 

    }
    return state
}


// const getState = () => {
// app.post('/get-state', (request, response) => {
//     response.send({
//         message: 'okay :)',
//         state: convertStateToResponse(request.body.userId, request.body.myColor, state)
//     })
// }) ???
// }

// export const addMoveToColumn = (myColor, columnNumber) => {
//     const column = state.columns[columnNumber]
//     column.push(myColor)
//     // logger(state)
// }

// export const convertStateToResponse = (gameOnly: Game, userId: UserId):ServerResponse => {
//     const { players, whoseTurn, board, ...remainingState } = gameOnly
//     // explode out the contents of remainingState and capture them in a new object
//     // we're separating state into an object with the components players, and remainingstate so that we dont' have to have 
//     // players in ServerResponse
//     // AKA we're taking players out of state

//     const findGamePiece = (): GamePiece => {
//         let gamePiece
//         if (userId === players.X && whoseTurn === 'X') {
//             gamePiece = GamePiece.X
//         } else if (userId === players.O && whoseTurn === 'O') {
//             gamePiece = GamePiece.O
//         }
//         else {
//             if (players.X === userId) {
//                 gamePiece = GamePiece.O
//             }
//             else if (players.O === userId) {
//                 gamePiece = GamePiece.X
//             }
//         }
//         return gamePiece
//     }

//     const gamePiece: GamePiece = findGamePiece()

//     const browserBoard = board.map((move: Move): BrowserMove => {
//         return {
//             x: move.x,
//             y: move.y,
//             type: getPlayersPiece(gameOnly, move.userId)

//         }
//     })
//     const serverResponse: ServerResponse = { userId, gamePiece, whoseTurn, board: browserBoard, ...remainingState }
//     return serverResponse
// } 