import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useBlockNumber } from 'state/application/hooks';
import { useAuth } from 'hooks';

export interface InGameItem {
    name: string
    assetAddress: string
    assetId: string
    assetType: string
    amount: string
    exportable: boolean
}

export function useActiveGame() {
    const blocknumber = useBlockNumber();
    const { authData, setAuthData } =  useAuth();
    const {jwt} = authData ?? {}

    const [items, setItems] = useState<boolean>(false)

    const getActive = useCallback(async () => {
        try {
            const resp = await axios.request<boolean>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/inprogress`,
                headers: { Authorization: `Bearer ${authData?.jwt}` }
            });
            setItems(resp.data)
        } catch(e) {
            const err = e as AxiosError;
            console.error('Error fetching active game. Try again later.')
            setItems(false)
        }
    }, [blocknumber, jwt])

    useEffect(() => {
        getActive()
    }, [blocknumber, jwt])

    return items
}
