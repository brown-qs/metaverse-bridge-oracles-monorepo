import React, { useEffect, useState } from 'react';
import { useAccountDialog, useActiveWeb3React, useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack, useMediaQuery, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, FormControl, FormLabel } from '@chakra-ui/react';
import { ArrowsRightLeft, BuildingFortress, DeviceGamepad2, Pencil, Power, Stack3, Tags, User, Wallet } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'
import { ChainId, numberFormatter, RARESAMA_POOP } from '../constants';
import { getAssetBalance } from '../hooks/useBalances/useBalances';
import { isError, useQuery } from 'react-query';
import { utils } from "ethers"
import useAddNetworkToMetamaskCb from '../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const CustomizerLibrary = () => {
  const { account, chainId, library } = useActiveWeb3React()

  const { librarySection } = useParams<{ librarySection?: string }>();
  const navigate = useNavigate()

  const libraryPages = ["staked", "wallet", "exosama", "moonsama"]

  if (!libraryPages.includes(librarySection ?? "")) {
    return <Navigate to="/customizer/library/exosama"></Navigate>
  }



  const libraryPage = () => {
    return (
      <Box bg="gray.800" className="moonsamaFullHeight" position="relative" left="calc(-1 * var(--moonsama-leftright-padding))" w="100vw">
        <Stack spacing="0" w="100%" h="100%" direction={{ base: "column", md: "row" }}>
          {/** START Library Nav, on chain/wallet, etc */}
          <Stack fontWeight="400" fontFamily="Rubik" spacing="0" w={{ base: "100%", md: "225px" }} bg="gray.800" paddingBottom="16px" paddingLeft="var(--moonsama-leftright-padding)" direction={{ base: "row", md: "column" }} justifyContent={{ base: "space-around", md: "flex-start" }}>
            <VStack spacing="0" alignItems="flex-start" paddingTop="16px">
              <Box color="gray.400" fontSize="12px" lineHeight="16px">
                MY NFTs
              </Box>
              <Box h="8px"></Box>
              <Button onClick={() => navigate(`/customizer/library/staked`)} leftIcon={<Stack3 color="var(--chakra-colors-teal-200)" />} w="120px" variant="moonsamaGhost">Staked</Button>
              <Box h="8px"></Box>
              <Button onClick={() => navigate(`/customizer/library/wallet`)} leftIcon={<Wallet color="var(--chakra-colors-teal-200)" />} w="120px" variant="moonsamaGhost">Wallet</Button>
            </VStack>
            <VStack spacing="0" alignItems="flex-start" paddingTop="16px">
              <Box color="gray.400" fontSize="12px" lineHeight="16px">
                MULTIVERSE NFTs
              </Box>
              <Box h="8px"></Box>
              <Button w="120px" onClick={() => navigate(`/customizer/library/exosama`)} variant="moonsamaGhost">Exosama&nbsp;</Button>
              <Box h="8px"></Box>
              <Button w="120px" onClick={() => navigate(`/customizer/library/moonsama`)} variant="moonsamaGhost">Moonsama</Button>
            </VStack>
          </Stack>
          {/** End Library Nav, on chain/wallet, etc */}

          <Box flex="1" bg="gray.900" padding="16px" paddingRight="var(--moonsama-leftright-padding)">
            <HStack spacing="0" justifyContent="space-between">
              <VStack spacing="0" alignItems="flex-start" flex="1">
                <Box fontSize="16px" lineHeight="24px" fontFamily="Rubik" color="gray.400">{["staked", "wallet"].includes(librarySection ?? "") ? "MY NFTs" : "MULTIVERSE NFTs"}</Box>
                <Box fontSize="30px" lineHeight="36px" fontFamily="Orbitron" color="white" wordBreak="break-all">{librarySection?.toUpperCase()}</Box>
              </VStack>
              <Box w="16px"></Box>
              <VStack spacing="0" w="105px">
                <FormControl isInvalid={false}>
                  <FormLabel>Token ID</FormLabel>
                  <NumberInput min={1} max={10000} step={1} inputMode="numeric" precision={0}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </VStack>
            </HStack>
          </Box>
        </Stack>
      </Box >
    )
  }
  return libraryPage()
}

export default CustomizerLibrary