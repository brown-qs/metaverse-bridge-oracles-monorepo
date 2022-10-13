import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import React from 'react';
import { useClasses } from 'hooks'
import { Link, Image, Box, Button, HStack, VStack, Text } from '@chakra-ui/react';

export type OptionCardProps = {
  onClick?: null | (() => void)
  header: React.ReactNode
  iconSvgData: string
}
export default function OptionCard({
  onClick = null,
  header,
  iconSvgData,
}: OptionCardProps) {
  return (
    <Box
      w="100%"
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
        src={`data:image/svg+xml;base64,${btoa(iconSvgData)}`}>

      </Image>
      <Button
        w="100%"
        onClick={() => onClick?.()}
      >
        {header}
      </Button>
    </Box >)
}
