import React from 'react';
import {useStoreon} from 'storeon/react';
import classnames from 'classnames';
import {Types} from '../../libs/parser';
import Actions from '../../stores/actions';
import AutosizeInput from '../AutosizeInput';
import Postfix from './Postfix';
import PropertyValue from './PropertyValue';

export default function PropertyLabel({schema, parent, propertyPath = []}) {
  const key   = schema.title;
  const type  = schema.type;
  const value = schema.default;
  const {dispatch} = useStoreon();

  const onChangeKey = evt => {
    dispatch(Actions.UPDATE_KEY, {key: evt.target.value, path: propertyPath});
  };

  const inputClassNames = classnames('key', {
    'editable': parent.type !== Types.ARRAY
  });

  let error = null;
  if (isKeyDuplicate(key, parent.properties, propertyPath[propertyPath.length - 1])) {
    error = <span className="keyerror" title="The key is duplicated!"/>;
  }

  const onChangeValue = evt => {
    dispatch(Actions.UPDATE_VALUE, {value: evt.target.value, path: propertyPath});
  };

  return (
    <>
      <AutosizeInput 
        value={key}
        inputClassName={inputClassNames} 
        readOnly={parent.type === Types.ARRAY} 
        onChange={onChangeKey}
        placeholder="field"
      />

      {error}
      
      <Postfix type={type} count={schema?.properties?.length}/>

      <PropertyValue type={type} value={value} onChange={onChangeValue}/>
    </>
  );
}

function isKeyDuplicate(key, props = [], keyIndex) {
  for (let i = 0; i < props.length; i++) {
    if (i === keyIndex) continue;
    if (props[i].title === key) return true;
  }

  return false;
}
