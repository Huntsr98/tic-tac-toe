
export enum Env {
    dev = 'dev',
    prod = 'prod'
}
export enum Color {
    green = 'green',
    red = 'red',
    gold = 'gold',
    grey = 'grey'
}
export enum GamePiece {
    X = 'X',
    O = 'O'
}
const port = 5000 //placeholder
export type Config = {
    boardHeight: number
    boardWidth: number
    boarderColor: {
        myTurn: Color.green,
        notMyTurn: Color.red
    }
    boardSquareImage: {
        X: GamePiece.X
        O: GamePiece.O
    }
    boardSquareWidth: number
    boardSquareHeight: number
    buttonColor: Color.red
    api: {
        join: `/join`

    }
    env: Env
    port: number
}
const boardDimension = 900

export const config: Config = {
    boardHeight: boardDimension,
    boardWidth: boardDimension,
    boarderColor: {
        myTurn: Color.green,
        notMyTurn: Color.red
    },
    boardSquareImage: {
        X: GamePiece.X, // image of an X?
        O: GamePiece.O // image of an O?
    },
    boardSquareWidth: boardDimension / 3,
    boardSquareHeight: boardDimension / 3,
    buttonColor: Color.red,
    api: {
        join: `/join`
    },
    env: Env.dev,
    port: 3000
}


export type GameId = string
export type UserId = string
export type Move = {
    x: number
    y: number
    type: GamePiece
}

export type State = {
    gameId: GameId
    userId: UserId
    gamePiece: GamePiece
    boardColor: Color
    board: Move[]
    isItMyTurn: boolean
    winner: GamePiece | null

}

export type ServerResponse = {
    gameId: GameId
    userId: UserId
    gamePiece: GamePiece
    whoseTurn: GamePiece
    board: Move[]
    winner: GamePiece | null
}
