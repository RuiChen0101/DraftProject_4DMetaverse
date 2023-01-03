import App from './App';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from '4dmetaverse_admin_sdk/app';

import './index.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';

initializeApp({
  baseUrl: process.env.REACT_APP_BACKEND_URL ?? 'http://127.0.0.1:5001/four-d-metaverse-dev/us-central1',
  storageBaseUrl: process.env.REACT_APP_STORAGE_URL ?? 'http://127.0.0.1:9997'
});


const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
