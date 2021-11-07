import * as React from 'react';
import { Button, Card, Grid } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import { Header, GlitchText, NavLink } from 'ui';
import { useStyles } from './styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Tooltip from '@mui/material/Tooltip';
import { GOLD_TYPES, IRON_TYPES, WOOD_TYPES } from '../../constants';

import { AuthData } from 'context/auth/AuthContext/AuthContext.types';

import PeopleAltIcon from '@mui/icons-material/PeopleAltSharp';
import RemoveIcon from '@mui/icons-material/RemoveCircleSharp';
import Resource1 from "../../assets/images/resource1.png";
import Resource4 from "../../assets/images/resource4.png";
import Resource5 from "../../assets/images/resource5.png";
import Cobblestone from "../../assets/images/cobblestone.png";
import MsamaImage from "../../assets/images/msama.png";
import TicketImage from "../../assets/images/vipticket.png";
import { useProfile } from 'hooks/multiverse/useProfile';
import { useOnChainItems } from 'hooks/multiverse/useOnChainItems';
import { InGameItemWithStatic, useInGameItems } from 'hooks/multiverse/useInGameItems';
import { useActiveWeb3React, useImportDialog } from 'hooks';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useSummonDialog } from 'hooks/useSummonDialog/useSummonDialog';
import { stringToStringAssetType } from 'utils/subgraph';
import { Fraction } from 'utils/Fraction';
import { Media } from '../../components/Media/Media';

export type ProfilePagePropTypes = {
    authData: AuthData
};


