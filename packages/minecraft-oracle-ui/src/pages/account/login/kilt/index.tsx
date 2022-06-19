import React, { useState } from 'react';
import { Loader } from 'ui';
import { useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import KiltAccount from 'ui/Navigation/KiltAccount';

const KiltLoginPage = () => {

  return (
    <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
      <h1>Kilt Login</h1>
      <KiltAccount></KiltAccount>
    </Stack >
  );
};

export default KiltLoginPage;
