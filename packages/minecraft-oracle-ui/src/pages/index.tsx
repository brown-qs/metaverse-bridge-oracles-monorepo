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
import AccountPage from './account';
import LoginPage from './account/login';
import EmailLoginPage from './account/login/email';
import KiltLoginPage from './account/login/kilt';
import EmailVerifyPage from './account/login/email/verify';
import EmailChangePage from './account/login/email/change';
import MinecraftRedirectPage from './account/minecraft/redirect';
import MinecraftVerifyPage from './account/minecraft/verify';
import MinecraftUnlinkPage from './account/minecraft/unlink';
import OauthPage from './oauth';
import OauthConfirmPage from './oauth/confirm';
import GamerTagChangePage from './account/gamertag';

export const Routing = () => {
    const { authData } = useAuth();
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/login" />
            </Route>

            <Route exact path="/account">
                {!!authData?.jwt ? <AccountPage></AccountPage> : <Redirect to="/account/login" />}
            </Route>

            <Route exact path="/account/login">
                {!!authData?.jwt ? <Redirect to="/account" /> : <LoginPage />}
            </Route>

            <Route exact path="/account/gamertag">
                {!!authData?.jwt ? <GamerTagChangePage /> : <LoginPage />}
            </Route>

            <Route exact path="/account/login/email">
                {!!authData?.jwt ? <Redirect to="/account" /> : <EmailLoginPage />}
            </Route>

            <Route exact path="/account/login/email/change">
                {!!authData?.jwt ? <EmailChangePage /> : <Redirect to="/account/login" />}
            </Route>

            <Route exact path="/account/login/email/verify">
                <EmailVerifyPage />
            </Route>

            <Route exact path="/account/minecraft/redirect">
                {!!authData?.jwt ? <MinecraftRedirectPage /> : <LoginPage />}
            </Route>

            <Route exact path="/account/minecraft/verify">
                {!!authData?.jwt ? <MinecraftVerifyPage /> : <LoginPage />}
            </Route>

            <Route exact path="/account/minecraft/unlink">
                {!!authData?.jwt ? <MinecraftUnlinkPage /> : <LoginPage />}
            </Route>

            <Route exact path="/account/login/kilt">
                {!!authData?.jwt ? <Redirect to="/account" /> : <KiltLoginPage />}
            </Route>

            <Route exact path="/auth/:jwt">
                <AuthPage />
            </Route>

            <Route exact path="/login">
                {!!authData?.jwt ? <Redirect to="/bridge" /> : <HomePage />}
            </Route>

            <Route exact path="/oauth">
                <OauthPage />
            </Route>

            <Route exact path="/oauth/confirm">
                {!!authData?.jwt ? <OauthConfirmPage /> : <LoginPage />}
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

            <Route path="*">
                <Redirect to="/bridge" />
            </Route>
        </Switch >
    )
};
