import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { Discord, Telegram, Twitter } from 'icons';
import { useClasses } from 'hooks';
import { styles } from './Footer.styles';
import { Typography } from '@mui/material';

export const Footer = () => {
  const { footerWrapper, iconsWrapper, copyrightText, icon } = useClasses(styles);
  return (
    <Container maxWidth={false}>
      <div className={footerWrapper}>
        <Typography variant="h6">Join the community</Typography>

        <div className={iconsWrapper}>
          <a href="https://twitter.com/moonsamaNFT" target="_blank">
            <Twitter className={icon} />
          </a>
          <a href="https://t.me/moonsamaNFT" target="_blank">
            <Telegram className={icon} />
          </a>
          {/*<a href="#" target="_blank"><Discord className={icon} /></a>*/}
        </div>

        <Typography align="center" className={copyrightText}>
          &copy; 2021 Moonsama
        </Typography>
      </div>
    </Container>
  );
};
