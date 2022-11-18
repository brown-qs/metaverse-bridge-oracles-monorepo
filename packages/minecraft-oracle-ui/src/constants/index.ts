import numeral from "numeral";
import { NewAsset } from "../hooks/marketplace/types";
import { MultiverseVersion } from "../state/api/types";
import { StandardizedMetadata } from "../utils/graphqlReformatter";
import { StringAssetType } from "../utils/subgraph";
import PoopImage from "../assets/images/poop.svg"
import SamaImage from "../assets/images/sama.svg"

import BetaPumpkin from "../assets/images/resource/1.png"
import BetaBloodCrystals from "../assets/images/resource/2.png"
import BetaDna from "../assets/images/resource/3.png"
import BetaMobidium from "../assets/images/resource/4.png"
import BetaWood from "../assets/images/resource/5.png"
import BetaStone from "../assets/images/resource/6.png"
import BetaIron from "../assets/images/resource/7.png"
import BetaGold from "../assets/images/resource/8.png"




//["Alpha Wood", "Alpha Stone", "Alpha Iron", "Alpha Gold", "Alpha Experience", "Alpha Bullets", "Alpha Grenades", "Alpha Shampoo", "Alpha Snacks", "Alpha Grain", "Alpha String", "Alpha Fish", "Alpha Bait", "Alpha Moonstone", "Beta Pumpkin", "Beta Blood Crystals", "Beta DNA", "Beta Mobidium"]
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1285', 10);

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

//console.log('SUBGRAPH_URL', { SUBGRAPH_URL, CHAIN_ID });

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
  MOONBEAM = 1284,
  EXOSAMANETWORK = 2109,
}

export const PERMISSIONED_CHAINS = [ChainId.EXOSAMANETWORK, ChainId.MAINNET, ChainId.MOONBEAM, ChainId.MOONRIVER]
export const DEFAULT_CHAIN = ChainId.MOONRIVER

export const RPC_URLS: { [chainId: number]: string } = {
  [ChainId.MOONRIVER]: 'https://rpc.api.moonriver.moonbeam.network',
  [ChainId.MOONBEAM]: 'https://moonbeam-rpc.moonsama.com',
  [ChainId.MAINNET]: 'https://cloudflare-eth.com',
  [ChainId.ROPSTEN]: 'https://ropsten.infura.io/v3/',
  [ChainId.EXOSAMANETWORK]: 'https://rpc.exosama.com'
};

export const NATIVE_TOKEN_SYMBOL: { [chainId: number]: string } = {
  [ChainId.MOONRIVER]: 'MOVR',
  [ChainId.MOONBEAM]: 'GLMR',
  [ChainId.MAINNET]: 'ETH',
  [ChainId.ROPSTEN]: 'ETH',
  [ChainId.EXOSAMANETWORK]: 'SAMA'
};

export const NETWORK_NAME: { [chainId: number]: string } = {
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.MOONBEAM]: 'Moonbeam',
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.EXOSAMANETWORK]: 'Exosama Network',
};

export const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696', // latest V2
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.VOLTA]: '0xf097d0eAb2dC8B6396a6433978567C443a691815', // latest multicall 2 deployments
  [ChainId.MOONRIVER]: '0x8B60499C8e99d1218Df15ba6e8f0937e1878b86c', // latest multicall 2 deployments
  [ChainId.MOONBEAM]: '0x7A88A713F806073e0027179E2DfeD4100b888F25', // latest multicall v2
  [ChainId.EXOSAMANETWORK]: '0x24177dbba8b87d61c0aae341202b7dc5e772fea1',
};

export enum SUPPORTED_CONTRACTS {
  'ENS_RESOLVER' = 'ENS_RESOLVER',
}

export const MARKETPLACE_V1_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0xE1681925E9d1fa2c735184835b348a98c34017C7',
  [ChainId.MOONRIVER]: '0x56f33FaAc598f6761bE886506bD41eC2304D74af',
  [ChainId.MOONBEAM]: '0x46B6062Ad95239e30E3506f42147D5cCA00B5f0E'
};

