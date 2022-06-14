import React from 'react';
import {useState} from 'react';
import {Types, isKeyDuplicate, isNumeric} from '../libs/parser';

export default function PropertyLabel({schema, parent, propertyPath = []}) {
  const [key, setKey]     = useState(schema.title);
  const [type, setType]   = useState(schema.type);
  const [value, setValue] = useState(schema.default);

  const onkeyup = evt => {
    if (isKeyDuplicate(evt.currentTarget.innerText, parent.properties, propertyPath[propertyPath.length - 1])) {
      evt.currentTarget.title = 'The key is duplicated!';
      evt.currentTarget.classList.add('keyerror');
    } else {
      evt.currentTarget.classList.remove('keyerror');
      evt.currentTarget.title = '';
    }
    setKey(evt.currentTarget.innerText);
  };

  const onChange = evt => {
    const target = evt.target;
    const value = target.value;
    if (isKeyDuplicate(value, parent.properties, propertyPath[propertyPath.length - 1])) {
      target.title = 'The key is duplicated!';
      target.classList.add('keyerror');
    } else {
      target.classList.remove('keyerror');
      target.title = '';
    }
    setKey(value);
  };

  const onkeydown = evt => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
    }
  };

  let cs = 'editablekey';
  let title = '';

  if (isKeyDuplicate(key, parent.properties, propertyPath[propertyPath.length - 1])) {
    title = 'The key is duplicated!';
    cs += ' keyerror';
  }

  let postfixValue = undefined;
  if (type === Types.OBJECT) {
    postfixValue = ` {${schema.properties.length}}`;
  }	else if (type === Types.ARRAY) {
    postfixValue = ` [${schema.properties.length}]`;
  } else {
    postfixValue = ' : ';
  }

  let valueView = null;
  if (type !== Types.OBJECT && type !== Types.ARRAY) {
    const className = `${schema.type} editablekey`;

    const onkeyup = evt => {
      const putValue =  evt.currentTarget.innerText;
      /**
       * value can be: number, or boolean, or string, or null
       * @type {string}
       */
      if (putValue === 'null') {
        schema.default = null;
        schema.type = 'null';
      } else if (putValue === 'true' || putValue === 'false') {
        schema.default = putValue === 'true';
        schema.type = 'boolean';
      }	else if (isNumeric(putValue)) {
        schema.default = parseFloat(putValue);
        schema.type = 'number';
      }	else {
        schema.default = putValue;
        schema.type = 'string';
      }
    };

    const onkeydown = evt => {
      if (evt.keyCode === 13) {
        evt.preventDefault();
      }
    };

    valueView = (
      <span
        className={className}
        onKeyUp={onkeyup}
        onKeyDown={onkeydown}
        placeholder="value"
        contentEditable
        suppressContentEditableWarning >
        {String(value)}
      </span>
    );
  }


  return (
    <>
      <span
        onKeyUp={onkeyup}
        onKeyDown={onkeydown}
        placeholder="field"
        className={cs}
        title={title}
        contentEditable={parent.type !== Types.ARRAY}
        suppressContentEditableWarning >
        {key}
      </span>
      {/*<input className={cs} type="text" value={key} onChange={onChange} placeholder="field" readOnly={parent.type === Types.ARRAY}/>*/}

      <span className="key-postfix">{postfixValue}</span>
      {valueView}
    </>
  );
}
