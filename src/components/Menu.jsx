import Portal from './Portal';

export default function Menu({isRoot, insertable = false, style, onAction, onClose}) {
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

