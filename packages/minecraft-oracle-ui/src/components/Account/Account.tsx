import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { Button } from 'ui';
import { HeaderBalance } from 'components/HeaderBalance/HeaderBalance';
import { UnsupportedChainIdError } from '@web3-react/core';
import { useAccountDialog, useActiveWeb3React, useAuth } from 'hooks';
import { truncateAddress } from 'utils';
import Identicon from 'components/Identicon/Identicon';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import { Activity, Key } from 'react-feather';
import { useMediaQuery } from 'beautiful-react-hooks';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletSharp';
import { styles as accountStyles } from './Account.styles';
import { useClasses } from 'hooks';

export const Account = () => {
  const [accountButton, setAccountButton] = useState<HTMLButtonElement | null>(null);
  const { account, error } = useActiveWeb3React();
  const { setAccountDialogOpen } = useAccountDialog();
  const hideAddress = useMediaQuery(`(max-width: 500px)`);

  const showError = error ? true : false;
  const errMessage =
    error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error';

  const { button, popoverListItem } = useClasses(accountStyles);

  const { authData, setAuthData } = useAuth()

  const handleAccountPopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountButton(event.currentTarget);
  };

  const handleAccountPopoverClose = () => {
    setAccountButton(null);
  };

  const handleLogout = () => {
    setAuthData({
      jwt: undefined,
      emailUser: undefined,
      userProfile: undefined
    })
  };

  const open = Boolean(accountButton);
  const id = open ? 'account-popover' : undefined;

  console.log({ authData })

  return (
    <>
      <Button
        className={button}
        size="medium"
        onClick={() => setAccountDialogOpen(true)}
      >
        {account && <HeaderBalance />}

        {showError ? (
          <Activity />
        ) : account ? (
          !hideAddress && (
            <div style={{ fontSize: 0, margin: '0 8px' }}>
              <Identicon />
            </div>
          )
        ) : (
          <div style={{ fontSize: 0, margin: '0 8px 0 0' }}>
            <AccountBalanceWalletIcon />
          </div>
        )}
        {showError ? (
          errMessage
        ) : account ? (
          hideAddress ? (
            <Identicon />
          ) : (
            truncateAddress(account)
          )
        ) : (
          'Connect Wallet'
        )}
      </Button>
      {!!authData && !!authData.emailUser &&
        (
          <>
            <Button
              className={button}
              size="medium"
              onClick={handleAccountPopoverClick}
            >
              <div style={{ fontSize: 0, margin: '0 8px' }}>
                <PersonSharpIcon />
              </div>
              {`${authData?.emailUser?.email}`}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={accountButton}
              onClose={handleAccountPopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <List dense sx={{ width: '150px', bgcolor: '#111' }}>
                <ListItem className={popoverListItem} disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    Logout
                  </ListItemButton>
                </ListItem>
              </List>
            </Popover>
          </>
        )}
    </>
  );
};
