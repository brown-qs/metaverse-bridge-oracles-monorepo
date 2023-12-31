import { format } from 'date-fns';
import { BigNumber } from '@ethersproject/bignumber';
import {
  Asset,
  Cancel,
  Fill,
  FillWithOrder,
  LastTradedPrice,
  Order,
} from '../hooks/marketplace/types';
import { AssetType } from './marketplace';
import { ChainId } from '../constants';
import { AddressZero } from '@ethersproject/constants';

export enum StringOrderType {
  UNKNOWN = 'UNKNOWN',
  BUY = 'BUY',
  SELL = 'SELL',
}

export const enum OrderType {
  UNKNOWN = 0,
  BUY = 1,
  SELL = 2,
}

export enum StringAssetType {
  UNKNOWN = 'UNKNOWN',
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export const StrategyMap: { [strategyType: string]: string } = {
  '0xb4c34ccd96d70009be083eaea45c708dff031622381acfcf6e3d07039aca39bb':
    'SIMPLE',
};

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
  return StringAssetType.UNKNOWN;
}

export function assetTypeToStringAssetType(
  assetType?: AssetType
): StringAssetType {
  if (AssetType.NATIVE === assetType) {
    return StringAssetType.NATIVE;
  }
  if (AssetType.ERC20 === assetType) {
    return StringAssetType.ERC20;
  }
  if (AssetType.ERC721 === assetType) {
    return StringAssetType.ERC721;
  }
  if (AssetType.ERC1155 === assetType) {
    return StringAssetType.ERC1155;
  }
  return StringAssetType.UNKNOWN;
}

export function stringToStringOrderType(
  assetTypeString?: string
): StringOrderType {
  const upper = assetTypeString?.toUpperCase();
  if (StringOrderType.BUY.valueOf() === upper) {
    return StringOrderType.BUY;
  }
  if (StringOrderType.SELL.valueOf() === upper) {
    return StringOrderType.SELL;
  }
  return StringOrderType.UNKNOWN;
}

export function stringToOrderType(
  assetTypeString?: string
): OrderType {
  const upper = assetTypeString?.toUpperCase();
  if ('BUY' === upper) {
    return OrderType.BUY;
  }
  if ('SELL' === upper) {
    return OrderType.SELL;
  }
  return OrderType.UNKNOWN;
}

export const parseFill = (data?: any): Fill | undefined => {
  if (!data) {
    return undefined;
  }
  return {
    id: data.id,
    buyer: data.buyer.id,
    buyerSendsAmountFull: BigNumber.from(data.buyerSendsAmountFull),
    buyerSentAmount: BigNumber.from(data.buyerSentAmount),
    sellerSendsAmountFull: BigNumber.from(data.sellerSendsAmountFull),
    sellerSentAmount: BigNumber.from(data.sellerSentAmount),
    complete: data.complete,
    createdAt: data.createdAt,
    orderHash: data.order.id,
  };
};

export const parseFillWithOrder = (data?: any): FillWithOrder | undefined => {
  if (!data) {
    return undefined;
  }
  return {
    id: data.id,
    buyer: data.buyer.id,
    buyerSendsAmountFull: BigNumber.from(data.buyerSendsAmountFull),
    buyerSentAmount: BigNumber.from(data.buyerSentAmount),
    sellerSendsAmountFull: BigNumber.from(data.sellerSendsAmountFull),
    sellerSentAmount: BigNumber.from(data.sellerSentAmount),
    complete: data.complete,
    createdAt: data.createdAt,
    orderHash: data.order.id,
    order: {
      id: data.order.id,
      seller: data.order.seller.id,
      salt: data.order.salt,
      createdAt: data.order.createdAt,
      strategyType: data.order.strategyType.id,
      buyAsset: parseAsset(data.order.buyAsset) as Asset,
      sellAsset: parseAsset(data.order.sellAsset) as Asset,
      askPerUnitDenominator: BigNumber.from(data.order.askPerUnitDenominator),
      askPerUnitNominator: BigNumber.from(data.order.askPerUnitNominator),
      startsAt: data.order.startsAt,
      expiresAt: data.order.expiresAt,
      onlyTo: data.order.onlyTo,
      partialAllowed: data.order.partialAllowed,
      quantity: BigNumber.from(data.order.quantity),
      quantityLeft: BigNumber.from(data.order.quantityLeft),
      pricePerUnit: BigNumber.from(data.order.pricePerUnit),
      orderType: stringToStringAssetType(data.order.orderType),
    },
  };
};

export const parseCancel = (data?: any): Cancel | undefined => {
  if (!data) {
    return undefined;
  }
  return {
    ...data,
    sellerGetsBackAmount: BigNumber.from(data.sellerGetsBackAmount),
  };
};

