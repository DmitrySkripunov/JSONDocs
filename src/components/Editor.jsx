﻿'use strict';

import React, {Component} from 'react';
import {randomString, isKeyDuplicate, isNumeric, makeJSON} from '../libs/parser';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';

let globalSchema = undefined;

class Editor extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	constructor(props) {
		super(props);
		this.state = {
			schema: this.props.schema
		};

		this.makeProp 					= this.makeProp.bind(this);
		this._makePropsHandler 	= this._makePropsHandler.bind(this);
		this._makeDescHandler 	= this._makeDescHandler.bind(this);
		this._makeDescription 	= this._makeDescription.bind(this);
		this._makeValue 				= this._makeValue.bind(this);
		this._makeEditHandler 	= this._makeEditHandler.bind(this);
	}

	render() {

		if(this.props.schema === undefined || this.props.schema.type === undefined) return null;

		globalSchema = this.props.schema;

		const editHandler 	= this._makeEditHandler(globalSchema);
		const propsHandler 	= this._makePropsHandler(globalSchema);
		const descHandler 	= this._makeDescHandler(globalSchema);
		const propsView 		= globalSchema.properties !== undefined ? this._makeProps(globalSchema) : null;
		let value						= globalSchema.type === 'object' ? `Object {${globalSchema.properties.length}}` : `Array [${globalSchema.properties.length}]`;
		value = <span className="key-postfix">{value}</span>;

		const _self = this;
		const onclick = evt => {
			const errors = document.querySelectorAll('.keyerror');
			if(errors.length <= 0) {
				_self.props.onSave(globalSchema);
			} else {
				alert('JSON has errors!');
			}
		};

		const onrootclick = _ => {
			const menu = document.querySelector('#edit-menu');
			menu.style.display = 'none';
		};

		return 	<div className="results" onClick={onrootclick}>
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}

							<div className="edit-btns">
								<button onClick={onclick}>Save</button>
							</div>
						</div>;
	}

	_makeProps(schema) {
		const props = schema.properties;

		const cs = classnames('props', {
			'empty-object' : props.length <= 0
		});

		let p = schema.type === 'object' ? '(empty object)' : '(empty array)';

		if(props.length > 0)
			p = [];

		for(let i = 0; i < props.length; i++) {
			p.push(this.makeProp(props[i], i, schema));
		}


		return <div className={cs}>{p}</div>;
	}

	makeProp(schema, propIndex, parent) {

		const editHandler 	= this._makeEditHandler(schema, propIndex, parent);
		const propsHandler 	= this._makePropsHandler(schema);
		const descHandler 	= this._makeDescHandler(schema);
		const propsView 		= schema.properties !== undefined ? this._makeProps(schema) : null;
		const value					= this._makeValue(schema, propIndex, parent);

		return 	<div key={propIndex} className="prop">
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}
						</div>;
	}

	_makeValue(schema, propIndex, parent) {

		const _self = this;
		const onkeyup = evt => {
			if(isKeyDuplicate(evt.currentTarget.innerText, parent.properties, propIndex)) {
				evt.currentTarget.title = 'The key is duplicated!';
				evt.currentTarget.classList.add('keyerror');
			} else {
				evt.currentTarget.classList.remove('keyerror');
				evt.currentTarget.title = '';
			}
			schema.title = evt.currentTarget.innerText;
			_self.setState({schema: globalSchema});
		};

		const onkeydown = evt => {
			if(evt.keyCode === 13) {
				evt.preventDefault();
			}
		};

		let cs = parent.type !== 'array' ? 'editablekey' : '';
		let title = '';
		if(schema.title !== undefined && isKeyDuplicate(schema.title, parent.properties, propIndex)) {
			title = 'The key is duplicated!';
			cs += ' keyerror';
		}


		const key = <span
									key="0"
									onKeyUp={onkeyup}
									onKeyDown={onkeydown}
									placeholder="field"
									className={cs}
									title={title}
									contentEditable={parent.type !== 'array'}
									suppressContentEditableWarning >

										{schema.title !== undefined ? schema.title : propIndex}

								</span>;

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

			const onkeyup = evt => {
				const putValue =  evt.currentTarget.innerText;
				/**
				 * value can be: number, or boolean, or string, or null
				 * @type {string}
				 */
				if(putValue === 'null') {
					schema.default = null;
					schema.type = 'object';
				} else if(putValue === 'true' || putValue === 'false') {
					schema.default = putValue === 'true';
					schema.type = 'boolean';
				}	else if(isNumeric(putValue)) {
					schema.default = parseFloat(putValue);
					schema.type = 'number';
				}	else {
					schema.default = putValue;
					schema.type = 'string';
				}

				_self.setState({schema: globalSchema});

				//const cl = schema.type === 'object' ? 'null' : schema.type;
				//evt.currentTarget.className = `${cl} editablekey`;
			};

			const onkeydown = evt => {
				if(evt.keyCode === 13) {
					evt.preventDefault();
				}
			};

			value = <span
								key="2"
								className={className}
								onKeyUp={onkeyup}
								onKeyDown={onkeydown}
								placeholder="value"
								contentEditable
								suppressContentEditableWarning >

									{valueValue}

							</span>;
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
		const _self = this;
		const onchange = evt => {
			prop.description = evt.target.value;
			_self.setState({schema: globalSchema});
		};


		return <Textarea style={{width: '95%'}} value={prop.description} onChange={onchange} />;

	}

	_makeEditHandler(prop, propIndex, parent) {

		const _self = this;
		const onclick = function(evt) {

			evt.stopPropagation();

			const menu = document.querySelector('#edit-menu');

			menu.style.display = 'block';
			menu.style.left = `${evt.currentTarget.offsetLeft}px`;
			menu.style.top = `${evt.currentTarget.offsetTop}px`;

			/**
			 * <li>Insert Array</li>
			 <li>Insert Object</li>
			 <li>Insert Value</li>
			 <li>Duplicate</li>
			 <li>Remove</li>
			 */
			//Insert array
			menu.children[0].onclick = function() {

				const newProp = {
					'type': 'array',
					'title': prop.type === 'array' ? undefined : '',
					'description': '',
					'properties': []
				};

				prop.properties.push(newProp);

				update();
			};

			//Insert object
			menu.children[1].onclick = function() {

				const newProp = {
					'type': 'object',
					'title': prop.type === 'array' ? undefined : '',
					'description': '',
					'properties': []
				};

				prop.properties.push(newProp);

				update();
			};

			//Insert value
			menu.children[2].onclick = function() {

				const newProp = {
					'type': 'object',
					'title': prop.type === 'array' ? undefined : '',
					'default': '',
					'description': ''
				};

				prop.properties.push(newProp);

				update();
			};

			//Duplicate
			menu.children[3].onclick = function() {

				parent.properties.splice(propIndex, 0, JSON.parse(JSON.stringify(prop)));

				update();
			};

			//Remove
			menu.children[4].onclick = function() {

				parent.properties.splice(propIndex, 1);

				menu.style.display = 'none';

				_self.setState({schema: globalSchema});
			};

			if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
				menu.children[0].style.display = 'block';
				menu.children[1].style.display = 'block';
				menu.children[2].style.display = 'block';
			} else {
				menu.children[0].style.display = 'none';
				menu.children[1].style.display = 'none';
				menu.children[2].style.display = 'none';
			}

			menu.children[4].style.display = (parent === undefined) ? 'none' : 'block';
			menu.children[3].style.display = (parent === undefined) ? 'none' : 'block';

			function update() {
				menu.style.display = 'none';

				_self.setState({schema: globalSchema});
			}

		};

		return <div className="edithandler" onClick={onclick}></div>;

	}

}

export default Editor;