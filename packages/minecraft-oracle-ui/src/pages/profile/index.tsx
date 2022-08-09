import { useClasses } from 'hooks';
import { AuthData } from 'context/auth/AuthContext/AuthContext.types';

import { useProfile } from 'hooks/multiverse/useProfile';
import { useOnChainItems } from 'hooks/multiverse/useOnChainItems';
import { InGameTexture, useInGameItems } from 'hooks/multiverse/useInGameItems';
import { useAccountDialog, useActiveWeb3React, useImportDialog, useEnraptureDialog } from 'hooks';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useSummonDialog } from 'hooks/useSummonDialog/useSummonDialog';
import { stringToStringAssetType } from 'utils/subgraph';
import { Fraction } from 'utils/Fraction';
import { Media } from '../../components/Media/Media';
import { countGamePassAssets } from 'utils';
import { useAssetDialog } from '../../hooks/useAssetDialog/useAssetDialog';
import { useCallbackSkinEquip } from '../../hooks/multiverse/useCallbackSkinEquip';
import React, { ReactNode, useState } from 'react';
import { SKIN_LABELS } from '../../constants/skins';
import { InGameItemWithStatic } from 'hooks/multiverse/useInGameItems';
import { BURNABLE_RESOURCES_IDS, DEFAULT_CHAIN, NETWORK_NAME } from "../../constants";
import { AssetChainDetails } from '../../components/AssetChainDetails/AssetChainDetails';
import { Image, Text, Box, Container, Grid, List, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack, background, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useCheckboxGroup, useMediaQuery } from '@chakra-ui/react';
import { BridgeTab } from '../../components/Bridge/BridgeTab';
import { InGameItem } from '../../components/Bridge/InGameItem';
import { CaretLeft, CaretRight, DeviceGamepad, UserCircle, Wallet } from 'tabler-icons-react';
import { InGameResource } from '../../components/Bridge/InGameResource';
import { OnChainResources } from '../../components/Bridge/OnChainResources';
import { OnChainItem } from '../../components/Bridge/OnChainItem';
import { check } from 'prettier';
import { ItemDetailsModal } from '../../components/Bridge/ItemDetailsModal';

export type ProfilePagePropTypes = {
    authData: AuthData
};

