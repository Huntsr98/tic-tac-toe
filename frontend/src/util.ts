import axios from 'axios'
import { formState } from '.'
import { checkIn } from './checkIn'
import { config, State, Env, GamePiece, Color, ServerResponse, UserId, GameId, Move, MaybeGamePiece } from './state'


export const checkForWin = (gamePiece: GamePiece, winner: MaybeGamePiece): boolean => {
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

export let timerId: number  // need to come back and Type
export const startPolling = (setState: (state: State) => void, state: State) => {
    timerId = setInterval(() => { checkIn(state, setState) }, 3000)
}


export const join = async (setState: (state: State) => void): Promise<void> => {
    const userId = localStorage.getItem('userId')
    const response = await axios.post<ServerResponse>(getUrlJoin(), { userId }) //alternative to {userId: userId}
    // await halts the program until line 21 is completed, ie: until the server has replied

    const x = response.data.userId
    localStorage.setItem('userId', x)

    const newState: State = formState(response.data) //Convert response into newState
    console.log({ response, newState })
    setState(newState)

    if (response.data.gamePiece !== response.data.whoseTurn) {
        startPolling(setState, newState)
    }
}

//EMILY

export const forfeit = async (userId: UserId, gameId: GameId): Promise<ServerResponse> => {
    // call to new endpoint that steve is making

    const response = await axios.post('http://localhost:3000/forfeit', { userId, gameId })

    return response.data
    // response.data is the new games state
}


export const makeAMove = async (userId: UserId, gameId: GameId, move: Move): Promise<ServerResponse> => {

    const response = await axios.post('http://localhost:3000/make-a-move', { userId, gameId, move })
    return response.data
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