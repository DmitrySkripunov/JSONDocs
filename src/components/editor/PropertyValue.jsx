import React from 'react';
import {Types} from '../../libs/parser';
import AutosizeInput from '../AutosizeInput';

export default function PropertyValue({type, value, onChange}) {
  if (type === Types.OBJECT || type === Types.ARRAY) return null;

  return (
    <AutosizeInput 
      inputClassName={`${type} key editable`}
      onChange={onChange}
      placeholder="value"
      value={value}
    />
  );
}