const ProfilePage = ({ authData }: ProfilePagePropTypes) => {
    const { account, chainId } = useActiveWeb3React()
    const profile = useProfile();
    const playAllowedReasonTexts: any = {
        'MSAMA': 'You are eligible to play because you imported a Moonsama.',
        'TICKET': 'You are eligible to play because you imported a VIP ticket.',
        'TEMPORARY_TICKET': 'You are eligible to play because you imported a game pass.',
        'DEFAULT': 'You are eligible to play because you were given permanent access.',
    }
    const { isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose } = useAccountDialog();

    const [fetchtrigger, setFetchtrigger] = useState<string | undefined>(undefined)

    const { isOpen: isItemDetailDialogOpen, onOpen: onItemDetailDialogOpen, onClose: onItemDetailDialogClose } = useDisclosure()

    const [itemDetailDialogData, setItemDetailDialogData] = useState({} as InGameItemWithStatic);

    const callbackSkinEquip = useCallbackSkinEquip()

    // Dialogs
    const { isImportDialogOpen, onImportDialogOpen, onImportDialogClose, importDialogData, setImportDialogData } = useImportDialog()
    const { isEnraptureDialogOpen, onEnraptureDialogOpen, onEnraptureDialogClose, enraptureDialogData, setEnraptureDialogData } = useEnraptureDialog()
    const { isExportDialogOpen, onExportDialogOpen, onExportDialogClose, exportDialogData, setExportDialogData } = useExportDialog()
    const { isSummonDialogOpen, onSummonDialogOpen, onSummonDialogClose, summonDialogData, setSummonDialogData } = useSummonDialog()
    const { isAssetDialogOpen, onAssetDialogOpen, onAssetDialogClose, assetDialogData, setAssetDialogData } = useAssetDialog()

    //On chain Items
    const { onChainItems, isLoading: onChainItemsLoading } = useOnChainItems();
    const onChainResources = onChainItems.filter((item) => item.collection === "Moonsama Metaverse Asset Factory")
    const onChainBurnableResources = onChainResources.filter(x => BURNABLE_RESOURCES_IDS.includes(x.asset.assetId))
    const onChainImportables = [...onChainItems.filter((item) => ['VIP Ticket', "Moonbrella", "Pondsama", "Moonsama", "Multiverse Art", "Moonsama Minecraft Plots Season 1", "Moonsama Embassy"].includes(item.collection)), ...onChainBurnableResources]

    //In Game Items
    const inGameItems = useInGameItems(fetchtrigger);
    const inGameAssets = (inGameItems?.assets ?? []).filter(x => x.assetAddress.length === 42);
    const inGameResources = inGameItems?.resources ?? []
    const inGameTextures: InGameTexture[] = (inGameItems?.textures ?? []).sort((t1, t2) => t1.assetAddress.localeCompare(t2.assetAddress))

    const canSummon = !!inGameItems?.resources && inGameItems?.resources.length > 0 && !profile?.blacklisted
    const assetCounter = countGamePassAssets(inGameAssets)
    const hasImportedTicket = assetCounter.ticketNum > 0


    // Group checkbox hooks for batch import/export
    const { value: inGameCheckboxGroupValue, isDisabled: isInGameCheckboxGroupDisabled, onChange: onInGameCheckboxGroupChange, setValue: setInGameCheckboxGroupValue, getCheckboxProps: getInGameCheckboxGroupProps } = useCheckboxGroup()
    const { value: onChainCheckboxGroupValue, isDisabled: isOnChainCheckboxGroupDisabled, onChange: onOnChainCheckboxGroupChange, setValue: setOnChainCheckboxGroupValue, getCheckboxProps: getOnChainCheckboxGroupProps } = useCheckboxGroup()

    const [isSmallerThan285] = useMediaQuery('(max-width: 285px)')
    const bgSvg = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgUGl4ZWxtYXRvciBQcm8gMi40LjUgLS0+Cjxzdmcgd2lkdGg9Ijc4OCIgaGVpZ2h0PSI4ODkiIHZpZXdCb3g9IjAgMCA3ODggODg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDxwYXRoIGlkPSJSZWN0YW5nbGUiIGZpbGw9IiMwODA3MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSJub25lIiBkPSJNIDAgODg5IEwgNzg4IDg4OSBMIDc4OCAwIEwgMCAwIFoiLz4KICAgIDxnIGlkPSJHcm91cCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOmhhcmQtbGlnaHQ7aXNvbGF0aW9uOmlzb2xhdGUiPgogICAgICAgIDxmaWx0ZXIgaWQ9ImZpbHRlcjEiIHg9IjAiIHk9IjAiIHdpZHRoPSI3ODgiIGhlaWdodD0iODg5IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIxLjk5NiIvPgogICAgICAgIDwvZmlsdGVyPgogICAgICAgIDxnIGlkPSJnMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlcjEpIj4KICAgICAgICAgICAgPHBhdGggaWQ9IlBhdGgiIGZpbGw9IiMwZWViYTgiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSJub25lIiBkPSJNIDUyNi4xNzc5NzkgNjQwLjc0NDAxOSBDIDUwMC41MTkwMTIgNjMwLjc5NDk4MyA0OTAuMjY1MDE1IDYwMC42Njk5ODMgNDc2LjgyNDAwNSA1NzYuNjU5OTczIEMgNDYzLjY2MTAxMSA1NTMuMTQ4MDEgNDQ4LjA0MDAwOSA1MjkuNTAyMDE0IDQ0OC44MzA5OTQgNTAyLjU4MzAwOCBDIDQ0OS42MjUgNDc1LjU1ODk5IDQ2Mi4yMDk5OTEgNDQ5LjMwMzk4NiA0ODEuMTMyOTk2IDQzMC4wMDY5ODkgQyA0OTguNzE0OTk2IDQxMi4wNzY5OTYgNTI2LjAxNzAyOSA0MTEuMDU5OTk4IDU0OC44NDgwMjIgNDAwLjU4ODAxMyBDIDU3Mi45NzYwMTMgMzg5LjUyMDk5NiA1OTIuODUxOTkgMzYyLjg1NDk4IDYxOS4xMzI5OTYgMzY2LjcxMjAzNiBDIDY0NS4zNjYwMjggMzcwLjU2MjAxMiA2NjEuMTEyOTc2IDM5Ny44Mzg5ODkgNjc2LjYzMDAwNSA0MTkuMzQyMDEgQyA2ODkuOTE0OTc4IDQzNy43NSA2OTkuMTkyOTkzIDQ1OC42MDUwMTEgNzAxLjcxOTk3MSA0ODEuMTUzMDE1IEMgNzA0LjAzNjAxMSA1MDEuODIxMDE0IDY5OC41OTAwMjcgNTIyLjEyNzAxNCA2OTAuMjgzOTk3IDU0MS4xODQwMjEgQyA2ODIuNTEzOTc3IDU1OS4wMTAwMSA2NjkuNDM0OTk4IDU3Mi45MTY5OTIgNjU1LjcxNjk4IDU4Ni42OTc5OTggQyA2NDAuMzEyMDEyIDYwMi4xNzQ5ODggNjI1LjUyMDAyIDYxOC4wOTEwMDMgNjA1LjM2MTAyMyA2MjYuNTAyMDE0IEMgNTgwLjEwNDk4IDYzNy4wMzkwMDEgNTUxLjcxMDk5OSA2NTAuNjQ1MDIgNTI2LjE3Nzk3OSA2NDAuNzQ0MDE5IFoiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGZpbHRlciBpZD0iZmlsdGVyMiIgeD0iMCIgeT0iMCIgd2lkdGg9Ijc4OCIgaGVpZ2h0PSI4ODkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcHJpbWl0aXZlVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMjEuOTk2Ii8+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPGcgaWQ9ImcyIiBmaWx0ZXI9InVybCgjZmlsdGVyMikiPgogICAgICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhckdyYWRpZW50MSIgeDE9IjM4My4yODgiIHkxPSIxNTIuNDY1IiB4Mj0iNjUuMjk3IiB5Mj0iMTk4LjM2MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjE2MyIgc3RvcC1jb2xvcj0iI2ZmYzkxNCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwZWViYTgiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgICAgICA8cGF0aCBpZD0icGF0aDEiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQxKSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9Im5vbmUiIGQ9Ik0gMzA1LjY3NDAxMSAzMTguMzE3OTkzIEMgMjg1LjIzMDAxMSAzMTAuMzkwOTkxIDI3Ny4wNTk5OTggMjg2LjM4OTAzOCAyNjYuMzUwMDA2IDI2Ny4yNTc5OTYgQyAyNTUuODYyIDI0OC41MjM5ODcgMjQzLjQxNiAyMjkuNjg0MDIxIDI0NC4wNDYwMDUgMjA4LjIzNDk4NSBDIDI0NC42NzkwMDEgMTg2LjcwMzk3OSAyNTQuNzA3MDAxIDE2NS43ODUwMzQgMjY5Ljc4Mzk5NyAxNTAuNDA4OTk3IEMgMjgzLjc5Mjk5OSAxMzYuMTIyOTg2IDMwNS41NDU5OSAxMzUuMzEyOTg4IDMyMy43MzcgMTI2Ljk2ODk5NCBDIDM0Mi45NjIwMDYgMTE4LjE1MTAwMSAzNTguNzk5MDExIDk2LjkwMzk5MiAzNzkuNzM4MDA3IDk5Ljk3ODAyNyBDIDQwMC42NDAwMTUgMTAzLjA0NDk4MyA0MTMuMTg3MDEyIDEyNC43Nzg5OTIgNDI1LjU0OTk4OCAxNDEuOTExOTg3IEMgNDM2LjEzNTAxIDE1Ni41NzgwMDMgNDQzLjUyODAxNSAxNzMuMTk1MDA3IDQ0NS41NDA5ODUgMTkxLjE2MTAxMSBDIDQ0Ny4zODU5ODYgMjA3LjYyOTAyOCA0NDMuMDQ2OTk3IDIyMy44MDc5ODMgNDM2LjQyODk4NiAyMzguOTkyMDA0IEMgNDMwLjIzOTAxNCAyNTMuMTk1MDA3IDQxOS44MTY5ODYgMjY0LjI3NTAyNCA0MDguODg2OTkzIDI3NS4yNTU5ODEgQyAzOTYuNjEzMDA3IDI4Ny41ODgwMTMgMzg0LjgyNjk5NiAzMDAuMjY5MDQzIDM2OC43NjUwMTUgMzA2Ljk3MTAwOCBDIDM0OC42NDE5OTggMzE1LjM2NTk2NyAzMjYuMDE4MDA1IDMyNi4yMDcwMzEgMzA1LjY3NDAxMSAzMTguMzE3OTkzIFoiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGZpbHRlciBpZD0iZmlsdGVyMyIgeD0iMCIgeT0iMCIgd2lkdGg9Ijc4OCIgaGVpZ2h0PSI4ODkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcHJpbWl0aXZlVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMjEuOTk2Ii8+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPGcgaWQ9ImczIiBmaWx0ZXI9InVybCgjZmlsdGVyMykiPgogICAgICAgICAgICA8cGF0aCBpZD0icGF0aDIiIGZpbGw9IiNmODRhYTciIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSJub25lIiBkPSJNIDM3MS45NTk5OTEgNTYyLjQyNzk3OSBDIDM0My43NTIwMTQgNTU1LjgwOTAyMSAzMTIuMzkxOTk4IDU0My4zNjIgMjk5LjcyNjk5IDUxNy4yOTk5ODggQyAyODcuMDgzMDA4IDQ5MS4yODEwMDYgMzA1LjcyNzk5NyA0NjEuNTM2OTg3IDMwOC45NjM5ODkgNDMyLjc5ODAwNCBDIDMxMS45MTE5ODcgNDA2LjYxODAxMSAzMDQuMTEyIDM3OC4zMjI5OTggMzE3LjkwMzk5MiAzNTUuODgwOTgxIEMgMzMxLjk0NjAxNCAzMzMuMDMxMDA2IDM1Ny41NjUwMDIgMzE5LjQ0Mjk5MyAzODMuMjkwOTg1IDMxMS44NTE5OSBDIDQwNy41NTQ5OTMgMzA0LjY5Mjk5MyA0MzIuOTkzMDExIDMwOC43OTAwMzkgNDU3LjYwODAwMiAzMTQuNjYxMDExIEMgNDgxLjE3NDAxMSAzMjAuMjgyOTU5IDUwNi42MzggMzI2LjI2NTAxNSA1MjIuMDYyMDEyIDM0NC45NTM5NzkgQyA1MzYuOTgxMDE4IDM2My4wMzEwMDYgNTI5LjM1MTk5IDM5MC4xNzMwMDQgNTM3LjkyNjAyNSA0MTEuOTg0OTg1IEMgNTQ4LjM2MiA0MzguNTMzOTk3IDU4Ni4zOTgwMSA0NTguODM3MDA2IDU3Ny40NzMwMjIgNDg1LjkyMDk5IEMgNTY4LjU3MjAyMSA1MTIuOTM0OTk4IDUyNy4yMzE5OTUgNTA4LjcxNzAxIDUwMS44MzQwMTUgNTIxLjUxNTk5MSBDIDQ4Mi43MzU5OTIgNTMxLjE0MDk5MSA0NjcuMTUxMDAxIDU0NS4zNzQwMjMgNDQ2Ljc1MjAxNCA1NTEuNzk5OTg4IEMgNDIyLjIzOTk5IDU1OS41MjA5OTYgMzk2Ljk4NyA1NjguMzAxMDI1IDM3MS45NTk5OTEgNTYyLjQyNzk3OSBaIi8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K"
    return (
        <Container
            bg="#080714"
            backgroundPosition="top right"
            backgroundRepeat="no-repeat"
            backgroundSize='600px 700px'
            minWidth="100%"
            margin="0"
            padding="0"
            height="100%"
            position="relative"
            overflow="visible">
            <Box position="absolute" w="100%" h="100%" bg="#080714">
                <Image src={bgSvg} w="552px" h="622px" position="absolute" top="0" right="0" opacity=".5" filter="blur(10px)"></Image>
            </Box>
            <Grid
                zIndex="2"
                templateRows={{ base: "275px repeat(5, 450px)", md: '275px repeat(3, 700px)', lg: '275px repeat(2, 700px)' }}
                templateColumns='repeat(12, 1fr)'
                maxW="1440px"
                margin="auto"
                height="100%"
            >




                {/* START WELCOME MESSAGE & PLAYER ELIGIBILITY */}
                <GridItem
                    zIndex="2"
                    padding={{
                        base: "96px 11px 0 11px",
                        md: "96px 40px 0 40px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 12, lg: 12 }}
                    overflow="hidden"
                >
                    <Stack lineHeight="40px" fontSize="32px" textAlign="left" direction={{ base: "column" }}>
                        <Box color="white" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                            Welcome back,
                        </Box>
                        <Box color="yellow.300" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" flex="1">
                            {authData?.userProfile?.email}
                        </Box>
                    </Stack>
                    <HStack marginTop="20px" fontSize="12px">
                        {!profile?.allowedToPlay &&
                            <Box padding="4px 8px" borderRadius="4px" color="white" bg="red.500">BUY YOUR TICKET AT THE MARKETPLACE TO PLAY</Box>
                        }
                        {profile?.allowedToPlay && !profile?.blacklisted &&
                            <Box padding="4px 8px" borderRadius="4px" color="#1B1B3A" bg="teal.200">YOU ARE ELIGIBLE TO PLAY</Box>
                        }
                        {profile?.allowedToPlay && profile?.blacklisted &&
                            <Box padding="4px 8px" borderRadius="4px" color="#1B1B3A" bg="yellow.300">BLACKLISTED, BUT ALLOWED TO PLAY</Box>
                        }
                    </HStack>
                </GridItem>
                {/* END WELCOME MESSAGE & PLAYER ELIGIBILITY */}



                {/* START SKINS */}
                <GridItem
                    zIndex="2"

                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "16px 8px 8px 40px"
                    }}
                    overflow="hidden"
                    rowSpan={1}
                    colSpan={{ base: 12, md: 6, lg: 4 }}
                >
                    <BridgeTab title="Available Skins" icon={<UserCircle size="18px" />}>
                        {!!inGameTextures.length
                            ?
                            <Grid templateColumns='repeat(2, 1fr)' width="100%">
                                {inGameTextures.map((value, ind) => {
                                    const skinLabel = SKIN_LABELS[value.assetAddress.toLowerCase()]
                                    const firstColumn = ind % 2 === 0
                                    const firstRow = ind < 2
                                    return (
                                        < GridItem
                                            paddingTop="100%"
                                            position="relative"
                                            key={`${value?.assetAddress}-${value?.assetId}-${ind}`}

                                            onClick={async () => {
                                                if (!value.equipped) {
                                                    const success = await callbackSkinEquip({
                                                        assetAddress: value.assetAddress,
                                                        assetId: value.assetId,
                                                        assetType: value.assetType
                                                    })
                                                    if (success) {
                                                        setFetchtrigger(Date.now().toString())
                                                    }
                                                }
                                            }}
                                        >
                                            <Box
                                                overflow="hidden"
                                                position="absolute"
                                                top={firstRow ? "12px" : "4px"}
                                                right="12px"
                                                bottom="12px"
                                                left={firstColumn ? "12px" : "4px"}
                                                bg={value.equipped ? "rgba(14, 235, 168, 0.1)" : "inherit"}
                                                _hover={value.equipped ? {} : { bg: "rgba(255, 255, 255, 0.06)" }}
                                                _before={(value.equipped && !isSmallerThan285) ? { content: `"EQUIPPED"`, fontSize: "12px", bg: "teal.400", color: "#16132B", padding: "4px 8px", borderRadius: "8px 0px 4px 0px", marginTop: "100px", position: "absolute", bottom: "-1px", right: "-1px" } : {}}
                                                cursor={value.equipped ? "default" : "pointer"}
                                                borderRadius="4px"
                                                border={value.equipped ? "1px solid" : "1px solid"}
                                                borderColor={value.equipped ? "teal.400" : "transparent"}
                                            >
                                                <Media padding="12%" uri={value.coverURL} />
                                            </Box>
                                        </GridItem >
                                    );
                                })}
                            </Grid>
                            :
                            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                                No available skins found.
                            </Box>
                        }
                    </BridgeTab>
                </GridItem>
                {/* END SKINS */}



                {/* START IN-GAME ITEMS */}
                <GridItem
                    zIndex="2"

                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "16px 40px 8px 8px",
                        lg: "16px 8px 8px 8px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 6, lg: 4 }}
                >
                    <BridgeTab title="In-Game Items"
                        icon={<DeviceGamepad size="18px" />}
                        footer={<Button
                            rightIcon={<CaretRight></CaretRight>}
                            onClick={(e) => {
                                e.stopPropagation();

                                const exportAssets = []
                                for (const hash of inGameCheckboxGroupValue) {
                                    const ass = inGameAssets.find(ass => ass.hash === hash)
                                    if (!!ass) {
                                        exportAssets.push(ass)
                                    }
                                }

                                //just export one items now but we are setup for multiple later
                                if (exportAssets.length > 0) {
                                    const value = exportAssets[0]
                                    onExportDialogOpen();
                                    setExportDialogData(
                                        {
                                            hash: value.hash,
                                            asset: {
                                                assetAddress: value.assetAddress,
                                                assetId: value.assetId,
                                                assetType: stringToStringAssetType(value.assetType),
                                                id: 'x'
                                            },
                                            chain: value.exportChainId,
                                            item: value
                                        }
                                    );
                                }
                            }}
                            isDisabled={inGameCheckboxGroupValue.length === 0} w="100%">EXPORT TO WALLET</Button>}
                    >
                        {!!inGameAssets.length
                            ?
                            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                {inGameAssets.map((value, ind) => {
                                    const labelId = `checkbox-list-secondary-label-${ind}`;
                                    const checkBoxProps = getInGameCheckboxGroupProps({ value: value.hash })
                                    return (
                                        <InGameItem
                                            key={value.hash}
                                            data={value}
                                            isCheckboxDisabled={isInGameCheckboxGroupDisabled}
                                            checkboxValue={value.hash}
                                            isChecked={inGameCheckboxGroupValue.includes(value.hash)}
                                            onCheckboxChange={(e) => {
                                                //hack for now allow only one check
                                                if (e.target.checked) {
                                                    setInGameCheckboxGroupValue([value.hash])
                                                } else {
                                                    setInGameCheckboxGroupValue([])
                                                }

                                                //do this when ready for multiple values
                                                //checkBoxProps.onChange(e)
                                            }}
                                            onClick={() => {
                                                setItemDetailDialogData(value);
                                                onItemDetailDialogOpen();
                                            }}></InGameItem>
                                    );
                                })}
                            </VStack>
                            :
                            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                                No in-game items found.
                            </Box>
                        }

                    </BridgeTab>
                </GridItem>
                {/* END IN-GAME ITEMS */}



                {/* START ON-CHAIN ITEMS */}
                <GridItem
                    zIndex="2"

                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "8px 8px 8px 40px",
                        lg: "16px 40px 8px 8px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 6, lg: 4 }}
                >
                    <BridgeTab
                        title="On-Chain Items"
                        isLoading={onChainItemsLoading}
                        icon={<Wallet size="18px" />}
                        footer={
                            <Button
                                leftIcon={<CaretLeft></CaretLeft>}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const importAssets = []
                                    for (const id of onChainCheckboxGroupValue) {
                                        const ass = onChainItems.find(ass => ass.id === id)
                                        if (!!ass) {
                                            importAssets.push(ass)
                                        }
                                    }
                                    if (importAssets.length > 0) {
                                        const item = importAssets[0]
                                        if (item.importable) {
                                            onImportDialogOpen();
                                            setImportDialogData({ asset: item.asset });
                                        } else if (item.enrapturable) {
                                            onEnraptureDialogOpen();
                                            setEnraptureDialogData({ asset: item.asset });
                                        }
                                    }

                                    /*
                                    onImportDialogOpen();
                                    setImportDialogData({ asset: item.asset });*/

                                }}
                                isDisabled={onChainCheckboxGroupValue.length === 0} w="100%">IMPORT TO GAME
                            </Button>}
                    >
                        {!!onChainImportables.length
                            ?
                            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                {onChainImportables.map((item, ind) => {
                                    const checkBoxProps = getOnChainCheckboxGroupProps({ value: item.id })

                                    return (
                                        <OnChainItem
                                            data={item}
                                            key={item.id} //update key
                                            isCheckboxDisabled={isOnChainCheckboxGroupDisabled}
                                            checkboxValue={item.id}
                                            isChecked={onChainCheckboxGroupValue.includes(item.id)}
                                            onCheckboxChange={(e) => {
                                                //hack for now allow only one check
                                                if (e.target.checked) {
                                                    setOnChainCheckboxGroupValue([item.id])
                                                } else {
                                                    setOnChainCheckboxGroupValue([])
                                                }

                                                //do this when ready for multiple values
                                                //checkBoxProps.onChange(e)
                                            }}
                                        >
                                        </OnChainItem>
                                    );
                                })}
                            </VStack>
                            :
                            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                                No items found in wallet.
                            </Box>
                        }
                    </BridgeTab>
                </GridItem>
                {/* END ON-CHAIN ITEMS */}



                {/* START IN-GAME RESOURCES */}
                <GridItem
                    zIndex="2"

                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "8px 40px 8px 8px",
                        lg: "8px 8px 16px 40px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 6, lg: 6 }}
                >
                    <BridgeTab
                        title="In-Game Resources"
                        footer={
                            <Button
                                rightIcon={<CaretRight></CaretRight>}
                                onClick={() => {
                                    if (!!account) {
                                        onSummonDialogOpen();
                                        setSummonDialogData({ recipient: account ?? undefined });
                                    } else {
                                        onAccountDialogOpen()
                                    }
                                }}
                                isDisabled={!canSummon} w="100%">SUMMON ALL RESOURCES
                            </Button>
                        }
                        icon={<DeviceGamepad size="18px" />}
                    >
                        {!!inGameResources.length
                            ?
                            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                {inGameResources.map(resource =>
                                    <InGameResource key={`${resource.assetAddress}-${resource.assetId}`} data={resource}></InGameResource>
                                )}
                            </VStack>
                            :
                            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                                No in-game resources available
                            </Box>
                        }
                    </BridgeTab>
                </GridItem>
                {/* END IN-GAME RESOURCES */}



                {/* START ON-CHAIN RESOURCES */}
                <GridItem
                    zIndex="2"
                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "8px 40px 16px 40px",
                        lg: "8px 40px 16px 8px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 12, lg: 6 }}
                >
                    <BridgeTab
                        title="On-Chain Resources"
                        isLoading={onChainItemsLoading}
                        icon={<Wallet size="18px" />}>
                        {!!onChainResources.length
                            ?
                            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                {onChainResources.map((value) => {
                                    return (
                                        <OnChainResources
                                            data={value}
                                            key={value?.asset?.assetId}
                                            onClick={() => {
                                                //user will be able to see resources in their metamask wallet as under assets, nothing is moving
                                                onAssetDialogOpen()
                                                setAssetDialogData({
                                                    title: value?.staticData?.name,
                                                    image: value?.meta?.imageRaw,
                                                    assetERC1155: value?.asset,
                                                    assetAddressERC20: value?.staticData?.subAssetAddress
                                                })
                                                //window.open(getExplorerLink(chainId ?? ChainId.MOONRIVER, value.asset.assetAddress,'address'))
                                            }}
                                        >
                                        </OnChainResources>
                                    )
                                })}
                            </VStack>
                            :
                            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                                No resources found in wallet.
                            </Box>
                        }
                    </BridgeTab>
                </GridItem>
                {/* END ON-CHAIN RESOURCES */}


            </Grid >

            <ItemDetailsModal data={itemDetailDialogData} isOpen={isItemDetailDialogOpen} onClose={onItemDetailDialogClose}></ItemDetailsModal>
        </Container >
    )
};

export default ProfilePage;





