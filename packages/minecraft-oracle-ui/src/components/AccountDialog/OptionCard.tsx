import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import React from 'react';
import { useClasses } from 'hooks'
import { Link, Image, Box, Button, HStack, VStack, Text } from '@chakra-ui/react';

export default function OptionCard({
  link = null,
  onClick = null,
  header,
  subheader = null,
  iconUrl,
  active = false,
  id,
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  iconUrl?: string
  active?: boolean;
  id: string;
}) {
  const content = (
    <div >
      <div >
        <div >
          {active ? (
            <div >
              <div >
                <div />
              </div>
            </div>
          ) : (
            ''
          )}
          {header}
        </div>
        {subheader && <div >{subheader}</div>}
      </div>

      <div >

      </div>
    </div>
  );
  if (link) {
    return <Link isExternal color="teal.200" lineHeight="24px" fontSize="16px" fontFamily="Rubik" href={link}>{header}</Link >;
  }

  return (
    <Box
      position="relative"
    >
      <Image
        zIndex="1"
        position="absolute"
        top="0"
        right="0"
        height="100%"
        padding="8px"
        left="0"
        objectFit="contain"
        pointerEvents="none"  //only hover to pass down to button
        src={iconUrl}>

      </Image>
      <Button
        w="100%"
        id={id}
        onClick={() => onClick?.()}
      >
        {header}
      </Button>
    </Box >)
}
