import { useState, useMemo, useEffect, memo } from 'react';
import { useOnChainItemsWithCompositeMetaAndAssets } from 'hooks/multiverse/useOnChainItems';
import { useClasses } from 'hooks';
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
import { AccordionPanel, AccordionItem, Text, Accordion, Box, Button, CircularProgress, IconButton, Stack, useMediaQuery, Modal, Container, Grid, GridItem, AccordionButton, AccordionIcon } from '@chakra-ui/react';
import { MoonsamaLayout } from '../../../components';




const CharacterDesignerPage = () => {
  return (
    <Container
      sx={{ background: 'url("/moonsama/egg-pattern.svg"), url("/moonsama/background-aurora.svg") top right no-repeat, radial-gradient(73.61% 73.46% at 49.9% 50%, rgba(123, 97, 255, 0.5) 13.27%, rgba(123, 97, 255, 0) 100%), linear-gradient(77.59deg, #4A4A77 -1.39%, #1B1B3A 44.24%);', backgroundBlendMode: 'overlay, hard-light', backgroundSize: 'auto, contain, auto' }}
      minWidth="100%"
      margin="0"
      padding="0"
      minHeight={{ base: "calc(100vh - 80px)", xl: "calc(100vh - 64px)" }}
    >
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr)  minmax(0, 1fr)' }}
        maxW="1440px"
        margin="auto"
      >
        <GridItem w='100%' h='898' padding={{ base: "24px 0 0 0", lg: "54px 0 80px 80px" }}>
          <Box h="100%" bg="orange">a</Box>
        </GridItem>
        <GridItem w='100%' h='898' padding={{ base: "0 0 0 0", lg: "54px 80px 80px 0" }}>
          <Box h="100%" bg="pink">
            <Accordion allowToggle textTransform="uppercase">
              {MOONSAMA_CUSTOMIZER_CATEGORIES.filter(option => option.shown).map((customizationOption, optionIndex) => {
                return (
                  <AccordionItem key={customizationOption.title}>

                    <h2>
                      <AccordionButton h="80px">
                        <Box >
                          <img src={customizationOption.icon} width="32" height="32" style={{ flexShrink: 0 }} alt={`${customizationOption.title} Icon`} />
                        </Box>
                        <Box flex='1' textAlign='left'>
                          {customizationOption.title.toUpperCase()}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                      commodo consequat.

                    </AccordionPanel>
                  </AccordionItem>)
              })}
            </Accordion>
          </Box>

        </GridItem>
      </Grid>
    </Container >
  )
}
enum AssetLocation {
  INCLUDED = 'INCLUDED',
  BRIDGE = 'BRIDGE',
  WALLET = 'WALLET',
  NONE = 'NONE'
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
type CustomizationType = {
  parent: Asset | null,
  children: Array<Asset>
}

export default CharacterDesignerPage;
export type { Asset };
export type { AssetIdentifier };
export type { CustomizationType };