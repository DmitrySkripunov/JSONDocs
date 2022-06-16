import Actions from './actions';
import produce from 'immer';
import {Types, getPropertyValue, getDefaultProp} from '../libs/parser';

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
    
    return {schema: nextState};
  });

  store.on(Actions.UPDATE_VALUE, ({schema}, {value, path}) => {
    const putValue = getPropertyValue(value);

    const nextState = produce(schema, draftState => {
      const o = getProperty(draftState, path);

      o.default = putValue.default;
      o.type    = putValue.type;
    });

    return {schema: nextState};
  });

  store.on(Actions.SET_DESCRIPTION, ({schema}, {value, path}) => {
    const nextState = produce(schema, draftState => {
      const o = getProperty(draftState, path);

      o.description = value;
    });

    return {schema: nextState};
  });

  store.on(Actions.INSERT_ARRAY, ({schema}, {path}) => {
    const nextState = produce(schema, draftState => {
      const o = getProperty(draftState, path);

      o.properties.push(getDefaultProp(Types.ARRAY));
    });

    return {schema: nextState};
  });

  store.on(Actions.INSERT_VALUE, ({schema}, {value, path}) => {
    const o = getProperty(schema, path);

    return {schema: nextState};
  });

  store.on(Actions.REMOVE, ({schema}, {path, propertyIndex}) => {
    const o = getProperty(schema, path);

    return {schema: nextState};
  });
}

function getProperty(schema, path) {
  let o = schema;

  for (let i = 0; i < path.length; i++) {
    o = o.properties[path[i]];
  }

  return o;
}
