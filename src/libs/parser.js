/**
 * Created by dmitry on 23.02.17.
 */
'use strict';

/**
 * Все хранится в джейсон схеме
 * джейсон схема компилится в джейсон и хтмл
 * Можно загружать джейсон
 */

/**
 *
 * object or array (including null)
 * values:
 *  - string
 *  - number
 *  - true/false (boolean)
 *
 */

/**
 *
 * schema
 *  - title
 *  - type
 *  - default
 *  - description
 *  - properties
 *
 *
 */
export function parser(json, desc){
	const schema = {
		"title": "Schema",
		"type": null,
		"description": ""
	};

	try {
		json = JSON.parse(json);
	}catch(ex){
		return null;
	}

	schema.description = desc.toString();

	if (Array.isArray(json)) {
		schema.type = "array";
		schema.properties = [];
		json.forEach((p, i) => {
			schema.properties.push(_convertProperty(p));
		});
	}
	else {
		schema.properties = [];
		schema.type = "object";
		for (let key in json) {
			schema.properties.push(_convertProperty(json[key], key));
		}
	}

	return schema;
}

/**
 *
 * @param prop
 * @param propName if propName is undefined, then it prop is array item
 * @returns
 * @private
 */
export function _convertProperty(prop, propName){
	const cProp = {
		'description': ''
	};

	if(propName !== undefined){
		cProp.title = propName;
	}

	if(typeof prop === 'object'){
		if(Array.isArray(prop)){
			cProp.type = 'array';
			cProp.properties = [];
			prop.forEach((p, i) => {
				cProp.properties.push(_convertProperty(p));
		});
		}
		else {
			cProp.type = 'object';
			if(prop === null){
				cProp.default = prop;
			}
			else{
				cProp.properties = [];
				for(let key in prop){
					cProp.properties.push(_convertProperty(prop[key], key));
				}
			}
		}

	}
	else{
		cProp.type = typeof prop;
		cProp.default = prop;
	}

	return cProp;
}

export function makeJSON(schema){
	let json = null;
	if(schema.type === 'object'){
		json = {};
		schema.properties.forEach((item) => {
			json[item.title] = _makeJSONProp(item);
		});
	}
	else{
		json = [];
		schema.properties.forEach((item) => {
			json.push(_makeJSONProp(item));
		});
	}

	return json;
}

export function _makeJSONProp(prop){
	let p = null;

	if(prop.type === 'object' && prop.hasOwnProperty('default')){
		p = prop.default;
	}
	else if(prop.type === 'object'){
		p = {};
		prop.properties.forEach((item) => {
			p[item.title] = _makeJSONProp(item);
		});
	}
	else if(prop.type === 'array') {
		p = [];
		prop.properties.forEach((item) => {
			p.push(_makeJSONProp(item));
		});
	}
	else{
		p = prop.default;
	}

	return p;
}

export function _randomString(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

export function syntaxHighlight(json) {
	if (typeof json != 'string') {
		json = JSON.stringify(json, undefined, 2);
	}
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		var cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});
}

export function makeHTML(schema, isRoot = true){
	let html = '';

	const date = _randomString();

	if(schema.type === 'object' && schema.hasOwnProperty('default')){
		html += schema.default;
	}
	else if(schema.type === 'object' || schema.type === 'array'){

		if(!isRoot) {
			html += `<input type="checkbox" class="table-view-switcher" id="switcher-${date}">`;
			html += `<label for="switcher-${date}" class="${isRoot ? 'root' : ''}"></label>`;
		}

		html += `<table class="object ${!isRoot ? 'hide' : ''}" cellpadding="0" cellspacing="0" >`;

		html += '<tr>';
		html += `<td class="object-header" colspan="2">${(schema.type === 'object') ? 'Object' : 'Array'} {${schema.properties.length}}</td>`;
		html += `<td>${schema.description}</td>`;
		html += `</tr>`;

		html += '<tr class="header">';
		html += `<td>${schema.type === 'array' ? 'Item #' : 'Key'}</td>`;
		html += '<td>Value</td>';
		html += '<td>Description</td>';
		html += '</tr>';

		schema.properties.forEach((prop, i) => {
			html += `<tr class="row"><td class="object-key">${(schema.type === 'object') ? prop.title : i}</td>`;
			html += `<td class="object-value">${makeHTML(prop, false)}</td>`;
			html += `<td class="object-description">${prop.description}</td>`;
			html += `</tr>`;
		});

		html +='</table>';

	}
	else{
		html += schema.default;
	}


	return html;
}

