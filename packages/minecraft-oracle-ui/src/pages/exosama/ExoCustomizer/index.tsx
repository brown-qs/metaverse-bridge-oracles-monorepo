import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { useCustomizerConfigQuery } from '../../../state/api/bridgeApi';
import TraitCard from 'pages/components/TraitCard/TraitCard';
import { useEffect, useState } from 'react';

type ILayer = {
  url: string;
  zIndex: number;
};

const ExoCustomizer = () => {
  const { data, isFetching, error } = useCustomizerConfigQuery({
    chainId: '1',
    assetAddress: '0xAc5C7493036dE60e63eb81C5e9A440b42f47ebF5',
  });
  const [equippedTraits, setEquippedTraits] = useState<any>({});

  useEffect(() => {
    if (!data) {
      return;
    }
    setEquippedTraits(
      data.parts.reduce((current: any, item) => {
        current[item.name] = '';
        return current;
      }, {})
    );
  }, [data]);

  function setEquippedTrait(fieldName: string, newValue: string) {
    setEquippedTraits((current: any) => ({
      ...current,
      [fieldName]: newValue,
    }));
  }

  if (isFetching) {
    return <Spinner />;
  }
  if (!data || error) {
    return <Box>Error loading data.</Box>;
  }

  let filteredTraits = Object.keys(equippedTraits);

  // Weird rules
  //// When Helmet is on, remove hair, eyewear
  if (equippedTraits['Helmet'] !== '') {
    filteredTraits = filteredTraits.filter(
      (k) => !['Eyewear', 'Face', 'Hair'].includes(k)
    );
  }

  // Image Composition... Good luck understanding this xD
  // AKA TODO: Refactor
  const equippedImageStack = filteredTraits
    // Filter used traits only
    .filter((t) => equippedTraits[t] !== '')
    // Finds the part for this trait
    .map((t) => data.parts.filter((part) => part.name === t)[0])
    // Cleanup
    .filter((t) => t)
    // Finds the selected trait
    .map(
      (trait) =>
        data.parts
          .filter((part) => part.name === trait.name)[0]
          .items.filter((item) => item.id === equippedTraits[trait.name])[0]
    )
    // Finds all the layers for the selected trait
    .map((trait) =>
      trait.layers.map((layer) => ({
        url: layer.imageUri,
        zIndex: layer.zIndex,
      }))
    )
    // Same as the Earth ;)
    .flat();

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
      maxWidth="1536px"
      margin="0 auto"
      gap="20px"
      p="20px"
    >
      <Box>
        <Box
          bgColor="gray.100"
          transition="0.2s"
          position="relative"
          _after={{ content: '""', display: 'block', paddingBottom: '100%' }}
        >
          {equippedImageStack.map((img) => (
            <img
              key={img.url}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: img.zIndex < 0 ? 0 : img.zIndex,
              }}
              src={`${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}${img.url}`}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Accordion>
          {data.parts.map((part) => (
            <AccordionItem key={part.name}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontFamily="Orbitron">
                    {part.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid
                  columns={[2, 3, 4, 5]}
                  gap={2}
                  maxHeight="300px"
                  overflowY="auto"
                >
                  {part.items.map((trait) => {
                    const { id, assetId, previewImageUri } = trait;
                    return (
                      <TraitCard
                        trait={{
                          id,
                          assetId,
                          previewImageUri,
                          partId: part.name,
                          name: trait.attributes[0].value,
                          isEquipped: trait.id === equippedTraits[part.name],
                        }}
                        onEquip={setEquippedTrait}
                      />
                    );
                  })}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Grid>
  );
};

export default ExoCustomizer;
