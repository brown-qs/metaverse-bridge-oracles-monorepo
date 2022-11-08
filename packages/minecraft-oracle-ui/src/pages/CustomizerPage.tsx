import React, { useEffect, useState } from 'react';
import { useActiveWeb3React, useClasses } from 'hooks';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, Tags, User } from 'tabler-icons-react';
import { ChainId } from '../constants';
import { StandardizedMetadata, standardizeMarketplaceMetadata, standardizeRaresamaMetadata, standardizeExosamaMetadata, InGameTokenMaybeMetadata, inGameTokensCombineMetadata, inGameMetadataParams, addRegonizedTokenDataToStandardizedOnChainTokens, StandardizedOnChainToken, StandardizedOnChainTokenWithRecognizedTokenData, standardizeExosamaOnChainTokens, standardizeMarketplaceOnChainTokens, standardizeRaresamaOnChainTokens, checkOnChainItemNotImported } from '../utils/graphqlReformatter';
import { useSelector } from 'react-redux';
import { selectBlockNumbers } from '../state/slices/blockNumbersSlice';
import { useGetExosamaMetadataQuery, useGetExosamaOnChainTokensQuery } from '../state/api/generatedSquidExosamaApi';
import { useGetMarketplaceMetadataQuery, useGetMarketplaceOnChainTokensQuery } from '../state/api/generatedSquidMarketplaceApi';
import { useGetRaresamaMetadataQuery, useGetRaresamaOnChainTokensQuery } from '../state/api/generatedSquidRaresamaApi';
import { address } from 'faker';
import { useGetRecognizedAssetsQuery, useGetInGameItemsQuery } from '../state/api/bridgeApi';
import { Navigate, useParams } from 'react-router-dom';
import CustomizerLibrary from '../components/Customizer/CustomizerLibrary';
import { selectAccessToken } from '../state/slices/authSlice';
import e from 'express';
import IndividualCustomizer from '../components/Customizer/IndividualCustomizer';

const CustomizerPage = () => {

  //chainId/:assetAddress/:assetId
  const { librarySection, chainId, assetAddress, assetId } = useParams<{ librarySection?: string, chainId?: string, assetAddress?: string, assetId?: string }>();

  const libraryPages = ["staked", "wallet", "exosama", "moonsama"]

  if (!!chainId && !!assetAddress && !!assetId) {
    return <IndividualCustomizer chainId={parseInt(chainId)} assetAddress={assetAddress.toLowerCase()} assetId={parseInt(assetId)}></IndividualCustomizer>

  } else if (!libraryPages.includes(librarySection ?? "")) {
    return <Navigate to="/customizer/library/exosama"></Navigate>
  }

  return <CustomizerLibrary librarySection={librarySection ?? "exosama"}></CustomizerLibrary>


}
export default CustomizerPage;