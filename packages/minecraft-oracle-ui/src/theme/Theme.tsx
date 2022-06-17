import { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {
  StyledEngineProvider,
  createTheme,
  ThemeOptions,
} from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { useThemeOptions } from 'hooks';
import { lightPalette, palette } from './palette';
import { PaletteOptions } from '@mui/material/styles/createPalette';
import { moonsamaPalette, moonsamaTheme } from './moonsama-theme';



const getDefaultOptions = (colors: PaletteOptions): ThemeOptions => (moonsamaTheme(colors));

const themeOptions: ThemeOptions = {
  ...getDefaultOptions(moonsamaPalette),
};

export const theme = createTheme(themeOptions);

const lightTheme = createTheme({
  palette: lightPalette,
  ...getDefaultOptions(lightPalette),
});

const Theme = ({ children }: { children: ReactNode }) => {
  const { isDarkTheme } = useThemeOptions();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={isDarkTheme ? theme : theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Theme;
