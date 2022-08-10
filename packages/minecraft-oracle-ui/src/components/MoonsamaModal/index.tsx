import { Box, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Icon } from "tabler-icons-react";
import { ModalIcon } from "./ModalIcon";

export const MoonsamaModal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, message?: string, bottomButtonText?: string, onBottomButtonClick?: () => void, TablerIcon?: Icon, iconBackgroundColor?: string, iconColor?: string, closeOnOverlayClick?: boolean, children?: ReactNode }> = ({ isOpen, onClose, title, message, bottomButtonText, onBottomButtonClick, TablerIcon, iconBackgroundColor, iconColor, closeOnOverlayClick, children }) => {
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
                            <Box
                                fontSize="16px"
                                lineHeight="24px"
                                paddingBottom="16px"
                            >
                                {title}
                            </Box>
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
