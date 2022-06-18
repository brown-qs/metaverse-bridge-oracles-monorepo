import React, { useEffect, useState } from 'react';
import { Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, Avatar, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Redirect } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const AccountPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")

  const authed = !!authData?.jwt

  useEffect(() => {
    if (authed) {
      const getAccount = async () => {
        setIsLoading(true)
        try {
          const result = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_API_URL}/account`,
            headers: {
              "Authorization": `Bearer ${authData?.jwt}`,
              "Content-Type": "application/json"
            },
          });
          setAuthData({ ...authData, emailUser: result.data })

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
      getAccount()
    }
  }, [])

  const handleMinecraftLink = () => {
    window.sessionStorage.setItem('authSuccessRedirect', window.location.pathname);
    window.location.href = `${process.env.REACT_APP_BACKEND_API_URL}/auth/minecraft/login?jwt=${authData?.jwt}`;
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
        window.location.href = `/auth/${result?.data?.jwt}`
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

  if (!authed) {
    return <Redirect to={'/account/login'} />;
  }

  const accountView = () => {
    if (!authData) {
      return <Redirect to={'/account/login'} />
    }

    return <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
      <Chip color="info" icon={<PersonIcon />} label={authData?.emailUser?.email} ></Chip>

      <Stack direction="column" alignItems='center' textAlign='center' spacing={1} marginTop={5}>
        <Box>Linked Minecraft Account</Box>
        <Box>{authData.emailUser?.minecraftUuid
          ? <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} onClick={() => { handleMinecraftUnlink() }} variant="contained">Unlink Minecraft</Button>
          : <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} onClick={() => { handleMinecraftLink() }} variant="contained">Link Minecraft</Button>}
        </Box>
      </Stack>
    </Stack>
  }


  return (
    <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
      {failureMessage
        ? <Stack spacing={6} margin={2} alignItems='center' textAlign='center'><Alert severity="error" onClose={() => { }}>{failureMessage}</Alert></Stack>
        : <>
          <h1>Account Page</h1>
          {isLoading ? <CircularProgress /> : accountView()}</>

      }

    </Stack >
  );
};

export default AccountPage;
