import Box from '@mui/material/Box';
import { useActiveGame } from 'hooks/multiverse/useActiveGame';
import '@fontsource/orbitron/500.css';
import { useClasses } from 'hooks';

export default function CarnageStatus() {
  const isGameActive = useActiveGame();

  const styles = () => ({
    BoxStyle: {
      backgroundColor: isGameActive ? 'rgba(14, 235, 168, 0.2)' : 'rgba(251, 122, 111, 0.2)',
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
        border: '1px solid ' + (isGameActive ? '#0EEBA8' : '#FB7A6F'),
      }
    }
  })

  const {
    BoxStyle,
  } = useClasses(styles)

  return (
    <Box className={BoxStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke={isGameActive ? '#0EEBA8' : '#FB7A6F'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        className="icon icon-tabler icon-tabler-device-gamepad"
        viewBox="0 0 24 24"
        style={{marginRight: '8px'}}
      >
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <rect width="20" height="12" x="2" y="6" rx="2"></rect>
        <path d="M6 12h4m-2-2v4"></path>
        <path d="M15 11L15 11.01"></path>
        <path d="M18 13L18 13.01"></path>
      </svg>

      {isGameActive ? 'Carnage Live' : 'Carnage Offline'}
    </Box>
  )
}