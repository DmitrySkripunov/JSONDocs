
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

export function syntaxHighlight(json) {
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

  const date = _randomString();

  if (schema.type === 'object' && schema.hasOwnProperty('default')) {
    html += schema.default;
  } else if (schema.type === 'object' || schema.type === 'array') {
    if (!isRoot) {
      html += `<input type='checkbox' class='table-view-switcher' id='switcher-${date}'>`;
      html += `<label for='switcher-${date}' class='${isRoot ? 'root' : ''}'></label>`;
    }

    html += `<table class='object ${!isRoot ? 'hide' : ''}' cellpadding='0' cellspacing='0' >`;

    html += '<tr>';
    html += `<td class='object-header' colspan='2'>${(schema.type === 'object') ? 'Object' : 'Array'} {${schema.properties.length}}</td>`;
    html += `<td>${schema.description}</td>`;
    html += '</tr>';

    html += '<tr class="header">';
    html += `<td>${schema.type === 'array' ? 'Item #' : 'Key'}</td>`;
    html += '<td>Value</td>';
    html += '<td>Description</td>';
    html += '</tr>';

    schema.properties.forEach((prop, i) => {
      html += `<tr class='row'><td class='object-key'>${(schema.type === 'object') ? prop.title : i}</td>`;
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

export function makeJHTML(schema, isRoot = true, level = 1) {
  let html = '';

  if ((schema.type === 'object' || schema.type === 'array') && !schema.hasOwnProperty('default')) {
    if (isRoot) {
      html += `<span class='key-postfix'>${(schema.type === 'object') ? `Object {${schema.properties.length}}` : `Array [${schema.properties.length}]`}</span>`;
      html += _makeDescHandler(schema);
    }

    html += `<div class='prop' style='margin-left:${level * 10}px'>`;

    ++level;
    schema.properties.forEach((prop, i) => {
      html += '<div style="margin: 15px 0;">';

      if ((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
        const id = _randomString();
        html += `<input type='checkbox' class='jhtml-view-switcher' id='jhtml-view-switcher-${id}'/>`;
        html += `<label for='jhtml-view-switcher-${id}'></label>`;
      }


      let v = (schema.type === 'object') ? prop.title : i;
      let cl = '';
      if (v === '') {
        cl += ' empty';
        v = '(empty string)';
      }
      html += `<span class='${cl}'>${v}</span>`;

      if (prop.type === 'object' && !prop.hasOwnProperty('default')) {
        html += ` <span class='key-postfix'>{${prop.properties.length}}</span>`;
      } else if (prop.type === 'array' && !prop.hasOwnProperty('default')) {
        html += ` <span class='key-postfix'>[${prop.properties.length}]</span>`;
      } else {
        html += ' <span class="key-postfix">:</span> ';
      }

      if ((prop.type === 'object' || prop.type === 'array') && !prop.hasOwnProperty('default')) {
        html += _makeDescHandler(prop);
      }

      html += makeJHTML(prop, false, level);
      html += '</div>';
    });

    html += '</div>';
  } else {
    let cl = schema.type === 'object' ? 'null' : schema.type;
    let v = schema.default;
    if (schema.default === '') {
      cl += ' empty';
      v = '(empty string)';
    }
		
    html += `<span class='${cl}'>${v}</span>`;
    html += _makeDescHandler(schema);
  }

  function _makeDescHandler(prop) {
    return `
      <div class='desc-handler'>?
      <div class='desc'>${_makeDescription(prop)}</div>
      </div>
    `;
  }

  function _makeDescription(prop) {
    return prop.description.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

  return html;
}
