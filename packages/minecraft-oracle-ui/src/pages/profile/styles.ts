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
    dialogContainer: {
        display: 'flex',
        padding: theme.spacing(4),
        flexDirection: 'column',
        // minWidth: 500,
    },
    divider: {
      background: theme.palette.text.secondary,
      opacity: 0.5,
      marginTop: theme.spacing(2),
    },
        // Column
    col: {
        '[class*=formValue]': {
        'min-height': 30,
        color: 'fucsia',
        },
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    formBox: {
        border: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.grey[900],
        padding: 30,
    },
    formSubheader: {
        fontSize: 22,
        color: theme.palette.common.white,
        marginBottom: '1rem',
    },
    formButton: {
        marginTop: theme.spacing(2),
        margin: '0 auto',
        display: 'block',
        minWidth: 240,
    },
    formLabel: {
        color: theme.palette.grey[500],
    },
    formValue: {
        color: theme.palette.text.primary,
    },
    formValueTokenDetails: {
        height: 40,
        display: 'flex',
        alignItems: 'center',
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
        fontSize: '21px',
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
        fontFamily: `VT323, 'arial'`,
        border: 'none',
        outline: 'none',
        display: 'block',
        fontSize: '18px',
        lineHeight: '20px',
        alignSelf: 'center',
        height: '25px',
        width: '140px',
        padding: '2px 6px',
        boxShadow: '3px 0px #133db9, -3px 0px #133db9, 0px 3px #133db9, 0px -3px #133db9, 0px 8px #2979ff, -3px 6px #2a6cda, 3px 6px #2a6cda',
        background: '#133DB9',
        color: '#eee',
        margin: '15px 0',
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
    transferButtonMid: {
        fontFamily: `VT323, 'arial'`,
        border: 'none',
        outline: 'none',
        display: 'block',
        fontSize: '18px',
        lineHeight: '20px',
        alignSelf: 'center',
        height: '25px',
        width: '240px',
        padding: '2px 6px',
        boxShadow: '3px 0px #133db9, -3px 0px #133db9, 0px 3px #133db9, 0px -3px #133db9, 0px 8px #2979ff, -3px 6px #2a6cda, 3px 6px #2a6cda',
        background: '#133DB9',
        color: '#eee',
        margin: '15px 0',
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
    headerImage: {
        width: '55px',
        position: 'absolute',
        top: '-35px',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    itemImage: {
        width: '32px'
    },
    skinComponent: {
        paddingLeft: '3px',
        paddingRight: '3px',
        '&.selected': {
            width: '140px',
            height: '100%',
            border: 'solid',
            //background: '#710021 !important',
            borderColor: '#710021 !important',
            alignContent: 'center',
            justifyContent: 'center'
        },
    }
}));
