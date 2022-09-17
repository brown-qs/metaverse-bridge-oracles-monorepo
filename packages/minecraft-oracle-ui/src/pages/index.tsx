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
import OauthPage from './oauth';
import OauthConfirmPage from './oauth/confirm';
import { EmailLoginDialog } from '../components/EmailLoginDialog/EmailLoginDialog';
import { KiltLoginDialog } from '../components/KiltLoginDialog/KiltLoginDialog';
import { EmailCodeDialog } from '../components/EmailCodeDialog/EmailCodeDialog';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../state/slices/authSlice';
import TestPage from './test';

export const Routing = () => {
    const accessToken = useSelector(selectAccessToken)
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />}>

            </Route>

            <Route path="/account" element={<>{!!accessToken ? <AccountPage></AccountPage> : <Navigate to="/login" />}</>}>
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
                    <ProfilePage />
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

            <Route path="/test" element={<><TestPage /></>}>
            </Route>


            <Route path="*" element={<><Navigate to="/bridge" /></>}>

            </Route>
        </Routes >
    )
};
