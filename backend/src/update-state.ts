export let state

// enum crosses the boundary of type and object
export enum Action {
    join = 'join',
    start = 'start'
}

// type UpdateStateWinner =  {action: Action.winner, payload: PieceColor} 
// type UpdateStateStart = {action: Action.start, payload: UserId}
// type UpdateStateArgs = UpdateStateWinner | UpdateStateStart
// type UpdateState = (arg: UpdateStateArgs) => ServerState 

const stateFactory() => {

}

export const updateState = (args) => {
    switch (args.action) {
        case Action.start:
            state = state || stateFactory(args.payload)
            break
        case Action.join:
            state = state || stateFactory(args.payload)
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

export const addMoveToColumn = (myColor, columnNumber) => {
    const column = state.columns[columnNumber]
    column.push(myColor)
    logger(state)
}

export const convertStatetoBrowserState = (userId, myColor, state) => {
    const { players, ...remainingState } = state
    // explode out the contents of remainingState and capture them in a new object
    // we're separating state into an object with the components players, and remainingstate so that we dont' have to have 
    // players in BrowserState
    // AKA we're taking players out of state
    const browserState: BrowserState = { userId, myColor, ...remainingState }
    return browserState
}

export const switchWhoseTurn = () => {
    if (state.whoseTurn === 'black') {
        state.whoseTurn = 'red'
    } else {
        state.whoseTurn = 'black'
    }
}