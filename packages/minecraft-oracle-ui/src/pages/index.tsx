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
import { EmailLoginDialog } from '../components/EmailLoginDialog/EmailLoginDialog';
import { KiltLoginDialog } from '../components/KiltLoginDialog/KiltLoginDialog';
import { EmailCodeDialog } from '../components/EmailCodeDialog/EmailCodeDialog';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../state/slices/authSlice';

export const Routing = () => {
    const accessToken = useSelector(selectAccessToken)
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />}>

            </Route>

            <Route path="/account" element={<>{!!accessToken ? <AccountPage></AccountPage> : <Navigate to="/login" />}</>}>
            </Route>

            <Route path="/account/login" element={<> {!!accessToken ? <Navigate to="/account" /> : <HomePage />}</>}>

            </Route>

            <Route path="/account/login/email" element={<>{!!accessToken ? <Navigate to="/account" /> : <EmailLoginPage />}</>} />


            <Route path="/account/gamertag" element={!!accessToken ? <GamerTagChangePage /> : <HomePage />}>
            </Route>



            <Route path="/account/login/email/change" element={<> {!!accessToken ? <EmailChangePage /> : <Navigate to="/login" />}</>}>

            </Route>

            <Route path="/account/login/email/verify" element={<><EmailVerifyPage /></>}>

            </Route>

            <Route path="/account/minecraft/redirect" element={<>{!!accessToken ? <MinecraftRedirectPage /> : <HomePage />}</>}>

            </Route>

            <Route path="/account/minecraft/verify" element={<>{!!accessToken ? <MinecraftVerifyPage /> : <HomePage />}</>}>

            </Route>

            <Route path="/account/minecraft/unlink" element={<>{!!accessToken ? <MinecraftUnlinkPage /> : <HomePage />}</>}>

            </Route>

            <Route path="/account/login/kilt" element={<>{!!accessToken ? <Navigate to="/account" /> : <KiltLoginPage />}</>}>

            </Route>

            <Route path="/auth/:jwt" element={<><AuthPage /></>}>

            </Route>




            <Route path="/oauth" element={<OauthPage />}>
            </Route>

            <Route path="/oauth/confirm" element={!!accessToken ? <OauthConfirmPage /> : <HomePage />}>
            </Route>


            <Route path="/bridge" element={<>{!!accessToken ? (
                <>
                    <ImportDialog />
                    <ExportDialog />
                    <EnraptureDialog />
                    <SummonDialog />
                    <AssetDialog />
                    <ProfilePage authData={undefined} />
                </>
            ) : <Navigate to="/login" />}</>}>
            </Route>

            <Route path="/login" element={<>{!!accessToken ? (
                <Navigate to="/bridge" />
            ) :
                <>
                    <EmailCodeDialog />
                    <EmailLoginDialog />
                    <KiltLoginDialog />
                    <HomePage></HomePage>
                </>

            }</>}>
            </Route>

            <Route path="/moonsama/customizer/:chainId/:assetAddress/:assetId" element={<MoonsamaCharacterDesignerPage />}>
            </Route>

            <Route path="/moonsama/customizer" element={<><MoonsamaCharacterDesignerPage /></>}>

            </Route>

            <Route path="*" element={<><Navigate to="/bridge" /></>}>

            </Route>
        </Routes >
    )
};
