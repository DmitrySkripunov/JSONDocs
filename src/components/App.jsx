import React, {useState} from 'react';
import {parser} from '../libs/parser';
import {makeJSON, makeHTML, makeJHTML, syntaxHighlight, makeHTMLFile, makeJHTMLFile} from '../libs/maker';
import Editor from './editor/Editor';

import testJSON from '../test-json.json';
import testSchema from '../test-schema.json';
import {useStoreon} from 'storeon/react';
import Actions from '../stores/actions';
import store from '../stores/index';

export default function App () {
  const [inputJson, setInputJSON]     = useState(JSON.stringify(testJSON));
  const [inputSchema, setInputSchema] = useState(JSON.stringify(testSchema));

  const {dispatch, schema} = useStoreon('schema');

  const [result, setResult] = useState('');
  const [mode, setMode] = useState('view');
  
  const [type, setType] = useState();

  let downloadName = '';
  let file = '';
  switch (type) {
    case 'json':
      downloadName = 'doc-json.json';
      file = `data:text/json;charset=utf-8,${encodeURIComponent(inputJson)}`;
      break;
    case 'schema':
      downloadName = 'doc-schema.json';
      file = `data:text/json;charset=utf-8,${encodeURIComponent(inputSchema)}`;
      break;
    case 'html':
      downloadName = 'doc-html.html';
      file = `data:text/html;charset=utf-8,${encodeURIComponent(makeHTMLFile(result))}`;
      break;
    case 'jhtml':
      downloadName = 'doc-jhtml.html';
      file = `data:text/html;charset=utf-8,${encodeURIComponent(makeJHTMLFile(result))}`;
      break;
  }

  const download = type && mode !== 'edit' ? <a href={file} download={downloadName}>{downloadName}</a> : null;

  const onSave = schema => {
    //console.log(store.get('editor').schema);
    setInputJSON(JSON.stringify(makeJSON(schema)));
    setInputSchema(JSON.stringify(schema));
  };

  const changeInputJSON   = evt => setInputJSON(evt.target.value);
  const changeInputSchema = evt => setInputSchema(evt.target.value);

  const getSchema = evt => {
    const testJSON = evt.target.value === 'json' ? inputJson : inputSchema;

    return evt.target.value !== 'json' ? JSON.parse(testJSON) : parser(testJSON, 'JSON Title', 'JSON Description');
  };

  const onMakeJSON = evt => {
    const schema = getSchema(evt);
    if (schema !== null) {
      setResult(`<pre>${syntaxHighlight(JSON.stringify(makeJSON(schema), undefined, 4))}</pre>`);
      dispatch(Actions.SETUP_SCHEMA, schema);
      setType('json');
    }
  };

  const onMakeSchema = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(JSON.stringify(schema));
      dispatch(Actions.SETUP_SCHEMA, schema);
      setType('schema');
    }
  };

  const onMakeHTML = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(makeHTML(schema));
      dispatch(Actions.SETUP_SCHEMA, schema);
      setType('html');
    }
  };

  const onMakeJHTML = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(makeJHTML(schema));
      dispatch(Actions.SETUP_SCHEMA, schema);
      setType('jhtml');
    }
  };

  const switchMode = _ => {
    setMode(mode === 'view' ? 'edit' : 'view');
  };

  const results = mode !== 'edit' 
    ? <div className="results" dangerouslySetInnerHTML={{__html: result}} />
    : <Editor onSave={onSave} schema={schema} />;

  return (
    <>
      <h1>JSON Docs</h1>
      <div className="input-block">
        <div>
          <h2>Load JSON</h2>
          <textarea value={inputJson} onChange={changeInputJSON} />
          <div className="btns">
            <button onClick={onMakeJSON} value="json">Make JSON</button>
            <button onClick={onMakeSchema} value="json">Make text doc</button>
            <button onClick={onMakeHTML} value="json">Make HTML</button>
            <button onClick={onMakeJHTML} value="json">Make JHTML</button>
          </div>
        </div>

        <div>
          <h2>Load doc</h2>
          <textarea value={inputSchema} onChange={changeInputSchema} />
          <div className="btns">
            <button onClick={onMakeJSON} value="schema">Make JSON</button>
            <button onClick={onMakeSchema} value="schema">Make text doc</button>
            <button onClick={onMakeHTML} value="schema">Make HTML</button>
            <button onClick={onMakeJHTML} value="schema">Make JHTML</button>
          </div>
        </div>
      </div>

      <h2>Results</h2>
      <button onClick={switchMode}>Mode: {mode}</button> {download}

      {results}
    </>
  );
}
