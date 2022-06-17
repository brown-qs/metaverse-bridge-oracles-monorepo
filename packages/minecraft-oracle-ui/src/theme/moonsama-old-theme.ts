import { PaletteOptions, ThemeOptions, colors, createTheme } from "@mui/material";

export const fontWeight = {
  regular: 400,
  semiBold: 400,
  bold: 700,
  bolder: 700,
};

export const typography = {
  fontFamily: 'Space Mono, monospace',
  fontWeightRegular: fontWeight['regular'],
  fontWeightBold: fontWeight['bold'],
  fontWeightBolder: fontWeight['bolder'],
  h1: {
    fontSize: 64,
    fontWeight: fontWeight.bolder,
    lineHeight: 1,
    letterSpacing: '-.02em',
  },
  h2: {
    fontSize: 48,
    fontWeight: fontWeight.regular,
  },
  h3: {
    fontSize: 40,
    fontWeight: fontWeight.regular,
  },
  h4: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  h5: {
    fontSize: 22,
    fontWeight: fontWeight.regular,
  },
  h6: {
    fontSize: 18,
    fontWeight: fontWeight.regular,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: fontWeight.regular,
  },
  subtitle2: {
    fontSize: 8,
    fontWeight: fontWeight.regular,
  },
};


export const moonsamaOldTheme = (colors: PaletteOptions): ThemeOptions => {
  const defaultTheme = createTheme();
  return {
    typography,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '*::-webkit-scrollbar': {
              width: '0.5em',
              cursor: 'pointer',
            },
            '*::-webkit-scrollbar-track': {
              '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(210, 2, 62, 0.6)',
              outline: '0',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            textTransform: 'none',
            height: defaultTheme.spacing(5),
            fontSize: defaultTheme.typography.fontSize,
          },
          outlinedPrimary: {
            color: colors.text?.primary || 'white',
            borderColor: colors.text?.disabled || 'white',
            '&:hover': {
              backgroundColor: '#111',
              color: 'white',
              borderColor: 'inherit',
            },
          },
          contained: {
            '&.Mui-disabled': {
              backgroundColor: `${defaultTheme.palette.grey[900]}  !important`,
              color: defaultTheme.palette.grey[800] + ' !important',
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            [defaultTheme.breakpoints.up('sm')]: {
              minHeight: defaultTheme.spacing(10),
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            height: defaultTheme.spacing(5),
            width: '380px',
            maxWidth: '100%',
            paddingRight: '0 !important',

            [defaultTheme.breakpoints.down('sm')]: {
              width: '100%',
            },
          },
          notchedOutline: {
            borderColor: colors.text?.disabled || 'white',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.background?.default,
            borderRadius: defaultTheme.spacing(2),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#000',
            padding: '20px',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: 'white',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: 'white',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: '#111',
            border: '0 !important',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid #000',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            border: '0 !important',
          },
          head: {
            lineHeight: 1,
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: '#fff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            '& a': {
              textDecoration: 'none',
            },
            '& a:hover': {
              textDecoration: 'underline',
              color: '#d2023e',
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            maxWidth: '100%',
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          positionStart: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px 0 0 8px',
            },
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            justifyContent: 'center',
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            margin: '0 auto',
          },
        },
      },
    },
  }
}