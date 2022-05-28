import { useState, useMemo, useEffect } from 'react';
import { useOnChainItemsWithCompositeMetaAndAssets } from 'hooks/multiverse/useOnChainItems';
import { Box, Typography, Modal, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useClasses } from 'hooks';
import { cx } from '@emotion/css';
import { styles } from './styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MOONSAMA_CUSTOMIZATION_ITEM_GROUPS from 'fixtures/MoonsamaCustomizerItemGroups'
import birdToHand from 'fixtures/MoonsamaBirdHandPairing.json'
import ImageStack from 'components/ImageStacks/Moonsama2';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';
import { styled } from '@mui/material/styles';
import "@fontsource/orbitron/500.css";
import { InGameItemWithStatic, useInGameItemsWithCompositeMetaAndAssets } from 'hooks/multiverse/useInGameItems'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import axios from 'axios';
import type { AuthData } from 'context/auth/AuthContext/AuthContext.types';
import { downloadAsImage, saveCustomization, shareCustomization } from 'utils/customizers';
import MOONSAMA_CUSTOMIZER_CATEGORIES from 'fixtures/MoonsamaCustomizerCategories';
import { MOONSAMA_ATTR_TO_ID_MAP } from 'fixtures/MoonsamaAttributeToIdMap';
import { MOONSAMA_CATEGORY_INCOMPATIBILITIES, MOONSAMA_PARENT_CHILDREN_OVERRIDES } from 'fixtures/MoonsamaItemRules';
import { useFetchUrlCallback } from 'hooks/useFetchUrlCallback/useFetchUrlCallback';


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
  location: AssetLocation
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
  return await axios.request<getCustomizationsResponse>({
    method: 'get',
    url: `${process.env.REACT_APP_BACKEND_API_URL}/composite/metadata/${chainId}/${assetAddress}/${assetId}`,
    headers: { Authorization: `Bearer ${authData?.jwt}` }
  }).catch(console.error)
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

  return ret as AssetIdentifier[]
}

const findAssetItemGroup = (asset?: AssetIdentifier) => {
  const ig = MOONSAMA_CUSTOMIZATION_ITEM_GROUPS.find(group => {
    const baseCheck = group.assetAddress === asset?.assetAddress && group.chainId === asset?.chainId
    if (baseCheck && group.assetIDRanges) {
      for (let i = 0; i < group.assetIDRanges.length; i++) {
        const range = group.assetIDRanges[i]
        const id = Number.parseInt(asset.assetId)
        return id >= range[0] && id <= range[1]
      }
    } else {
      return false
    }
  })

  return ig
}

const createLayerAssets = (parent: Asset, layers: CompositeMetadataType[]): Asset[] => {
  const repeatMap: { [key: string]: boolean } = {}

  const res = layers.map(layerMeta => {

    if (layerMeta.asset?.assetAddress === parent.assetAddress && layerMeta?.asset?.assetId === parent.assetId) {
      return undefined
    }

    const asset = layerMeta.asset
    const ig = findAssetItemGroup(asset)

    if (!ig || !asset) {
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
      owned: true
    }
  }).filter(x => !!x)
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

  if (title === 'Ambience' || title === 'Foreground') {
    return AssetLocation.INCLUDED
  }

  for (let i = 0; i < ownedAssets.bridge.length; i++) {
    if (ownedAssets.bridge[i].chainId === chainId && ownedAssets.bridge[i].assetAddress === assetAddress && ownedAssets.bridge[i].assetId === assetId && ownedAssets.bridge[i].assetType === assetType) {
      return AssetLocation.BRIDGE;
    }
  }

  for (let i = 0; i < ownedAssets.wallet.length; i++) {
    if (ownedAssets.wallet[i].chainId === chainId && ownedAssets.wallet[i].assetAddress === assetAddress && ownedAssets.wallet[i].assetId === assetId && ownedAssets.wallet[i].assetType === assetType) {
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
      owned: true
    }

  }).filter(x => !!x) as Asset[]
}

