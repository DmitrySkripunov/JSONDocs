var babelJest = require('babel-jest');

module.exports = {
	process: function(src, filename) {
		if (filename.match(/\.[css|less|scss|styl|png]/)) {
			//return '';
		}

		src += '/*---*/function __(a){ return a;}';

		return babelJest.process(src, filename);
	}
};