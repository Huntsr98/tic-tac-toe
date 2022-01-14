import axios from 'axios'
import { config, State, Env, GamePiece, Color, ServerResponse } from './state'

export const checkForWin = (gamePiece: GamePiece, winner: GamePiece | null): boolean => {
    return gamePiece === winner
}

const getUrl = (env: Env, endpoint: string) => {
    let domain
    if (env === Env.dev) {
        domain = `http://localhost:${config.port}`
    } else {
        domain = 'http://ourdomain.com'
    }
    return `${domain}${endpoint}`
}
const getUrlJoin = () => {
    return getUrl(config.env, config.api.join)
}
export const isItMyTurn = (whoseTurn: GamePiece, gamePiece: GamePiece): boolean => {
    return whoseTurn === gamePiece
}

export const join = async (): Promise<ServerResponse> => {
    const userId = localStorage.getItem('userId')
    const response = await axios.post(getUrlJoin(), { userId }) //alternative to {userId: userId}
    // await halts the program until line 21 is completed, ie: until the server has replied
    const x = response.data.userId
    localStorage.setItem('userId', x)

    return response.data
    // response.data is the new games state
}

/**
 * userJoin
    * Get userId from local storage
    * Call to join endpoint.  Include userId if found
    * Receives the response
        * Get your userId in response
        * Current state of board
        * Player type
        * gameId
    * Save userId local storage
    * return the response
*/