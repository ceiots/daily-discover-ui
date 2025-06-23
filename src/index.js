// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// A more modern approach to global styles
import { createGlobalStyle } from 'styled-components';
import theme from './theme/tokens'; // Import the default export

const { typography, colors } = theme; // Destructure

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${typography.fontFamily};
    background-color: ${colors.grey[100]};
    color: ${colors.grey[900]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);