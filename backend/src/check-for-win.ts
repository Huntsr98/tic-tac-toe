import { Move, UserId, WhoseTurn } from "./types"

export const extractPlayersMoves = (moves: Move[], userId: UserId) => {
    const sortMoves = (move: Move) => {
        if (move.userId === userId) {
            return move
        }
    }
    return moves.filter(sortMoves)
}

export const checkLength = (array) => {
    let winner = false
    if (array.length === 3) {
        winner = true
    }
    return winner
}


export const checkForStraightWin = (playerMoves, direction): boolean => {

    const separatedMoves = (acc, move) => {
        let sortBy
        if (direction === 'vertical') {
            sortBy = move.x
        } else if (direction === 'horizontal') {
            sortBy = move.y
        }

        if (sortBy === 0) {
            acc.zeroes.push(move)
        } else if (sortBy === 1) {
            acc.ones.push(move)
        } else if (sortBy === 2) {
            acc.twos.push(move)
        }
        return acc
    }


    const results = playerMoves.reduce(separatedMoves, {
        zeroes: [],
        ones: [],
        twos: []
    })
    console.log(results)

    const resultsValues = Object.values(results)
    return resultsValues.some(checkLength)
}


export const checkForDiagonalWin = (playerMoves) => {

    const findSet1 = (move: Move) => {
        if (move.x === 2 && move.y === 0) {
            return move
        } else if (move.x === 1 && move.y === 1) {
            return move
        } else if (move.x === 0 && move.y === 2) {
            return move
        }
    }

    const findSet2 = (move: Move) => {
        if (move.x === 0 && move.y === 0) {
            return move
        } else if (move.x === 1 && move.y === 1) {
            return move
        } else if (move.x === 2 && move.y === 2) {
            return move
        }
    }

   let winner = false

    console.log(playerMoves.filter(findSet1))
    console.log(playerMoves.filter(findSet2))

    if (playerMoves.filter(findSet1).length === 3 || (playerMoves.filter(findSet2).length) === 3) {
        winner = true
    }

    return winner

    // push xs into xs[]
    // push ys into ys[]
    // const onlyXs = (move) => {
    //     return move.x
    // }
    // const onlyYs = (move) => {
    //     return move.y
    // }
    // const xs: [] = playerMoves.map(onlyXs)
    // const ys: [] = playerMoves.map(onlyYs)

    // // if length of xs is >= 3, and xs increments by one, return winner
    // // if length of ys is >= 3, and ys increments by one, return winner
    // const uniqueXs =  [...new Set(xs)]
    // const uniqueYs =  [...new Set(ys)]

 
    // if (uniqueXs.length >= 3) {
    //     winner = true
    // }
    // if (uniqueYs.length >= 3) {
    //     winner = true
    // }


}

export const checkForWin = (userId: UserId, moves: Move[]): boolean => {

    const playerMoves = extractPlayersMoves(moves, userId)
    // console.log(playerMoves)

    return checkForStraightWin(playerMoves, 'horizontal')
        || checkForStraightWin(playerMoves, 'vertical')
        || checkForDiagonalWin(playerMoves)

}
