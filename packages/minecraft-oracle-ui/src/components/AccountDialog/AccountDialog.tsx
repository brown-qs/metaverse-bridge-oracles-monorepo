import { useDispatch } from 'react-redux';

import { injected, walletconnect } from 'connectors';
import { SUPPORTED_WALLETS } from '../../connectors';
import { useAccountDialog } from 'hooks';
import { useCallback, useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { styles as accountDialogStyles } from './AccountDialog.styles';
import { isMobile } from 'react-device-detect';
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg';
import MetamaskIcon from '../../assets/images/metamask.png';
import Identicon from '../Identicon/Identicon';
import { Transaction } from './Transaction';
import { clearAllTransactions } from 'state/transactions/actions';
import { AppDispatch } from 'state';
import { useSortedRecentTransactions } from 'state/transactions/hooks';
import { shortenAddress } from 'utils';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import OptionCard from './OptionCard';
import usePrevious from 'hooks/usePrevious/usePrevious';
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import useAddNetworkToMetamaskCb from 'hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';
import { ChainId, NETWORK_NAME, PERMISSIONED_CHAINS } from '../../constants';
import { Box, Button, CircularProgress, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from '@chakra-ui/react';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export const AccountDialog = () => {
  const styles = useClasses(accountDialogStyles);
  const dispatch = useDispatch<AppDispatch>();

  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();
  const [, setPendingError] = useState<boolean>();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const sortedRecentTransactions = useSortedRecentTransactions();
  const { addNetwork } = useAddNetworkToMetamaskCb()

  const pendingTransactions = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmedTransactions = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  const { isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose } = useAccountDialog();
  // error reporting not working (e.g. on unsupported chain id)
  const { chainId, account, connector, active, error, activate, deactivate } =
    useWeb3React();
  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && isAccountDialogOpen) {
      if (isAccountDialogOpen) {
        onAccountDialogClose()
      } else {
        onAccountDialogOpen()
      }
    }
  }, [account, previousAccount, isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose]);

  // always reset to account view
  useEffect(() => {
    if (isAccountDialogOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [isAccountDialogOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      isAccountDialogOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    isAccountDialogOpen,
    activePrevious,
    connectorPrevious,
  ]);

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return <div className={styles.walletName}>Connected with {name}</div>;
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <div className={styles.iconWrapper}>
          <Identicon />
        </div>
      );
    } else if (connector === walletconnect) {
      return (
        <div className={styles.iconWrapper}>
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </div>
      );
    }
    return null;
  }

  function renderTransactions(transactions: string[]) {
    return (
      <Stack direction={'row'}>
        {transactions.map((hash, i) => {
          return <Transaction key={i} hash={hash} />;
        })}
      </Stack>
    );
  }

  const showConnectedAccountDetails = useCallback(
    () => (
      <>
        {formatConnectorName()}
        <div className={styles.row}>
          {getStatusIcon()}
          <p> {account && shortenAddress(account)}</p>
        </div>
        <Button
          variant="outlined"
          color="primary"
          className={styles.row}
          onClick={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        >
          Change
        </Button>
      </>
    ),
    [account, activate, deactivate, styles]
  );

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = '';
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        //if (option.connector === portis) {
        //  return null
        //}

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <OptionCard
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={require('../../assets/images/' + option.iconName)}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <OptionCard
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            );
          } else {
            return null; //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <OptionCard
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require('../../assets/images/' + option.iconName).default}
          />
        )
      );
    });
  }

  /*
  const showConnectionOptions = useCallback(
    () => (
      <>
        <Button
          variant="outlined"
          color="primary"
          className={styles.button}
          onClick={() => activate(injected)}
        >
          MetaMask
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={styles.button}
          onClick={() => activate(walletconnect)}
        >
          Wallet Connect
        </Button>
        {error && (
          <div className={styles.row}>
            <Typography variant="body2" color="error">{error.message}</Typography>
          </div>
        )}
        <Typography variant="body2" className={styles.row}>
          New to Ethereum?{' '}
          <ExternalLink href="https://ethereum.org/wallets">
            Learn more about wallets
          </ExternalLink>
        </Typography>
      </>
    ),
    [activate, styles]
  );
  */

  function getModalContent() {
    if (error) {
      return (
        <div className={styles.dialogContainer}>
          {error instanceof UnsupportedChainIdError && <>
            <div>
              Unsupported network
            </div>
            <h5>Please connect to a supported Ethereum network.</h5>
            {PERMISSIONED_CHAINS.map((chainId, i) => {
              return <Button
                //className={formButton}
                key={`${chainId}-${i}`}
                onClick={() => {
                  addNetwork(chainId as ChainId)
                }}
                color="primary"
              >
                Switch to {NETWORK_NAME[chainId]}
              </Button>
            })}
          </>}

          {!(error instanceof UnsupportedChainIdError) && <>
            <div>
              Something went wrong
            </div>
            <h5>Error connecting. Try refreshing the page.</h5>
          </>}
        </div>
      );
    }

    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <>
          <div className={styles.dialogContainer}>
            {showConnectedAccountDetails()}
          </div>
          {account &&
            (!!pendingTransactions.length || !!confirmedTransactions.length) ? (
            <Stack className={styles.lowerSection}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Text>Recent transactions</Text>
                <Button
                  //className={styles.linkStyledButton}
                  onClick={clearAllTransactionsCallback}
                >
                  (clear all)
                </Button>
              </Stack>
              {renderTransactions(pendingTransactions)}
              {renderTransactions(confirmedTransactions)}
            </Stack>
          ) : (
            <div className={styles.lowerSection}>
              <Text>Your transactions will appear here...</Text>
            </div>
          )}
        </>
      );
    }
    return (
      <div className={styles.dialogContainer}>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <Button
            className={styles.titleSlot}
            variant="outlined"
            color="primary"
            onClick={() => {
              setPendingError(false);
              setWalletView(WALLET_VIEWS.ACCOUNT);
            }}
          >
            Back
          </Button>
        ) : (
          <span className={styles.titleSlot}>Connect to a wallet</span>
        )}
        {walletView === WALLET_VIEWS.PENDING ? (
          <>
            <CircularProgress />
            {error ? (
              <Text className={styles.walletPendingText}>
                Error connecting
              </Text>
            ) : (
              <Text className={styles.walletPendingText}>
                Initializing...
              </Text>
            )}
          </>
        ) : (
          getOptions()
        )}
        {walletView !== WALLET_VIEWS.PENDING && (
          <Text variant="body2" className={styles.row}>
            New to Ethereum? &nbsp;
            <ExternalLink href="https://ethereum.org/wallets">
              Learn more about wallets
            </ExternalLink>
          </Text>
        )}
      </div>
    );
  }

  return (

    <Modal isOpen={isAccountDialogOpen} onClose={onAccountDialogClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onAccountDialogClose}>
            Close
          </Button>
          <Button variant='ghost'>Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>


  );
};

/**
 * <div className={styles.dialogContainer}>
        {account ? showConnectedAccountDetails() : getOptions()}
      </div>
      {account && (!!pendingTransactions.length || !!confirmedTransactions.length) ? (
        <div className={styles.lowerSection}>
          <div className={styles.autoRow}>
            <Typography>Recent transactions</Typography>
            <Button className={styles.linkStyledButton} onClick={clearAllTransactionsCallback}>(clear all)</Button>
          </div>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </div>
      ) : (
        <div className={styles.lowerSection}>
          <Typography>Your transactions will appear here...</Typography>
        </div>
      )}
 * 
 */
