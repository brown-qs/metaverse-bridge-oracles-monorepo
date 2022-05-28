import { Theme } from '@mui/material';

export const styles = (theme: Theme) => ({
  customizerContainer: {
    fontFamily: 'Orbitron',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: 1437,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#1B1B3A',
    flex: 1,
    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      height: 'auto',
      marginTop: 40,
    },
  },
  previewViewport: {
    width: '100%',
    height: '100vw',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: '760px',
      height: 'auto',
    }
  },
  traitExplorer: {
    width: '100%',
    height: '760px',
    [theme.breakpoints.up('sm')]: {
      width: '677px',
      height: 'auto',
    }
  },

  startCue: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    }
  },

  gridItem: {
    padding: '2px',
    cursor: 'pointer',
    borderRadius: '8px',
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    '&:hover': {
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
    },
  },

  grid: {
    overflowX: 'hidden',
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
      backgroundColor: '#36333F',
      borderRadius: '10px'
    },


    '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: '#36333F'
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: '#36333F',
      backgroundImage: 'linear-gradient(#423D66, #6D94A5, #423D66)'
    }
  },

  selected: {
    cursor: 'default',
    backgroundImage: 'linear-gradient(270deg, #F84AA7 2.78%, #FB7A6F 32.52%, #FFC914 62.72%, #0EEBA8 90.83%)',
    '&:hover': {
      backgroundImage: 'linear-gradient(270deg, #F84AA7 2.78%, #FB7A6F 32.52%, #FFC914 62.72%, #0EEBA8 90.83%)'
    },
  },

  customizerActionButton: {
    padding: '12px',
    marginLeft: '8px',
    cursor: 'pointer',
    backgroundColor: '#F84AA7',
    borderRadius: '800px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width: '48px',
    height: '48px',
    '&:hover': {
      backgroundColor: '#FFC914',
    }
  }
});
