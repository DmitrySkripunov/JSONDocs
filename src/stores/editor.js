import Actions from './actions';
import produce from 'immer';

export function editor (store) {
  store.on('@init', () => ({
    schema: null
  }));

  store.on(Actions.SETUP_SCHEMA, (_, schema) => ({schema}));

  store.on(Actions.UPDATE_KEY, ({schema}, {key, path}) => {
    const nextState = produce(schema, draftState => {
      const o = getProperty(draftState, path);
      o.title = key;
    });
    
    return nextState;
  });

  store.on(Actions.UPDATE_VALUE, ({schema}, {value, type, path}) => {
    const nextState = produce(schema, draftState => {
      const o = getProperty(schema, path);

      o.default = value;
      o.type    = type;
    });

    return nextState;
  });

  store.on(Actions.INSERT_VALUE, ({schema}, {value, path}) => {
    const o = getProperty(schema, path);

    return schema;
  });

  store.on(Actions.REMOVE, ({schema}, {path, propertyIndex}) => {
    const o = getProperty(schema, path);

    return schema;
  });
}

function getProperty(schema, path) {
  let o = schema;

  for (let i = 0; i < path.length; i++) {
    o = o.properties[path[i]];
  }

  return o;
}
