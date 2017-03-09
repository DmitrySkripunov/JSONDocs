'use strict';

import React from 'react';
import {randomString, isKeyDuplicate, isNumeric} from '../libs/parser';

let globalSchema = undefined;

class Editor extends React.Component {

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

		const onclick = evt => {
			console.log(globalSchema);
		};

		return 	<div className="results">
							{editHandler} {propsHandler} {value} {descHandler}
							{propsView}

							<div>
								<button onClick={onclick}>Save</button>
							</div>
						</div>;
	}

	_makeProps(schema) {
		const props = schema.properties;

		const p = [];

		for(let i = 0; i < props.length; i++) {
			p.push(this.makeProp(props[i], i, schema));
		}

		return <div className="props">{p}</div>;
	}

	makeProp(schema, propIndex, parent) {

		const editHandler 	= this._makeEditHandler(schema);
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


		const key = <span
									key="0"
									onKeyUp={onkeyup}
									onKeyDown={onkeydown}
									placeholder="field"
									className="editablekey"
									contentEditable
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
		const d = prop.description.replace(/(?:\r\n|\r|\n)/g, '<br />');

		const onkeyup = evt => {
			prop.description = evt.currentTarget.innerText;
		};
		return <div className="editablekey" contentEditable suppressContentEditableWarning onChange={onkeyup}>{d}</div>;
	}

	_makeEditHandler(prop) {

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
			menu.children[0].onclick = function() {

				const newProp = {
					'type': 'array',
					'title': '',
					'description': '',
					'properties': []
				};

				prop.properties.push(newProp);

				menu.style.display = 'none';

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

		};

		return <div className="edithandler"></div>;

	}

}

export default Editor;