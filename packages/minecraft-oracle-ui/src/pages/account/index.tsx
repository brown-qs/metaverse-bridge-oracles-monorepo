import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';
import { useHistory } from 'react-router-dom';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, AlertColor, Avatar, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { Edit, ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Redirect } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
const AccountPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")
  let history = useHistory();

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
    window.sessionStorage.setItem('authSuccessRedirect', window.location.pathname);
    window.location.href = `${process.env.REACT_APP_BACKEND_API_URL}/auth/minecraft/login?jwt=${authData?.jwt}`;
  }

  const handleLogout = () => {
    window.localStorage.removeItem('authData');
    setAuthData({ jwt: undefined })
  }

  const handleMinecraftUnlink = async () => {
    try {
      const result = await axios({
        method: 'delete',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/minecraft/unlink`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
      });
      if (result?.data?.jwt) {
        if (authData && authData.userProfile) {
          //remove minecraft uuid
          setAuthData({ ...authData, userProfile: { ...authData.userProfile, minecraftUuid: null } })
        }
        history.push(`/auth/${result?.data?.jwt}`)
      }
    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        window.localStorage.removeItem('authData');
        setAuthData(undefined);
      };
      setFailureMessage(`Failed to unlink account: ${e}`)
    }
  }

  const handleAlertClose = () => {
    setFailureMessage("")
    getAccount()
  }

  if (!authData?.jwt) {
    return <Redirect to={'/account/login'} />;
  }

  const accountView = () => {
    if (!authData) {
      return <Redirect to={'/account/login'} />
    }

    return <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
      <Chip color="info" icon={<PersonIcon />} label={authData?.userProfile?.email} onDelete={() => { history.push(`/account/login/email/change`) }}
        deleteIcon={<Edit />}></Chip>


      <Stack direction="column" alignItems='center' textAlign='center' spacing={1} marginTop={2}>
        <Box>
          <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} onClick={() => { handleLogout() }} variant="contained">Logout</Button>
        </Box>
      </Stack>
      <Stack direction="column" alignItems='center' textAlign='center' spacing={1} marginTop={5}>
        <Box>Linked Minecraft Account</Box>
        <Box>{authData.userProfile?.minecraftUuid
          ? <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} onClick={() => { handleMinecraftUnlink() }} variant="contained">Unlink Minecraft</Button>
          : <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} onClick={() => { handleMinecraftLink() }} variant="contained">Link Minecraft</Button>}
        </Box>
      </Stack>

    </Stack>
  }

  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="Account" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}> {accountView()}</AuthLayout >
  );
};

export default AccountPage;
