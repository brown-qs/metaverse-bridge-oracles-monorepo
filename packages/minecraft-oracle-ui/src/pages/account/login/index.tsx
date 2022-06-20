import React, { useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { Link } from 'react-router-dom'
const LoginPage = () => {
  return (
    <AuthLayout title="Login Method" loading={false} >
      <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
        <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} variant="contained" component={Link} to="/account/login/email">Email Login</Button>
        <Button disableRipple style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} variant="contained" component={Link} to="/account/login/kilt">KILT Login</Button>
      </Stack >
    </AuthLayout>)
};

export default LoginPage;
