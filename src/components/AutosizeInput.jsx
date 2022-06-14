import React from 'react';

export default function AutosizeInput({value, onChange, ...props}) {
  return (
    <div>
      <input type="text" value={value} onChange={onChange}/>
      <span>{value}</span>
    </div>
  );
}
