import ReactDOM from 'react-dom';
import { Board, Board as BoardComponent, boarderConfig, Color, config, GamePiece, MaybeGamePiece, Move, Row, ServerResponse, State } from './state'
import { checkForWin, forfeit, isItMyTurn, join, makeAMove, startPolling } from './util';
import React, { useState } from 'react'
import axios from 'axios'
import { checkIn } from './checkIn'
import { changeBoarderColor } from './board-CSS'

// 4/27 - what to do if theres a winner!
// 2/27 notes
// propDrill state from view down to clickBoardSquare
// ensure that the payload im sending to the server matches what the server is expecting (arguments of makeAMove)
// Make sure what comes back from the server matches that of the state.





const clickedBoardSquare = async (move: Move, setState: (state: State) => void, state: State): Promise<void> => {

    if (!state.isItMyTurn) {
        console.log('wasn\'t players turn')
        return
    }
    let conflictingMove = state.board.some((boardMove: Move) => {
        if (move.x === boardMove.x && move.y === boardMove.y) {
            return true  // .some is a testing method to determin if any items in an array meet the criteria of the CB function
        }
    })
    if (conflictingMove) {
        console.log('move already occupied')
        return
    }
    // if (state.winner) {
    //     console.log('winner!')
    //     return
    // }
    const gameId = state.gameId
    const userId = state.userId

    const responseData = await makeAMove(userId, gameId, move)//await axios.post('http://localhost:3000/make-a-move', { userId, gameId, move })

    setState(formState(responseData))
    // boardSquareImage(state)
    // timerId = setInterval(() => { checkIn(state, setState) }, 3000)
    startPolling(setState, state)

}



const BoardSquare = ({ move, setState, state }: { move: Move, setState: (state: State) => void, state: State }) => {

    const styles = {
        width: config.boardSquareWidth + 'px',
        height: config.boardSquareHeight + 'px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderColor: changeBoarderColor(state),
        //backgroundImage: boardSquareImage()
    }
    const cb = () => {
        clickedBoardSquare(move, setState, state)
    }
    return <div onClick={cb} style={styles} className="boardSquare">
        {/* <img src={styles.backgroundImage} ></img> */}
        {move.type}
    </div>
}

const Button = ({ cb, buttonText }: { cb: () => void, buttonText: string }) => {

    return <button onClick={cb}>
        {buttonText}
    </button>
}

//EMILY
// const StartNewGameButton = ({ cb }: { cb: () => void }) => {

//     return <button onClick={cb}>
//         Start New Game
//     </button>
// }

let interval: any
const BoardComponent = ({ state, setState }: { state: State, setState: (state: State) => void }) => {
    let activeBoardColor

    if (checkForWin(state.gamePiece, state.winner) === false) {
        if (state.isItMyTurn) {
            activeBoardColor = Color.green
        } else {
            activeBoardColor = Color.red
        }
    } else {
        // figure out how to make board flash for win

        interval = setInterval(() => {
            if (state.boardColor === 'gold') {
                activeBoardColor = Color.grey
            } else {
                activeBoardColor = Color.gold
            }

        }, 1000)

    }
    const board = buildBoard(state.board)

    const theBoard = board.map((row) => {
        return <RowComponent state={state} setState={setState} row={row}></RowComponent>
    })


    return <div style={{
        // border: '1px solid rgba(0, 0, 0, 0.05)',
        // borderColor: 'black',
        width: config.boardWidth + 'px',
        height: config.boardHeight + 'px'
    }}>
        {theBoard}
    </div>


}
const RowComponent = ({ row, setState, state }: { row: Row, setState: (state: State) => void, state: State }) => {
    const theRow = row.map((maybeMove) => {

        return <BoardSquare state={state} setState={setState} move={maybeMove}></BoardSquare>
    })
    return <div style={{ display: 'flex' }} className="row">
        {theRow}
    </div>
}



export const buildBoard = (moves: Move[]): Board => {

    const indexRowOne: Row = [
        {
            type: null,
            x: 0,
            y: 0,
        },
        {
            type: null,
            x: 1,
            y: 0,
        },
        {
            type: null,
            x: 2,
            y: 0,
        },
    ]
    const indexRowTwo: Row = [
        {
            type: null,
            x: 0,
            y: 1,
        },
        {
            type: null,
            x: 1,
            y: 1,
        },
        {
            type: null,
            x: 2,
            y: 1,
        },
    ]
    const indexRowThree: Row = [
        {
            type: null,
            x: 0,
            y: 2,
        },
        {
            type: null,
            x: 1,
            y: 2,
        },
        {
            type: null,
            x: 2,
            y: 2,
        },
    ]

    const board: Board = [
        indexRowOne,
        indexRowTwo,
        indexRowThree
    ]

    moves.forEach((move: Move) => {
        const x = move.x
        const y = move.y
        board[y][x] = move
    })

    return board
}

export const formState = (response: ServerResponse): State => {
    return {
        gameId: response.gameId,
        userId: response.userId,  //this can be viewed by the user...  Possible security threat?
        gamePiece: response.gamePiece,
        boardColor: Color.green,
        board: response.board,
        isItMyTurn: isItMyTurn(response.whoseTurn, response.gamePiece),
        winner: response.winner
    }

}

export const View = () => {
    const [state, setState] = useState<State | null>(null)
    let body

    if (state === null) {
        body = <Button
            cb={
                async () => {
                    join(setState)
                }
            }
            buttonText='Join'
        ></Button>

    } else {
        // add Join New Game button here
        // does it do the same as Button, but with different text? 
        body = <div>
            {/* EMILY - find new game w/ same userId but not this  */}
            <Button
                cb={
                    () => {
                        forfeit(state.userId, state.gameId)
                    }
                }
                buttonText='Forfeit'
            ></Button>
            <BoardComponent setState={setState} state={state}></BoardComponent>
        </div>
    }

    return <div>
        {body}
    </div>
}

ReactDOM.render(<View></View>, document.getElementById('root')); //putting 'element' inside of 'root' element.  
