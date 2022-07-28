

import { Box, HStack, Link } from '@chakra-ui/react';
import { useClasses } from 'hooks';

export default function NavMenuItem({ href, label, external = false }: { href: string, label: string, external?: boolean }) {
  return (
    <Link sx={{ fontSize: "12px", color: "white", "&:hover": { color: "#F7CB49" } }} href={href} target={`${external ? '_blank' : '_self'}`}>
      <HStack>
        <span style={{ marginRight: 'auto' }}>{label}</span>

        {external && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{ marginLeft: '8px', flexShrink: 0 }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <path d="M8 8h8v8"></path>
        </svg>}
      </HStack>
    </Link>
  )
}
