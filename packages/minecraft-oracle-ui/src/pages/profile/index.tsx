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
import { countGamePassAssets } from 'utils';
import { useAssetDialog } from '../../hooks/useAssetDialog/useAssetDialog';
import { useCallbackSkinEquip } from '../../hooks/multiverse/useCallbackSkinEquip';
import React, { ReactNode, useEffect, useState } from 'react';
import { SKIN_LABELS } from '../../constants/skins';
import { InGameItemWithStatic } from 'hooks/multiverse/useInGameItems';
import { BURNABLE_RESOURCES_IDS, DEFAULT_CHAIN, NETWORK_NAME } from "../../constants";
import { AssetChainDetails } from '../../components/AssetChainDetails/AssetChainDetails';
import { Image, Text, Box, Container, Grid, List, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack, background, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useCheckboxGroup, useMediaQuery, CircularProgress } from '@chakra-ui/react';
import { BridgeTab } from '../../components/Bridge/BridgeTab';
import { InGameItem } from '../../components/Bridge/InGameItem';
import { CaretLeft, CaretRight, DeviceGamepad, UserCircle, Wallet } from 'tabler-icons-react';
import { InGameResource } from '../../components/Bridge/InGameResource';
import { OnChainResource } from '../../components/Bridge/OnChainResource';
import { OnChainItem } from '../../components/Bridge/OnChainItem';
import { ItemDetailsModal } from '../../components/Bridge/ItemDetailsModal';
import BackgroundImage from '../../assets/images/bridge-background-blur.svg'
import { useSetSkinMutation, useGetSkinsQuery, useUserProfileQuery, useGetRecognizedAssetsQuery } from '../../state/api/bridgeApi';

import { SkinResponse } from '../../state/api/types';
import { useGetOnChainTokensQuery } from '../../state/api/generatedSquidMarketplaceApi';
import { Media } from '../../components';
import { BigNumber } from 'ethers';


