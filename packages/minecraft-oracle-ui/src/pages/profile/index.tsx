import * as React from 'react';
import { TransferList } from 'ui';
import { Button, Card, Grid } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import { Header, GlitchText, NavLink } from 'ui';
import { useStyles } from './styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import GameIcon from '@mui/icons-material/VideogameAsset';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleAltIcon from '@mui/icons-material/PeopleAltSharp';
import RemoveIcon from '@mui/icons-material/RemoveCircleSharp';
import SwapHorizIcon from '@mui/icons-material/SwapHorizSharp';
import { AuthContextType, ProfileContextType } from 'context/auth/AuthContext/AuthContext.types';

import MinecraftBlocksBgImage from 'assets/images/minecraft-blocksbg.png';
import Resource1 from "../../assets/images/resource1.png";
import Resource2 from "../../assets/images/resource2.png";
import Resource3 from "../../assets/images/resource3.png";
import Resource4 from "../../assets/images/resource4.png";
import Resource5 from "../../assets/images/resource5.png";
import Resource6 from "../../assets/images/resource6.png";
import MsamaImage from "../../assets/images/msama.png";
import TicketImage from "../../assets/images/vipticket.png";

export type ProfilePagePropTypes = {
    authData: {
        jwt: string,
        userProfile: ProfileContextType | undefined
    } | undefined,
};


const ProfilePage = ({ authData }: ProfilePagePropTypes) => {
    const [checked, setChecked] = React.useState(['']);

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

    const {
        profileContainer,
        footerBg,
        transferButton,
        statBox,
        columnTitle,
        columnTitleText,
        statBoxInfo,
        checkBox,
        transferButtonSmall,
    } = useStyles();

    return (
        <Grid className={profileContainer}>
            <Header />
            <Grid container justifyContent="center" spacing={4}>
                <Grid item md={5} xs={12} justifyContent="center">
                        <div className={statBox}>
                            MSAMAS
                            <img src={MsamaImage} alt="Moonsama" />

                            <div className={statBoxInfo}>
                            </div>
                        </div>
                </Grid>
                <Grid item md={5} xs={12} justifyContent="center">
                    <div className={statBox}>
                        Tickets
                        <img src={TicketImage} alt="Moonsama" />

                        <div className={statBoxInfo}>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" style={{ marginTop: '80px' }} spacing={4}>
                <Grid item md={9} xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={4}
                    >
                    <div style={{ width: '50%' }}>
                        <div className={columnTitle}><span className={columnTitleText}>Game Resources</span></div>
                        <List dense sx={{ width: '100%', bgcolor: '#111' }}>
                            {['Resource 4', 'Resource 1', 'Resource 2'].map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                    <ListItem
                                        key={value}
                                        secondaryAction={
                                            <>
                                                420
                                                <Checkbox
                                                    className={checkBox}
                                                    edge="end"
                                                    onChange={handleToggle(value)}
                                                    checked={checked.indexOf(value) !== -1}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <img src={Resource1} alt="" />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Button className={transferButton}>Summon Resources</Button>
                    </div>
                    <div style={{ width: '50%' }}>
                        <div className={columnTitle}><span className={columnTitleText}>Wallet Tokens</span></div>
                        <List dense sx={{ width: '100%', bgcolor: '#111', marginBottom: '16px' }}>
                            {['$RES3', '$RES4', '$RES2'].map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                    <ListItem
                                        key={value}
                                        secondaryAction={
                                            <>
                                                122
                                            </>
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
                    <div className={columnTitle}><span className={columnTitleText}>GGANBU</span></div>
                    <List dense sx={{ width: '100%', maxWidth: '100%', bgcolor: '#111', marginBottom: '16px' }}>
                        {['t3rminat0r','gamer6969'].map((value) => {
                            const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem
                                    key={value}
                                    secondaryAction={
                                        <RemoveIcon sx={{ color: "#DB3B21" }} />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <PeopleAltIcon />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={value} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>



            {/*<img className={footerBg} style={{ left: 0 }} src={MinecraftBlocksBgImage} alt="" />*/}
            {/*<img className={footerBg} style={{ left: '20%' }} src={MinecraftBlocksBgImage} alt="" />*/}
            {/*<img className={footerBg} style={{ right: '20%' }} src={MinecraftBlocksBgImage} alt="" />*/}
            {/*<img className={footerBg} style={{ right: 0 }} src={MinecraftBlocksBgImage} alt="" />*/}
        </Grid>
    );
};

export default ProfilePage;
