import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CSSReset, ChakraProvider } from '@chakra-ui/react';
import customTheme from './theme.js';
import { ZipperProvider } from './ZipperContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider theme={customTheme} toastOptions={{ defaultOptions: { position: 'top' } }}>
      <CSSReset />
        <ZipperProvider>
          <App />
        </ZipperProvider>
    </ChakraProvider>
);
