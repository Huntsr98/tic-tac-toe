export enum WhoseTurn {
    X = 'X',
    O = 'O'
}

export type Move = {
    x: number,
    y: number,
    userId: string
}
export type UserId = string
export type GameId = string
export type Game = {
    players: {
        X: null | UserId,
        O: null | UserId
    }
    whoseTurn: WhoseTurn    
    gameId: GameId 
    board: Move[]
    winner: null | UserId
}
export type Games = Game[]
export type ServerState = {
    games: Games
}


export type GamePiece = WhoseTurn
export type BrowserState = {
    userId: UserId,
    gamePiece: GamePiece
    whoseTurn: GamePiece,
    gameId: GameId,
    board: Move[],
    winner: null | UserId
}

// enum crosses the boundary of type and object
export enum Action {
    join = 'join',
    addGame = 'addGame',
    makeAMove = 'makeAMove'
}

export type UpdateStateJoin = {
    action: Action.join,
    payload: { gameId: GameId, userId: UserId }
}
export type UpdateStateAddGame = {
    action: Action.addGame,
    payload: Game
}

export type UpdateStateMakeAMove = {
    action: Action.makeAMove,
    payload: unknown
}

export type UpdateState = UpdateStateJoin | UpdateStateAddGame | UpdateStateMakeAMove


