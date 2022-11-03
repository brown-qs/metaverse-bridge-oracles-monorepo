import React, { useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, Tags, User } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'

const SwapPage = () => {
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
          <HStack spacing="0">
            <Box>
              <Box borderRadius="140px" w={{ base: "100px", sm: "140px" }} h={{ base: "100px", sm: "140px" }} bg="white">
                <svg style={{ width: "100%", height: "100%", padding: "15%", paddingTop: "10%" }} viewBox="0 0 96 98" width="96" height="98" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><path fill="none" stroke="#ff0045" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" d="M26 70h42V55H26Z" /><mask id="a" x="0" y="-1" width="97" height="99" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"><image y="-1" width="97" height="99" xlinkHref="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAGEAAABjCAAAAACupTF0AAAAOGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAACoAIABAAAAAEAAABhoAMABAAAAAEAAABjAAAAAEr9zOcAAACBSURBVGgF7dKxCQAwDAQxJ/vvnKxwjTu5PjCIn9m+85Y/nLv8YMaHQkyJUhEojS1RKgKlsSVKRaA0tkSpCJTGligVgdLYEqUiUBpbolQESmNLlIpAaWyJUhEojS1RKgKlsSVKRaA0tkSpCJTGligVgdLYEqUiUBpbolQESmNLRekDCBoBxLaTRogAAAAASUVORK5CYII=" /></mask><g mask="url(#a)"><path fill="#4d0ea7" d="M26.423 24.761a7.859 7.859 0 0 0-5.083 7.829 7.862 7.862 0 0 0 5.98 7.167c-.066 0-.133-.011-.202-.011a1.831 1.831 0 0 0-1.803 1.858c0 .127.012.253.037.378a.541.541 0 0 1-.7.616A12.707 12.707 0 0 0 9.58 48.726a12.72 12.72 0 0 0 3.298 15.937h-.167A12.708 12.708 0 0 0 .398 74.257a12.72 12.72 0 0 0 6.265 14.3l.273.145c12.186 6.483 26.094 9.291 40.862 9.291 11.962 0 23.364-1.549 33.74-5.913.055-.024.111-.046.165-.072a86.813 86.813 0 0 0 7.17-3.426h.012c.334-.18.667-.363 1-.547a12.715 12.715 0 0 0 5.658-14.302 12.716 12.716 0 0 0-12.255-9.29c-.161 0-.321 0-.481.01h-.112c-.15 0-.298.015-.445.028a.538.538 0 0 1-.407-.935c.199-.185.382-.386.547-.601.06-.08.132-.16.194-.24a12.718 12.718 0 0 0-5.184-19.83l-.095-.04a12.671 12.671 0 0 0-4.594-.864l-1.525.054a14.093 14.093 0 0 1-2.294-.14 7.873 7.873 0 0 0 3.711-5.01 7.972 7.972 0 0 0 .203-1.788 7.83 7.83 0 0 0-.948-3.746l-.054-.095A87.494 87.494 0 0 0 41.178.035a.959.959 0 0 0-1.195 1.125c.355 1.454.594 2.548.838 3.933 1.37 7.778-3.998 14.986-12.657 18.96l-1.741.708Zm9.249 52.058a12.71 12.71 0 0 1-10.696-5.846 12.721 12.721 0 0 1-.864-12.161 35.558 35.558 0 0 1 6.41 3.383 16.467 16.467 0 0 1 7.33 12.258c.048.713.16 1.421.334 2.115-.833.129-1.672.213-2.514.25Zm22.68.216a23.627 23.627 0 0 1-2.523-.14c.145-.7.226-1.412.242-2.127.23-4.997 4.026-9.692 8.078-12.627 3.007-2.18 4.154-2.975 4.968-3.606a12.72 12.72 0 0 1-10.755 18.5h-.01Z" /></g></svg>
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
            >
              1234
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
              CLICK THE BUTTON TO SWAP THIS AMOUNT OF <Box as="span" fontWeight="700">$POOP</Box> FOR <Box as="span" fontWeight="700">$SAMA</Box>
            </Box>
            <Box h="12px"></Box>
            <Box w="100%">
              <Button w="100%">SWAP $POOP FOR $SAMA</Button>
            </Box>
          </VStack>
        </VStack>
      </VStack>
    </>
  )
}

export default SwapPage