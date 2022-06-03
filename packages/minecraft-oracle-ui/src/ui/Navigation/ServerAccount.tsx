import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { useClasses } from 'hooks';
import { useAuth } from 'hooks';

export default function CarnageStatus() {
  const { authData, setAuthData } = useAuth();

  const handleLogout = () => {
    setAuthData({
      jwt: undefined,
      userProfile: undefined
    })
  };

  const handleLogin = () => {
    window.sessionStorage.setItem('authSuccessRedirect', window.location.pathname);
    window.location.href = `${process.env.REACT_APP_BACKEND_API_URL}/auth/login`;
  };

  const isLoggedIn = !!authData && !!authData.userProfile

  const styles = () => ({
    BoxStyle: {
      backgroundColor: isLoggedIn ? 'rgba(255, 201, 20, 0.2)' : 'rgba(14, 235, 168, 0.2)',
      textTransform: 'uppercase',
      padding: '12px 24px 12px 16px',
      fontFamily: 'Orbitron',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.032em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid transparent',
      cursor: 'pointer',
      borderRadius: '4px',
      '&:hover': {
        border: '1px solid ' + (isLoggedIn ? '#FFC914' : '#0EEBA8'),
      }
    }
  })

    const {
      BoxStyle,
    } = useClasses(styles)

  return (
    <Box onClick={() => isLoggedIn ? handleLogout() : handleLogin()} className={BoxStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke={isLoggedIn ? '#FFC914' : '#0EEBA8'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ marginRight: '8px' }} viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M7 6a7.75 7.75 0 1010 0"></path>
        <path d="M12 4L12 12"></path>
      </svg>
      <span>{isLoggedIn ? 'Log Out' : 'Log In'}</span>
    </Box>
  );
};
