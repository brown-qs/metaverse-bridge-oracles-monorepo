import React, { useEffect, useState } from 'react';
import { Loader } from 'ui';
import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image, Button, Stack, useMediaQuery, Text, VStack, Box, FormControl, FormLabel, Input, FormHelperText, useToast, HStack } from '@chakra-ui/react';
import { Mail, MailForward } from 'tabler-icons-react';
import BackgroundImage from '../assets/images/home/background.jpg'
import { useDisclosure } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { openEmailLoginModal } from '../state/slices/emailLoginModalSlice';
import { EmailCodeModal } from '../components/modals/EmailCodeModal';
import { EmailLoginModal } from '../components/modals/EmailLoginModal';
import { KiltLoginModal } from '../components/modals/KiltLoginModal';
import { openKiltLoginModal } from '../state/slices/kiltLoginModalSlice';
import { selectAccessToken } from '../state/slices/authSlice';
import { closeOauthModal, openOauthModal, selectOauthData, selectOauthModalOpen } from '../state/slices/oauthSlice';
import { OauthModal } from '../components/modals/OauthModal';

const HomePage = () => {
  const toast = useToast()
  const accessToken = useSelector(selectAccessToken)
  const isOauthModalOpen = useSelector(selectOauthModalOpen)
  const oauthData = useSelector(selectOauthData)
  const oauthToastIdRef = React.useRef<any>()
  const { pathname, search } = useLocation()
  const dispatch = useDispatch()
  let navigate = useNavigate();

  const isOauth = React.useMemo(() => {
    if (!!pathname && typeof pathname === "string" && pathname.includes("oauth")) {
      return true
    } else {
      return false
    }
  }, [pathname])

  React.useEffect(() => {
    if (isOauth) {
      if (!!oauthData) {


        //open modal to confirm oauth if logged in
        if (!!accessToken) {

          dispatch(openOauthModal())
        } else {
          //close oauth modal so user can log in
          dispatch(closeOauthModal())
        }
      } else {
        //open modal 
        dispatch(openOauthModal())
      }
    }
  }, [isOauth, isOauthModalOpen, accessToken, oauthData])




  const [isMobileViewport] = useMediaQuery('(max-width: 600px)')
  const [shorterThan600] = useMediaQuery('(max-height: 600px)')
  const [shorterThan800] = useMediaQuery('(max-height: 800px)')

  const loginButtonProps = { h: "80px", w: "100%", fontSize: "20px", bg: "rgba(255, 255, 255, 0.06)", border: "none" }

  return (
    <>


      {/* START Title Text*/}
      <Box

        zIndex="10"
        left="calc(-1 * var(--moonsama-leftright-padding))"
        right="0px"

        position="absolute"
        top="15%"
        flex="1"
        paddingRight="22px"
        paddingLeft="22px"
        display={{ base: shorterThan800 ? "none" : "visible", md: shorterThan600 ? "none" : "visible" }}>
        <Box w="100%" margin="auto">
          <Image margin="auto" h="100%" maxWidth="488px" src={WhiteLogo} alt="" />
        </Box>
        <Box
          fontSize="32px"
          lineHeight="40px"
          maxHeight="80px"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          <Text fontFamily={'Orbitron'} color="white" textAlign="center">{isOauth ? "OAUTH" : "MULTIVERSE PORTAL"}</Text>
        </Box>
      </Box>


      {/* END Title Text*/}


      <VStack
        zIndex="1"
        direction={'column'}
        justifyContent='center'
        alignItems='center'
        spacing="0"
        position="absolute"
        top="var(--moonsama-nav-height)"
        left="0"
        right="0"
        className="moonsamaFullHeight"
      >

        <VStack
          spacing="0"
          width="100%"

        >


          {/* START Login Methods 
            This is always vertically centered and title text sits above it
          */}
          <Box
            bg="linear-gradient(311.18deg, #1A202C 67.03%, #2D3748 100%)"
            boxShadow="0px 25px 50px -12px rgba(0, 0, 0, 0.25)"
            borderRadius="8px"
            padding="24px"
            width="min(calc(100% - 70px), 456px)"
            visibility={(isOauth && !!accessToken) ? "hidden" : "visible"} //hide login shit when we are oauthing logged in user
          >
            <Box
              fontSize="24px"
              color="white"
              lineHeight="32px"
              maxHeight="64px"
              textOverflow="ellipsis"
              overflow="hidden"
              textAlign="center"
            >
              Login Method</Box>
            <Box w="100%" h="100%" paddingTop="24px">
              <Stack direction={{ base: "column", md: "row" }} w="100%" spacing="0">
                <Box flex="1" padding={{ base: "0 0 4px 0", md: "0 4px 0 0" }}>
                  <Button
                    {...loginButtonProps}
                    leftIcon={<svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.13869 2.83395L4.15053 5.60304L0.771973 3.25369V0.453992C0.771973 0.20696 1.01655 0.00656509 1.31695 0.00656509H4.07194L8.13869 2.83395ZM14.414 7.19308L12.1276 5.60523L8.13942 8.37432L11.7089 10.8519L14.414 12.7313V7.19308ZM4.02052 11.2367L2.08226 12.5833C1.44655 13.0799 1.00631 13.7817 0.838072 14.5669L4.15053 16.8681L8.13869 14.099L4.02052 11.2367ZM12.1276 16.8681L8.13942 19.6372L11.1853 21.7505H13.8646C13.9425 21.751 14.0198 21.7367 14.0923 21.7082C14.149 21.6885 14.2018 21.6589 14.248 21.6208C14.2968 21.5833 14.3366 21.5354 14.3643 21.4807C14.392 21.426 14.407 21.3657 14.4081 21.3045V18.4538L12.1276 16.8681Z" fill="#3BEFB8" />
                      <path d="M13.0156 9.94687L13.009 9.95197L0.764648 18.4582V24L14.414 14.5173V7.19308C14.4141 7.72861 14.2877 8.2567 14.0448 8.73495C13.802 9.2132 13.4494 9.62829 13.0156 9.94687Z" fill="#3BEFB8" />
                      <path d="M14.414 0.36071V3.25149L2.08228 11.8211C1.67157 12.1412 1.33954 12.5497 1.11128 13.0158C0.883012 13.4819 0.764486 13.9933 0.764649 14.5115V7.19453L11.1207 0H13.8969C14.1547 0.00655837 14.367 0.159587 14.414 0.36071Z" fill="#3BEFB8" />
                    </svg>
                    }
                    onClick={() => {
                      dispatch(openKiltLoginModal())
                    }}

                  >KILT</Button>
                </Box>
                <Box flex="1" padding={{ base: "4px 0 0 0", md: "0 0 0 4px" }}>
                  <Button
                    {...loginButtonProps}
                    leftIcon={<Mail color="#3BEFB8" />}
                    onClick={() => {
                      dispatch(openEmailLoginModal())
                    }}
                  >EMAIL</Button>

                </Box>
              </Stack>
            </Box>
          </Box>
          {/* END Login Methods */}
        </VStack>


      </VStack>
      <HStack
        spacing="0"
        overflowY="hidden"

        position="relative"
        direction="column"
        alignItems='center'
        textAlign='center'
        height="calc(100vh - 64px)"
        overflow="hidden"
        backgroundImage={`url(${BackgroundImage})`}
        left="calc(-1 * var(--moonsama-leftright-padding))"
        w="100vw"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
      >
        {!isMobileViewport && <Image src={LeftImage} sx={{ position: "absolute", left: 0, bottom: 0, maxHeight: "70%", maxWidth: "50%" }} alt="" />}
        {!isMobileViewport && <Image src={RightImageFlip} sx={{ position: "absolute", "right": 0, bottom: 0, maxHeight: "70%", maxWidth: "50%" }} alt="" />}
        {isMobileViewport && <Image src={LeftImage} sx={{ position: "absolute", "right": '50%', bottom: 0, transform: 'translateX(50%)', maxHeight: "40%" }} alt="" />}
      </HStack >
      {isOauth && <>
        <OauthModal />
      </>}
      <EmailCodeModal />
      <EmailLoginModal />
      <KiltLoginModal />
    </>
  );
};

export default HomePage;
