import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses, useOauthLogin } from 'hooks';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Alert, AlertDescription, AlertIcon, Box, Button, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, Tags, User } from 'tabler-icons-react';
import { useSelector } from 'react-redux';
import { selectAccessToken, setTokens } from '../../state/slices/authSlice';
import { useUserProfileQuery } from '../../state/api/bridgeApi';
import { useDispatch } from 'react-redux';
const AccountPage = () => {
  const accessToken = useSelector(selectAccessToken)
  const [failureMessage, setFailureMessage] = useState("")
  const { oauthData, setOauthData } = useOauthLogin()
  const navigate = useNavigate();
  const { data: profile, error, isLoading: profileLoading } = useUserProfileQuery()
  const dispatch = useDispatch()



  const handleMinecraftLink = () => {
    navigate("/account/minecraft/redirect")
  }

  const handleLogout = () => {
    setOauthData(null)
    window.localStorage.removeItem('accessToken');
    dispatch(setTokens({ accessToken: null, refreshToken: null }));

    // setAuthData({ jwt: undefined })
  }

  const handleMinecraftUnlink = async () => {
    navigate("/account/minecraft/unlink")
  }

  const handleSetGamerTag = () => {
    navigate("/account/gamertag")

  }

  if (!accessToken) {
    navigate('/bridge')
  }



  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="ACCOUNT" loading={profileLoading} >
      <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
        <Tag sx={{ maxWidth: 300 }}
          size={"lg"}
          key={"lg"}
          borderRadius='full'
          variant='solid'
        >
          <TagLeftIcon as={User} />
          <TagLabel>{profile?.email}</TagLabel>
          <TagRightIcon sx={{ cursor: "pointer" }} as={Pencil} onClick={() => { navigate(`/account/login/email/change`) }} />
        </Tag>

        {/*<Chip color="info" sx={{ maxWidth: 300 }} icon={<User />} label={authData?.userProfile?.email} onDelete={() => { navigate(`/account/login/email/change`) }}
          deleteIcon={<Pencil />}></Chip>*/}


        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} marginTop={2}>
          <Box paddingTop="10px" >
            <Button style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { handleLogout() }} >LOGOUT</Button>
          </Box>
        </Stack>
        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} margin={2} marginTop={5}>
          <Box paddingTop="30px">LINKED MINECRAFT ACCOUNT</Box>
          {!profile?.minecraftUuid && <><Alert sx={{ margin: "auto" }} variant='solid' status="warning"><AlertIcon /><AlertDescription textAlign="left" fontFamily="Rubik">Linking a Minecraft account that was used with Moonsama prior to the new login system will migrate over all assets and resources to your Moonsama account. Make sure you do not lose access to your email address.</AlertDescription></Alert><div></div></>}
          {!!profile?.minecraftUuid && <>
            <Tag sx={{ maxWidth: 300 }}
              size={"lg"}
              key={"lg"}
              borderRadius='full'
              variant='solid'
              colorScheme="green"
            >
              <TagLeftIcon as={DeviceGamepad2} />
              <TagLabel>{profile?.minecraftUserName}</TagLabel>
            </Tag>
          </>}
          <Box>{profile?.minecraftUuid
            ? <Button style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} marginTop="6px" onClick={() => { handleMinecraftUnlink() }} >UNLINK MINECRAFT</Button>
            : <Button style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} marginTop="4px" onClick={() => { handleMinecraftLink() }} >LINK MINECRAFT</Button>}
          </Box>
        </Stack>
        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} margin={2} marginTop={3}>
          <Box paddingTop="30px">GAMER TAG</Box>
          {!!profile?.gamerTag
            ?
            <Tag sx={{ maxWidth: 300 }}
              size={"lg"}
              key={"lg"}
              borderRadius='full'
              variant='solid'
            >
              <TagLeftIcon as={Tags} />
              <TagLabel>{profile?.gamerTag}</TagLabel>
              <TagRightIcon sx={{ cursor: "pointer" }} as={Pencil} onClick={() => { navigate(`/account/gamertag`) }} />

            </Tag>
            :
            <>
              <Box></Box>
              <Button onClick={() => { handleSetGamerTag() }} >SET GAMER TAG</Button>

            </>
          }

        </Stack>
        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} margin={2} marginTop={3}>
          <Box paddingTop="30px" paddingBottom="30px">
            <Button onClick={() => { navigate("/bridge") }} >GO TO BRIDGE</Button>
          </Box>


        </Stack>
      </Stack >

    </AuthLayout >
  );
};

export default AccountPage;