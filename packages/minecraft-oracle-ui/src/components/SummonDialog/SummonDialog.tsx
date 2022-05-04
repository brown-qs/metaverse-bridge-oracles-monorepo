import { Box, Select, Grid, Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { SortSharp } from '@mui/icons-material';
import 'date-fns';
import { useActiveWeb3React, useSummonDialog } from 'hooks';
import { SuccessIcon } from 'icons';
import { useState } from 'react';
import { Button, Dialog } from 'ui';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { styles } from './SummonDialog.styles';
import { useSummonCallback } from 'hooks/multiverse/useSummon';
import {
  DEFAULT_CHAIN,
  NETWORK_NAME,
  PERMISSIONED_CHAINS,
} from '../../constants';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';

export const SummonDialog = () => {
  const {
    isSummonDialogOpen,
    summonDialogData,
    setSummonDialogData,
    setSummonDialogOpen,
  } = useSummonDialog();
  const [summonConfirmed, setSummonConfirmed] = useState<number>(0);
  const [summonSubmitted, setSummonSubmitted] = useState<boolean>(false);
  const [selectedChainId, setSelectedChainId] = useState<number>(DEFAULT_CHAIN);

  const { button, formBox, formButton } = useClasses(appStyles);

  const {
    dialogContainer,
    loadingContainer,
    successContainer,
    successIcon,
    sortElement,
    alignSelfCenter
  } = useClasses(styles);

  const { account } = useActiveWeb3React();

  const handleClose = (event: any, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }
    setSummonDialogOpen(false);
    setSummonSubmitted(false);
    setSummonConfirmed(0);
  };

  const recipient =  account ?? summonDialogData?.recipient ?? undefined;

  const summonCallback = useSummonCallback();

  const renderBody = () => {
    if (summonSubmitted && summonConfirmed === 1) {
      return (
        <div className={successContainer}>
          <SuccessIcon className={successIcon} />
          <Typography>{`Summon request received!`}</Typography>
          <Typography color="textSecondary">
            {`Your summon request was acknowledged by the Oracle. Depending on the number of requests and Moonriver traffic the transaction can take a while. You can sit back and relax now. Check back later.`}
          </Typography>
          <Button
            className={button}
            onClick={() => handleClose({}, 'yada')}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </div>
      );
    }

    if (summonSubmitted && summonConfirmed === 0) {
      return (
        <>
          <div className={loadingContainer}>
            <CircularProgress />
            <div>
              <Typography>
                Multiverse Bridge Oracle processing your request...
              </Typography>
            </div>
          </div>
        </>
      );
    }

    if (summonSubmitted && summonConfirmed === 2) {
      return (
        <>
          <div className={loadingContainer}>
            <div>
              <Typography>Unsuccessful summon</Typography>
              <Typography color="textSecondary" variant="h5">
                It seems you didn't have any metaverse resources to summon, or
                something went wrong. Try again later or contact support.
              </Typography>
            </div>
          </div>
        </>
      );
    }

    return (
      <Stack spacing={1} justifyContent="center">
        <Stack className={formBox} spacing={2}>
          <Typography className="form-subheader">
            Mint all in-game resources from the metaverse into your connected
            on-chain wallet address:
          </Typography>
          <Box alignSelf={'center'}>
            <AddressDisplayComponent
              className={alignSelfCenter}
              charsShown={7}
              copyTooltipLabel='Copy address'
            >
              {recipient}
            </AddressDisplayComponent>
          </Box>
          <Typography alignSelf={'center'} className="form-subheader">
            Please select the network to summon to.
          </Typography>
          <Select
            className={sortElement}
            IconComponent={SortSharp}
            variant="outlined"
            color="primary"
            inputProps={{
              name: 'sort',
              id: 'uncontrolled-native',
            }}
            defaultValue={selectedChainId}
            onChange={(event: any) => {
              setSelectedChainId(event.target.value);
            }}
          >
            {PERMISSIONED_CHAINS.map((chain) => {
              return (
                <MenuItem value={chain}>{NETWORK_NAME[chain]}</MenuItem>
              );
            })}
          </Select>
        </Stack>

        <Button
          onClick={() => {
            setSelectedChainId(DEFAULT_CHAIN);
            setSummonSubmitted(true);
            (async () => {
              const success = await summonCallback?.(recipient, selectedChainId);
              setSummonConfirmed(success ? 1 : 2);
            })();
          }}
          className={formButton}
          variant="contained"
          color="primary"
          disabled={selectedChainId === 0}
        >
          Summon
        </Button>
        <Button
          className={formButton}
          onClick={() => {
            handleClose({}, 'yada');
            setSelectedChainId(0);
          }}
          color="primary"
        >
          Cancel
        </Button>
      </Stack>
    );
  };
  return (
    <Dialog
      open={isSummonDialogOpen}
      onClose={handleClose}
      title={'MultiverseBridge: summon'}
      maxWidth="sm"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
