import { useCallback } from 'react';
import axios from 'axios'


export function useImportConfirmCallback() {
    return useCallback(async (hash: string) => {
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/import/confirm`,
                data: {hash}
            });
            return resp.data
        } catch(e) {
            console.error('Error confirming import hash. Try again later.')
            return false
        }
    }, [])
}

export function useExportConfirmCallback() {
    return useCallback(async (hash: string) => {
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/export/confirm`,
                data: {hash}
            });
            return resp.data
        } catch(e) {
            console.error('Error confirming export hash. Try again later.')
            return false
        }
    }, [])
}

export function useEnraptureConfirmCallback() {
    return useCallback(async (hash: string) => {
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/enrapture/confirm`,
                data: {hash}
            });
            return resp.data
        } catch(e) {
            console.error('Error confirming enrapture hash. Try again later.')
            return false
        }
    }, [])
}
