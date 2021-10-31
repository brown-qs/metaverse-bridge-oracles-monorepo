import { Provider } from 'react-redux';
import Theme from '../theme/Theme';
import { ThemeOptionsContextController } from 'context/themeOptions/themeOptionsContextController/ThemeOptionsContextController';
import { AuthContextController } from 'context/auth/AuthContextController/AuthContextController';
import { ImportDialogContextController } from 'context/importDialog/importDialogContextController/ImportDialogContextController';
import { PurchaseDialogContextController } from 'context/purchaseDialog/purchaseDialogContextController/PurchaseDialogContextController';
import { AccountDialogContextController } from 'context/accountDialog/accountDialogContextController/AccountDialogContextController';
import { AppProvidersProps } from './AppProviders.types';
import { getLibrary } from 'connectors';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3ReactManager } from '../components/';
import Web3ReactProviderNetwork from '../components/Web3ReactProviderNetwork/Web3ReactProviderNetwork';
import ApplicationUpdater from '../state/application/updater';
import TransactionUpdater from '../state/transactions/updater';
import store from '../state';
import { CancelDialogContextController } from 'context/cancelDialog/cancelDialogContextController/CancelDialogContextController';
import { TransferDialogContextController } from 'context/transferDialog/transferDialogContextController/TransferDialogContextController';

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
    </>
  );
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ThemeOptionsContextController>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactProviderNetwork getLibrary={getLibrary}>
        <AuthContextController>
          <Provider store={store}>
            <Updaters />
            <Web3ReactManager>
              <AccountDialogContextController>
                <CancelDialogContextController>
                  <ImportDialogContextController>
                    <PurchaseDialogContextController>
                      <TransferDialogContextController>
                        <Router>
                          <Theme>{children}</Theme>
                        </Router>
                      </TransferDialogContextController>
                    </PurchaseDialogContextController>
                  </ImportDialogContextController>
                </CancelDialogContextController>
              </AccountDialogContextController>
            </Web3ReactManager>
          </Provider>
        </AuthContextController>
      </Web3ReactProviderNetwork>
    </Web3ReactProvider>
  </ThemeOptionsContextController>
);
