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

const CustomizerPage = () => {
  /*
  const blockNumbers = useSelector(selectBlockNumbers)
  const { account, chainId, library } = useActiveWeb3React()
  const address: string = React.useMemo(() => account?.toLowerCase() ?? "0x999999999999999999999999999", [account])


  //on chain tokens (from indexers)
  const { data: raresamaOnChainTokensData, currentData: currentRaresamaOnChainTokensData, isLoading: isRaresamaOnChainTokensDataLoading, isFetching: isRaresamaOnChainTokensDataFetching, isError: isRaresamaOnChainTokensDataError, error: raresamaOnChainTokensError, refetch: refetchRaresamaOnChainTokens } = useGetRaresamaOnChainTokensQuery({ where: { owner: { id_eq: address }, contract: { OR: [{ id_eq: "0xf27a6c72398eb7e25543d19fda370b7083474735" }, { id_eq: "0xe4bf451271d8d1b9d2a7531aa551b7c45ec95048" }] } } })
  const { data: marketplaceOnChainTokensData, currentData: currentMarketplaceOnChainTokensData, isLoading: isMarketplaceOnChainTokensLoading, isFetching: isMarketplaceOnChainTokensFetching, isError: isMarketplaceOnChainTokensError, error: marketplaceOnChainTokensError, refetch: refetchMarketplaceOnChainTokens } = useGetMarketplaceOnChainTokensQuery({ owner: address })
  const { data: exosamaOnChainTokensData, currentData: currentExosamaOnChainTokensData, isLoading: isExosamaOnChainTokensLoading, isFetching: isExosamaOnChainTokensFetching, isError: isExosamaOnChainTokensError, error: exosamaOnChainTokensError, refetch: refetchExosamaOnChainTokens } = useGetExosamaOnChainTokensQuery({ owner: address })

  //in game tokens (from nestjs server)
  const { data: recognizedAssetsData, isLoading: isRecognizedAssetsLoading, isFetching: isRecognizedAssetsFetching, isError: isRecognizedAssetsError, error: recognizedAssetsError, refetch: refetchRecognizedAssets } = useGetRecognizedAssetsQuery()
  const { data: inGameItemsData, isLoading: isInGameItemsDataLoading, isFetching: isInGameItemsDataFetching, isError: isInGameItemsError, error: inGameItemsError, refetch: refetchInGameItems } = useGetInGameItemsQuery()


  //metadata
  const inGameItemsMetadataQuery = React.useMemo(() => inGameMetadataParams(inGameItemsData), [inGameItemsData])
  const { data: marketplaceInGameItemsMetadata, isLoading: isMarketplaceInGameItemsMetadataLoading, isFetching: isMarketplaceInGameItemsMetadataFetching, isError: isMarketplaceInGameItemsMetadataError, error: marketplaceInGameItemsMetadataError } = useGetMarketplaceMetadataQuery(inGameItemsMetadataQuery.marketplace)
  const { data: raresamaInGameItemsMetadata, isLoading: isRaresamaInGameItemsMetadataLoading, isFetching: isRaresamaInGameItemsMetadataFetching, isError: isRaresamaInGameItemsMetadataError, error: raresamaInGameItemsMetadataError } = useGetRaresamaMetadataQuery(inGameItemsMetadataQuery.raresama)
  const { data: exosamaInGameItemsMetadata, isLoading: isExosamaInGameItemsMetadataLoading, isFetching: isExosamaInGameItemsMetadataFetching, isError: isExosamaInGameItemsMetadataError, error: exosamaInGameItemsMetadataError } = useGetExosamaMetadataQuery(inGameItemsMetadataQuery.exosama)

  const standardizedMarketplaceOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeMarketplaceOnChainTokens(marketplaceOnChainTokensData), [marketplaceOnChainTokensData])
  const standardizedMarketplaceOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedMarketplaceOnChainTokens, recognizedAssetsData), [standardizedMarketplaceOnChainTokens, recognizedAssetsData])

  const standardizedRaresamaOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeRaresamaOnChainTokens(raresamaOnChainTokensData), [raresamaOnChainTokensData])
  const standardizedRaresamaOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedRaresamaOnChainTokens, recognizedAssetsData), [standardizedRaresamaOnChainTokens, recognizedAssetsData])

  const standardizedExosamaOnChainTokens: StandardizedOnChainToken[] = React.useMemo(() => standardizeExosamaOnChainTokens(exosamaOnChainTokensData), [exosamaOnChainTokensData])
  const standardizedExosamaOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => addRegonizedTokenDataToStandardizedOnChainTokens(standardizedExosamaOnChainTokens, recognizedAssetsData), [standardizedExosamaOnChainTokens, recognizedAssetsData])


  const inGameItemsMetadata: StandardizedMetadata[] = React.useMemo(() => {
    return [
      ...(standardizeMarketplaceMetadata(marketplaceInGameItemsMetadata) ?? []),
      ...(standardizeRaresamaMetadata(raresamaInGameItemsMetadata) ?? []),
      ...(standardizeExosamaMetadata(exosamaInGameItemsMetadata) ?? [])
    ]
  }, [marketplaceInGameItemsMetadata, raresamaInGameItemsMetadata, exosamaInGameItemsMetadata])

  const inGameItems: InGameTokenMaybeMetadata[] = React.useMemo(() => {
    return [...inGameTokensCombineMetadata(inGameItemsData ?? [], inGameItemsMetadata)]
      .sort((a, b) => `${a.assetAddress}~${a.assetId}`.localeCompare(`${b.assetAddress}~${b.assetId}`))

  }, [inGameItemsData, inGameItemsMetadata])

  const allStandardizedOnChainTokensWithRecognizedTokenData: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => {
    return [
      ...standardizedMarketplaceOnChainTokensWithRecognizedTokenData,
      ...standardizedRaresamaOnChainTokensWithRecognizedTokenData,
      ...standardizedExosamaOnChainTokensWithRecognizedTokenData,
    ].filter(tok => checkOnChainItemNotImported(tok, inGameItems))
  }, [standardizedMarketplaceOnChainTokensWithRecognizedTokenData, standardizedRaresamaOnChainTokensWithRecognizedTokenData, standardizedExosamaOnChainTokensWithRecognizedTokenData, inGameItems])


  const onChainItems: StandardizedOnChainTokenWithRecognizedTokenData[] = React.useMemo(() => {
    return (allStandardizedOnChainTokensWithRecognizedTokenData ?? []).filter((tok) => {
      if (tok?.importable === false && tok?.enrapturable === false) {
        return false
      }

      //if there's a connected chain, only show items on that chain
      if (!!chainId && tok.chainId !== chainId) {
        return false
      }
      return true
    })

  }, [allStandardizedOnChainTokensWithRecognizedTokenData, chainId])




  const isOnChainItemsLoading: boolean = React.useMemo(() => {
    if (!!chainId) {
      if (chainId === ChainId.MOONRIVER && isMarketplaceOnChainTokensFetching && !currentMarketplaceOnChainTokensData) {
        return true
      } else if (chainId === ChainId.MOONBEAM && isRaresamaOnChainTokensDataFetching && !currentRaresamaOnChainTokensData) {
        return true
      } else if (chainId === ChainId.MAINNET && isExosamaOnChainTokensFetching && !currentExosamaOnChainTokensData) {
        return true
      }
      return false
    } else {
      return false
    }
  }, [currentMarketplaceOnChainTokensData, isMarketplaceOnChainTokensFetching, isRaresamaOnChainTokensDataFetching, currentRaresamaOnChainTokensData, isExosamaOnChainTokensFetching, currentExosamaOnChainTokensData, chainId])


  React.useEffect(() => {
    refetchExosamaOnChainTokens()
  }, [blockNumbers[ChainId.MAINNET]])

  React.useEffect(() => {
    refetchRaresamaOnChainTokens()
  }, [blockNumbers[ChainId.MOONBEAM]])

  React.useEffect(() => {
    refetchMarketplaceOnChainTokens()
  }, [blockNumbers[ChainId.MOONRIVER]])

  React.useEffect(() => {
    refetchInGameItems()
  }, [blockNumbers[ChainId.MOONRIVER], blockNumbers[ChainId.MOONBEAM], blockNumbers[ChainId.MAINNET]])

  return <></>*/
  const { librarySection } = useParams<{ librarySection?: string }>();

  const libraryPages = ["staked", "wallet", "exosama", "moonsama"]

  if (!libraryPages.includes(librarySection ?? "")) {
    return <Navigate to="/customizer/library/exosama"></Navigate>
  }

  return <CustomizerLibrary librarySection={librarySection ?? "exosama"}></CustomizerLibrary>


}
export default CustomizerPage;