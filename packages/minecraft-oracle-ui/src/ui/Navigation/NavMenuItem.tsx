import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { useClasses } from 'hooks';

export default function NavMenuItem({ href, label, external = false }: { href: string, label: string, external?: boolean }) {
  const styles = () => ({
    NavItem: {
      textTransform: 'uppercase',
      height: '100%',
      padding: '12px',
      fontFamily: 'Orbitron',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.032em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    Chevron: {
      color: '#66C8FF'
    },
    LinkStyle: {
      color: '#ffffff',
      '&:hover': {
        color: '#FFC914 !important',
        textDecoration: 'none !important',
        '& svg': {
          color: '#FFC914 !important'
        }
      },
    }
  });

  const {
    LinkStyle,
    Chevron,
    NavItem,
  } = useClasses(styles);

  return (
    <Link href={href} className={LinkStyle} target={`${external ? '_blank' : '_self'}`}>
      <Box className={NavItem}>
        <span style={{ marginRight: 'auto' }}>{label}</span>

        {external && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{ marginLeft: '8px', flexShrink: 0 }} className={Chevron} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <path d="M8 8h8v8"></path>
        </svg>}
      </Box>
    </Link>
  )
}
