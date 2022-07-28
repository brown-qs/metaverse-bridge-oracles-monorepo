import React, { useState } from 'react';
import { HeaderBalance } from 'components/HeaderBalance/HeaderBalance';
import { UnsupportedChainIdError } from '@web3-react/core';
import { useAccountDialog, useActiveWeb3React, useAuth } from 'hooks';
import { truncateAddress } from 'utils';
import Identicon from 'components/Identicon/Identicon';
import { Activity } from 'react-feather';
import { useMediaQuery } from 'beautiful-react-hooks';
import { styles as accountStyles } from './Account.styles';
import { useClasses } from 'hooks';
import { User, Wallet } from 'tabler-icons-react';
import { Box, Button, List, ListItem, Popover } from '@chakra-ui/react';

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
            <Wallet />
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
      {!!authData && !!authData.userProfile &&
        (
          <>
            <Button
              className={button}
              size="medium"
              onClick={handleAccountPopoverClick}
            >
              <div style={{ fontSize: 0, margin: '0 8px' }}>
                <User />
              </div>
              {`${authData?.userProfile?.email}`}
            </Button>
            <Popover
              id={id}
              isOpen={open}
            /*anchorEl={accountButton}
            onClose={handleAccountPopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}*/
            >
              <List sx={{ width: '150px', bgcolor: '#111' }}>
                <ListItem className={popoverListItem}>
                  <Box onClick={handleLogout}>
                    Logout
                  </Box>
                </ListItem>
              </List>
            </Popover>
          </>
        )}
    </>
  );
};
