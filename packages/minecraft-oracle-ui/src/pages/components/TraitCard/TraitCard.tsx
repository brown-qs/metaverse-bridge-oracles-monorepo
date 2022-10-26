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
    <Box role="group">
      <Box w="100%" borderRadius="10px" overflow="hidden">
        <Box
          bgColor="rgba(255, 255, 255, 0.05)"
          transition="0.2s"
          // _after={{ content: '""', display: 'block', paddingBottom: '100%' }}
          _groupHover={{ transform: 'scale(1.05)' }}
        >
          <MoonsamaImage
            src={`${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${trait.previewImageUri}`}
            onError={() => {}}
            onLoad={() => {}}
          />
        </Box>

        <Stack
          bg={trait.isEquipped ? 'orange.500' : 'gray.700'}
          p="10px"
          position="relative"
          zIndex={3}
        >
          <Flex justifyContent="space-between" minHeight="40px">
            <Text fontSize="12px">{trait.name}</Text>
          </Flex>
          <Flex>
            {trait.isEquipped ? (
              <GhostButton w="100%" onClick={() => onEquip(trait.partId, '')}>
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
