import React from 'react';
import {Types} from '../../libs/parser';

export default function PropertyValue({type, value, onChange}) {
  if (type === Types.OBJECT || type === Types.ARRAY) return null;

  const onkeyup = evt => {
    const putValue =  evt.currentTarget.innerText;
    /**
     * value can be: number, or boolean, or string, or null
     * @type {string}
     */

    const value = {
      default:  putValue,
      type:     'string'
    };
    if (putValue === 'null') {
      value.default = null;
      value.type = 'null';
    } else if (putValue === 'true' || putValue === 'false') {
      value.default = putValue === 'true';
      value.type = 'boolean';
    }	else if (isNumeric(putValue)) {
      value.default = parseFloat(putValue);
      value.type = 'number';
    }	

    onChange(value);
  };

  const onKeyDown = evt => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
    }
  };

  return (
    <span
      className={`${type} editablekey`}
      onInput={onkeyup}
      onKeyDown={onKeyDown}
      placeholder="value"
      contentEditable
      suppressContentEditableWarning >
      {String(value)}
    </span>
  );
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
