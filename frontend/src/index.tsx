
import { getState, config, Goodie } from './steven/state'
import { getRandomInt } from './getRandomInt';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';


const BoardSquares = () => {

    return <div>

    </div>
}


const Board = () => {

    return <div>

    </div>
}

const View = () => {

    return <div>

        <Board>
        <BoardSquares>
            
        </BoardSquares>
        </Board>
    </div>
}

ReactDOM.render(<View></View>, document.getElementById('root')); //putting 'element' inside of 'root' element.  
