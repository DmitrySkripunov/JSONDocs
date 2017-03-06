'use strict';

import React from 'react';
import classnames from 'classnames';

class Editor extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const cs = classnames('', this.props.className, {

		});

		const style = Object.assign({} , this.props.style);

		return <div>{this.props.schema}</div>;
	}

}

export default Editor;