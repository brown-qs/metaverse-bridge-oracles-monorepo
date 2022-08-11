import { useContext } from 'react';
import { KiltLoginDialogContext } from '../../context/kiltLoginDialog/kiltLoginDialogContext/KiltLoginDialogContext';

export const useKiltLoginDialog = () => {
  const context = useContext(KiltLoginDialogContext);

  if (context === undefined) {
    throw new Error(
      'useKiltLoginDialog must be used within an KiltLoginContextController'
    );
  }
  return context;
};
