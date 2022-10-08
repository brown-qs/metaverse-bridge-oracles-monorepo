import { Box, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Icon } from "tabler-icons-react";
import { ModalIcon } from "./ModalIcon";

export type MoonModal = React.FC<{
    isOpen: boolean,
    onClose: () => void,
    title?: string,
    TitleTablerIcon?: Icon
    message?: string,
    bottomButtonText?: string,
    onBottomButtonClick?: () => void,
    TablerIcon?: Icon,
    iconBackgroundColor?: string,
    iconColor?: string,
    closeOnOverlayClick?: boolean,
    children?: ReactNode
}>
export const MoonsamaModal: MoonModal = ({ isOpen, onClose, title, TitleTablerIcon, message, bottomButtonText, onBottomButtonClick, TablerIcon, iconBackgroundColor, iconColor, closeOnOverlayClick, children }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={closeOnOverlayClick}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <VStack alignItems="flex-start" marginTop="16px" marginBottom="16px" spacing="0">
                        {TablerIcon &&
                            <Box marginBottom="16px">
                                <ModalIcon TablerIcon={TablerIcon} backgroundColor={iconBackgroundColor ? iconBackgroundColor : "inherit"} iconColor={iconColor ? iconColor : "inherit"}></ModalIcon>
                            </Box>
                        }
                        {!!title &&
                            <HStack
                                spacing="0"
                                fontSize="16px"
                                lineHeight="24px"
                                paddingBottom="16px"
                            >
                                {TitleTablerIcon && <Box paddingRight="6px"><TitleTablerIcon color="#3BEFB8" size="21px"></TitleTablerIcon></Box>}
                                <Box >{title}</Box>

                            </HStack>
                        }
                        {!!message &&
                            <Box
                                fontSize="16px"
                                lineHeight="24px"
                                paddingBottom="16px"
                                fontFamily="Rubik"
                                color="whiteAlpha.700"
                            >
                                {message}
                            </Box>
                        }
                        <Box w="100%" h="100%" fontFamily={"Rubik"}>{children}</Box>
                        {bottomButtonText &&
                            <>
                                <Box paddingTop="16px"></Box>
                                <Box
                                    alignSelf="center"
                                    cursor="pointer"
                                    lineHeight="24px"
                                    fontFamily="Rubik"
                                    color="whiteAlpha.700"
                                    onClick={onBottomButtonClick}
                                >{bottomButtonText}</Box></>}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
};
