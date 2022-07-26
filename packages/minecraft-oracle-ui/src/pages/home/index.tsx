import React, { useState } from 'react';
import { Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { styles } from './styles';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minecraftWarningOpen, setMinecraftWarningOpen] = React.useState(false);
  const { authData } = useAuth();
  let history = useHistory();

  const {
    homeContainer,
    logo,
    leftBgImage,
    rightBgImage,
    glitchText,
    loginButtonStyleV2,
    centerBgImage
  } = useClasses(styles);

  const handleLogin = () => {
    history.push("/account/login")
  };

  const handleLinkMinecraft = () => {
    history.push("/account")
  }

  const isMobileViewport = useMediaQuery(theme.breakpoints.down('sm'));



  return (

    <Stack direction="column" className={homeContainer} alignItems='center' textAlign='center' style={{ height: `calc(100vh - ${isMobileViewport ? '58px' : '80px'})` }}>

      <Stack direction={'column'} justifyContent='center' alignItems='center' spacing={3}>
        <div className={logo}>
          <img src={WhiteLogo} alt="" />
        </div>
        <Typography className={glitchText} fontSize={isMobileViewport ? '20px' : '50px'} fontFamily={'Orbitron'}>MULTIVERSE BRIDGE</Typography>
        <Button onClick={() => { handleLogin() }} sx={{ zIndex: 100 }} disableElevation disableRipple variant="contained">LOGIN</Button>

      </Stack>

      {!isMobileViewport && <img src={LeftImage} className={leftBgImage} alt="" />}
      {!isMobileViewport && <img src={RightImageFlip} className={rightBgImage} alt="" />}
      {isMobileViewport && <img src={LeftImage} className={centerBgImage} alt="" />}
    </Stack >
  );
};

export default HomePage;
