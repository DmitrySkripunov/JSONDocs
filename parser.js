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
 *  - properties or items
 *
 *
 */
function parser(json, desc){
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
function _convertProperty(prop, propName){
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

function makeJSON(schema){
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

function _makeJSONProp(prop){
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

function makeHTML(schema, isRoot = true){
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

function makeJHTML(schema, isRoot = true, level = 1){
	let html = '';

	if((schema.type === 'object' || schema.type === 'array') && !schema.hasOwnProperty('default')){

		if(isRoot)
			html += `<span class="key-postfix">${(schema.type === 'object') ? `Object {${schema.properties.length}}` : `Array [${schema.properties.length}]`}</span>`;

		html += `<div style="margin-left:${level*10}px">`;

		++level;
		schema.properties.forEach((prop, i) => {
			html += `<div style="margin: 15px 0;">`;

			if((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
				const id = _randomString();
				html += `<input type="checkbox" class="jhtml-view-switcher" id="jhtml-view-switcher-${id}"/>`;
				html += `<label for="jhtml-view-switcher-${id}"></label>`;
			}


			html += `${(schema.type === 'object') ? prop.title : i}`;

			if(prop.type === 'object' && !prop.hasOwnProperty('default')){
				html += ` <span class="key-postfix">{${prop.properties.length}}</span>`;
			}
			else if(prop.type === 'array' && !prop.hasOwnProperty('default')){
				html += ` <span class="key-postfix">[${prop.properties.length}]</span>`;
			}else {
				html += ` <span class="key-postfix">:</span> `;
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

		html += `<span class="${cl}">${schema.default}</span>`;
	}

	return html;
}

function _randomString(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function syntaxHighlight(json) {
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