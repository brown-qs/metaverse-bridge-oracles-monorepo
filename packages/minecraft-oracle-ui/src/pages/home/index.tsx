import { Button } from 'ui';
import { Typography } from '@material-ui/core';
import { GlitchText, NavLink } from 'ui';
import { useStyles } from './styles';

import WhiteLogo from 'assets/images/logo-white.svg';
import MinecraftImage from 'assets/images/minecraft.png';

const HomePage = () => {
  const {
    homeContainer,
    logo,
    leftBgImage,
    rightBgImage,
    loginButton,
    glitchText,
  } = useStyles();

  const handleLoginWithMinecraft = () => {
      fetch('http://localhost:3030/api/v1/auth/login').then(response => console.log(response));
  };

  return (
    <div className={homeContainer}>
     <div className={logo}>
        <img src={WhiteLogo} alt="" />
     </div>
     <span className={glitchText}>
          Minecraft Metaverse
     </span>
        
      <button className={loginButton} onClick={handleLoginWithMinecraft}>Login With Minecraft</button>

      <img src={MinecraftImage} className={leftBgImage} alt="" />
      <img src={MinecraftImage} className={rightBgImage} alt="" />
    </div>
  );
};

export default HomePage;
