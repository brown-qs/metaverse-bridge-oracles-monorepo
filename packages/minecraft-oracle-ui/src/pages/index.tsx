import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import MoonsamaCharacterDesignerPage from './moonsama/designer';
import AccountPage from './AccountPage';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../state/slices/authSlice';
import TestPage from './TestPage';
import CustomizerPage from './CustomizerPage';
import ExoCustomizer from './exosama/ExoCustomizer';
import ExoAssets from './exosama/ExoAssets';
import MigratePage from './MigratePage';

export const Routing = () => {
    const accessToken = useSelector(selectAccessToken)
    return (
        <Routes>
            <Route path="/" element={!!accessToken ? <Navigate to="/portal" /> : <HomePage />} />
            <Route path="/account" element={!!accessToken ? <AccountPage /> : <Navigate to="/" />} />
            <Route path="/portal" element={!!accessToken ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/oauth" element={<HomePage />} />
            <Route path="/migrate" element={<MigratePage />} />

            <Route path="/moonsama/customizer/:chainId/:assetAddress/:assetId" element={<MoonsamaCharacterDesignerPage />} />
            <Route path="/moonsama/customizer" element={<MoonsamaCharacterDesignerPage />} />
            <Route path="/exosama/assets" element={<ExoAssets />} />
            <Route path="/exosama/customizer" element={<ExoCustomizer />} />

            <Route path="/customizer" element={<CustomizerPage />} />
            <Route path="/customizer/library" element={<CustomizerPage />} />
            <Route path="/customizer/library/:librarySection" element={<CustomizerPage />} />
            <Route path="/customizer/:chainId/:assetAddress/:assetId" element={<CustomizerPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<Navigate to="/portal" />} />
        </Routes>
    )
};
