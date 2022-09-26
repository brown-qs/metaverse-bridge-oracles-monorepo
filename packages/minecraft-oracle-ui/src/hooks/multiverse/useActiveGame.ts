import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useBlockNumber } from 'state/application/hooks';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../state/slices/authSlice';

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
    const accessToken = useSelector(selectAccessToken)

    const [items, setItems] = useState<boolean>(false)

    const getActive = useCallback(async () => {
        try {
            const resp = await axios.request<boolean>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/inprogress`,
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setItems(resp.data)
        } catch (e) {
            const err = e as AxiosError;
            console.error('Error fetching active game. Try again later.')
            setItems(false)
        }
    }, [blocknumber, accessToken])

    useEffect(() => {
        getActive()
    }, [blocknumber, accessToken])

    return items
}
