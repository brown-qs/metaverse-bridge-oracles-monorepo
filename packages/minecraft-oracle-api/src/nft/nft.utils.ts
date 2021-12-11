import { Interface } from '@ethersproject/abi';

import { hexZeroPad } from '@ethersproject/bytes';
import { HashZero } from '@ethersproject/constants';
import { IPFS_GATEWAY } from '../config/constants';
import { StringAssetType } from '../common/enums/AssetType';
import { Asset, StaticTokenData } from './nft.types';
import axios from 'axios';

export function stringToStringAssetType(
  assetTypeString?: string
): StringAssetType {
  const upper = assetTypeString?.toUpperCase();
  if (StringAssetType.NATIVE.valueOf() === upper) {
    return StringAssetType.NATIVE;
  }
  if (StringAssetType.ERC20.valueOf() === upper) {
    return StringAssetType.ERC20;
  }
  if (StringAssetType.ERC721.valueOf() === upper) {
    return StringAssetType.ERC721;
  }
  if (StringAssetType.ERC1155.valueOf() === upper) {
    return StringAssetType.ERC1155;
  }
  return StringAssetType.NONE;
}

export const numberToBytes32HexString = (num?: string | number) => {
  if (!num) {
    //console.warn('HEXURI', HashZero);
    return HashZero;
  }

  const hv = `0x${
    typeof num === 'string'
      ? Number.parseInt(num as string).toString(16)
      : num.toString(16)
  }`;
  const final = hexZeroPad(hv, 32);

  //console.warn('HEXURI', { hv, final });
  return final;
};

export const parseTokenUri = (uri?: string, tokenID?: string | number) => {
  if (!uri) {
    return undefined;
  }

  if (uri.includes('{id}')) {
    return uri.replace('{id}', numberToBytes32HexString(tokenID).slice(2));
  }

  // carbonjack does not follow the specifications unfortunately
  if (uri.includes('{0}')) {
    return uri.replace('{0}', numberToBytes32HexString(tokenID).slice(2));
  }

  return uri;
};

export const getTokenStaticCalldata = (asset: Asset) => {
  if (!asset || !asset.assetAddress || !asset.assetId || !asset.assetType) {
    return [];
  }
  if (asset.assetType?.valueOf() === StringAssetType.ERC20) {
    return [
      [
        [
          new Interface([
            'function name() public view returns (string)',
          ]).getFunction('name'),
        ],
        asset.assetAddress,
        'name',
        [],
      ],
      [
        [
          new Interface([
            'function symbol() view returns (string)',
          ]).getFunction('symbol'),
        ],
        asset.assetAddress,
        'symbol',
        [],
      ],
      [
        [
          new Interface([
            'function decimals() view returns (uint8)',
          ]).getFunction('decimals'),
        ],
        asset.assetAddress,
        'decimals',
        [],
      ],
      [
        [
          new Interface([
            'function totalSupply() view returns (uint256)',
          ]).getFunction('totalSupply'),
        ],
        asset.assetAddress,
        'totalSupply',
        [],
      ],
    ];
  }

  if (asset.assetType?.valueOf() === StringAssetType.ERC721) {
    return [
      [
        [
          new Interface(['function name() view returns (string)']).getFunction(
            'name'
          ),
        ],
        asset.assetAddress,
        'name',
        [],
      ],
      [
        [
          new Interface([
            'function symbol() view returns (string)',
          ]).getFunction('symbol'),
        ],
        asset.assetAddress,
        'symbol',
        [],
      ],
      [
        [
          new Interface([
            'function totalSupply() view returns (uint256)',
          ]).getFunction('totalSupply'),
        ],
        asset.assetAddress,
        'totalSupply',
        [],
      ],
      [
        [
          new Interface([
            'function tokenURI(uint256 tokenId) view returns (string memory)',
          ]).getFunction('tokenURI'),
        ],
        asset.assetAddress,
        'tokenURI',
        [asset.assetId],
      ],
      [
        [
          new Interface([
            'function contractURI() view returns (string memory)',
          ]).getFunction('contractURI'),
        ],
        asset.assetAddress,
        'contractURI',
        [],
      ],
    ];
  }

  if (asset.assetType?.valueOf() === StringAssetType.ERC1155) {
    return [
      [
        [
          new Interface([
            'function name() public view returns (string)',
          ]).getFunction('name'),
        ],
        asset.assetAddress,
        'name',
        [],
      ],
      [
        [
          new Interface([
            'function symbol() view returns (string)',
          ]).getFunction('symbol'),
        ],
        asset.assetAddress,
        'symbol',
        [],
      ],
      [
        [
          new Interface([
            'function decimals() view returns (uint8)',
          ]).getFunction('decimals'),
        ],
        asset.assetAddress,
        'decimals',
        [],
      ],
      [
        [
          new Interface([
            'function totalSupply(uint256 id) view returns (uint256)',
          ]).getFunction('totalSupply'),
        ],
        asset.assetAddress,
        'totalSupply',
        [asset.assetId],
      ],
      [
        [
          new Interface([
            'function uri(uint256 tokenId) view returns (string memory)',
          ]).getFunction('uri'),
        ],
        asset.assetAddress,
        'uri',
        [asset.assetId],
      ],
      [
        [
          new Interface([
            'function contractURI() view returns (string memory)',
          ]).getFunction('contractURI'),
        ],
        asset.assetAddress,
        'contractURI',
        [],
      ],
    ];
  }

  return [];
};

