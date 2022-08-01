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
import { Text, Box, Container, Grid, List, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack, background, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useCheckboxGroup } from '@chakra-ui/react';
import { BridgeTab } from '../../components/Bridge/BridgeTab';
import { InGameItem } from '../../components/Bridge/InGameItem';
import { CaretLeft, CaretRight, DeviceGamepad, UserCircle, Wallet } from 'tabler-icons-react';
import { InGameResource } from '../../components/Bridge/InGameResource';
import { OnChainResources } from '../../components/Bridge/OnChainResources';
import { OnChainItem } from '../../components/Bridge/OnChainItem';
import { check } from 'prettier';

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
    const onChainItems = useOnChainItems();
    const onChainMoonsamas = onChainItems?.['Moonsama'] ?? [];
    const onChainPondsamas = onChainItems?.['Pondsama'] ?? [];
    const onChainGoldenTickets = onChainItems?.['VIP Ticket'] ?? [];
    const onChainResources = onChainItems?.['Moonsama Metaverse Asset Factory'] ?? [];
    const onChainPlot = onChainItems?.['Moonsama Minecraft Plots Season 1'] ?? [];
    const onChainArt = onChainItems?.['Multiverse Art'] ?? [];
    const onChainMoonbrella = onChainItems?.['Moonbrella'] ?? [];
    const onChainEmbassy = onChainItems?.['Moonsama Embassy'] ?? [];

    // TODO fixme
    const onChainBurnableResources = onChainResources.filter(x => BURNABLE_RESOURCES_IDS.includes(x.asset.assetId))

    const onChainImportables = [...onChainBurnableResources, ...onChainGoldenTickets, ...onChainMoonbrella, ...onChainPondsamas, ...onChainMoonsamas, ...onChainArt, ...onChainPlot, ...onChainEmbassy];

    //In Game Items
    const inGameItems = useInGameItems(fetchtrigger);
    const inGameAssets = (inGameItems?.assets ?? []).filter(x => x.assetAddress.length === 42);
    const inGameResources = inGameItems?.resources ?? []
    const inGameTextures: InGameTexture[] = inGameItems?.textures ?? []

    const canSummon = !!inGameItems?.resources && inGameItems?.resources.length > 0 && !profile?.blacklisted
    const assetCounter = countGamePassAssets(inGameAssets)
    const hasImportedTicket = assetCounter.ticketNum > 0


    const { value: inGameCheckboxGroupValue, isDisabled: isInGameCheckboxGroupDisabled, onChange: onInGameCheckboxGroupChange, setValue: setInGameCheckboxGroupValue, getCheckboxProps: getInGameCheckboxGroupProps } = useCheckboxGroup()
    const { value: onChainCheckboxGroupValue, isDisabled: isOnChainCheckboxGroupDisabled, onChange: onOnChainCheckboxGroupChange, setValue: setOnChainCheckboxGroupValue, getCheckboxProps: getOnChainCheckboxGroupProps } = useCheckboxGroup()


    const skinsElem = inGameTextures.sort((t1, t2) => t1.assetAddress.localeCompare(t2.assetAddress)).map((value, ind) => {

        const skinLabel = SKIN_LABELS[value.assetAddress.toLowerCase()]
        //<a target='_blank' className={itemImage} href={`${value.renderURL ? `https://minerender.org/embed/skin/?skin=${value.renderURL}` : value.coverURL}`} rel="noreferrer">
        const firstColumn = ind % 2 === 0
        const firstRow = ind < 2
        return (
            < GridItem
                paddingTop="100%"
                position="relative"
                //                margin={evenIndex ? "0px 12px 0px 12px" : "12px 12px 12px 0px"}
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
                    position="absolute"
                    top={firstRow ? "12px" : "4px"}
                    right="12px"
                    bottom="12px"
                    left={firstColumn ? "12px" : "4px"}
                    bg={value.equipped ? "rgba(14, 235, 168, 0.1)" : "inherit"}
                    _hover={value.equipped ? {} : { bg: "rgba(255, 255, 255, 0.06)" }}
                    _before={value.equipped ? { content: `"EQUIPPED"`, fontSize: "12px", bg: "teal.500", color: "#16132B", padding: "4px 8px", borderRadius: "8px 0px 0px 0px", marginTop: "100px", position: "absolute", bottom: "0", right: "0" } : {}}
                    cursor={value.equipped ? "default" : "pointer"}
                    borderRadius="4px"
                    border={value.equipped ? "1px solid" : "1px solid"}
                    borderColor={value.equipped ? "teal.500" : "transparent"}
                    padding="12%"
                >
                    <Media uri={value.coverURL} />
                </Box>
            </GridItem >
        );

    })
    const skinListElem = (<>
        {!!inGameTextures.length
            ?
            <Grid templateColumns='repeat(2, 1fr)' width="100%">
                {skinsElem}
            </Grid>

            : (
                <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                    No available skins found.
                </Box>
            )
        }
    </>)

    const inGameItemsElem = inGameAssets.map((value, ind) => {
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
                    //checkBoxProps.onChange(e)
                }}
                onClick={() => {
                    setItemDetailDialogData(value);
                    onItemDetailDialogOpen();
                }}></InGameItem>
        );
    })
    const inGameItemListElem = (<> {/* Start In Game Items */}
        <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
            {inGameItemsElem}
        </VStack>
        {
            <Modal isOpen={isItemDetailDialogOpen} onClose={onItemDetailDialogClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Item details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div >
                            <Grid justifyContent="center">
                                <Grid >
                                    <Box >
                                        <div >
                                            <div >Item type</div>
                                            <div >
                                                {itemDetailDialogData.recognizedAssetType}
                                            </div>
                                        </div>
                                        <div >
                                            <div >
                                                {itemDetailDialogData.enraptured ? 'This item is enraptured.' : 'This item is imported.'}
                                            </div>
                                        </div>
                                        <div >
                                            <div >
                                                {itemDetailDialogData.exportable ? <Tooltip label={'This item can be exported back to the chain it came from to the original owner address.'}>
                                                    <div>This item is exportable.</div>
                                                </Tooltip> : <Tooltip label={'This item is burned into the metaverse forever. Cannot be taken back.'}>
                                                    <div>This item is not exportable.</div>
                                                </Tooltip>}
                                            </div>
                                        </div>
                                        <div >
                                            <div >
                                                {`Bridge balance: ${itemDetailDialogData.amount}`}
                                            </div>
                                        </div>
                                        {itemDetailDialogData.exportable && <AssetChainDetails data={itemDetailDialogData} borderOn={false} />}
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>
                    </ModalBody>
                </ModalContent>

            </Modal>}
        {/* End In Game Items */}</>)

    const onChainItemsElem = (<>{(onChainGoldenTickets ?? []).map((item, ind) => {
        const key = `${item?.asset?.assetAddress}-${item?.asset?.assetId}-${ind}`
        //    const checkBoxProps = getInGameCheckboxGroupProps({ value: key })

        return (
            <OnChainItem
                data={item}
                key={key} //update key
                isCheckboxDisabled={isOnChainCheckboxGroupDisabled}
                checkboxValue={key}
                isChecked={onChainCheckboxGroupValue.includes(key)}
                onCheckboxChange={(e) => {
                    //hack for now allow only one check
                    if (e.target.checked) {
                        setOnChainCheckboxGroupValue([key])
                    } else {
                        setOnChainCheckboxGroupValue([])
                    }
                    //checkBoxProps.onChange(e)
                }}
            >
            </OnChainItem>
        );
    }).concat(
        [...(onChainBurnableResources ?? []), ...(onChainArt ?? []), ...(onChainPlot ?? []), ...(onChainMoonbrella ?? []), ...(onChainEmbassy ?? []), ...(onChainMoonsamas ?? []), ...(onChainPondsamas ?? [])].map((item, ind) => {
            const key = `${item?.asset?.assetAddress}-${item?.asset?.assetId}-${ind}`

            return (
                <OnChainItem
                    key={key} //update key
                    isCheckboxDisabled={isOnChainCheckboxGroupDisabled}
                    checkboxValue={key}
                    isChecked={onChainCheckboxGroupValue.includes(key)}
                    onCheckboxChange={(e) => {
                        //hack for now allow only one check
                        if (e.target.checked) {
                            setOnChainCheckboxGroupValue([key])
                        } else {
                            setOnChainCheckboxGroupValue([])
                        }
                        //checkBoxProps.onChange(e)
                    }}
                    data={item}
                >

                </OnChainItem>
            );
        }))}</>)

    const onChainItemsListElem = (<><List sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
        {!!onChainImportables.length
            ?
            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                {onChainItemsElem}
            </VStack>
            : (

                <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                    No items found in wallet.
                </Box>
            )}
    </List>
    </>)


    const inGameResourcesElem = inGameResources.map(resource => {
        return (
            <InGameResource key={`${resource.assetAddress}-${resource.assetId}`} data={resource}></InGameResource>
        )
    })
    const inGameResourcesListElem = (<>
        {!!inGameResources.length ? (

            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                {inGameResourcesElem}
            </VStack>

        ) :
            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                No in-game resources available
            </Box>
        }
    </>)

    const onChainResourcesElem = (<>{onChainResources.map((value) => {
        const labelId = value?.asset?.assetId;
        return (
            <OnChainResources
                data={value}
                key={value?.asset.assetId}


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
    })}</>)
    const onChainResourcesListElem = (<>

        {!!onChainResources.length
            ?
            <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                {onChainResourcesElem}
            </VStack>

            :
            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                No resources found in wallet.
            </Box>
        }
    </>)


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
            height={{ base: "100%", md: "max(calc(100vh - 80px), 100%)", xl: "max(calc(100vh - 64px), 100%)" }}
            overflow="visible">
            <Grid templateRows={{ base: "200px repeat(5, 450px)", md: '275px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', lg: '275px minmax(0, 1fr) minmax(0, 1fr)' }} templateColumns='repeat(12, 1fr)' maxW="1440px" margin="auto" height={{ base: "100%", md: "max(calc(100vh - 80px), 800px)", xl: "max(calc(100vh - 64px), 800px)" }}>



                <GridItem
                    padding={{
                        base: "0 11px 0 11px",
                        md: "0 40px 0 40px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 12, lg: 12 }}
                >
                    <VStack h="100%" paddingTop="40px">
                        <Box textAlign="left" w="100%" color="white">
                            Welcome back,
                        </Box>
                        <Box textAlign="left" w="100%" color="yellow.300">
                            {authData?.userProfile?.email}
                        </Box>
                        <Box textAlign="left" w="100%">
                            {profile?.allowedToPlay ? (
                                <Tooltip label={playAllowedReasonTexts[profile.allowedToPlayReason] ?? playAllowedReasonTexts['DEFAULT']}>
                                    <Text color="teal.500">{profile?.blacklisted ? `You are blacklisted but can play` : `You are eligible to play!`}</Text>
                                </Tooltip>
                            ) : (
                                <p style={{ color: '#DB3B21' }}>To be eligible to play, bridge a VIP ticket/Moonsama, <br /> or <a href="https://moonsama.com/freshoffers" target="_blank" rel="noreferrer">visit the Marketplace to get one</a></p>
                            )
                            }
                        </Box>
                    </VStack>
                </GridItem>



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
                        {skinListElem}
                    </BridgeTab>
                </GridItem>



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
                        {inGameItemListElem}
                    </BridgeTab>
                </GridItem>



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
                        icon={<Wallet size="18px" />}
                        footer={<Button
                            leftIcon={<CaretLeft></CaretLeft>}
                            onClick={(e) => {
                                e.stopPropagation();
                                /*
                                const importAssets = []
                                for (const hash of onChainCheckboxGroupValue) {
                                    const ass = onChainItems.find(ass => ass.hash === hash)
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
                            isDisabled={false} w="100%">IMPORT TO GAME</Button>}
                    >
                        {onChainItemsListElem}
                    </BridgeTab>
                </GridItem>



                <GridItem
                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "8px 40px 8px 8px",
                        lg: "8px 8px 16px 40px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 6, lg: 6 }}
                >
                    <BridgeTab title="In-Game Resources" footer={<Button
                        rightIcon={<CaretRight></CaretRight>}
                        onClick={() => {
                            if (!!account) {
                                onSummonDialogOpen();
                                setSummonDialogData({ recipient: account ?? undefined });
                            } else {
                                onAccountDialogOpen()
                            }
                        }}
                        isDisabled={!canSummon} w="100%">SUMMON ALL RESOURCES</Button>} icon={<DeviceGamepad size="18px" />}>
                        {inGameResourcesListElem}
                    </BridgeTab>
                </GridItem>


                <GridItem
                    padding={{
                        base: "16px 11px 8px 11px",
                        md: "8px 40px 16px 40px",
                        lg: "8px 40px 16px 8px"
                    }}
                    rowSpan={1}
                    colSpan={{ base: 12, md: 12, lg: 6 }}
                >
                    <BridgeTab title="On-Chain Resources" icon={<Wallet size="18px" />}>
                        {onChainResourcesListElem}
                    </BridgeTab>
                </GridItem>
            </Grid >
        </Container >
    )
};

export default ProfilePage;





