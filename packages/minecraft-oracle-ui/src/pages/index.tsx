import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import MoonsamaCharacterDesignerPage from './moonsama/designer';
import AccountPage from './AccountPage';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../state/slices/authSlice';
import TestPage from './TestPage';

export const Routing = () => {
    const accessToken = useSelector(selectAccessToken)
    return (
        <Routes>
            <Route path="/" element={!!accessToken ? <Navigate to="/bridge" /> : <HomePage />} />
            <Route path="/account" element={!!accessToken ? <AccountPage /> : <Navigate to="/" />} />
            <Route path="/bridge" element={!!accessToken ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/oauth" element={<HomePage />} />
            <Route path="/moonsama/customizer/:chainId/:assetAddress/:assetId" element={<MoonsamaCharacterDesignerPage />} />
            <Route path="/moonsama/customizer" element={<MoonsamaCharacterDesignerPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<Navigate to="/bridge" />} />
        </Routes>
    )
};
