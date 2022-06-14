import React from 'react';
import {createRoot} from 'react-dom/client';
import prodS from './style/css/prod.css';
import styles from './style/css/app.css';

import {StoreContext} from 'storeon/react';
import store from './stores/index';

import App from './components/App.jsx';

(async function () {
  createRoot(document.querySelector('#app')).render(
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  );
})();
