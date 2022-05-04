import React, { ReactNode } from 'react';
import Button from '@mui/material/Button';
import { Box, Tooltip, Typography } from '@mui/material';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { useClasses } from 'hooks';
import { styles } from './AddressDisplayComponent.styles';
import { EXPLORER_URL, ChainId } from '../../constants';
import { ExternalLink } from '../ExternalLink/ExternalLink'

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

  const { copyButton } = useClasses(styles);

  return (
    
      <Box display="flex" alignItems="center">
          {!props.dontShowLink ? (
            <Typography className={props.className}>
              <ExternalLink href={EXPLORER_URL[chainId]}>
                {text}
              </ExternalLink>
            </Typography>
          ) : (
            <Typography className={props.className}>
              {text}
            </Typography>
          )}
          <Tooltip title={copyTooltipLabel}>
            <Button
              className={`${copyButton} ${props.buttonClassName}`}
              size="small"
              onClick={() => {
                _copyTextToClipboard(text);
              }}
            >
              <FileCopyOutlinedIcon color="secondary" />
            </Button>
          </Tooltip>
      </Box>
  );
};
