import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from "hooks";
import HomePage from './home';
import AuthPage from './auth';
import ProfilePage from './profile';
import { PurchaseDialog, BidDialog } from 'components';
import { CancelDialog } from 'components/CancelDialog/CancelDialog';
import { TransferDialog } from 'components/TransferDiaog/TransferDialog';

export const Routing = () => {
    const { authData } = useAuth();

    return (
        <Switch>
            <Route exact path="/">
                <AuthPage />
            </Route>
            <Route exact path="/auth/:jwt">
                <AuthPage/>
            </Route>
            <Route exact path="/login">
                {!!authData?.jwt ? <ProfilePage authData={authData} /> : <HomePage />}
            </Route>
            <Route path="/profile/:type/:address/:id">
                <CancelDialog/>
                <PurchaseDialog/>
                <BidDialog/>
                <TransferDialog/>
            </Route>
            <Route path="/profile">
                {!!authData?.jwt ? <ProfilePage authData={authData} /> : <AuthPage />}
                {/*<ProfilePage authData={{ jwt: '2034823423', userProfile: { name: 'cleanston3r' } }} />*/}
            </Route>
        </Switch>
    )
};
