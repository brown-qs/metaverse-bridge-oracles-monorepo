import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Alert, AlertDescription, AlertIcon, Box, Button, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, User } from 'tabler-icons-react';
=======
import Tooltip from '@mui/material/Tooltip';
import { useHistory } from 'react-router-dom';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, AlertColor, Avatar, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { Edit, SportsEsports, ExpandLess, ExpandMore, StarBorder, Style } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Redirect } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useOauthLogin } from '../../hooks/useOauthLogin/useOauthLogin';
>>>>>>> origin/dev
const AccountPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")
<<<<<<< HEAD
  const navigate = useNavigate();
=======
  const { oauthData, setOauthData } = useOauthLogin()

  let history = useHistory();
>>>>>>> origin/dev

  const getAccount = async () => {
    setIsLoading(true)
    try {
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/user/profile`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
      });
      setAuthData(oldAuthData => ({ jwt: oldAuthData?.jwt, userProfile: result.data }))
    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        window.localStorage.removeItem('authData');
        setAuthData(undefined);
      };
      setFailureMessage(`Failed to load account: ${e}`)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!!authData?.jwt) {
      getAccount()
    }
  }, [authData?.jwt])


  const handleMinecraftLink = () => {
    navigate("/account/minecraft/redirect")
  }

  const handleLogout = () => {
    setOauthData(null)
    window.localStorage.removeItem('authData');
    setAuthData({ jwt: undefined })
  }

  const handleMinecraftUnlink = async () => {
    navigate("/account/minecraft/unlink")
  }

  const handleSetGamerTag = () => {
    history.push("/account/gamertag")

  }

  const handleAlertClose = () => {
    setFailureMessage("")
    getAccount()
  }

  if (!authData?.jwt) {
    navigate('/account/login')
  }


<<<<<<< HEAD
=======
    return (
      <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
        <Chip color="info" sx={{ maxWidth: 300 }} icon={<PersonIcon />} label={authData?.userProfile?.email} onDelete={() => { history.push(`/account/login/email/change`) }}
          deleteIcon={<Edit />}></Chip>
        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} marginTop={2}>
          <Box>
            <Button disableElevation disableRipple style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { handleLogout() }} variant="contained">LOGOUT</Button>
          </Box>
        </Stack>
        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} margin={2} marginTop={5}>
          <Box>LINKED MINECRAFT ACCOUNT</Box>
          {!authData?.userProfile?.minecraftUuid && <><Alert sx={{ margin: "auto" }} severity="warning">Linking a Minecraft account that was used with Moonsama prior to the new login system will migrate over all assets and resources to your Moonsama account. Make sure you do not lose access to your email address.</Alert><div></div></>}
          {authData?.userProfile?.minecraftUuid && <><Chip color="success" icon={<SportsEsports />} label={authData?.userProfile?.minecraftUserName}></Chip><div></div></>}
          <Box>{authData?.userProfile?.minecraftUuid
            ? <Button disableElevation disableRipple style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { handleMinecraftUnlink() }} variant="contained">UNLINK MINECRAFT</Button>
            : <Button disableElevation disableRipple style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { handleMinecraftLink() }} variant="contained">LINK MINECRAFT</Button>}
          </Box>
        </Stack>
        <Stack direction="column" alignItems='center' textAlign='center' spacing={1} margin={2} marginTop={3}>
          <Box>GAMER TAG</Box>
          {!!authData?.userProfile?.gamerTag
            ?
            <Chip color="info" sx={{ maxWidth: 300 }} icon={<Style />} label={authData?.userProfile?.gamerTag} onDelete={() => { history.push(`/account/gamertag`) }}
              deleteIcon={<Edit />}></Chip>
            :
            <Button disableElevation disableRipple style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { handleSetGamerTag() }} variant="contained">SET GAMER TAG</Button>
          }

        </Stack>

      </Stack >)
  }
>>>>>>> origin/dev

  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="ACCOUNT" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}>
      <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
        <Tag sx={{ maxWidth: 300 }}
          size={"lg"}
          key={"lg"}
          borderRadius='full'
          variant='solid'
        >
          <TagLeftIcon as={User} />
          <TagLabel>{authData?.userProfile?.email}</TagLabel>
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
          {!authData?.userProfile?.minecraftUuid && <><Alert sx={{ margin: "auto" }} variant='solid' status="warning"><AlertIcon /><AlertDescription textAlign="left" fontFamily="Rubik">Linking a Minecraft account that was used with Moonsama prior to the new login system will migrate over all assets and resources to your Moonsama account. Make sure you do not lose access to your email address.</AlertDescription></Alert><div></div></>}
          {authData?.userProfile?.minecraftUuid && <>
            <Tag sx={{ maxWidth: 300 }}
              size={"lg"}
              key={"lg"}
              borderRadius='full'
              variant='solid'
              colorScheme="green"
            >
              <TagLeftIcon as={DeviceGamepad2} />
              <TagLabel>{authData?.userProfile?.minecraftUserName}</TagLabel>
            </Tag>
          </>}
          <Box>{authData?.userProfile?.minecraftUuid
            ? <Button style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} marginTop="6px" onClick={() => { handleMinecraftUnlink() }} >UNLINK MINECRAFT</Button>
            : <Button style={{ maxWidth: '200px', width: '200px', minWidth: '200px' }} marginTop="4px" onClick={() => { handleMinecraftLink() }} >LINK MINECRAFT</Button>}
          </Box>
        </Stack>

      </Stack >

    </AuthLayout >
  );
};

export default AccountPage;
