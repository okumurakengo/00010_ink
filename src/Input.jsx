import React, { Component } from 'react';
import { StdinContext} from 'ink';
import { checkTouch, getMovePiecePosition, getMovePieceCells, checkRotate, getRotatePieceCells } from "./lib";
import { LEFT, RIGHT } from './constans';

const ARROW_LEFT = '\u001B[D';
const ARROW_RIGHT = '\u001B[C';
const ROTATE_LEFT = "a";
const ROTATE_RIGHT = "f";

class Input extends Component {
    render() {
        return (<></>);
    }
    
    componentDidMount() {
		const { stdin, setRawMode } = this.props;

		setRawMode(true);
		stdin.on('data', this.handleInput);
	}

	componentWillUnmount() {
		const { stdin, setRawMode } = this.props;

		stdin.removeListener('data', this.handleInput);
		setRawMode(false);
    }
        
    handleInput = data => {
        const { cells, setCells, currentPosition, setCurrentPosition } = this.props,
              s = String(data)

        if (s === ARROW_LEFT) {
            if (!checkTouch(cells, currentPosition, LEFT)) {
                setCurrentPosition(getMovePiecePosition(currentPosition, LEFT));
                setCells(getMovePieceCells(cells, currentPosition, LEFT));
            }
        }
        if (s === ARROW_RIGHT) {
            if (!checkTouch(cells, currentPosition, RIGHT)) {
                setCurrentPosition(getMovePiecePosition(currentPosition, RIGHT));
                setCells(getMovePieceCells(cells, currentPosition, RIGHT));
            }
        }
        if (s === ROTATE_LEFT) {
            const { exists, newPiece } = checkRotate(cells, currentPosition, LEFT);
            if (!exists) {
                setCurrentPosition(newPiece);
                setCells(getRotatePieceCells(cells, currentPosition, newPiece));
            }
        }
        if (s === ROTATE_RIGHT) {
            const { exists, newPiece } = checkRotate(cells, currentPosition, RIGHT);
            if (!exists) {
                setCurrentPosition(newPiece);
                setCells(getRotatePieceCells(cells, currentPosition, newPiece));
            }
        }
    }
}

export default class InputDefault extends Component {
    render() {
		return (
            <StdinContext.Consumer>
                {({ stdin, setRawMode }) => (
                    <Input {...this.props} stdin={stdin} setRawMode={setRawMode} />
                )}
            </StdinContext.Consumer>
		);
    }
}

