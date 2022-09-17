import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses, useOauthLogin } from 'hooks';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Container, Image, Alert, AlertDescription, AlertIcon, Box, Button, CircularProgress, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, VStack, Grid, GridItem, FormControl, FormHelperText, FormLabel, Input, FormErrorMessage, InputRightElement, IconButton, useToast } from '@chakra-ui/react';
import { CircleX, DeviceFloppy, DeviceGamepad2, Pencil, PencilOff, Power, Tags, User } from 'tabler-icons-react';
import { useSelector } from 'react-redux';
import { selectAccessToken, setTokens } from '../../state/slices/authSlice';
import { useEmailChangeMutation, useUserProfileQuery } from '../../state/api/bridgeApi';
import { useDispatch } from 'react-redux';
import BackgroundImage from '../../assets/images/bridge-background-blur.svg'
import { isValid } from 'date-fns';
import { useCaptcha } from '../../hooks/useCaptcha/useCaptcha';

const AccountPage = () => {
  const toast = useToast()
  const accessToken = useSelector(selectAccessToken)
  const dispatch = useDispatch()
  const { executeCaptcha, resetCaptcha, setCaptchaVisible, isCaptchaLoading, isCaptchaVisible, isCaptchaError, isCaptchaSolved, captchaError, captchaSolution } = useCaptcha()

  const [failureMessage, setFailureMessage] = useState("")
  const { oauthData, setOauthData } = useOauthLogin()
  const navigate = useNavigate();
  const { data: profile, error, isLoading: isProfileLoading } = useUserProfileQuery()
  const [changeEmail, { error: changeEmailError, isUninitialized: isChangeEmailUninitialized, isLoading: isChangeEmailLoading, isSuccess: isChangeEmailSuccess, isError: isChangeEmailError, reset: changeEmailReset }] = useEmailChangeMutation()

  const [email, setEmail] = useState<string>("")
  const [isEmailEditing, setIsEmailEditing] = useState<boolean>(false)
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState<boolean>(false)

  const [gamerTag, setGamerTag] = useState<string>("")
  const [isGamerTagEditing, setIsGamerTagEditing] = useState<boolean>(false)

  //EMAIL
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  React.useEffect(() => {
    if (!isEmailEditing) {
      setEmail(profile?.email ?? "")
    }
    if (!isGamerTagEditing) {
      setGamerTag(profile?.gamerTag ?? "")
    }
  }, [profile])

  React.useEffect(() => {
    if (isEmailEditing) {
      setCaptchaVisible(true)
    } else {
      setCaptchaVisible(false)
    }
  }, [isEmailEditing])


  const emailInputDisabled = React.useMemo(() => {
    if (isEmailEditing && !isEmailChangeLoading) {
      return false
    } else {
      return true
    }
  }, [isEmailEditing, isEmailChangeLoading])

  const showEmailInvalid = React.useMemo(() => isEmailEditing && !isValidEmail(email), [email, isEmailEditing])


  const handleEmailSubmit = (email: string) => {
    setIsEmailChangeLoading(true)
    executeCaptcha()
  }

  React.useEffect(() => {
    if (isCaptchaSolved && !!captchaSolution) {
      changeEmail({ email: email, "g-recaptcha-response": captchaSolution })
    }
  }, [isCaptchaSolved])

  React.useEffect(() => {
    setEmail(profile?.email ?? "")
    setIsEmailChangeLoading(false)
    setIsEmailEditing(false)
    toast({
      title: 'Email change submitted.',
      description: "Please enter the code to complete the change.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }, [isChangeEmailSuccess])


  React.useEffect(() => {
    setEmail(profile?.email ?? "")
    setIsEmailChangeLoading(false)
    setIsEmailEditing(false)
    toast({
      title: 'Email change error.',
      description: "Please refresh and try again.",
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }, [isChangeEmailError])



  const handleGamerTagSubmit = (gamerTag: string) => {

  }






  const sectionTitleProps = { fontFamily: "heading", color: "teal.200", fontSize: "16px", lineHeight: "19px" }
  const sectionDescriptionProps = { fontSize: "14px", lineHeight: "20px", color: "gray.400", paddingTop: "4px" }
  const sectionInputProps = { paddingLeft: { base: '0px', md: '60px' }, maxWidth: { base: "400px", md: "none" } }

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
      {isProfileLoading
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
            <Box {...sectionInputProps}>
              <HStack spacing='0' w="100%">
                <Box flex="1">
                  <FormControl isInvalid={showEmailInvalid}>
                    <Input
                      isDisabled={emailInputDisabled}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      onFocus={() => { }}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          if (!emailInputDisabled && isValidEmail(email)) {
                            handleEmailSubmit(email)
                          }
                        }
                      }}
                      //onBlur={() => { console.log("on blur"); setIsEmailEditing(false) }}
                      spellCheck="false"
                      autoCapitalize="off"
                      autoCorrect="off"
                    />
                    {showEmailInvalid
                      ?
                      <FormErrorMessage>Invalid Email.</FormErrorMessage>
                      :
                      <FormHelperText>&nbsp;</FormHelperText>
                    }
                  </FormControl>
                </Box>
                <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px" visibility={isEmailEditing ? "visible" : "hidden"}>
                  <IconButton isLoading={isEmailChangeLoading} variant="moonsamaGhost" aria-label='Save' w="100%" isDisabled={showEmailInvalid} onClick={() => handleEmailSubmit(email)} icon={<DeviceFloppy />}></IconButton>
                </Box>
                <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px">
                  {isEmailEditing
                    ?
                    <IconButton isDisabled={isEmailChangeLoading} variant="moonsamaGhost" aria-label='Cancel' w="100%" onClick={() => { setEmail(profile?.email ?? ""); setIsEmailEditing(false) }} icon={<PencilOff />}></IconButton>
                    :
                    <IconButton variant="moonsamaGhost" aria-label='Edit' w="100%" onClick={() => { setIsEmailEditing(true) }} icon={<Pencil />}></IconButton>
                  }
                </Box>



              </HStack>
            </Box>
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
            <Box {...sectionInputProps}>
              <FormControl>
                <Input type='text' />
                <FormHelperText>We'll never share your email.</FormHelperText>
              </FormControl>
            </Box>
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
            <Box {...sectionInputProps}>
              <FormControl>
                <Input type='text' />
                <FormHelperText>&nbsp;</FormHelperText>
                <FormErrorMessage>Invalid Gamer Tag.</FormErrorMessage>
              </FormControl>
            </Box>
          </GridItem>
          {/** END gamertag */}

        </Grid>
      }
    </Container>
  );
};

export default AccountPage;