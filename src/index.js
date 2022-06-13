import React from 'react';
import ReactDOM from 'react-dom';
import prodS from './style/css/prod.css';
import styles from './style/css/app.css';

import App from './components/App.jsx';

(async function () {
  ReactDOM.render(
    <App />,
    document.querySelector('#app')
  );
})();
