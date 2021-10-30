import React, { useState } from 'react';
import { Loader } from 'ui';
import { useStyles } from './styles';

import WhiteLogo from 'assets/images/logo-white.svg';
import MinecraftImage from 'assets/images/minecraft.png';

const HomePage = () => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const {
    homeContainer,
    logo,
    leftBgImage,
    rightBgImage,
    loginButton,
    glitchText,
  } = useStyles();

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
          Multiverse Bridge
     </span>

        <div style={{  }}>
            {!isLoading ? (
                <button className={loginButton} onClick={handleLoginWithMinecraft}>Login With Minecraft</button>
            ) : <Loader />}
        </div>


      <img src={MinecraftImage} className={leftBgImage} alt="" />
      <img src={MinecraftImage} className={rightBgImage} alt="" />
    </div>
  );
};

export default HomePage;
