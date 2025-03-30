import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ApplicationRouter from './ApplicationRouter';
import { ServerFunctionProvider } from './utils/use-server';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ServerFunctionProvider wsUrl="wss://tuvme.xyz:8080/ws">
      <ApplicationRouter />
    </ServerFunctionProvider>
  </React.StrictMode>
);