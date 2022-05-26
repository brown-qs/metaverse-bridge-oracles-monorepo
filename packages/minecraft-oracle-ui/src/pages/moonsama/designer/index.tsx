import { useState, useMemo, useEffect } from 'react';
import { useOnChainItems } from 'hooks/multiverse/useOnChainItems';
import { Box, Typography, Modal } from '@mui/material';
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
import CUSTOMIZATION_OPTIONS from 'fixtures/MoonsamaCustomizer.json'
import birdToHand from 'fixtures/MoonsamaBirdHandPairing.json'
import ImageStack from 'components/ImageStacks/Moonsama2';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';
import { styled } from '@mui/material/styles';
import "@fontsource/orbitron/500.css";
import { useInGameItems } from 'hooks/multiverse/useInGameItems';
import type { InGameItemWithStatic } from 'hooks/multiverse/useInGameItems'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import axios from 'axios';
import type { AuthData } from 'context/auth/AuthContext/AuthContext.types';
import { downloadAsImage, saveCustomization, shareCustomization } from 'utils/customizers';

enum AssetLocation {
  BRIDGE = 'BRIDGE',
  WALLET = 'WALLET',
  NONE = 'NONE'
}

type CustomizableTraitType = {
  title: string,
  icon: string,
  background: string,
  assetAddress: string,
  assetIDRanges: Array<Array<number>>,
  assetType: string,
  uriPrefix: string,
  uriPostfix: string,
  chainID: number,
  equippableType: string,
  zIndex: number,
  location?: AssetLocation
}

type asset = {
  thumbnailUrl: string,
  fullSizeUrl: string,
  chainID: number,
  assetAddress: string,
  assetID: string,
  assetType: string,
  zIndex: number,
  customizableTraitName: string
}

type AssetIdentifier = {
  chainID: number,
  assetAddress: string,
  assetID: string,
  assetType: string,
}

type OwnedAssets = {
  bridge: AssetIdentifier[],
  wallet: AssetIdentifier[],
  notOwned: AssetIdentifier[]
}

type CustomizationType = {
  parent: asset | null,
  children: Array<asset>
}

type getCustomizationsResponse = {
  composite: boolean
}

const getCustomization = async ({ chainID, assetAddress, assetID }: { chainID: number, assetAddress: string, assetID: string }, authData: AuthData) => {
  return await axios.request<getCustomizationsResponse>({
    method: 'get',
    url: `${process.env.REACT_APP_BACKEND_API_URL}/composite/metadata/${chainID}/${assetAddress}/${assetID}`,
    headers: { Authorization: `Bearer ${authData?.jwt}` }
  }).catch(console.error)
}

const transformBridgedAssets = (inGameAssets: Array<InGameItemWithStatic> | undefined) => {
  if (typeof inGameAssets === 'undefined') return []

  return inGameAssets.map((inGameAsset) => {
    return {
      chainID: 1285,
      assetAddress: inGameAsset?.assetAddress.replace('0x9bca2cced0aeebd47f2d6f2e37564c5175cd0e2e', '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a'),
      // assetAddress: inGameAsset?.assetAddress,
      assetID: inGameAsset?.assetId,
      assetType: inGameAsset?.assetType,
    }
  })
}

const transformOnChainAssets = (onChainItems: Array<any> | undefined) => {
  if (typeof onChainItems === 'undefined') return []

  return onChainItems.map((onChainItem) => {
    return {
      chainID: 1285,
      assetAddress: onChainItem?.asset.assetAddress.replace('0x9bca2cced0aeebd47f2d6f2e37564c5175cd0e2e', '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a'),
      // assetAddress: onChainItem?.asset.assetAddress,
      assetID: onChainItem?.asset.assetId,
      assetType: onChainItem?.asset.assetType,
    }
  })
}

const getAssetLocation = ({ chainID, assetAddress, assetID, assetType }: AssetIdentifier, ownedAssets: OwnedAssets): AssetLocation => {
  for (let i = 0; i < ownedAssets.bridge.length; i++) {
    if (ownedAssets.bridge[i].chainID === chainID && ownedAssets.bridge[i].assetAddress === assetAddress && ownedAssets.bridge[i].assetID === assetID && ownedAssets.bridge[i].assetType === assetType) {
      return AssetLocation.BRIDGE;
    }
  }

  for (let i = 0; i < ownedAssets.wallet.length; i++) {
    if (ownedAssets.wallet[i].chainID === chainID && ownedAssets.wallet[i].assetAddress === assetAddress && ownedAssets.wallet[i].assetID === assetID && ownedAssets.wallet[i].assetType === assetType) {
      return AssetLocation.WALLET;
    }
  }

  return AssetLocation.NONE
}

