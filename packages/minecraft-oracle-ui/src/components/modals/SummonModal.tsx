import { Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, Select, ToastId, useToast, VStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checks, Mail, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { DEFAULT_CHAIN, NETWORK_NAME, PERMISSIONED_CHAINS } from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation, useSummonMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { closeSummonModal, selectSummonModalOpen } from "../../state/slices/summonModalSlice";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";

export function SummonModal() {
    const dispatch = useDispatch()
    const [summon, { data, error, isUninitialized, isLoading, isSuccess, isError, reset }] = useSummonMutation()
    const [selectedChainId, setSelectedChainId] = useState<number>(DEFAULT_CHAIN);
    const { account } = useActiveWeb3React();

    const handleClose = () => {
        reset()
        dispatch(closeSummonModal())
    };

    const recipient = account

    const baseProps = {
        isOpenSelector: selectSummonModalOpen,
        closeActionCreator: closeSummonModal,
        iconBackgroundColor: "var(--chakra-colors-teal-200)",
        iconColor: "var(--chakra-colors-gray-800)",
        closeOnOverlayClick: false,
    }

    if (!!data && data === true) {
        return (<ReduxModal
            {...baseProps}
            title="Summon request received!"
            TablerIcon={Checks}
            message="Sit back and relax. Depending on the number of requests and network trafic the transaction could take some time."
        >
            <VStack spacing="0">
                <Box w="100%">
                    <Button
                        leftIcon={<Checks />}
                        onClick={() => handleClose()}
                        w="100%">GOT IT!</Button>
                </Box>
            </VStack >

        </ReduxModal >)
    } else if (isLoading) {
        return (<ReduxModal
            {...baseProps}
            title="Summon resources"
            message="Your request is being processed."
        >
            <VStack alignItems="center">
                <CircularProgress isIndeterminate color="teal"></CircularProgress>
            </VStack>
        </ReduxModal>)
    } else if (isError || (!!data && data === false)) {
        return (<ReduxModal
            {...baseProps}
            title="Summon resources"
            message="It seems you didn't have any metaverse resources to summon, or something went wrong. Try again later or contact support."
        ></ReduxModal>)
    } else {
        return (<ReduxModal
            {...baseProps}
            title="Summon resources"
            message="You are about to mint all your in-game resources to your on-chain wallet address:"
            bottomButtonText="Cancel"
            onBottomButtonClick={() => { handleClose() }}
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
        </ReduxModal >)
    }
}