const ProfilePage = ({ authData }: ProfilePagePropTypes) => {
    const [checked, setChecked] = React.useState(['']);

    const {account} = useActiveWeb3React()
    const profile = useProfile();

    // Dialogs
    const { setImportDialogOpen, setImportDialogData } = useImportDialog()
    const { setExportDialogOpen, setExportDialogData } = useExportDialog()
    const { setSummonDialogOpen, setSummonDialogData } = useSummonDialog()

    //On chain Items
    const onChainItems = useOnChainItems();
    const onChainMoonsamas = onChainItems?.['Moonsama'] || []; //Update with live key
    const onChainGoldenTickets = onChainItems?.['VIP Ticket'] || []; //Update with live key
    const onChainResources = onChainItems?.['Moonsama Metaverse Asset Factory'] || []; //Update with live key

    //In Game Items
    const inGameItems = useInGameItems();
    const inGameMoonsamas = inGameItems?.moonsamas || [];
    const inGameGoldenTickets = inGameItems?.tickets || [];
    const inGameResourcesWood: InGameItemWithStatic[] = inGameItems?.resources?.filter(item => !!WOOD_TYPES.find(x => x.name === item.name)) || [];
    const inGameResourcesCobblestone: InGameItemWithStatic[] = inGameItems?.resources?.filter(item => item.name === ('COBBLESTONE')) || [];
    const inGameResourcesGold: InGameItemWithStatic[] = inGameItems?.resources?.filter(item => !!GOLD_TYPES.find(x => x.name === item.name)) || [];
    const inGameResourcesIron: InGameItemWithStatic[] = inGameItems?.resources?.filter(item => !!IRON_TYPES.find(x => x.name === item.name)) || [];
    // const inGameResourcesDiamond = inGameItems?.resources?.filter(item => item.name === 'DIAMOND') || [];

    const aggregatedGoldAmount = inGameResourcesGold.reduce((prev, curr) => prev + Number.parseFloat(curr.amount) * (GOLD_TYPES.find(x => x.name === curr.name)?.multiplier ?? 1), 0)
    const aggregatedIronAmount = inGameResourcesIron.reduce((prev, curr) => prev + Number.parseFloat(curr.amount) * (IRON_TYPES.find(x => x.name === curr.name)?.multiplier ?? 1), 0)
    const aggregatedWoodAmount = inGameResourcesWood.reduce((prev, curr) => prev + Number.parseFloat(curr.amount) * (WOOD_TYPES.find(x => x.name === curr.name)?.multiplier ?? 1), 0)

    console.log('ingame items', inGameItems, inGameResourcesWood, {aggregatedGoldAmount, aggregatedIronAmount, aggregatedWoodAmount})

    // const { jwt, userProfile } = authData;

    const playerEligible = true;

    const {
        profileContainer,
        transferButton,
        statBox,
        columnTitle,
        columnTitleText,
        statBoxInfo,
        transferButtonSmall,
        headerImage,
        itemImage
    } = useStyles();

    const canSummon = false
    const hasImportedMoonsama = !!inGameMoonsamas && inGameMoonsamas.length > 0
    const hasImportedTicket = !!inGameGoldenTickets && inGameGoldenTickets.length > 0

    return (
        <Grid className={profileContainer}>
            <Header />
                <Grid container justifyContent="center" spacing={4}>
                    <div style={{ width: '50%', textAlign: 'left' }}>
                        <span style={{fontSize: '38px', fontFamily: `VT323, 'arial'`,}}>Multiverse Bridge: Minecraft meta</span> <br />
                    </div>
                    <div style={{ width: '50%', textAlign: 'right' }}>
                        <span style={{fontSize: '22px',}}>Welcome back {authData?.userProfile?.userName},</span> <br />
                        {profile?.allowedToPlay ? (<span style={{ color:'#12753A', fontSize: '16px', fontWeight: 'bold' }}>You are eligible to play!</span>):
                        (
                        <p style={{ color:'#DB3B21'}}>To be eligible to play, bridge a VIP ticket/Moonsama, <br /> or <a href="https://moonsama.com/freshoffers" target="_blank">visit the Marketplace to get one</a></p>)}
                    </div>

                    {/*<Grid container justifyContent="center" spacing={4} style={{ margin: '56px 0 0 0' }}>*/}
                    {/*    <Grid item md={2} xs={12} justifyContent="center">*/}
                    {/*        <div className={statBox}>*/}
                    {/*            MSAMA*/}
                    {/*            <img className={headerImage} src={MsamaImage} alt="Moonsama bird" />*/}

                    {/*            <div className={statBoxInfo}>*/}
                    {/*                <div>{onChainMoonsamas.length + inGameMoonsamas.length}</div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item md={2} xs={12} justifyContent="center">*/}
                    {/*        <div className={statBox}>*/}
                    {/*            Tickets*/}
                    {/*            <img className={headerImage} src={TicketImage} alt="Moonsama VIP ticket" />*/}

                    {/*            <div className={statBoxInfo}>*/}
                    {/*                <div>{onChainGoldenTickets.length + inGameGoldenTickets.length}</div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item md={2} xs={12} justifyContent="center">*/}
                    {/*        <div className={statBox}>*/}
                    {/*            Wood*/}
                    {/*            <img className={headerImage} src={Resource1} alt="Moonsama Wood" />*/}

                    {/*            <div className={statBoxInfo}>*/}
                    {/*                /!*<div><GameIcon /> 1</div>*!/*/}
                    {/*                <div>{inGameResourcesWood[0]?.amount || 0}</div>*/}
                    {/*                /!*<div><WalletIcon /> 3</div>*!/*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item md={2} xs={12} justifyContent="center">*/}
                    {/*        <div className={statBox}>*/}
                    {/*            Cobblestone*/}
                    {/*            <img className={headerImage} src={Cobblestone} alt="Moonsama Cobblestone" />*/}

                    {/*            <div className={statBoxInfo}>*/}
                    {/*                <div>{inGameResourcesCobblestone[0]?.amount || 0}</div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item md={2} xs={12} justifyContent="center">*/}
                    {/*        <div className={statBox}>*/}
                    {/*            Iron Ingot*/}
                    {/*            <img className={headerImage} src={Resource4} alt="Moonsama Iron Ingot" />*/}

                    {/*            <div className={statBoxInfo}>*/}
                    {/*                /!*<div><GameIcon /> 1</div>*!/*/}
                    {/*                <div>{inGameResourcesIron[0]?.amount || 0}</div>*/}
                    {/*                /!*<div><WalletIcon /> 3</div>*!/*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item md={2} xs={12} justifyContent="center">*/}
                    {/*        <div className={statBox}>*/}
                    {/*            Gold Ingot*/}
                    {/*            <img className={headerImage} src={Resource5} alt="Moonsama Gold Ingot" />*/}

                    {/*            <div className={statBoxInfo}>*/}
                    {/*                /!*<div><GameIcon /> 1</div>*!/*/}
                    {/*                <div>{inGameResourcesGold[0]?.amount || 0}</div>*/}
                    {/*                /!*<div><WalletIcon /> 3</div>*!/*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}

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
                                {!!inGameMoonsamas.length || !!inGameGoldenTickets.length ? [...inGameMoonsamas, ...inGameGoldenTickets].map((value, ind) => {
                                    const labelId = `checkbox-list-secondary-label-${ind}`;
                                    return (
                                        <ListItem
                                            key={`${value?.assetAddress}-${value?.assetId}-${ind}`} //update key
                                            disablePadding
                                        >
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    {/*<img className={itemImage} src={value?.meta?.image} alt="" />*/}
                                                    <Media uri={value?.meta?.image} className={itemImage} />
                                                </ListItemAvatar>
                                                <ListItemText primary={value?.meta?.name ?? `${value.assetAddress} ${value.assetId}`} />

                                                <Button
                                                    className={transferButtonSmall}
                                                    onClick={() => {
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
                                                    }}
                                                >Export To Wallet</Button>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                }) : (
                                    <ListItem>
                                        No items found in game.
                                    </ListItem>
                                )}
                            </List>
                        </div>
                        <div style={{ width: '50%' }}>
                            <div className={columnTitle}><span className={columnTitleText}>On-chain items: Moonriver account</span></div>
                            <List dense sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
                                {!!onChainMoonsamas.length || !!onChainGoldenTickets.length ? (onChainGoldenTickets ?? []).map((item, ind) => {
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
                                    (onChainMoonsamas ?? []).map((item, ind) => {
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
                                                    <Tooltip title={'You can have 1 Moonsama imported at a time. If you want to replace, export if first, then import a new one.'}>
                                                        <span>
                                                        <Button
                                                            className={transferButtonSmall}
                                                            onClick={() => {
                                                                setImportDialogOpen(true);
                                                                setImportDialogData({ asset: item.asset });
                                                            }}
                                                            disabled={hasImportedMoonsama}
                                                        >Import to game</Button>
                                                        </span>
                                                    </Tooltip>
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
                     {/*<Grid item md={3} xs={12} justifyContent="center">*/}
                     {/*    <div className={columnTitle}><span className={columnTitleText}>GGANBU</span></div>*/}
                     {/*    <List dense sx={{ width: '100%', maxWidth: '100%', bgcolor: '#111', marginBottom: '16px' }}>*/}
                     {/*        {['t3rminat0r','gamer6969'].map((value) => {*/}
                     {/*            const labelId = `checkbox-list-secondary-label-${value}`;*/}
                     {/*            return (*/}
                     {/*                <ListItem*/}
                     {/*                    key={value}*/}
                     {/*                    secondaryAction={*/}
                     {/*                        <RemoveIcon sx={{ color: "#DB3B21" }} />*/}
                     {/*                    }*/}
                     {/*                    disablePadding*/}
                     {/*                >*/}
                     {/*                    <ListItemButton>*/}
                     {/*                        <ListItemAvatar>*/}
                     {/*                            <PeopleAltIcon />*/}
                     {/*                        </ListItemAvatar>*/}
                     {/*                        <ListItemText id={labelId} primary={value} />*/}
                     {/*                    </ListItemButton>*/}
                     {/*                </ListItem>*/}
                     {/*            );*/}
                     {/*        })}*/}
                     {/*    </List>*/}
                     {/*</Grid>*/}
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
                                        {!!inGameItems?.resources.length ? (
                                            <>
                                                {!!inGameResourcesWood.length && (
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                {aggregatedWoodAmount}
                                                            </>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton>
                                                            <ListItemAvatar>
                                                                <img src={Resource1} alt="Wood" />
                                                            </ListItemAvatar>
                                                            <ListItemText id="wood" primary="Wood" />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )}
                                                {!!inGameResourcesCobblestone.length && (
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                {inGameResourcesCobblestone[0].amount}
                                                            </>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton>
                                                            <ListItemAvatar>
                                                                <img src={Cobblestone} alt="Cobblestone" />
                                                            </ListItemAvatar>
                                                            <ListItemText id="cobblestone" primary="Cobblestone"/>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )}
                                                {!!inGameResourcesIron.length && (
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                {aggregatedIronAmount}
                                                            </>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton>
                                                            <ListItemAvatar>
                                                                <img src={Resource4} alt="Iron Ingot"/>
                                                            </ListItemAvatar>
                                                            <ListItemText id="iron-ingot" primary="Iron Ingot"/>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )}
                                                {!!inGameResourcesGold.length && (
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                {aggregatedGoldAmount}
                                                            </>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton>
                                                            <ListItemAvatar>
                                                                <img src={Resource5} alt="Gold Ingot"/>
                                                            </ListItemAvatar>
                                                            <ListItemText id="gold-ingot" primary="Gold Ingot"/>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )}
                                            </>
                                        ) : <ListItem>No in-game resources available</ListItem>}
                                    </List>
                                    <Button
                                        className={transferButton}
                                        onClick={() => {
                                            setSummonDialogOpen(true);
                                            setSummonDialogData({recipient: account ?? undefined});
                                        }}
                                        disabled={!canSummon}
                                    >Summon Resources</Button>
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
                                                        <>{Fraction.from(value?.asset?.balance, 18)?.toFixed(0)}</>
                                                    }
                                                    disablePadding
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
