import {
  Box,
  Flex,
  Grid,
  SimpleGrid,
  Input,
  Heading,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Search } from 'tabler-icons-react';
import Sidebar from './Sidebar/Sidebar';
import NFTCard from '../../components/NFTCard/NFTCard';

const ExoAssets = () => {
  return (
    <Grid gridTemplateColumns="200px 1fr">
      <Sidebar />
      <Box>
        <SimpleGrid columns={2} p="20px">
          <Box>
            <Heading
              fontSize="16px"
              fontFamily="Rubik"
              color="gray.400"
              as="h4"
            >
              MY NFTS
            </Heading>
            <Heading
              fontSize="30px"
              fontFamily="Orbitron"
              color="white"
              as="h4"
            >
              Bridged NFTs
            </Heading>
          </Box>
          <Flex>
            <InputGroup>
              <Input
                alignSelf="center"
                borderColor="gray.50"
                placeholder="Search by ID"
              />
              <InputRightElement
                children={<Search />}
                top="50%"
                transform="translateY(-50%)"
              />
            </InputGroup>
          </Flex>
        </SimpleGrid>

        <SimpleGrid
          minChildWidth="280px"
          justifyItems="center"
          spacing="20px"
          columns={{ xs: 1, sm: 1, md: 2, lg: 4, xlg: 6 }}
          w="100%"
          p="20px"
        >
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
        </SimpleGrid>
      </Box>
    </Grid>
  );
};

export default ExoAssets;
