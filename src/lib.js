import { range, isEqual, remove, cloneDeep } from "lodash";
import { 
    INIT_Y, INIT_X, MAX_Y, MAX_X, NONE_Y, NONE_X, SQUARE, LINE, S, Z, L, T, 
    NONE_COLOR, GREEN, BLUE, RED, YELLOW, GREEN_BLIGHT, BLUE_BLIGHT, DOWN, LEFT, RIGHT
} from './constans';

/**
 * ランダムにピースを取得
 * 
 * @return {{color: number, piece: Array.<Array.<number>>}}
 */
export const getRandamPiece = () => {
    switch (Math.floor(Math.random() * 6)) {
        case SQUARE:
            return { color: GREEN, piece: [[true, true], [true, true]] };
        case LINE:
            return { color: BLUE, piece: [[true], [true], [true], [true]] };
        case S:
            return { color: RED, piece: [[false, true], [true, true], [true, false]] };
        case Z:
            return { color: YELLOW, piece: [[true, true, false], [false, true, true]] };
        case L:
            return { color: GREEN_BLIGHT, piece: [[true, false], [true, false], [true, true]] };
        case T:
            return { color: BLUE_BLIGHT, piece: [[true, true, true], [false, true, false]] };
    }
}

/**
 * ピースが壁か他のピースと隣接していたらtrue
 * 
 * @param {Array.<Array.<<number>>} cells
 * @param {Array.<Array.<<Array.<number>>>} positions
 * @param {string} type
 * @return {bool}
 */
export const checkTouch = (cells, positions, type) => {
    return positions.some(row => {
        return row.some(cell => {
            const [y, x] = cell;
            if ((y === NONE_Y) || (x === NONE_X)) {
                return false;
            }

            if ((type === DOWN) && (y >= MAX_Y)) {
                return true;
            }
            
            if ((type === LEFT) && (x <= 1)) {
                return true;
            }
            
            if (type === RIGHT && x >= MAX_X) {
                return true;
            }
            
            const isSelfPieceTouch = positions.some(tmpRow => {
                return tmpRow.some(tmpCell => {
                    const [tmpY, tmpX] = tmpCell;
                    return isEqual([type===DOWN?y+1:y, type===DOWN?x:(type===LEFT?x-1:x+1)], tmpCell)
                });
            })
            if (!isSelfPieceTouch && (cells[type===DOWN?y:y-1][type===DOWN?x-1:(type===LEFT?x-2:x)] !== NONE_COLOR)) {
                return true;
            }
        });
    })
}

/**
 * ピースの最初のポジションを設定
 * 
 * @param {Array.<Array.<number>>} piece
 */
export const getInitPiecePosition = piece => {
    return piece.map((row, i) => {
        return row.map((cell, j) => {
            return [cell ? INIT_Y + i : NONE_Y, cell ? INIT_X + j : NONE_X];
        })
    })
}

/**
 * 新しいピースが追加された時の盤面の配列を作成する
 * 
 * @param {Array.<Array.<number>>} cells 
 * @param {number} color 
 * @param {Array.<Array.<<Array.<number>>>} positions 
 */
export const getNewPieceCells = (cells, color, positions) => {
    positions.forEach(row => {
        return row.forEach(cell => {
            const [y, x] = cell;
            if (y !== NONE_Y || x !== NONE_X) {
                cells[y-1][x-1] = color;
            }
        })
    })
    return [...cells];
}

/**
 * ピースが1マス分動かして、ポジションを取得
 * 
 * @param {Array.<Array.<<Array.<number>>>} positions 
 * @param {number} type 
 * @return {Array.<Array.<<Array.<number>>>}
 */
export const getMovePiecePosition = (positions, type) => {
    return positions.map(row => {
        return row.map(cell => {
            const [y, x] = cell;
            if (y !== NONE_Y || x !== NONE_X) {
                return [type===DOWN?y+1:y, type===DOWN?x:(type===LEFT?x-1:x+1)];
            } else {
                return [NONE_Y, NONE_X];
            }
        })
    })
}

