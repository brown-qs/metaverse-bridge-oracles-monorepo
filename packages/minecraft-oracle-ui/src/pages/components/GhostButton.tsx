import { Button } from '@chakra-ui/react';

interface IProps {
  onClick?: (e: any) => void;
  w?: number | string;
  m?: number | string;
  disabled?: boolean;
  children: any;
}
const GhostButton = ({ onClick, children, w, m, disabled }: IProps) => {
  return (
    <Button
      onClick={onClick}
      bg="transparent"
      border="none"
      color="gray.50"
      w={w}
      m={m}
      disabled={disabled}
      _hover={{ background: 'rgba(255,255,255,0.2)', transition: '0.3s' }}
      _focus={{ background: 'rgba(255,255,255,0.6)' }}
    >
      {children}
    </Button>
  );
};

export default GhostButton;
