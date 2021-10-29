export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID ?? '246', 10);

export const SUBGRAPH_URL =
  process.env.REACT_APP_SUBGRAPH_URL ??
  'http://localhost:8000/subgraphs/name/moonriver/marketplace';

export const NFT_SUBGRAPH_URL =
  process.env.REACT_APP_NFT_SUBGRAPH_URL ??
  'http://localhost:8000/subgraphs/name/moonriver/testnft';

export const METAVERSE_SUBGRAPH_URL =
  process.env.REACT_APP_NFT_SUBGRAPH_URL ??
  'http://localhost:8000/subgraphs/name/moonriver/moonsama/metaverse-bridge';

export const NetworkContextName = 'NETWORK';

export const DEFAULT_ORDERBOOK_PAGINATION: number = 100;

export const POLLING_INTERVAL = 15000;
export const SUBGRAPH_MAX_BLOCK_DELAY = 2;

export const PINATA_GATEWAY =
  process.env.REACT_APP_PINATA_IPFS_URL ??
  'https://moonsama.mypinata.cloud/ipfs/';

console.log('SUBGRAPH_URL', { SUBGRAPH_URL, CHAIN_ID });

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC = 56,
  EWC = 246,
  VOLTA = 73799,
  MOONRIVER = 1285,
}

export const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.VOLTA]: '0xf097d0eAb2dC8B6396a6433978567C443a691815', // latest multicall 2 deployments
  [ChainId.MOONRIVER]: '0x8B60499C8e99d1218Df15ba6e8f0937e1878b86c', // latest multicall 2 deployments
};

export enum SUPPORTED_CONTRACTS {
  'ENS_RESOLVER' = 'ENS_RESOLVER',
}

export const MARKETPLACE_V1_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0xE1681925E9d1fa2c735184835b348a98c34017C7',
  [ChainId.MOONRIVER]: '0x56f33FaAc598f6761bE886506bD41eC2304D74af',
};

export const WAREHOUSE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0xE796e4CC54856b5d88E44aAca85e3B7D633c34a1',
  [ChainId.MOONRIVER]: '0xe41509E3034f3f1C7Ea918423Da60B2bA6F14087',
};

export const RECOGNIZED_COLLECTIONS_ADDRESS: { [chainId in ChainId]?: string } =
  {
    [ChainId.VOLTA]: '0xe35D9ACD226165d21d8bC7cf2C6D71b0deCb67d6',
    [ChainId.MOONRIVER]: '0x45613dAd51D4262dB6c0F94Fc96435D8800500cD',
  };

export const WMOVR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0xcBe8903EFA22711608D2f0B9aA09852f9B30DBdc', //0xFF3e85e33A8Cfc73fe08F437bFAEADFf7C95e285
  [ChainId.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
};

export const EXPLORER_URL: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: 'https://volta-explorer.energyweb.org',
  [ChainId.MOONRIVER]: 'https://blockscout.moonriver.moonbeam.network',
};

export const METAVERSE_V1_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0x58df3876BcE94941DE59088c5963781984EF264b',
  [ChainId.MOONRIVER]: 'https://blockscout.moonriver.moonbeam.network',
};

export const PROTOCOL_FEE_BPS = '200';
export const FRACTION_TO_BPS = '10000';

export const STRATEGY_SIMPLE =
  '0xb4c34ccd96d70009be083eaea45c708dff031622381acfcf6e3d07039aca39bb';

export const IPFS_GATEWAYS = [
  'https://moonsama.mypinata.cloud',
  'https://cloudflare-ipfs.com',
  'https://ipfs.io',
];

export const MAX_WIDTH_TO_SHOW_NAVIGATION = 1000;
