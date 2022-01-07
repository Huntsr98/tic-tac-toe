import { Action, ServerResponse, Game, GameId, GamePiece, Games, ServerState, StateUpdate, UserId, WhoseTurn } from "./types"
import { v4 as uuidv4 } from 'uuid';





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

export const findGame = (state: ServerState, gameId: GameId): Game => {
    return state.games.find((game) => {
        return game.gameId === gameId
    })
}

export const gameFactory = (): Game => {
    return {
        players: {
            X: null,
            O: null
        },
        board: [],
        whoseTurn: WhoseTurn.X,
        gameId: uuidv4(),
        winner: null
    }
}

export const getState = (): ServerState => state



export const updateState = (stateUpdate: StateUpdate) => {

    switch (stateUpdate.action) {
        case Action.join:
            //clone state.games before you mutate
            state.games = [...state.games]
            // find game with GameId
            const game = findGame(state, stateUpdate.payload.gameId)
            // clone game before you mutate
            const clonedGame = { ...game }
            // populate player[gamePiece] of game with UserId
            game.players[stateUpdate.payload.gamePiece] = stateUpdate.payload.userId

            break
        case Action.addGame:
            //clone state.games before you mutate
            state.games = [...state.games]
            state.games.push(stateUpdate.payload)
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

export const convertStateToResponse = (gameOnly: Game, userId: UserId) => {
    const { players, whoseTurn, ...remainingState } = gameOnly
    // explode out the contents of remainingState and capture them in a new object
    // we're separating state into an object with the components players, and remainingstate so that we dont' have to have 
    // players in ServerResponse
    // AKA we're taking players out of state

    const findGamePiece = (): GamePiece => {
        let gamePiece
        if (userId === whoseTurn) {
            gamePiece = whoseTurn
        } else {
            if (players.X === userId) {
                gamePiece = 'O'
            }
            else if (players.O === userId) {
                gamePiece = 'X'
            }
            return gamePiece
        }
    }

    const gamePiece: GamePiece = findGamePiece()

    const serverResponse: ServerResponse = { userId, gamePiece, whoseTurn, ...remainingState }
    return serverResponse
}