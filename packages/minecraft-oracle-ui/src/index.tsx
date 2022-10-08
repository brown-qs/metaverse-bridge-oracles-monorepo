import React from 'react';
import 'focus-visible/dist/focus-visible'
import { createRoot } from "react-dom/client"
import { initalizeValidation } from './utils/validation';
import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from './theme';
import App from './app';
initalizeValidation();


const rootElem = document.getElementById("root")
const root = createRoot(rootElem!);
root.render(
  <ChakraProvider theme={chakraTheme}>
    <App />
  </ChakraProvider>
);
