import ReactDOM from 'react-dom';
import React, {useEffect, useState} from 'react';
import {randomString, isKeyDuplicate, isNumeric, makeJSON, Types} from '../libs/parser';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';
import {nanoid} from 'nanoid';


export default function Editor (props) {
  const [schema, setSchema] = useState(props.schema);

  if (schema === undefined || schema.type === undefined) return null;

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

function Property({schema, isRoot, parent = {}, propertyIndex = 0}) {
  const [isMenu, setIsMenu] = useState(false);

  const showMenu = evt => {
    const rect = evt.currentTarget.getBoundingClientRect();
    setIsMenu({
      left: `${rect.left}px`,
      top:  `${rect.top}px`
    });
  };

  const onMenuAction = action => {
    switch (action) {
      case 'insert-array': break;
      case 'insert-object': break;
      case 'insert-value': break;
      case 'duplicate': break;
      case 'remove': 
        parent.properties.splice(propertyIndex, 1);
        break;
    }
    setIsMenu(false);
  };

  const closeMenu = _ => setIsMenu(false);

  if (!schema.id) schema.id = nanoid();
  const id = schema.id;

  let children = null;
  if (schema.type === Types.OBJECT) {
    children = <div className="props empty-object">(empty object)</div>;
  } else if (schema.type === Types.ARRAY) {
    children = <div className="props empty-object">(empty array)</div>;
  }


  if (schema.properties && schema.properties.length > 0) {
    children = schema.properties.map((property, i) => <Property key={nanoid()} schema={property} parent={schema} propertyIndex={i}/>);
  }

  const insertable = schema.type === 'object' || schema.type === 'array';

  const onChangeDescription = evt => {
    schema.description = evt.target.value;
  };

  return (
    <div className="props">
      <div className="edithandler" onClick={showMenu} />
      {isMenu ? <Menu style={isMenu} onAction={onMenuAction} onClose={closeMenu} isRoot={isRoot} insertable={insertable} /> : null}
      
      {children ? <input type="checkbox" className="jhtml-view-switcher" id={`jhtml-view-switcher-${id}`} /> : null}
      {children ? <label  htmlFor={`jhtml-view-switcher-${id}`} /> : null}

      <PropertyLabel schema={schema} parent={parent}/>

      <div className="desc-handler">
        ?
        <div className="desc">
          <Textarea style={{width: '95%'}} defaultValue={schema.description} onChange={onChangeDescription} />
        </div>
      </div>

      {children}
    </div>
  );
}

function Menu({isRoot, insertable = false, style, onAction, onClose}) {
  return (
    <Portal>
      <div className="click-outside" onClick={onClose}>
        <ul className="edit-menu" style={style}>
          {insertable ? <li onClick={_ => onAction('insert-array')}>Insert Array</li> : null}
          {insertable ? <li onClick={_ => onAction('insert-object')}>Insert Object</li> : null}
          {insertable ? <li onClick={_ => onAction('insert-value')}>Insert Value</li> : null}
          {!isRoot ? <li onClick={_ => onAction('duplicate')}>Duplicate</li> : null}
          {!isRoot ? <li onClick={_ => onAction('remove')}>Remove</li> : null}
        </ul>
      </div>
    </Portal>
  );
}

function Portal({children}) {
  const [element] = useState(() => document.createElement('div'));
  useEffect(() => {
    document.body.appendChild(element);
    return () => {
      document.body.removeChild(element);
    };
  }, []);

  return ReactDOM.createPortal(children, element);
}

function PropertyLabel({schema, parent}) {
  const onkeyup = evt => {
    if (isKeyDuplicate(evt.currentTarget.innerText, parent.properties)) {
      evt.currentTarget.title = 'The key is duplicated!';
      evt.currentTarget.classList.add('keyerror');
    } else {
      evt.currentTarget.classList.remove('keyerror');
      evt.currentTarget.title = '';
    }
    schema.title = evt.currentTarget.innerText;
  };

  const onkeydown = evt => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
    }
  };

  let cs = parent.type !== Types.ARRAY ? 'editablekey' : '';
  let title = '';

  if (isKeyDuplicate(schema.title, parent.properties)) {
    title = 'The key is duplicated!';
    cs += ' keyerror';
  }

  let postfixValue = undefined;
  if (schema.type === Types.OBJECT) {
    postfixValue = ` {${schema.properties.length}}`;
  }	else if (schema.type === Types.ARRAY) {
    postfixValue = ` [${schema.properties.length}]`;
  } else {
    postfixValue = ' : ';
  }

  let value = null;
  if (schema.type !== Types.OBJECT && schema.type !== Types.ARRAY) {
    const className = `${schema.type} editablekey`;

    const valueValue = (schema.default === null) ?  'null' : schema.default;

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

    value = (
      <span
        className={className}
        onKeyUp={onkeyup}
        onKeyDown={onkeydown}
        placeholder="value"
        contentEditable
        suppressContentEditableWarning >
        {valueValue}
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
        {schema.title}
      </span>
      <span className="key-postfix">{postfixValue}</span>
      {value}
    </>
  );
}
