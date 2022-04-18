import { useCallback } from 'react';
import axios from 'axios'
import { useAuth } from 'hooks';


export function useImportConfirmCallback() {
    const { authData } =  useAuth();
    const {jwt} = authData ?? {}
    
    return useCallback(async (hash?: string, chainId?:number) => {
        if (!hash) {
            return false;
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/import/confirm`,
                data: {hash, chainId},
                headers: { Authorization: `Bearer ${jwt}` }
            });
            return resp.data
        } catch(e) {
            console.error('Error confirming import hash. Try again later.')
            return false
        }
    }, [jwt])
}

export function useExportConfirmCallback() {
    const { authData } =  useAuth();
    const {jwt} = authData ?? {}

    return useCallback(async (hash?: string) => {
        if (!hash) {
            return false;
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/export/confirm`,
                data: {hash},
                headers: { Authorization: `Bearer ${jwt}` }
            });
            return resp.data
        } catch(e) {
            console.error('Error confirming export hash. Try again later.')
            return false
        }
    }, [jwt])
}

export function useEnraptureConfirmCallback() {
    const { authData } =  useAuth();
    const {jwt} = authData ?? {}

    return useCallback(async (hash?: string) => {
        if (!hash) {
            return false;
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/enrapture/confirm`,
                data: {hash},
                headers: { Authorization: `Bearer ${jwt}` }
            });
            return resp.data
        } catch(e) {
            console.error('Error confirming enrapture hash. Try again later.')
            return false
        }
    }, [jwt])
}