export function makeJHTML(schema, isRoot = true, level = 1){
	let html = '';

	if((schema.type === 'object' || schema.type === 'array') && !schema.hasOwnProperty('default')){

		if(isRoot) {
			html += `<span class="key-postfix">${(schema.type === 'object') ? `Object {${schema.properties.length}}` : `Array [${schema.properties.length}]`}</span>`;
			html += _makeDescHandler(schema);

			_makeEditMenu();
		}

		html += `<div class="prop" style="margin-left:${level*10}px">`;

		++level;
		schema.properties.forEach((prop, i) => {
			html += `<div style="margin: 15px 0;">`;

			if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
				const id = _randomString();
				html += `<input type="checkbox" class="jhtml-view-switcher" id="jhtml-view-switcher-${id}"/>`;
				html += `<label for="jhtml-view-switcher-${id}"></label>`;
			}


			let v = (schema.type === 'object') ? prop.title : i;
			let cl = '';
			if(v === ''){
				cl += ' empty';
				v = '(empty string)';
			}
			html += `<span class="${cl}">${v}</span>`;

			if(prop.type === 'object' && !prop.hasOwnProperty('default')){
				html += ` <span class="key-postfix">{${prop.properties.length}}</span>`;
			}
			else if(prop.type === 'array' && !prop.hasOwnProperty('default')){
				html += ` <span class="key-postfix">[${prop.properties.length}]</span>`;
			}else {
				html += ` <span class="key-postfix">:</span> `;
			}

			if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
				html += _makeDescHandler(prop);
			}

			html += makeJHTML(prop, false, level);
			html += `</div>`;
		});

		html += `</div>`;

		/*if(isRoot)
			html += `<div>${(schema.type === 'object') ? '}' : ']'}</div>`;*/

	}
	else{
		let cl = schema.type === 'object' ? 'null' : schema.type;
		let v = schema.default;
		if(schema.default === ''){
			cl += ' empty';
			v = '(empty string)';
		}
		
		html += `<span class="${cl}">${v}</span>`;
		html += _makeDescHandler(schema);
	}

	function _makeDescHandler(prop){
		let html = '';
		html += `<div class="desc-handler">?`;
		html += `<div class="desc">${_makeDescription(prop)}</div>`;
		html += `</div>`;
		return html;
	}

	function _makeDescription(prop){
		return prop.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
	}

	return html;
}

