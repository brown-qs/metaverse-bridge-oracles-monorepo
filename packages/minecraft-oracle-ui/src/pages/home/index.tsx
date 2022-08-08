import React, { useState } from 'react';
import { Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { styles } from './styles';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';

import { useNavigate } from 'react-router-dom';
import { Image, Button, Stack, useMediaQuery, Text, VStack, Box } from '@chakra-ui/react';
import { Mail } from 'tabler-icons-react';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minecraftWarningOpen, setMinecraftWarningOpen] = React.useState(false);
  const { authData } = useAuth();
  let navigate = useNavigate();

  const {
    homeContainer,
    logo,
    leftBgImage,
    rightBgImage,
    glitchText,
    loginButtonStyleV2,
    centerBgImage
  } = useClasses(styles);



  const [isMobileViewport] = useMediaQuery('(max-width: 600px)')


  const loginButtonProps = { h: "80px", w: "100%", fontSize: "20px", bg: "rgba(255, 255, 255, 0.06)", border: "none" }
  return (

    <Stack direction="column" alignItems='center' textAlign='center' style={{ height: `calc(100vh - ${isMobileViewport ? '58px' : '80px'})` }}>

      <VStack
        zIndex="1"
        direction={'column'}
        justifyContent='center'
        alignItems='center'
        spacing="0"
        paddingLeft="20px"
        paddingRight="20px"
        paddingTop="48px"
      >
        <Box w="100%">
          <Image h="100%" w="100%" src={WhiteLogo} alt="" />
        </Box>
        <Box fontSize="32px" lineHeight="40px" paddingTop="20px" paddingBottom="32px">
          <Text fontFamily={'Orbitron'} color="white">MULTIVERSE BRIDGE</Text>

        </Box>
        <VStack
          bg="linear-gradient(311.18deg, #1A202C 67.03%, #2D3748 100%)"
          boxShadow="0px 25px 50px -12px rgba(0, 0, 0, 0.25)"
          borderRadius="8px"
          padding="24px"
          width="min(calc(100vw - 70px), 456px)"
          overflow="hidden"
          spacing="0"
        >
          <Box fontSize="24px" color="white">Login Method</Box>
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
                  onClick={() => { navigate("/account/login/kilt") }}

                >KILT</Button>
              </Box>
              <Box flex="1" padding={{ base: "4px 0 0 0", md: "0 0 0 4px" }}>
                <Button
                  {...loginButtonProps}
                  leftIcon={<Mail color="#3BEFB8" />}
                  onClick={() => { navigate("/account/login/email") }}
                >EMAIL</Button>

              </Box>
            </Stack>
          </Box>

        </VStack>
      </VStack>

      {!isMobileViewport && <img src={LeftImage} className={leftBgImage} alt="" />}
      {!isMobileViewport && <img src={RightImageFlip} className={rightBgImage} alt="" />}
      {isMobileViewport && <img src={LeftImage} className={centerBgImage} alt="" />}
    </Stack >
  );
};

export default HomePage;
