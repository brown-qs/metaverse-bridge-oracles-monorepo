
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
import { VStack, Box, Button, CircularProgress, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack, Text, HStack } from '@chakra-ui/react';
import { Checks, CircleCheck, Wallet } from 'tabler-icons-react';
import { MoonsamaModal } from '../MoonsamaModal';
import { useSummonMutation } from '../../state/api/bridgeApi';

export const SummonDialog = () => {
  const [summon, { data, error, isUninitialized, isLoading, isSuccess, isError, reset }] = useSummonMutation()

  const { isSummonDialogOpen, onSummonDialogOpen, onSummonDialogClose, summonDialogData, setSummonDialogData } = useSummonDialog();
  const [selectedChainId, setSelectedChainId] = useState<number>(DEFAULT_CHAIN);



  const { account } = useActiveWeb3React();

  const handleClose = () => {
    reset()
    onSummonDialogClose();
  };

  const recipient = account ?? summonDialogData?.recipient ?? undefined;

  const summonCallback = useSummonCallback();

  /*
        TablerIcon={MessageReport}
      iconBackgroundColor="yellow.300"
      iconColor="black"
  */
  if (!!data && data === true) {
    return (<MoonsamaModal
      title="Summon request received!"
      TablerIcon={Checks}
      iconBackgroundColor="teal.200"
      iconColor="black"
      isOpen={isSummonDialogOpen}
      onClose={handleClose}
      message="Sit back and relax. Depending on the number of requests and network trafic the transaction could take some time."
      closeOnOverlayClick={false}
    >
      <VStack spacing="0">
        <Box w="100%">
          <Button
            leftIcon={<Checks />}
            onClick={() => handleClose()}
            w="100%">GOT IT!</Button>
        </Box>
      </VStack >

    </MoonsamaModal >)
  } else if (isLoading) {
    return (<MoonsamaModal
      title="Summon resources"
      isOpen={isSummonDialogOpen}
      onClose={() => {
        setSelectedChainId(0)
        handleClose()
      }}
      message="Your request is being processed."
      closeOnOverlayClick={false}
    >
      <VStack alignItems="center">
        <CircularProgress isIndeterminate color="teal"></CircularProgress>
      </VStack>
    </MoonsamaModal>)
  } else if (isError || (!!data && data === false)) {
    return (<MoonsamaModal
      title="Summon resources"
      isOpen={isSummonDialogOpen}
      onClose={handleClose}
      message="It seems you didn't have any metaverse resources to summon, or something went wrong. Try again later or contact support."
      closeOnOverlayClick={false}
    ></MoonsamaModal>)
  } else {
    return (<MoonsamaModal
      title="Summon resources"
      isOpen={isSummonDialogOpen}
      onClose={handleClose}
      message="You are about to mint all your in-game resources to your on-chain wallet address:"
      closeOnOverlayClick={false}
      bottomButtonText="Cancel"
      onBottomButtonClick={handleClose}
    >
      <VStack spacing="0">
        <Box w="100%" h="48px" bg="whiteAlpha.100" borderRadius="8px">
          <HStack padding="12px">
            <Box flex="1" color="whiteAlpha.700">Address</Box>
            <Box><AddressDisplayComponent
              charsShown={7}
              copyTooltipLabel='Copy address'
            >
              {recipient}
            </AddressDisplayComponent></Box>

          </HStack>
        </Box>
        <Box w="100%" paddingTop="16px">
          <Select
            defaultValue={selectedChainId}
            onChange={(event: any) => {
              setSelectedChainId(event.target.value);
            }}
          >
            {PERMISSIONED_CHAINS.map((chain) => {
              return (
                <option key={chain} value={chain}>{NETWORK_NAME[chain]}</option>
              );
            })}
          </Select>
        </Box>
        <Box w="100%" paddingTop="16px">
          <Button onClick={() => {
            setSelectedChainId(DEFAULT_CHAIN);
            summon({ recipient: account ?? "", chainId: selectedChainId })
          }}
            leftIcon={<Wallet></Wallet>}
            isDisabled={false && selectedChainId === 0}
            w="100%">SUMMON TO WALLET</Button>
        </Box>
      </VStack>
    </MoonsamaModal >)
  }

};
