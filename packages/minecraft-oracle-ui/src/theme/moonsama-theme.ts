import { PaletteOptions, ThemeOptions, colors, createTheme, InputBaseClasses } from "@mui/material";
import { purple } from "@mui/material/colors";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { color } from "@mui/system";
import type { } from '@mui/lab/themeAugmentation';
export const fontWeight = {
  regular: 400,
  semiBold: 400,
  bold: 700,
  bolder: 700,
};

export const moonsamaPalette: PaletteOptions = {

  background: {
    default: "#232c54"
  },
  text: {
    primary: "#ffffff"
  },
  error: {
    light: "#C91D2B",
    dark: "#C91D2B",
    main: "#C91D2B",
  }
}

export const typography = {
  fontFamily: 'Orbitron',
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


export const moonsamaTheme = (colors: PaletteOptions): ThemeOptions => {
  const defaultTheme = createTheme();
  const themeObj: ThemeOptions = {
    palette: moonsamaPalette,
    typography,
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#1b1a3a"

          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            [defaultTheme.breakpoints.up('sm')]: {
              width: 500
            },
            [defaultTheme.breakpoints.down('sm')]: {
              width: "100%"
            }
          },
          //#5EB234 success
          //#C91D2B error
          //warning #E8B130
          outlinedError: {
            backgroundColor: '#C91D2B',
            color: "white"
          },
          standardError: {
            backgroundColor: '#C91D2B',
            color: "white"

          },
          filledError: {
            backgroundColor: '#C91D2B',
            color: "white"
          },
          outlinedSuccess: {
            backgroundColor: '#5EB234',
            color: "white"
          },
          standardSuccess: {
            backgroundColor: '#5EB234',
            color: "white"

          },
          filledSuccess: {
            backgroundColor: '#5EB234',
            color: "white"
          },

          outlinedInfo: {
            backgroundColor: '#1d59c9',
            color: "white"
          },
          standardInfo: {
            backgroundColor: '#1d59c9',
            color: "white"

          },
          filledInfo: {
            backgroundColor: '#1d59c9',
            color: "white"
          },
          message: {
            "wordBreak": "break-word",
            "textAlign": "justify"
          }
        }
      },
      MuiButtonBase: {
        defaultProps: {
          // The props to apply
          disableRipple: true, // No more ripple, on the whole application 💣!
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '*::-webkit-scrollbar': {
              width: '0.5em',
              cursor: 'pointer',
            },
            '*::-webkit-scrollbar-track': {
              'WebkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(210, 2, 62, 0.6)',
              outline: '0',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#a9a9a9 !important"
          }
        }
      },

      MuiInput: {

        styleOverrides: {
          root: {

            color: "white",
            '&::before': {
              "border-bottom": "2px solid #25434F"
            },
            '&::after': {
              "border-bottom": "2px solid #0EEBA8"
            },


          },

          input: {

          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          //prevent autofill weird background colors
          input: {
            "&:-webkit-autofill": {
              transitionDelay: "9999s",
              transitionProperty: "background-color, color",
            },
          },
        },
      },
      MuiLoadingButton: {
        styleOverrides: {
          root: {
            loadingIndicator: {

            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
          },
          outlinedPrimary: {
            color: 'white',
            borderColor: colors.text?.disabled || 'white',
            '&:hover': {
              backgroundColor: '#25434F',
              color: 'white',
              borderColor: 'inherit',
            },
          },
          contained: {
            borderRadius: 4,
            textTransform: 'none',
            height: defaultTheme.spacing(5),
            fontSize: defaultTheme.typography.fontSize,
            background: "#25434F",
            border: "1px solid #25434F",
            '&.Mui-disabled': {
              backgroundColor: "#162e32",
              border: "1px solid #162e32",
              color: "#a9a9a9"
            },
            "&:hover": {
              transition: "none",
              boxShadow: 'none',
              border: "1px solid #0EEBA8",
              background: "#25434F"
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
  return themeObj
}