export function makeEditableJHTML(schema, isRoot = true, level = 1, parent){
	let html;
	if(parent !== undefined){
		html = parent;
	}
	else{
		html = document.createElement('div');
		html.className = 'editmode';
	}

	if((schema.type === 'object' || schema.type === 'array') && !schema.hasOwnProperty('default')){

		if(isRoot) {

			html.appendChild(_makeEditHandler(schema, level, html));

			const postfix = document.createElement('span');
			postfix.className = 'key-postfix';
			postfix.innerHTML = (schema.type === 'object') ? `Object {${schema.properties.length}}` : `Array [${schema.properties.length}]`;
			html.appendChild(postfix);
			html.appendChild(_makeDescHandler(schema));
		}

		const propBlock = document.createElement('div');
		propBlock.className = 'prop';
		propBlock.style = `margin-left:${level*10}px`;

		++level;
		schema.properties.forEach((prop, i) => {
			const propNode = document.createElement('div');
			propNode.style = "margin: 15px 0;";

			propNode.appendChild(_makeEditHandler(prop, level, propNode));

			if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
				const id = _randomString();

				const switcher = document.createElement('input');
				switcher.type 			= 'checkbox';
				switcher.className 	= 'jhtml-view-switcher';
				switcher.id					= `jhtml-view-switcher-${id}`;
				propNode.appendChild(switcher);

				const switcherLabel = document.createElement('label');
				switcherLabel.setAttribute('for', `jhtml-view-switcher-${id}`);
				propNode.appendChild(switcherLabel);
			}

			const key = document.createElement('span');
			if(schema.type !== 'array') {
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
			}
			key.innerHTML = `${(schema.type === 'object') ? prop.title : i}`;

			propNode.appendChild(key);

			const postfix = document.createElement('span');
			postfix.className = 'key-postfix';

			if(prop.type === 'object' && !prop.hasOwnProperty('default')){
				postfix.innerHTML = ` {${prop.properties.length}}`;
			}
			else if(prop.type === 'array' && !prop.hasOwnProperty('default')){
				postfix.innerHTML = ` [${prop.properties.length}]`;
			}else {
				postfix.innerHTML = ` : `;
			}

			propNode.appendChild(postfix);


			if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
				propNode.appendChild(_makeDescHandler(prop));
			}

			makeEditableJHTML(prop, false, level, propNode);

			propBlock.appendChild(propNode);
		});

		html.appendChild(propBlock);

	}
	else{
		let cl = schema.type === 'object' ? 'null' : schema.type;

		const value = document.createElement('span');
		value.className = cl + ' editablekey';
		value.contentEditable = true;
		value.setAttribute('placeholder', '(empty string)');
		value.onkeyup = function(evt){
			const putValue =  evt.currentTarget.innerText;
			/**
			 * value can be: number, or boolean, or string, or null
			 * @type {string}
			 */
			if(putValue === 'null'){
				schema.default = null;
				schema.type = 'object';
			}
			else if(putValue === 'true' || putValue === 'false'){
				schema.default = putValue === 'true';
				schema.type = 'boolean';
			}
			else if(isNumeric(putValue)){
				schema.default = parseFloat(putValue);
				schema.type = 'number';
			}
			else{
				schema.default = putValue;
				schema.type = 'string';
			}

			let cl = schema.type === 'object' ? 'null' : schema.type;
			value.className = cl + ' editablekey';
		};

		value.onkeydown = function(evt){
			if(evt.keyCode === 13){
				evt.preventDefault();
			}
		};

		value.innerHTML = (schema.default === null) ?  'null' : schema.default;

		html.appendChild(value);
		html.appendChild(_makeDescHandler(schema));
	}

	function _makeDescHandler(prop){
		const descHandler = document.createElement('div');
		descHandler.className = 'desc-handler';
		descHandler.innerHTML = '?';

		const desc = document.createElement('div');
		desc.className = 'desc';
		desc.appendChild(_makeDescription(prop));


		descHandler.appendChild(desc);

		return descHandler;
	}

	function _makeDescription(prop){
		const d = document.createElement('div');
		d.className = 'editablekey';
		d.contentEditable = true;
		d.innerHTML = prop.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
		d.onkeyup = function(evt){
			prop.description = evt.currentTarget.innerText;
		};
		return d;
	}

	return html;
}

export function _makeEditHandler(prop, level, propNode){
	const d = document.createElement('div');
	d.className = 'edithandler';

	d.onclick = function(evt){
		evt.stopPropagation();

		const menu = document.querySelector('#edit-menu');

		menu.style.display = 'block';
		menu.style.left = evt.currentTarget.offsetLeft + 'px';
		menu.style.top = evt.currentTarget.offsetTop + 'px';

		/**
		 * <li>Insert Array</li>
		 <li>Insert Object</li>
		 <li>Insert Value</li>
		 <li>Duplicate</li>
		 <li>Remove</li>
		 */
		menu.children[0].onclick = function(){
			let newProp = {
				'type': 'array',
				'title': '',
				'description': '',
				'properties': []
			};

			prop.properties.push(newProp);

			makeEditableJHTML(newProp, false, level, propNode.lastChild);
			menu.style.display = 'none';
		};


		if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
			menu.children[0].style.display = 'block';
			menu.children[1].style.display = 'block';
			menu.children[2].style.display = 'block';

		}else{
			menu.children[0].style.display = 'none';
			menu.children[1].style.display = 'none';
			menu.children[2].style.display = 'none';
		}

	};


	return d;
}

export function _makeEditMenu(){
	const r = document.querySelector('#results');

	r.onclick = function(){
		const menu = document.querySelector('#edit-menu');
		menu.style.display = 'none';
	}

}

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export function _isKeyDuplicate(key, props, keyIndex){
	let isDuplicate = false;

	props.forEach((prop, i) => {
		if(prop.title === key && i !== keyIndex) isDuplicate = true;
	});

	return isDuplicate;
}