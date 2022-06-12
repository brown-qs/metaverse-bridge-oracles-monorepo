import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack/Stack';
import { MAX_WIDTH_TO_SHOW_NAVIGATION } from '../../constants';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Drawer } from 'ui';
import Box from '@mui/material/Box';
import CarnageStatus from './CarnageStatus';
import ConnectedNetwork from './ConnectedNetwork';
import WalletAccount from './WalletAccount';
import ServerAccount from './ServerAccount';
import NavMenuItem from './NavMenuItem';
import { styles } from './MoonsamaNav.styles'
import { useClasses } from 'hooks';
import KiltAccount from './KiltAccount';

export default function MoonsamaNav() {
  const theme = useTheme();
  //const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const showRegularMenu = useMediaQuery(
    `(max-width: 1293px)`
  );

  const collapseLogo = useMediaQuery(
    `(max-width: 1440px)`
  );
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const {
    menuNavItemRegular,
    menuNavItemDrawer
  } = useClasses(styles)


  return (
    <AppBar sx={{ backgroundColor: '#1B1B3A', boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)' }} position="static">
      <Toolbar sx={{ position: 'relative' }}>
        <Container maxWidth={false} style={{ paddingLeft: 0, paddingRight: 0 }} sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
          <Stack direction='row' alignItems="center" justifyContent="space-between">
            <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
              {collapseLogo ? (
                <svg width="67" height="32" viewBox="0 0 267 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.124 24.677v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm76.621 60.221-11.526 17.551h23.196l-11.67-17.55Zm0 0-11.526 17.551h23.196l-11.67-17.55ZM89.124 24.677v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-50.793 60.2L85.649 102.45h23.196l-11.67-17.572Zm-8.051-60.2v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm76.621 60.221-11.526 17.551h23.196l-11.67-17.55Zm0 0-11.526 17.551h23.196l-11.67-17.55ZM89.124 24.677v23.998h28.471V24.677H89.124Zm8.05 60.17L85.65 102.449h23.196l-11.67-17.602Zm50.794-60.17v23.957h28.47V24.677h-28.47ZM0 0v128h266.755V0H0Zm134.837 12.338h54.731V60.91h-54.731V12.338Zm-122.499 0h9.799l19.947 20.934 20.009-20.934h9.788v48.644H58.69V34.866l-16.605 17.48-16.667-17.48v26.116H12.338V12.338Zm50.999 103.375h-51.41v-12.708h38.29v-3.548l-37.879-5.624V67.162H63.06V79.5H25.417v3.959l37.92 5.552v26.702Zm63.748 0H67.45v-9.521l25.838-39.236h7.917l25.839 39.236.041 9.521Zm3.681-54.741H75.994V12.421h54.731l.041 48.551Zm60.026 54.741h-13.233V89.597l-16.605 17.479-16.667-17.48v26.117h-13.13V67.028h9.798l19.999 20.975 20.008-20.975h9.789l.041 48.685Zm2.93-103.457h10.005l29.869 27.926V12.256h13.119v48.757h-9.994l-29.869-27.761v27.761h-13.171l.041-48.757Zm60.777 103.457h-59.635v-9.521l25.838-39.236h7.917l25.839 39.236.041 9.521Zm-41.395-13.264H236.3l-11.711-17.572-11.485 17.572Zm-65.136-53.836h28.47V24.677h-28.47v23.936Zm-30.373-23.936H89.124v23.998h28.471V24.677Zm30.373 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm135.465 60.2-11.526 17.572h23.196l-11.67-17.572Zm-76.621-60.2v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm58.844 0v23.957h28.47V24.677h-28.47Zm-58.844 0v23.998h28.471V24.677H89.124Zm0 0v23.998h28.471V24.677H89.124Zm0 0v23.998h28.471V24.677H89.124Z" fill="#fff" /></svg>
              ) : (
                <svg width="232" height="23" viewBox="0 0 474 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path d="M29.334 20.72 9.647.07H0V48h12.926V22.29l16.408 17.167 16.338-17.168V48h12.997V.07h-9.647L29.334 20.72ZM62.758 48h53.881V.202h-53.88V48Zm12.886-35.691h28.029v23.585H75.644V12.309ZM120.648 48h53.881V.202h-53.881V48Zm12.967-35.691h28.028v23.585h-28.028V12.309Zm84.207 15.183L188.427 0h-9.849v48h12.926V20.65L220.899 48h9.849V0h-12.926v27.492Zm30.306-15.183h37.068V.202h-49.984V26.46l37.331 5.537v3.492h-37.746V48h50.672V21.672l-37.341-5.466v-3.897ZM314.956 0l-25.458 38.637V48h58.709v-9.363L322.75 0h-7.794Zm-7.531 34.942 11.357-17.299 11.489 17.3h-22.846Zm74.136-14.222L361.873.07h-9.637V48h12.916V22.29l16.409 17.167 16.347-17.168V48h12.987V.07h-9.636l-19.698 20.65ZM448.175 0h-7.794l-25.437 38.637V48h58.709v-9.363L448.175 0ZM432.86 34.942l11.358-17.299 11.478 17.3H432.86Z" fill="#fff" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h473.613v48H0z" /></clipPath></defs></svg>
              )}
            </div>

            <Stack direction='row' justifyContent='flex-end'>
              {!showRegularMenu ? (
                <Stack direction={'row'} onClick={() => setIsDrawerOpened(false)}>
                  <div className={menuNavItemRegular}><NavMenuItem href={'/bridge'} label={`Bridge`} /></div>
                  <div className={menuNavItemRegular}><NavMenuItem href={'/moonsama/customizer'} label={`Customizer`} /></div>
                  <div className={menuNavItemRegular}><NavMenuItem href={'https://marketplace.moonsama.com'} label={`Marketplace`} external={true} /></div>
                  <div className={menuNavItemRegular}><NavMenuItem href={'https://wiki.moonsama.com'} label={`Docs`} external={true} /></div>
                  <div className={menuNavItemRegular}><KiltAccount /></div>
                  <div className={menuNavItemRegular}><CarnageStatus /></div>
                  <div className={menuNavItemRegular}><ConnectedNetwork /></div>
                  <div className={menuNavItemRegular}><WalletAccount /></div>
                  <div className={menuNavItemRegular}><ServerAccount /></div>
                </Stack>
              ) : (
                <Stack direction='row' alignItems="center" justifyContent="space-between">
                  <div className={menuNavItemRegular}><WalletAccount /></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{ flexShrink: 0 }} fill="none" stroke="#66C8FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" onClick={() => setIsDrawerOpened(true)}>
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M4 6L20 6"></path>
                    <path d="M4 12L20 12"></path>
                    <path d="M4 18L20 18"></path>
                  </svg>
                  <Drawer
                    open={isDrawerOpened}
                    PaperProps={{
                      sx: {
                        backgroundColor: 'rgb(27, 27, 58)'
                      }
                    }}
                    onClose={() => setIsDrawerOpened(false)}
                    onOpen={() => setIsDrawerOpened(true)}
                    onClick={() => setIsDrawerOpened(false)}>
                    <Box>
                      <div className={menuNavItemDrawer}><NavMenuItem href={'/bridge'} label={`Bridge`} /></div>
                      <div className={menuNavItemDrawer}><NavMenuItem href={'/moonsama/customizer'} label={`Customizer`} /></div>
                      <div className={menuNavItemDrawer}><NavMenuItem href={'https://marketplace.moonsama.com'} label={`Marketplace`} external={true} /></div>
                      <div className={menuNavItemDrawer}><NavMenuItem href={'https://wiki.moonsama.com'} label={`Docs`} external={true} /></div>
                      <div className={menuNavItemDrawer}><KiltAccount /></div>
                      <div className={menuNavItemDrawer}><CarnageStatus /></div>
                      <div className={menuNavItemDrawer}><ConnectedNetwork /></div>
                      <div className={menuNavItemDrawer}><ServerAccount /></div>
                    </Box>
                  </Drawer>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  )
}