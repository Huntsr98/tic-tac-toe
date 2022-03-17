import ReactDOM from 'react-dom';
import { Board, Board as BoardComponent, Color, config, GamePiece, MaybeGamePiece, Move, Row, ServerResponse, State } from './state'
import { checkForWin, isItMyTurn, join, makeAMove } from './util';
import React, { useState } from 'react'
import axios from 'axios'


// 2/27 notes
// propDrill state from view down to clickBoardSquare
// ensure that the payload im sending to the server matches what the server is expecting (arguments of makeAMove)
// Make sure what comes back from the server matches that of the state.


const clickedBoardSquare = async (move: Move, setState: (state: State) => void, state: State): Promise<void> => {

    const gameId = state.gameId
    const userId = state.userId
    if (state.isItMyTurn) {
        const response = await axios.post('http://localhost:3000/make-a-move', { userId, gameId, move })
        const state = formState(response.data)
        setState(state)
    }


}

const BoardSquare = ({ move, setState, state }: { move: Move, setState: (state: State) => void, state: State }) => {
    const styles = {
        width: config.boardSquareWidth + 'px',
        height: config.boardSquareHeight + 'px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderColor: 'black',

    }
    const cb = () => {
        clickedBoardSquare(move, setState, state)
    }
    return <div onClick={cb} style={styles} className="boardSquare">
        {move.type}
    </div>
}

const Button = ({ cb }: { cb: () => void }) => {

    return <button onClick={cb}>
        Join
    </button>
}

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

const formState = (response: ServerResponse): State => {
    return {
        gameId: response.gameId,
        userId: response.userId,
        gamePiece: response.gamePiece,
        boardColor: Color.green,
        board: response.board,
        isItMyTurn: isItMyTurn(response.whoseTurn, response.gamePiece),
        winner: response.gamePiece
    }

}

const View = () => {
    const [state, setState] = useState<State | null>(null)
    let body

    if (state === null) {
        body = <Button cb={
            async () => {
                const response: ServerResponse = await join()
                const newState: State = formState(response) //Convert response into newState
                console.log({ response, newState })
                setState(newState)
            }
        }></Button>

    } else {
        body = <BoardComponent setState={setState} state={state}></BoardComponent>
    }

    return <div>

        {body}
    </div>
}

ReactDOM.render(<View></View>, document.getElementById('root')); //putting 'element' inside of 'root' element.  
