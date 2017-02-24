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

/*
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
}*/




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