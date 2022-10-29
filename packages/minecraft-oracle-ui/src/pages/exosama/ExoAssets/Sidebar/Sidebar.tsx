import { FunctionComponent } from 'react';
import { Flex, Image, Text, VStack } from '@chakra-ui/react';

import bridgeIcon from './assets/buildingbridge2.svg';
import walletIcon from './assets/wallet.svg';
import { useNavigate } from 'react-router-dom';

interface SideButtonProps {
  icon?: string;
  to: string;
  label: string;
}
const SideButton = ({ icon, to, label }: SideButtonProps) => {
  const navigate = useNavigate();
  return (
    <Flex
      flexFlow="row"
      justifyContent="flex-start"
      w="100%"
      p="5px 16px"
      borderRadius="3px"
      cursor="pointer"
      onClick={() => navigate(to)}
      _hover={{ background: 'rgba(255,255,255,0.2)', transition: '0.3s' }}
      _focus={{ background: 'rgba(255,255,255,0.6)' }}
    >
      {icon && <Image src={icon} mr="10px" />}
      <Text color="gray.50" fontSize="16px">
        {label}
      </Text>
    </Flex>
  );
};

const Sidebar: FunctionComponent = () => {
  return (
    <Flex
      w="200px"
      minH="calc(100vh - 64px)"
      bg="#1A202C"
      flexFlow="column"
      justifyContent="flex-start"
      pt="16px"
    >
      <VStack alignItems="flex-start" gap={2} w="100%">
        <VStack alignItems="flex-start" gap={2} p="0 16px" w="100%">
          <Text color="gray.400" fontSize="12px" letterSpacing="0.05em">
            MY NFTS
          </Text>
          <SideButton to="#" icon={bridgeIcon} label="Bridged" />
          <SideButton to="#" icon={walletIcon} label="Wallet" />
        </VStack>
        <VStack alignItems="flex-start" gap={2} p="0 16px" w="100%">
          <Text color="gray.400" fontSize="12px" letterSpacing="0.05em">
            MULTIVERSE NFTS
          </Text>
          <SideButton to="#" label="Exosama" />
          <SideButton to="#" label="Moonsama" />
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Sidebar;
