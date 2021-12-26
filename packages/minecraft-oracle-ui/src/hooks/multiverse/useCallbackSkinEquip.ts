import axios, { AxiosError } from "axios";
import { useCallback } from "react";
import { Asset } from "utils/marketplace";
import { useAuth } from "../";

export type Skinselect = {
    assetId: string
    assetType: string
    assetAddress: string
}

export function useCallbackSkinEquip() {
    const { authData } =  useAuth();
    const {jwt} = authData ?? {}
    return useCallback(async (asset?: Skinselect) => {
        if (!asset) {
            return false
        }
        try {
            const resp = await axios.request<boolean>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/user/skin`,
                data: asset,
                headers: { Authorization: `Bearer ${jwt}` }
            });
            return resp.data
        } catch(e) {
            if((e as AxiosError)?.response?.status === 504) {
                console.error('Gateway timeout')
                return true
            }
            console.error('Error equipping skin. Try again later.')
            return false
        }
    }, [jwt])
}