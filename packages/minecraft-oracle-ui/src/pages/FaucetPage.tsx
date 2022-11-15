import React, { useEffect, useState } from 'react';
import { useAccountDialog, useActiveWeb3React, useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack, useMediaQuery } from '@chakra-ui/react';
import { ArrowsRightLeft, DeviceGamepad2, Droplet, Pencil, Tags, User, Wallet } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'
import { ChainId, MULTIVERSE_BRIDGE_V2_WAREHOUSE_ADDRESS, numberFormatter, RARESAMA_POOP, SHIT_FART } from '../constants';
import { getAssetBalance } from '../hooks/useBalances/useBalances';
import { useQuery } from 'react-query';
import { utils } from "ethers"
import useAddNetworkToMetamaskCb from '../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';
import { checkApproval } from '../hooks/useApproveCallback/useApproveCallback';
import { InModal } from '../components/modals/InModal';
import { useDispatch, useSelector } from 'react-redux';
import { setInModalTokens, openInModal } from '../state/slices/inModalSlice';
import { selectBlockNumbers } from '../state/slices/blockNumbersSlice';
import { StandardizedOnChainTokenWithRecognizedTokenData } from '../utils/graphqlReformatter';
import { MultiverseVersion, RecognizedAssetType, TransactionStatus } from '../state/api/types';
import { openMigrateModal, setMigrateModalTokens } from '../state/slices/migrateModalSlice';
import { MigrateModal } from '../components/modals/MigrateModal';
import PoopImage from "../assets/images/poop.svg"
import { rtkQueryErrorFormatter, useFaucetStatusQuery } from '../state/api/bridgeApi';
import { MoonsamaSpinner } from '../components/MoonsamaSpinner';

