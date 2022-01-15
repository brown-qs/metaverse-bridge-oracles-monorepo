import { Format } from 'logform';
import bare from 'cli-color/bare';
import clc from 'cli-color';
import { format } from 'winston';
import safeStringify from 'fast-safe-stringify';
import * as ioTs from 'io-ts';
import { AssetType, StringAssetType } from '../common/enums/AssetType';
import { RecognizedAsset } from '../config/constants';
import { AssetEntity } from '../asset/asset.entity';
import { string } from 'fp-ts';

export type ParsedErrors = {
    actual: any;
    expected: string[];
};

const nestLikeColorScheme: Record<string, bare.Format> = {
    info: clc.greenBright,
    error: clc.red,
    warn: clc.yellow,
    debug: clc.magentaBright,
    verbose: clc.cyanBright
};

export const nestLikeConsoleFormat = (appName = 'MSAMA-MC-Oracle'): Format =>
    format.printf(({ context, level, timestamp, message, ...meta }) => {
        const color = nestLikeColorScheme[level] || ((text: string): string => text);

        return `${
            `${color(`[${appName}]`)} ` +
            `${clc.yellow(level.charAt(0).toUpperCase() + level.slice(1))}\t`
        }${typeof timestamp !== 'undefined' ? `${new Date(timestamp).toISOString()} ` : ''}${
            typeof context !== 'undefined' ? `${clc.yellow(`[${context}]`)} ` : ''
        }${color(message)}${meta.trace ? ` - ${safeStringify(meta.trace)}` : ``}`;
    });

export function typeFromEnum<EnumType>(enumName: string, theEnum: Record<string, string | number>) {
    const isEnumValue = (input: unknown): input is EnumType =>
        Object.values<unknown>(theEnum).includes(input);

    return new ioTs.Type<EnumType>(
        enumName,
        isEnumValue,
        (input, context) =>
            isEnumValue(input) ? ioTs.success(input) : ioTs.failure(input, context),
        ioTs.identity
    );
}

/**
 * Takes raw Errors from a failed io-ts decode attempt and tries to make them more
 * (human and machine) readable.
 *
 * @param errors io-ts decode "left" return type
 */
export const parseErrors = (errors: ioTs.Errors): ParsedErrors => {
    return {
        actual: errors[0].context[0].actual, // appears to be the same in each error/context
        expected: errors.map((error) => {
            // last element contains the offending field
            const last = error.context[error.context.length - 1];
            return `${last.key}: ${last.type.name}`;
        })
    };
};


export function stringAssetTypeToAssetType(
  assetType?: StringAssetType
): AssetType {
  if (StringAssetType.NATIVE === assetType?.valueOf()) {
    return AssetType.NATIVE;
  }
  if (StringAssetType.ERC20 === assetType?.valueOf()) {
    return AssetType.ERC20;
  }
  if (StringAssetType.ERC721 === assetType?.valueOf()) {
    return AssetType.ERC721;
  }
  if (StringAssetType.ERC1155 === assetType?.valueOf()) {
    return AssetType.ERC1155;
  }
  return AssetType.NONE;
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
  return StringAssetType.NONE;
}

export function stringToStringAssetType(
  data: string
): StringAssetType {
  if (StringAssetType.NATIVE.valueOf() === data) {
    return StringAssetType.NATIVE;
  }
  if (StringAssetType.ERC20.valueOf() === data) {
    return StringAssetType.ERC20;
  }
  if (StringAssetType.ERC721.valueOf() === data) {
    return StringAssetType.ERC721;
  }
  if (StringAssetType.ERC1155.valueOf() === data) {
    return StringAssetType.ERC1155;
  }
  return StringAssetType.NONE;
}

export function findRecognizedAsset(recassets: RecognizedAsset[], asset: {assetAddress: string, assetId: string}) {
  return recassets.find(x => {
    return (
      (x.address.toLowerCase() === asset.assetAddress.toLowerCase())
      && (
        (x.id === undefined)
        || (x.id !== undefined && typeof x.id === 'string' && x.id === asset.assetId)
        || (x.id !== undefined && Number.parseInt(asset.assetId) >= Number.parseInt(x.id[0]) && Number.parseInt(asset.assetId) <= Number.parseInt(x.id[1]))
      )
    )
  })
}
