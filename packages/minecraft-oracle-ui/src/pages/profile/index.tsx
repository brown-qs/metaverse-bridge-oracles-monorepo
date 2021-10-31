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
import { WOOD_TYPES } from '../../constants';

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
import { useInGameItems } from 'hooks/multiverse/useInGameItems';
import { useActiveWeb3React, useImportDialog } from 'hooks';
import { useExportDialog } from 'hooks/useExportDialog/useExportDialog';
import { useSummonDialog } from 'hooks/useSummonDialog/useSummonDialog';
import { stringToStringAssetType } from 'utils/subgraph';
import { Fraction } from 'utils/Fraction';

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
    const onChainMoonsamas = onChainItems?.['SamaMoo'] || []; //Update with live key
    const onChainGoldenTickets = onChainItems?.['TestCollection'] || []; //Update with live key
    const onChainResources = onChainItems?.['Metaverse Asset Factory'] || []; //Update with live key

    //In Game Items
    const inGameItems = useInGameItems();
    const inGameMoonsamas = inGameItems?.moonsamas || [];
    const inGameGoldenTickets = inGameItems?.tickets || [];
    const inGameResourcesWood = inGameItems?.resources?.filter(item => WOOD_TYPES.includes(item.name)) || [];
    const inGameResourcesCobblestone = inGameItems?.resources?.filter(item => item.name === ('COBBLESTONE')) || [];
    const inGameResourcesGold = inGameItems?.resources?.filter(item => item.name === 'GOLD_INGOT') || [];
    const inGameResourcesIron = inGameItems?.resources?.filter(item => item.name === 'IRON_INGOT') || [];
    const inGameResourcesDiamond = inGameItems?.resources?.filter(item => item.name === 'DIAMOND') || [];

    console.log('ingame items', inGameItems, inGameResourcesWood)

    // const { jwt, userProfile } = authData;

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

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

    return (
        <Grid className={profileContainer}>
            <Header />
            {!!playerEligible ? (
                <>
                <Grid container justifyContent="center" spacing={4}>
                    <div style={{ width: '50%', textAlign: 'left' }}>
                        <span style={{fontSize: '38px', fontFamily: `VT323, 'arial'`,}}>Multiverse Bridge</span> <br />
                    </div>
                    <div style={{ width: '50%', textAlign: 'right' }}>
                        <span style={{fontSize: '22px',}}>Welcome back {authData?.userProfile?.userName},</span> <br />

                        <span style={{ color:'#12753A', fontSize: '16px', fontWeight: 'bold' }}>You are Eligible to play!</span>
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
                    {/*            iron Ingot*/}
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

                 <Grid container justifyContent="center" style={{ marginTop: '50px' }} spacing={4}>
                    <Grid item md={12} xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={4}
                    >
                        <div style={{ width: '50%' }}>
                            <div className={columnTitle}><span className={columnTitleText}>In-game Items</span></div>
                            <List dense sx={{ width: '100%', bgcolor: '#111' }}>
                                {!!inGameMoonsamas.length || !!inGameGoldenTickets.length ? [...inGameMoonsamas, ...inGameGoldenTickets].map((value, ind) => {
                                    const labelId = `checkbox-list-secondary-label-${ind}`;
                                    return (
                                        <ListItem
                                            key={ind} //update key
                                            disablePadding
                                        >
                                            <ListItemButton>
                                                {/*<ListItemAvatar>*/}
                                                {/*    <img src={value?.meta?.image} alt="" />*/}
                                                {/*</ListItemAvatar>*/}
                                                <ListItemText id={labelId} primary={value.name} />

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
                            <div className={columnTitle}><span className={columnTitleText}>Wallet Items</span></div>
                            <List dense sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
                                {!!onChainMoonsamas.length || !!onChainGoldenTickets.length ? [...onChainMoonsamas, ...onChainGoldenTickets].map((item, ind) => {
                                    return (
                                        <ListItem
                                            key={ind} //update key
                                            disablePadding
                                        >
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    <img className={itemImage} src={item?.meta?.image} alt="" />
                                                </ListItemAvatar>
                                                <ListItemText primary={item?.meta?.name} />

                                                <Button
                                                    className={transferButtonSmall}
                                                    onClick={() => {
                                                        setImportDialogOpen(true);
                                                        setImportDialogData({ asset: item.asset });
                                                    }}
                                                >Import To Game</Button>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                }) : (
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

                    <Grid container justifyContent="center" style={{ marginTop: '30px' }} spacing={4}>
                        <Grid item md={12} xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={4}
                            >
                                <div style={{ width: '50%' }}>
                                    <div className={columnTitle}><span className={columnTitleText}>In-game Resources</span></div>
                                    <List dense sx={{ width: '100%', bgcolor: '#111' }}>
                                        {!!inGameItems?.resources.length ? (
                                            <>
                                                {!!inGameResourcesWood.length && (
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                {inGameResourcesWood[0]?.amount}
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
                                                                {inGameResourcesCobblestone[0]?.amount}
                                                            </>
                                                        }
                                                        disablePadding
                                                    >
                                                        <ListItemButton>
                                                            <ListItemAvatar>
                                                                <img src={Resource1} alt="Cobblestone" />
                                                            </ListItemAvatar>
                                                            <ListItemText id="cobblestone" primary="Cobblestone"/>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )}
                                                {!!inGameResourcesIron.length && (
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                {inGameResourcesIron[0]?.amount}
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
                                                                {inGameResourcesGold[0]?.amount}
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
                                    >Summon Resources</Button>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <div className={columnTitle}><span className={columnTitleText}>Wallet Resources</span></div>
                                    <List dense sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
                                        {['$RES3', '$RES4', '$RES2'].map((value) => {
                                            const labelId = `checkbox-list-secondary-label-${value}`;
                                            return (
                                                <ListItem
                                                    key={value}
                                                    secondaryAction={
                                                        <>122</>
                                                    }
                                                    disablePadding
                                                >
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            <img src={Resource4} alt="" />
                                                        </ListItemAvatar>
                                                        <ListItemText id={labelId} primary={value} />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
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
            </>
            ) : <p style={{ fontSize: '21px', textAlign: 'center' }}>You are not eligible to play. <br /><a href="https://moonsama.com/freshoffers" target="_blank">Visit Marketplace</a></p>}



            {/*<img className={footerBg} style={{ left: 0 }} src={MinecraftBlocksBgImage} alt="" />*/}
            {/*<img className={footerBg} style={{ left: '20%' }} src={MinecraftBlocksBgImage} alt="" />*/}
            {/*<img className={footerBg} style={{ right: '20%' }} src={MinecraftBlocksBgImage} alt="" />*/}
            {/*<img className={footerBg} style={{ right: 0 }} src={MinecraftBlocksBgImage} alt="" />*/}
        </Grid>
    );
};

export default ProfilePage;