const getAssetImages = (customizationCategory: CustomizationCategory, ownedAssets: OwnedAssets) => {
  const options = []
  const bridgeOptions = []
  const walletOptions = []

  const attributeOptions = []
  const attributeBridgeOptions = []
  const attributeWalletOptions = []

  //const attrDuplicateMap: {[key: string]: boolean} = {}


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
            owned: true
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
            owned: true
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
            location: AssetLocation.WALLET,
            owned: true,
            customization: false
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
            location: AssetLocation.NONE
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

const ExpandMoreIcon = ({ expanded }: { expanded?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke={expanded ? '#FFC914' : '#66C8FF'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="icon icon-tabler icon-tabler-chevron-down"
      viewBox="0 0 24 24"
    >
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <path d="M6 9L12 15 18 9"></path>
    </svg>
  );
}

const Cell = ({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
  const { gridItem, selected } = useClasses(styles);
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('sm'));

  const assetIndex = (data.numCols * rowIndex) + columnIndex;

  if (assetIndex >= data.traitOptionsAssets.length) return <></>;

  const isSelected = (data.selectedAsset === data.traitOptionsAssets[assetIndex].assetId);

  /*
   * TODO @Kyilkhor: If I own this asset and a customization exists for it, we should show the asset with the customization applied.
   * Selecting this asset should automatically apply the customization to the "currentCustomization" variable.
  */

  const customization = data.myCustomizations[`${data.traitOptionsAssets[assetIndex].assetAddress} - ${data.traitOptionsAssets[assetIndex].assetId}`];

  return (
    <Box style={style} sx={{ overflow: 'hidden', padding: isMobileViewport ? '0px' : '8px' }} onClick={() => data.onSelectAsset(assetIndex)}>
      <Box className={cx({ [gridItem]: true }, { [selected]: isSelected })}>
        {typeof customization === 'undefined' ? (
          <img src={data.traitOptionsAssets[assetIndex].thumbnailUrl} style={{ borderRadius: '8px', backgroundColor: '#1B1B3A' }} width={isMobileViewport ? ((Math.floor(window.innerWidth / 3)) - 8) : '200'} height={isMobileViewport ? ((Math.floor(window.innerWidth / 3)) - 8) : '200'} alt="" />
        ) : (
          <ImageStack layers={customization.layers} />
        )
        }
      </Box>
    </Box>
  );
};

const CharacterDesignerPage = ({ authData }: { authData: AuthData }) => {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('sm'));
  const isLoggedIn = !!authData && !!authData.userProfile
  const urlCb = useFetchUrlCallback()

  const [expanded, setExpanded] = useState<CustomizationCategory>(MOONSAMA_CUSTOMIZER_CATEGORIES[0]);

  const [currentCustomization, setCurrentCustomization] = useState<CustomizationType>({
    parent: null,
    children: [],
  });

  const [ownedAssets, setOwnedAssets] = useState<OwnedAssets>({ bridge: [], wallet: [], walletAttributes: [], bridgeAttributes: [] })
  const [numCols, setNumCols] = useState(isMobileViewport ? 2 : 3);
  const [myCustomizations, setMyCustomizations] = useState<Array<any>>([]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [saveConfigModal, setShowSaveConfigModal] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<{ inProgress?: boolean, errorMessage?: string }>({});

  const onChainItems = useOnChainItemsWithCompositeMetaAndAssets();
  const inGameItems = useInGameItemsWithCompositeMetaAndAssets();

  console.log('BINNNNNGGGG')

  const traitOptionsAssets = useMemo(() => {
    console.log('MEMOOO')
    return getAssetImages(expanded, ownedAssets)
  }, [expanded, JSON.stringify(ownedAssets)]);

  useEffect(() => setNumCols(isMobileViewport ? 2 : 3), [isMobileViewport]);

  const onChainMoonsamas = onChainItems?.['Moonsama'] ?? []
  const onChainQQQs = onChainItems?.['???'] ?? []

  useEffect(() => {
    console.log('TRIGGERED')
    const myBridgedAssets = transformBridgedAssets(inGameItems?.assets)
    const myMoonsamas = transformOnChainAssets(onChainItems?.['Moonsama'] ?? [])
    const my1155s = transformOnChainAssets(onChainItems?.['???'] ?? [])

    setOwnedAssets({
      bridge: myBridgedAssets?.assets ?? [],
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
        const customizationResponse = await getCustomization({
          chainId: ownedAssetsArray[i].chainId,
          assetAddress: ownedAssetsArray[i].assetAddress,
          assetId: ownedAssetsArray[i].assetId,
        }, authData).catch(e => alert('error'));

        if (typeof customizationResponse !== 'undefined' && customizationResponse.data.composite) {
          customizations[`${ownedAssetsArray[i].assetAddress}-${ownedAssetsArray[i].assetId}`] = customizationResponse.data
        }
      }

      setMyCustomizations(customizations)
    }

    if (!!authData && !!authData.jwt) {
      getCustomizations()
    }
  }, [JSON.stringify(ownedAssets), authData?.jwt])

  const applyAdditionalLayers = ({ parent, children }: CustomizationType): CustomizationType => {
    let hasEquippedMainHand = false, mainHandTrait, weaponHandTrait

    if ( !parent ) return { parent, children }


    // FIXME
    // this is fine for now because no attribute traits are main hand traits
    for (let i = 0; i < MOONSAMA_CUSTOMIZATION_ITEM_GROUPS.length; i++) {
      if (MOONSAMA_CUSTOMIZATION_ITEM_GROUPS[i].title === 'Main Hand') {
        mainHandTrait = MOONSAMA_CUSTOMIZATION_ITEM_GROUPS[i];
      } else if (MOONSAMA_CUSTOMIZATION_ITEM_GROUPS[i].title === 'Weapon Hand') {
        weaponHandTrait = MOONSAMA_CUSTOMIZATION_ITEM_GROUPS[i]
      }
    }

    if (!mainHandTrait || !weaponHandTrait) return { parent, children }

    for (let i = 0; i < children.length; i++) {
      if (hasEquippedMainHand) break

      const assetIdRanges = mainHandTrait?.assetIDRanges ?? []
      if (children[i].assetAddress === mainHandTrait.assetAddress) {
        for (let j = 0; j < assetIdRanges?.length; j++) {
          if (parseInt(children[i].assetId) >= assetIdRanges[j][0] && parseInt(children[i].assetId) <= assetIdRanges[j][1]) {
            hasEquippedMainHand = true
            break
          }
        }
      }
    }

    if (!hasEquippedMainHand) return { parent, children: children.filter(x => x.title !== 'Weapon Hand') }

    const toReplace = children.findIndex(asset => asset.customizableTraitName === 'Weapon Hand')
    const newChildren = [...children]
    const birdHandMapping: { [index: string]: number } = birdToHand

    const weaponHandAssetID = birdHandMapping[parent.assetId].toString()

    const weaponHand = {
      location: AssetLocation.INCLUDED,
      title: weaponHandTrait?.title,
      thumbnailUrl: '',
      fullSizeUrl: `${weaponHandTrait?.uriPrefix}/${weaponHandTrait?.chainId}/${weaponHandTrait?.assetAddress}/${weaponHandAssetID}${weaponHandTrait?.uriPostfix}`,
      chainId: weaponHandTrait?.chainId,
      assetAddress: weaponHandTrait?.assetAddress,
      assetId: weaponHandAssetID,
      assetType: weaponHandTrait?.assetType,
      zIndex: weaponHandTrait?.zIndex,
      customizableTraitName: weaponHandTrait?.title
    }

    if (toReplace > -1) {
      newChildren.splice(toReplace, 1, weaponHand)
    } else {
      newChildren.push(weaponHand)
    }

    return {
      parent, children: newChildren
    };
  };

  const {
    customizerContainer,
    previewViewport,
    traitExplorer,
    customizerActionButton,
    startCue,
  } = useClasses(styles);

  const handleChange =
    (customizationOption: CustomizationCategory) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(customizationOption);
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
        if (asset) {
          const meta = await urlCb(`${process.env.REACT_APP_BACKEND_API_URL}/composite/metadata/${asset.chainId}/${asset?.assetAddress}/${asset?.assetId}`, false) as CompositeMetadataType

          if (!!meta) {
            if (meta.composite) {
              const layerObjects = await Promise.all((meta.layers ?? []).map((x) => urlCb(x, false)))
              const layerChildAssets = createLayerAssets(asset, layerObjects as CompositeMetadataType[])

              setCurrentCustomization(applyAdditionalLayers({
                parent: asset,
                children: layerChildAssets
              }))
            } else {
              const attributes = attributeFunnel((meta.attributes as any[] ?? []).map(x => x?.value))

              setCurrentCustomization(applyAdditionalLayers({
                parent: asset,
                children: createAttributeAssets(attributes)
              }))
            }
          }
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

  // owns all the selected items
  let allowedToSave = true;

  [currentCustomization.parent, ...currentCustomization.children].map(x => {
    const loc = x?.location.valueOf()
    if (loc === AssetLocation.NONE.valueOf() || loc === AssetLocation.WALLET.valueOf()) {
      console.log('CANNOT SAVE', x?.title, x?.assetAddress, x?.assetId)
      allowedToSave = false;
    }
  })

  /**
   * TODO @Ishan: Accordion not animating and no hover effect.
  */

  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    borderImageSlice: 1,
    borderImageSource: 'linear-gradient(270deg, #F84AA7 2.78%, #FB7A6F 32.52%, #FFC914 62.72%, #0EEBA8 90.83%)',
    padding: 0
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      {...props}
    />
  ))(({ theme }) => ({
    height: '80px',
  }));

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

  /**
   * TODO @Ishan: Fix issue with page height on larger viewports.
  */
  return (
    <Box sx={{ flex: 1, height: isMobileViewport ? '100%' : '100vh', minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'url("/moonsama/egg-pattern.svg"), url("/moonsama/background-aurora.svg") top right no-repeat, radial-gradient(73.61% 73.46% at 49.9% 50%, rgba(123, 97, 255, 0.5) 13.27%, rgba(123, 97, 255, 0) 100%), linear-gradient(77.59deg, #4A4A77 -1.39%, #1B1B3A 44.24%);', backgroundBlendMode: 'overlay, hard-light', backgroundSize: 'auto, contain, auto' }}>
      <Box sx={{ flex: 1, width: '100%' }}>
        <Box className={customizerContainer}>
          <Box className={previewViewport}>
            {!currentCustomization.parent ? (
              <Box className={startCue}>
                Select a Moonsama from {isMobileViewport ? 'below' : 'the right'} to begin.
              </Box>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <ImageStack layers={[...currentCustomization.children, currentCustomization.parent]} />
                <div style={{ position: 'absolute', bottom: '16px', left: '8px', display: 'flex' }}>
                  <button
                    onClick={() => {
                      if (currentCustomization.children !== null && currentCustomization.parent !== null) {
                        downloadAsImage([...currentCustomization.children, currentCustomization.parent])
                      }
                    }}
                    type="button"
                    className={customizerActionButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-download" width="34" height="34" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                      <polyline points="7 11 12 16 17 11" />
                      <line x1="12" y1="4" x2="12" y2="16" />
                    </svg>
                  </button>

                  {isLoggedIn && allowedToSave && (<>
                    <button
                      onClick={() => saveCustomizationCallback()}
                      type="button"
                      className={customizerActionButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="icon icon-tabler icon-tabler-file-upload" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z"></path>
                        <path d="M14 3v4a1 1 0 001 1h4"></path>
                        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"></path>
                        <path d="M12 11L12 17"></path>
                        <path d="M9 14L12 11 15 14"></path>
                      </svg>
                    </button>

                    <button
                      onClick={() => {
                        saveCustomizationCallback(false)
                        shareCustomization(currentCustomization, setShowShareModal)
                      }}
                      type="button"
                      className={customizerActionButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share" width="34" height="34" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="6" r="3" />
                        <circle cx="18" cy="18" r="3" />
                        <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                        <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
                      </svg>
                    </button>
                  </>)}
                </div>
              </div>
            )}
          </Box>
          <Box className={traitExplorer}>
            {MOONSAMA_CUSTOMIZER_CATEGORIES.filter(option => option.shown).map(customizationOption => {
              const isExpanded = expanded.title === customizationOption.title

              return (
                <Accordion TransitionProps={{ unmountOnExit: true }} sx={{ borderBottom: `${isExpanded ? '2px' : '0px'} solid` }} expanded={isExpanded} onChange={handleChange(customizationOption)}>
                  <AccordionSummary
                    sx={{ opacity: isExpanded ? 1 : 0.6, background: `url(${customizationOption.background})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                    aria-controls={`${customizationOption.title}-content`}
                    expandIcon={<ExpandMoreIcon expanded={isExpanded} />}
                    id={`${customizationOption.title.replace(' ', '-').toLowerCase()}-header`}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={customizationOption.icon} width="32" height="32" style={{ flexShrink: 0 }} alt={`${customizationOption.title} Icon`} />
                      <Typography sx={{ marginLeft: '12px', flexShrink: 0, fontFamily: 'Orbitron', fontSize: '16px', letterSpacing: '0.1em', fontWeight: '500', textTransform: 'uppercase', lineHeight: '24px' }}>
                        {customizationOption.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ height: 360, overflowY: 'auto', padding: 0 }}>
                    <SimpleBar style={{ maxHeight: 360 }}>
                      <FixedSizeGrid
                        columnCount={isMobileViewport ? 3 : 3}
                        columnWidth={isMobileViewport ? Math.floor(window.innerWidth / 3) : 670 / 3}
                        height={360}
                        rowCount={Math.ceil(traitOptionsAssets.length / 3)}
                        rowHeight={isMobileViewport ? Math.floor(window.innerWidth / 3) : 670 / 3}
                        width={isMobileViewport ? window.innerWidth : 670}
                        itemData={{ traitOptionsAssets, numCols, selectedAsset: getSelectedAsset(expanded), onSelectAsset: selectAsset, myCustomizations }}
                        overscanRowCount={3}
                      >
                        {Cell}
                      </FixedSizeGrid>
                    </SimpleBar>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Modal
        open={showShareModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: '8px',
          color: '#333',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Share your customized Moonsama.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {(new URL(`/moonsama/designer/${currentCustomization.parent?.assetAddress}/${currentCustomization.parent?.assetId}`, `${window.location.protocol}//${window.location.host}`)).href}
          </Typography>

          <Box sx={{
            backgroundColor: '#0EB8A8',
            textTransform: 'uppercase',
            padding: '12px 18px',
            fontFamily: 'Orbitron',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.032em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid transparent',
            margin: '32px auto 0px auto',
            width: '60px',
            cursor: 'pointer',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: '600',
            color: '#FFFFFF'
          }} onClick={() => setShowShareModal(false)}>Done</Box>
        </Box>
      </Modal>

      <Modal
        open={saveConfigModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: '8px',
          color: '#333',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Your 2.0 Moonsama is being cooked
          </Typography>
          {saveProgress.inProgress && <Box display={'flex'} style={{ paddingTop: theme.spacing(2) }}><CircularProgress sx={{ alignSelf: 'center', textAlign: 'center' }} /></Box>}
          {!saveProgress.inProgress && !saveProgress.errorMessage && <Typography id="modal-modal-description" sx={{ mt: 2, wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word', textAlign: 'center' }}>
            Done! You can access your config at
          </Typography>
          }
          {!saveProgress.inProgress && !saveProgress.errorMessage && <Typography id="modal-modal-description" sx={{ mt: 2, wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {(new URL(`/moonsama/designer/${currentCustomization.parent?.assetAddress}/${currentCustomization.parent?.assetId}`, `${window.location.protocol}//${window.location.host}`)).href}
          </Typography>
          }

          {!saveProgress.inProgress && saveProgress.errorMessage && <Typography id="modal-modal-description" sx={{ mt: 2, wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word', textAlign: 'center' }}>
            {saveProgress.errorMessage}
          </Typography>
          }

          {!saveProgress.inProgress && <Box sx={{
            backgroundColor: '#0EB8A8',
            textTransform: 'uppercase',
            padding: '12px 18px',
            fontFamily: 'Orbitron',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.032em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid transparent',
            margin: '32px auto 0px auto',
            width: '60px',
            cursor: 'pointer',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: '600',
            color: '#FFFFFF'
          }} onClick={() => {
            setShowSaveConfigModal(false)
          }}>{!saveProgress?.errorMessage ? `Great!` : `Oops`}</Box>}
        </Box>
      </Modal>
    </Box >
  );
};

export default CharacterDesignerPage;
export type { Asset };
export type { AssetIdentifier };
export type { CustomizationType };
