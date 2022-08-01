
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

  const renderBody = () => {

    if (!assetParamsLoaded) {
      return (
        <div >
          <CircularProgress isIndeterminate />
          <div>
            <Text>Loading asset details</Text>
            <Text color="textSecondary" variant="h5">
              Should be a jiffy
            </Text>
          </div>
        </div>
      );
    }

    return (
      <Stack spacing={1} justifyContent="center">
        <Text style={{ alignSelf: 'center' }} variant='body1'>Hybrid token details</Text>
        {assetDialogData?.assetERC1155 &&

          <SimpleGrid columns={2} spacing={1}>
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
          <SimpleGrid columns={2} spacing={1} paddingTop="20px">
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
          onClick={() => {
            addToken()
          }}
          disabled={!assetDialogData?.assetAddressERC20}
        //startIcon={<Avatar src={MetamaskLogo}>Add to Metamask</Avatar>}
        >
          ADD TO METAMASK
        </Button>
        <Button onClick={() => handleClose()} color="primary">
          CANCEL
        </Button>
      </Stack>
    );
  };

  return (
    <Modal isOpen={isAssetDialogOpen} onClose={() => { handleClose() }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {renderBody()}
        </ModalBody>
      </ModalContent>
    </Modal>);
};
