import ReactDOM from 'react-dom';
import { Color, config, GamePiece, Move, ServerResponse, State } from './state'
import { checkForWin, isItMyTurn, join } from './util';
import React, { useState } from 'react'


const BoardSquare = ({gamePiece}: {gamePiece: GamePiece}) => {

    return <div>
        {gamePiece}
    </div>
}

const Button = ({ cb }: { cb: () => void }) => {

    return <button onClick={cb}>
        Join
    </button>
}

let interval: any
const Board = ({ state }: { state: State }) => {
    let activeBoardColor

    if (checkForWin(state.gamePiece, state.winner) === false) {
        if (state.gamePiece === serverResponse.gamePiece) {
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
   const boardSquares = state.board.map((move: Move)  => {
       return   <BoardSquare gamePiece={move.type}></BoardSquare>
   })
   return <div style={Color =activeBoardColor}>
      X 
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
                console.log({response, newState})
                setState(newState)
            }
        }></Button>
    } else {
        body = <Board state={state}></Board>
    }

    return <div>

        {body}
    </div>
}

ReactDOM.render(<View></View>, document.getElementById('root')); //putting 'element' inside of 'root' element.  
