import { Theme } from '@mui/material';

export const styles = (theme: Theme) => ({
  homeContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  logo: {
    width: 300,
    maxWidth: '90%',
    height: 'auto',
    margin: '150px 0 0 0',
    '& > img': {
      maxWidth: '100%',
      marginBottom: '-22px',
    },
    // [theme.breakpoints.down('sm')]: {
    //   marginLeft: '20px',
    // },
  },
  loginButton: {
    fontFamily: `VT323, 'arial'`,
    border: 'none',
    outline: 'none',
    display: 'block',
    fontSize: '24px',
    lineHeight: '20px',
    margin: '40px 0 0 0',
    padding: '10px 36px',
    boxShadow: '5px 0px #133DB9, -5px 0px #133DB9, 0px 5px #133DB9, 0px -5px #133DB9, 0px 15px #2979FF, -5px 10px #2A6CDA, 5px 10px #2A6CDA',
    background: '#133DB9',
    color: '#eee',
    transition: 'box-shadow 0.1s, background 0.1s, padding 0.1s',
    cursor: 'pointer',

    '&:hover': {
      background: '#2353E0',
    },
    '&:active': {
      boxShadow: '5px 5px #2353E0, -5px 5px #2353E0, 0px 10px #2353E0, 0px 0px #133DB9, 0px 15px #2979FF, -5px 10px #2A6CDA, 5px 10px #2A6CDA',
      background: '#2353E0',
      paddingTop: '15px',
      paddingBottom: '5px',
      transition: 'box-shadow 0.1s, background 0.1s, padding 0.1s',
    },
  },
  glitchText: {
    fontFamily: `VT323, 'arial'`,
    fontSize: '84px',
    color: '#fff',
    fontWeight: 'bold'
  },
  leftBgImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '43%',
  },
  rightBgImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '43%',
  }
});
