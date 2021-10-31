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
    hash?: string
    summonable: boolean
}

export interface ProfileInGameItems {
    moonsamas: InGameItem[],
    tickets: InGameItem[],
    resources: InGameItem[]
}

export function useInGameItems() {
    const { authData, setAuthData } =  useAuth();
    const blocknumber = useBlockNumber();

    const {jwt} = authData ?? {}

    const [items, setItems] = useState<ProfileInGameItems | undefined>(undefined);

    const getUserItems = useCallback(async () => {
        try {
            const resp = await axios.request<ProfileInGameItems>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/resources`,
                headers: { Authorization: `Bearer ${authData?.jwt}` }
            });
            setItems(resp.data)
        } catch(e) {
            const err = e as AxiosError;

            if(err?.response?.data.statusCode === 401){
                window.localStorage.removeItem('authData');
                setAuthData(undefined);
            };
            console.error('Error summoning. Try again later.')
            setItems(undefined)
        }
    }, [blocknumber, jwt])

    useEffect(() => {
        getUserItems()
    }, [blocknumber, jwt])

    return items
}
