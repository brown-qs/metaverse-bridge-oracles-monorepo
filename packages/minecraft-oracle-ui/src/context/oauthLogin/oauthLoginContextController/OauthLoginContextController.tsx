import React, { useState } from 'react';
import { OauthLoginContext } from '../oauthLoginContext/OauthLoginContext';
import { OauthDataType } from '../oauthLoginContext/OauthLoginContext.types';
import { OauthLoginContextControllerProps } from './OauthLoginContextController.types';

export const OauthLoginContextController = ({
  children,
}: OauthLoginContextControllerProps) => {
  const [oauthData, setOauthData] = useState<OauthDataType>(null);

  return (
    <OauthLoginContext.Provider
      value={{ oauthData, setOauthData }}
    >
      {children}
    </OauthLoginContext.Provider>
  );
};
