import ReactDOM from 'react-dom';
import { Board, Board as BoardComponent, Color, config, GamePiece, MaybeGamePiece, Move, Row, ServerResponse, State } from './state'
import { checkForWin, isItMyTurn, join } from './util';
import React, { useState } from 'react'


const BoardSquare = ({ gamePiece }: { gamePiece: MaybeGamePiece }) => {
    const styles = {
        width: config.boardSquareWidth + 'px',
        height: config.boardSquareHeight + 'px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderColor: 'black',
      
    }

    return <div  style={styles} className="boardSquare">
        {gamePiece}
    </div>
}

const Button = ({ cb }: { cb: () => void }) => {

    return <button onClick={cb}>
        Join
    </button>
}

let interval: any
const BoardComponent = ({ state }: { state: State }) => {
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
       return <RowComponent row={row}></RowComponent>
    })
    

    return <div style={{
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderColor: 'black',
        width: config.boardWidth + 'px',
        height: config.boardHeight + 'px'
    }}>
        {theBoard}
    </div>


}
const RowComponent = ({row}:{row: Row}) => {
    const theRow = row.map((maybeMove) => {

        return <BoardSquare gamePiece={maybeMove.type}></BoardSquare>
    })
    return <div style={{display: 'flex'}} className="row">
        {theRow}
    </div>
}
/*
* Description
   * Entirety of what user sees upon entering.  Top-level parent.
* Inputs
   * Full state
* Behaviors
   * Nothing
* Parent
   * None
* Children
   * Board
       * isItMyTurn
           * Pulls from server state
       * boardColor
           * Pulls from front end state
   * Button

*/
export const buildBoard = (moves: Move[]): Board => {

    const indexRowOne: Row = [
        {
            type: GamePiece.X,
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
            type: GamePiece.O,
            x: 2,
            y: 2,
        },
    ]

    const board: Board = [
        indexRowOne,
        indexRowTwo,
        indexRowThree
    ] // figure out how to swap out the moves from the index rows with the argument of this function (moves) using .map


    moves.forEach((move: Move) => {
        const x = move.x
        const y = move.y
        board[y][x] = move
    })

    return board
}

const View = () => {
    const [state, setState] = useState<State | null>(null)
    let body

    if (state === null) {
        body = <Button cb={
            async () => {
                const response: ServerResponse = await join()
                const newState: State = {
                    gameId: response.gameId,
                    userId: response.userId,
                    gamePiece: response.gamePiece,
                    boardColor: Color.green,
                    board: response.board,
                    isItMyTurn: isItMyTurn(response.whoseTurn, response.gamePiece),
                    winner: response.gamePiece
                }  //Convert response into newState
                console.log({ response, newState })
                setState(newState)
            }
        }></Button>
    } else {
        body = <BoardComponent state={state}></BoardComponent>
    }

    return <div>

        {body}
    </div>
}

ReactDOM.render(<View></View>, document.getElementById('root')); //putting 'element' inside of 'root' element.  
