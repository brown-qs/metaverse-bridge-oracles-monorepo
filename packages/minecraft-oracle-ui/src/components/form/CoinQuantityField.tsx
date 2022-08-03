import { Box, Button, FormControl, Input } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { styles } from './CoinQuantityField.styles';

export enum UNIT {
  ETHER = 1,
  WEI = 2,
}

export const CoinQuantityField = (props: any) => {
  const setUnit = props.setUnit;
  const value: string = props.value ?? undefined;
  const setValue = props.setValue;
  const setMaxValue = props.setMaxValue;
  const withMaxButton = props.withMaxButton ?? false;
  const unitOptions: [number, string][] = props.unitOptions ?? [[2, 'wei']];
  const unit: UNIT | undefined = props.unit ?? UNIT.WEI;

  const { formMaxButton } = useClasses(appStyles);
  const { outlinedInput, coinSelect } = useClasses(styles);

  const _setMaxNumber = () => {
    setMaxValue?.();
  };

  const onUnitChange = (event: any) => {
    setUnit?.(event.target.value);
  };

  const onValueChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <>
      <FormControl className={props.className} variant="outlined">
        <Input
          id={props.id}
          type="text"
          className={outlinedInput}
          //inputProps={{ min: 0 }}
          // onChange={(event: any) => inputToBigNum(event.target.value, setSendAmount)}
          onChange={onValueChange}
          value={value}
        /*endAdornment={
          withMaxButton ? (
            <Box position="end">
              <Button
                className={formMaxButton}
                onClick={() => {
                  _setMaxNumber();
                }}
              >
                MAX
              </Button>
            </Box>
          ) : (
            ''
          )
        }*/
        />
      </FormControl>
    </>
  );
};
