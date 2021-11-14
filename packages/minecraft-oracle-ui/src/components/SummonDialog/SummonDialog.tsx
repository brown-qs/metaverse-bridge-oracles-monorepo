import DateFnsUtils from '@date-io/date-fns';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  OutlinedInput,
  Switch,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import 'date-fns';
import { useActiveWeb3React, useSummonDialog } from 'hooks';
import { SuccessIcon } from 'icons';
import { useState } from 'react';
import { Button, Dialog } from 'ui';
import { appStyles } from '../../app.styles';
import { useStyles } from './SummonDialog.styles';
import { useSummonCallback } from 'hooks/multiverse/useSummon';
import { useActiveGame } from 'hooks/multiverse/useActiveGame';


export const SummonDialog = () => {
  const { isSummonDialogOpen, summonDialogData, setSummonDialogData, setSummonDialogOpen } = useSummonDialog();
  const [summonConfirmed, setSummonConfirmed] = useState<number>(0);
  const [summonSubmitted, setSummonSubmitted] = useState<boolean>(false);

  //const activeGame = useActiveGame()

  const {
    divider,
    infoContainer,
    button,
    //
    row,
    col,
    verticalDashedLine,
    formBox,
    formLabel,
    formValue,
    formValueTokenDetails,
    formValueGive,
    formValueGet,
    spaceOnLeft,
    fieldError,
    formButton,
    expand,
    expandOpen,
  } = appStyles();

  const [UIAdvancedSectionExpanded, setExpanded] = useState(false);

  const {
    dialogContainer,
    loadingContainer,
    successContainer,
    successIcon,
    inputContainer,
  } = useStyles();

  const { chainId, account } = useActiveWeb3React();

  const handleClose = (event: any, reason: string) => {
    if (reason === 'backdropClick') {
      return
    }
    setSummonDialogOpen(false);
    setSummonSubmitted(false)
    setSummonConfirmed(0);
  };

  const recipient = summonDialogData?.recipient ?? account ?? undefined

  const summonCallback = useSummonCallback()

  const renderBody = () => {

    {/*if(activeGame) {
      return (
        <div className={loadingContainer}>
          <div>
            <Typography>Sorry you cannot summon with the bridge during an ongoing game</Typography>
          </div>
        </div>
      );
    }*/}

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
            onClick={() => handleClose({}, "yada")}
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
              <Typography>Multiverse Bridge Oracle processing your request...</Typography>
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
                It seems you didn't have any metaverse resources to summon, or something went wrong. Try again later or contact support.
              </Typography>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Grid container spacing={1} justifyContent="center">
          <Grid item md={12} xs={12}>
            <Box className={formBox}>
              <Typography className="form-subheader">Summon all in-game resources from the metaverse into your address</Typography>
            </Box>
          </Grid>
        </Grid>

        <Button
            onClick={() => {
              setSummonSubmitted(true);
              (async () => {
                  const success = await summonCallback?.(recipient)
                  setSummonConfirmed(success ? 1 : 2)
              })()
            }}
            className={formButton}
            variant="contained"
            color="primary"
          >
            Summon
          </Button>
        <Button className={formButton} onClick={() => handleClose({}, "yada")} color="primary">
          Cancel
        </Button>
      </>
    );
  };
  return (
    <Dialog
      open={isSummonDialogOpen}
      onClose={handleClose}
      title={'MultiverseBridge: summon'}
      maxWidth="md"
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
