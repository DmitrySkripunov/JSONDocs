'use strict';

import React from 'react';
import {randomString} from '../libs/parser';

class Editor extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	constructor(props) {
		super(props);
		this.state = {
		};

		this.makeProp = this.makeProp.bind(this);
		this.nop = this.nop.bind(this);
	}

	render() {

		if(this.props.schema === undefined || this.props.schema.type === undefined) return null;

		const editHandler 	= null;
		const propsHandler 	= this._makePropsHandler(this.props.schema);
		const descHandler 	= null;
		const propsView 		= null;
		let value						= this.props.schema.type === 'object' ? `Object {${this.props.schema.properties.length}}` : `Array [${this.props.schema.properties.length}]`;
		value = <span className="key-postfix">{value}</span>;

		return 	<div className="results">
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}
						</div>;
	}

	makeProp(schema, isRoot = true, level = 1, parent) {

		const editHandler 	= null;
		const propsHandler 	= this._makePropsHandler(schema);
		const descHandler 	= null;
		const propsView 		= null;
		const value					= 'asdas';

		return 	<div>
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}
						</div>;
	}

	_makePropsHandler(prop) {
		if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {

			const id = randomString();

			return <span>
				<input type="checkbox" className="jhtml-view-switcher" id={`jhtml-view-switcher-${id}`} />
				<label htmlFor={`jhtml-view-switcher-${id}`} />
			</span>;

		} else {
			return null;
		}
	}

	nop() {}

}

export default Editor;

		/*
		 _makePropsHandler(prop) {
		 if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {

		 return null;
		 const id = randomString();

		 const switcher = document.createElement('input');
		 switcher.type 			= 'checkbox';
		 switcher.className 	= 'jhtml-view-switcher';
		 switcher.id					= `jhtml-view-switcher-${id}`;
		 propNode.appendChild(switcher);

		 const switcherLabel = document.createElement('label');
		 switcherLabel.setAttribute('for', `jhtml-view-switcher-${id}`);
		 propNode.appendChild(switcherLabel);

		 } else {
		 return null;
		 }

		 }
		 */