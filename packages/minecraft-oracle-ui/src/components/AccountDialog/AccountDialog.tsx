import { useDispatch } from 'react-redux';

import { injected, walletconnect } from 'connectors';
import { SUPPORTED_WALLETS } from '../../connectors';
import { useAccountDialog } from 'hooks';
import { useCallback, useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { isMobile } from 'react-device-detect';
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg';
import MetamaskIcon from '../../assets/images/metamask.svg';

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
import { Image, Box, Button, CircularProgress, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, VStack, HStack } from '@chakra-ui/react';
import { ArrowsRightLeft, MessageReport } from 'tabler-icons-react';
import { ModalIcon } from '../MoonsamaModal/ModalIcon';
import { MoonsamaModal } from '../MoonsamaModal';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export const AccountDialog = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();
  const [, setPendingError] = useState<boolean>();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const sortedRecentTransactions = useSortedRecentTransactions();
  //console.log("sortedRecentTransactions: ", sortedRecentTransactions)
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
    return <Box w="100%">Connected with {name}</Box>;
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <div >
          <Identicon />
        </div>
      );
    } else if (connector === walletconnect) {
      return (
        <div >
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </div>
      );
    }
    return null;
  }

  function renderTransactions(transactions: string[]) {
    return (
      <>
        {transactions.map((hash, i) => {
          return <Transaction key={i} hash={hash} />;
        })}
      </>
    );
  }

  const showConnectedAccountDetails = useCallback(
    () => (
      <VStack w="100%">
        <Box w="100%">{formatConnectorName()}</Box>
        <HStack w="100%">
          <Box>{getStatusIcon()}</Box>
          <Box lineHeight="24px" fontSize="16px" color="whiteAlpha.700" fontFamily="Rubik">{account && shortenAddress(account)}</Box>
        </HStack>
      </VStack>

    ),
    [account, activate, deactivate]
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
              iconUrl={`../../assets/images/${option.iconName}`}
            //icon={<img src={require('../../assets/images/' + option.iconName)}></img>}
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
              < OptionCard
                id={`connect-${key}`
                }
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                iconUrl={MetamaskIcon}

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
            header={option.name.toUpperCase()}
            subheader={null} //use option.descriptio to bring back multi-line
            iconUrl={MetamaskIcon}
          />
        )
      );
    });
  }


  const newToEthereumElem = (<>
    <HStack fontFamily="Rubik" alignItems="center" w="100%">
      <Text color="whiteAlpha.700" fontSize="12px">New to Ethereum?</Text>
      <ExternalLink href="https://ethereum.org/wallets">
        <Text color="teal.200" _hover={{ textDecoration: "underline" }}>Learn more about wallets</Text>
      </ExternalLink>
    </HStack>
  </>)
  if (error && error instanceof UnsupportedChainIdError) {
    return (<MoonsamaModal
      title="Unsupported network"
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
      TablerIcon={MessageReport}
      iconBackgroundColor="yellow.300"
      iconColor="black"
      message="Please connect to a supported network."
    >
      {PERMISSIONED_CHAINS.map((chainId, i) => {
        return <Button
          width="100%"
          key={`${chainId}-${i}`}
          leftIcon={<ArrowsRightLeft />}
          onClick={() => {
            addNetwork(chainId as ChainId)
          }}
        >
          Switch to {NETWORK_NAME[chainId]}
        </Button>
      })}
    </MoonsamaModal>)
  } else if (error && !(error instanceof UnsupportedChainIdError)) {
    return (<MoonsamaModal
      title="Something went wrong"
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
      TablerIcon={MessageReport}
      iconBackgroundColor="yellow.300"
      iconColor="black"
      message="Error connecting. Try refreshing the page."
    >
    </MoonsamaModal>)
  } else if (walletView === WALLET_VIEWS.PENDING) {
    return (<MoonsamaModal
      title="Initializing wallet..."
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
    >
      <VStack alignItems="center" spacing="0">
        <Box>
          <CircularProgress isIndeterminate color="teal" />
        </Box>
      </VStack>
    </MoonsamaModal>)
  } else if (!account) {
    return (<MoonsamaModal
      title="Wallet"
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
      message="Connect to a wallet"
    >
      <VStack alignItems="center" spacing="0" w="100%">
        <Box w="100%">
          {getOptions()}
        </Box>
        <Box paddingTop="16px">
          {newToEthereumElem}
        </Box>
      </VStack>
    </MoonsamaModal>)
  } else if (account && walletView === WALLET_VIEWS.ACCOUNT) {
    return (<MoonsamaModal
      title="Wallet"
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
      bottomButtonText="Change Wallet"
      onBottomButtonClick={() => setWalletView(WALLET_VIEWS.OPTIONS)}
    >
      <VStack lineHeight="24px" fontSize="16px" color="whiteAlpha.700" fontFamily="Rubik" w="100%">
        {showConnectedAccountDetails()}
        {account &&
          (!!pendingTransactions.length || !!confirmedTransactions.length) ? (
          <Stack fontSize="12px" w="100%">
            <VStack w="100%">
              <Box>
                <Text>Recent transactions</Text>
              </Box>

              {renderTransactions(pendingTransactions)}
              {renderTransactions(confirmedTransactions)}
              <Box w="100%">
                <Button
                  w="100%"
                  onClick={clearAllTransactionsCallback}
                >
                  CLEAR ALL
                </Button>
              </Box>
            </VStack>

          </Stack>
        ) : (
          <Box fontSize="12px">
            <Text>Your transactions will appear here...</Text>
          </Box>
        )}
      </VStack>
    </MoonsamaModal>)
  } else if (account && walletView === WALLET_VIEWS.OPTIONS) {
    return (<MoonsamaModal
      title="Change wallet"
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
      bottomButtonText="Back"
      onBottomButtonClick={() => {
        setPendingError(false);
        setWalletView(WALLET_VIEWS.ACCOUNT);
      }}
    >
      {getOptions()}

    </MoonsamaModal>)
  } else {
    return (<MoonsamaModal
      title="Wallet"
      isOpen={isAccountDialogOpen}
      onClose={onAccountDialogClose}
      message="Connect to a wallet"
    >
    </MoonsamaModal>)
  }

};
