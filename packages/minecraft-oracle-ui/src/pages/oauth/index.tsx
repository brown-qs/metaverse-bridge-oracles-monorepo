import React, { useContext, useEffect, useState } from 'react';
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
import { useOauthLogin } from '../../hooks/useOauthLogin/useOauthLogin';
const OauthPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")
  let history = useHistory();
  const { search } = useLocation()
  const { oauthData, setOauthData } = useOauthLogin()

  const getOauthCode = async () => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams(search)
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/oauth2/client/${searchParams.get("client_id")}/public`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        }
      });
      setOauthData({ ...result.data, params: searchParams })
      history.push("oauth/confirm")
    } catch (e) {
      const err = e as AxiosError;

      if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }
      //null out any oauth data if request fails
      setOauthData(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getOauthCode()
  }, [])


  const handleAlertClose = () => {
    setFailureMessage("")
    getOauthCode()
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="OAUTH" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}> </AuthLayout >
  );
}
export default OauthPage;
