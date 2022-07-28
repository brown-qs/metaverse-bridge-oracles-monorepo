
import { Box } from '@chakra-ui/react';
import { useClasses } from 'hooks';
import { useAuth } from 'hooks';
import { useNavigate } from 'react-router-dom';

const ServerAccount = () => {
  let navigate = useNavigate();
  const { authData, setAuthData } = useAuth();

  const handleAccount = () => {
    navigate("/account");
  };

  const handleLogin = () => {
    navigate("/account/login");
  };

  const isLoggedIn = !!authData && !!authData?.jwt

  // rgba(255, 201, 20, 0.2)
  //border 0EEBA8
  const styles = () => ({
    BoxStyle: {
      backgroundColor: 'rgba(14, 235, 168, 0.2)',
      textTransform: 'uppercase',
      padding: '16px',
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
        border: '1px solid #0EEBA8',
      }
    }
  })

  const {
    BoxStyle,
  } = useClasses(styles)

  return (
    <Box onClick={() => isLoggedIn ? handleAccount() : handleLogin()} className={BoxStyle}>
      {isLoggedIn ? 'ACCOUNT' : 'LOGIN'}
    </Box>
  );
}
export default ServerAccount