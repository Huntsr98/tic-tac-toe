import { Action, Game, GameId, Games, ServerState, UpdateState, UpdateStateArgs, WhoseTurn } from "./types"
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



export const updateState = (stateUpdate: UpdateState) => {

    if (stateUpdate.action === Action.addGame) {
        const game: Game = stateUpdate.payload;
        state.games = state.games.map((game) => game)
        state.games.push(game)
    }
    switch (stateUpdate.action) {
        case Action.join:

            break
        case Action.addGame:
            state.games = state.games.map((game) => game)
            state.games.push(stateUpdate.payload)
            break

    }
    return state
}


// const getState = () => {
// app.post('/get-state', (request, response) => {
//     response.send({
//         message: 'okay :)',
//         state: convertStatetoBrowserState(request.body.userId, request.body.myColor, state)
//     })
// }) ???
// }

// export const addMoveToColumn = (myColor, columnNumber) => {
//     const column = state.columns[columnNumber]
//     column.push(myColor)
//     // logger(state)
// }

export const convertStatetoBrowserState = (userId, gameId, whoseTurn, state) => {
    const { players, whoseTurn, ...remainingState } = state
    // explode out the contents of remainingState and capture them in a new object
    // we're separating state into an object with the components players, and remainingstate so that we dont' have to have 
    // players in BrowserState
    // AKA we're taking players out of state
    const browserState: BrowserState = { userId, isItMyTurn, ...remainingState }
    return browserState
}

// export const switchWhoseTurn = () => {
//     if (state.whoseTurn === 'black') {
//         state.whoseTurn = 'red'
//     } else {
//         state.whoseTurn = 'black'
//     }
// }