const ProfilePage = () => {
    const { account, chainId } = useActiveWeb3React()

    const { data: profile, error, isLoading: profileLoading } = useUserProfileQuery()
    const { data: skins, error: skinsError, isLoading: skinsLoading } = useGetSkinsQuery()
    const [setSkin, { error: setSkinError, isUninitialized, isLoading, isSuccess, isError, reset: setSkinReset }] = useSetSkinMutation()
    const { data: onChainTokensData, isLoading: isOnChainTokensLoading, isFetching: isOnChainTokensFetching, isError: isOnChainTokensError, error: onChainTokensError } = useGetOnChainTokensQuery({ owner: account ?? "0x999999999999999999999999999" })
    const { data: recognizedAssetsData, isLoading: isRecognizedAssetsLoading, isFetching: isRecognizedAssetsFetching, isError: isRecognizedAssetsError, error: recognizedAssetsError } = useGetRecognizedAssetsQuery()

    useEffect(() => {
        console.log(JSON.stringify(recognizedAssetsData))
    }, [recognizedAssetsData])
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



    //In Game Items
    const inGameItems = useInGameItems(fetchtrigger);
    const inGameAssets = (inGameItems?.assets ?? []).filter(x => x.assetAddress.length === 42);
    const inGameResources = inGameItems?.resources ?? []

    const canSummon = !!inGameItems?.resources && inGameItems?.resources.length > 0 && !profile?.blacklisted
    const assetCounter = countGamePassAssets(inGameAssets)
    const hasImportedTicket = assetCounter.ticketNum > 0


    // Group checkbox hooks for batch import/export
    const { value: inGameCheckboxGroupValue, isDisabled: isInGameCheckboxGroupDisabled, onChange: onInGameCheckboxGroupChange, setValue: setInGameCheckboxGroupValue, getCheckboxProps: getInGameCheckboxGroupProps } = useCheckboxGroup()
    const { value: onChainCheckboxGroupValue, isDisabled: isOnChainCheckboxGroupDisabled, onChange: onOnChainCheckboxGroupChange, setValue: setOnChainCheckboxGroupValue, getCheckboxProps: getOnChainCheckboxGroupProps } = useCheckboxGroup()

    const [isSmallerThan285] = useMediaQuery('(max-width: 285px)')

    const skinToImageUrl = (skin: SkinResponse): string | undefined => {
        const decoded = Buffer.from(skin.textureData, 'base64').toString()
        const textureURL = !!decoded ? JSON.parse(decoded)?.textures?.SKIN?.url : undefined
        const coverURL = !!textureURL ? `https://api.mineskin.org/render/skin?url=${textureURL}` : undefined
        return coverURL
    }

    const onChainItems = React.useMemo(() => {
        if (!!onChainTokensData && !!recognizedAssetsData) {

            //need to filter out erc1155 that the last transfer went to the connected wallet
            let ownedErc1155 = onChainTokensData?.erc1155TokenOwners?.filter(tok => tok?.token?.transfers?.[0].to?.id?.toLowerCase() === account?.toLowerCase())
            //add balance for erc1155s
            const combinedTokens = [...ownedErc1155.map(tok => ({ balance: tok.balance, ...tok.token })), ...onChainTokensData?.erc721Tokens].sort((a, b) => a.id.localeCompare(b.id))
            return combinedTokens
        } else {
            return undefined
        }
    }, [onChainTokensData, recognizedAssetsData])
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
                <Image src={BackgroundImage} w="552px" h="622px" position="absolute" top="0" right="0" filter="blur(10px)"></Image>
            </Box>
            {profileLoading
                ?
                <VStack className="moonsamaFullHeight">
                    <HStack h="100%">
                        <CircularProgress isIndeterminate color="teal"></CircularProgress>
                    </HStack>

                </VStack>
                :
                <>
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
                                <Box fontFamily="heading" color="white" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                                    Welcome back,
                                </Box>
                                <Box fontFamily="heading" color="yellow.300" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" flex="1">
                                    {profile?.email}
                                </Box>
                            </Stack>
                            <HStack marginTop="20px" fontSize="12px">
                                {!profile?.allowedToPlay &&
                                    <Box fontFamily="heading" padding="4px 8px" borderRadius="4px" color="white" bg="red.500">BUY YOUR TICKET AT THE MARKETPLACE TO PLAY</Box>
                                }
                                {profile?.allowedToPlay && !profile?.blacklisted &&
                                    <Box fontFamily="heading" padding="4px 8px" borderRadius="4px" color="#1B1B3A" bg="teal.200">YOU ARE ELIGIBLE TO PLAY</Box>
                                }
                                {profile?.allowedToPlay && profile?.blacklisted &&
                                    <Box fontFamily="heading" padding="4px 8px" borderRadius="4px" color="#1B1B3A" bg="yellow.300">BLACKLISTED, BUT ALLOWED TO PLAY</Box>
                                }
                            </HStack>
                        </GridItem>
                        {/* END WELCOME MESSAGE & PLAYER ELIGIBILITY */}



                        {/* START SKINS */}
                        <GridItem
                            zIndex="2"

                            padding={{
                                base: "16px 11px 7px 11px",
                                md: "16px 8px 7px 40px"
                            }}
                            overflow="hidden"
                            rowSpan={1}
                            colSpan={{ base: 12, md: 6, lg: 4 }}
                        >
                            <BridgeTab
                                title="Available Skins"
                                emptyMessage={!!skins ? undefined : "No available skins found."}
                                icon={<UserCircle size="18px" />}
                                isLoading={skinsLoading}
                            >
                                {!!skins &&
                                    <Grid templateColumns='repeat(2, 1fr)' width="100%">
                                        {[...skins].sort((t1, t2) => t1.assetAddress.localeCompare(t2.assetAddress)).map((value, ind) => {
                                            const skinLabel = SKIN_LABELS[value.assetAddress.toLowerCase()]
                                            const firstColumn = ind % 2 === 0
                                            const firstRow = ind < 2
                                            return (
                                                < GridItem
                                                    paddingTop="100%"
                                                    position="relative"
                                                    key={`${value?.assetAddress}-${value?.assetId}-${ind}`}

                                                    onClick={() => {
                                                        //dont set a skin thats already set
                                                        if (!value.equipped) {
                                                            setSkin({
                                                                id: value.id,
                                                                assetAddress: value.assetAddress,
                                                                assetId: value.assetId,
                                                                assetType: value.assetType
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        overflow="visible"
                                                        position="absolute"
                                                        top={firstRow ? "12px" : "4px"}
                                                        right="12px"
                                                        bottom="12px"
                                                        left={firstColumn ? "12px" : "4px"}
                                                        bg={value.equipped ? "rgba(14, 235, 168, 0.1)" : "inherit"}
                                                        _hover={value.equipped ? {} : { bg: "rgba(255, 255, 255, 0.06)" }}
                                                        _after={(value.equipped && !isSmallerThan285) ? { fontFamily: "heading", content: `"EQUIPPED"`, fontSize: "12px", bg: "teal.400", color: "#16132B", padding: "4px 8px", borderRadius: "8px 0px 4px 0px", marginTop: "100px", position: "absolute", bottom: "-1px", right: "-1px" } : {}}
                                                        cursor={value.equipped ? "default" : "pointer"}
                                                        borderRadius="4px"
                                                        border={value.equipped ? "1px solid" : "1px solid"}
                                                        borderColor={value.equipped ? "teal.400" : "transparent"}
                                                    >
                                                        <Media imageProps={{ objectFit: "contain" }} padding="12%" uri={skinToImageUrl(value)} />
                                                    </Box>
                                                </GridItem >
                                            );
                                        })}

                                    </Grid>
                                }
                            </BridgeTab>
                        </GridItem>
                        {/* END SKINS */}



                        {/* START IN-GAME ITEMS */}
                        <GridItem
                            zIndex="2"

                            padding={{
                                base: "16px 11px 6px 11px",
                                md: "16px 40px 6px 8px",
                                lg: "16px 8px 6px 8px"
                            }}
                            rowSpan={1}
                            colSpan={{ base: 12, md: 6, lg: 4 }}
                        >
                            <BridgeTab title="In-Game Items"
                                emptyMessage={"No in-game items found."}
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

                                <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                    {inGameAssets.map((value, ind) => {
                                        const labelId = `checkbox-list-secondary-label-${ind}`;
                                        const checkBoxProps = getInGameCheckboxGroupProps({ value: value.hash })
                                        return (

                                            <></>
                                        );
                                    })}
                                </VStack>


                            </BridgeTab>
                        </GridItem>
                        {/* END IN-GAME ITEMS */}



                        {/* START ON-CHAIN ITEMS */}
                        <GridItem
                            zIndex="2"

                            padding={{
                                base: "16px 11px 6px 11px",
                                md: "8px 8px 6px 40px",
                                lg: "16px 40px 6px 8px"
                            }}
                            rowSpan={1}
                            colSpan={{ base: 12, md: 6, lg: 4 }}
                        >
                            <BridgeTab
                                title="On-Chain Items"
                                emptyMessage={!!onChainItems ? undefined : "No items found in wallet."}
                                isLoading={isOnChainTokensLoading}
                                icon={<Wallet size="18px" />}
                                footer={
                                    <Button
                                        leftIcon={<CaretLeft></CaretLeft>}
                                        onClick={(e) => {
                                            /*
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
                                            }*/

                                            /*
                                            onImportDialogOpen();
                                            setImportDialogData({ asset: item.asset });*/

                                        }}
                                        isDisabled={onChainCheckboxGroupValue.length === 0} w="100%">IMPORT TO GAME
                                    </Button>}
                            >

                                <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                    {!!onChainItems && onChainItems.map((item, ind) => {
                                        const checkBoxProps = getOnChainCheckboxGroupProps({ value: item.id })

                                        return (
                                            <OnChainItem
                                                lineOne={item?.metadata?.name}
                                                mediaUrl={item?.metadata?.image ?? ""}
                                                isLoading={false}
                                                key={item.id} //update key
                                                isCheckboxDisabled={isOnChainCheckboxGroupDisabled ?? true}
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


                            </BridgeTab>
                        </GridItem>
                        {/* END ON-CHAIN ITEMS */}



                        {/* START IN-GAME RESOURCES */}
                        <GridItem
                            zIndex="2"

                            padding={{
                                base: "16px 11px 6px 11px",
                                md: "8px 40px 6px 8px",
                                lg: "8px 8px 14px 40px"
                            }}
                            rowSpan={1}
                            colSpan={{ base: 12, md: 6, lg: 6 }}
                        >
                            <BridgeTab
                                title="In-Game Resources"
                                emptyMessage={"No in-game resources available."}
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
                                <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">
                                    {inGameResources.map(resource =>
                                        <></>
                                    )}
                                </VStack>
                            </BridgeTab>
                        </GridItem>
                        {/* END IN-GAME RESOURCES */}



                        {/* START ON-CHAIN RESOURCES */}
                        <GridItem
                            zIndex="2"
                            padding={{
                                base: "16px 11px 7px 11px",
                                md: "8px 40px 15px 40px",
                                lg: "8px 40px 15px 8px"
                            }}
                            rowSpan={1}
                            colSpan={{ base: 12, md: 12, lg: 6 }}
                        >
                            <BridgeTab
                                title="On-Chain Resources"
                                emptyMessage="No resources found in wallet."
                                isLoading={isOnChainTokensLoading}
                                icon={<Wallet size="18px" />}>

                                <VStack spacing="8px" width="100%" padding="8px 12px 8px 12px">

                                    {/**onChainResources.map((value) => {
                                        return (
                                            <OnChainResource
                                                lineOne="Fuck me"
                                                mediaUrl=""
                                                balanceWei={BigNumber.from("1")}
                                                isLoading={false}
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
                                            </OnChainResource>
                                        )
                                    })*/}
                                </VStack>

                            </BridgeTab>
                        </GridItem>
                        {/* END ON-CHAIN RESOURCES */}


                    </Grid >

                    <ItemDetailsModal data={itemDetailDialogData} isOpen={isItemDetailDialogOpen} onClose={onItemDetailDialogClose}></ItemDetailsModal>
                </>
            }
        </Container >
    )
};

export default ProfilePage;





