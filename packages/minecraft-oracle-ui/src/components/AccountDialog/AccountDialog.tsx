import { useDispatch } from 'react-redux';

import { injected, walletconnect } from 'connectors';
import { SUPPORTED_WALLETS } from '../../connectors';
import { useAccountDialog } from 'hooks';
import { useCallback, useEffect, useState } from 'react';
import { useClasses } from 'hooks';
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
  const metamaskIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zOmV2PSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHMiCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMTguNiAzMTguNiIKCSBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMTguNiAzMTguNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNFMjc2MUI7c3Ryb2tlOiNFMjc2MUI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KCS5zdDF7ZmlsbDojRTQ3NjFCO3N0cm9rZTojRTQ3NjFCO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9Cgkuc3Qye2ZpbGw6I0Q3QzFCMztzdHJva2U6I0Q3QzFCMztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQoJLnN0M3tmaWxsOiMyMzM0NDc7c3Ryb2tlOiMyMzM0NDc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KCS5zdDR7ZmlsbDojQ0Q2MTE2O3N0cm9rZTojQ0Q2MTE2O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9Cgkuc3Q1e2ZpbGw6I0U0NzUxRjtzdHJva2U6I0U0NzUxRjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQoJLnN0NntmaWxsOiNGNjg1MUI7c3Ryb2tlOiNGNjg1MUI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KCS5zdDd7ZmlsbDojQzBBRDlFO3N0cm9rZTojQzBBRDlFO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9Cgkuc3Q4e2ZpbGw6IzE2MTYxNjtzdHJva2U6IzE2MTYxNjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQoJLnN0OXtmaWxsOiM3NjNEMTY7c3Ryb2tlOiM3NjNEMTY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KPC9zdHlsZT4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIyNzQuMSwzNS41IDE3NC42LDEwOS40IDE5Myw2NS44ICIvPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNDQuNCwzNS41IDE0My4xLDExMC4xIDEyNS42LDY1LjggCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIyMzguMywyMDYuOCAyMTEuOCwyNDcuNCAyNjguNSwyNjMgMjg0LjgsMjA3LjcgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIzMy45LDIwNy43IDUwLjEsMjYzIDEwNi44LDI0Ny40IDgwLjMsMjA2LjggCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMDMuNiwxMzguMiA4Ny44LDE2Mi4xIDE0NC4xLDE2NC42IDE0Mi4xLDEwNC4xIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMjE0LjksMTM4LjIgMTc1LjksMTAzLjQgMTc0LjYsMTY0LjYgMjMwLjgsMTYyLjEgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMDYuOCwyNDcuNCAxNDAuNiwyMzAuOSAxMTEuNCwyMDguMSAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjE3Ny45LDIzMC45IDIxMS44LDI0Ny40IDIwNy4xLDIwOC4xIAkiLz4KPC9nPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDIiIHBvaW50cz0iMjExLjgsMjQ3LjQgMTc3LjksMjMwLjkgMTgwLjYsMjUzIDE4MC4zLDI2Mi4zIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDIiIHBvaW50cz0iMTA2LjgsMjQ3LjQgMTM4LjMsMjYyLjMgMTM4LjEsMjUzIDE0MC42LDIzMC45IAkiLz4KPC9nPgo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjEzOC44LDE5My41IDExMC42LDE4NS4yIDEzMC41LDE3Ni4xICIvPgo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjE3OS43LDE5My41IDE4OCwxNzYuMSAyMDgsMTg1LjIgIi8+CjxnPgoJPHBvbHlnb24gY2xhc3M9InN0NCIgcG9pbnRzPSIxMDYuOCwyNDcuNCAxMTEuNiwyMDYuOCA4MC4zLDIwNy43IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDQiIHBvaW50cz0iMjA3LDIwNi44IDIxMS44LDI0Ny40IDIzOC4zLDIwNy43IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDQiIHBvaW50cz0iMjMwLjgsMTYyLjEgMTc0LjYsMTY0LjYgMTc5LjgsMTkzLjUgMTg4LjEsMTc2LjEgMjA4LjEsMTg1LjIgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0NCIgcG9pbnRzPSIxMTAuNiwxODUuMiAxMzAuNiwxNzYuMSAxMzguOCwxOTMuNSAxNDQuMSwxNjQuNiA4Ny44LDE2Mi4xIAkiLz4KPC9nPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDUiIHBvaW50cz0iODcuOCwxNjIuMSAxMTEuNCwyMDguMSAxMTAuNiwxODUuMiAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3Q1IiBwb2ludHM9IjIwOC4xLDE4NS4yIDIwNy4xLDIwOC4xIDIzMC44LDE2Mi4xIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDUiIHBvaW50cz0iMTQ0LjEsMTY0LjYgMTM4LjgsMTkzLjUgMTQ1LjQsMjI3LjYgMTQ2LjksMTgyLjcgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0NSIgcG9pbnRzPSIxNzQuNiwxNjQuNiAxNzEuOSwxODIuNiAxNzMuMSwyMjcuNiAxNzkuOCwxOTMuNSAJIi8+CjwvZz4KPHBvbHlnb24gY2xhc3M9InN0NiIgcG9pbnRzPSIxNzkuOCwxOTMuNSAxNzMuMSwyMjcuNiAxNzcuOSwyMzAuOSAyMDcuMSwyMDguMSAyMDguMSwxODUuMiAiLz4KPHBvbHlnb24gY2xhc3M9InN0NiIgcG9pbnRzPSIxMTAuNiwxODUuMiAxMTEuNCwyMDguMSAxNDAuNiwyMzAuOSAxNDUuNCwyMjcuNiAxMzguOCwxOTMuNSAiLz4KPHBvbHlnb24gY2xhc3M9InN0NyIgcG9pbnRzPSIxODAuMywyNjIuMyAxODAuNiwyNTMgMTc4LjEsMjUwLjggMTQwLjQsMjUwLjggMTM4LjEsMjUzIDEzOC4zLDI2Mi4zIDEwNi44LDI0Ny40IDExNy44LDI1Ni40IAoJMTQwLjEsMjcxLjkgMTc4LjQsMjcxLjkgMjAwLjgsMjU2LjQgMjExLjgsMjQ3LjQgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDgiIHBvaW50cz0iMTc3LjksMjMwLjkgMTczLjEsMjI3LjYgMTQ1LjQsMjI3LjYgMTQwLjYsMjMwLjkgMTM4LjEsMjUzIDE0MC40LDI1MC44IDE3OC4xLDI1MC44IDE4MC42LDI1MyAiLz4KPGc+Cgk8cG9seWdvbiBjbGFzcz0ic3Q5IiBwb2ludHM9IjI3OC4zLDExNC4yIDI4Ni44LDczLjQgMjc0LjEsMzUuNSAxNzcuOSwxMDYuOSAyMTQuOSwxMzguMiAyNjcuMiwxNTMuNSAyNzguOCwxNDAgMjczLjgsMTM2LjQgCgkJMjgxLjgsMTI5LjEgMjc1LjYsMTI0LjMgMjgzLjYsMTE4LjIgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0OSIgcG9pbnRzPSIzMS44LDczLjQgNDAuMywxMTQuMiAzNC45LDExOC4yIDQyLjksMTI0LjMgMzYuOCwxMjkuMSA0NC44LDEzNi40IDM5LjgsMTQwIDUxLjMsMTUzLjUgMTAzLjYsMTM4LjIgCgkJMTQwLjYsMTA2LjkgNDQuNCwzNS41IAkiLz4KPC9nPgo8cG9seWdvbiBjbGFzcz0ic3Q2IiBwb2ludHM9IjI2Ny4yLDE1My41IDIxNC45LDEzOC4yIDIzMC44LDE2Mi4xIDIwNy4xLDIwOC4xIDIzOC4zLDIwNy43IDI4NC44LDIwNy43ICIvPgo8cG9seWdvbiBjbGFzcz0ic3Q2IiBwb2ludHM9IjEwMy42LDEzOC4yIDUxLjMsMTUzLjUgMzMuOSwyMDcuNyA4MC4zLDIwNy43IDExMS40LDIwOC4xIDg3LjgsMTYyLjEgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDYiIHBvaW50cz0iMTc0LjYsMTY0LjYgMTc3LjksMTA2LjkgMTkzLjEsNjUuOCAxMjUuNiw2NS44IDE0MC42LDEwNi45IDE0NC4xLDE2NC42IDE0NS4zLDE4Mi44IDE0NS40LDIyNy42IAoJMTczLjEsMjI3LjYgMTczLjMsMTgyLjggIi8+Cjwvc3ZnPgo="
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
      <Stack direction={'row'}>
        {transactions.map((hash, i) => {
          return <Transaction key={i} hash={hash} />;
        })}
      </Stack>
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
                iconUrl={metamaskIcon}

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
            iconUrl={metamaskIcon}
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
      <VStack lineHeight="24px" fontSize="16px" color="whiteAlpha.700" fontFamily="Rubik">
        {showConnectedAccountDetails()}
        {account &&
          (!!pendingTransactions.length || !!confirmedTransactions.length) ? (
          <Stack fontSize="12px" >
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Text>Recent transactions</Text>
              <Button
                onClick={clearAllTransactionsCallback}
              >
                (clear all)
              </Button>
            </Stack>
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
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