export const processTokenStaticCallResults = (
  assets: Asset[],
  results: any[]
) => {
  let res: StaticTokenData[] = [];
  let offset = 0;
  assets.map((x, i) => {
    if (x.assetType.valueOf() === StringAssetType.ERC20) {
      res.push({
        asset: x,
        name: results[i + offset]?.[0],
        symbol: results[i + offset + 1]?.[0],
        decimals: results[i + offset + 2]?.[0],
        totalSupply: results[i + offset + 3]?.[0],
      });
      offset += 3;
      return;
    }

    if (x.assetType.valueOf() === StringAssetType.ERC721) {
      res.push({
        asset: x,
        name: results[i + offset]?.[0],
        symbol: results[i + offset + 1]?.[0],
        totalSupply: results[i + offset + 2]?.[0],
        tokenURI: parseTokenUri(results[i + offset + 3]?.[0], x.assetId),
        contractURI: results[i + offset + 4]?.[0],
      });
      offset += 4;
      return;
    }

    if (x.assetType.valueOf() === StringAssetType.ERC1155) {
      res.push({
        asset: x,
        name: results[i + offset]?.[0],
        symbol: results[i + offset + 1]?.[0],
        decimals: results[i + offset + 2]?.[0],
        totalSupply: results[i + offset + 3]?.[0],
        tokenURI: parseTokenUri(results[i + offset + 4]?.[0], x.assetId),
        contractURI: results[i + offset + 5]?.[0],
      });
      offset += 5;
      return;
    }
  });
  return res;
};

export default function uriToHttp(
  uri?: string,
  tryHttpToHttps: boolean = true
): string | undefined {
  if (!uri) {
    return undefined;
  }
  const protocol = uri.split(':')[0].toLowerCase();
  //console.log('URI FETCH', { uri, tryHttpToHttps, protocol });
  console.log(protocol)
  switch (protocol) {
    case 'https':
      return uri;
    case 'http':
      return tryHttpToHttps ? 'https' + uri.substr(4) : uri;
    case 'ipfs':
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return `${IPFS_GATEWAY}/ipfs/${hash}`;
    case 'ipns':
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return `${IPFS_GATEWAY}/ipns/${name}`;
    default:
      return undefined;
  }
}

export const fetchUrlCallback = () => {
  const cb = async <T>(uriOrUrl?: string, tryHttpToHttps = true) => {
    if (!uriOrUrl) {
      return undefined;
    }
    const url = uriToHttp(uriOrUrl, tryHttpToHttps);
      try {
        console.log(url)
        const response = await axios.get(url, {});
        if (response.status === 200) {
          return response.data as T;
        }
      } catch (err) {
        console.log('Fetch failed for URL: ' + url);
      }
    return undefined;
  };
  return cb;
};
