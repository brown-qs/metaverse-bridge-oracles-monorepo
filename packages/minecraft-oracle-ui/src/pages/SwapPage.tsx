import React, { useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, Tags, User } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'

const SwapPage = () => {
  return (
    <VStack
      zIndex="1"
      direction={'column'}
      justifyContent='center'
      alignItems='center'
      spacing="0"
      position="absolute"
      top="0"
      left="0"
      right="0"
      className="moonsamaFullHeight"
    >

      <VStack
        spacing="0"
        width="min(calc(100% - 70px), 896px)"

      >
        <HStack spacing="0">
          <Box>
            <Box w={{ base: "100px", sm: "140px" }} h={{ base: "100px", sm: "140px" }} bg="white"></Box>
            <Box textAlign="center" fontSize="24px" lineHeight="32px">$POOP</Box>
          </Box>
          <Box w="30px"></Box>
          <Box>
            <Box w={{ base: "100px", sm: "140px" }} h={{ base: "100px", sm: "140px" }} bg="white"></Box>
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
  )
}

export default SwapPage