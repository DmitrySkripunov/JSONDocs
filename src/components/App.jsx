'use strict';

import React from 'react';
import {parser, makeJSON, makeHTML, makeJHTML, syntaxHighlight} from '../libs/parser';

class App extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {

		return true;

	}

	constructor(props) {

		super(props);
		this.state = {
			inputJson: '{"address":{"streetAddress":"21 2nd Street","city":"New York"},"phoneNumber":[{"location":"home","code":44, "test":{"first": 1, "two":null}}]}',
			inputSchema: '{"title":"Schema","type":"object","description":"test json","properties":[{"description":"","title":"address","type":"object","properties":[{"description":"","title":"streetAddress","type":"string","default":"21 2nd Street"},{"description":"","title":"city","type":"string","default":"New York"}]},{"description":"","title":"phoneNumber","type":"array","properties":[{"description":"","type":"object","properties":[{"description":"","title":"location","type":"string","default":"home"},{"description":"","title":"code","type":"number","default":44},{"description":"","title":"test","type":"object","properties":[{"description":"","title":"first","type":"number","default":1},{"description":"","title":"two","type":"object","default":null}]}]}]}]}',
			result: ''
		};

		this.changeInputJSON 		= this.changeInputJSON.bind(this);
		this.changeInputSchema 	= this.changeInputSchema.bind(this);
		this.makeJSON 					= this.makeJSON.bind(this);
		this.makeSchema 				= this.makeSchema.bind(this);
		this.makeHTML 					= this.makeHTML.bind(this);
		this.makeJHTML 					= this.makeJHTML.bind(this);

	}

	render() {

		return <div>
							<div className="input-block">
									<div>
										<h2>Load JSON</h2>
										<textarea value={this.state.inputJson} onChange={this.changeInputJSON} />
										<div>
											<button onClick={this.makeJSON} value="json">Make JSON</button>
											<button onClick={this.makeSchema} value="json">Make Schema</button>
											<button onClick={this.makeHTML} value="json">Make HTML</button>
											<button onClick={this.makeJHTML} value="json">Make JHTML</button>
										</div>
									</div>

									<div>
										<h2>Load schema</h2>
										<textarea value={this.state.inputSchema} onChange={this.changeInputSchema} />
										<div>
											<button onClick={this.makeJSON} value="schema">Make JSON</button>
											<button onClick={this.makeSchema} value="schema">Make Schema</button>
											<button onClick={this.makeHTML} value="schema">Make HTML</button>
											<button onClick={this.makeJHTML} value="schema">Make JHTML</button>
										</div>
									</div>
							</div>

							<h2>Results</h2>
							<div id="results" dangerouslySetInnerHTML={{__html: this.state.result}}></div>

					</div>;

	}

	changeInputJSON(evt) {

		this.setState({inputJson: evt.target.value});

	}

	changeInputSchema(evt) {

		this.setState({inputSchema: evt.target.value});

	}

	makeJSON(evt) {

		const testJSON = evt.target.value === 'json' ? this.state.inputJson : this.state.inputSchema;

		const schema = evt.target.value !== 'json' ? JSON.parse(testJSON) : parser(testJSON, 'test json');

		if(schema !== null)
			this.setState({result: `<pre>${syntaxHighlight(JSON.stringify(makeJSON(schema), undefined, 4))}</pre>`});

	}

	makeSchema(evt) {

		const testJSON = evt.target.value === 'json' ? this.state.inputJson : this.state.inputSchema;

		const schema = evt.target.value !== 'json' ? JSON.parse(testJSON) : parser(testJSON, 'test json');

		if(schema !== null)
			this.setState({result: JSON.stringify(schema)});

	}

	makeHTML(evt) {

		const testJSON = evt.target.value === 'json' ? this.state.inputJson : this.state.inputSchema;

		const schema = evt.target.value !== 'json' ? JSON.parse(testJSON) : parser(testJSON, 'test json');

		if(schema !== null)
			this.setState({result: makeHTML(schema)});

	}

	makeJHTML(evt) {

		const testJSON = evt.target.value === 'json' ? this.state.inputJson : this.state.inputSchema;

		const schema = evt.target.value !== 'json' ? JSON.parse(testJSON) : parser(testJSON, 'test json');

		if(schema !== null)
			this.setState({result: makeJHTML(schema)});

	}

}

export default App;