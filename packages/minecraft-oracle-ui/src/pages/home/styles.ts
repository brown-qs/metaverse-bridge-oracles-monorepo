import { Theme } from '@mui/material';
import BackgroundImage from '../../assets/images/home/background.jpg'

export const styles = (theme: Theme) => ({
  homeContainer: {
    minWidth: '100vw',
    overflow: 'hidden',
    backgroundImage: `url(${BackgroundImage})`
  },
  logo: {
    width: 300,
    maxWidth: '90%',
    height: 'auto',
    margin: '150px 0 0 0',
    '& > img': {
      maxWidth: '100%',
      marginBottom: '-22px',
    }
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
  loginButtonStyleV2: {
      backgroundColor: 'rgba(14, 235, 168, 0.2)',
      textTransform: 'uppercase',
      padding: '12px 24px 12px 16px',
      fontFamily: 'Orbitron',
      fontSize: '12px',
      lineHeight: '24px',
      letterSpacing: '0.032em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid transparent',
      cursor: 'pointer',
      borderRadius: '4px',
      '&:hover': {
        border: '1px solid #0EEBA8',
      }
  },
  glitchText: {
    fontSize: '50px',
    color: '#fff',
    fontWeight: 'bold'
  },
  leftBgImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    maxHeight: '70%',
    maxWidth: '50%'
  },
  rightBgImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    maxHeight: '70%',
    maxWidth: '50%'
  },
  centerBgImage: {
    position: 'absolute',
    right: '50%',
    transform: 'translateX(50%)',
    bottom: 0,
    maxHeight: '40%'
  }
});
