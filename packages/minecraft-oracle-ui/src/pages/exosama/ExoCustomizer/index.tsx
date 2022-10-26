import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Box,
  Grid,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { useCustomizerConfigQuery } from '../../../state/api/bridgeApi';
import TraitCard from 'pages/components/TraitCard/TraitCard';
import { useEffect, useState } from 'react';
import { MoonsamaSpinner } from '../../../components/MoonsamaSpinner';

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
    return <MoonsamaSpinner />;
  }
  if (!data || error) {
    return (
      <Box m={20}>
        <Alert>Configuration failed to load. Please reload the page.</Alert>
      </Box>
    );
  }
  let filteredTraits = Object.keys(equippedTraits);

  // Weird rules
  //// When Helmet is on, remove hair, eyewear
  if (equippedTraits['Helmet'] !== '') {
    filteredTraits = filteredTraits.filter(
      (k) => !['Eyewear', 'Face', 'Hair'].includes(k)
    );
  }
  if (equippedTraits['Body'] !== '') {
    filteredTraits = filteredTraits.filter(
      (k) => !['Vibe', 'Expression'].includes(k)
    );
  }

  // Filters categories based on other selections
  let filteredParts = data.parts;
  if (equippedTraits['Body'] !== '') {
    filteredParts = filteredParts.filter(
      (part) => !['Vibe', 'Expression'].includes(part.name)
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
          bgImg="https://dev.static.moonsama.com/customizer-ui/exosama-preview-background.jpg"
          bgSize="cover"
          bgColor="rgba(255, 255, 255, 0.05)"
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
        <Accordion allowToggle>
          {filteredParts.map((part) => {
            const { name, items } = part;
            return (
              <AccordionItem key={name}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontFamily="Orbitron">
                      {name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <SimpleGrid
                    columns={[1, 2, 3, 2, 4]}
                    gap={2}
                    maxHeight="300px"
                    overflowY="auto"
                  >
                    {items.map((trait) => {
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
            );
          })}
        </Accordion>
      </Box>
    </Grid>
  );
};

export default ExoCustomizer;
