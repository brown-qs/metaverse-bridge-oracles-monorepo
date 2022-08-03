
import 'date-fns';
import { useActiveWeb3React, useSummonDialog } from 'hooks';
import { useState } from 'react';
import { useClasses } from 'hooks';
import { styles as appStyles } from '../../app.styles';
import { useSummonCallback } from 'hooks/multiverse/useSummon';
import {
  DEFAULT_CHAIN,
  NETWORK_NAME,
  PERMISSIONED_CHAINS,
} from '../../constants';
import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';
import { VStack, Box, Button, CircularProgress, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack, Text } from '@chakra-ui/react';
import { CircleCheck } from 'tabler-icons-react';

export const SummonDialog = () => {
  const { isSummonDialogOpen, onSummonDialogOpen, onSummonDialogClose, summonDialogData, setSummonDialogData } = useSummonDialog();
  const [summonConfirmed, setSummonConfirmed] = useState<number>(0);
  const [summonSubmitted, setSummonSubmitted] = useState<boolean>(false);
  const [selectedChainId, setSelectedChainId] = useState<number>(DEFAULT_CHAIN);

  const { button, formBox, formButton } = useClasses(appStyles);



  const { account } = useActiveWeb3React();

  const handleClose = () => {
    //TO DO: don't let backdrop close
    onSummonDialogClose();
    setSummonSubmitted(false);
    setSummonConfirmed(0);
  };

  const recipient = account ?? summonDialogData?.recipient ?? undefined;

  const summonCallback = useSummonCallback();

  const renderBody = () => {
    if (summonSubmitted && summonConfirmed === 1) {
      return (
        <div >
          <CircleCheck />
          <Text>{`Summon request received!`}</Text>
          <Text color="textSecondary">
            {`Your summon request was acknowledged by the Oracle. Depending on the number of requests and Moonriver traffic the transaction can take a while. You can sit back and relax now. Check back later.`}
          </Text>
          <Button
            className={button}
            onClick={() => handleClose()}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </div>
      );
    }

    if (summonSubmitted && summonConfirmed === 0) {
      return (
        <>
          <VStack alignItems="center" >
            <CircularProgress isIndeterminate />
            <Box>
              <Text>
                Multiverse Bridge Oracle processing your request...
              </Text>
            </Box>
          </VStack>
        </>
      );
    }

    if (summonSubmitted && summonConfirmed === 2) {
      return (
        <>
          <div >
            <div>
              <Text>Unsuccessful summon</Text>
              <Text color="textSecondary" variant="h5">
                It seems you didn't have any metaverse resources to summon, or
                something went wrong. Try again later or contact support.
              </Text>
            </div>
          </div>
        </>
      );
    }

    return (
      <Stack spacing={1} justifyContent="center">
        <Stack className={formBox} spacing={2}>
          <Text className="form-subheader">
            Mint all in-game resources from the metaverse into your connected
            on-chain wallet address:
          </Text>
          <Box alignSelf={'center'}>
            <AddressDisplayComponent
              charsShown={7}
              copyTooltipLabel='Copy address'
            >
              {recipient}
            </AddressDisplayComponent>
          </Box>
          <Text alignSelf={'center'} className="form-subheader">
            Please select the network to summon to.
          </Text>
          <Select

            defaultValue={selectedChainId}
            onChange={(event: any) => {
              setSelectedChainId(event.target.value);
            }}
          >
            {PERMISSIONED_CHAINS.map((chain) => {
              return (
                <option key={NETWORK_NAME[chain]} value={chain}>{NETWORK_NAME[chain]}</option>
              );
            })}
          </Select>
        </Stack>

        <Button
          onClick={() => {
            setSelectedChainId(DEFAULT_CHAIN);
            setSummonSubmitted(true);
            (async () => {
              const success = await summonCallback?.(recipient, selectedChainId);
              setSummonConfirmed(success ? 1 : 2);
            })();
          }}
          className={formButton}
          variant="contained"
          color="primary"
          disabled={selectedChainId === 0}
        >
          Summon
        </Button>
        <Button
          className={formButton}
          onClick={() => {
            handleClose();
            setSelectedChainId(0);
          }}
          color="primary"
        >
          Cancel
        </Button>
      </Stack>
    );
  };




  return (
    <Modal isOpen={isSummonDialogOpen} onClose={() => handleClose()} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>MultiverseBridge: summon</ModalHeader>
        <ModalBody>
          {renderBody()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
