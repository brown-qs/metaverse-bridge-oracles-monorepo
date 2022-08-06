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
import { Text, Box, Container, Grid, List, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack, background, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useCheckboxGroup, useMediaQuery } from '@chakra-ui/react';
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
    return (
        <Container
            background="#080714"
            backgroundPosition="top right"
            backgroundRepeat="no-repeat"
            backgroundSize='630px 816px'
            backgroundImage="bridge-background-blur.svg"
            backgroundBlendMode="hard-light"
            minWidth="100%"
            margin="0"
            padding="0"
            height="100%"
            overflow="visible">
            <Grid
                templateRows={{ base: "275px repeat(5, 450px)", md: '275px repeat(3, 700px)', lg: '275px repeat(2, 700px)' }}
                templateColumns='repeat(12, 1fr)'
                maxW="1440px"
                margin="auto"
                height="100%">



                {/* START WELCOME MESSAGE & PLAYER ELIGIBILITY */}
                <GridItem
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





