import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import MoonsamaCharacterDesignerPage from './moonsama/designer';
import AccountPage from './AccountPage';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../state/slices/authSlice';
import TestPage from './TestPage';
import SwapPage from './SwapPage';
import CustomizerPage from './CustomizerPage';

export const Routing = () => {
    const accessToken = useSelector(selectAccessToken)
    return (
        <Routes>
            <Route path="/" element={!!accessToken ? <Navigate to="/portal" /> : <HomePage />} />
            <Route path="/account" element={!!accessToken ? <AccountPage /> : <Navigate to="/" />} />
            <Route path="/portal" element={!!accessToken ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/oauth" element={<HomePage />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/customizer" element={<CustomizerPage />} />
            <Route path="/customizer/library" element={<CustomizerPage />} />
            <Route path="/customizer/library/:librarySection" element={<CustomizerPage />} />
            <Route path="/customizer/:chainId/:assetAddress/:assetId" element={<CustomizerPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<Navigate to="/portal" />} />
        </Routes>
    )
};
