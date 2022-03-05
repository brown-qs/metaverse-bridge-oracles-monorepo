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
      /*
      axios.get('http://localhost:3030/api/v1/auth/login', {headers: {"Access-Control-Allow-Origin": "*"}})
          .then(response => {
              console.log('Logged In');
              console.log(response)
              setIsLoading(false);
          })
          .catch(error => {
              console.log('Error Logging in: ', error);
              setIsLoading(false);
          });
          */
  };

  return (
    <div className={homeContainer}>
     <div className={logo}>
        <img src={WhiteLogo} alt="" />
     </div>
     <span className={glitchText}>
          Multiverse Bridge: Minecraft
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
