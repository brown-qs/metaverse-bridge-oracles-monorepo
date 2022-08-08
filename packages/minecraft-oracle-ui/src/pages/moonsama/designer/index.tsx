import { useState, useMemo, useEffect, memo } from 'react';
import { useOnChainItemsWithCompositeMetaAndAssets } from 'hooks/multiverse/useOnChainItems';
import { useAuth, useClasses } from 'hooks';
import { cx } from '@emotion/css';
import { styles } from './styles';


import MOONSAMA_CUSTOMIZATION_ITEM_GROUPS from './fixtures/CustomizerItemGroups'
import ImageStack from 'components/ImageStacks/Moonsama2';
import { ComponentType } from "react";
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';

import { InGameItemWithStatic, useInGameItemsWithCompositeMetaAndAssets } from 'hooks/multiverse/useInGameItems'
import axios from 'axios';
import type { AuthData } from 'context/auth/AuthContext/AuthContext.types';
import { downloadAsImage, saveCustomization, shareCustomization } from 'utils/customizers';
import MOONSAMA_CUSTOMIZER_CATEGORIES from './fixtures/CustomizerCategories';
import { MOONSAMA_ATTR_TO_ID_MAP } from './fixtures/AttributeToAssetMap';
import { ADDITIONAL_PARENT_LAYERS_CONFIG, ADDITIONAL_CHILD_LAYERS_CONFIG, MOONSAMA_CATEGORY_INCOMPATIBILITIES } from './fixtures/ItemRules';
import { useFetchUrlCallback } from 'hooks/useFetchUrlCallback/useFetchUrlCallback';
import { useParams } from 'react-router';
import { AccordionPanel, AccordionItem, Text, Accordion, Box, Button, CircularProgress, IconButton, Stack, useMediaQuery, Modal, Container, Grid, GridItem, AccordionButton, AccordionIcon, ExpandedIndex, HStack } from '@chakra-ui/react';
import { MoonsamaLayout } from '../../../components';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';


//fix for type checks
const FixedSizeGrid = _FixedSizeGrid as ComponentType<FixedSizeGridProps>;
enum AssetLocation {
  INCLUDED = 'INCLUDED',
  BRIDGE = 'BRIDGE',
  WALLET = 'WALLET',
  NONE = 'NONE'
}

type CustomizableTraitType = {
  title: string,
  icon: string,
  background: string,
  assetAddress: string,
  assetIdRanges?: Array<Array<number>>,
  assetType: string,
  uriPrefix: string,
  uriPostfix: string,
  chainId: number,
  equippableType: string,
  zIndex: number,
  location?: AssetLocation,
  synthetic: boolean,
  attributes?: string[],
  attributeCategory?: boolean
}

type CustomizationCategory = {
  title: string,
  icon: string,
  background: string,
  equippableType: string
}

type Asset = {
  title: string,
  thumbnailUrl: string,
  fullSizeUrl: string,
  chainId: number,
  assetAddress: string,
  assetId: string,
  assetType: string,
  zIndex: number,
  customizableTraitName: string,
  location: AssetLocation,
  synthetic: boolean,
  dependant: boolean
}

type AssetIdentifier = {
  chainId: number,
  assetAddress: string,
  assetId: string,
  assetType: string,
}

type OwnedAssets = {
  bridgeAttributes: AssetIdentifier[],
  walletAttributes: AssetIdentifier[],
  bridge: AssetIdentifier[],
  wallet: AssetIdentifier[]
}

type CustomizationType = {
  parent: Asset | null,
  children: Array<Asset>
}

type getCustomizationsResponse = {
  composite: boolean
}

export type CompositeMetadataType = {
  image: string
  name: string,
  description: string,
  external_url: string,
  artist?: string
  artist_url?: string
  composite?: boolean
  asset?: AssetIdentifier
  layers?: string[]
  attributes?: any[]
  background_color?: string
  animation_url?: string
  youtube_url?: string
}

