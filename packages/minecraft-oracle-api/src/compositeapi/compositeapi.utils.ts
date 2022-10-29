import axios from "axios";
import { StringAssetType } from "../common/enums/AssetType";
import uriToHttp from "../nftapi/nftapi.utils";
import { SyntheticItemEntity } from "../syntheticitem/syntheticitem.entity";
import { SyntheticItemLayerEntity } from "../syntheticitemlayer/syntheticitemlayer.entity";
import { SyntheticPartEntity } from "../syntheticpart/syntheticpart.entity";
import { CompositeConfigPartDto, CompositeConfigItemDto, CompositeConfigLayer } from "./dtos/index.dto";

export const fetchImageBufferCallback = () => {
  const cb = async <T>(uriOrUrl?: string, tryHttpToHttps = true) => {
    if (!uriOrUrl) {
      return undefined;
    }
    const url = uriToHttp(uriOrUrl, tryHttpToHttps);
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      if (response.status === 200) {
        console.log(url)
        console.log(typeof response.data)
        return response.data as T;
      }
    } catch (err) {
      console.log('Fetch failed for URL: ' + url);
    }
    return undefined;
  };
  return cb;
};


export const syntheticPartToDto = (part: SyntheticPartEntity, chainId: number): CompositeConfigPartDto | undefined => {
  //return undefined if there are no items ... caused items having no layers
  const items = part.items.map(i => syntheticItemToDto(i)).filter(i => !!i).sort((a, b) => a.assetId - b.assetId)
  if (!Array.isArray(items) || items.length === 0) {
    return undefined
  }
  const resp: CompositeConfigPartDto = {
    chainId,
    assetAddress: part.assetAddress,
    assetType: StringAssetType.ERC721,
    name: part.name,
    synthetic: true,
    items
  }
  return resp
}

export const syntheticItemToDto = (item: SyntheticItemEntity): CompositeConfigItemDto | undefined => {
  //return undefined if there are no layer
  if (!Array.isArray(item.layers) || item.layers.length === 0) {
    return undefined
  }

  if (item?.showInCustomizer === false) {
    return undefined
  }

  const parts = item.id.split("-")
  const previewImageUri = `/customizer/${parts[0]}/${parts[1]}/${item.assetId}.png`
  const resp: CompositeConfigItemDto = {
    id: item.id,
    assetId: parseInt(item.assetId),
    previewImageUri,
    attributes: item.attributes,
    layers: item.layers.map(l => syntheticItemLayerToDto(l)),
  }
  return resp
}

export const syntheticItemLayerToDto = (layer: SyntheticItemLayerEntity): CompositeConfigLayer => {
  const parts = layer.id.split("-")
  const imageUri = `/customizer/${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}.png`
  const resp: CompositeConfigLayer = {
    id: layer.id,
    zIndex: layer.zIndex,
    imageUri
  }
  return resp
}