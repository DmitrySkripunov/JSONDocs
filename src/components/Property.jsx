import React, {useState} from 'react';
import Textarea from 'react-textarea-autosize';
import Menu from './Menu';
import PropertyLabel from './PropertyLabel';
import {nanoid} from 'nanoid';
import {Types} from '../libs/parser';

export default function Property({schema, isRoot, parent = {}, propertyIndex = 0, propertyPath = []}) {
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
    children = schema.properties.map((property, i) => (
      <Property 
        key={nanoid()} 
        schema={property} 
        parent={schema} 
        propertyIndex={i}
        propertyPath={propertyPath.concat(i)}
      />
    ));
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

      <PropertyLabel schema={schema} parent={parent} propertyPath={propertyPath}/>

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
