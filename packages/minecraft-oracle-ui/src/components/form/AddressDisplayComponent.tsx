import React, { ReactNode } from 'react';

import { useClasses } from 'hooks';
import { getExplorerLink } from 'utils';
import { useActiveWeb3React } from 'hooks';
import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import { Box, Tooltip, Text, Button, Link } from '@chakra-ui/react';
import { Copy } from 'tabler-icons-react';

const CHARS_SHOWN = 3;
const MIN_LENGTH = 5;

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

export const AddressDisplayComponent = (props: {
  children: ReactNode;
  charsShown: number;
  copyTooltipLabel: string;
  dontShowLink?: boolean;
  className?: string;
  buttonClassName?: string;
}) => {
  const text = props.children?.toString() || '';
  const charsShown = props.charsShown ? props.charsShown : CHARS_SHOWN;
  const copyTooltipLabel = props.copyTooltipLabel

  const { chainId } = useActiveWeb3React();

  const _apply_ellipsis = (): string => {
    let _text = text;

    if (_text.length > MIN_LENGTH) {
      return (
        _text.substr(0, charsShown) +
        '...' +
        _text.substr(_text.length - Math.floor(charsShown), _text.length)
      );
    }

    return _text;
  };

  return (
    <React.Fragment>
      <Box display="flex" alignItems="center" color="teal.200" fontSize="12px">
        <Tooltip title={text}>
          {!props.dontShowLink ? (
            <Text className={props.className}>
              <Link isExternal href={getExplorerLink(chainId, text, 'address')}>
                {_apply_ellipsis()}
              </Link>
            </Text>
          ) : (
            <Text className={props.className}>
              <Link color="teal.200" isExternal>
                {_apply_ellipsis()}
              </Link>
            </Text>
          )}
        </Tooltip>
        <Box marginLeft="12px" cursor="pointer" onClick={() => { _copyTextToClipboard(text) }}>
          <Copy color="#3BEFB8" size="18px" />
        </Box>
      </Box>
    </React.Fragment >
  );
};
