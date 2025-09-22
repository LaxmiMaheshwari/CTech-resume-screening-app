// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css'; // or your global styles


// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//    <React.StrictMode>
//     <App />
//    </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
