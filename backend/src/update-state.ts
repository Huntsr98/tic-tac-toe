import { Action, ServerResponse, Game, GameId, GamePiece, Games, ServerState, StateUpdate, UserId, WhoseTurn, Move, BrowserMove } from "./types"
import { v4 as uuidv4 } from 'uuid';
import { extractPlayersMoves } from "./check-for-win";

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
            return game.gameId === gameId
        })
    },
    convertStateToResponse: (gameOnly: Game, userId: UserId):ServerResponse => {
        const { players, whoseTurn, board, ...remainingState } = gameOnly
        // explod..e out the contents of remainingState and capture them in a new object
        // we're separating state into an object with the components players, and remainingstate so that we dont' have to have 
        // players in ServerResponse
        // AKA we're taking players out of state
    
        const findGamePiece = (): GamePiece => {
            let gamePiece
            if (userId === players.X && whoseTurn === 'X') {
                gamePiece = GamePiece.X
            } else if (userId === players.O && whoseTurn === 'O') {
                gamePiece = GamePiece.O
            }
            else {
                if (players.X === userId) {
                    gamePiece = GamePiece.O
                } 
                else if (players.O === userId) {
                    gamePiece = GamePiece.X
                }
            }
            return gamePiece
        }
    
        const gamePiece: GamePiece = findGamePiece()
    
        const browserBoard = board.map((move: Move): BrowserMove => {
            return {
                x: move.x,
                y: move.y,
                type: getPlayersPiece(gameOnly, move.userId)
    
            }
        })
        const serverResponse: ServerResponse = { userId, gamePiece, whoseTurn, board: browserBoard, ...remainingState }
        return serverResponse
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
        gameId: uuidv4() as GameId,
        winner: null
    }
}

export const getState = (): ServerState => state

export const otherPlayer = (whoAmI: WhoseTurn) => {
    if (whoAmI === WhoseTurn.X) {
        whoAmI = WhoseTurn.O
    }  else if (whoAmI === WhoseTurn.O) {
        whoAmI = WhoseTurn.X
    }
}


export const updateState = (stateUpdate: StateUpdate) => {

    switch (stateUpdate.action) {
        case Action.join:
            //clone state.games before you mutate
            state.games = [...state.games]
            // find game with GameId
            let game = utils.findGame(state, stateUpdate.payload.gameId)
            // clone game before you mutate
            let clonedGame = { ...game }
            // populate player[gamePiece] of game with UserId
            game.players[stateUpdate.payload.gamePiece] = stateUpdate.payload.userId

            break
        case Action.addGame:
            //clone state.games before you mutate
            state.games = [...state.games]
            state.games.push(stateUpdate.payload)
            break
        case Action.makeAMove:
            state.games = [...state.games]
            game = utils.findGame(state, stateUpdate.payload.gameId)
            clonedGame = { ...game }
            game.board.push(stateUpdate.payload.move)
            break
        case Action.switchWhoseTurn:
            state.games = [...state.games]
            game = utils.findGame(state, stateUpdate.payload.gameId)
            clonedGame = { ...game }
            otherPlayer(stateUpdate.payload.whoseTurn)

            // game.whoseTurn = 
            break




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