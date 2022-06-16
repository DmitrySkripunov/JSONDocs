import {nanoid} from 'nanoid';

 
/**
  *
  * Available types in JSON:
  * values:
  *  - string
  *  - number
  *  - boolean
  *  - null
  *  - array
  *  - object
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

export const Types = {
  OBJECT:   'object',
  ARRAY:    'array',
  STRING:   'string',
  NUMBER:   'number',
  NULL:     'null',
  BOOLEAN:  'boolean'
};

export function parser(_json, title, description) {
  let json = _json;
  const schema = {
    'title':        String(title),
    'type':         null,
    'description':  String(description),
    '$id':          nanoid()
  };

  try {
    json = JSON.parse(json);
  } catch (ex) {
    return null;
  }

  if (Array.isArray(json)) {
    schema.type = Types.ARRAY;
    schema.properties = [];
    json.forEach((p, i) => schema.properties.push(_convertProperty(p, String(i))));
  } else {
    schema.properties = [];
    schema.type = Types.OBJECT;
    for (const key in json) {
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
function _convertProperty(prop, propName) {
  const cProp = {
    'description':  '',
    'title':        propName,
    '$id':          nanoid()
  };

  if (typeof prop === Types.OBJECT) {
    if (Array.isArray(prop)) {
      cProp.type = Types.ARRAY;
      cProp.properties = [];
      prop.forEach((p, i) => {
        cProp.properties.push(_convertProperty(p, String(i)));
      });
    } else if (prop === null) {
      cProp.type = Types.NULL;
      cProp.default = null;
    } else {
      cProp.type = Types.OBJECT;
      cProp.properties = [];
      for (const key in prop) {
        cProp.properties.push(_convertProperty(prop[key], key));
      }
    }
  } else {
    cProp.type    = typeof prop;
    cProp.default = prop;
  }

  return cProp;
}
