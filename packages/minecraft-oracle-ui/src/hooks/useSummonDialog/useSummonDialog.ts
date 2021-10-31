import { useContext } from 'react';
import { SummonDialogContext } from 'context/summonDialog/summonDialogContext/SummonDialogContext';

export const useSummonDialog = () => {
  const context = useContext(SummonDialogContext);

  if (context === undefined) {
    throw new Error(
      'useSummonDialog must be used within an SummonDialogContextController'
    );
  }
  return context;
};
