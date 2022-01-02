import ReactDOM from 'react-dom';
import { Color, config, isItMyTurn, State } from './state'
import { checkForWin, join } from './util';
import React, {useState} from 'react'


const BoardSquares = () => {

    return <div>

    </div>
}

const Button = ({ cb }) => {

    return <button onClick={cb}>
        Join
    </button>
}
// HW 12/15 - make the board
let interval: any
const Board = ({ state  }:{state: State}) => {
    let activeBoardColor

    if (checkForWin() === `false`) {

        if (state.isItMyTurn === `true`) {
            activeBoardColor = state.boardColor.green
        } else {
            activeBoardColor = state.boardColor.red
        }
    } else {
        // figure out how to make board flash for win
        const [state, setState] = useState<State>(null)
        interval = setInterval(() => {
           if (state.boardColor === 'gold') {
            activeBoardColor= state.boardColor.grey
           } else {
            activeBoardColor= state.boardColor.gold
           }

        }, 100)
        
    }
    return <div color={activeBoardColor}>
        <BoardSquares>

        </BoardSquares>
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
                const state: State = await join()

                setState(state)
            }
        }>
        </Button>
    } else {
        body = <Board state={state}></Board>
    }

    return <div>

        {body}
    </div>
}

ReactDOM.render(<View></View>, document.getElementById('root')); //putting 'element' inside of 'root' element.  
