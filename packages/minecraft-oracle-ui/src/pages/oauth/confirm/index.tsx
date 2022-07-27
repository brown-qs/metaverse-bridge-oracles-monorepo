import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';
import { useHistory, useLocation } from 'react-router-dom';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, AlertColor, Avatar, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { Edit, SportsEsports, ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Redirect } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useOauthLogin } from '../../../hooks/useOauthLogin/useOauthLogin';
const OauthConfirmPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  let history = useHistory();
  const { search } = useLocation()
  const { oauthData, setOauthData } = useOauthLogin()


  const getOauthCode = async () => {
    setIsLoading(true)
    try {
      console.log(oauthData?.params)
      if (!(oauthData?.params instanceof URLSearchParams)) {
        throw new Error("Oauth params invalid. Please start over.")
      }
      console.log(Object.fromEntries(oauthData.params))
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/oauth2/authorize`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
        params: Object.fromEntries(oauthData?.params)
      });
      setOauthData(null)
      window.location.href = result.data.url
      //window.location.href continue to execute code until the page loads, put return statement
      return
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
    }
    setIsLoading(false)
  }

  useEffect(() => {
    //   getOauthCode()
  }, [])

  const handleAlertClose = () => {
    setFailureMessage("")
    getOauthCode()
  }

  const declineOauth = () => {
    setOauthData(null)
    history.push("/account")
  }

  const acceptOauth = () => {
    getOauthCode()
  }

  let alert
  let alertClose
  if (!oauthData?.appName) {
    alertClose = undefined
    alert = { severity: "error", text: "Oauth session is gone, please start over from app" }
  } else if (failureMessage) {
    alertClose = handleAlertClose
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="AUTHORIZE APP" loading={isLoading} alert={alert} handleAlertClose={alertClose}>
      <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
        <h3>{oauthData?.appName} is requesting access to:</h3>
        {oauthData?.scopes.map(scope => {
          return <div>{scope.prettyScope}</div>
        })}
        <Button disabled={isLoading} disableElevation disableRipple style={{ marginTop: "10px", maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { acceptOauth() }} variant="contained">ACCEPT</Button>
        <Button disabled={isLoading} disableElevation disableRipple style={{ marginTop: "10px", maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { declineOauth() }} variant="contained">DECLINE</Button>
      </Stack>
    </AuthLayout >
  );
}
export default OauthConfirmPage;
