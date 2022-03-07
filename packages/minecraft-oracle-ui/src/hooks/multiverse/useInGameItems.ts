import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useBlockNumber } from 'state/application/hooks';
import { useAuth } from 'hooks';
import { StaticTokenData, useTokenStaticDataCallbackArray } from 'hooks/useTokenStaticDataCallback/useTokenStaticDataCallback';
import { stringToStringAssetType } from 'utils/subgraph';
import { RecognizedAssetType } from 'assets/data/recognized'

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
    meta: any,
    recognizedAssetType: RecognizedAssetType,
    enraptured: boolean,
    exportChainName: string,
    exportAddress: string,
}

export interface InGameTexture {
    assetAddress: string
    assetId: string
    assetType: string
    selectable: boolean
    equipped: boolean
    hash?: string
    textureData: string
    textureSignature: string,
    decodedData?: any,
    textureURL?: string,
    coverURL?: string,
    renderURL?: string,
    name?: string
}

export type InGameItemWithStatic = InGameItem & {staticData: StaticTokenData} 

export interface ProfileInGameItems {
    assets: InGameItem[],
    textures: InGameTexture[],
    resources: InGameItem[]
}

export interface ProfileInGameItemsWithStatic {
    assets: InGameItemWithStatic[],
    textures: InGameTexture[],
    resources: InGameItemWithStatic[]
}

export function useInGameItems(trigger: string | undefined = undefined) {
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
        console.log({rawData})
        const melange = [...rawData.assets, ...rawData.resources]
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
        let resultSet: ProfileInGameItemsWithStatic = { assets: [], resources: [], textures: []}
        console.log({staticDatas, rawData})
        if (rawData.assets.length > 0) {
            staticDatas.slice(0, rawData.assets.length).map((sd, i) => {
                resultSet.assets.push({
                    ...rawData.assets[i],
                    staticData: sd.staticData,
                    meta: sd.meta
                })
            });
            staticDatas = staticDatas.slice(rawData.assets.length)
        }
        console.log('shinshin', {resultSet})

        if (rawData.resources.length > 0) {
            staticDatas.slice(0, rawData.resources.length).map((sd, i) => {
                resultSet.resources.push({
                    ...rawData.resources[i],
                    staticData: sd.staticData,
                    meta: sd.meta
                })
            });
        }

        resultSet.textures = await Promise.all(rawData.textures.map(async (texture) => {
            const decoded = Buffer.from(texture.textureData, 'base64').toString()
            const textureURL = !!decoded ? JSON.parse(decoded)?.textures?.SKIN?.url : undefined
            const coverURL = !!textureURL ? `https://api.mineskin.org/render/skin?url=${textureURL}` : undefined

            /*
            const resp = await axios.post<{uuid: string}>(
                `https://api.mineskin.org/generate/url`,
                {
                    name: 'string',
                    visibility: 1,
                    url: textureURL
                });

            const renderURL = `https://api.mineskin.org/render/texture/${resp.data.uuid}`
            */

            texture['decodedData'] = decoded
            texture['textureURL'] = textureURL
            texture['coverURL'] = coverURL
            //texture['renderURL'] = renderURL

            return texture
        }))

        setItems(resultSet)
        
    }, [blocknumber, jwt, trigger])

    useEffect(() => {
        getUserItems()
    }, [blocknumber, jwt, trigger])

    return items
}
