import { Theme } from '@mui/material';

export const styles = (theme: Theme) => ({
    row: {
        justifyContent: 'space-between',
    },
    pL: {
        paddingLeft: theme.spacing(1)
    },
    formLabel: {
        color: theme.palette.grey[500],
        display: 'flex',
        alignItems: 'center',
    },
    formValue: {
        color: theme.palette.text.primary,
    },
    formValueTokenDetails: {
        height: 40,
        display: 'flex',
        alignItems: 'center',
    },
    chainDetailsContainer: {
        border: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.grey[900]
    }
});
