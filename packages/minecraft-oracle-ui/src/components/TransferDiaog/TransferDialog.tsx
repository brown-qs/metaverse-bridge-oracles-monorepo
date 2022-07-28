import { BigNumber } from '@ethersproject/bignumber';
import { yupResolver } from '@hookform/resolvers/yup';
import { AssetLink } from 'components/AssetLink/AssetLink';
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import { NumberFieldWithMaxButton } from 'components/form/NumberFieldWithMaxButton';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React/useActiveWeb3React';
import { StringAssetType } from 'utils/subgraph';
import { parseEther, formatEther } from '@ethersproject/units';
import { useBalances } from 'hooks/useBalances/useBalances';
import {
  TransferState,
  useTransferCallback,
} from 'hooks/useTransferCallback/useTransferCallback';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSubmittedTransferTx } from 'state/transactions/hooks';
import { Dialog } from 'ui';
import { getExplorerLink } from 'utils';
import * as yup from 'yup';
import { styles as appStyles } from '../../app.styles';
import { ChainId } from '../../constants';
import { useTransferDialog } from '../../hooks/useTransferDialog/useTransferDialog';
import { useClasses } from 'hooks';
import { styles } from './TransferDialog.styles';
import { UNIT } from 'components/form/CoinQuantityField';
import { Fraction } from 'utils/Fraction';
import { Box, Button, CircularProgress, Divider, FormControl, Text } from '@chakra-ui/react';
import { CircleCheck } from 'tabler-icons-react';

const makeTransferFormDataSchema = (): yup.ObjectSchema<TransferFormData> =>
  yup
    .object({
      recipient: yup
        .string()
        .length(42, 'An address have 42 characters.')
        .isAddress('Expected a valid Ethereum address.')
        .required(),
    })
    .required();

// type TransferFormData = yup.TypeOf<
//   ReturnType<typeof makeTransferFormDataSchema>
// >;
type TransferFormData = {
  recipient: string;
};

