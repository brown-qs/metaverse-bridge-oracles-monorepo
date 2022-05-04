import { Theme } from '@mui/material';

export const styles = (theme: Theme) => ({
  dialogContainer: {
    display: 'flex',
    padding: theme.spacing(4),
    flexDirection: 'column',
    // minWidth: 500,
  },
  nakedInput: {
    border: 0,
    background: 'transparent',
    padding: 0,
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    color: 'white',
    textAlign: 'right',
    outline: 'none',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIcon: {
    width: '30%',
    height: 'auto',
    marginBottom: theme.spacing(2),
  },
  sortElement: {
    background: '#000 !important',
    color: '#fff !important',
    border: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[900],
    maxHeight: 'auto',
    alignSelf: 'center'
  },
  alignSelfCenter: {
    alignSelf: 'center'
  }
});
