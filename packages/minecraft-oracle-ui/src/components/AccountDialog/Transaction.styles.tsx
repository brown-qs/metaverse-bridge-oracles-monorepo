

type Props = {
  success?: boolean;
  pending?: boolean;
};

export const styles = (theme: any) => ({
  dialogContainer: {
    display: 'flex',
    padding: 32,
    flexDirection: 'column',
  },
  button: {
    marginTop: '8px',
  },
  row: {
    marginTop: '20px',
  },
  transactionState: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none !important',
    borderRadius: '0.5rem',
    padding: '0.25rem 0rem',
    fontWeight: 500,
    fontSize: '0.825rem',
    //  color: theme.palette.text.primary,
  },
  iconWrapperText: {
    // color: theme.palette.text.primary
  },
  iconWrapperSuccess: {
    //  color: theme.palette.success.main
  },
  iconWrapperError: {
    //   color: theme.palette.error.main
  },
});
