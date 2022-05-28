import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from "hooks";
import HomePage from './home';
import AuthPage from './auth';
import ProfilePage from './profile';
import MoonsamaCharacterDesignerPage from './moonsama/designer';
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
                <Redirect to="/login" />
            </Route>

            <Route exact path="/auth/:jwt">
                <AuthPage />
            </Route>

            <Route exact path="/login">
                {!!authData?.jwt ? <Redirect to="/bridge" /> : <HomePage />}
            </Route>

            <Route path="/bridge">
                {!!authData?.jwt ? (
                    <>
                        <ImportDialog />
                        <ExportDialog />
                        <EnraptureDialog />
                        <SummonDialog />
                        <AssetDialog />
                        <ProfilePage authData={authData} />
                    </>
                ) : <HomePage />}
            </Route>

            <Route path="/moonsama/customizer/:chainId/:assetAddress/:assetId">
                <MoonsamaCharacterDesignerPage authData={authData} />
            </Route>

            <Route exact path="/moonsama/customizer">
                <MoonsamaCharacterDesignerPage authData={authData} />
            </Route>
        </Switch>
    )
};
