import styled from '@emotion/styled';

export const StyledPriceBox = styled('div') <{
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium';
  margin: boolean;
  color?: string;
}>`
  color: ${(p) =>
    p.color ? p.color : p.variant === 'primary' ? '#b90e0e' : '#156b00'};
  padding: 0;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin-top: 6px;
  margin-bottom: 4px;
  display: block;
  align-items: center;
  height: auto;
`;
