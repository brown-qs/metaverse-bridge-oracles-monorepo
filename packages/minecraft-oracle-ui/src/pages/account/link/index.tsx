import React, { useEffect, useState } from 'react';
import { Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, Button, CircularProgress, Stack, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { Link, Redirect, useParams } from 'react-router-dom'
import axios, { AxiosError } from 'axios';
const AccountLink = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")
  const authed = !!authData?.jwt
  const params = useParams<{ minecraftJwt: string }>();
  const minecraftJwt = params?.minecraftJwt

  useEffect(() => {
    if (authed) {
      const getAccount = async () => {
        setIsLoading(true)
        try {
          const result = await axios({
            method: 'patch',
            url: `${process.env.REACT_APP_BACKEND_API_URL}/account/link_minecraft`,
            headers: {
              "Authorization": `Bearer ${authData?.jwt}`,
              "Content-Type": "application/json"
            },
            data: {
              minecraftJwt
            }
          });

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

  if (!authed) {
    return <Redirect to={'/account/login'} />;
  }

  return (
    <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
      {failureMessage
        ? <Stack spacing={6} margin={2} alignItems='center' textAlign='center'><Alert severity="error" onClose={() => { }}>{failureMessage}</Alert></Stack>
        : <>
          <h1>Linking Minecraft Account</h1>
          {isLoading ? <CircularProgress /> : <Redirect to={'/account'} />}</>

      }

    </Stack >
  );
};

export default AccountLink;
