import { AbstractConnector } from '@web3-react/abstract-connector';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { NetworkConnector } from './NetworkConnector';
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from '@web3-react/walletconnect-connector';
import {
  DEFAULT_CHAIN,
  PERMISSIONED_CHAINS,
  POLLING_INTERVAL,
  RPC_URLS,
} from '../constants';

import {
  TalismanConnector,
  UserRejectedRequestError as UserRejectedRequestErrorTalisman,
  NoEthereumProviderError as NoEthereumProviderErrorTalisman,
} from '@talismn/web3react-v6-connector';
import MetamaskImage from "../assets/images/metamask.svg"
import TalismanImage from "../assets/images/talisman.svg"
import NovaImage from "../assets/images/nova.svg"

// if (typeof RPC_URL === 'undefined') {
//   throw new Error(`REACT_APP_RPC_URL must be a defined environment variable`);
// }

export const getConnectorErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof NoEthereumProviderErrorTalisman) {
    return 'Talisman extension is not installed, please visit https://talisman.xyz to download it.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorTalisman
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
};

export const getLibrary = (provider: ExternalProvider) => {
  const library = new Web3Provider(provider, 'any');
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

export const injected = new InjectedConnector({
  supportedChainIds: PERMISSIONED_CHAINS,
});

export const talisman = new TalismanConnector({
  supportedChainIds: PERMISSIONED_CHAINS,
});

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: DEFAULT_CHAIN,
});

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  qrcode: true,
  pollingInterval: 5000,
  bridge: 'https://bridge.walletconnect.org',
  //chainId: CHAIN_ID,
  supportedChainIds: PERMISSIONED_CHAINS,
});


export interface WalletInfo {
  connector: AbstractConnector;
  name: string;
  checkSupportFunc: () => boolean; //how wallet appears on window.ethereum
  checkInstallationFunc: () => boolean; //how wallet appears on window.ethereum
  description: string;
  href: string;
  imageUrl: string;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    connector: injected,
    name: 'MetaMask',
    //nova wallet i guess injects ethereum also
    checkSupportFunc: () => (
      !(!!(window as any)?.ethereum?.isNovaWallet)
    ),
    checkInstallationFunc: () => (
      !!(window as any)?.ethereum?.isMetaMask
      &&
      !(!!(window as any)?.ethereum?.isNovaWallet)
    ),
    description: 'Easy-to-use browser extension.',
    href: "https://metamask.io",
    imageUrl: MetamaskImage
  },
  {
    connector: talisman,
    name: 'Talisman',
    checkSupportFunc: () => (
      !(!!(window as any)?.ethereum?.isNovaWallet)
    ),
    checkInstallationFunc: () => (
      !!(window as any)?.talismanEth
    ),
    description: 'Talisman wallet.',
    href: "https://talisman.xyz",
    imageUrl: TalismanImage

  },
  {
    connector: injected,
    name: 'Nova',
    //it actually only runs on arm macs right now but arm macs identify themselves as MacIntel
    checkSupportFunc: () => (
      /iPhone|iPad|iPod|Android/i.test(navigator?.userAgent ?? "")
      ||
      window?.navigator?.platform === "MacIntel"
    ),
    checkInstallationFunc: () => (
      !!(window as any)?.ethereum?.isNovaWallet
    ),
    description: 'Nova mobile wallet.',
    href: "https://novawallet.io",
    imageUrl: NovaImage

  },
  /* INJECTED: {
     connector: injected,
     name: 'Injected',
     iconSvgData: `<svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9.793 16.11 7.747-7.746L9.793.616 8.259 2.151l5.122 5.105H0v2.216h13.38L8.26 14.585l1.534 1.526Z" fill="#333639"/></svg>`,
     description: 'Injected web3 provider.',
     href: undefined,
     platforms: [WalletSupportedPlatform.Mobile, WalletSupportedPlatform.Desktop, WalletSupportedPlatform.ArmMacDesktop]
   },*/

  // WALLET_CONNECT: {
  //   connector: walletconnect,
  //   name: 'WalletConnect',
  //   iconName: 'walletConnectIcon.svg',
  //   description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true,
  // },
]
