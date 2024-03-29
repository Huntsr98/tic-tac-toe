import { Board, Board as BoardComponent, boarderConfig, Color, config, GamePiece, MaybeGamePiece, Move, Row, ServerResponse, State } from './state'
import axios from 'axios'
import { formState, timerId } from './index'
import { changeBoarderColor } from './board-CSS'


// if (isItMyTurn(currentState) === true) {
//             clearInterval(timerId)
//             // alert(’It\‘s my turn!’)
//             // another place to tell loser they lost
//             // take out the board and message appears
//             setState(currentState)
//         }



//make get-State endpoint
export const checkIn = async (state: State, setState: (state: State) => void) => {

    const body = {
        userId: state.userId,
        gameId: state.gameId
    }

    //will we need to create "is-it-my-turn" endpoint on the backend?
    const askForState = axios.post('http://localhost:3000/get-state', body)

    const response = await askForState
    // const convertToState = formState(response)

    const currentState: State = formState(response.data)
    if (currentState.winner === null) {
        if (currentState.isItMyTurn === true) {
            clearInterval(timerId)
            // changeBoarderColor(currentState)
            setState(currentState)
        }
    } else {
        const winnerAlert = currentState.winner + ' is the winner!!'

        // alert(winnerAlert)
    }
}



// const startGame = async () => {
//         const userId = localStorage.getItem(‘userId’)
//         // call to API
//         // our response will look like: { data: BrowserState }
//         const response: JoinResponse = await axios.post(`http://localhost:3000/join`, {userId, test: true})
//         // saves userId on local storage, which we got from response.data
//         localStorage.setItem(‘userId’, response.data.userId)
//         // load response into local state
//         console.log(response.data)
//         const newState = response.data
//         setState(newState)
//         if (!isItMyTurn(newState)) {
//             clearInterval(timerId)
//             timerId = setInterval(() => {
//                 checkIn(newState)
//             }, 3000)
//         }
//     }