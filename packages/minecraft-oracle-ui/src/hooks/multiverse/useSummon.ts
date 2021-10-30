import { useCallback } from 'react';
import axios from 'axios'


export function useSummonCallback() {
    return useCallback(async (recipient: string) => {
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/summon`,
                data: {recipient}
            });
            return resp.data
        } catch(e) {
            console.error('Error summoning. Try again later.')
            return false
        }
    }, [])
}
