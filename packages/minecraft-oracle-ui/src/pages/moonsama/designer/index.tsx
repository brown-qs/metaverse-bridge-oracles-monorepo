import { useState, useMemo, useEffect } from 'react';
import { useOnChainItems } from 'hooks/multiverse/useOnChainItems';
import { useActiveWeb3React } from 'hooks';
import { AppBar, Box, Typography, Toolbar } from '@mui/material';
import { truncateAddress } from 'utils';
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
import customizationOptions from 'fixtures/MoonsamaCustomizer.json'
import ImageStack from 'components/ImageStacks/Moonsama2';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';
import { useProfile } from 'hooks/multiverse/useProfile';
// import LoginButton from 'components/LoginButton';
// import { saveCustomization, shareCustomization, fetchCustomizations } from 'utils/customizers/moonsama';
import { styled } from '@mui/material/styles';
import "@fontsource/orbitron/500.css";
import { AuthData } from 'context/auth/AuthContext/AuthContext.types';


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

  const assetIndex = (data.numCols * rowIndex) + columnIndex

  if (assetIndex >= data.traitOptionsAssets.length) return <></>

  const isSelected = (data.selectedAsset === data.traitOptionsAssets[assetIndex].assetID)

  return (
    <Box style={style} sx={{ overflow: 'hidden', padding: '8px' }} onClick={() => data.onSelectAsset(assetIndex)}>
      <Box className={cx({ [gridItem]: true }, { [selected]: isSelected })}>
        <img src={data.traitOptionsAssets[assetIndex].thumbnailUrl} style={{ borderRadius: '8px', backgroundColor: '#1B1B3A' }} width="200" height="200" alt="" />
      </Box>
    </Box>
  );
}

type customizableTraitType = {
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
}

type asset = {
  thumbnailUrl: string,
  fullSizeUrl: string,
  chainID: number,
  assetAddress: string,
  assetID: number,
  assetType: string,
  zIndex: number,
  customizableTraitName: string
}

type customizationType = {
  parent: asset | null,
  children: Array<asset>
}

const getAssetImages = (customizableTrait: customizableTraitType) => {
  const options = []

  for (let i = 0; i < customizableTrait.assetIDRanges.length; i++) {
    const assetRange = customizableTrait.assetIDRanges[i];

    for (let j = assetRange[0]; j <= assetRange[1]; j++) {
      options.push({
        thumbnailUrl: `${customizableTrait.uriPrefix}customizer/${customizableTrait.chainID}/${customizableTrait.assetAddress}/${j}${customizableTrait.uriPostfix}`,
        fullSizeUrl: `${customizableTrait.uriPrefix}${customizableTrait.chainID}/${customizableTrait.assetAddress}/${j}${customizableTrait.uriPostfix}`,
        chainID: customizableTrait.chainID,
        assetAddress: customizableTrait.assetAddress,
        assetID: j,
        assetType: customizableTrait.assetType,
        zIndex: customizableTrait.zIndex,
        customizableTraitName: customizableTrait.title
      })
    }
  }

  return options;
}

