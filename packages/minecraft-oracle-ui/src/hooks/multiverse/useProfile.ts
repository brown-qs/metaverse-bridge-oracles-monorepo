import { useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ProfileContextType } from 'context/auth/AuthContext/AuthContext.types';
import { useActiveWeb3React, useAuth } from 'hooks';
import { useBlockNumber } from 'state/application/hooks';


export function useProfileCallback() {
    const {authData, setAuthData} =  useAuth()
    return useCallback(async (jwt: string) => {
        const headers = { Authorization: `Bearer ${jwt}` }
        try {
            const resp = await axios.request<ProfileContextType>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/profile`,
                headers: headers
            });
            setAuthData({
                jwt: authData?.jwt,
                userProfile: authData?.userProfile
            })
            return resp.data
        } catch(e) {
            console.error('Error fetching user profile', e);
            return undefined
        }
    }, [authData?.jwt])
}

export function useProfile() {
    const {authData, setAuthData} =  useAuth()
    const blocknumber = useBlockNumber()

    const {jwt} = authData ?? {}
    
    const cb = useCallback(async () => {
        if (!jwt) {
            setAuthData({
                ...authData,
                userProfile: undefined
            })
            return
        }
        const headers = { Authorization: `Bearer ${jwt}` }
        try {
            const resp = await axios.request<ProfileContextType>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/profile`,
                headers: headers
            });
            setAuthData({
                jwt: authData?.jwt,
                userProfile: resp?.data
            })
        } catch(e) {
            const err = e as AxiosError;

            if(err?.response?.data.statusCode === 401){
                window.localStorage.removeItem('authData');
                setAuthData(undefined);
            };
            console.error('Error fetching user profile', e);
        }
    }, [jwt, blocknumber])

    useEffect(() => {
        cb()
    }, [jwt, blocknumber])

    return authData?.userProfile
}