import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/";
    script.async = true;

    document.body.appendChild(script);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
