import { ChainId } from "./index";

export interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
}

export const SUPPORTED_METAMASK_NETWORKS: { [key: number]: AddEthereumChainParameter } = {
    [ChainId.MOONRIVER]: {
        chainId: '0x505',
        chainName: 'Moonriver',
        rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
        blockExplorerUrls: ['https://moonriver.moonscan.io'],
        nativeCurrency: {
            name: 'Moonriver',
            symbol: 'MOVR',
            decimals: 18
        }
    },
    [ChainId.MOONBEAM]: {
        chainId: '0x504',
        chainName: 'Moonbeam',
        rpcUrls: ['https://rpc.api.moonbeam.network'],
        blockExplorerUrls: ['https://moonscan.io'],
        nativeCurrency: {
            name: 'Moonbeam',
            symbol: 'GLMR',
            decimals: 18
        }
    },
    [ChainId.MAINNET]: {
        chainId: '0x1',
        chainName: 'Ethereum',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        }
    },
    [ChainId.ROPSTEN]: {
        chainId: '0x3',
        chainName: 'Ropsten',
        rpcUrls: ['https://ropsten.infura.io/v3/'],
        blockExplorerUrls: ['https://ropsten.etherscan.io'],
        nativeCurrency: {
            name: 'Ropsten',
            symbol: 'ETH',
            decimals: 18
        }
    },
    [ChainId.EXOSAMANETWORK]: {
        chainId: '0x83D',
        chainName: 'Exosama Network',
        rpcUrls: ['https://rpc.exosama.com'],
        blockExplorerUrls: ['https://explorer.exosama.com'],
        nativeCurrency: {
            name: 'Exosama Network',
            symbol: 'SAMA',
            decimals: 18
        },
        iconUrls: ["https://raw.githubusercontent.com/nico-ma1/Exosama-Network-Brand/main/sama-token.svg"]
    }
}