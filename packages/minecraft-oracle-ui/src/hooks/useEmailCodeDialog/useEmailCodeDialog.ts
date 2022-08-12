import { useContext } from 'react';
import { EmailCodeDialogContext } from '../../context/emailCodeDialog/emailCodeDialogContext/EmailCodeDialogContext';

export const useEmailCodeDialog = () => {
  const context = useContext(EmailCodeDialogContext);

  if (context === undefined) {
    throw new Error(
      'useEmailCodeDialog must be used within an EmailCodeContextController'
    );
  }
  return context;
};
