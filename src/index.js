import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import { RideProvider } from './context/RideContext';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <UserProvider>
        <RideProvider>
          <App />
        </RideProvider>
      </UserProvider>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
