import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';

import { Link, Alert, Button, CircularProgress, Collapse, IconButton, Input, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const MinecraftRedirectPage = () => {
  const { authData, setAuthData } = useAuth();
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [failureMessage, setFailureMessage] = useState("")

  const minecraftRedirect = async () => {
    setIsLoading(true)
    try {
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/minecraft/login`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        }
      });

      window.location = result?.data?.redirectUrl
      //    history.push('/account/login/email/verify')

    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        window.localStorage.removeItem('authData');
        setAuthData(undefined);
      } else if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }

      setIsLoading(false)
    }

  }


  useEffect(() => {
    minecraftRedirect()
  }, [])



  const handleAlertClose = () => {
    history.push(`/account`)
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <AuthLayout title="MINECRAFT LINK" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}>

    </AuthLayout >
  );
};

export default MinecraftRedirectPage;
