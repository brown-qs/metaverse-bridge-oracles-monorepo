
export const styles = (theme: any) => ({
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
    /*[theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      height: 'auto',
      marginTop: 40,
    },*/
  },
  previewViewport: {
    width: '100%',
    height: '100vw',
    flexShrink: 0,
    /*
    [theme.breakpoints.up('sm')]: {
      width: '760px',
      height: 'auto',
    }*/
  },
  traitExplorer: {
    width: '100%',
    height: '760px',
    /*
    [theme.breakpoints.up('sm')]: {
      width: '677px',
      height: 'auto',
    }*/
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
    backgroundImage: 'url(https://static.moonsama.com/customizer-ui/preview-background.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    /*
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    }*/
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
    position: 'relative',
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

  accordion: {
    padding: 0,

    '&:before': {
      opacity: 0
    },

    '&:after': {
      position: 'absolute',
      left: 0,
      bottom: '-2px',
      right: 0,
      height: '2px',
      content: '""',
      opacity: 0,
      backgroundImage: 'linear-gradient(270deg, #F84AA7 2.78%, #FB7A6F 32.52%, #FFC914 62.72%, #0EEBA8 90.83%)',
      transition: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      zIndex: 999,
    },

    '&:hover': {
      '&:after': {
        opacity: 1
      }
    }
  },

  accordionExpanded: {
    '&:after': {
      opacity: 1
    }
  },

  customizerActionButton: {
    fontFamily: 'Orbitron',
    color: '#ffffff',
    textTransform: 'uppercase',
    borderRadius: '800px',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 12,
    paddingRight: 12,
    fontWeight: '600',
    fontSize: '0.65rem',
    cursor: 'default !important',
    backgroundColor: '#888888',
    /*
    [theme.breakpoints.up('sm')]: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 16,
      paddingRight: 16,
    },*/
    '&[disabled]': {
      color: '#ffffff',
      opacity: 0.75,
    },
    '&:not([disabled])': {
      backgroundColor: '#F84AA7',
      cursor: 'pointer !important',
      '&:hover': { backgroundColor: '#FFC914' },
    }
  }
});
