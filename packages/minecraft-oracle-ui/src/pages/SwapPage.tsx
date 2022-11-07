import React, { useEffect, useState } from 'react';
import { useAccountDialog, useActiveWeb3React, useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack, useMediaQuery } from '@chakra-ui/react';
import { ArrowsRightLeft, DeviceGamepad2, Pencil, Tags, User, Wallet } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'
import { ChainId, numberFormatter, RARESAMA_POOP } from '../constants';
import { getAssetBalance } from '../hooks/useBalances/useBalances';
import { useQuery } from 'react-query';
import { utils } from "ethers"
import useAddNetworkToMetamaskCb from '../hooks/useAddNetworkToMetamask/useAddNetworkToMetamask';

const SwapPage = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const { isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose } = useAccountDialog();
  const { addNetwork } = useAddNetworkToMetamaskCb()
  const [shorterThan515] = useMediaQuery('(max-height: 515px)')
  const [narrowerThan390] = useMediaQuery('(max-width: 390px)')

  const { isLoading: isPoopBalanceLoading, data: poopBalanceData, refetch: refetchPoopBalance } = useQuery(
    ['getAssetBalance', RARESAMA_POOP, account],
    () => getAssetBalance(RARESAMA_POOP, library!, account!),
    {
      enabled: !!library && !!account && chainId === ChainId.MOONBEAM
    }
  )

  const isMoonbeam: boolean = React.useMemo(() => {
    if (!!account && !!chainId) {
      return chainId === ChainId.MOONBEAM
    } else {
      return false
    }
  }, [chainId, account])

  const noPoop: boolean = React.useMemo(() => (numberFormatter(utils.formatUnits(poopBalanceData?.toString() ?? "0", 18)) === ".00000"), [poopBalanceData])
  return (
    <>

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
        bg="radial-gradient(circle at 26.53% 49.03%, #391622, transparent 40%),radial-gradient(circle at 99.49% 0.76%, #52274B, transparent 31%),radial-gradient(circle at 97.03% 42.36%, #391622, transparent 34%),radial-gradient(circle at 71.08% 5.96%, #391622, transparent 28%),radial-gradient(circle at 50% 50%, #080714, #080714 100%)"
      >



        <VStack
          spacing="0"
          width="min(calc(100% - 70px), 896px)"

        >
          {/**START COIN ICONS */}
          <VStack spacing="0" display={shorterThan515 ? "none" : "block"}>
            <HStack spacing="0">
              <Box>
                <Box borderRadius="140px" w={{ base: "100px", sm: "140px" }} h={{ base: "100px", sm: "140px" }} bg="white">
                  <svg style={{ width: "100%", height: "100%", padding: "7%" }} viewBox="0 0 600 600" width="600" height="600" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#FF0045" d="M171 342h96v107h-96zm165 0h95v107h-95z" /><g clip-path="url(#a)"><path d="M192.115 178.807a39.31 39.31 0 0 0-16.358 61.978 39.285 39.285 0 0 0 20.84 12.998c-.324 0-.659-.054-1.005-.054a9.157 9.157 0 0 0-9.018 9.291c.001.634.062 1.268.184 1.89a2.701 2.701 0 0 1-3.499 3.079 63.537 63.537 0 0 0-43.222 1.68 63.564 63.564 0 0 0-32.138 28.96 63.596 63.596 0 0 0-6.169 42.827 63.582 63.582 0 0 0 22.659 36.858h-.832a63.546 63.546 0 0 0-39.012 13.42 63.583 63.583 0 0 0-22.557 34.553 63.599 63.599 0 0 0 3.402 41.128 63.572 63.572 0 0 0 27.928 30.374l1.36.724c60.933 32.41 130.474 46.454 204.312 46.454 59.81 0 116.822-7.746 168.705-29.569.27-.118.551-.226.821-.356a433.911 433.911 0 0 0 35.845-17.134h.064a486.367 486.367 0 0 0 5.001-2.734 63.571 63.571 0 0 0 26.177-30.991 63.6 63.6 0 0 0 2.11-40.518 63.582 63.582 0 0 0-22.818-33.544 63.535 63.535 0 0 0-38.452-12.909c-.81 0-1.609 0-2.408.054h-.562c-.745 0-1.49.076-2.225.14a2.687 2.687 0 0 1-2.857-3.25 2.68 2.68 0 0 1 .827-1.427 24.845 24.845 0 0 0 2.732-3.004c.303-.4.659-.799.972-1.199a63.587 63.587 0 0 0 12.133-56.141 63.582 63.582 0 0 0-38.053-43.013l-.475-.194a63.364 63.364 0 0 0-22.971-4.322l-7.625.27a70.397 70.397 0 0 1-11.469-.702 39.363 39.363 0 0 0 18.554-25.053 39.852 39.852 0 0 0 1.015-8.934 39.14 39.14 0 0 0-4.741-18.733l-.27-.476a52.5 52.5 0 0 0-.842-1.437A437.473 437.473 0 0 0 265.889 55.173a4.796 4.796 0 0 0-5.973 5.628c1.772 7.271 2.97 12.738 4.191 19.662 6.847 38.893-19.991 74.933-63.288 94.801l-8.704 3.543Zm46.245 260.287a63.572 63.572 0 0 1-30.47-7.785 63.586 63.586 0 0 1-32.93-51.295 63.604 63.604 0 0 1 5.599-30.956 177.868 177.868 0 0 1 32.054 16.918 82.373 82.373 0 0 1 36.644 61.288 59.86 59.86 0 0 0 1.674 10.577 116.95 116.95 0 0 1-12.571 1.253Zm113.398 1.08a118.129 118.129 0 0 1-12.614-.702 58.721 58.721 0 0 0 1.21-10.631c1.155-24.988 20.131-48.464 40.391-63.135 15.034-10.9 20.768-14.876 24.84-18.031a63.608 63.608 0 0 1-1.635 60.939 63.566 63.566 0 0 1-52.138 31.56h-.054Z" fill="#4D0EA7" /></g><defs><clipPath id="a"><path fill="#fff" transform="translate(60 55)" d="M0 0h480v490H0z" /></clipPath></defs></svg>
                </Box>
                <Box h="4px"></Box>
                <Box textAlign="center" fontSize="24px" lineHeight="32px">$POOP</Box>
              </Box>
              <Box w="30px"></Box>
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


              color="teal.200"
              fontFamily="Orbitron"
              fontWeight="500"
              w="100%"
              textAlign="center"
              fontSize="30px"
              lineHeight="36px"
              h="36px"
            >
              {!!account
                ?
                <>

                  {isMoonbeam ?
                    <>
                      {isPoopBalanceLoading
                        ?
                        <></>
                        :
                        <>{numberFormatter(utils.formatUnits(poopBalanceData?.toString() ?? "0", 18)).replace(".00000", "0")}</>
                      }
                    </>
                    :
                    <>
                      {"0"}
                    </>
                  }
                </>
                :
                <>
                  0
                </>
              }
            </Box>
            <Box h="12px"></Box>
            <Box
              w="100%"
              textAlign="center"
              fontSize="14px"
              lineHeight="20px"
              fontFamily="Rubik"
              fontWeight="400"
            >
              {!!account
                ?
                <>
                  {isMoonbeam ?
                    <>
                      CLICK THE BUTTON TO SWAP THIS AMOUNT OF <Box as="span" fontWeight="700">$POOP</Box> FOR <Box as="span" fontWeight="700">$SAMA</Box>

                    </>
                    :
                    <>
                      CHANGE NETWORK TO SWAP <Box as="span" fontWeight="700">$POOP</Box> FOR <Box as="span" fontWeight="700">$SAMA</Box>

                    </>
                  }
                </>
                :
                <>
                  CONNECT YOUR WALLET TO SEE THE <Box as="span" fontWeight="700">$POOP</Box> BALANCE TO BE CONVERTED TO <Box as="span" fontWeight="700">$SAMA</Box>

                </>
              }

            </Box>
            <Box h="12px"></Box>
            <Box w="100%">
              {!!account
                ?
                <>
                  {isMoonbeam
                    ?
                    <Button isLoading={isPoopBalanceLoading} isDisabled={noPoop} leftIcon={<ArrowsRightLeft></ArrowsRightLeft>} w="100%">{narrowerThan390 ? "SWAP" : "SWAP $POOP FOR $SAMA"}</Button>
                    :
                    <Button onClick={() => addNetwork(ChainId.MOONBEAM)} leftIcon={<ArrowsRightLeft></ArrowsRightLeft>} w="100%">{narrowerThan390 ? "MOONBEAM" : "CHANGE TO MOONBEAM"}</Button>
                  }
                </>
                :
                <Button onClick={() => onAccountDialogOpen()} leftIcon={<Wallet />} w="100%">{narrowerThan390 ? "CONNECT" : "CONNECT WALLET"}</Button>
              }

            </Box>
          </VStack>
        </VStack>
      </VStack>
    </>
  )
}

export default SwapPage