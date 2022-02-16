import { Theme } from '@mui/material';

export const styles = (theme: Theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
  },
  logo: {
    width: 180,
    height: 'auto',
    '& > img': {
      maxWidth: '100%',
      marginBottom: '-5px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '20px',
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: {
    margin: '0 20px',
    color: '#fff',
    textDecoration: 'none !important',
  },
  navItemDrawer: {
    margin: '20px',
    textDecoration: 'none !important',
    '> a': {
      textDecoration: 'none !important',
    },
  },
  inputContainer: {
    width: theme.spacing(32),
  },
  buttonContainer: {
    marginLeft: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },
  iconButton: {
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      left: '10px',
      top: '8px',
    },
  },
  eventStatusWrapper: {
    fontSize: '12px',
    alignItems: 'center',
    display: 'flex',
    cursor: 'default'
  },
  eventIconActive: {
    margin: '0 10px 0 0',
    color: '#12753A'
  },
  eventIconInactive: {
    margin: '0 10px 0 0',
    color: '#DB3B21'
  }
});