/**
 * ピースが動いた後の盤面を取得
 * 
 * @param {Array.<Array.<number>>} cells 
 * @param {Array.<Array.<<Array.<number>>>} positions 
 * @param {number} type 
 * 
 * 
 */
export const getMovePieceCells = (cells, positions, type) => {
    positions.reverse().forEach(row => {
        if (type === RIGHT) row = row.reverse();
        return row.forEach(cell => {
            const [y, x] = cell;
            if (y !== NONE_Y || x !== NONE_X) {
                const color = cells[y-1][x-1];
                cells[y-1][x-1] = NONE_COLOR;
                cells[type===DOWN?y:y-1][type===DOWN?x-1:(type===LEFT?x-2:x)] = color;
            }
        })
    })
    return [...cells];
}

/**
 * 揃った行を削除して、盤面を取得
 * 
 * @param {Array.<Array.<number>>} cells 
 */
export const deleteRowAndGetNewCells = (cells) => {
    const removed = remove(cells, row => {
        return row.every(Boolean);
    });
    range(MAX_Y - cells.length).fill(range(MAX_X).fill(NONE_COLOR)).forEach(newRow => {
        cells.unshift(newRow);
    });
    return cells;
}

/**
 * 回転可能かチェック
 * 
 * @param {Array.<Array.<number>>} cells 
 * @param {Array.<Array.<<Array.<number>>>} positions 
 * @param {number} type 
 */
export const checkRotate = (cells, positions, type) => {
    const newY = positions[0].length;
    const newX = positions.length;
    
    let findIndex;
    const [currentY, currentX] = positions[0].find((findCell, index) => {
        findIndex = index;
        const [findY, finbX] = findCell;
        return !isEqual([findY, finbX], [0, 0]);
    });

    let newPiece = range(newY).map((val, i) => {
        return range(newX).map((val, j) => {
            if (type === LEFT) {
                return positions[j].slice(-(i+1))[0].some(Boolean);
            } else {
                return positions.slice(-(j+1))[0][i].some(Boolean);
            }
        });
    }).map((row, k) => {
        return row.map((piece, l) => {
            return [piece ? currentY + k : 0, piece ? currentX + l - findIndex : 0];
        });
    });

    const exists = newPiece.some(someRow => {
        return someRow.some(someCell => {
            const [someY, someX] = someCell;
            if (someY === NONE_Y || someX === NONE_X) {
                return;
            }
            if (someY > MAX_Y || someX > MAX_X) {
                return true;
            }
            const isSelfPiece = positions.some(tmpRow => {
                return tmpRow.some(tmpCell => {
                    const [tmpY, tmpX] = tmpCell;
                    return isEqual([tmpY, tmpX], tmpCell);
                });
            });
            if (isSelfPiece) {
                return;
            }

            return !!cells[someY-1][someX-1];
        });
    });

    return { exists, newPiece }
}

/**
 * ピースを回転し、盤面を取得
 * 
 * @param {Array.<Array.<number>>} cells 
 * @param {Array.<Array.<<Array.<number>>>} positions 
 * @param {number} newPiece 
 */
export const getRotatePieceCells = (cells, positions, newPiece) => {
    const cellsCopy = cloneDeep(cells);
    const [currentY, currentX] = positions[0].find(cell => {
        const [findY, fiubX] = cell;
        return !isEqual([findY, fiubX], [0, 0]);
    });

    positions.forEach(row => {
        row.forEach(cell => {
            const [oldY, oldX] = cell;
            if (oldY !== NONE_Y || oldX !== NONE_X) {
                cellsCopy[oldY-1][oldX-1] = NONE_COLOR;
            }
        });
    });

    newPiece.forEach(row => {
        row.forEach(cell => {
            const [newY, newX] = cell;
            if (newY !== NONE_Y || newX !== NONE_X) {
                cellsCopy[newY-1][newX-1] = cells[currentY-1][currentX-1];
            }
        });
    });

    return cellsCopy;
}
