import { MAX_WIDTH_TO_SHOW_NAVIGATION } from '../../constants';
import { useRef, useState } from 'react';
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, HStack, Input, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import ConnectedNetwork from './ConnectedNetwork';
import WalletAccount from './WalletAccount';
import ServerAccount from './ServerAccount';
import NavMenuItem from './NavMenuItem';
import { useMediaQuery } from '@chakra-ui/react'
import { Brush, ChevronUpRight, Menu2 } from 'tabler-icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectOauthData } from '../../state/slices/oauthSlice';

export default function MoonsamaNav() {
  const { pathname, search } = useLocation()
  const oauthData = useSelector(selectOauthData)
  const toast = useToast()
  const navigate = useNavigate()
  const oauthToastIdRef = React.useRef<any>()
  const isOauth = React.useMemo(() => {
    if (!!pathname && typeof pathname === "string" && pathname.includes("oauth")) {
      return true
    } else {
      return false
    }
  }, [pathname])

  React.useEffect(() => {
    if (isOauth && !!oauthData) {
      if (!toast.isActive("OAUTH_TOAST")) {
        oauthToastIdRef.current = toast({
          id: "OAUTH_TOAST",
          title: 'Authorizing app...',
          description: oauthData?.appName,
          status: 'warning',
          duration: null,
          isClosable: true,
          position: "top",
          onCloseComplete: () => { navigate("/") }
        })
      }
    } else {
      toast.close(oauthToastIdRef.current)
    }
  }, [isOauth, oauthData])

  const [isLargerThan1300] = useMediaQuery('(min-width: 1300px)')
  const [isLargerThanXl] = useMediaQuery('(min-width: 1280px)')
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navgiate = useNavigate()

  const buttons = (
    <>
      <Button h="50px" variant="moonsamaGhost" onClick={() => { navgiate("/portal"); onClose() }}>PORTAL</Button>
      <Button as="a" href="https://marketplace.moonsama.com" target="_blank" h="50px" rightIcon={<ChevronUpRight color="#3BEFB8"></ChevronUpRight>} variant="moonsamaGhost">MARKETPLACE</Button>
      <Button as="a" href="https://mcapi.moonsama.com" target="_blank" h="50px" rightIcon={<ChevronUpRight color="#3BEFB8"></ChevronUpRight>} variant="moonsamaGhost">MCAPI</Button>
      <Button as="a" href="https://wiki.moonsama.com" target="_blank" h="50px" rightIcon={<ChevronUpRight color="#3BEFB8"></ChevronUpRight>} variant="moonsamaGhost">DOCS</Button>
      <Button h="50px" rightIcon={<Brush color="#3BEFB8"></Brush>} variant="moonsamaGhost" onClick={() => { navgiate("/customizer"); onClose() }}>CUSTOMIZER</Button>
    </>
  )
  return (
    <Box
      as="header"
      minHeight="64px"
      h="64px"
      overflow="hidden"
      zIndex="200"
      w="100%"
      position="fixed"
      boxShadow="md"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        background: "gray.800",
      }}
      padding="8px 16px"
      paddingLeft="var(--moonsama-leftright-padding)"
      paddingRight={{ base: "16px", xl: "var(--moonsama-leftright-padding)" }}
    >
      <HStack cursor={isOauth ? "default" : "pointer"} onClick={() => { if (!isOauth) { navgiate("/portal") } }}>
        {isLargerThan1300
          ?
          <svg width="232" height="23" viewBox="0 0 474 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path d="M29.334 20.72 9.647.07H0V48h12.926V22.29l16.408 17.167 16.338-17.168V48h12.997V.07h-9.647L29.334 20.72ZM62.758 48h53.881V.202h-53.88V48Zm12.886-35.691h28.029v23.585H75.644V12.309ZM120.648 48h53.881V.202h-53.881V48Zm12.967-35.691h28.028v23.585h-28.028V12.309Zm84.207 15.183L188.427 0h-9.849v48h12.926V20.65L220.899 48h9.849V0h-12.926v27.492Zm30.306-15.183h37.068V.202h-49.984V26.46l37.331 5.537v3.492h-37.746V48h50.672V21.672l-37.341-5.466v-3.897ZM314.956 0l-25.458 38.637V48h58.709v-9.363L322.75 0h-7.794Zm-7.531 34.942 11.357-17.299 11.489 17.3h-22.846Zm74.136-14.222L361.873.07h-9.637V48h12.916V22.29l16.409 17.167 16.347-17.168V48h12.987V.07h-9.636l-19.698 20.65ZM448.175 0h-7.794l-25.437 38.637V48h58.709v-9.363L448.175 0ZM432.86 34.942l11.358-17.299 11.478 17.3H432.86Z" fill="#fff" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h473.613v48H0z" /></clipPath></defs></svg>
          :
          <svg width="67" height="32" viewBox="0 0 267 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.124 24.677v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm76.621 60.221-11.526 17.551h23.196l-11.67-17.55Zm0 0-11.526 17.551h23.196l-11.67-17.55ZM89.124 24.677v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-50.793 60.2L85.649 102.45h23.196l-11.67-17.572Zm-8.051-60.2v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm76.621 60.221-11.526 17.551h23.196l-11.67-17.55Zm0 0-11.526 17.551h23.196l-11.67-17.55ZM89.124 24.677v23.998h28.471V24.677H89.124Zm8.05 60.17L85.65 102.449h23.196l-11.67-17.602Zm50.794-60.17v23.957h28.47V24.677h-28.47ZM0 0v128h266.755V0H0Zm134.837 12.338h54.731V60.91h-54.731V12.338Zm-122.499 0h9.799l19.947 20.934 20.009-20.934h9.788v48.644H58.69V34.866l-16.605 17.48-16.667-17.48v26.116H12.338V12.338Zm50.999 103.375h-51.41v-12.708h38.29v-3.548l-37.879-5.624V67.162H63.06V79.5H25.417v3.959l37.92 5.552v26.702Zm63.748 0H67.45v-9.521l25.838-39.236h7.917l25.839 39.236.041 9.521Zm3.681-54.741H75.994V12.421h54.731l.041 48.551Zm60.026 54.741h-13.233V89.597l-16.605 17.479-16.667-17.48v26.117h-13.13V67.028h9.798l19.999 20.975 20.008-20.975h9.789l.041 48.685Zm2.93-103.457h10.005l29.869 27.926V12.256h13.119v48.757h-9.994l-29.869-27.761v27.761h-13.171l.041-48.757Zm60.777 103.457h-59.635v-9.521l25.838-39.236h7.917l25.839 39.236.041 9.521Zm-41.395-13.264H236.3l-11.711-17.572-11.485 17.572Zm-65.136-53.836h28.47V24.677h-28.47v23.936Zm-30.373-23.936H89.124v23.998h28.471V24.677Zm30.373 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm135.465 60.2-11.526 17.572h23.196l-11.67-17.572Zm-76.621-60.2v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm0 0v23.998h28.471V24.677H89.124Zm0 0v23.998h28.471V24.677H89.124Z" fill="#fff" /></svg>
        }
      </HStack>
      <HStack visibility={isOauth ? "hidden" : "visible"}>
        {isLargerThanXl
          ?
          <>
            {buttons}
            <ConnectedNetwork />
            <WalletAccount />
            <ServerAccount />
          </>
          :
          <>
            <WalletAccount />
            <Button onClick={onOpen} variant="ghost"><Menu2 color="#66C8FF"></Menu2></Button>
            <Drawer

              isOpen={isOpen}
              placement='left'
              onClose={onClose}
            >
              <DrawerOverlay />
              <DrawerContent background="#1A202C"
                w="220px"
                maxW="220px"
              >

                <DrawerBody>
                  <VStack alignItems={"stretch"} paddingBottom="8px">
                    {buttons}
                  </VStack>
                  <VStack alignItems={"stretch"}>
                    <ConnectedNetwork />
                    <WalletAccount />
                    <ServerAccount onClick={() => { onClose() }} />
                  </VStack>
                </DrawerBody>


              </DrawerContent>
            </Drawer>
          </>
        }

      </HStack>
    </Box>
  )
}