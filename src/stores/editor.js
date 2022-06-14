import Actions from './actions';

export function editor (store) {
  store.on('@init', () => ({
    schema: null
  }));

  store.on(Actions.SETUP_SCHEMA, (_, schema) => ({schema}));

  store.on(Actions.UPDATE_KEY, ({schema}, {key, path}) => {
    const o = getProperty(schema, path);

    o.title = key;

    return schema;
  });

  store.on(Actions.UPDATE_VALUE, ({schema}, {value, type, path}) => {
    const o = getProperty(schema, path);

    o.default = value;
    o.type    = type;

    return schema;
  });

  store.on(Actions.INSERT_VALUE, ({schema}, {value, path}) => {
    const o = getProperty(schema, path);

    o.properties.push({});

    return schema;
  });

  store.on(Actions.REMOVE, ({schema}, {path, propertyIndex}) => {
    const o = getProperty(schema, path);

    o.properties.push({});

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
