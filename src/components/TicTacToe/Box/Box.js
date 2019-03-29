import React from 'react';
import classes from './Box.module.css';

function Box(props) {
	return (
		<div className={classes.box} onClick={props.onClick}>
			{props.value}
		</div>
	);
}

export default Box;
