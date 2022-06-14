import React from 'react';
import {useState} from 'react';
import {Types, isKeyDuplicate, isNumeric} from '../../libs/parser';

export default function PropertyLabel({schema, parent, propertyPath = []}) {
  const [key]           = useState(schema.title);
  const [type, setType] = useState(schema.type);
  const [value]         = useState(schema.default);

  const onKeyInput = evt => {
    const target  = evt.currentTarget;
    const value   = target.innerText;

    if (isKeyDuplicate(value, parent.properties, propertyPath[propertyPath.length - 1])) {
      target.title = 'The key is duplicated!';
      target.classList.add('keyerror');
    } else {
      target.classList.remove('keyerror');
      target.title = '';
    }
  };

  const onKeyDown = evt => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
    }
  };

  let cs = parent.type !== Types.ARRAY ? 'editablekey' : '';
  let title = '';

  if (isKeyDuplicate(key, parent.properties, propertyPath[propertyPath.length - 1])) {
    title = 'The key is duplicated!';
    cs += ' keyerror';
  }

  const changeValue = value => {
    setType(value.type);
  };


  return (
    <>
      <span
        onInput={onKeyInput}
        onKeyDown={onKeyDown}
        placeholder="field"
        className={cs}
        title={title}
        contentEditable={parent.type !== Types.ARRAY}
        suppressContentEditableWarning >
        {key}
      </span>

      <Postfix type={type} count={schema?.properties?.length}/>

      <Value type={type} value={value} onChange={changeValue}/>
    </>
  );
}

function Postfix({type, count}) {
  let postfix = ' : ';
  if (type === Types.OBJECT) {
    postfix = ` {${count}}`;
  }	else if (type === Types.ARRAY) {
    postfix = ` [${count}]`;
  }

  return <span className="key-postfix">{postfix}</span>;
}

function Value({type, value, onChange}) {
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
