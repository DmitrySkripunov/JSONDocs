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

		this.makeProp 					= this.makeProp.bind(this);
		this._makePropsHandler 	= this._makePropsHandler.bind(this);
		this._makeDescHandler 	= this._makeDescHandler.bind(this);
		this._makeDescription 	= this._makeDescription.bind(this);
		this._makeValue 				= this._makeValue.bind(this);
	}

	render() {

		if(this.props.schema === undefined || this.props.schema.type === undefined) return null;

		const editHandler 	= null;
		const propsHandler 	= this._makePropsHandler(this.props.schema);
		const descHandler 	= this._makeDescHandler(this.props.schema);
		const propsView 		= this.props.schema.properties !== undefined ? this._makeProps(this.props.schema) : null;
		let value						= this.props.schema.type === 'object' ? `Object {${this.props.schema.properties.length}}` : `Array [${this.props.schema.properties.length}]`;
		value = <span className="key-postfix">{value}</span>;

		return 	<div className="results">
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}
						</div>;
	}

	_makeProps(schema, level = 1) {
		const props = schema.properties;
		const style = {marginLeft: `${level * 15}px`};

		const p = [];

		for(let i = 0; i < props.length; i++) {
			p.push(this.makeProp(props[i], ++level, i));
		}

		return <div className="props" style={style}>{p}</div>;
	}

	makeProp(schema, level, propIndex) {

		const editHandler 	= null;
		const propsHandler 	= this._makePropsHandler(schema);
		const descHandler 	= this._makeDescHandler(schema);
		const propsView 		= schema.properties !== undefined ? this._makeProps(schema) : null;
		const value					= this._makeValue(schema, propIndex);

		return 	<div key={propIndex} className="prop">
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}
						</div>;
	}

	_makeValue(schema, propIndex) {
		let key = undefined;
		/*if(schema.type !== 'array') {
			key.contentEditable = true;
			key.setAttribute('placeholder', '(empty string)');
			key.className = 'editablekey';
			key.onkeyup = function (evt) {
				if(_isKeyDuplicate(evt.currentTarget.innerText, schema.properties, i)){
					key.title = 'The key is duplicated!';
					key.classList.add('keyerror');
				}else {
					key.classList.remove('keyerror');
					key.title = '';
				}
				prop.title = evt.currentTarget.innerText;
			};

			key.onkeydown = function(evt){
				if(evt.keyCode === 13){
					evt.preventDefault();
				}
			};
		} else {
			key = <span>{(schema.type !== 'array') ? schema.title : i}</span>;
		}*/

		/*propNode.appendChild(key);

		const postfix = document.createElement('span');
		postfix.className = 'key-postfix';

		*/

		key = <span key="0" className="editablekey">{schema.title !== undefined ? schema.title : propIndex}</span>;

		let postfixValue = undefined;
		if(schema.type === 'object' && !schema.hasOwnProperty('default')) {
			postfixValue = ` {${schema.properties.length}}`;
		}	else if(schema.type === 'array' && !schema.hasOwnProperty('default')) {
			postfixValue = ` [${schema.properties.length}]`;
		} else {
			postfixValue = ' : ';
		}
		const postfix = <span key="1" className="key-postfix">{postfixValue}</span>;

		let value = null;
		if(!((schema.type === 'object' || schema.type === 'array') && !schema.hasOwnProperty('default'))) {

			const cl = schema.type === 'object' ? 'null' : schema.type;

			const className = `${cl} editablekey`;

			const valueValue = (schema.default === null) ?  'null' : schema.default;

			value = <span key="2" className={className}>{valueValue}</span>;
		}


		return [key, postfix, value];
	}

	_makePropsHandler(prop) {
		if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {

			const id = randomString();

			return [
				<input key="0" type="checkbox" className="jhtml-view-switcher" id={`jhtml-view-switcher-${id}`} />,
				<label key="1" htmlFor={`jhtml-view-switcher-${id}`} />
			];

		} else {
			return null;
		}
	}

	_makeDescHandler(prop) {
		const desc = this._makeDescription(prop);

		return <div className="desc-handler">?<div className="desc">{desc}</div></div>;
	}

	_makeDescription(prop) {
		const d = prop.description.replace(/(?:\r\n|\r|\n)/g, '<br />');

		const onkeyup = evt => {
			prop.description = evt.currentTarget.innerText;
		};
		return <div className="editablekey" contentEditable suppressContentEditableWarning onChange={onkeyup}>{d}</div>;
	}

}

export default Editor;