export const WAREHOUSE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0xE796e4CC54856b5d88E44aAca85e3B7D633c34a1',
  [ChainId.MOONRIVER]: '0xe41509E3034f3f1C7Ea918423Da60B2bA6F14087',
  [ChainId.MOONBEAM]: '0x108E9B2BFB98402208E4172f5045BF605F148eEb',
  [ChainId.EXOSAMANETWORK]: '0x108E9B2BFB98402208E4172f5045BF605F148eEb'
};

export const RECOGNIZED_COLLECTIONS_ADDRESS: { [chainId in ChainId]?: string } =
{
  [ChainId.VOLTA]: '0xe35D9ACD226165d21d8bC7cf2C6D71b0deCb67d6',
  [ChainId.MOONRIVER]: '0x45613dAd51D4262dB6c0F94Fc96435D8800500cD',
  [ChainId.MOONBEAM]: '0x9b7c849864F246b1A963fdbbbfC198083e646e5b'
};

export const WMOVR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0xcBe8903EFA22711608D2f0B9aA09852f9B30DBdc', //0xFF3e85e33A8Cfc73fe08F437bFAEADFf7C95e285
  [ChainId.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
};

export const EXPLORER_URL: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: 'https://volta-explorer.energyweb.org',
  [ChainId.MOONRIVER]: 'https://moonriver.moonscan.io/',
  [ChainId.MOONBEAM]: 'https://moonbeam.moonscan.io/',
  [ChainId.EXOSAMANETWORK]: 'https://explorer.exosama.com/'
};

export const MULTIVERSE_BRIDGE_V1_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0x58df3876BcE94941DE59088c5963781984EF264b',
  [ChainId.MOONRIVER]: '0x59C481548CE7BA13f3288df9f4FCf44a10A589A0'//'0x7D5ebDb88D3bd969CC909FD49f1FF3A7bA1F4878',
};

export const MULTIVERSE_BRIDGE_V1_WAREHOUSE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.VOLTA]: '0x58df3876BcE94941DE59088c5963781984EF264b',
  [ChainId.MOONRIVER]: '0x59C481548CE7BA13f3288df9f4FCf44a10A589A0'
};

export const MULTIVERSE_BRIDGE_V2_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MOONRIVER]: '0x1ff3097f4a82913d690d2a59de613378ae2b3c05',
  [ChainId.MOONBEAM]: '0xbE122F9F612537Cb76020Ee63C32A07A6F7F4376',
  [ChainId.MAINNET]: '0xaF1F85aD24Bc45fb19f5F8B5166e1Aed41c60844'
};

export const MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MOONRIVER]: '0x59C481548CE7BA13f3288df9f4FCf44a10A589A0',
  [ChainId.MOONBEAM]: '0x6D73E2920A92931be76F487a2E29F67b4D7858F9',
  [ChainId.MAINNET]: '0xbC0d0c5E67fC0d7834a0e3B8Acf741d1F5b78ca5'
};

export const getContractAddress = (mv: MultiverseVersion, chainId: ChainId): string => {
  let address: string | undefined
  if (mv === MultiverseVersion.V1) {
    address = MULTIVERSE_BRIDGE_V1_ADDRESS[chainId]

  } else {
    address = MULTIVERSE_BRIDGE_V2_ADDRESS[chainId]
  }
  if (!address) {
    throw new Error("Unable to find bridge contract address.")
  }
  return address
}

export const PROTOCOL_FEE_BPS = '200';
export const FRACTION_TO_BPS = '10000';

export const STRATEGY_SIMPLE =
  '0xb4c34ccd96d70009be083eaea45c708dff031622381acfcf6e3d07039aca39bb';

export const IPFS_GATEWAYS = [
  'https://moonsama.mypinata.cloud',
  'https://cloudflare-ipfs.com',
  'https://ipfs.io',
];

export const MAX_WIDTH_TO_SHOW_NAVIGATION = 1360;


export const BURNABLE_RESOURCES_IDS = ['14']

