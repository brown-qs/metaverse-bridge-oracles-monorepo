import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, Button, CircularProgress, Collapse, IconButton, Input, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

const EmailVerifyPage = () => {
  const [failureMessage, setFailureMessage] = useState("")
  let history = useHistory();
  const params = useParams<{ loginKey: string }>();
  const loginKey = params?.loginKey

  useEffect(() => {
    const verifyLoginKey = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      try {
        const response = await axios({
          method: 'get',
          url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/email/verify?loginKey=${loginKey}`,
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: () => true
        });
        if (response?.data?.success) {
          const jwt = response.data.jwt
          history.push(`/auth/${jwt}`)
        } else {
          const msg = response?.data?.message
          if (msg) {
            setFailureMessage(`Failed to log you in: ${msg}. Please try again.`)

          } else {
            setFailureMessage("Failed to log you in. Please try again.")
          }
        }
      } catch (e) {
        setFailureMessage(`Failed to log you in: ${e}. Please try again.`)
      }
    }

    verifyLoginKey()
  }, [])


  const handleAlertClose = () => {
    history.push('/account/login/email')
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <AuthLayout title="VERIFYING LINK..." loading={!failureMessage} alert={alert} handleAlertClose={handleAlertClose}> </AuthLayout >
  );
};

export default EmailVerifyPage;
