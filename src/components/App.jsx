import React, {useState} from 'react';
import {parser, makeJSON, makeHTML, makeJHTML, syntaxHighlight, makeHTMLFile, makeJHTMLFile} from '../libs/parser';
import Editor from './Editor';

export default function App () {
  const [inputJson, setInputJSON] = useState('{"address":{"streetAddress":"21 2nd Street","city":"New York"},"phoneNumber":[{"location":"home","code":44, "test":{"first": 1, "two":null}}]}');
  // eslint-disable-next-line max-len
  const [inputSchema, setInputSchema] = useState('{"title":"Schema","type":"object","description":"","properties":[{"description":"","title":"address","type":"object","properties":[{"description":"","title":"streetAddress","type":"string","default":"21 2nd Street"},{"description":"","title":"city","type":"string","default":"New York"}]},{"description":"","title":"phoneNumber","type":"array","properties":[{"description":"","type":"object","properties":[{"description":"","title":"location","type":"string","default":"home"},{"description":"","title":"code","type":"number","default":44},{"description":"","title":"test","type":"object","properties":[{"description":"","title":"first","type":"number","default":1},{"description":"","title":"two","type":"object","default":null}]}]}]}]}');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('view');
  const [schema, setSchema] = useState();
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
    setInputJSON(JSON.stringify(makeJSON(schema)));
    setInputSchema(JSON.stringify(schema));
  };

  const changeInputJSON = evt => {
    setInputJSON(evt.target.value);
  };

  const changeInputSchema = evt => {
    setInputSchema(evt.target.value);
  };

  const getSchema = evt => {
    const testJSON = evt.target.value === 'json' ? inputJson : inputSchema;

    return evt.target.value !== 'json' ? JSON.parse(testJSON) : parser(testJSON, 'test json');
  };

  const onMakeJSON = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(`<pre>${syntaxHighlight(JSON.stringify(makeJSON(schema), undefined, 4))}</pre>`);
      setSchema(schema);
      setType('json');
    }
  };

  const onMakeSchema = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(JSON.stringify(schema));
      setSchema(schema);
      setType('schema');
    }
  };

  const onMakeHTML = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(makeHTML(schema));
      setSchema(schema);
      setType('html');
    }
  };

  const onMakeJHTML = evt => {
    const schema = getSchema(evt);

    if (schema !== null) {
      setResult(makeJHTML(schema));
      setSchema(schema);
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
            <button onClick={onMakeSchema} value="json">Make Schema</button>
            <button onClick={onMakeHTML} value="json">Make HTML</button>
            <button onClick={onMakeJHTML} value="json">Make JHTML</button>
          </div>
        </div>

        <div>
          <h2>Load schema</h2>
          <textarea value={inputSchema} onChange={changeInputSchema} />
          <div className="btns">
            <button onClick={onMakeJSON} value="schema">Make JSON</button>
            <button onClick={onMakeSchema} value="schema">Make Schema</button>
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