const CharacterDesignerPage = ({ authData }: {authData: AuthData}) => {
  const [expanded, setExpanded] = useState<customizableTraitType>(customizationOptions[0]);

  const [currentCustomization, setCurrentCustomization] = useState<customizationType>({
    parent: null,
    children: [],
  });

  const { account } = useActiveWeb3React();
  const profile = useProfile();
  const onChainItems = useOnChainItems();

  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('sm'));

  const traitOptionsAssets = useMemo(() => getAssetImages(expanded), [expanded]);
  const [numCols, setNumCols] = useState(isMobileViewport ? 2 : 3);

  useEffect(() => setNumCols(isMobileViewport ? 2 : 3), [isMobileViewport]);

  // if (authData && onChainItems) {
  //   fetchCustomizations(onChainItems.['Moonsama'] ?? [])
  // }

  const {
    customizerContainer,
    previewViewport,
    traitExplorer,
    customizerActionButton,
  } = useClasses(styles);

  const handleChange =
    (customizationOption: customizableTraitType) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(customizationOption);
    };

  const selectAsset = (assetIndex: number) => {
    if (expanded.equippableType === 'parent') {
      setCurrentCustomization({
        parent: traitOptionsAssets[assetIndex],
        children: currentCustomization.children
      })
    } else {
      const toReplace = currentCustomization.children.findIndex(asset => asset.customizableTraitName === expanded.title)
      const newChildren = [...currentCustomization.children]

      if (toReplace > -1) {
        newChildren.splice(toReplace, 1, traitOptionsAssets[assetIndex])
      } else {
        newChildren.push(traitOptionsAssets[assetIndex])
      }

      setCurrentCustomization({
        parent: currentCustomization.parent,
        children: newChildren
      })
    }
  }

  const getSelectedAsset = (expanded: customizableTraitType) => {
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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar sx={{ backgroundColor: '#1B1B3A', boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)' }} position="static">
        <Toolbar sx={{ position: 'relative' }}>
          <Typography component="div" sx={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
            {isMobileViewport ? (
              <svg width="67" height="32" viewBox="0 0 267 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.124 24.677v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm76.621 60.221-11.526 17.551h23.196l-11.67-17.55Zm0 0-11.526 17.551h23.196l-11.67-17.55ZM89.124 24.677v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-50.793 60.2L85.649 102.45h23.196l-11.67-17.572Zm-8.051-60.2v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm76.621 60.221-11.526 17.551h23.196l-11.67-17.55Zm0 0-11.526 17.551h23.196l-11.67-17.55ZM89.124 24.677v23.998h28.471V24.677H89.124Zm8.05 60.17L85.65 102.449h23.196l-11.67-17.602Zm50.794-60.17v23.957h28.47V24.677h-28.47ZM0 0v128h266.755V0H0Zm134.837 12.338h54.731V60.91h-54.731V12.338Zm-122.499 0h9.799l19.947 20.934 20.009-20.934h9.788v48.644H58.69V34.866l-16.605 17.48-16.667-17.48v26.116H12.338V12.338Zm50.999 103.375h-51.41v-12.708h38.29v-3.548l-37.879-5.624V67.162H63.06V79.5H25.417v3.959l37.92 5.552v26.702Zm63.748 0H67.45v-9.521l25.838-39.236h7.917l25.839 39.236.041 9.521Zm3.681-54.741H75.994V12.421h54.731l.041 48.551Zm60.026 54.741h-13.233V89.597l-16.605 17.479-16.667-17.48v26.117h-13.13V67.028h9.798l19.999 20.975 20.008-20.975h9.789l.041 48.685Zm2.93-103.457h10.005l29.869 27.926V12.256h13.119v48.757h-9.994l-29.869-27.761v27.761h-13.171l.041-48.757Zm60.777 103.457h-59.635v-9.521l25.838-39.236h7.917l25.839 39.236.041 9.521Zm-41.395-13.264H236.3l-11.711-17.572-11.485 17.572Zm-65.136-53.836h28.47V24.677h-28.47v23.936Zm-30.373-23.936H89.124v23.998h28.471V24.677Zm30.373 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm135.465 60.2-11.526 17.572h23.196l-11.67-17.572Zm-76.621-60.2v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm0 0v23.998h28.471V24.677H89.124Zm0 0v23.998h28.471V24.677H89.124Z" fill="#fff" /></svg>
            ) : (
              <svg width="316" height="32" viewBox="0 0 474 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path d="M29.334 20.72 9.647.07H0V48h12.926V22.29l16.408 17.167 16.338-17.168V48h12.997V.07h-9.647L29.334 20.72ZM62.758 48h53.881V.202h-53.88V48Zm12.886-35.691h28.029v23.585H75.644V12.309ZM120.648 48h53.881V.202h-53.881V48Zm12.967-35.691h28.028v23.585h-28.028V12.309Zm84.207 15.183L188.427 0h-9.849v48h12.926V20.65L220.899 48h9.849V0h-12.926v27.492Zm30.306-15.183h37.068V.202h-49.984V26.46l37.331 5.537v3.492h-37.746V48h50.672V21.672l-37.341-5.466v-3.897ZM314.956 0l-25.458 38.637V48h58.709v-9.363L322.75 0h-7.794Zm-7.531 34.942 11.357-17.299 11.489 17.3h-22.846Zm74.136-14.222L361.873.07h-9.637V48h12.916V22.29l16.409 17.167 16.347-17.168V48h12.987V.07h-9.636l-19.698 20.65ZM448.175 0h-7.794l-25.437 38.637V48h58.709v-9.363L448.175 0ZM432.86 34.942l11.358-17.299 11.478 17.3H432.86Z" fill="#fff" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h473.613v48H0z" /></clipPath></defs></svg>
            )}
          </Typography>

          {/* <Typography variant="h6">
            {account && truncateAddress(account)}
          </Typography> */}
          {/* <LoginButton /> */}
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '100vh', width: '100%', background: 'url("/moonsama/egg-pattern.svg"), url("/moonsama/background-aurora.svg") top right no-repeat, radial-gradient(73.61% 73.46% at 49.9% 50%, rgba(123, 97, 255, 0.5) 13.27%, rgba(123, 97, 255, 0) 100%), linear-gradient(77.59deg, #4A4A77 -1.39%, #1B1B3A 44.24%);', backgroundBlendMode: 'overlay, hard-light', backgroundSize: 'auto, contain, auto' }}>
        <Box className={customizerContainer}>
          <Box className={previewViewport}>
            {currentCustomization.parent === null ? (
              <Box style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', padding: '1rem', textAlign: 'center' }}>
                Select a Moonsama from the right to begin.
              </Box>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <ImageStack layers={[...currentCustomization.children, currentCustomization.parent]} />
                <div style={{ position: 'absolute', bottom: '16px', left: '8px', display: 'flex' }}>
                  <button
                    // onClick={saveCustomization}
                    type="button"
                    className={customizerActionButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-download" width="34" height="34" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                      <polyline points="7 11 12 16 17 11" />
                      <line x1="12" y1="4" x2="12" y2="16" />
                    </svg>
                  </button>

                  <button
                    // onClick={shareCustomization}
                    type="button"
                    className={customizerActionButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="18" cy="18" r="3" />
                      <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                      <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </Box>
          <Box className={traitExplorer}>
            {customizationOptions.map(customizationOption => {
              const isExpanded = expanded.title === customizationOption.title

              return (
                <Accordion sx={{ borderBottom: `${isExpanded ? '2px' : '0px'} solid` }} expanded={isExpanded} onChange={handleChange(customizationOption)}>
                  <AccordionSummary
                    sx={{ opacity: isExpanded ? 1 : 0.6, background: `url(${customizationOption.background})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                    aria-controls={`${customizationOption.title}-content`}
                    expandIcon={<ExpandMoreIcon expanded={isExpanded} />}
                    id={`${customizationOption.title}-header`}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={customizationOption.icon} width="32" height="32" style={{ flexShrink: 0 }} alt={`${customizationOption.title} Icon`} />
                      <Typography sx={{ marginLeft: '12px', flexShrink: 0, fontFamily: 'Orbitron', fontSize: '16px', letterSpacing: '0.1em', fontWeight: '500', textTransform: 'uppercase', lineHeight: '24px' }}>
                        {customizationOption.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ height: 360, overflowY: 'auto', padding: 0 }}>
                    <FixedSizeGrid
                      columnCount={isMobileViewport ? 2 : 3}
                      columnWidth={isMobileViewport ? 500 / 2 : 670 / 3}
                      height={380}
                      rowCount={Math.ceil(traitOptionsAssets.length / (isMobileViewport ? 2 : 3))}
                      rowHeight={isMobileViewport ? 500 / 2 : 670 / 3}
                      width={isMobileViewport ? 500 : 670}
                      itemData={{ traitOptionsAssets, numCols, selectedAsset: getSelectedAsset(expanded), onSelectAsset: selectAsset }}
                      overscanRowCount={3}
                    >
                      {Cell}
                    </FixedSizeGrid>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterDesignerPage;
export type { asset };