export interface SubAsset {
  assetAddress: string,
  assetId: number,
  imageUrl: string,
  symbol: string,
  subAssetAddress: string
}
export const SUB_ASSETS: SubAsset[] = [
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 1,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmNdUtqAh5LUvZkBggP5nhwwdCMxw7pybY7Zd4NXq52yAr',
    symbol: 'aWOOD',
    subAssetAddress: '0x8ce2bdc6e0319cea87337d027382f09b715c9601'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 2,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmcNaV3KZJQWAVCxZHzZe4ocTY3ZGSnjmk3SL8s6s8mpDR',
    symbol: 'aSTONE',
    subAssetAddress: '0x77709c42d43f2e53c24b8fa623a207abdc89857c'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 3,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmYYrvPNCrXzxqvmPPZZjFLvbJ91dWNsDDfJjw8YRq2LT9',
    symbol: 'aIRON',
    subAssetAddress: '0x9e403aa2dfef9ba2a2b82286d13864a64d90bf36'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 4,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/Qme4L8AzwAMLGSyXA9m3toLtGMUGxgWGcHuJ3PoBhbtA5f',
    symbol: 'aGOLD',
    subAssetAddress: '0x088fe6e0e1caca1ee45e8de96abe79e4e139f4ab'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 5,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmRzPjD55zpp3ped7CQFxypgtVktZt7MXQuKpv5PrnaDrq',
    symbol: 'aEXP',
    subAssetAddress: '0x138a90f246abb23a157da7a1d9db19dcf1691362'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 6,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmUdTmBYLzbRhy815mqR8JkKZy6zvNpwTDdEor181Jvyxj',
    symbol: 'BULLETS',
    subAssetAddress: '0x43dd3267e5a5737e6436cda7ac93e9ff155a36e4'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 7,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmYWbqnd2siDPif48BLrT7LCECqAM3LQRMCdgPiATokEQK',
    symbol: 'GRENADES',
    subAssetAddress: '0x69c78473bf164876e503937f5b853b289e2aeb95'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 8,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmS7J3D3EwdvvUfc6tMWBpJMXnMkUgwwNQsdgGygJCBhXD',
    symbol: 'SHAMPOO',
    subAssetAddress: '0xd94b75617f756561294695f87d530b25aaed6204'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 9,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmdVcVq4kScs6KLohfAb61vdpduaMvLuqS7ddHGffa3Swr',
    symbol: 'SNACKS',
    subAssetAddress: '0x20ca4c5e273e38676daeacf0fd6662bf6839159d'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 10,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmWGg5vweosfLjz1BVse44SqZumJZ1yoo65HnNqGuUoFXo',
    symbol: 'aGRAIN',
    subAssetAddress: '0xf93e1d54c939eca89240ff3a4311a490306f0e2d'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 12,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmdwFN7e2HgDLFf4wNe4KyjCfMg3znhQHdcw3jeRTyA2HD',
    symbol: 'aSTRING',
    subAssetAddress: '0x0c0e3977c00ab4121d52ac8c6aeef9421d174458'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 13,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmS7NmoqwcaDhARhmZKw6BZ4qc2m5bKAkEF2GUwrs1URz6',
    symbol: 'aFISH',
    subAssetAddress: '0xa42c342bc0a9d9e64ee3c552ea8991b06a2fdbb5'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 14,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmUWaPzTvCdbBboDM4Xm82K43cxNaiYRdoiSGdt1s4iF7E',
    symbol: 'aBAIT',
    subAssetAddress: '0x96ae34020803cdee1aa4969076627aa473795ee7'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 15,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmVwiBPyiEir6udSzCqwdpq4R3dpZiz7vdg39u3yUCsoGN',
    symbol: 'aPOOP',
    subAssetAddress: '0x6e086cd25f280a048acd9046ebc83d998addbe88'
  },
  {
    assetAddress: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
    assetId: 16,
    imageUrl: 'https://moonsama.mypinata.cloud/ipfs/QmUE5kvmGgEwL7dwSCyhdTgtRw72NYBRbqkwXJuXWKLzyY',
    symbol: 'aMOONSTONE',
    subAssetAddress: '0xbe0b5b87ceb3eb1b05d11dc83332409291b35746'
  }
]

