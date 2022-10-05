import { useCallback } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../state/slices/authSlice';


export function useImportConfirmCallback() {
    const accessToken = useSelector(selectAccessToken)


    return useCallback(async (hash?: string, chainId?: number) => {
        if (!hash) {
            return false;
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/import/confirm`,
                data: { hash, chainId },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return resp.data
        } catch (e) {
            console.error('Error confirming import hash. Try again later.')
            return false
        }
    }, [accessToken])
}

export function useExportConfirmCallback() {
    const accessToken = useSelector(selectAccessToken)


    return useCallback(async (hash?: string, chainId?: number) => {
        if (!hash) {
            return false;
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/export/confirm`,
                data: { hash, chainId },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return resp.data
        } catch (e) {
            console.error('Error confirming export hash. Try again later.')
            return false
        }
    }, [accessToken])
}

export function useEnraptureConfirmCallback() {
    const accessToken = useSelector(selectAccessToken)


    return useCallback(async (hash?: string, chainId?: number) => {
        if (!hash) {
            return false;
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/enrapture/confirm`,
                data: { hash, chainId },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return resp.data
        } catch (e) {
            console.error('Error confirming enrapture hash. Try again later.')
            return false
        }
    }, [accessToken])
}