const getAssetImages = (customizableTrait: CustomizableTraitType, ownedAssets: OwnedAssets) => {
  const options = []
  const bridgeOptions = []
  const walletOptions = []

  for (let i = 0; i < customizableTrait.assetIDRanges.length; i++) {
    const assetRange = customizableTrait.assetIDRanges[i];

    for (let j = assetRange[0]; j <= assetRange[1]; j++) {
      const option = {
        thumbnailUrl: `${customizableTrait.uriPrefix}customizer/${customizableTrait.chainID}/${customizableTrait.assetAddress}/${j}${customizableTrait.uriPostfix}`,
        fullSizeUrl: `${customizableTrait.uriPrefix}${customizableTrait.chainID}/${customizableTrait.assetAddress}/${j}${customizableTrait.uriPostfix}`,
        chainID: customizableTrait.chainID,
        assetAddress: customizableTrait.assetAddress,
        assetID: j.toString(),
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

  return [...bridgeOptions, ...walletOptions, ...options];
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

  const isSelected = (data.selectedAsset === data.traitOptionsAssets[assetIndex].assetID);

  /*
   * TODO @Kyilkhor: If I own this asset and a customization exists for it, we should show the asset with the customization applied.
   * Selecting this asset should automatically apply the customization to the "currentCustomization" variable.
  */

  const customization = data.myCustomizations[`${data.traitOptionsAssets[assetIndex].assetAddress} - ${data.traitOptionsAssets[assetIndex].assetID}`];

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
  /*
   * TODO @Kyilkhor: This component keeps re-rendering on each new block. I'd like for a re-render to occur when the state of
   * onChainItems or inGameItems changes but not on each block.
  */

  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('sm'));
  const isLoggedIn = !!authData && !!authData.userProfile

  const [expanded, setExpanded] = useState<CustomizableTraitType>(CUSTOMIZATION_OPTIONS[0]);

  const [currentCustomization, setCurrentCustomization] = useState<CustomizationType>({
    parent: null,
    children: [],
  });

  const [ownedAssets, setOwnedAssets] = useState<OwnedAssets>({bridge: [], wallet: [], notOwned: []})
  const [numCols, setNumCols] = useState(isMobileViewport ? 2 : 3);
  const [myCustomizations, setMyCustomizations] = useState<Array<any>>([]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const onChainItems = useOnChainItems();
  const inGameItems = useInGameItems();

  const traitOptionsAssets = useMemo(() => getAssetImages(expanded, ownedAssets), [expanded, ownedAssets]);

  useEffect(() => setNumCols(isMobileViewport ? 2 : 3), [isMobileViewport]);

  useEffect(() => {
    const myBridgedAssets = transformBridgedAssets(inGameItems?.assets)
    const myMoonsamas = transformOnChainAssets(onChainItems?.['Moonsama'] ?? [])
    const my1155s = transformOnChainAssets(onChainItems?.['???'] ?? [])

    setOwnedAssets({
        bridge: myBridgedAssets,
        wallet: [...myMoonsamas, ...my1155s],
        notOwned: []
    })

  }, [JSON.stringify(onChainItems), JSON.stringify(inGameItems)])


  /**
   * TODO @Ishan: If the page has loaded on an asset's URL (...customizer/:assetAddress/:assetID), fetch and set
   * that customization as the currentCustomization.
  */

  useEffect(() => {
    const getCustomizations = async () => {
      const customizations: any = {}

      const ownedAssetsArray = [...ownedAssets.bridge, ...ownedAssets.wallet, ...ownedAssets.notOwned]
      for (let i = 0; i < ownedAssetsArray.length; i++) {
        const customizationResponse = await getCustomization({
          chainID: ownedAssetsArray[i].chainID,
          assetAddress: ownedAssetsArray[i].assetAddress,
          assetID: ownedAssetsArray[i].assetID,
        }, authData).catch(e => alert('error'));

        if (typeof customizationResponse !== 'undefined' && customizationResponse.data.composite) {
          customizations[`${ownedAssetsArray[i].assetAddress}-${ownedAssetsArray[i].assetID}`] = customizationResponse.data
        }
      }

      setMyCustomizations(customizations)
    }

    if (!!authData && !!authData.userProfile) {
      getCustomizations()
    }
  }, [JSON.stringify(ownedAssets), JSON.stringify(authData)])

  const applyAdditionalLayers = ({ parent, children }: CustomizationType): CustomizationType => {
    let hasEquippedMainHand = false, mainHandTrait, weaponHandTrait

    if (parent === null) return { parent, children }

    for (let i = 0; i < CUSTOMIZATION_OPTIONS.length; i++) {
      if (CUSTOMIZATION_OPTIONS[i].title === 'Main Hand') {
        mainHandTrait = CUSTOMIZATION_OPTIONS[i];
      } else if (CUSTOMIZATION_OPTIONS[i].title === 'Weapon Hand') {
        weaponHandTrait = CUSTOMIZATION_OPTIONS[i]
      }
    }

    if (!mainHandTrait || !weaponHandTrait) return { parent, children }

    for (let i = 0; i < children.length; i++) {
      if (hasEquippedMainHand) break

      if (children[i].assetAddress === mainHandTrait.assetAddress) {
        for (let j = 0; j < mainHandTrait.assetIDRanges?.length; j++) {
          if (parseInt(children[i].assetID) >= mainHandTrait.assetIDRanges[j][0] && parseInt(children[i].assetID) <= mainHandTrait.assetIDRanges[j][1]) {
            hasEquippedMainHand = true
            break
          }
        }
      }
    }

    if (!hasEquippedMainHand) return { parent, children }

    const toReplace = children.findIndex(asset => asset.customizableTraitName === 'Weapon Hand')
    const newChildren = [...children]
    const birdHandMapping: { [index: string]: number } = birdToHand

    const weaponHandAssetID = birdHandMapping[parent.assetID].toString()

    const weaponHand = {
      thumbnailUrl: '',
      fullSizeUrl: `${weaponHandTrait?.uriPrefix}${weaponHandTrait?.chainID}/${weaponHandTrait?.assetAddress}/${weaponHandAssetID}${weaponHandTrait?.uriPostfix}`,
      chainID: weaponHandTrait?.chainID,
      assetAddress: weaponHandTrait?.assetAddress,
      assetID: weaponHandAssetID,
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
    (customizationOption: CustomizableTraitType) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(customizationOption);
    };

  const selectAsset = (assetIndex: number) => {
    if (expanded.equippableType === 'parent') {
      setCurrentCustomization(applyAdditionalLayers({
        parent: traitOptionsAssets[assetIndex],
        children: currentCustomization.children
      }))
    } else {
      const toReplace = currentCustomization.children.findIndex(asset => asset.customizableTraitName === expanded.title)
      const newChildren = [...currentCustomization.children]

      if (toReplace > -1) {
        newChildren.splice(toReplace, 1, traitOptionsAssets[assetIndex])
      } else {
        newChildren.push(traitOptionsAssets[assetIndex])
      }

      setCurrentCustomization(applyAdditionalLayers({
        parent: currentCustomization.parent,
        children: newChildren
      }))
    }
  }

  const getSelectedAsset = (expanded: CustomizableTraitType) => {
    if (currentCustomization.parent?.customizableTraitName === expanded.title) {
      return currentCustomization.parent?.assetID
    }

    for (let i = 0; i < currentCustomization.children.length; i++) {
      if (currentCustomization.children[i].customizableTraitName === expanded.title) {
        return currentCustomization.children[i].assetID
      }
    }

    return null
  }

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


  /**
   * TODO @Ishan: Fix issue with page height on larger viewports.
  */
  return (
    <Box sx={{ flex: 1, height: isMobileViewport ? '100%' : '100vh', minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'url("/moonsama/egg-pattern.svg"), url("/moonsama/background-aurora.svg") top right no-repeat, radial-gradient(73.61% 73.46% at 49.9% 50%, rgba(123, 97, 255, 0.5) 13.27%, rgba(123, 97, 255, 0) 100%), linear-gradient(77.59deg, #4A4A77 -1.39%, #1B1B3A 44.24%);', backgroundBlendMode: 'overlay, hard-light', backgroundSize: 'auto, contain, auto' }}>
      <Box sx={{ flex: 1, width: '100%' }}>
        <Box className={customizerContainer}>
          <Box className={previewViewport}>
            {currentCustomization.parent === null ? (
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

                  {isLoggedIn && (<>
                    <button
                      onClick={() => saveCustomization(currentCustomization, authData)}
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
                      onClick={() => shareCustomization(currentCustomization, authData, setShowShareModal)}
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
            {CUSTOMIZATION_OPTIONS.filter(option => option.shown).map(customizationOption => {
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
            {(new URL(`/moonsama/designer/${currentCustomization.parent?.assetAddress}/${currentCustomization.parent?.assetID}`, `${window.location.protocol}//${window.location.host}`)).href}
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
    </Box >
  );
};

export default CharacterDesignerPage;
export type { asset };
export type { AssetIdentifier };
export type { CustomizationType };
