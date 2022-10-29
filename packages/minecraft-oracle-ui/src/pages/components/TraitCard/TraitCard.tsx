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
import { Media } from '../../../components';
import { MoonsamaImage } from '../../../components/MoonsamaImage';

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
    <Box
      role="group"
      cursor="pointer"
      onClick={() => onEquip(trait.partId, trait.isEquipped ? '' : trait.id)}
    >
      <Box w="100%" borderRadius="10px" overflow="hidden">
        <Box
          bgColor="rgba(255, 255, 255, 0.05)"
          transition="0.2s"
          // _after={{ content: '""', display: 'block', paddingBottom: '100%' }}
        >
          <MoonsamaImage
            src={`${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${trait.previewImageUri}`}
            onError={() => {}}
            onLoad={() => {}}
          />
        </Box>

        <Stack
          bg={trait.isEquipped ? 'gray.600' : 'gray.700'}
          p="10px"
          position="relative"
          zIndex={3}
          _groupHover={{ background: '#4A5568' }}
        >
          <Flex justifyContent="space-between" minHeight="40px">
            <Text fontSize="12px">{trait.name}</Text>
          </Flex>
          <Flex>
            <GhostButton w="100%">
              {trait.isEquipped ? 'Remove' : 'Equip'}
            </GhostButton>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

export default TraitCard;
