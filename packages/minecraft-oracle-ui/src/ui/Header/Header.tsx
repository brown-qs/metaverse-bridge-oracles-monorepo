import { useCallback, useState } from 'react';
import { useMediaQuery } from 'beautiful-react-hooks';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styles as headerStyles } from './Header.styles';
import { useClasses } from 'hooks';
import { NavLink, Drawer } from 'ui';
import { useActiveGame } from 'hooks/multiverse/useActiveGame';
import MenuIcon from '@mui/icons-material/Menu';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import VideogameAssetOffIcon from '@mui/icons-material/VideogameAssetOff';
import IconButton from '@mui/material/IconButton';

import WhiteLogo from 'assets/images/logo-white.svg';
import { Account } from 'components';
import { MAX_WIDTH_TO_SHOW_NAVIGATION } from '../../constants';

export const Header = () => {
  const isGameActive = useActiveGame();
  const { appBar, logo, nav, navItem, buttonContainer, navItemDrawer, eventStatusWrapper, eventIconActive, eventIconInactive } = useClasses(headerStyles);

  const showRegularMenu = useMediaQuery(
      `(max-width: ${MAX_WIDTH_TO_SHOW_NAVIGATION}px)`
  );

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  return (
    <>
      <AppBar className={appBar} elevation={0}>
        <Toolbar>
            <Container maxWidth={false}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xl={3} className={nav}>
                        {showRegularMenu && (
                            <IconButton onClick={() => setIsDrawerOpened(true)}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <NavLink href="/" className={navItem}>
                            <div className={logo}>
                                <img src={WhiteLogo} alt="" />
                            </div>
                        </NavLink>
                    </Grid>
                    <Grid item className={buttonContainer}>
                        {!showRegularMenu ? (
                            <Box style={{ display: 'flex ' }}>
                                <a href="https://moonsama.com" className={navItem}>
                                    Visit Marketplace
                                </a> |
                            </Box>
                        ) : (
                            <Drawer
                                open={isDrawerOpened}
                                onClose={() => setIsDrawerOpened(false)}
                                onOpen={() => setIsDrawerOpened(true)}
                            >
                                <Box>
                                    <a href="https://moonsama.com" className={navItemDrawer}>
                                        Visit Marketplace
                                    </a> |
                                </Box>
                            </Drawer>
                        )}

                        <div className={eventStatusWrapper}>
                            {isGameActive ? (
                                <>
                                    <VideogameAssetIcon className={eventIconActive} /> Carnage ongoing
                                </>
                            ) : (
                                <>
                                    <VideogameAssetOffIcon className={eventIconInactive} />  No carnage going on
                                </>
                            )}
                        </div>

                        <Account />
                    </Grid>
                </Grid>
            </Container>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
