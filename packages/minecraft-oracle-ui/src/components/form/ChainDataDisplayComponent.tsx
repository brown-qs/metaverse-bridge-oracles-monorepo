import React, { ReactNode } from 'react';
import { useClasses } from 'hooks';
import { EXPLORER_URL, ChainId } from '../../constants';
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Box, Button, Text, Tooltip } from '@chakra-ui/react';
import { Copy } from 'tabler-icons-react';

const _fallbackCopyTextToClipboard = (text: string): void => {
  let textArea = document.createElement('textarea');
  textArea.value = text;

  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
};

const _copyTextToClipboard = (text: string): void => {
  if (!navigator.clipboard) {
    _fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      // console.log('Async: Copying to clipboard was successful!');
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
};

export const ChainDataDisplayComponent = (props: {
  children: ReactNode;
  chainId: ChainId;
  copyTooltipLabel: string;
  dontShowLink?: boolean;
  className?: string;
  buttonClassName?: string;
}) => {
  const text = props.children?.toString() || '';
  const chainId = props.chainId ?? ChainId.MOONRIVER
  const copyTooltipLabel = props.copyTooltipLabel


  return (

    <Box display="flex" alignItems="center">
      {!props.dontShowLink ? (
        <Text className={props.className}>
          <ExternalLink href={EXPLORER_URL[chainId]}>
            {text}
          </ExternalLink>
        </Text>
      ) : (
        <Text className={props.className}>
          {text}
        </Text>
      )}
      <Tooltip title={copyTooltipLabel}>
        <Button
          marginLeft="12px"
          size="small"
          onClick={() => {
            _copyTextToClipboard(text);
          }}
        >
          <Copy />
        </Button>
      </Tooltip>
    </Box>
  );
};
