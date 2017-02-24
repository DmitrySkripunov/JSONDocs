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
		schema.items = [];
		json.forEach((p, i) => {
			schema.items.push(_convertProperty(p));
		});
	}
	else {
		schema.properties = {};
		schema.type = "object";
		for (let key in json) {
			schema.properties[key] = {};
			schema.properties[key] = _convertProperty(json[key], key);
		}
	}

	return schema;
}

function makeJSON(schema){
	let json = null;
	if(schema.type === 'object'){
		json = {};
	}
	else{
		json = [];
	}
}

function _makeJSONProp(prop){
	let json = null;
	if(schema.type === 'object'){
		json = {};
	}
	else{
		json = [];
	}
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
			cProp.items = [];
			prop.forEach((p, i) => {
				cProp.items.push(_convertProperty(p));
		});
		}
		else {
			cProp.type = 'object';
			if(prop === null){
				cProp.default = prop;
			}
			else{
				cProp.properties = {};
				for(let key in prop){
					cProp.properties[key] = {};
					cProp.properties[key] = _convertProperty(prop[key], key);
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