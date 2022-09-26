import React from 'react';
import { createRoot } from "react-dom/client"
import { initalizeValidation } from './utils/validation';
import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from './theme';
import App from './app';
import 'focus-visible/dist/focus-visible'

initalizeValidation();


const rootElem = document.getElementById("root")
const root = createRoot(rootElem!);
root.render(
  <ChakraProvider theme={chakraTheme}>
    <App />
  </ChakraProvider>
);