const FaucetPage = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const [narrowerThan390] = useMediaQuery('(max-width: 390px)')
  const [shorterThan515] = useMediaQuery('(max-height: 515px)')

  const { isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose } = useAccountDialog();
  const { addNetwork } = useAddNetworkToMetamaskCb()
  const dispatch = useDispatch()

  const { data, error, isLoading, refetch } = useFaucetStatusQuery()

  const getMessage = () => {
    console.log(`data: `, data)
    if (!!error || !(!!data)) {
      return <>THERE WAS AN ERROR LOADING THE PAGE. PLEASE REFRESH. <Box color="red" fontFamily="Rubik">{!!error && rtkQueryErrorFormatter(error)}</Box></>
    } else if (!!data) {
      if (!!data.transactionStatus) {
        if (data.transactionStatus === TransactionStatus.SUCCESS) {
          return <>SUCCESS! <Box as="span" fontWeight="700">$SAMA</Box> has landed in your wallet!</>
        } else if (data.transactionStatus === TransactionStatus.ERROR) {
          return <>THERE WAS AN ERROR WITH THE FAUCET. PLEASE CONTACT SUPPORT.</>
        } else {
          return <>TRANSACTION IN PROGRESS.</>

        }
      } else {
        if (!!account) {
          return <>CLICK TO CLAIM .05 <Box as="span" fontWeight="700">$SAMA</Box></>
        } else {
          return <>CONNECT YOUR WALLET TO USE THE <Box as="span" fontWeight="700">$SAMA</Box> FAUCET. THE FAUCET CAN ONLY BE USED ONCE PER USER.</>
        }
      }
    }
    return <></>
  }

  const showButton: boolean = React.useMemo(() => {
    if (!!data) {
      if (!data.transactionStatus) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }, [data])
  return (
    <VStack
      zIndex="1"
      direction={'column'}
      justifyContent='center'
      alignItems='center'
      spacing="0"
      position="relative"
      left="calc(-1 * var(--moonsama-leftright-padding))"
      className="moonsamaFullHeight"
      w="100vw"
      overflow="hidden"
      bg="radial-gradient(circle at 71.94% 92.8%, #3f0869, transparent 74%),radial-gradient(circle at 16.41% 12.33%, #16132B, transparent 82%),radial-gradient(circle at 78.26% 57.48%, #000000, transparent 67%),radial-gradient(circle at 23.24% 57.62%, #16132B, transparent 81%),radial-gradient(circle at 50% 50%, #213152, #213152 100%)"
    >


      {isLoading
        ?
        <>
          <MoonsamaSpinner></MoonsamaSpinner>
        </>

        :
        <VStack
          spacing="0"
          width="min(calc(100% - 70px), 500px)"
        >
          {/**START COIN ICONS */}
          <VStack spacing="0" display={shorterThan515 ? "none" : "block"}>
            <HStack spacing="0">
              <Box>
                <Box borderRadius="140px" w={{ base: "100px", sm: "140px" }} h={{ base: "100px", sm: "140px" }} bg="#4D0EA7">
                  <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 156 156" width="156" height="156" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M72.195 27.173c-3.937.743-10.456 1.953-13.983 3.668l.618-1.009a38.247 38.247 0 0 0-5.718 3.145l.272-1.22a36.222 36.222 0 0 0-11.237 9.902l-.51-1.834c-8.073 8.856-8.027 16.988-8.245 17.171l-1.182-1.769c-3.482 5.886-2.573 15.43-1.664 16.997l-3.019-3.74c-1.709 9.122-.618 18.601 2.873 25.083l-2.836-2.989c.654 5.84 2.31 8.426 2.418 8.581L26 96.592c1.427 11.277 12.828 19.427 12.828 19.427l-3.427-.284c2.727 2.879 8.51 5.345 8.51 5.345h-2.782C54.52 129.954 78.005 130 78.005 130s23.474 0 36.866-8.92h-2.782s5.764-2.466 8.51-5.345l-3.427.284s11.401-8.15 12.828-19.427l-3.991 2.567c.1-.155 1.754-2.75 2.409-8.58l-2.837 2.988c3.537-6.482 4.546-15.961 2.873-25.083l-3.045 3.74c.909-1.567 1.891-11.111-1.637-16.997l-1.182 1.77c-.218-.184-.172-8.316-8.246-17.2l-.509 1.834a36.226 36.226 0 0 0-11.219-9.901l.273 1.22a38.287 38.287 0 0 0-5.72-3.145l.592.971C92.488 28.264 81.814 26.33 75.677 26l-3.482 1.173ZM60.467 96.941c-.437 3.144-5.728 4.336-8.62.806-2.427-2.979.21-6.564.21-6.564-.837-2.704-6.819-3.108-6.819-3.108a19.491 19.491 0 0 1 9.092.55c3.791 1.32 6.718 4.154 6.137 8.316Zm27.811 20.261a31.465 31.465 0 0 1-9.255 6.417 2.703 2.703 0 0 1-2.046 0 31.58 31.58 0 0 1-9.255-6.417c-2.31-2.228-3.464-3.897-3.464-5.969.04-.91.272-1.801.682-2.612a17.84 17.84 0 0 1 4.317-6.038 17.657 17.657 0 0 1 6.384-3.735 7.595 7.595 0 0 1 4.718 0 17.657 17.657 0 0 1 6.384 3.735 17.84 17.84 0 0 1 4.317 6.038 6.4 6.4 0 0 1 .682 2.64c0 2.044-1.145 3.713-3.464 5.941Zm15.911-19.455c-2.892 3.53-8.183 2.338-8.62-.806-.581-4.162 2.346-6.995 6.165-8.315a19.491 19.491 0 0 1 9.092-.55s-5.983.403-6.819 3.107c-.064 0 2.573 3.576.182 6.564Z" /></svg>
                </Box>
                <Box h="4px"></Box>
                <Box textAlign="center" fontSize="24px" lineHeight="32px">$SAMA</Box>

              </Box>
            </HStack>
            <Box h="40px"></Box>
          </VStack>
          {/**END COIN ICONS */}

          <VStack
            bg="whiteAlpha.100"
            borderRadius="8px"
            padding="32px"
            spacing="0"
            w="100%">
            <Box
              w="100%"
              textAlign="center"
              fontSize="14px"
              lineHeight="20px"
              fontFamily="Rubik"
              fontWeight="400"
            >
              {getMessage()}

            </Box>
            <Box h="12px" display={!!showButton ? "block" : "none"}></Box>
            <Box w="100%" display={!!showButton ? "block" : "none"}>
              {!!account
                ?
                <>
                  <Button onClick={() => { }} w="100%">CLAIM $SAMA</Button>
                </>
                :
                <>
                  <Button onClick={() => onAccountDialogOpen()} leftIcon={<Wallet />} w="100%">{narrowerThan390 ? "CONNECT" : "CONNECT WALLET"}</Button>
                </>

              }

            </Box>
          </VStack>
        </VStack>
      }
    </VStack>
  )
}

export default FaucetPage