'use strict';

import React from 'react';
import parser from './libs/parser';

class App extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	constructor(props) {
		super(props);
		this.state = {
			defaulJson: '{"address":{"streetAddress":"21 2nd Street","city":"New York"},"phoneNumber":[{"location":"home","code":44, "test":{"first": 1, "two":null}}]}',
			defaulSchema: '{"title":"Schema","type":"object","description":"test json","properties":[{"description":"","title":"address","type":"object","properties":[{"description":"","title":"streetAddress","type":"string","default":"21 2nd Street"},{"description":"","title":"city","type":"string","default":"New York"}]},{"description":"","title":"phoneNumber","type":"array","properties":[{"description":"","type":"object","properties":[{"description":"","title":"location","type":"string","default":"home"},{"description":"","title":"code","type":"number","default":44},{"description":"","title":"test","type":"object","properties":[{"description":"","title":"first","type":"number","default":1},{"description":"","title":"two","type":"object","default":null}]}]}]}]}'
		};
	}

	render() {
		return <div className="input-block">
						<div>
							<h2>Load JSON</h2>
							<textarea defaultValue={this.state.defaultJson} />
							<div>
								<button onClick={this.makeHTML()}>Make HTML</button>
								<button onClick="makeJHTML4()">Make JHTML</button>
								<button onClick="make2()">Make JSON</button>
								<button onClick="make3()">Make Schema</button>
							</div>
						</div>

						<div>
							<h2>Load schema</h2>
							<textarea defaultValue={this.state.defaulSchema} />
							<div>
								<button onClick="make(true)">Make HTML</button>
								<button onClick="makeJHTML4(true)">Make JHTML</button>
								<button onClick="make2(true)">Make JSON</button>
								<button onClick="make3(true)">Make Schema</button>
							</div>
						</div>

					<h2>Results</h2>
					<div id="results"></div>

					</div>;
	}

	makeHTML(){
		const testJSON = document.querySelector(`#${isSchema ? 'schemaInput' : 'jsonInput'}`).value;

		schema = isSchema ? JSON.parse(testJSON) : parser(testJSON, "test json");

		if(schema !== null){
			var makedHTML = makeHTML(schema);
			if(makedHTML !== null)
				document.querySelector('#results').innerHTML = makedHTML;
		}
	}

}

export default App;