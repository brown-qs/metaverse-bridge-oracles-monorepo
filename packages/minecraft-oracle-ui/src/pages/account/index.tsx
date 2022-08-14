import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses, useOauthLogin } from 'hooks';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Container, Image, Alert, AlertDescription, AlertIcon, Box, Button, CircularProgress, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, VStack, Grid, GridItem } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, Power, Tags, User } from 'tabler-icons-react';
import { useSelector } from 'react-redux';
import { selectAccessToken, setTokens } from '../../state/slices/authSlice';
import { useUserProfileQuery } from '../../state/api/bridgeApi';
import { useDispatch } from 'react-redux';
import BackgroundImage from '../../assets/images/bridge-background-blur.svg'

const AccountPage = () => {
  const accessToken = useSelector(selectAccessToken)
  const [failureMessage, setFailureMessage] = useState("")
  const { oauthData, setOauthData } = useOauthLogin()
  const navigate = useNavigate();
  const { data: profile, error, isLoading: profileLoading } = useUserProfileQuery()
  const dispatch = useDispatch()


  const sectionTitleProps = { fontFamily: "heading", color: "teal.200", fontSize: "16px", lineHeight: "19px" }
  const sectionDescriptionProps = { fontSize: "14px", lineHeight: "20px", color: "gray.400", paddingTop: "4px" }
  return (
    <Container
      bg="#080714"
      backgroundPosition="top right"
      backgroundRepeat="no-repeat"
      backgroundSize='600px 700px'
      minWidth="100%"
      margin="0"
      padding="0"
      height="100%"
      position="relative"
      overflow="visible">

      <Box position="absolute" w="100%" h="100%" bg="#080714">
        <Image src={BackgroundImage} w="552px" h="622px" position="absolute" top="0" right="0" filter="blur(10px)"></Image>
      </Box>
      {false
        ?
        <VStack className="moonsamaFullHeight">
          <HStack h="100%">
            <CircularProgress isIndeterminate color="teal"></CircularProgress>
          </HStack>
        </VStack>
        :
        <Grid
          overflow="hidden"
          paddingTop="120px"
          margin="auto"
          zIndex="2"
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          w={{ base: "min(calc(100% - 22px), 900px)", md: "min(calc(100% - 80px), 900px)" }}
        >
          {/** START title + logout */}
          <GridItem zIndex="2" paddingBottom={{ base: "8px", md: "40px" }}>
            <VStack alignItems="flex-start" spacing="0">
              <Box fontFamily="heading" color="teal.200" fontSize="30px" lineHeight="36px">Account Settings</Box>
              <Box fontSize="16px" lineHeight="24px" color="gray.400" paddingTop="8px">Change your account details</Box>
            </VStack>
          </GridItem>
          <GridItem zIndex="2" paddingBottom="40px">
            <VStack alignItems={{ base: "flex-end", md: "flex-end" }} spacing="0">
              <Button variant="moonsamaGhost" rightIcon={<Power color="#3BEFB8" />}>Log Out</Button>
            </VStack>
          </GridItem>
          {/** END title + logout */}

          {/** START email */}
          <GridItem zIndex="2" paddingTop="24px" borderTop="1px solid" borderColor="gray.500">
            <VStack alignItems="flex-start" spacing="0" >
              <Box {...sectionTitleProps}>Email Address</Box>
              <Box {...sectionDescriptionProps}>An accurate email address you will use for login and authentication purposes. Your Moonsama account is based on your email address.</Box>
            </VStack>
          </GridItem>
          <GridItem zIndex="2" paddingTop="24px" borderTop="1px solid" borderColor={{ base: "transparent", md: "gray.500" }}>
            <Box>aaa</Box>
          </GridItem>
          {/** END email */}

          {/** START minecraft */}
          <GridItem zIndex="2" paddingTop="24px">
            <VStack alignItems="flex-start" spacing="0">
              <Box {...sectionTitleProps}>Linked Minecraft Account</Box>
              <Box {...sectionDescriptionProps}>Linking a Minecraft account that was used with Moonsama prior to the email login system will migrate all your assets to your email address.</Box>
            </VStack>
          </GridItem>
          <GridItem zIndex="2" paddingTop="24px">
            <Box>aaa</Box>
          </GridItem>
          {/** END minecraft */}

          {/** START gamertag */}
          <GridItem zIndex="2" paddingTop="24px">
            <VStack alignItems="flex-start" spacing="0">
              <Box {...sectionTitleProps}>Gamer Tag</Box>
              <Box {...sectionDescriptionProps}>Choose a gamer tag to be used in the Moonsama Multiverse. Please note this gamer tag does not apply to Minecraft.</Box>
            </VStack>
          </GridItem>
          <GridItem zIndex="2" paddingTop="24px">
            <Box>aaa</Box>
          </GridItem>
          {/** END gamertag */}

        </Grid>
      }
    </Container>
  );
};

export default AccountPage;