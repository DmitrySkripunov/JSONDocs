import Actions from './actions';

export function editor (store) {
  store.on('@init', () => ({
    schema: null
  }));

  store.on(Actions.SETUP_SCHEMA, (_, schema) => ({schema}));
}
