import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
    profileContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: `${theme.spacing(8)}px 0`,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    pageContent: {
        margin: '80px 0',

        '& a': {
            textDecoration: 'none !important',
        },
    },
    logo: {
        width: 300,
        maxWidth: '90%',
        height: 'auto',
        '& > img': {
            maxWidth: '100%',
            marginBottom: '-22px',
        },
        // [theme.breakpoints.down('sm')]: {
        //   marginLeft: '20px',
        // },
    },
    columnTitle: {
        display: 'flex',
        alignItems: 'center',
        margin: '0 0 8px 0',
        color: '#fff',
    },
    columnTitleText: {
        fontFamily: `VT323, 'arial'`,
        fontSize: '21px',
        display: 'block',
        margin: '0 0 0 8px !important'
    },
    transferButton: {
        fontFamily: `VT323, 'arial'`,
        border: 'none',
        outline: 'none',
        display: 'block',
        fontSize: '18px',
        lineHeight: '20px',
        height: '30px',
        width: '100%',
        margin: '15px 0 0 0',
        padding: '4px 8px',
        boxShadow: '3px 0px #133db9, -3px 0px #133db9, 0px 3px #133db9, 0px -3px #133db9, 0px 8px #2979ff, -3px 6px #2a6cda, 3px 6px #2a6cda',
        background: '#133DB9',
        color: '#eee',
        transition: 'box-shadow 0.1s, background 0.1s, padding 0.1s',

        '&:hover': {
            background: '#2353E0',
        },
        '&:active': {
            boxShadow: '3px 3px #2353e0, -3px 3px #2353e0, 0px 6px #2353e0, 0px 0px #133db9, 0px 8px #2979ff, -3px 6px #2a6cda, 3px 6px #2a6cda',
            background: '#2353E0',
            paddingTop: '8px',
            paddingBottom: '5px',
            transition: 'box-shadow 0.1s, background 0.1s, padding 0.1s',
        },
    },
    footerBg: {
        width: '35%',
        position: 'absolute',
        bottom: '-90px',
        opacity: 0.2
    },
    statBox: {
        width: '100%',
        height: '132px',
        background: '#111',
        position: 'relative',
        textAlign: 'center',
        textTransform: 'uppercase',
        paddingTop: '32px',

        '& img': {
            width: '55px',
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
        }
    },
    statBoxInfo: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        margin: '16px 0 0 0'
    },
    checkBox: {
        color: '#fff !important'
    },
    transferButtonSmall: {
        fontSize: '22px',

        '& svg': {
          margin: '0 0 0 8px',
          fontSize: '30px',
          fill: '#133DB9',
        },
    }
}));
