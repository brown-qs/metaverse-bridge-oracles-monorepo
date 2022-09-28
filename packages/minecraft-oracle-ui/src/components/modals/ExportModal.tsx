import { Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checks, Mail } from "tabler-icons-react";
import { ReduxModal } from ".";
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";

export function ExportModal() {

    return (<><ReduxModal

        isOpenSelector={selectEmailCodeModalOpen}
        closeActionCreator={closeEmailCodeModal}
        TitleTablerIcon={Mail}
        title="EMAIL"
        message="Input the one-time login code that you received."
    >

    </ReduxModal>
    </>
    )
}