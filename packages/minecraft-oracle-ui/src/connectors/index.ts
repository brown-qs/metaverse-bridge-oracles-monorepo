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
  iconSvgData: string;
  description: string;
  href: string;
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
    iconSvgData: `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Layer_1" x="0" y="0" version="1.1" viewBox="0 0 318.6 318.6"><style>.st1,.st6{fill:#e4761b;stroke:#e4761b;stroke-linecap:round;stroke-linejoin:round}.st6{fill:#f6851b;stroke:#f6851b}</style><path fill="#e2761b" stroke="#e2761b" stroke-linecap="round" stroke-linejoin="round" d="m274.1 35.5-99.5 73.9L193 65.8z"/><path d="m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z" class="st1"/><path d="m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z" class="st1"/><path fill="#d7c1b3" stroke="#d7c1b3" stroke-linecap="round" stroke-linejoin="round" d="m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z"/><path fill="#233447" stroke="#233447" stroke-linecap="round" stroke-linejoin="round" d="m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z"/><path fill="#cd6116" stroke="#cd6116" stroke-linecap="round" stroke-linejoin="round" d="m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"/><path fill="#e4751f" stroke="#e4751f" stroke-linecap="round" stroke-linejoin="round" d="m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z"/><path d="m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" class="st6"/><path fill="#c0ad9e" stroke="#c0ad9e" stroke-linecap="round" stroke-linejoin="round" d="m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"/><path fill="#161616" stroke="#161616" stroke-linecap="round" stroke-linejoin="round" d="m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"/><path fill="#763d16" stroke="#763d16" stroke-linecap="round" stroke-linejoin="round" d="m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"/><path d="m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z" class="st6"/></svg>`,
    description: 'Easy-to-use browser extension.',
    href: "https://metamask.io",
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
    iconSvgData: `<svg width="49" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M38.307 26.746c.456.994 1.8 1.345 2.573.572l1.416-1.417a3.75 3.75 0 1 1 5.303 5.304L36.147 42.658A14.968 14.968 0 0 1 24.669 48a14.974 14.974 0 0 1-11.825-5.77L1.82 31.206a3.75 3.75 0 0 1 5.303-5.303l1.396 1.395c.755.756 2.068.416 2.514-.555.089-.192.137-.398.137-.61V9a3.75 3.75 0 1 1 7.5 0v8.668c0 .745.763 1.251 1.474 1.027.45-.143.776-.552.776-1.024V3.75a3.75 3.75 0 1 1 7.5 0v13.921c0 .472.325.881.774 1.024.711.224 1.475-.282 1.475-1.027V9a3.75 3.75 0 1 1 7.5 0v17.125c0 .215.049.425.139.621Z" fill="#FF3D23"/><path d="M36.668 34.5s-5.372 7.5-12 7.5c-6.627 0-12-7.5-12-7.5s5.373-7.5 12-7.5c6.628 0 12 7.5 12 7.5Z" fill="#D5FF5C"/><path d="M30.303 34.5a5.634 5.634 0 1 1-11.267 0 5.634 5.634 0 0 1 11.267 0Z" stroke="#FF3D23" stroke-width=".733"/><path d="M28.052 34.5a3.384 3.384 0 1 1-6.767 0 3.384 3.384 0 0 1 6.767 0Z" stroke="#FF3D23" stroke-width=".733"/><path d="M32.553 34.5a7.884 7.884 0 1 1-15.767 0 7.884 7.884 0 0 1 15.767 0Z" stroke="#FF3D23" stroke-width=".733"/><path d="M34.802 34.5c0 5.597-4.537 10.134-10.134 10.134-5.596 0-10.133-4.537-10.133-10.134s4.537-10.134 10.133-10.134c5.597 0 10.134 4.537 10.134 10.134Z" stroke="#FF3D23" stroke-width=".733"/><path d="M25.803 34.5a1.134 1.134 0 1 1-2.267 0 1.134 1.134 0 0 1 2.267 0Z" fill="#162BEB" stroke="#FF3D23" stroke-width=".733"/><circle cx="24.669" cy="34.5" fill="#FF3D23" r="1.5"/><path d="M13.201 34.597a18.31 18.31 0 0 1-.075-.097l.075-.097a24.893 24.893 0 0 1 3.221-3.376c2.15-1.856 5.065-3.66 8.246-3.66s6.097 1.804 8.246 3.66a24.906 24.906 0 0 1 3.222 3.376l.075.097-.075.097a24.906 24.906 0 0 1-3.221 3.376c-2.15 1.856-5.066 3.66-8.247 3.66-3.18 0-6.096-1.804-8.245-3.66a24.903 24.903 0 0 1-3.222-3.376Z" stroke="#D5FF5C" stroke-width=".733"/></svg>`,
    description: 'Talisman wallet.',
    href: "https://talisman.xyz",
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
    iconSvgData: `<svg width="145" height="145" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" x1="138.302" y1="-63.94" x2="0" y2="205.228" gradientUnits="userSpaceOnUse"><stop offset=".206"/><stop offset=".37" stop-color="#541e7e"/><stop offset=".471" stop-color="#3f51d1"/><stop offset=".609" stop-color="#73afe3"/><stop offset=".801" stop-color="#90d7ff"/></linearGradient><path fill="url(#a)" d="M0 40C0 17.909 17.909 0 40 0h65c22.091 0 40 17.909 40 40v65c0 22.091-17.909 40-40 40H40c-22.091 0-40-17.909-40-40V40Z"/><path fill="#fff" d="M71.515 24.622c.193-1.103 1.777-1.103 1.97 0l5.78 32.989a10 10 0 0 0 8.124 8.124l32.989 5.78c1.103.193 1.103 1.777 0 1.97l-32.989 5.78a10 10 0 0 0-8.124 8.124l-5.78 32.989c-.193 1.103-1.777 1.103-1.97 0l-5.78-32.989a10 10 0 0 0-8.124-8.124l-32.99-5.78c-1.102-.193-1.102-1.777 0-1.97l32.99-5.78a10 10 0 0 0 8.124-8.124l5.78-32.99Z"/></svg>`,
    description: 'Nova mobile wallet.',
    href: "https://novawallet.io",
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
