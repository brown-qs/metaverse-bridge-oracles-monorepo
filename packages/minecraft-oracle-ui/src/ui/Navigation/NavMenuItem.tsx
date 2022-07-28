

import { Box, HStack, Link } from '@chakra-ui/react';
import { useClasses } from 'hooks';
import { Brush, ChevronUpRight } from 'tabler-icons-react';
export default function NavMenuItem({ href, label, external = false }: { href: string, label: string, external?: boolean }) {
  return (
    <Link sx={{ textTransform: "uppercase", letterSpacing: "0.0032em", fontSize: "12px", color: "white", "&:hover": { color: "#F7CB49" } }} href={href} target={`${external ? '_blank' : '_self'}`}>
      <HStack>
        <span style={{ marginRight: 'auto' }}>{label}</span>

        {external && <ChevronUpRight color="#3BEFB8"></ChevronUpRight>}
        {label.toLowerCase() === "customizer" && <Brush color="#3BEFB8"></Brush>}
      </HStack>
    </Link>
  )
}
