import React, {useState} from 'react';
import Property from './Property';

export default function Editor ({schema, ...props}) {
  if (schema === undefined || schema?.type === undefined) return null;

  const onClick = evt => {
    const errors = document.querySelectorAll('.keyerror');
    if (errors.length <= 0) {
      props.onSave(schema);
    } else {
      alert('JSON has errors!');
    }
  };

  return (
    <div className="results">
      <Property schema={schema} isRoot />

      <div className="edit-btns">
        <button onClick={onClick}>Save</button>
      </div>
    </div>
  );
};
