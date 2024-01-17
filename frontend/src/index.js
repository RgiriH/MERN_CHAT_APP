import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import ChartProvider from './context/chartProvider.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChartProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChartProvider>
  </BrowserRouter>
);


reportWebVitals();
