import { Move, WhoseTurn } from "./types"

export const extractPlayersMoves = (moves, whoseTurn) => {
    const sortMoves = (move) => {
        if (moves.type === whoseTurn) {
            return move
        }
    }
    const playerMoves = moves.map(sortMoves)
    return playerMoves
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
        if (direction === 'horizontal') {
            sortBy = move.x
        } else if (direction === 'vertical') {
            sortBy = move.y
        }

        if (sortBy === 0) {
            acc.zeroes.push(0)
        } else if (sortBy === 1) {
            acc.ones.push(1)
        } else if (sortBy === 2) {
            acc.twos.push(2)
        }
        return acc
    }

    const results = playerMoves.reduce(separatedMoves, {
        zeroes: [],
        ones: [],
        twos: []
    })

    const resultsValues = Object.values(results)
    return resultsValues.some(checkLength)
}

export const checkForDiagonalWin = (playerMoves) => {
   
    // push xs into xs[]
    // push ys into ys[]
    const onlyXs = (move) => {
        return move.x
    }
    const onlyYs = (move) => {
        return move.y
    }
    const xs: [] = playerMoves.map(onlyXs)
    const ys: [] = playerMoves.map(onlyYs)

    // if length of xs is >= 3, and xs increments by one, return winner
    // if length of ys is >= 3, and ys increments by one, return winner
    const uniqueXs =  [...new Set(xs)]
    const uniqueYs =  [...new Set(ys)]

    let winner = false
    if (uniqueXs.length >= 3) {
        winner = true
    }
    if (uniqueYs.length >= 3) {
        winner = true
    }
    return winner

}

export const checkForWin = (whoseTurn: WhoseTurn, moves: Move[]): WhoseTurn | null => {

    const playerMoves = extractPlayersMoves(moves, whoseTurn)

    if (
        checkForStraightWin(playerMoves, 'horizontal')
        || checkForStraightWin(playerMoves, 'vertical')
        || checkForDiagonalWin(playerMoves)
    ) {
        return whoseTurn
    } else {
        return null
    }

}