export const parseOrder = (data?: any): Order | undefined => {
  if (!data) {
    return undefined;
  }
  return {
    ...data,
    seller: data.seller.id,
    strategyType: data.strategyType.id,
    cancel: parseCancel(data.cancel),
    buyAsset: parseAsset(data.buyAsset),
    sellAsset: parseAsset(data.sellAsset),
    fills: data.fills.map((x: any) => parseFill(x)),
    askPerUnitDenominator: BigNumber.from(data.askPerUnitDenominator),
    askPerUnitNominator: BigNumber.from(data.askPerUnitNominator),
    startsAt: data.startsAt,
    expiresAt: data.expiresAt,
    id: data.id,
    onlyTo: data.onlyTo,
    partialAllowed: data.partialAllowed,
    quantity: BigNumber.from(data.quantity),
    quantityLeft: BigNumber.from(data.quantityLeft),
    pricePerUnit: BigNumber.from(data.pricePerUnit),
    orderType: stringToStringOrderType(data.orderType),
  };
};

export const parseAsset = (data?: any): Asset | undefined => {
  if (!data) {
    return undefined;
  }
  return {
    assetAddress: data.assetAddress,
    assetId: data.assetId,
    assetType: stringToStringAssetType(data.assetType),
    id: data.id,
  };
};

export const parseLastTradedPrice = (
  data?: any
): LastTradedPrice | undefined => {
  if (!data) {
    return undefined;
  }
  return {
    unitPrice: BigNumber.from(data.unitPrice),
    id: data.id,
    orderType: stringToStringOrderType(data.orderType),
    amount: BigNumber.from(data.amount),
    user: data.user.id,
  };
};

export const getAssetEntityId = (
  assetAddress: string,
  assetId: string | number
): string => {
  return `${assetAddress.toLowerCase()}-${assetId.toString()}`;
};

export const ONE_YEAR_IN_S = '31540000';

export const formatExpirationDateString = (date?: string): string => {
  if (!date) {
    return 'undefined';
  }
  const now = BigNumber.from(Date.now());
  if (BigNumber.from(date).gt(now.div(1000).add(ONE_YEAR_IN_S))) {
    return 'never';
  }
  return format(+(date.toString() as string) * 1000, 'dd-MM-yyyy hh:mm');
};

export const getUnitPrice = (
  askPerUnitNominator?: BigNumber,
  askPerUnitDenominator?: BigNumber
) => {
  if (!askPerUnitDenominator || !askPerUnitNominator) {
    return undefined;
  }
  if (askPerUnitNominator.gt(askPerUnitDenominator)) {
    return askPerUnitNominator.div(askPerUnitDenominator);
  }
  return askPerUnitDenominator.div(askPerUnitNominator);
};

export const getDisplayUnitPrice = (
  askPerUnitNominator?: BigNumber,
  askPerUnitDenominator?: BigNumber
) => {
  const p = getUnitPrice(askPerUnitNominator, askPerUnitDenominator);
  return p ?? '?';
};

export const getDisplayQuantity = (
  orderType?: OrderType,
  quantity?: BigNumber,
  askPerUnitNominator?: BigNumber,
  askPerUnitDenominator?: BigNumber
) => {
  const q = getQuantity(
    orderType,
    quantity,
    askPerUnitNominator,
    askPerUnitDenominator
  );

  return q ?? '?';
};

export const getQuantity = (
  orderType?: OrderType,
  quantity?: BigNumber,
  askPerUnitNominator?: BigNumber,
  askPerUnitDenominator?: BigNumber
) => {
  if (!quantity) {
    return undefined;
  }

  if (OrderType.SELL === orderType) {
    return quantity;
  }

  if (!askPerUnitDenominator || !askPerUnitNominator) {
    return undefined;
  }

  return quantity.mul(askPerUnitNominator).div(askPerUnitDenominator);
};

export const getDisplayUnits = (
  orderType?: OrderType,
  quantity?: BigNumber,
  askPerUnitNominator?: BigNumber,
  askPerUnitDenominator?: BigNumber
) => {
  return {
    quantity: getDisplayQuantity(
      orderType,
      quantity,
      askPerUnitNominator,
      askPerUnitDenominator
    ),
    unitPrice: getUnitPrice(askPerUnitNominator, askPerUnitDenominator),
  };
};

export const inferOrderTYpe = (
  chainId?: ChainId,
  sellAsset?: Asset,
  buyAsset?: Asset
): OrderType | undefined => {
  if (sellAsset && sellAsset.assetAddress) {
    return sellAsset.assetAddress.toLowerCase() === AddressZero
      ? OrderType.BUY
      : OrderType.SELL;
  }

  if (buyAsset && buyAsset.assetAddress) {
    return buyAsset.assetAddress.toLowerCase() === AddressZero
      ? OrderType.SELL
      : OrderType.BUY;
  }

  return undefined;
};
