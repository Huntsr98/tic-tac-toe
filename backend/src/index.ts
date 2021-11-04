import * as express from 'express'
import * as cors from 'cors'
import { v4 as uuidv4 } from 'uuid';

// import state, updateState, Action from new file called update-state?

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const port = 3000
export const logging = true
export type Logger = (...args: any[]) => void
export const logger: Logger = function (...args) {
    if (logging === true) {
        console.log(...args)
    }
}

let cache = ['hello']
const myDB = {}

const origin = `http://localhost:1234`
const corsOptions = {
    origin,
    optionsSuccessStatus: 200

}
app.use(cors(corsOptions))

//START ENDPOINTS HERE
app.post('/start', (req, res) => {
    console.log('boo')
    const gameId = req.body.userId || uuidv4()
    const userId = req.body.userId || uuidv4()

    // from the frontend: 
    //const responsePromise = axios.post<{state: BrowserState}>('http://localhost:3000/make-a-move', { stateofBoard: state.stateOfBoard, userId: state.userId, gameId: state.gameId, gamesWaitingForPlayer})

    // update the state with: 
    if (gamesWaitingForPlayer) {
        state = updateState({action: Action.start, payload: gameId})
    }

    state = updateState({action: Action.join, payload: userId})

    let gamePiece
 
    if (state.players.X === userId) {
        gamePiece = 'X'
        // is there something else to add re: which color the board is? boardColor = green here?
    } else {
        state.players.O = userId
        gamePiece = 'O'
        // boardColor = red?
    }
    
    // wipe moves
    state.stateofBoard = []

    const browserState = convertStatetoBrowserState(userId, gamePiece, state)
    res.send(browserState)
})



app.listen(port, () => {
    logger(`Example app listening on port ${port}!`)
});