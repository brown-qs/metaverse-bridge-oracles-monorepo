import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

export const Routing = () => {
    const { authData } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />}>

            </Route>

            <Route path="/account" element={<>{!!authData?.jwt ? <AccountPage></AccountPage> : <Navigate to="/account/login" />}</>}>
            </Route>

            <Route path="/account/login" element={<> {!!authData?.jwt ? <Navigate to="/account" /> : <LoginPage />}</>}>

            </Route>

            <Route path="/account/login/email" element={<>{!!authData?.jwt ? <Navigate to="/account" /> : <EmailLoginPage />}</>}>

            </Route>

            <Route path="/account/login/email/change" element={<> {!!authData?.jwt ? <EmailChangePage /> : <Navigate to="/account/login" />}</>}>

            </Route>

            <Route path="/account/login/email/verify" element={<><EmailVerifyPage /></>}>

            </Route>

            <Route path="/account/minecraft/redirect" element={<>{!!authData?.jwt ? <MinecraftRedirectPage /> : <LoginPage />}</>}>

            </Route>

            <Route path="/account/minecraft/verify" element={<>{!!authData?.jwt ? <MinecraftVerifyPage /> : <LoginPage />}</>}>

            </Route>

            <Route path="/account/minecraft/unlink" element={<>{!!authData?.jwt ? <MinecraftUnlinkPage /> : <LoginPage />}</>}>

            </Route>

            <Route path="/account/login/kilt" element={<>{!!authData?.jwt ? <Navigate to="/account" /> : <KiltLoginPage />}</>}>

            </Route>

            <Route path="/auth/:jwt" element={<><AuthPage /></>}>

            </Route>

            <Route path="/login" element={<>{!!authData?.jwt ? <Navigate to="/bridge" /> : <HomePage />}</>}>

            </Route>

            <Route path="/oauth" element={<>{!!authData?.jwt ? <OauthPage /> : <LoginPage />}</>}>

            </Route>


            <Route path="/bridge" element={<>{!!authData?.jwt ? (
                <>
                    <ImportDialog />
                    <ExportDialog />
                    <EnraptureDialog />
                    <SummonDialog />
                    <AssetDialog />
                    <ProfilePage authData={authData} />
                </>
            ) : <HomePage />}</>}>

            </Route>

            <Route path="/moonsama/customizer/:chainId/:assetAddress/:assetId" element={<MoonsamaCharacterDesignerPage authData={authData} />}>
            </Route>

            <Route path="/moonsama/customizer" element={<><MoonsamaCharacterDesignerPage authData={authData} /></>}>

            </Route>

            <Route path="*" element={<><Navigate to="/bridge" /></>}>

            </Route>
        </Routes >
    )
};
