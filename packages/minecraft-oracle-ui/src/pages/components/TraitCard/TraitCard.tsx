import {
  Flex,
  Box,
  Tag,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

import GhostButton from '../GhostButton';

export interface ITrait {
  id: string;
  assetId: number;
  previewImageUri: string;
  name: string;
  partId: string;
  isEquipped: boolean;
}

const TraitCard = ({
  trait,
  onEquip,
}: {
  trait: ITrait;
  onEquip: (fieldName: string, newValue: string) => void;
}) => {
  return (
    <Box maxWidth="220px" role="group">
      <Box w="100%" borderRadius="10px" overflow="hidden">
        <Box
          bg={`url(${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${trait.previewImageUri})`}
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          bgColor="gray.100"
          transition="0.2s"
          _after={{ content: '""', display: 'block', paddingBottom: '100%' }}
          _groupHover={{ transform: 'scale(1.05)' }}
        ></Box>
        <Stack
          bg={trait.isEquipped ? 'orange.500' : 'gray.700'}
          p="10px"
          position="relative"
          zIndex={3}
        >
          <Flex justifyContent="space-between">
            <Text fontSize="14px">{trait.name}</Text>
          </Flex>
          <Flex>
            {trait.isEquipped ? (
              <GhostButton
                w="100%"
                onClick={() => onEquip(trait.partId, "")}
              >
                Remove
              </GhostButton>
            ) : (
              <GhostButton
                w="100%"
                onClick={() => onEquip(trait.partId, trait.id)}
              >
                Equip
              </GhostButton>
            )}
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

export default TraitCard;
