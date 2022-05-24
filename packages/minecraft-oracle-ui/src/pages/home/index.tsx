import React, { useState } from 'react';
import { Loader } from 'ui';
import { useClasses } from 'hooks';
import { styles } from './styles';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/logo-white.svg';
import MinecraftImage from 'assets/images/minecraft-splash-alpa.png';
import MinecraftImageFlip from 'assets/images/minecraft-splash-alpha-flip.png';

const HomePage = () => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const {
    homeContainer,
    logo,
    leftBgImage,
    rightBgImage,
    loginButton,
    glitchText,
  } = useClasses(styles);

  const handleLoginWithMinecraft = () => {
      setIsLoading(true);

      window.location.href = `${process.env.REACT_APP_BACKEND_API_URL}/auth/login`;
  };

  return (
    <div className={homeContainer}>
     <div className={logo}>
        <img src={WhiteLogo} alt="" />
     </div>
     <span className={glitchText}>
          Multiverse Bridge
     </span>

        <div style={{  }}>
            {!isLoading ? (
                <Tooltip title={`Login with your Microsoft Minecraft account. If you are still on Mojang please migrate first.`}>
                  <button className={loginButton} onClick={handleLoginWithMinecraft}>Login with Minecraft</button>
                </Tooltip>
            ) : <Loader />}
        </div>


      <img src={MinecraftImage} className={leftBgImage} alt="" />
      <img src={MinecraftImageFlip} className={rightBgImage} alt="" />
    </div>
  );
};

export default HomePage;