const getCustomization = async ({ chainId, assetAddress, assetId }: { chainId: number, assetAddress: string, assetId: string }, authData: AuthData) => {
  try {
    const result = await axios.request<getCustomizationsResponse>({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_API_URL}/composite/metadata/${chainId}/${assetAddress}/${assetId}`,
      headers: { Authorization: `Bearer ${authData?.jwt}` }
    })
    return result
  } catch (error) {
    console.log(error)
    return undefined
  }

}

const attributeFunnel = (attributes: string[]): AssetIdentifier[] => {
  const repeatMap: { [key: string]: boolean } = {}

  const ret = attributes.filter(attr => {
    if (!attr) {
      return false
    }
    if (repeatMap[attr]) {
      return false
    }
    repeatMap[attr] = true
    return true
  }).map(attr => {
    return MOONSAMA_ATTR_TO_ID_MAP[attr]
  }).filter(x => !!x)

  console.log('PRELOAD', 'attributeFunnel', { ret })

  return ret as AssetIdentifier[]
}

const findAssetItemGroup = (asset?: { assetAddress: string, assetId: string, chainId: number }) => {
  const ig = MOONSAMA_CUSTOMIZATION_ITEM_GROUPS.find(group => {
    const baseCheck = group.assetAddress === asset?.assetAddress && group.chainId === asset?.chainId
    if (baseCheck && group.assetIDRanges) {
      for (let i = 0; i < group.assetIDRanges.length; i++) {
        const range = group.assetIDRanges[i]
        const id = Number.parseInt(asset.assetId)
        const included = id >= range[0] && id <= range[1]
        if (included) {
          return included
        }
      }
      return false
    } else {
      return false
    }
  })

  return ig
}

const createLayerAssets = (parent: Asset, layers: CompositeMetadataType[]): Asset[] => {
  console.log('PRELOAD', 'createLayerAssets layers', { layers })
  const res = layers.map(layerMeta => {

    const asset = layerMeta.asset

    if (!asset) {
      console.log('PRELOAD', 'createLayerAssets layer', 'asset null')
      return undefined
    }

    if (asset.assetAddress === parent.assetAddress && asset.assetId === parent.assetId) {
      console.log('PRELOAD', 'createLayerAssets layer', 'it is the parent')
      return undefined
    }

    const ig = findAssetItemGroup(asset)

    if (!ig) {
      console.log('PRELOAD', 'createLayerAssets layer', 'asset item group not found')
      return undefined
    }

    return {
      title: ig.title,
      thumbnailUrl: `${ig.uriPrefix}/customizer/${ig.chainId}/${ig.assetAddress}/${asset.assetId}${ig.uriPostfix}`,
      fullSizeUrl: `${ig.uriPrefix}/${ig.chainId}/${ig.assetAddress}/${asset.assetId}${ig.uriPostfix}`,
      chainId: ig.chainId,
      assetAddress: ig.assetAddress,
      assetId: asset.assetId,
      assetType: ig.assetType,
      zIndex: ig.zIndex,
      igName: ig.title,
      location: AssetLocation.INCLUDED,
      customizableTraitName: ig.title,
      owned: true,
      synthetic: ig.synthetic,
      dependant: ig.dependant
    }
  }).filter(x => !!x)

  console.log('PRELOAD', 'createLayerAssets', { res })

  return res as Asset[]
}

const transformBridgedAssets = (inGameAssets: Array<InGameItemWithStatic> | undefined) => {
  if (typeof inGameAssets === 'undefined') return { assets: [], attributes: [] }

  const assets: AssetIdentifier[] = []
  let attributeLabels: string[] = []

  inGameAssets.map((inGameAsset) => {
    assets.push({
      chainId: 1285,
      assetAddress: inGameAsset?.assetAddress.replace('0x9bca2cced0aeebd47f2d6f2e37564c5175cd0e2e', '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a'),
      // assetAddress: inGameAsset?.assetAddress,
      assetId: inGameAsset?.assetId,
      assetType: inGameAsset?.assetType,
    })

    // we fetch attributeLabels of moonsamas only
    if (assets[assets.length - 1].assetAddress.toLowerCase() === '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a') {
      attributeLabels = attributeLabels.concat(inGameAsset?.meta?.attributes.map((attr: any) => attr?.value))
    }
  })

  const attributes = attributeFunnel(attributeLabels)

  return {
    assets,
    attributes
  }
}

const transformOnChainAssets = (onChainItems: Array<any> | undefined) => {
  if (typeof onChainItems === 'undefined') return { assets: [], attributes: [] }

  const assets: AssetIdentifier[] = []
  let attributeLabels: string[] = []

  onChainItems.map((onChainItem) => {
    assets.push({
      chainId: 1285,
      assetAddress: onChainItem?.asset.assetAddress.replace('0x9bca2cced0aeebd47f2d6f2e37564c5175cd0e2e', '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a'),
      // assetAddress: onChainItem?.asset.assetAddress,
      assetId: onChainItem?.asset.assetId,
      assetType: onChainItem?.asset.assetType,
    })
    attributeLabels = attributeLabels.concat(onChainItem?.meta?.attributes.map((attr: any) => attr?.value).filter((x: any) => !!x))
  })

  const attributes = attributeFunnel(attributeLabels)

  return {
    assets,
    attributes
  }
}

const getAssetLocation = ({ chainId, assetAddress, assetId, assetType, title }: AssetIdentifier & { title: string }, ownedAssets: OwnedAssets): AssetLocation => {

  if (title === 'Ambience' || title === 'Foreground' || title === 'Off Hand Multipart' || title === 'Attribute Multipart') {
    return AssetLocation.INCLUDED
  }

  for (let i = 0; i < ownedAssets.bridge.length; i++) {
    if (ownedAssets.bridge[i].chainId === chainId && ownedAssets.bridge[i].assetAddress === assetAddress && ownedAssets.bridge[i].assetId === assetId && ownedAssets.bridge[i].assetType === assetType) {
      return AssetLocation.BRIDGE;
    }
  }

  for (let i = 0; i < ownedAssets.bridgeAttributes.length; i++) {
    if (ownedAssets.bridgeAttributes[i].chainId === chainId && ownedAssets.bridgeAttributes[i].assetAddress === assetAddress && ownedAssets.bridgeAttributes[i].assetId === assetId && ownedAssets.bridgeAttributes[i].assetType === assetType) {
      return AssetLocation.BRIDGE;
    }
  }

  for (let i = 0; i < ownedAssets.wallet.length; i++) {
    if (ownedAssets.wallet[i].chainId === chainId && ownedAssets.wallet[i].assetAddress === assetAddress && ownedAssets.wallet[i].assetId === assetId && ownedAssets.wallet[i].assetType === assetType) {
      return AssetLocation.WALLET;
    }
  }

  for (let i = 0; i < ownedAssets.walletAttributes.length; i++) {
    if (ownedAssets.walletAttributes[i].chainId === chainId && ownedAssets.walletAttributes[i].assetAddress === assetAddress && ownedAssets.walletAttributes[i].assetId === assetId && ownedAssets.walletAttributes[i].assetType === assetType) {
      return AssetLocation.WALLET;
    }
  }

  return AssetLocation.NONE
}

const createAttributeAssets = (assetIdentifiers: AssetIdentifier[]): Asset[] => {
  return assetIdentifiers.map(asset => {
    const ig = MOONSAMA_CUSTOMIZATION_ITEM_GROUPS.find(item => {
      return item.assetAddress === asset.assetAddress && asset.chainId === item.chainId
    })

    if (!ig) {
      return undefined
    }

    return {
      title: ig.title,
      thumbnailUrl: `${ig.uriPrefix}/customizer/${ig.chainId}/${ig.assetAddress}/${asset.assetId}${ig.uriPostfix}`,
      fullSizeUrl: `${ig.uriPrefix}/${ig.chainId}/${ig.assetAddress}/${asset.assetId}${ig.uriPostfix}`,
      chainId: ig.chainId,
      assetAddress: ig.assetAddress,
      assetId: asset.assetId,
      assetType: ig.assetType,
      zIndex: ig.zIndex,
      igName: ig.title,
      location: AssetLocation.INCLUDED,
      customizableTraitName: ig.title,
      owned: true,
      synthetic: ig.synthetic,
      dependant: ig.dependant
    }

  }).filter(x => !!x) as Asset[]
}

const getAssetImages = (customizationCategory: CustomizationCategory, ownedAssets: OwnedAssets): Asset[] => {
  const options = []
  const bridgeOptions = []
  const walletOptions = []

  const attributeOptions = []
  const attributeBridgeOptions = []
  const attributeWalletOptions = []

  const items = MOONSAMA_CUSTOMIZATION_ITEM_GROUPS.filter(item => {
    return item.title === customizationCategory.title
  })

  for (let k = 0; k < items.length; k++) {
    const customizableTrait = items[k]

    // we process attributes first
    if (customizableTrait.attributeCategory) {

      const attributes = customizableTrait?.attributes ?? []
      for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i]

        // we first check in bridge
        const bridgeOwnedAttribute = ownedAssets.bridgeAttributes.find(x => {
          const recognizedAttribute = MOONSAMA_ATTR_TO_ID_MAP[attribute]

          if (!recognizedAttribute) {
            return false
          }

          return recognizedAttribute.assetAddress.toLowerCase() === x.assetAddress.toLowerCase() && recognizedAttribute.assetId === x.assetId
        })

        if (bridgeOwnedAttribute) {
          attributeBridgeOptions.push({
            title: customizableTrait.title,
            thumbnailUrl: `${customizableTrait.uriPrefix}/customizer/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${bridgeOwnedAttribute.assetId}${customizableTrait.uriPostfix}`,
            fullSizeUrl: `${customizableTrait.uriPrefix}/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${bridgeOwnedAttribute.assetId}${customizableTrait.uriPostfix}`,
            chainId: customizableTrait.chainId,
            assetAddress: customizableTrait.assetAddress,
            assetId: bridgeOwnedAttribute.assetId,
            assetType: customizableTrait.assetType,
            zIndex: customizableTrait.zIndex,
            customizableTraitName: customizableTrait.title,
            location: AssetLocation.BRIDGE,
            owned: true,
            synthetic: customizableTrait.synthetic,
            dependant: customizableTrait.dependant
          })
          continue
        }

        // 2 we check in wallet
        const walletOwnedAttribute = ownedAssets.walletAttributes.find(x => {
          const recognizedAttribute = MOONSAMA_ATTR_TO_ID_MAP[attribute]

          if (!recognizedAttribute) {
            return false
          }

          return recognizedAttribute.assetAddress.toLowerCase() === x.assetAddress.toLowerCase() && recognizedAttribute.assetId === x.assetId
        })

        if (walletOwnedAttribute) {
          attributeWalletOptions.push({
            title: customizableTrait.title,
            thumbnailUrl: `${customizableTrait.uriPrefix}/customizer/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${walletOwnedAttribute.assetId}${customizableTrait.uriPostfix}`,
            fullSizeUrl: `${customizableTrait.uriPrefix}/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${walletOwnedAttribute.assetId}${customizableTrait.uriPostfix}`,
            chainId: customizableTrait.chainId,
            assetAddress: customizableTrait.assetAddress,
            assetId: walletOwnedAttribute.assetId,
            assetType: customizableTrait.assetType,
            zIndex: customizableTrait.zIndex,
            customizableTraitName: customizableTrait.title,
            location: AssetLocation.WALLET,
            owned: true,
            synthetic: customizableTrait.synthetic,
            dependant: customizableTrait.dependant
          })
          continue
        }

        // 3 it's def not owned
        const notOwnedAttribute = MOONSAMA_ATTR_TO_ID_MAP[attribute]
        if (notOwnedAttribute) {
          attributeOptions.push({
            title: customizableTrait.title,
            thumbnailUrl: `${customizableTrait.uriPrefix}/customizer/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${notOwnedAttribute.assetId}${customizableTrait.uriPostfix}`,
            fullSizeUrl: `${customizableTrait.uriPrefix}/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${notOwnedAttribute.assetId}${customizableTrait.uriPostfix}`,
            chainId: customizableTrait.chainId,
            assetAddress: customizableTrait.assetAddress,
            assetId: notOwnedAttribute.assetId,
            assetType: customizableTrait.assetType,
            zIndex: customizableTrait.zIndex,
            customizableTraitName: customizableTrait.title,
            location: AssetLocation.NONE,
            owned: true,
            customization: false,
            synthetic: customizableTrait.synthetic,
            dependant: customizableTrait.dependant
          })
        }
      }
    } else {
      // we process non-attributes
      const assetIdRanges = customizableTrait.assetIDRanges ?? []
      for (let i = 0; i < assetIdRanges.length; i++) {
        const assetRange = assetIdRanges[i];

        for (let j = assetRange[0]; j <= assetRange[1]; j++) {
          const option = {
            title: customizableTrait.title,
            thumbnailUrl: `${customizableTrait.uriPrefix}/customizer/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${j}${customizableTrait.uriPostfix}`,
            fullSizeUrl: `${customizableTrait.uriPrefix}/${customizableTrait.chainId}/${customizableTrait.assetAddress}/${j}${customizableTrait.uriPostfix}`,
            chainId: customizableTrait.chainId,
            assetAddress: customizableTrait.assetAddress,
            assetId: j.toString(),
            assetType: customizableTrait.assetType,
            zIndex: customizableTrait.zIndex,
            customizableTraitName: customizableTrait.title,
            location: AssetLocation.NONE,
            synthetic: customizableTrait.synthetic,
            dependant: customizableTrait.dependant
          }

          option.location = getAssetLocation(option, ownedAssets)

          if (option.location.valueOf() === AssetLocation.BRIDGE.valueOf()) {
            bridgeOptions.push({
              owned: true,
              ...option
            })
            continue
          }

          if (option.location.valueOf() === AssetLocation.WALLET.valueOf()) {
            walletOptions.push({
              owned: true,
              ...option
            })
            continue
          }

          options.push({
            owned: false,
            customization: false,
            ...option
          })
        }
      }
    }
  }
  return [...attributeBridgeOptions, ...bridgeOptions, ...attributeWalletOptions, ...walletOptions, ...attributeOptions, ...options];
}

const Cell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { gridItem, selected } = useClasses(styles);

  const [isMobileViewport] = useMediaQuery('(max-width: 992px)')

  const assetIndex = (data.numCols * rowIndex) + columnIndex;

  const isSelected = (data.selectedAsset === data.traitOptionsAssets[assetIndex]?.assetId);

  const customization = data.myCustomizations[`${data.traitOptionsAssets[assetIndex]?.assetAddress} - ${data.traitOptionsAssets[assetIndex]?.assetId}`];

  //console.log('CELL', {columnIndex, rowIndex, style, data, assetIndex, isSelected, traitLength: data.traitOptionsAssets.length, windowInnerWIdth: window.innerWidth})

  useEffect(() => {
    if (assetIndex >= data.traitOptionsAssets.length) return

    const fetching = data.fetchingCustomizations.find((customization: AssetIdentifier) => {
      return (
        data.traitOptionsAssets[assetIndex].chainId === customization.chainId &&
        data.traitOptionsAssets[assetIndex].assetAddress === customization.assetAddress &&
        data.traitOptionsAssets[assetIndex].assetId === customization.assetId
      )
    })

    if (!fetching) {
      setIsLoading(false)
    }
  }, [data, assetIndex])

  if (assetIndex >= data.traitOptionsAssets.length) return <></>;

  return (
    <Box style={style} sx={{ overflow: 'hidden', padding: isMobileViewport ? '0px' : '8px' }} onClick={() => {
      setIsLoading(true);
      data.onSelectAsset(assetIndex);
    }}>
      <Box className={cx({ [gridItem]: true }, { [selected]: isSelected })}>
        {typeof customization === 'undefined' ? (
          <img src={data.traitOptionsAssets[assetIndex].thumbnailUrl}
            style={{ borderRadius: '8px', backgroundColor: '#1B1B3A', opacity: isLoading ? 0.75 : 1 }}
            width={isMobileViewport ? ((Math.floor(window.innerWidth / 3)) - 12) : '200'}
            height={isMobileViewport ? ((Math.floor(window.innerWidth / 3)) - 12) : '200'}
            alt="" />
        ) : (
          <ImageStack layers={customization.layers} />
        )
        }

        {isLoading && (
          <div style={{ position: 'absolute' }}>
            <CircularProgress sx={{ alignSelf: 'center', textAlign: 'center', color: '#fff' }} />
          </div>
        )}
        {data.traitOptionsAssets[assetIndex].location === AssetLocation.INCLUDED && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', textTransform: 'uppercase', fontSize: '8px', background: '#0EEBA8', color: '#16132B', padding: '4px 8px', letterSpacing: '0.02em', borderRadius: '8px 0 8px 0' }}>INCLUDED</div>}
        {data.traitOptionsAssets[assetIndex].location === AssetLocation.BRIDGE && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', textTransform: 'uppercase', fontSize: '8px', background: '#7515FF', color: '#16132B', padding: '4px 8px', letterSpacing: '0.02em', borderRadius: '8px 0 8px 0' }}>IN THE BRIDGE</div>}
        {data.traitOptionsAssets[assetIndex].location === AssetLocation.WALLET && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', textTransform: 'uppercase', fontSize: '8px', background: '#FFC914', color: '#FFFFFF', padding: '4px 8px', letterSpacing: '0.02em', borderRadius: '8px 0 8px 0' }}>IN WALLET</div>}
        {data.traitOptionsAssets[assetIndex].location === AssetLocation.NONE && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', textTransform: 'uppercase', fontSize: '8px', background: '#F84AA7', color: '#FFFFFF', padding: '4px 8px', letterSpacing: '0.02em', borderRadius: '8px 0 8px 0' }}>NOT OWNED</div>}
      </Box>
    </Box>
  );
}, areEqual);

const CharacterDesignerPage = () => {
  //883px is where designer container stops, is on lg or greater dont show scroll bar for padding
  const { authData, setAuthData } = useAuth();
  const [isTallerThan883] = useMediaQuery('(min-height: 883px)')
  const [isMobileViewport] = useMediaQuery('(max-width: 992px)')
  const { assetAddress, assetId, chainId } = useParams<{ assetAddress?: string, assetId?: string, chainId?: string }>();
  console.log('PARAMS', { assetAddress, assetId, chainId })
  const isLoggedIn = !!authData && !!authData.userProfile
  const numCols = 3
  const urlCb = useFetchUrlCallback()

  const [expanded, setExpanded] = useState<CustomizationCategory>(MOONSAMA_CUSTOMIZER_CATEGORIES[0]);

  const [currentCustomization, setCurrentCustomization] = useState<CustomizationType>({
    parent: null,
    children: [],
  });

  const [ownedAssets, setOwnedAssets] = useState<OwnedAssets>({ bridge: [], wallet: [], walletAttributes: [], bridgeAttributes: [] })
  const [myCustomizations, setMyCustomizations] = useState<Array<Asset>>([]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareURLCopied, setShareURLCopied] = useState<boolean>(false);
  const [saveConfigModal, setShowSaveConfigModal] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<{ inProgress?: boolean, errorMessage?: string }>({});
  const [fetchingCustomizations, setFetchingCustomizations] = useState<Array<AssetIdentifier>>([]);
  const [bullshit, setBullshit] = useState<boolean>(false);

  const onChainItems = useOnChainItemsWithCompositeMetaAndAssets();
  const inGameItems = useInGameItemsWithCompositeMetaAndAssets();

  console.log('BINNNNNGGGG')

  const traitOptionsAssets = useMemo(() => {
    console.log('MEMOOO', { ownedAssets })
    return getAssetImages(expanded, ownedAssets);

  }, [expanded, JSON.stringify(ownedAssets)]);

  const onChainMoonsamas = onChainItems?.['Moonsama'] ?? []
  const onChainQQQs = onChainItems?.['???'] ?? []

  useEffect(() => {
    console.log('TRIGGERED')
    const myBridgedAssets = transformBridgedAssets(inGameItems?.assets)
    const myMoonsamas = transformOnChainAssets(onChainItems?.['Moonsama'] ?? [])
    const my1155s = transformOnChainAssets(onChainItems?.['???'] ?? [])

    setOwnedAssets({
      bridge: [...(myBridgedAssets?.assets ?? [])],
      bridgeAttributes: myBridgedAssets?.attributes ?? [],
      wallet: [...(myMoonsamas?.assets ?? []), ...(my1155s?.assets ?? [])],
      walletAttributes: [...(myMoonsamas?.attributes ?? [])]
    })

  }, [JSON.stringify(onChainMoonsamas), JSON.stringify(onChainQQQs), JSON.stringify(inGameItems?.assets)])


  /**
   * TODO @Ishan: If the page has loaded on an asset's URL (...customizer/:assetAddress/:assetId), fetch and set
   * that customization as the currentCustomization.
  */

  useEffect(() => {
    const getCustomizations = async () => {
      const customizations: any = {}

      const ownedAssetsArray = [...ownedAssets.bridge, ...ownedAssets.wallet]

      for (let i = 0; i < ownedAssetsArray.length; i++) {
        const fetching = fetchingCustomizations.find((customization: AssetIdentifier) => {
          return (
            ownedAssetsArray[i].chainId === customization.chainId &&
            ownedAssetsArray[i].assetAddress === customization.assetAddress &&
            ownedAssetsArray[i].assetId === customization.assetId
          )
        })

        if (!fetching) {
          const fetchingAsset: AssetIdentifier = {
            chainId: ownedAssetsArray[i].chainId,
            assetAddress: ownedAssetsArray[i].assetAddress,
            assetId: ownedAssetsArray[i].assetId,
            assetType: ownedAssetsArray[i].assetType
          }

          fetchingCustomizations.push(fetchingAsset)
        }

        const customizationResponse = await getCustomization({
          chainId: ownedAssetsArray[i].chainId,
          assetAddress: ownedAssetsArray[i].assetAddress,
          assetId: ownedAssetsArray[i].assetId,
        }, authData)

        setFetchingCustomizations(fetchingCustomizations.filter((customization: AssetIdentifier) => {
          return (
            ownedAssetsArray[i].chainId !== customization.chainId ||
            ownedAssetsArray[i].assetAddress !== customization.assetAddress ||
            ownedAssetsArray[i].assetId !== customization.assetId
          )
        }))

        if (!!customizationResponse && customizationResponse.data.composite) {
          customizations[`${ownedAssetsArray[i].assetAddress}-${ownedAssetsArray[i].assetId}`] = customizationResponse.data
        }
      }
      setMyCustomizations(customizations)
    }

    if (!!authData && !!authData.jwt) {
      getCustomizations()
    }
  }, [JSON.stringify(ownedAssets), authData?.jwt])

  useEffect(() => {
    if (!!assetAddress && !!assetId && !!chainId) {
      const ae = assetAddress.toLowerCase()
      console.log('PRELOAD', 'loading rom url', { assetAddress, assetId, chainId })
      try {
        const cid = Number.parseInt(chainId)
        const index = traitOptionsAssets.findIndex(x => {
          return x.assetAddress === ae && x.assetId === assetId && x.chainId === cid
        })
        if (index >= 0) {
          selectAsset(index)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }, [assetAddress, assetId, chainId])

  const applyAdditionalLayers = ({ parent, children }: CustomizationType): CustomizationType => {
    console.log('SYNTHETIC ADDITIONAL RUN')

    if (!parent) return { parent, children }

    const newChildren: Asset[] = []

    const adjustments = (layer: Asset, isParent = false) => {
      // check requirements
      // THIS IS HARDCODING
      if (isParent) {
        console.log('ADJUSTMENTS parent found')
        Object.keys(ADDITIONAL_PARENT_LAYERS_CONFIG['requirement']).map(key => {
          const layerRequirement = ADDITIONAL_PARENT_LAYERS_CONFIG['requirement'][key]

          if (key !== '*') {
            const childPresent = children.find(x => x.title === key)
            if (!childPresent) {
              return
            }
          }

          const requiredAssetId = layerRequirement.map(parent.assetId)
          if (!requiredAssetId) {
            return
          }

          const group = findAssetItemGroup({
            chainId: layerRequirement.otherChainId,
            assetAddress: layerRequirement.otherAddress,
            assetId: requiredAssetId,
          })

          console.log('ADJUSTMENTS parent', { requiredAssetId, group })
          if (!!group) {
            console.log('ADJUSTMENT parent group found, child being added')
            newChildren.push({
              chainId: group.chainId,
              assetAddress: group.assetAddress,
              assetId: requiredAssetId,
              assetType: group.assetType,
              customizableTraitName: group.title,
              fullSizeUrl: `${group?.uriPrefix}/${group?.chainId}/${group?.assetAddress}/${requiredAssetId}${group?.uriPostfix}`,
              location: AssetLocation.INCLUDED,
              thumbnailUrl: '',
              title: group.title,
              zIndex: group.zIndex,
              synthetic: group.synthetic,
              dependant: group.dependant
            })
          }
        })
        return
      }

      const layerRequirement = ADDITIONAL_CHILD_LAYERS_CONFIG['requirement'][layer.title]
      if (!!layerRequirement) {
        const requiredAssetId = layerRequirement.map(layer.assetId)
        console.log('ADJUSTMENTS child', layer.assetId, requiredAssetId)
        if (!!requiredAssetId) {
          const requiredAddress = layerRequirement.otherAddress
          const requiredChanId = layerRequirement.otherChainId
          let checkSuccess = false
          // check if requirement is met
          for (let j = 0; j < children.length; j++) {
            const childToCheck = children[j]
            console.log('ADJUSTMENTS child', { layer, childToCheck })
            // we found a requirement
            if (childToCheck.chainId === requiredChanId && childToCheck.assetAddress === requiredAddress && childToCheck.assetId === requiredAssetId) {
              console.log('ADJUSTMENTS child existing found')
              if (!isParent) {
                newChildren.push(layer)
              }
              newChildren.push(childToCheck)
              checkSuccess = true
              break
            }
          }

          // if we find the corree add the missing required layer
          if (!checkSuccess) {
            console.log('ADJUSTMENTS child new one adding')
            if (!isParent) {
              newChildren.push(layer)
            }
            const group = findAssetItemGroup({
              chainId: requiredChanId,
              assetAddress: requiredAddress,
              assetId: requiredAssetId,
            })
            if (!!group) {
              console.log('ADJUSTMENT child group found, child being added')
              newChildren.push({
                chainId: requiredChanId,
                assetAddress: requiredAddress,
                assetId: requiredAssetId,
                assetType: group.assetType,
                customizableTraitName: group.title,
                fullSizeUrl: `${group?.uriPrefix}/${group?.chainId}/${group?.assetAddress}/${requiredAssetId}${group?.uriPostfix}`,
                location: AssetLocation.INCLUDED,
                thumbnailUrl: '',
                title: group.title,
                zIndex: group.zIndex,
                synthetic: group.synthetic,
                dependant: group.dependant
              })
            }
          }
        } else {
          if (!layer.dependant && !isParent) {
            newChildren.push(layer)
          }
        }
      } else {
        if (!layer.dependant && !isParent) {
          newChildren.push(layer)
        }
      }
    }

    adjustments(parent, true)
    for (let i = 0; i < children.length; i++) {
      adjustments(children[i])
    }

    console.log('ADJUSTMENTS', { children, newChildren })
    return {
      parent, children: newChildren
    };
  };




  const selectAsset = async (assetIndex: number) => {
    // if asset is already selected, don't do anything
    if (expanded.equippableType === 'parent') {
      if (
        traitOptionsAssets[assetIndex].assetAddress !== currentCustomization.parent?.assetAddress
        || traitOptionsAssets[assetIndex].assetId !== currentCustomization.parent?.assetId
        || traitOptionsAssets[assetIndex].chainId !== currentCustomization.parent?.chainId
      ) {
        // check if asset has a pre-existing config and use that
        //const preExistingConfig = fetchPreExistingConfig(existingConfig)

        const asset = traitOptionsAssets[assetIndex]
        console.log('PRELOAD', { asset })
        if (asset) {
          const fetching = fetchingCustomizations.find((customization: AssetIdentifier) => {
            return (
              asset.chainId === customization.chainId &&
              asset.assetAddress === customization.assetAddress &&
              asset.assetId === customization.assetId
            )
          })

          if (!fetching) {
            const fetchingAsset: AssetIdentifier = {
              chainId: asset.chainId,
              assetAddress: asset.assetAddress,
              assetId: asset.assetId,
              assetType: asset.assetType
            }

            fetchingCustomizations.push(fetchingAsset)
          }

          const meta = await urlCb(`${process.env.REACT_APP_BACKEND_API_URL}/composite/metadata/${asset.chainId}/${asset?.assetAddress}/${asset?.assetId}`, false) as CompositeMetadataType

          if (!!meta) {
            console.log('PRELOAD', { meta })
            if (meta.composite) {
              const layerObjects = await Promise.all((meta.layers ?? []).map(async (x) => {
                const meta = await urlCb(x, false)
                return meta
              }))
              const layerChildAssets = createLayerAssets(asset, layerObjects as CompositeMetadataType[])

              setCurrentCustomization(applyAdditionalLayers({
                parent: asset,
                children: layerChildAssets
              }))
            } else {
              console.log('PRELOAD', 'meta is null')
              const attributes = attributeFunnel((meta?.attributes as any[] ?? []).map(x => x?.value))

              setCurrentCustomization(applyAdditionalLayers({
                parent: asset,
                children: createAttributeAssets(attributes)
              }))
            }
          }

          setFetchingCustomizations(fetchingCustomizations.filter((customization: AssetIdentifier) => {
            return (
              asset.chainId !== customization.chainId ||
              asset.assetAddress !== customization.assetAddress ||
              asset.assetId !== customization.assetId
            )
          }))
        }

        /*
        setCurrentCustomization(applyAdditionalLayers({
          parent: traitOptionsAssets[assetIndex],
          children: currentCustomization.children
        }))
        */
      }
    } else {
      const toReplace = currentCustomization.children.findIndex(asset => asset.customizableTraitName === expanded.title)
      const newChildren = [...currentCustomization.children]

      const newSelectedAsset = traitOptionsAssets[assetIndex]
      if (toReplace > -1) {
        newChildren.splice(toReplace, 1, newSelectedAsset)
      } else {
        newChildren.push(newSelectedAsset)
      }

      setCurrentCustomization(applyAdditionalLayers({
        parent: currentCustomization.parent,
        children: newChildren.filter(x => !MOONSAMA_CATEGORY_INCOMPATIBILITIES[newSelectedAsset.title] || !MOONSAMA_CATEGORY_INCOMPATIBILITIES[newSelectedAsset.title].includes(x.title))
      }))
    }
  }

  const getSelectedAsset = (expanded: CustomizationCategory) => {
    if (currentCustomization.parent?.customizableTraitName === expanded.title) {
      return currentCustomization.parent?.assetId
    }

    for (let i = 0; i < currentCustomization.children.length; i++) {
      if (currentCustomization.children[i].customizableTraitName === expanded.title) {
        return currentCustomization.children[i].assetId
      }
    }

    return null
  }


  useEffect(() => {
    if (!ownedAssets.bridge && !ownedAssets.bridgeAttributes && !ownedAssets.wallet && !ownedAssets.walletAttributes) {
      return
    }

    // needed to fix glitch when no wallet no bridge connected
    // lol
    console.debug('BULLSHIT trigger', { ownedAssets })
    setBullshit(!bullshit)

  }, [JSON.stringify(ownedAssets)]);

  // owns all the selected items
  let allowedToSave = true;

  [currentCustomization.parent, ...currentCustomization.children].map(x => {
    const loc = x?.location.valueOf()
    if (loc === AssetLocation.NONE.valueOf() || loc === AssetLocation.WALLET.valueOf()) {
      console.log('CANNOT SAVE', x?.title, x?.assetAddress, x?.assetId)
      allowedToSave = false;
    }
  })

  const saveCustomizationCallback = async (openModal = true) => {
    setSaveProgress({ inProgress: true, errorMessage: undefined })
    if (openModal) {
      setShowSaveConfigModal(true)
    }
    try {
      await saveCustomization(currentCustomization, authData)
      setSaveProgress({ inProgress: false, errorMessage: undefined })
    } catch (err) {
      setSaveProgress({ inProgress: false, errorMessage: (err as any)?.toString() })
    }
  }

  return (
    <Container
      sx={{ background: 'url("/moonsama/egg-pattern.svg"), url("/moonsama/background-aurora.svg") top right no-repeat, radial-gradient(73.61% 73.46% at 49.9% 50%, rgba(123, 97, 255, 0.5) 13.27%, rgba(123, 97, 255, 0) 100%), linear-gradient(77.59deg, #4A4A77 -1.39%, #1B1B3A 44.24%);', backgroundBlendMode: 'overlay, hard-light', backgroundSize: 'auto, contain, auto' }}
      minWidth="100%"
      margin="0"
      padding="0"
      minHeight={{ base: "calc(100vh - 80px)", xl: "calc(100vh - 164px)" }}
      height={{ base: "calc(100vh - 80px)", xl: "calc(100vh - 64px)" }}
      overflowY={{ lg: isTallerThan883 ? "hidden" : "scroll" }}
    >
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', lg: '1fr 480px' }}
        maxW="1440px"
        margin="auto"

      >
        <GridItem w='100%' h={{ base: '100vw', lg: '898' }} padding={{ base: "24px 0 0 0", lg: "54px 0 80px 80px" }} >
          <Box
            h="100%"
            // backgroundPosition="0px 1px"
            backgroundSize='cover'
            backgroundRepeat='no-repeat'
            bg="#1B1B3A"
            overflow="hidden"
            // backgroundImage='url(https://static.moonsama.com/customizer-ui/preview-background.jpg)'
            borderRadius={{ base: "8px 8px 0px 0px", lg: "8px 0px 0px 8px" }}
            boxShadow="0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)">

            {!currentCustomization.parent ? (
              <HStack color="white" h="100%" alignItems="center">
                <Box w="100%" textAlign="center" >Select a Moonsama from {isMobileViewport ? 'below' : 'the right'} to begin.</Box>
              </HStack>
            ) : (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <ImageStack layers={[...currentCustomization.children, currentCustomization.parent]} />
                <Box sx={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                  {true ? (
                    <Stack direction="row" justifyContent="start" alignItems="end" spacing={1}>
                      <IconButton
                        aria-label=''
                        style={{ justifySelf: 'center', alignSelf: 'center', margin: 0 }}
                        onClick={() => {
                          if (currentCustomization.children !== null && currentCustomization.parent !== null) {
                            downloadAsImage([...currentCustomization.children, currentCustomization.parent])
                          }
                        }}
                        sx={{ marginBottom: 1 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-download" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                          <polyline points="7 11 12 16 17 11" />
                          <line x1="12" y1="4" x2="12" y2="16" />
                        </svg>
                      </IconButton>
                      <Stack direction={isMobileViewport ? 'row-reverse' : 'row-reverse'} spacing={1} alignItems="center" sx={{ backgroundColor: isLoggedIn && allowedToSave ? 'transparent' : 'transparent', backgroundBlendMode: 'lighten', p: 1, borderRadius: (isMobileViewport ? '0.5rem' : '800px') }}>
                        <Box color="white" style={{ textTransform: 'uppercase', fontSize: '12px', display: 'flex', alignItems: 'center', paddingRight: (isMobileViewport ? '0px' : '8px'), textAlign: 'center' }}>
                          {/*{!isLoggedIn && 'Login to save or share'}
                          {isLoggedIn && !allowedToSave && 'Assets not owned by you'}*/}
                          {isLoggedIn && allowedToSave && <IconButton
                            aria-label=''
                            style={{ justifySelf: 'center', alignSelf: 'center', marginBottom: 0 }}
                            onClick={() => saveCustomizationCallback()}
                            sx={{ marginBottom: 1 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="icon icon-tabler icon-tabler-file-upload" viewBox="0 0 24 24">
                              <path stroke="none" d="M0 0h24v24H0z"></path>
                              <path d="M14 3v4a1 1 0 001 1h4"></path>
                              <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"></path>
                              <path d="M12 11L12 17"></path>
                              <path d="M9 14L12 11 15 14"></path>
                            </svg>
                          </IconButton>}
                          {isLoggedIn && allowedToSave && <IconButton
                            aria-label=''
                            style={{ justifySelf: 'center', alignSelf: 'center', marginBottom: 0, marginLeft: '8px' }}
                            onClick={() => {
                              saveCustomizationCallback(false)
                              setShareURLCopied(false)
                              shareCustomization(currentCustomization, setShowShareModal)
                            }}
                            sx={{ marginBottom: 1 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <circle cx="6" cy="12" r="3" />
                              <circle cx="18" cy="6" r="3" />
                              <circle cx="18" cy="18" r="3" />
                              <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                              <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
                            </svg>
                          </IconButton>}
                        </Box>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack direction="row" justifyContent="start" alignItems="end" spacing={1}>
                      <Button
                        variant="outlined"
                        //loadingPosition="start"
                        onClick={() => {
                          if (currentCustomization.children !== null && currentCustomization.parent !== null) {
                            downloadAsImage([...currentCustomization.children, currentCustomization.parent])
                          }
                        }}
                        sx={{ marginBottom: 1 }}


                      >
                        Download
                      </Button>

                      <Stack direction={isMobileViewport ? 'row-reverse' : 'row-reverse'} spacing={1} alignItems="center" sx={{ backgroundColor: isLoggedIn && allowedToSave ? 'transparent' : 'rgba(22, 19, 43, 0.75)', backgroundBlendMode: 'lighten', p: 1, borderRadius: (isMobileViewport ? '0.5rem' : '800px') }}>
                        <Box style={{ textTransform: 'uppercase', fontSize: '12px', display: 'flex', alignItems: 'center', paddingRight: (isMobileViewport ? '0px' : '8px'), textAlign: 'center' }}>
                          {!isLoggedIn && 'Login to save or share'}
                          {isLoggedIn && !allowedToSave && 'Assets not owned by you'}
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            isLoading={saveProgress.inProgress}
                            variant="outlined"
                            //loadingPosition="start"
                            onClick={() => saveCustomizationCallback()}
                            disabled={!isLoggedIn || !allowedToSave}
                          >
                            Save
                          </Button>

                          <Button
                            variant="outlined"
                            //loadingPosition="start"
                            isLoading={saveProgress.inProgress}
                            onClick={() => {
                              saveCustomizationCallback(false)
                              setShareURLCopied(false)
                              shareCustomization(currentCustomization, setShowShareModal)
                            }}
                            disabled={!isLoggedIn || !allowedToSave}


                          >
                            Share
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                </Box>
              </Box>
            )}
          </Box>

        </GridItem>
        <GridItem w='100%' h={{ lg: '898' }} padding={{ base: "0 0 0 0", lg: "54px 80px 80px 0" }} >
          <Box h="100%" bg="rgba(27, 27, 58, .8)" backdropFilter="blur(8px)" borderRadius={{ base: "inherit", lg: "0px 0px 0px 0px" }} overflow="hidden" boxShadow="0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)">
            <Accordion allowToggle textTransform="uppercase" onChange={(expandedIndex: ExpandedIndex) => {
              if (expandedIndex === -1) {
                return
              }
              setExpanded(MOONSAMA_CUSTOMIZER_CATEGORIES[parseInt(String(expandedIndex))])
            }}>
              {MOONSAMA_CUSTOMIZER_CATEGORIES.filter(option => option.shown).map((customizationOption, optionIndex) => {
                return (
                  <AccordionItem
                    key={customizationOption.title}
                    bg="#1B1B3A"
                    position="relative"
                    _before={{ content: `""`, position: "absolute", top: "-1px", height: "1px", width: "100%", background: "linear-gradient(270deg, #F84AA7 2.78%, #FB7A6F 32.52%, #FFC914 62.72%, #0EEBA8 90.83%)" }}
                    _after={{ content: `""`, position: "absolute", bottom: "-1px", height: "1px", width: "100%", background: "linear-gradient(270deg, #F84AA7 2.78%, #FB7A6F 32.52%, #FFC914 62.72%, #0EEBA8 90.83%)" }}

                    borderColor="#F84AA7">
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton h="80px" backgroundImage={customizationOption.background} backgroundRepeat="no-repeat" color="white" _hover={{ color: "#FFC914" }}>
                            <Box paddingLeft="7px">
                              <img src={customizationOption.icon} width="32" height="32" style={{ flexShrink: 0 }} alt={`${customizationOption.title} Icon`} />
                            </Box>
                            <Box flex='1' textAlign='left' fontSize="16px" paddingLeft="12px">
                              {customizationOption.title.toUpperCase()}
                            </Box>
                            {isExpanded ? (
                              <ChevronUp color="#FFC914" />

                            ) : (
                              <ChevronDown color="#66C8FF" />
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel h="358px" padding="0">
                          <FixedSizeGrid
                            columnCount={3}
                            columnWidth={isMobileViewport ? (Math.floor(window.innerWidth / 3) - 6) : (418 / 3) - 6}
                            height={358}
                            rowCount={Math.ceil(traitOptionsAssets.length / 3)}
                            rowHeight={isMobileViewport ? (Math.floor(window.innerWidth / 3) - 6) : (400 / 3) - 6}
                            width={isMobileViewport ? window.innerWidth : 400}
                            itemData={{ traitOptionsAssets, numCols, fetchingCustomizations, selectedAsset: getSelectedAsset(expanded), onSelectAsset: selectAsset, myCustomizations }}
                            overscanRowCount={3}
                          // className={grid}
                          >
                            {Cell}
                          </FixedSizeGrid>
                        </AccordionPanel>
                      </>
                    )
                    }

                  </AccordionItem>)
              })}
            </Accordion>
          </Box>

        </GridItem>
      </Grid>
    </Container >
  )
}

export default CharacterDesignerPage;
export type { Asset };
export type { AssetIdentifier };
export type { CustomizationType };