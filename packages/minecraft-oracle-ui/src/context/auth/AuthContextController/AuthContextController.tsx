import React, { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { ProfileContextType } from '../AuthContext/AuthContext.types';
import { AuthContextControllerProps } from './AuthContextController.types';

export const AuthContextController = ({ children }: AuthContextControllerProps) => {
    const [authData, setAuthData] = useState<{jwt: string, userProfile: ProfileContextType | undefined } | undefined>(undefined);

    useEffect(() => {
        if(!authData) {
            const persistedAuthData = window.localStorage.getItem('authData');

            if(!!persistedAuthData) {
                // @ts-ignore
                setAuthData(JSON.parse(persistedAuthData));
            }
        }

        // @ts-ignore
        window.localStorage.setItem('authData', JSON.stringify(authData));
    }, [authData]);

    return (
        <AuthContext.Provider
            value={{ authData, setAuthData }}
        >
            {children}
        </AuthContext.Provider>
    );
};
