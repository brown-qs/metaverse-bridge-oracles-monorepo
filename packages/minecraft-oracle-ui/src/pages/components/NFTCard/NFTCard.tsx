import {
  Flex,
  Box,
  Tag,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react';

import exoImage from './exomple.png';
import GhostButton from '../GhostButton';
import chainIcon from './osicon.svg';

const NFTCard = () => {
  // @ts-ignore
  return (
    <Box maxWidth="280px" role="group">
      <Box w="280px" borderRadius="10px" overflow="hidden">
        <Box
          bg={`url(${exoImage})`}
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          bgColor="gray.100"
          transition="0.2s"
          _after={{ content: '""', display: 'block', paddingBottom: '100%' }}
          _groupHover={{ transform: 'scale(1.05)' }}
        ></Box>
        <Stack bg="gray.700" p="10px" position="relative" zIndex={3}>
          <SimpleGrid columns={[2, 2, 2]}>
            <Flex alignItems="center">
              <Image mr="10px" src={chainIcon} />
              <Text>#1532</Text>
            </Flex>
            <Box>
              <HStack justifyContent="flex-end" w="100%">
                <Tag bg="teal.400">Owned</Tag>
                <Tag bg="purple.300">Edited</Tag>
              </HStack>
            </Box>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing="10px" p="10px 0 0">
            <GhostButton>View</GhostButton>
            <GhostButton>Customize</GhostButton>
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  );
};

export default NFTCard;
