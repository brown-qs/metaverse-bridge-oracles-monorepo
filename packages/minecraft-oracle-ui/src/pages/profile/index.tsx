import { Button } from 'ui';
import Stack from '@mui/material/Stack';
import { Header } from 'ui';
import { useClasses } from 'hooks';
import { styles } from './styles';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import { Typography, Box, Divider } from '@material-ui/core';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Tooltip from '@mui/material/Tooltip';

import { Dialog } from 'ui';

import { AuthData } from 'context/auth/AuthContext/AuthContext.types';

import { AddressDisplayComponent } from 'components/form/AddressDisplayComponent';

import { useProfile } from 'hooks/multiverse/useProfile';
import { useOnChainItems } from 'hooks/multiverse/useOnChainItems';
import { InGameTexture, useInGameItems } from 'hooks/multiverse/useInGameItems';
import { useAccountDialog, useActiveWeb3React, useImportDialog, useEnraptureDialog } from 'hooks';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useSummonDialog } from 'hooks/useSummonDialog/useSummonDialog';
import { stringToStringAssetType } from 'utils/subgraph';
import { Fraction } from 'utils/Fraction';
import { Media } from '../../components/Media/Media';
import { countRecognizedAssets } from 'utils';
import { useAssetDialog } from '../../hooks/useAssetDialog/useAssetDialog';
import { useCallbackSkinEquip } from '../../hooks/multiverse/useCallbackSkinEquip';
import React, { useState } from 'react';
import { SKIN_LABELS } from '../../constants/skins';
import { InGameItemWithStatic } from 'hooks/multiverse/useInGameItems';

export type ProfilePagePropTypes = {
    authData: AuthData
};

