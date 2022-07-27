import { Box } from '@mui/material';
import React, { useState } from 'react';
import { OauthLoginContext } from '../oauthLoginContext/OauthLoginContext';
import { OauthDataType } from '../oauthLoginContext/OauthLoginContext.types';
import { OauthLoginContextControllerProps } from './OauthLoginContextController.types';

export const OauthLoginContextController = ({
  children,
}: OauthLoginContextControllerProps) => {
  const [oauthData, setOauthData] = useState<OauthDataType>(null);

  return (
    <>
      {!!oauthData && <Box sx={{ padding: "5px", fontFamily: "rubik", backgroundColor: "#c96d1d" }}>Authorizing <strong>{oauthData.appName}</strong></Box>}
      <OauthLoginContext.Provider
        value={{ oauthData, setOauthData }}
      >
        {children}
      </OauthLoginContext.Provider>
    </>
  );
};
