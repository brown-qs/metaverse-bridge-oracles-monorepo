import React, { useState } from 'react';
import { Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Avatar, Button, Card, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Redirect } from 'react-router-dom';

const AccountPage = () => {
  const { authData, setAuthData } = useAuth();
  console.log("authData: " + authData)
  const notAuthed = !!authData?.jwt
  if (!notAuthed) {
    return <Redirect to={'/account/login'} />;
  }
  return (
    <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
      <h1>Account Page</h1>
      <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} variant="contained">Link Minecraft Account</Button>
      <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} variant="contained">Logout</Button>
    </Stack >
  );
};

export default AccountPage;