export const TransferDialog = () => {
  const [finalTxSubmitted, setFinalTxSubmitted] = useState<boolean>(false);
  const { isTransferDialogOpen, setTransferDialogOpen, transferData } =
    useTransferDialog();
  const [orderLoaded, setOrderLoaded] = useState<boolean>(false);

  const [quantityText, setQuantityText] = useState<string | undefined>(
    undefined
  );

  let amountError: string | undefined;

  const {
    divider,
    infoContainer,
    button,
    formBox,
    formLabel,
    formValue,
    fieldError,
    formButton,
  } = useClasses(appStyles);

  const { dialogContainer, loadingContainer, successContainer, successIcon } =
    useClasses(styles);

  const { chainId } = useActiveWeb3React();

  const handleClose = () => {
    setTransferDialogOpen(false);
    setFinalTxSubmitted(false);
  };

  if (
    !orderLoaded &&
    transferData &&
    transferData.asset &&
    transferData.asset.assetAddress &&
    transferData.asset.assetType
  ) {
    setOrderLoaded(true);
  }

  const makeformDataSchema = () => { };
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    getValues,
  } = useForm<TransferFormData>({
    mode: 'onTouched',
    shouldUnregister: true,
    resolver: yupResolver(makeTransferFormDataSchema()),
  });

  const userBalance = useBalances([transferData?.asset])?.[0];

  const [quantityUnit, unitOptions] = useMemo(() => {
    return transferData?.asset?.assetType?.valueOf() ===
      StringAssetType.ERC20.valueOf()
      ? [UNIT.ETHER, [[1, 'in ether']]]
      : [UNIT.WEI, [[2, 'in units']]];
  }, [transferData?.asset?.assetType]);

  let quantity: BigNumber;
  let youhave: string | undefined;
  try {
    quantity = quantityText
      ? quantityUnit === UNIT.ETHER
        ? parseEther(quantityText)
        : BigNumber.from(quantityText)
      : BigNumber.from('0');
    amountError = undefined;
  } catch {
    quantity = BigNumber.from('0');
    amountError = 'Invalid quantity value';
  }

  youhave = userBalance
    ? quantityUnit === UNIT.ETHER
      ? Fraction.from(userBalance.toString(), 18)?.toFixed(5)
      : userBalance.toString()
    : '0';
  amountError = undefined;

  const { state: transferState, callback: transferCallback } =
    // TODO: useTransferCallback shouldn't repeat the same validation already performed by the form.
    useTransferCallback({
      amount: quantity,
      to: getValues('recipient') ?? '',
      asset: transferData?.asset,
    });

  const { transferSubmitted, transferTx } = useSubmittedTransferTx(
    transferData?.asset,
    quantity
  );

  /*
  console.warn('transferdialog', {
    finalTxSubmitted,
    transferSubmitted,
    transferTx,
  });
  */

  const renderBody = () => {
    if (!orderLoaded) {
      return (
        <div className={loadingContainer}>
          <CircularProgress />
          <div>
            <Text>Loading asset details</Text>
            <Text color="textSecondary" variant="h5">
              Should be a jiffy
            </Text>
          </div>
        </div>
      );
    }
    if (finalTxSubmitted && !transferSubmitted) {
      return (
        <>
          <div className={loadingContainer}>
            <CircularProgress />
            <div>
              <Text>Placing transfer transaction...</Text>
              <Text color="textSecondary" variant="h5">
                Check your wallet for potential action
              </Text>
            </div>
          </div>
        </>
      );
    }
    if (finalTxSubmitted && transferSubmitted) {
      return (
        <div className={successContainer}>
          <CircleCheck className={successIcon} />
          <Text>Transfer submitted</Text>
          <Text color="primary">
            {transferData?.asset.assetAddress}
          </Text>
          <Text color="primary">{transferData?.asset.assetId}</Text>
          <Text color="primary">
            {transferData?.asset.assetType}
          </Text>

          {transferTx && (
            <ExternalLink
              href={getExplorerLink(
                chainId ?? ChainId.MOONRIVER,
                transferTx.hash,
                'transaction'
              )}
            >
              {transferTx.hash}
            </ExternalLink>
          )}
          <Button
            className={button}
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </div>
      );
    }

    return (
      <>
        <form>
          <Box className={formBox}>
            <div className={infoContainer}>
              <Text className={formLabel}>Type</Text>
              <Text className={formValue}>
                {transferData?.asset?.assetType ?? '?'}
              </Text>
            </div>

            <div className={infoContainer}>
              <Text className={formLabel}>Address</Text>
              <AddressDisplayComponent className={formValue} charsShown={10} copyTooltipLabel={'Copy address'}>
                {transferData?.asset?.assetAddress ?? '?'}
              </AddressDisplayComponent>
            </div>

            {transferData?.asset?.assetType?.valueOf() !==
              StringAssetType.ERC20 && (
                <div className={infoContainer}>
                  <Text className={formLabel}>ID</Text>
                  <AssetLink href="#" asset={transferData?.asset}>
                    <Text className={formValue}>
                      {transferData?.asset?.assetId ?? '?'}
                    </Text>
                  </AssetLink>
                </div>
              )}

            <Divider variant="fullWidth" className={divider} />

            <div className={infoContainer}>
              <Text className={formLabel}>You have</Text>
              <Text className={formValue}>
                {youhave?.toString() ?? '0'}
              </Text>
            </div>

            <div className={infoContainer}>
              <Text className={formLabel}>You send</Text>

              <NumberFieldWithMaxButton
                id="send-amount"
                type="number"
                label="Amount"
                setMaxValue={() => {
                  setQuantityText(
                    quantityUnit?.valueOf() === UNIT.ETHER
                      ? formatEther(userBalance?.toString() ?? '0')
                      : userBalance?.toString()
                  );
                }}
                className={formValue}
                value={quantityText}
                setValue={setQuantityText}
              />
            </div>
            {amountError && <div className={fieldError}>{amountError}</div>}

            <div className={infoContainer}>
              <Text className={formLabel}>Recipient</Text>
              <FormControl className={formValue} variant="outlined">
                {/*    <Controller
                  control={control}
                  name="recipient"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <OutlinedInput
                    id="recipient"
                    type="text"
                    // onChange={(event: any) => setTo(event.target.value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'0x0...'}
                  />
                )}
                  />*/}

              </FormControl>
            </div>
            <div className={fieldError}>{errors.recipient?.message}</div>
          </Box>

          <Button
            onClick={() => {
              transferCallback?.();
              setFinalTxSubmitted(true);
            }}
            className={formButton}
            variant="contained"
            color="primary"
            disabled={transferState !== TransferState.VALID}
          >
            Transfer
          </Button>
          <Button
            className={formButton}
            onClick={handleClose}
            color="secondary"
          >
            Cancel
          </Button>
        </form>
      </>
    );
  };
  return (
    <Dialog
      open={isTransferDialogOpen}
      onClose={handleClose}
      title={'Transfer asset'}
    >
      <div className={dialogContainer}>{renderBody()}</div>
    </Dialog>
  );
};
