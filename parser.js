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

function makeHTML(schema){
	let html = '';

	if(schema.type === 'object' && schema.hasOwnProperty('default')){
		html += schema.default;
	}
	else if(schema.type === 'object' || schema.type === 'array'){
		html += '<table class="object" cellpadding="0" cellspacing="0" ><tr>';

		html += `<td class="object-header" colspan="2">${(schema.type === 'object') ? 'Object' : 'Array'} {${schema.properties.length}}</td></tr>`;

		schema.properties.forEach(prop => {
			html += `<tr><td class="object-key">${(schema.type === 'object') ? prop.title : ''}</td>`;
			html += `<td class="object-value">${makeHTML(prop)}</td>`;
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