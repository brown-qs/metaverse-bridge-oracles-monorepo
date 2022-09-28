import { Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Apps, Checks, Mail } from "tabler-icons-react";
import { ReduxModal } from ".";
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation, useOauthInfoQuery } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { closeOauthModal, selectOauthData, selectOauthModalOpen, setOauthData } from "../../state/slices/oauthSlice";
import { MoonsamaSpinner } from "../MoonsamaSpinner";

export function OauthModal() {
    const isOpen = useSelector(selectOauthModalOpen)
    const reduxOauthData = useSelector(selectOauthData)

    const dispatch = useDispatch()
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const { data: oauthData, isLoading: isOauthDataLoading, isFetching: isOauthDataFetch, isError: isOauthDataError, error: oauthDataError } = useOauthInfoQuery(searchParams.get("client_id") || "")


    React.useEffect(() => {
        if (!!oauthData) {
            dispatch(setOauthData(oauthData))
        }
    }, [oauthData])



    const baseProps = { isOpenSelector: selectOauthModalOpen, closeActionCreator: closeOauthModal, TablerIcon: Apps, iconBackgroundColor: "var(--chakra-colors-teal-200)", iconColor: "var(--chakra-colors-gray-800)", title: "OAUTH", closeable: false, closeOnOverlayClick: false, bottomButtonText: "Cancel" }
    if (isOauthDataLoading) {
        return (<ReduxModal
            {...baseProps}
            message="Loading OAuth parameters."
        >
            <MoonsamaSpinner />
        </ReduxModal>)
    } else if (!!reduxOauthData) {

        return (<ReduxModal
            {...baseProps}
            message={`${oauthData?.appName} is requesting access to:`}
        >
            <VStack spacing="0" w="100%">
                {oauthData?.scopes.map(scope => {
                    return <Box w="100%" textAlign='left'>{scope.prettyScope}</Box>
                })}
                <Box h="24px"></Box>
                <Box w="100%">
                    <Button w="100%" leftIcon={<Checks></Checks>} isDisabled={false} onClick={() => {

                    }} >ACCEPT</Button>
                </Box>
            </VStack>
        </ReduxModal>)

    } else {
        return (<ReduxModal
            {...baseProps}
            message={`Dont know wtf is going on`}
        >
            <Button isDisabled={false} style={{ marginTop: "10px", maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { }} >ACCEPT</Button>
            <Button isDisabled={false} style={{ marginTop: "10px", maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { }} >DECLINE</Button>
        </ReduxModal>)
    }
}