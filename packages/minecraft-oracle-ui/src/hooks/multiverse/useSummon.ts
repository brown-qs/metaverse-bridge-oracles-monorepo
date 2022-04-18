import { useCallback } from 'react';
import axios, { AxiosError } from 'axios'
import { useAuth } from 'hooks';


export function useSummonCallback() {
    const { authData } =  useAuth();
    const {jwt} = authData ?? {}
    return useCallback(async (recipient?: string, chainId?: number) => {
        if (!recipient) {
            return false
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/summon`,
                data: {recipient, chainId},
                headers: { Authorization: `Bearer ${jwt}` }
            });
            return resp.data
        } catch(e) {
            if((e as AxiosError)?.response?.status === 504) {
                console.error('Gateway timeout')
                return true
            }
            console.error('Error summoning. Try again later.')
            return false
        }
    }, [jwt])
}
