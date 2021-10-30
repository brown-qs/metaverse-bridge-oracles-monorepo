import { useCallback, useEffect, useState } from 'react';
import axios from 'axios'
import { useBlockNumber } from 'state/application/hooks';

export interface InGameItem {
    name: string
    assetAddress: string
    assetId: string
    assetType: string
    amount: string
    exportable: boolean
}

export interface ProfileInGameItems {
    moonsamas: InGameItem[],
    tickets: InGameItem[],
    resources: InGameItem[]
}

export function useActiveGame(recipient: string) {
    const blocknumber = useBlockNumber()

    const [items, setItems] = useState<boolean>(false)

    const getUserItems = useCallback(async () => {
        try {
            const resp = await axios.request<boolean>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/inprogress`
            });
            setItems(resp.data)
        } catch(e) {
            console.error('Error summoning. Try again later.')
            setItems(false)
        }
    }, [blocknumber, recipient])

    useEffect(() => {
        getUserItems()
    }, [blocknumber, recipient])

    return items
}
