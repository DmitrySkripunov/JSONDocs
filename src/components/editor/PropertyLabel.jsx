import React from 'react';
import {useState} from 'react';
import {Types, isKeyDuplicate} from '../../libs/parser';
import Postfix from './Postfix';
import PropertyValue from './PropertyValue';

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

      <PropertyValue type={type} value={value} onChange={changeValue}/>
    </>
  );
}
