import React from 'react';
import { createRoot } from "react-dom/client"
import { initalizeValidation } from './utils/validation';
import { ChakraProvider } from '@chakra-ui/react';

initalizeValidation();

// eslint-disable-next-line import/first
import App from './app';
const rootElem = document.getElementById("root")
const root = createRoot(rootElem!);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
