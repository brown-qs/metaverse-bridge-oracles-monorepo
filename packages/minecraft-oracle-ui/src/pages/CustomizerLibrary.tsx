import React, { useEffect, useState } from 'react';
import { useAccountDialog, useActiveWeb3React, useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack, useMediaQuery } from '@chakra-ui/react';
import { ArrowsRightLeft, BuildingFortress, DeviceGamepad2, Pencil, Power, Stack3, Tags, User, Wallet } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'
import { ChainId, numberFormatter, RARESAMA_POOP } from '../constants';
import { getAssetBalance } from '../hooks/useBalances/useBalances';
import { useQuery } from 'react-query';
import { utils } from "ethers"
import useAddNetworkToMetamaskCb from '../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';

const CustomizerLibrary = () => {
  const { account, chainId, library } = useActiveWeb3React()
  return (
    <Box bg="gray.800" className="moonsamaFullHeight" position="relative" left="calc(-1 * var(--moonsama-leftright-padding))" w="100vw">
      <Stack spacing="0" w="100%" h="100%" direction={{ base: "column", md: "row" }}>
        {/** START Library Nav, on chain/wallet, etc */}
        <Stack spacing="0" w="225px" bg="gray.800" paddingLeft="var(--moonsama-leftright-padding)" direction={{ base: "row", md: "column" }}>
          <VStack spacing="0" fontWeight="500" fontFamily="Rubik" alignItems="flex-start" paddingTop="16px">
            <Box color="gray.400" fontSize="12px" lineHeight="16px">
              MY NFTS
            </Box>
            <Button leftIcon={<Stack3 color="var(--chakra-colors-teal-200)" />} w="120px" variant="moonsamaGhost">Staked</Button>
            <Button leftIcon={<Wallet color="var(--chakra-colors-teal-200)" />} w="120px" variant="moonsamaGhost">Wallet</Button>
          </VStack>
          <VStack spacing="0" fontWeight="500" fontFamily="Rubik" alignItems="flex-start" paddingTop="16px">
            <Box color="gray.400" fontSize="12px" lineHeight="16px">
              MULTIVERSE NFTS
            </Box>
            <Button w="120px" variant="moonsamaGhost">Exosama&nbsp;</Button>
            <Button w="120px" variant="moonsamaGhost">Moonsama</Button>
          </VStack>
        </Stack>
        {/** End Library Nav, on chain/wallet, etc */}

        <Box flex="1" bg="gray.900" paddingRight="var(--moonsama-leftright-padding)">
          aa
        </Box>
      </Stack>
    </Box >
  )
}

export default CustomizerLibrary