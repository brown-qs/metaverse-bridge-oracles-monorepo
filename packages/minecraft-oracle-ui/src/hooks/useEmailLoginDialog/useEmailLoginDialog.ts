import { useContext } from 'react';
import { EmailLoginDialogContext } from '../../context/emailLoginDialog/emailLoginDialogContext/EmailLoginDialogContext';

export const useEmailLoginDialog = () => {
  const context = useContext(EmailLoginDialogContext);

  if (context === undefined) {
    throw new Error(
      'useEmailLoginDialog must be used within an EmailLoginContextController'
    );
  }
  return context;
};
