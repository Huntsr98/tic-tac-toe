import { config } from "./state"
import { Move, State } from "./state"


const boardSquareImage = (move: Move): string => {
    let backgroundImage
    if (move.type === null) {
        backgroundImage = ''
    } else if (move.type === "X") {
        backgroundImage = 'http://clipart-library.com/new_gallery/203-2034970_x-marks-the-spot-clip-art.png'
    } else {
        backgroundImage = 'https://mpng.subpng.com/20180618/wv/kisspng-letter-case-o-english-alphabet-letter-background-5b27f98b6060c5.2419665115293464433948.jpg'
    }
    return backgroundImage
}

let activeBoarderColor: string

export const changeBoarderColor = (activeState: State): string => {
    
    const winnerColorChange = () => {
        activeBoarderColor = config.boarderColor.winFlashOne
        if (activeBoarderColor = config.boarderColor.winFlashOne) {
            activeBoarderColor = config.boarderColor.winFlashTwo
        } else {
            activeBoarderColor = config.boarderColor.winFlashOne
        }
    }
    
    if (activeState.winner === null) {
        if (activeState.isItMyTurn) {
            activeBoarderColor = config.boarderColor.myTurn
        } else {
            activeBoarderColor = config.boarderColor.notMyTurn
        }
    } else {
        setInterval(() => winnerColorChange(), 1000)
    }

    return activeBoarderColor
}

// when there's a winner, losing side doesn't update to display winners final move.
// border colors not changing /flashing when there is a winner.
// need to replace the alert when there's a winner
// - change the pop up to give options to start a new game?
// nothing on each users end tells them what game piece they are.
//
// 