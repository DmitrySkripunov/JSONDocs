import {nanoid} from 'nanoid';
import {Types} from './parser';

export function makeJSON(schema) {
  let json = null;
  if (schema.type === 'object') {
    json = {};
    schema.properties.forEach(item => {
      json[item.title] = _makeJSONProp(item);
    });
  } else {
    json = [];
    schema.properties.forEach(item => {
      json.push(_makeJSONProp(item));
    });
  }

  return json;
}

function _makeJSONProp(prop) {
  let p = null;

  if (prop.type === 'object' && prop.hasOwnProperty('default')) {
    p = prop.default;
  } else if (prop.type === 'object') {
    p = {};
    prop.properties.forEach(item => {
      p[item.title] = _makeJSONProp(item);
    });
  } else if (prop.type === 'array') {
    p = [];
    prop.properties.forEach(item => {
      p.push(_makeJSONProp(item));
    });
  } else {
    p = prop.default;
  }

  return p;
}

export function _randomString() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function syntaxHighlight(_json) {
  let json = _json;
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/('(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\'])*'(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
    let cls = 'number';
    if (/^'/.test(match)) {
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
    return `<span class="${cls}">${match}</span>`;
  });
}

export function makeHTML(schema, isRoot = true) {
  let html = '';

  const id = nanoid();

  if (schema.type === Types.NULL) {
    html += schema.default;
  } else if (schema.type === Types.OBJECT || schema.type === Types.ARRAY) {
    if (!isRoot) {
      html += `<input type='checkbox' class='table-view-switcher' id='switcher-${id}'>`;
      html += `<label for='switcher-${id}' class='${isRoot ? 'root' : ''}'></label>`;
    }

    html += `<table class='object ${!isRoot ? 'hide' : ''}' cellpadding='0' cellspacing='0' >`;

    html += '<tr>';
    html += `<td class='object-header' colspan='2'>${(schema.type === Types.OBJECT) ? 'Object' : 'Array'} {${schema?.properties?.length ?? 0}}</td>`;
    html += `<td>${schema.description}</td>`;
    html += '</tr>';

    html += '<tr class="header">';
    html += `<td>${schema.type === Types.ARRAY ? 'Item #' : 'Key'}</td>`;
    html += '<td>Value</td>';
    html += '<td>Description</td>';
    html += '</tr>';

    schema?.properties?.forEach((prop, i) => {
      html += `<tr class='row'><td class='object-key'>${prop.title}</td>`;
      html += `<td class='object-value'>${makeHTML(prop, false)}</td>`;
      html += `<td class='object-description'>${prop.description}</td>`;
      html += '</tr>';
    });

    html += '</table>';
  } else {
    html += schema.default;
  }


  return html;
}

export function makeJHTML(schema, isRoot = true) {
  let html = '';

  html += '<div class="props">';

  if ((schema.type === Types.ARRAY || schema.type === Types.OBJECT) && !isRoot) {
    const id = nanoid();
    html += `<input type='checkbox' class='jhtml-view-switcher' id='jhtml-view-switcher-${id}'/>`;
    html += `<label for='jhtml-view-switcher-${id}'></label>`;
  }

  if (isRoot) {
    html += `<span class='key-postfix'>${(schema.type === Types.OBJECT) ? `Object {${schema.properties.length}}` : `Array [${schema.properties.length}]`}</span>`;
  } else {
    html += `<span >${schema.title}</span>`;
    if (schema.type === Types.OBJECT) {
      html += ` <span class='key-postfix'>{${schema?.properties?.length ?? 0}}</span>`;
    } else if (schema.type === Types.ARRAY) {
      html += ` <span class='key-postfix'>[${schema?.properties?.length ?? 0}]</span>`;
    } else {
      html += ' <span class="key-postfix">:</span> ';
    }
  }

  if (schema.type !== Types.ARRAY && schema.type !== Types.OBJECT) {
    html += ` <span class="${schema.type}">${schema.default}</span> `;
  }

  html += _makeDescHandler(schema);
  

  let children = '';
  if (schema.type === Types.OBJECT) {
    children = '<div class="props empty-object">(empty object)</div>';
  } else if (schema.type === Types.ARRAY) {
    children = '<div class="props empty-object">(empty array)</div>';
  }
  if (schema.properties && schema.properties.length > 0) {
    children = '';
    schema.properties.forEach(prop => {
      children += makeJHTML(prop, false);
    });
  }

  html += children;
  html += '</div>';

  function _makeDescHandler(prop) {
    return `
      <div class="${`desc-handler ${prop.description.length === 0 ? 'empty' : ''}`}">?
        <div class="desc">${_makeDescription(prop)}</div>
      </div>
    `;
  }

  function _makeDescription(prop) {
    return prop.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

  return html;
}


export function makeHTMLFile(content) {
  return `<!DOCTYPE html>
					<html lang="en">
						<head>
							<meta charset="UTF-8">
							<title>JSON Doc</title>
							<style>
								body{
									width: 1024px;
									margin: 0 auto;
								}
								
								.object{
										border: 1px solid #888888;
										background: #ffffff;
								}
				
								.object.hide {
										display: none;
								}
				
								.object td{
										padding: 10px;
								}
				
								.object tr.row:nth-child(1n)>td{
										background: #eeeeee;
								}
								.object tr.row:nth-child(2n)>td{
										background: #ffffff;
								}
				
								.object-header{
										padding: 5px;
								}
				
								.object-key{
										padding: 10px;
										font-weight: bold;
								}
				
								.object-value{
										padding: 5px;
								}
				
								.object-description{
										padding: 5px;
								}
				
								.header > td{
										background: tomato;
										color: #ffffff;
								}
				
								.table-view-switcher{
										display: none;
								}
				
								.table-view-switcher + label{
										cursor: pointer;
										color: blue;
										text-decoration: underline;
								}
				
								.table-view-switcher + label:before{
										content: 'Show';
								}
				
								.table-view-switcher:checked ~ table{
										display: table;
								}
				
								.table-view-switcher:checked + label:before{
										content: 'Hide';
								}
						</style>
						</head>
						<body>
							${content}
						</body>`;
}

export function makeJHTMLFile(content) {
  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>JSON Doc</title>
              <style>
                body{
                  width: 1024px;
                  margin: 0 auto;
                }
                
                .string { color: green; }
                .number { color: darkorange; }
                .boolean { color: blue; }
                .null { color: magenta; }
                .key { color: red; }
                .empty{ color: #999999; }
                
                .results{
                    font-family: monospace,sans-serif;
                    margin: 10px;
                    box-shadow: 1px 1px 6px #999;
                    padding: 10px;
                    width: 100%;
                }
                
                .key-postfix{
                    color: #888888;
                }
                
                .jhtml-view-switcher{
                    display: none;
                }
                
                .jhtml-view-switcher + label{
                    cursor: pointer;
                    cursor: pointer;
                    width: 25px;
                    height: 25px;
                    display: inline-block;
                    text-align: center;
                    margin-right: 5px;
                }
                
                .jhtml-view-switcher + label:before{
                    content: '▶';
                    padding: 5px;
                }
                
                .jhtml-view-switcher:checked ~ .props{
                    display: block;
                    margin-left: 15px;
                }
                
                .jhtml-view-switcher:checked ~ .props.empty-object{
                    color: #bbbbbb;
                    margin: 15px 55px;
                }
                
                .jhtml-view-switcher:checked + label:before{
                    content: '▼';
                }
                
                .jhtml-view-switcher:not(:checked) ~ .props{
                    display: none;
                }
                
                .desc-handler{
                    display: inline-block;
                    background: tomato;
                    color: #ffffff;
                    border-radius: 50%;
                    width: 25px;
                    height: 25px;
                    line-height: 25px;
                    text-align: center;
                    margin-left: 10px;
                    cursor: pointer;
                    position: relative;
                }

                .desc-handler.empty {
                    --color: rgb(59, 59, 59);
                }
                
                .desc-handler:hover{
                    width: 50%;
                }
                
                .desc-handler > .desc {
                    display: none;
                    position: absolute;
                    z-index: 1;
                    top: 0;
                    left: 0;
                    background: #ffffff;
                    padding: 10px;
                    border-radius: 4px;
                    border: 2px solid tomato;
                    color: #333333;
                    width: 100%;
                    max-height: 200px;
                    overflow-y: auto;
                    box-shadow: 1px 2px 8px tomato;
                }
                
                .desc-handler:hover > .desc{
                    display: block;
                }
                
                .props{
                    margin: 10px 10px 10px 30px;
                }
            </style>
            </head>
            <body>
              <div class="results">
                ${content}
              </div>
            </body>`;
}
