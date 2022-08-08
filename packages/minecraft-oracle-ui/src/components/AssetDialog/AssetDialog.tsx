
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import 'date-fns';
import { useState } from 'react';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { useAssetDialog } from 'hooks/useAssetDialog/useAssetDialog';
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask/useAddTokenToMetamask';
import { useTokenStaticData } from 'hooks/useTokenStaticData/useTokenStaticData';
import { StringAssetType } from 'utils/subgraph';
import { AddressZero } from '@ethersproject/constants';
import { Box, Button, CircularProgress, Grid, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react';
import { MoonsamaModal } from '../MoonsamaModal';


export const AssetDialog = () => {
  const [assetParamsLoaded, setAssetParamsLoaded] = useState<boolean>(false);
  const { isAssetDialogOpen, onAssetDialogOpen, onAssetDialogClose, assetDialogData, setAssetDialogData } = useAssetDialog();





  const handleClose = () => {
    onAssetDialogClose()
    setAssetParamsLoaded(false);
  };

  if (!assetParamsLoaded && !!assetDialogData?.title) {
    setAssetParamsLoaded(true);
  }

  const erc20Data = useTokenStaticData([{ assetAddress: assetDialogData?.assetAddressERC20 ?? AddressZero, assetId: '0', assetType: StringAssetType.ERC20, id: '1' }])

  console.log('yolo', { assetDialogData, erc20Data })
  const { addToken } = useAddTokenToMetamask({
    address: assetDialogData?.assetAddressERC20,
    decimals: erc20Data?.[0]?.decimals,
    symbol: erc20Data?.[0]?.symbol,
    image: assetDialogData?.image
  })

  const title = `${erc20Data?.[0]?.name ?? 'Asset'}`


  if (!assetParamsLoaded) {
    return (<MoonsamaModal
      title="Loading asset details"
      isOpen={isAssetDialogOpen}
      onClose={handleClose}
      message="Should be a jiffy"
    >
      <VStack alignItems="center">
        <CircularProgress isIndeterminate color="teal"></CircularProgress>
      </VStack>
    </MoonsamaModal >)
  } else {
    return (<MoonsamaModal
      title="Hybrid token details"
      isOpen={isAssetDialogOpen}
      onClose={handleClose}
      bottomButtonText='Close'
      onBottomButtonClick={handleClose}
    >
      <VStack alignItems="center">
        {assetDialogData?.assetERC1155 &&

          <SimpleGrid columns={2} spacing={1} w="100%">
            <Box >Type</Box>
            <Box >{assetDialogData?.assetERC1155?.assetType}</Box>
            <Box >ID</Box>
            <Box>{assetDialogData?.assetERC1155?.assetId}</Box>
            <Box>Address</Box>
            <Box>
              <AddressDisplayComponent
                copyTooltipLabel={'Copy address'}
                charsShown={5}
              >
                {assetDialogData?.assetERC1155?.assetAddress ?? '?'}
              </AddressDisplayComponent>
            </Box>
          </SimpleGrid>
        }

        {assetDialogData?.assetAddressERC20 && (
          <SimpleGrid columns={2} spacing={1} paddingTop="16px" w="100%">
            <Box >Type</Box>
            <Box >ERC20</Box>
            <Box>Address</Box>
            <Box>
              <AddressDisplayComponent
                copyTooltipLabel={'Copy address'}
                charsShown={5}
              >
                {assetDialogData?.assetAddressERC20 ?? '?'}
              </AddressDisplayComponent>
            </Box>
          </SimpleGrid>
        )}
        <Button
          w="100%"
          onClick={() => {
            addToken()
          }}
          disabled={!assetDialogData?.assetAddressERC20}
        //startIcon={<Avatar src={MetamaskLogo}>Add to Metamask</Avatar>}
        >
          ADD TO METAMASK
        </Button>
      </VStack>
    </MoonsamaModal >)
  }
};
