import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';


import { Provider } from './components/Context';
import App from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();


