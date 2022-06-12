import React, { useState } from 'react';
import { Loader } from 'ui';
import { useClasses } from 'hooks';
import { styles } from './styles';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Stack, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import KiltAccount from 'ui/Navigation/KiltAccount';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    homeContainer,
    logo,
    leftBgImage,
    rightBgImage,
    glitchText,
    loginButtonStyleV2,
    centerBgImage
  } = useClasses(styles);

  const handleLoginWithMinecraft = () => {
    setIsLoading(true);

    window.location.href = `${process.env.REACT_APP_BACKEND_API_URL}/auth/login`;
  };

  const isMobileViewport = useMediaQuery(theme.breakpoints.down('sm'));



  return (
    <Stack direction="column" className={homeContainer} alignItems='center' textAlign='center' style={{ height: `calc(100vh - ${isMobileViewport ? '58px' : '80px'})` }}>

      <Stack direction={'column'} justifyContent='center' alignItems='center' spacing={3}>
        <div className={logo}>
          <img src={WhiteLogo} alt="" />
        </div>
        <Typography className={glitchText} fontSize={isMobileViewport ? '20px' : '50px'} fontFamily={'Orbitron'}>MULTIVERSE BRIDGE</Typography>
        <KiltAccount></KiltAccount>
        {!isLoading ? (
          <Tooltip title={`Login with your Microsoft Minecraft account. If you are still on Mojang please migrate first.`}>
            <Box onClick={handleLoginWithMinecraft} className={loginButtonStyleV2}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EEBA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Login with Minecraft</span>
            </Box>
          </Tooltip>
        ) : <Loader />}
      </Stack>

      {!isMobileViewport && <img src={LeftImage} className={leftBgImage} alt="" />}
      {!isMobileViewport && <img src={RightImageFlip} className={rightBgImage} alt="" />}
      {isMobileViewport && <img src={LeftImage} className={centerBgImage} alt="" />}
    </Stack>
  );
};

export default HomePage;
