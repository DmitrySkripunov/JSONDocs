import React from 'react';
import {Types} from '../../libs/parser';

export default function Postfix({type, count}) {
  let postfix = ' : ';
  if (type === Types.OBJECT) {
    postfix = ` {${count}}`;
  }	else if (type === Types.ARRAY) {
    postfix = ` [${count}]`;
  }

  return <span className="key-postfix">{postfix}</span>;
}
