import { Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Apps, Checks, Mail } from "tabler-icons-react";
import { ReduxModal } from ".";
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation, useOauthAuthorizeMutation, useOauthInfoQuery } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { closeOauthModal, selectOauthData, selectOauthModalOpen, setOauthData } from "../../state/slices/oauthSlice";
import { MoonsamaSpinner } from "../MoonsamaSpinner";

export function OauthModal() {
    const isOpen = useSelector(selectOauthModalOpen)
    const reduxOauthData = useSelector(selectOauthData)

    const dispatch = useDispatch()
    const { search } = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(search)
    const { data: oauthData, isLoading: isOauthDataLoading, isFetching: isOauthDataFetch, isError: isOauthDataError, error: oauthDataError } = useOauthInfoQuery(searchParams.get("client_id") || "")
    const [oauthAuthorize, { data: oauthAuthorizeData, error: oauthAuthorizeError, isUninitialized: isOauthAuthorizeUninitialized, isLoading: isOauthAuthorizeLoading, isSuccess: isOauthAuthorizeSuccess, isError: isOauthAuthorizeError, reset: oauthAuthorizeReset }] = useOauthAuthorizeMutation()
    const [willRedirect, setWillRedirect] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (!isOpen) {
            oauthAuthorizeReset()
            setWillRedirect(false)
        }
    }, [isOpen])

    React.useEffect(() => {
        if (!!oauthData) {
            dispatch(setOauthData(oauthData))
        }
    }, [oauthData])

    React.useEffect(() => {
        if (!!oauthAuthorizeData) {
            //redirect is not immediate and some javascript is execute so lets block some buttons
            setWillRedirect(true)
            window.location.href = oauthAuthorizeData.url
        }
    }, [oauthAuthorizeData])


    const baseProps = {
        isOpenSelector: selectOauthModalOpen,
        closeActionCreator: closeOauthModal,
        TablerIcon: Apps,
        iconBackgroundColor: "var(--chakra-colors-teal-200)",
        iconColor: "var(--chakra-colors-gray-800)",
        title: "OAUTH",
        closeable: false,
        closeOnOverlayClick: false,
        bottomButtonText: "Cancel",
        onBottomButtonClick: () => { navigate("/") }
    }
    if (isOauthDataLoading) {
        return (<ReduxModal
            {...baseProps}
            message="Loading OAuth parameters."
        >
            <MoonsamaSpinner />
        </ReduxModal>)
    } else if (!!reduxOauthData && !isOauthAuthorizeError) {

        return (<ReduxModal
            {...baseProps}
            message={`${oauthData?.appName} is requesting access to:`}
            isBottomButtonDisabled={willRedirect}
        >
            <VStack spacing="0" w="100%">
                {oauthData?.scopes.map(scope => {
                    return <Box w="100%" textAlign='left'>{scope.prettyScope}</Box>
                })}
                <Box h="24px"></Box>
                <Box w="100%">
                    <Button w="100%" leftIcon={<Checks></Checks>} isDisabled={willRedirect} isLoading={isOauthAuthorizeLoading} onClick={() => {
                        oauthAuthorize(searchParams)
                    }} >ACCEPT</Button>
                </Box>
            </VStack>
        </ReduxModal>)
    } else if (!!oauthAuthorizeError) {
        return (<ReduxModal
            {...baseProps}
            message={`Error authorizing OAuth.`}
        >
            <Box>{rtkQueryErrorFormatter(oauthAuthorizeError)}</Box>
            <Box>Please refresh your browser and try again.</Box>
        </ReduxModal>)
    } else {
        return (<ReduxModal
            {...baseProps}
            message={`Error fetching OAuth paramters.`}
        >
            <Box>{rtkQueryErrorFormatter(oauthDataError)}</Box>
            <Box>Please refresh your browser and try again.</Box>
        </ReduxModal>)
    }
}