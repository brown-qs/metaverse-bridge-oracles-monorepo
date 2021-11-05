import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useBlockNumber } from 'state/application/hooks';
import { useAuth } from 'hooks';
import { StaticTokenData, useTokenStaticDataCallbackArray } from 'hooks/useTokenStaticDataCallback/useTokenStaticDataCallback';
import { stringToStringAssetType } from 'utils/subgraph';

export interface InGameItem {
    name: string
    assetAddress: string
    assetId: string
    assetType: string
    amount: string
    exportable: boolean
    hash?: string
    summonable: boolean
    staticData: StaticTokenData,
    meta: any
}

export type InGameItemWithStatic = InGameItem & {staticData: StaticTokenData} 

export interface ProfileInGameItems {
    moonsamas: InGameItem[],
    tickets: InGameItem[],
    resources: InGameItem[]
}

export interface ProfileInGameItemsWithStatic {
    moonsamas: InGameItemWithStatic[],
    tickets: InGameItemWithStatic[],
    resources: InGameItemWithStatic[]
}

export function useInGameItems() {
    const { authData, setAuthData } =  useAuth();
    const blocknumber = useBlockNumber();
    const staticCallback = useTokenStaticDataCallbackArray();

    const {jwt} = authData ?? {}

    const [items, setItems] = useState<ProfileInGameItemsWithStatic | undefined>(undefined);

    const getUserItems = useCallback(async () => {
        let rawData: ProfileInGameItems
        try {
            const resp = await axios.request<ProfileInGameItems>({
                method: 'get',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/resources`,
                headers: { Authorization: `Bearer ${authData?.jwt}` }
            });
            rawData = resp.data
        } catch(e) {
            const err = e as AxiosError;

            if(err?.response?.data.statusCode === 401){
                window.localStorage.removeItem('authData');
                setAuthData(undefined);
            };
            console.error('Error fetching in game items. Try again later.')
            setItems(undefined)
            return
        }
        const melange = [...rawData.moonsamas, ...rawData.tickets, ...rawData.resources]
        let staticDatas = await staticCallback(
            melange.map(x => {
                return {
                    assetId: x.assetId,
                    assetAddress: x.assetAddress,
                    assetType: stringToStringAssetType(x.assetType),
                    id: '1'
                }
            })
        );
        let resultSet: ProfileInGameItemsWithStatic = { moonsamas: [], resources: [], tickets: []}
        
        if (rawData.moonsamas.length > 0) {
            staticDatas.slice(0, rawData.moonsamas.length).map((sd, i) => {
                resultSet.moonsamas.push({
                    ...rawData.moonsamas[i],
                    staticData: sd.staticData,
                    meta: sd.meta
                })
            });
            staticDatas = staticDatas.slice(rawData.moonsamas.length)
        }

        if (rawData.tickets.length > 0) {
            staticDatas.slice(0, rawData.tickets.length).map((sd, i) => {
                resultSet.moonsamas.push({
                    ...rawData.tickets[i],
                    staticData: sd.staticData,
                    meta: sd.meta
                })
            });
            staticDatas = staticDatas.slice(rawData.tickets.length)
        }

        if (rawData.resources.length > 0) {
            staticDatas.slice(0, rawData.resources.length).map((sd, i) => {
                resultSet.resources.push({
                    ...rawData.resources[i],
                    staticData: sd.staticData,
                    meta: sd.meta
                })
            });
        }

        setItems(resultSet)
        
    }, [blocknumber, jwt])

    useEffect(() => {
        getUserItems()
    }, [blocknumber, jwt])

    return items
}
