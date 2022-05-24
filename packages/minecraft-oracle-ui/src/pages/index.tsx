import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from "hooks";
import HomePage from './home';
import AuthPage from './auth';
import ProfilePage from './profile';
import MoonsamaCharacterDesignerPage from './moonsama/designer';
import { TransferDialog } from '../components/TransferDiaog/TransferDialog';
import { ExportDialog } from '../components/ExportDialog/ExportDialog';
import { ImportDialog } from '../components/ImportDialog/ImportDialog';
import { EnraptureDialog } from '../components/EnraptureDialog/EnraptureDialog';
import { SummonDialog } from '../components/SummonDialog/SummonDialog';
import { AssetDialog } from '../components/AssetDialog/AssetDialog';

export const Routing = () => {
    const { authData } = useAuth();

    return (
        <Switch>
            <Route exact path="/">
                <AuthPage />
            </Route>

            <Route exact path="/auth/:jwt">
                <AuthPage />
            </Route>

            <Route exact path="/login">
                {!!authData?.jwt ? <ProfilePage authData={authData} /> : <HomePage />}
            </Route>

            <Route path="/profile/:type/:address/:id">
                <TransferDialog />
            </Route>

            <Route path="/profile">
                <ImportDialog />
                <ExportDialog />
                <EnraptureDialog />
                <SummonDialog />
                <AssetDialog />
                {!!authData?.jwt ? <ProfilePage authData={authData} /> : <AuthPage />}
                {/*<ProfilePage authData={{ jwt: '2034823423', userProfile: { name: 'cleanston3r' } }} />*/}
            </Route>

            <Route exact path="/moonsama/designer">
                <MoonsamaCharacterDesignerPage authData={authData} />
            </Route>

            <Route exact path="/moonsama/designer/:assetAddress/:assetID">
                <MoonsamaCharacterDesignerPage authData={authData} />
            </Route>
        </Switch>
    )
};
