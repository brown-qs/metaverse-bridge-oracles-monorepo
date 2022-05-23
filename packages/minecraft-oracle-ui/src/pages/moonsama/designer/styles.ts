import { Theme } from '@mui/material';

export const styles = (theme: Theme) => ({
  customizerContainer: {
    fontFamily: 'Orbitron',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    overflow: 'hidden',
    height: 680,
    maxWidth: 1437,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#1B1B3A',
    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      height: 'auto',
      marginTop: 40,
    },
  },
  previewViewport: {
    width: '100%',
    height: '50vh',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: '760px',
      height: 'auto',
    }
  },
  traitExplorer: {
    width: '100%',
    height: '50vh',
    [theme.breakpoints.up('sm')]: {
      width: '677px',
      height: 'auto',
    }
  },

  gridItem: {
    padding: '2px', width: '204px', cursor: 'pointer', height: '204px', borderRadius: '8px',
    '&:hover': {
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
    },
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
    height: '48px' 
  }
});
