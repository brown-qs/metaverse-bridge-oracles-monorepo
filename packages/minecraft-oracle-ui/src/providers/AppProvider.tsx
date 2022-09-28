import { Provider } from 'react-redux';
import { AuthContextController } from '../context/auth/AuthContextController/AuthContextController';
import { AccountDialogContextController } from '../context/accountDialog/accountDialogContextController/AccountDialogContextController';
import { AppProvidersProps } from './AppProviders.types';
import { getLibrary } from '../connectors';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3ReactManager } from '../components/';
import Web3ReactProviderNetwork from '../components/Web3ReactProviderNetwork/Web3ReactProviderNetwork';
import ApplicationUpdater from '../state/application/updater';
import TransactionUpdater from '../state/transactions/updater';
import store from '../state';
import { TransferDialogContextController } from '../context/transferDialog/transferDialogContextController/TransferDialogContextController';
import { AssetDialogContextController } from '../context/assetDialog/assetDialogContextController/assetDialogContextController';
import { ChakraProvider } from '@chakra-ui/react'
import { CaptchaContext } from '../context/captcha/captchaContext/captchaContext';
import { CaptchaContextController } from '../context/captcha/captchaContextController/captchaContextController';
import ScrollToTop from '../components/ScrollToTop';

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
    </>
  );
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <CaptchaContextController>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactProviderNetwork getLibrary={getLibrary}>
        <AuthContextController>
          <Provider store={store}>
            <Updaters />
            <Web3ReactManager>
              <AccountDialogContextController>
                <TransferDialogContextController>
                  <AssetDialogContextController>
                    <Router>
                      <ScrollToTop></ScrollToTop>
                      {children}
                    </Router>
                  </AssetDialogContextController>
                </TransferDialogContextController>

              </AccountDialogContextController>
            </Web3ReactManager>
          </Provider>
        </AuthContextController>
      </Web3ReactProviderNetwork>
    </Web3ReactProvider>
  </CaptchaContextController>
);
