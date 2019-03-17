import React, { Component } from 'react';
import Cell from './Cell.jsx';

export default ({ row }) => {
	return (
		<>
			|
			{row.map((color, i) => {
				return (<Cell color={color} key={i} />)
			})}
			|
		</>
	);
}
