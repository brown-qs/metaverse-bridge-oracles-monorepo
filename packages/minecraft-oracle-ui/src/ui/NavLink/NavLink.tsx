import { ReactNode } from 'react';
import { Link, useHistory } from 'react-router-dom';
import MaterialLink from '@mui/material/Link';
import { theme } from 'theme/Theme';
import { StyledNav } from './NavLink.styles';
import { Typography } from '@mui/material';

export const NavLink = ({
  href,
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) => {
  const {
    location: { pathname },
  } = useHistory();
  const isActive = pathname === href;
  // const { link } = useStyles({ isActive });
  return (
    <StyledNav
      to={href}
      activeStyle={{ color: theme.palette.text.primary }}
      className={className}
    >
      {children}
    </StyledNav>
  );
};
