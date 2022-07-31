import { useClasses } from 'hooks';
import { styles } from './styles';

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
import { Text, Box, Container, Grid, List, ListIcon, ListItem, Stack, Tooltip, Button, Flex, SimpleGrid, GridItem, VStack, HStack } from '@chakra-ui/react';
import { BridgeTab } from '../../components/Bridge/BridgeTab';
import { InGameItem } from '../../components/Bridge/InGameItem';
import { DeviceGamepad, UserCircle, Wallet } from 'tabler-icons-react';
import { InGameResource } from '../../components/Bridge/InGameResource';

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

    const [itemDetailDialogOpen, setItemDetailDialogOpen] = useState<boolean>(false);
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


    const skinsElem = inGameTextures.sort((t1, t2) => t1.assetAddress.localeCompare(t2.assetAddress)).map((value, ind) => {

        const skinLabel = SKIN_LABELS[value.assetAddress.toLowerCase()]
        //<a target='_blank' className={itemImage} href={`${value.renderURL ? `https://minerender.org/embed/skin/?skin=${value.renderURL}` : value.coverURL}`} rel="noreferrer">
        return (

            < GridItem key={`${value?.assetAddress}-${value?.assetId}-${ind}`} _before={{ content: `""`, paddingBottom: "100%", display: "block" }
            } backgroundImage={`url(${value.coverURL})`} backgroundRepeat="no-repeat" backgroundSize="contain" cursor="pointer" backgroundPosition="center" sx={{ backgroundSize: "auto 75%" }}>

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
        return (
            <InGameItem key={`${value?.assetAddress}-${value?.assetId}-${ind}`} data={value} onClick={() => {
                setItemDetailDialogData(value);
                setItemDetailDialogOpen(true);
            }}></InGameItem>
        );
    })
    const inGameItemListElem = (<> {/* Start In Game Items */}
        <VStack spacing="8px" width="100%" padding="8px 11px 8px 11px">
            {inGameItemsElem}
        </VStack>
        {/*
        <Dialog
            open={itemDetailDialogOpen}
            onClose={() => {
                setItemDetailDialogOpen(false)
            }}
            title={'Item details'}
            maxWidth="sm"
            fullWidth
        >
            <div >
                <Grid  justifyContent="center">
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
                                    {itemDetailDialogData.exportable ? <Tooltip title={'This item can be exported back to the chain it came from to the original owner address.'}>
                                        <div>This item is exportable.</div>
                                    </Tooltip> : <Tooltip title={'This item is burned into the metaverse forever. Cannot be taken back.'}>
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
        </Dialog>*/}
        {/* End In Game Items */}</>)

    const onChainItemsElem = (<><List sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
        {!!onChainImportables.length ? (onChainGoldenTickets ?? []).map((item, ind) => {
            return (
                <ListItem
                    key={`${item?.asset?.assetAddress}-${item?.asset?.assetId}-${ind}`} //update key

                >
                    <Box>
                        <ListIcon >
                            {/*<img className={itemImage} src={item?.meta?.image} alt="" />*/}
                            <Media uri={item?.meta?.image} />
                        </ListIcon>
                        <Text style={{ paddingLeft: '10px' }}> {`${item?.meta?.name}${item?.asset?.assetAddress?.toLowerCase() !== '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a' ? ` #${item?.asset?.assetId}` : ''}`}  </Text>
                        <Tooltip title={'You can have 1 VIP ticket imported at a time.'}>
                            <span>
                                <Button
                                    onClick={() => {
                                        onImportDialogOpen();
                                        setImportDialogData({ asset: item.asset });
                                    }}
                                    isDisabled={hasImportedTicket}
                                >Import to game</Button>
                            </span>
                        </Tooltip>
                    </Box>
                </ListItem>
            );
        }).concat(
            [...(onChainBurnableResources ?? []), ...(onChainArt ?? []), ...(onChainPlot ?? []), ...(onChainMoonbrella ?? []), ...(onChainEmbassy ?? []), ...(onChainMoonsamas ?? []), ...(onChainPondsamas ?? [])].map((item, ind) => {
                return (
                    <ListItem
                        key={`${item?.asset?.assetAddress}-${item?.asset?.assetId}-${ind}`} //update key

                    >
                        <Box>
                            <ListIcon >
                                {/*<img className={itemImage} src={item?.meta?.image} alt="" />*/}
                                <Media uri={item?.meta?.image} />
                            </ListIcon>
                            <Text style={{ paddingLeft: '10px' }}> {`${item?.meta?.name}${item?.asset?.assetAddress?.toLowerCase() !== '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a' ? ` #${item?.asset?.assetId}` : ''}`}  </Text>
                            {item.importable && <Tooltip title={`Your imported ${item?.meta?.name} will bound to your Minecraft account. It will go back to the sender address when exported.`}>
                                <span>
                                    <Button
                                        onClick={() => {
                                            onImportDialogOpen();
                                            setImportDialogData({ asset: item.asset });
                                        }}
                                    >Import to game</Button>
                                </span>
                            </Tooltip>}
                            {item.enrapturable && <Tooltip title={`Your ${item?.meta?.name} will be enraptured (burned) and bound to your Minecraft account forever.`}>
                                <span>
                                    <Button
                                        onClick={() => {
                                            onEnraptureDialogOpen();
                                            setEnraptureDialogData({ asset: item.asset });
                                        }}
                                    >Burn into game</Button>
                                </span>
                            </Tooltip>}
                        </Box>
                    </ListItem>
                );
            })
        ) : (

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

            <VStack spacing="8px" width="100%" padding="8px 11px 8px 11px">
                {inGameResourcesElem}
            </VStack>

        ) :
            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                No in-game resources available
            </Box>
        }
    </>)


    const onChainResourcesElem = (<> <List sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>

        {!!onChainResources.length ? onChainResources.map((value) => {
            const labelId = value?.asset?.assetId;
            return (
                <ListItem
                    key={value?.asset.assetId}
                    /*
                    secondaryAction={
                        <>{Fraction.from(value?.asset?.balance, 18)?.toFixed(2)}</>
                    }*/

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
                    <Box>
                        <ListIcon>
                            <img src={value?.meta?.image} alt="" />
                        </ListIcon>
                        <Text id={labelId}>{value?.meta?.name}</Text>
                    </Box>
                </ListItem>
            );
        }) :
            <Box padding="24px" color="white" textAlign="left" w="100%" fontFamily='Rubik'>
                No resources found in wallet.
            </Box>
        }
    </List></>)


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
                        <Box textAlign="left" w="100%" color="#FCD14E">
                            {authData?.userProfile?.email}
                        </Box>
                        <Box textAlign="left" w="100%">
                            {profile?.allowedToPlay ? (
                                <Tooltip placement='bottom' title={playAllowedReasonTexts[profile.allowedToPlayReason] ?? playAllowedReasonTexts['DEFAULT']}>
                                    <span style={{ color: '#0EEBA8', fontSize: '16px', fontWeight: 'bold' }}>{profile?.blacklisted ? `You are blacklisted but can play` : `You are eligible to play!`}</span>
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
                    <BridgeTab title="In-Game Items" icon={<DeviceGamepad size="18px" />}>
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
                    <BridgeTab title="On-Chain Items" icon={<Wallet size="18px" />}>
                        {onChainItemsElem}
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
                    <BridgeTab title="In-Game Resources" footer={<Button onClick={() => {
                        if (!!account) {
                            onSummonDialogOpen();
                            setSummonDialogData({ recipient: account ?? undefined });
                        } else {
                            onAccountDialogOpen()
                        }
                    }}
                        isDisabled={!canSummon} w="100%">Summon All Resources</Button>} icon={<DeviceGamepad size="18px" />}>
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
                        {onChainResourcesElem}
                    </BridgeTab>
                </GridItem>
            </Grid >
        </Container >
    )
};

export default ProfilePage;