type HardCodedToken = StandardizedMetadata & { assetType: StringAssetType }
//STATIC TOKENS: 
export const RARESAMA_POOP: HardCodedToken = {
  assetType: StringAssetType.ERC20,
  assetAddress: "0xfffffffecb45afd30a637967995394cc88c0c194",
  assetId: 0,
  metadata: {
    name: "$POOP",
    //image: "https://static.moonsama.com/static/poop.svg"
    image: PoopImage
  }
}

export const SHIT_FART: HardCodedToken = {
  assetType: StringAssetType.ERC20,
  assetAddress: "0x2f82471dccf85d3f6cb498d4e792cfa9e875ab0a",
  assetId: 0,
  metadata: {
    name: "$SFT",
    image: PoopImage
  }
}

export const SAMA: HardCodedToken = {
  assetType: StringAssetType.NATIVE,
  assetAddress: "0x710ddbaa47a4ccdc85a507a264865260e82c18ee",
  assetId: 0,
  metadata: {
    name: "$SAMA",
    image: SamaImage
  }
}

const BASE_EXN_RSS = {
  assetType: StringAssetType.ERC1155,
  assetAddress: "0x95370351df734b6a712ba18848b47574d3e90e61"
}

export const EXN_RSS: HardCodedToken[] = [
  {
    ...BASE_EXN_RSS,
    assetId: 1,
    metadata: {
      name: "Pumkin",
      image: BetaPumpkin,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 2,
    metadata: {
      name: "Blood Crystals",
      image: BetaBloodCrystals,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 3,
    metadata: {
      name: "DNA",
      image: BetaDna,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 4,
    metadata: {
      name: "Mobidium",
      image: BetaMobidium,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 5,
    metadata: {
      name: "Wood",
      image: BetaWood,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 6,
    metadata: {
      name: "Stone",
      image: BetaStone,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 7,
    metadata: {
      name: "Iron",
      image: BetaIron,
    }
  },
  {
    ...BASE_EXN_RSS,
    assetId: 8,
    metadata: {
      name: "Gold",
      image: BetaGold,
    }
  }

]
console.log(EXN_RSS)
export function numberFormatter(num: string) {
  //needs to always be 6 digits!!
  //cant do 5 because of -10k no room for decimal place

  let tempFormat = numeral(num).format("0.00000a")

  if (tempFormat === "NaN") {
    return "<.0000"
  }
  //adds leading 0
  if (tempFormat.startsWith("0.")) {
    tempFormat = tempFormat.slice(1)
  }

  let numWithoutSignAndLetter = tempFormat
  let negative = false
  let letter = false
  if (tempFormat.includes("-")) {
    negative = true
    numWithoutSignAndLetter = numWithoutSignAndLetter.replace("-", "")
  }

  const lastChar = tempFormat.slice(-1)
  if (lastChar.toLowerCase() !== lastChar.toUpperCase()) {
    letter = true
    numWithoutSignAndLetter = numWithoutSignAndLetter.replace(lastChar, "")
  }

  let intDigits = numWithoutSignAndLetter
  if (intDigits.includes(".")) {
    intDigits = intDigits.split(".")[0]
  }

  const numIntDigits = intDigits.length

  //start with 4 because decimal takes 1 character
  let numDecimalDigits = 5 - numIntDigits
  if (negative) {
    numDecimalDigits--
  }
  if (letter) {
    numDecimalDigits--
  }
  numDecimalDigits = Math.max(0, numDecimalDigits)
  //console.log(`num: ${num} tempFormat: ${tempFormat} numIntDigits: ${numIntDigits} numDecimalDigits: ${numDecimalDigits} negative: ${negative} letter: ${letter}`)
  // console.log({ minimumFractionDigits: numDecimalDigits, maximumFractionDigits: numDecimalDigits, notation: "compact", compactDisplay: "short" })
  let result
  if (numDecimalDigits === 0) {
    result = numeral(num).format(`0a`)
  } else {
    result = numeral(num).format(`0.${"000000".slice(-1 * numDecimalDigits)}a`)
  }
  if (result.startsWith("0.")) {
    result = result.slice(1)
  }
  return result.toUpperCase()
}