import { Avatar, AvatarGroup, Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, Radio, Select, ToastId, useToast, VStack, WrapItem } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checks, Mail, Photo, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { ChainId, DEFAULT_CHAIN, NETWORK_NAME, PERMISSIONED_CHAINS } from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation, useSummonMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { closeSummonModal, selectSummonModalOpen, selectSummonModalSummonAddresses } from "../../state/slices/summonModalSlice";
import uriToHttp from "../../utils/uriToHttp";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";

export function SummonModal() {
    const dispatch = useDispatch()
    const summonAddresses = useSelector(selectSummonModalSummonAddresses)
    const isOpen = useSelector(selectSummonModalOpen)

    const [summonAddress, setSummonAddress] = React.useState<string | undefined>(undefined)

    const [summon, { data, error, isUninitialized, isLoading, isSuccess, isError, reset }] = useSummonMutation()
    const [selectedChainId, setSelectedChainId] = useState<number>(DEFAULT_CHAIN);
    const { account } = useActiveWeb3React();

    const handleClose = () => {
        reset()
        dispatch(closeSummonModal())
    };

    React.useEffect(() => {
        if (!isOpen) {
            setSummonAddress(undefined)
            reset()
        }
    }, [isOpen])

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
            message="Please choose a wallet address with game passes to mint all your in-game resources:"
            bottomButtonText="Cancel"
            onBottomButtonClick={() => { handleClose() }}
        >
            <VStack spacing="0">
                <Box w="100%" >
                    <VStack spacing='0' maxHeight="130px" overflowY="scroll">
                        {summonAddresses.map(sAddress =>
                            <HStack padding="12px" spacing="0" w="100%" h="58px">
                                <Box alignSelf="center" paddingRight="8px" position="relative" top="4px"><Radio isChecked={summonAddress === sAddress.address.toLowerCase()} onChange={(e) => setSummonAddress(e.target.value)} colorScheme="teal" value={sAddress.address.toLowerCase()}></Radio></Box>
                                <Box alignSelf="center" h="100%" flex="1">
                                    <AvatarGroup size='sm' max={4}>
                                        {sAddress.gamePassesFromAddress.map(gp =>
                                            <Avatar icon={<Photo color="var(--chakra-colors-teal-200)"></Photo>} bg="gray.700" name={""} src={uriToHttp(gp?.metadata?.image ?? undefined)?.[0]} />
                                        )}
                                    </AvatarGroup>
                                </Box>
                                <Box alignSelf="center" >
                                    <AddressDisplayComponent
                                        charsShown={7}
                                        copyTooltipLabel='Copy address'
                                    >
                                        {sAddress.address}
                                    </AddressDisplayComponent></Box>
                            </HStack>

                        )}
                    </VStack>


                </Box>
                <Box w="100%" paddingTop="16px">
                    <Select
                        defaultValue={selectedChainId}
                        onChange={(event: any) => {
                            setSelectedChainId(event.target.value);
                        }}
                    >
                        {/* {PERMISSIONED_CHAINS.map((chain) => {
                            return (
                                <option key={chain} value={chain}>{NETWORK_NAME[chain]}</option>
                            );
                        })} */}
                        <option key={ChainId.EXOSAMANETWORK} value={ChainId.EXOSAMANETWORK}>{NETWORK_NAME[ChainId.EXOSAMANETWORK]}</option>
                    </Select>
                </Box>
                <Box w="100%" paddingTop="16px">
                    <Button onClick={() => {
                        setSelectedChainId(DEFAULT_CHAIN);
                        summon({ recipient: summonAddress!, chainId: selectedChainId })
                    }}
                        leftIcon={<Wallet></Wallet>}
                        isDisabled={!summonAddress}
                        w="100%">SUMMON TO WALLET</Button>
                </Box>
            </VStack>
        </ReduxModal >)
    }
}