import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Container, Image, Alert, AlertDescription, AlertIcon, Box, Button, CircularProgress, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, VStack, Grid, GridItem, FormControl, FormHelperText, FormLabel, Input, FormErrorMessage, InputRightElement, IconButton, useToast, useClipboard } from '@chakra-ui/react';
import { CircleX, Copy, DeviceFloppy, DeviceGamepad2, Link, Pencil, PencilOff, Power, Tags, Unlink, User } from 'tabler-icons-react';
import { useSelector } from 'react-redux';
import { selectAccessToken, setTokens } from '../state/slices/authSlice';
import { rtkQueryErrorFormatter, useEmailChangeMutation, useGamerTagSetMutation, useMinecraftLinkMutation, useMinecraftRedirectMutation, useMinecraftUnlinkMutation, useUserProfileQuery } from '../state/api/bridgeApi';
import { useDispatch } from 'react-redux';
import BackgroundImage from '../assets/images/bridge-background-blur.svg'
import { isValid } from 'date-fns';
import { useCaptcha } from '../hooks/useCaptcha/useCaptcha';
import { openEmailCodeModal } from '../state/slices/emailCodeModalSlice';
import { EmailCodeModal } from '../components/modals/EmailCodeModal';
import { UserRole } from '../state/api/types';

const AccountPage = () => {
  const { search } = useLocation()

  const toast = useToast()
  const accessToken = useSelector(selectAccessToken)
  const { onCopy, value, hasCopied } = useClipboard(accessToken ?? "");

  const dispatch = useDispatch()
  const { executeCaptcha, resetCaptcha, setCaptchaVisible, isCaptchaLoading, isCaptchaVisible, isCaptchaError, isCaptchaSolved, captchaError, captchaSolution } = useCaptcha()

  const [failureMessage, setFailureMessage] = useState("")
  const navigate = useNavigate();
  const { data: profile, error, isLoading: isProfileLoading } = useUserProfileQuery()
  const [changeEmail, { error: changeEmailError, isUninitialized: isChangeEmailUninitialized, isLoading: isChangeEmailLoading, isSuccess: isChangeEmailSuccess, isError: isChangeEmailError, reset: changeEmailReset }] = useEmailChangeMutation()
  const [changeGamerTag, { error: gamerTagError, isUninitialized: isGamerTagUninitialized, isLoading: isGamerTagLoading, isSuccess: isGamerTagSuccess, isError: isGamerTagError, reset: gamerTagReset }] = useGamerTagSetMutation()
  const [minecraftRedirect, { data: minecraftRedirectData, error: minecraftRedirectError, isUninitialized: isMinecraftRedirectUninitialized, isLoading: isMinecraftRedirectLoading, isSuccess: isMinecraftRedirectSuccess, isError: isMinecraftRedirectError, reset: minecraftRedirectReset }] = useMinecraftRedirectMutation()
  const [minecraftLink, { error: minecraftLinkError, isUninitialized: isMinecraftLinkUninitialized, isLoading: isMinecraftLinkLoading, isSuccess: isMinecraftLinkSuccess, isError: isMinecraftLinkError, reset: minecraftLinkReset }] = useMinecraftLinkMutation()
  const [minecraftUnlink, { error: minecraftUnlinkError, isUninitialized: isMinecraftUnlinkUninitialized, isLoading: isMinecraftUnlinkLoading, isSuccess: isMinecraftUnlinkSuccess, isError: isMinecraftUnlinkError, reset: minecraftUnlinkReset }] = useMinecraftUnlinkMutation()





  const [email, setEmail] = useState<string>(profile?.email ?? "")
  const [isEmailEditing, setIsEmailEditing] = useState<boolean>(false)
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState<boolean>(false)
  const [profileLoading, setProfileLoading] = useState<boolean>(isProfileLoading)
  const [gamerTag, setGamerTag] = useState<string | undefined>(profile?.gamerTag ?? "")
  const [isGamerTagEditing, setIsGamerTagEditing] = useState<boolean>(false)

  const [minecraftUserName, setMinecraftUserName] = useState<string | undefined>(profile?.minecraftUserName ?? undefined)


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
    setMinecraftUserName(profile?.minecraftUserName ?? undefined)
  }, [profile])


  React.useEffect(() => {
    setProfileLoading(isProfileLoading)
  }, [isProfileLoading])

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
    if (isChangeEmailSuccess) {
      changeEmailReset()
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
      dispatch(openEmailCodeModal())
    }
  }, [isChangeEmailSuccess])


  React.useEffect(() => {
    if (isChangeEmailError) {
      changeEmailReset()
      setEmail(profile?.email ?? "")
      setIsEmailChangeLoading(false)
      setIsEmailEditing(false)
      toast({
        title: 'Email change error.',
        description: rtkQueryErrorFormatter(changeEmailError),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }

  }, [isChangeEmailError])


  //MINECRAFT LINK

  React.useEffect(() => {
    if (!!search && search.includes("code") && isMinecraftLinkUninitialized) {
      minecraftLink(search)
      toast({
        title: 'Currently linking your Minecraft account.',
        description: "Please wait.",
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [search, isMinecraftLinkUninitialized])

  React.useEffect(() => {
    if (isMinecraftLinkSuccess) {
      toast({
        title: 'Success.',
        description: "Your Minecraft account has been successfully linked",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate("/account")
    }
  }, [isMinecraftLinkSuccess])


  React.useEffect(() => {
    if (isMinecraftLinkError) {
      toast({
        title: 'Error linking Minecraft account.',
        description: rtkQueryErrorFormatter(minecraftLinkError),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      navigate("/account")
    }

  }, [isMinecraftLinkError])

  React.useEffect(() => {
    if (isMinecraftUnlinkSuccess) {
      toast({
        title: 'Success.',
        description: "Your Minecraft account has been successfully unlinked.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [isMinecraftUnlinkSuccess])


  React.useEffect(() => {
    if (isMinecraftUnlinkError) {
      toast({
        title: 'Error unlinking Minecraft account.',
        description: rtkQueryErrorFormatter(minecraftUnlinkError),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      minecraftUnlinkReset()

    }

  }, [isMinecraftUnlinkError])



  React.useEffect(() => {
    if (isMinecraftRedirectSuccess) {
      toast({
        title: 'Success.',
        description: "You will be redirected to Minecraft login.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      if (!!minecraftRedirectData?.redirectUrl) {
        window.location.href = minecraftRedirectData?.redirectUrl
      } else {
        minecraftRedirectReset()

      }


    }
  }, [isMinecraftRedirectSuccess])


  React.useEffect(() => {
    if (isMinecraftRedirectError) {
      minecraftRedirectReset()
      toast({
        title: 'Error redirecting to Minecraft login.',
        description: rtkQueryErrorFormatter(gamerTagError),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }

  }, [isMinecraftRedirectError, minecraftRedirectData])


  //GAMERTAG
  const showGamerTagInvalid = React.useMemo(() => isGamerTagEditing && !gamerTag, [gamerTag, isGamerTagEditing])
  const gamerTagInputDisabled = React.useMemo(() => {
    if (isGamerTagEditing) {
      return false
    } else {
      return true
    }
  }, [isGamerTagEditing])

  const handleGamerTagSubmit = (gamerTag: string) => {
    changeGamerTag({ gamerTag })
  }

  React.useEffect(() => {
    if (isGamerTagSuccess) {
      gamerTagReset()
      setIsGamerTagEditing(false)
      toast({
        title: 'Gamer tag change success.',
        description: "You now have a new gamer tag.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [isGamerTagSuccess])


  React.useEffect(() => {
    if (isGamerTagError) {
      setGamerTag(profile?.gamerTag ?? undefined)
      gamerTagReset()
      setIsGamerTagEditing(false)
      toast({
        title: 'Gamer tag change error.',
        description: rtkQueryErrorFormatter(gamerTagError),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }

  }, [isGamerTagError])





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
        <Image src={BackgroundImage} w="552px" h="622px" position="absolute" top="0" right="calc(-1 * var(--moonsama-leftright-padding))" filter="blur(10px)"></Image>
      </Box>
      {profileLoading
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
          w="min(100%, 900px)"
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
              <Button variant="moonsamaGhost" rightIcon={<Power color="var(--chakra-colors-teal-200)" />} onClick={() => {
                dispatch(setTokens({ accessToken: null, refreshToken: null }))
              }}>Log Out</Button>
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
                  <IconButton isLoading={isEmailChangeLoading} variant="moonsamaGhost" aria-label='Save' w="100%" isDisabled={showEmailInvalid} onClick={() => handleEmailSubmit(email)} icon={<DeviceFloppy color="#3BEFB8" />}></IconButton>
                </Box>
                <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px">
                  {isEmailEditing
                    ?
                    <IconButton isDisabled={isEmailChangeLoading} variant="moonsamaGhost" aria-label='Cancel' w="100%" onClick={() => { setEmail(profile?.email ?? ""); setIsEmailEditing(false) }} icon={<PencilOff color="#3BEFB8" />}></IconButton>
                    :
                    <IconButton variant="moonsamaGhost" aria-label='Edit' w="100%" onClick={() => { setIsEmailEditing(true) }} icon={<Pencil color="#3BEFB8" />}></IconButton>
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
              {
                !!minecraftUserName
                  ?
                  <HStack spacing='0' w="100%">
                    <Box flex="1">
                      <FormControl>
                        <Input
                          isDisabled={true}
                          value={minecraftUserName}
                          spellCheck="false"
                          autoCapitalize="off"
                          autoCorrect="off"
                        />
                        <FormHelperText>&nbsp;</FormHelperText>
                      </FormControl>
                    </Box>
                    <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px">
                    </Box>
                    <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px">
                      <IconButton isLoading={isMinecraftUnlinkLoading} variant="moonsamaGhost" aria-label='Unlink' w="100%" onClick={() => { minecraftUnlink() }} icon={<Unlink color="#3BEFB8" />}></IconButton>

                    </Box>
                  </HStack>
                  :
                  <Button isDisabled={isMinecraftRedirectSuccess} isLoading={isMinecraftRedirectLoading || isMinecraftLinkLoading} marginBottom="25px" aria-label='Link' w="100%" onClick={() => { minecraftRedirect() }} rightIcon={<Link />}>Link Account</Button>
              }

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
              <HStack spacing='0' w="100%">
                <Box flex="1">
                  <FormControl isInvalid={showGamerTagInvalid}>
                    <Input
                      isDisabled={gamerTagInputDisabled}
                      value={gamerTag}
                      onChange={(e) => {
                        setGamerTag(e.target.value)
                      }}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          if (!gamerTagInputDisabled && !showGamerTagInvalid) {
                            handleGamerTagSubmit(gamerTag ?? "")
                          }
                        }
                      }}
                      //onBlur={() => { console.log("on blur"); setIsEmailEditing(false) }}
                      spellCheck="false"
                      autoCapitalize="off"
                      autoCorrect="off"
                    />
                    {showGamerTagInvalid
                      ?
                      <FormErrorMessage>Invalid Gamer Tag.</FormErrorMessage>
                      :
                      <FormHelperText>&nbsp;</FormHelperText>
                    }
                  </FormControl>
                </Box>
                <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px" visibility={isGamerTagEditing ? "visible" : "hidden"}>
                  <IconButton isLoading={isGamerTagLoading} variant="moonsamaGhost" aria-label='Save' w="100%" isDisabled={showGamerTagInvalid} onClick={() => handleGamerTagSubmit(gamerTag ?? "")} icon={<DeviceFloppy color="#3BEFB8" />}></IconButton>
                </Box>
                <Box alignSelf="flex-start" paddingLeft="4px" minW="50px" w="50px">
                  {isGamerTagEditing
                    ?
                    <IconButton isDisabled={isGamerTagLoading} variant="moonsamaGhost" aria-label='Cancel' w="100%" onClick={() => { setGamerTag(profile?.gamerTag ?? undefined); setIsGamerTagEditing(false) }} icon={<PencilOff color="#3BEFB8" />}></IconButton>
                    :
                    <IconButton variant="moonsamaGhost" aria-label='Edit' w="100%" onClick={() => { setIsGamerTagEditing(true) }} icon={<Pencil color="#3BEFB8" />}></IconButton>
                  }
                </Box>
              </HStack>
            </Box>
          </GridItem>
          {/** END gamertag */}


          {/** START admin */}
          {!!profile?.role && [UserRole.ADMIN, UserRole.ADMIN_SUPPORT, UserRole.BANKER_ADMIN].includes(profile.role) &&
            <>
              <GridItem zIndex="2" paddingTop="24px">
                <VStack alignItems="flex-start" spacing="0">
                  <Box {...sectionTitleProps}>Special Role</Box>
                  <Box {...sectionDescriptionProps}>Your role is {profile.role}. Click to copy your JWT for API use.</Box>
                </VStack>
              </GridItem>
              <GridItem zIndex="2" paddingTop="24px">
                <Box {...sectionInputProps}>
                  <Button onClick={() => {
                    onCopy()
                    toast({
                      title: 'JWT copied to clipboard.',
                      status: 'success',
                      duration: 5000,
                      isClosable: true,
                    })
                  }} rightIcon={<Copy></Copy>}>Copy JWT</Button>
                </Box>
              </GridItem>
            </>
          }
          {/** END gamertag */}

        </Grid>
      }
      <EmailCodeModal />

    </Container>
  );
};

export default AccountPage;