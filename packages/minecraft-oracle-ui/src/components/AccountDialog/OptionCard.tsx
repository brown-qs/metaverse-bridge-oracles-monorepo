import { ExternalLink } from 'components/ExternalLink/ExternalLink';
import React from 'react';
import { useClasses } from 'hooks'
import { Box, Button } from '@chakra-ui/react';

export default function OptionCard({
  link = null,
  onClick = null,
  header,
  subheader = null,
  icon,
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
  icon: React.ReactNode;
  active?: boolean;
  id: string;
}) {
  console.log({ icon });
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
    return <ExternalLink href={link}>{content}</ExternalLink>;
  }

  return (
    <>
      <Button
        id={id}
        onClick={() => onClick?.()}
        rightIcon={<>{icon}</>}
      >

        {header}
      </Button></>
  );
}
