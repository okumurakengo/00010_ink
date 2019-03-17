import React, { useState, useEffect } from 'react';
import { render, Box } from 'ink';
import { range } from 'lodash';

import { NONE_COLOR, MAX_Y, MAX_X, DOWN } from './constans';
import Tetoris from './Tetoris.jsx';
import Help from './Help.jsx';
import Input from './Input.jsx';

import { 
    getRandamPiece, 
    checkTouch, 
    getInitPiecePosition, 
    getNewPieceCells, 
    getMovePiecePosition, 
    getMovePieceCells, 
    deleteRowAndGetNewCells 
} from "./lib";

const App = () => {
    // テトリスの盤面
    const [cells, setCells] = useState(range(MAX_Y).map(() => range(MAX_X).fill(NONE_COLOR)));
    // 現在落ちてきているピースの位置
    const [currentPosition, setCurrentPosition] = useState([[[MAX_Y, MAX_X]]]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            let color, piece;
            if (checkTouch(cells, currentPosition, DOWN)) {
                // 揃っている行がある場合は削除する
                setCells(deleteRowAndGetNewCells(cells));
                // 新しいピースの作成
                ({ color, piece } = getRandamPiece());
                setCurrentPosition(getInitPiecePosition(piece));
                setCells(getNewPieceCells(cells, color, getInitPiecePosition(piece)));
            } else {
                // ピースを1つ下に移動
                setCurrentPosition(getMovePiecePosition(currentPosition, DOWN));
                setCells(getMovePieceCells(cells, currentPosition, DOWN))
            }
        }, 700);
        return () => { clearTimeout(timerId) };
    }, [cells]);

    return (
        <>
            <Box justifyContent="space-around">
                <Tetoris {...{ cells }} />
                <Help />
            </Box>
            <Input {...{ cells, setCells, currentPosition, setCurrentPosition }} />
        </>
    );
}

render(<App/>);
