import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { styles as appStyles } from '../../app.styles';
import { useClasses } from 'hooks';
import { styles } from './NumberFieldWithMaxButton.styles';
import { FormControl, Input } from '@chakra-ui/react';

export const NumberFieldWithMaxButton = (props: any) => {
  const fieldType = props.type || 'number';
  const setMaxValue = props.setMaxValue;
  const value = props.value ?? undefined;
  const setValue = props.setValue;

  const { formMaxButton } = useClasses(appStyles);
  const { outlinedInput } = useClasses(styles);

  const _setMaxNumber = () => {
    setMaxValue?.();
  };

  const onChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <React.Fragment>
      <FormControl className={props.className} variant="outlined">
        <Input
          id={props.id}
          type={fieldType}
          className={outlinedInput}
          //inputProps={{ min: 0 }}
          onChange={onChange}
          /*endAdornment={
            <InputAdornment position="end">
              <Button
                className={formMaxButton}
                onClick={() => {
                  _setMaxNumber();
                }}
              >
                MAX
              </Button>
            </InputAdornment>
          }*/
          value={value}
        />
      </FormControl>
    </React.Fragment>
  );
};
