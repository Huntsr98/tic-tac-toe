export enum WhoseTurn {
    X = 'X',
    O = 'O'
}

export enum GamePiece {
    X = 'X',
    O = 'O'
}

export type Move = {
    x: number,
    y: number,
    userId: UserId
}

export type UserPlayerIds = {
    X: null | UserId,
    O: null | UserId
}

export type RequestStructure = {
    body: {
        userId: UserId
        gameId: GameId
    }
}


export type UserId = 'userId'
export type GameId = 'gameId'
export type Game = {
    players: UserPlayerIds
    whoseTurn: WhoseTurn
    _id: GameId
    board: Move[]
    winner: null | UserId
}
export type Games = Game[]
export type ServerState = {
    games: Games
}

export type BrowserMove = {
    x: number
    y: number
    type: GamePiece
}

export type MaybeGamePiece = null | GamePiece

export type ServerResponse = {
    userId: UserId,
    gamePiece: GamePiece
    whoseTurn: WhoseTurn,
    gameId: GameId,
    board: BrowserMove[],
    winner: MaybeGamePiece
}

// enum crosses the boundary of type and object
export enum Action {
    join = 'join',
    addGame = 'addGame',
    makeAMove = 'makeAMove',
    switchWhoseTurn = 'switchWhoseTurn',
    updateWinner = 'updateWinner',
}

export type UpdateStateJoin = {
    action: Action.join,
    payload: {
        gameId: GameId,
        userId: UserId,
        gamePiece: GamePiece
    }
}
export type UpdateStateAddGame = {
    action: Action.addGame,
    payload: Game
}

export type UpdateStateMakeAMove = {
    action: Action.makeAMove,
    payload: {
        gameId: GameId
        move: Move
    }
}

export type UpdateSwitchWhoseTurn = {
    action: Action.switchWhoseTurn,
    payload: {
        gameId: GameId
        
        whoseTurn: WhoseTurn
    }

}

export type UpdateStateWinner = {
    action: Action.updateWinner,
    payload: {
        gameId: GameId,
        winner: UserId
    }
}


export type StateUpdate = UpdateStateJoin | UpdateStateAddGame | UpdateStateMakeAMove | UpdateSwitchWhoseTurn | UpdateStateWinner