const ProfilePage = ({ authData }: ProfilePagePropTypes) => {

    const { account, chainId } = useActiveWeb3React()
    const profile = useProfile();
    const playAllowedReasonTexts: any = {
        'MSAMA': 'You are eligible to play because you imported a Moonsama.',
        'TICKET': 'You are eligible to play because you imported a VIP ticket.',
        'TEMPORARY_TICKET': 'You are eligible to play because you were given permanent access.',
    }
    const { setAccountDialogOpen } = useAccountDialog();

    const [fetchtrigger, setFetchtrigger] = useState<string | undefined>(undefined)

    const [itemDetailDialogOpen, setItemDetailDialogOpen] = useState<boolean>(false);
    const [itemDetailDialogData, setItemDetailDialogData] = useState({} as InGameItemWithStatic);

    const callbackSkinEquip = useCallbackSkinEquip()

    // Dialogs
    const { setImportDialogOpen, setImportDialogData } = useImportDialog()
    const { setEnraptureDialogOpen, setEnraptureDialogData } = useEnraptureDialog()
    const { setExportDialogOpen, setExportDialogData } = useExportDialog()
    const { setSummonDialogOpen, setSummonDialogData } = useSummonDialog()
    const { setAssetDialogOpen, setAssetDialogData } = useAssetDialog()

    //On chain Items
    const onChainItems = useOnChainItems();
    const onChainMoonsamas = onChainItems?.['Moonsama'] ?? [];
    const onChainGoldenTickets = onChainItems?.['VIP Ticket'] ?? [];
    const onChainResources = onChainItems?.['Moonsama Metaverse Asset Factory'] ?? [];
    const onChainPlot = onChainItems?.['Moonsama Minecraft Plots Season 1'] ?? [];
    const onChainArt = onChainItems?.['Multiverse Art'] ?? [];
    const onChainMoonbrella = onChainItems?.['Moonbrella'] ?? [];
    const onChainEmbassy = onChainItems?.['Moonsama Embassy'] ?? [];

    const onChainImportables = [...onChainGoldenTickets, ...onChainMoonbrella, ...onChainMoonsamas, ...onChainArt, ...onChainPlot, ...onChainEmbassy];

    console.log('VIP Ticket', onChainGoldenTickets)
    console.log('onChainMoonbrella', onChainMoonbrella)
    console.log('onChainEmbassy', onChainEmbassy)

    //In Game Items
    const inGameItems = useInGameItems(fetchtrigger);
    const inGameAssets = inGameItems?.assets ?? [];
    const inGameResources = inGameItems?.resources ?? []
    const inGameTextures: InGameTexture[] = inGameItems?.textures ?? []

    //console.log('ingame items', inGameItems, { inGameAssets, inGameResources, inGameTextures })

    // const { jwt, userProfile } = authData;

    const {
        profileContainer,
        divider,
        dialogContainer,
        transferButton,
        statBox,
        columnTitle,
        columnTitleText,
        statBoxInfo,
        transferButtonMid,
        transferButtonSmall,
        headerImage,
        itemImage,
        formBox,
        formLabel,
        formValue,
        formValueTokenDetails,
        row,
        col,
        skinComponent
    } = useClasses(styles);

    const canSummon = !!inGameItems?.resources && inGameItems?.resources.length > 0
    const assetCounter = countRecognizedAssets(inGameAssets)
    const hasImportedMoonsama = assetCounter.moonsamaNum > 0
    const hasImportedTicket = assetCounter.ticketNum > 0
    console.log({inGameAssets})
    return (
        <Grid className={profileContainer}>
            <Header />
            <Grid container justifyContent="center" style={{ marginTop: '30px' }} spacing={4}>
                <div style={{ width: '50%', textAlign: 'left' }}>
                    <span style={{ fontSize: '38px', fontFamily: `VT323, 'arial'`, }}>Available skins</span> <br />
                </div>
                <div style={{ width: '50%', textAlign: 'right' }}>
                    <span style={{ fontSize: '22px', }}>Welcome back {authData?.userProfile?.userName},</span> <br />
                    {profile?.allowedToPlay ? (
                        <Tooltip placement='bottom' title={playAllowedReasonTexts[profile.allowedToPlayReason]}>
                            <span style={{ color: '#12753A', fontSize: '16px', fontWeight: 'bold' }}>You are eligible to play!</span>
                        </Tooltip>
                        ) :
                        (
                            <p style={{ color: '#DB3B21' }}>To be eligible to play, bridge a VIP ticket/Moonsama, <br /> or <a href="https://moonsama.com/freshoffers" target="_blank">visit the Marketplace to get one</a></p>)}
                </div>
                <Grid container justifyContent="center" style={{ marginTop: '20px', background: '#111' }} spacing={4}>
                    <Stack
                        direction={{ xs: 'row', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={4}
                        overflow='auto'
                    >
                        {!!inGameTextures.length ? inGameTextures.sort((t1, t2) => t1.assetAddress.localeCompare(t2.assetAddress)).map((value, ind) => {

                            console.log('SKIN', value)

                            const skinLabel = SKIN_LABELS[value.assetAddress.toLowerCase()]

                            return (
                                <Stack
                                    direction={{ xs: 'column', sm: 'column' }}
                                    alignItems="center"
                                    key={`${value?.assetAddress}-${value?.assetId}-${ind}`} //update key
                                    className={`${skinComponent} ${value.equipped ? 'selected' : ''}`}
                                    gridRow='1'
                                >
                                    {value.coverURL && <Tooltip placement='left' title={`${skinLabel?.[value.assetId]?.label ?? skinLabel?.label ?? 'Available in-game skin'}${value.assetAddress !== '0x0' ? ` Because you imported ${value.name} #${value.assetId}`: ''}`}>
                                        <a target='_blank' href={`${value.renderURL ? `https://minerender.org/embed/skin/?skin=${value.renderURL}` : value.coverURL}`}>
                                            <Media uri={value.coverURL} className={itemImage} style={{ marginTop: `${value.equipped ? 'none' : '15px'}` }} />
                                        </a>
                                    </Tooltip>}
                                    {!value.equipped ? <Button
                                        className={transferButtonMid}
                                        disabled={value.equipped}
                                        onClick={async () => {
                                            const success = await callbackSkinEquip({
                                                assetAddress: value.assetAddress,
                                                assetId: value.assetId,
                                                assetType: value.assetType
                                            })
                                            if (success) {
                                                setFetchtrigger(Date.now().toString())
                                            }
                                        }}
                                    >Equip
                                    </Button> : <>Equipped</>
                                    }
                                </Stack>
                            );
                        }) : (
                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                No available skins found.
                            </div>
                        )}
                    </Stack>
                </Grid>
                <div style={{ width: '100%', marginTop: '40px', textAlign: 'left' }}>
                    <span style={{ fontSize: '38px', fontFamily: `VT323, 'arial'`, }}>Multiverse bridge</span>
                </div>
                <Grid container justifyContent="center" style={{ marginTop: '20px' }} spacing={4}>
                    <Grid item md={12} xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={4}
                        >
                            <div style={{ width: '50%' }}>
                                <div className={columnTitle}><span className={columnTitleText}>In-game items: Metaverse</span></div>
                                <List dense sx={{ width: '100%', bgcolor: '#111' }}>
                                    {!!inGameAssets.length ? inGameAssets.map((value, ind) => {
                                        const labelId = `checkbox-list-secondary-label-${ind}`;
                                        return (
                                            <ListItem
                                                key={`${value?.assetAddress}-${value?.assetId}-${ind}`} //update key
                                                disablePadding
                                            >
                                                <ListItemButton onClick={() => {
                                                    setItemDetailDialogData(value);
                                                    setItemDetailDialogOpen(true);
                                                }}>
                                                    <ListItemAvatar>
                                                        {/*<img className={itemImage} src={value?.meta?.image} alt="" />*/}
                                                        <Media uri={value?.meta?.image} className={itemImage} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={value?.meta?.name ?? `${value.assetAddress} ${value.assetId}`} />
                                                    {value?.exportable && (
                                                    <Tooltip title={'Your exported asset will go back to the sender address you imported from. Associated skin wil be unavailable.'}>
                                                        <Button
                                                            className={transferButtonMid}
                                                            onClick={() => {
                                                                if (!!account) {
                                                                    setExportDialogOpen(true);
                                                                    setExportDialogData(
                                                                        {
                                                                            hash: value.hash,
                                                                            asset: {
                                                                                assetAddress: value.assetAddress,
                                                                                assetId: value.assetId,
                                                                                assetType: stringToStringAssetType(value.assetType),
                                                                                id: 'x'
                                                                            }
                                                                        }
                                                                    );
                                                                } else {
                                                                    setAccountDialogOpen(true)
                                                                }
                                                            }}
                                                        >
                                                            Export to wallet
                                                        </Button>
                                                    </Tooltip>
                                                    )}
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    }) : (
                                        <ListItem>
                                            No items found in game.
                                        </ListItem>
                                    )}
                                </List>
                                <Dialog
                                    open={itemDetailDialogOpen}
                                    onClose={() => {
                                        setItemDetailDialogOpen(false)
                                    }}
                                    title={'Item Detail'}
                                    maxWidth="md"
                                    >
                                    <div className={dialogContainer}>
                                        <Grid container spacing={1} justifyContent="center">
                                        <Grid item md={12} xs={12}>
                                            <Box className={formBox}>
                                                <div className={row}>
                                                    <div className={formLabel}>Item Type</div>
                                                    <div className={`${formValue} ${formValueTokenDetails}`}>
                                                    {itemDetailDialogData.recognizedAssetType}
                                                    </div>
                                                </div>
                                                <div className={row}>
                                                    <div className={`${formValue} ${formValueTokenDetails}`}>
                                                    {itemDetailDialogData.enraptured ? 'This item is enraptured.' : 'This item is imported.'}
                                                    </div>
                                                </div>
                                                <div className={row}>
                                                    <div className={`${formValue} ${formValueTokenDetails}`}>
                                                    {itemDetailDialogData.exportable ? 'This item is exportable.' : 'This item is not exportable.'}
                                                    </div>
                                                </div>
                                                {itemDetailDialogData.exportable ? (
                                                    <React.Fragment>
                                                        <div className={row}>
                                                        <div className={formLabel}>Export Chain Name: </div>
                                                        <div className={`${formValue} ${formValueTokenDetails}`}>
                                                            {itemDetailDialogData.exportChainName}
                                                        </div>
                                                        </div>
                                                        <div className={row}>
                                                        <div className={formLabel}>Export Address:</div>
                                                        <div className={`${formValue} ${formValueTokenDetails}`}>
                                                        {itemDetailDialogData.exportAddress}
                                                        </div>
                                                        </div>
                                                    </React.Fragment>
                                                ) : null}
                                            <Divider variant="fullWidth" className={divider} />
                                            </Box>
                                        </Grid>
                                        </Grid>
                                    </div>
                                </Dialog>
                            </div>
                            <div style={{ width: '50%' }}>
                                <div className={columnTitle}><span className={columnTitleText}>On-chain items: Moonriver account</span></div>
                                <List dense sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
                                    {!!onChainImportables.length ? (onChainGoldenTickets ?? []).map((item, ind) => {
                                        return (
                                            <ListItem
                                                key={`${item?.asset?.assetAddress}-${item?.asset?.assetId}-${ind}`} //update key
                                                disablePadding
                                            >
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        {/*<img className={itemImage} src={item?.meta?.image} alt="" />*/}
                                                        <Media uri={item?.meta?.image} className={itemImage} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={item?.meta?.name} />
                                                    <Tooltip title={'You can have 1 VIP ticket imported at a time.'}>
                                                        <span>
                                                            <Button
                                                                className={transferButtonSmall}
                                                                onClick={() => {
                                                                    setImportDialogOpen(true);
                                                                    setImportDialogData({ asset: item.asset });
                                                                }}
                                                                disabled={hasImportedTicket}
                                                            >Import to game</Button>
                                                        </span>
                                                    </Tooltip>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    }).concat(
                                        [...(onChainArt ?? []), ...(onChainPlot ?? []), ...(onChainMoonbrella ?? []), ...(onChainEmbassy ?? []), ...(onChainMoonsamas ?? [])].map((item, ind) => {
                                            return (
                                                <ListItem
                                                    key={`${item?.asset?.assetAddress}-${item?.asset?.assetId}-${ind}`} //update key
                                                    disablePadding
                                                >
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            {/*<img className={itemImage} src={item?.meta?.image} alt="" />*/}
                                                            <Media uri={item?.meta?.image} className={itemImage} />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={item?.meta?.name} />
                                                        {item.importable && <Tooltip title={`Your imported ${item?.meta?.name} will bound to your Minecraft account. It will go back to the sender address when exported.`}>
                                                            <span>
                                                                <Button
                                                                    className={transferButtonSmall}
                                                                    onClick={() => {
                                                                        setImportDialogOpen(true);
                                                                        setImportDialogData({ asset: item.asset });
                                                                    }}
                                                                >Import to game</Button>
                                                            </span>
                                                        </Tooltip>}
                                                        {item.enrapturable && <Tooltip title={`Your ${item?.meta?.name} will be enraptured (burned) and bound to your Minecraft account forever.`}>
                                                            <span>
                                                                <Button
                                                                    className={transferButtonSmall}
                                                                    onClick={() => {
                                                                        setEnraptureDialogOpen(true);
                                                                        setEnraptureDialogData({ asset: item.asset });
                                                                    }}
                                                                >Burn into game</Button>
                                                            </span>
                                                        </Tooltip>}
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })
                                    ) : (
                                        <ListItem>
                                            No items found in wallet.
                                        </ListItem>
                                    )}
                                </List>
                            </div>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container justifyContent="center" style={{ marginTop: '30px' }} spacing={4}>
                <Grid container justifyContent="center" style={{ marginTop: '30px' }} spacing={4}>
                    <Grid item md={12} xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={4}
                        >
                            <div style={{ width: '50%' }}>
                                <div className={columnTitle}><span className={columnTitleText}>In-game resources: Metaverse</span></div>
                                <List dense sx={{ width: '100%', bgcolor: '#111' }}>
                                    {!!inGameResources.length ? (
                                        <>
                                            {inGameResources.map(resource => {
                                                return (
                                                    <ListItem
                                                        key={`${resource.assetAddress}-${resource.assetId}`}
                                                        secondaryAction={
                                                            <>
                                                                {resource.amount}
                                                            </>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton>
                                                            <ListItemAvatar>
                                                                <img src={resource.meta.image} alt={resource.name} className={itemImage} />
                                                            </ListItemAvatar>
                                                            <ListItemText id={resource.name} primary={resource.meta.name.slice(6)} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            })}
                                        </>
                                    ) : <ListItem>No in-game resources available</ListItem>}
                                </List>
                                <Button
                                    className={transferButton}
                                    onClick={() => {
                                        if (!!account) {
                                            setSummonDialogOpen(true);
                                            setSummonDialogData({ recipient: account ?? undefined });
                                        } else {
                                            setAccountDialogOpen(true)
                                        }
                                    }}
                                    disabled={!canSummon}
                                >Summon resources</Button>
                            </div>
                            <div style={{ width: '50%' }}>
                                <div className={columnTitle}><span className={columnTitleText}>On-chain resources: Moonriver account</span></div>
                                <List dense sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>

                                    {!!onChainResources.length ? onChainResources.map((value) => {
                                        const labelId = value?.asset?.assetId;
                                        return (
                                            <ListItem
                                                key={value?.asset.assetId}
                                                secondaryAction={
                                                    <>{Fraction.from(value?.asset?.balance, 18)?.toFixed(2)}</>
                                                }
                                                disablePadding
                                                onClick={() => {
                                                    setAssetDialogOpen(true)
                                                    setAssetDialogData({
                                                        title: value?.staticData?.name,
                                                        image: value?.meta?.imageRaw,
                                                        assetERC1155: value?.asset,
                                                        assetAddressERC20: value?.staticData?.subAssetAddress
                                                    })
                                                    //window.open(getExplorerLink(chainId ?? ChainId.MOONRIVER, value.asset.assetAddress,'address'))
                                                }}
                                            >
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <img className={itemImage} src={value?.meta?.image} alt="" />
                                                    </ListItemAvatar>
                                                    <ListItemText id={labelId} primary={value?.meta?.name} />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    }) : <ListItem>No resources found in wallet.</ListItem>}
                                </List>
                            </div>
                        </Stack>
                    </Grid>
                    <Grid item md={3} xs={12} justifyContent="center">
                        {/*<div className={columnTitle}><span className={columnTitleText}>Info</span></div>*/}
                        {/*<List dense sx={{ width: '100%', maxWidth: '100%', bgcolor: '#111', marginBottom: '16px' }}>*/}
                        {/*    {['Server Status: Online', 'Next Event: 02/11/21 13:00 UTC'].map((value) => {*/}
                        {/*        const labelId = `checkbox-list-secondary-label-${value}`;*/}
                        {/*        return (*/}
                        {/*            <ListItem*/}
                        {/*                key={value}*/}
                        {/*                disablePadding*/}
                        {/*            >*/}
                        {/*                <ListItemText id={labelId} primary={value} />*/}
                        {/*            </ListItem>*/}
                        {/*        );*/}
                        {/*    })}*/}
                        {/*</List>*/}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;

