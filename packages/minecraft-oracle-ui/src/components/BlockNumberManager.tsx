import { useDispatch, useSelector } from "react-redux";
import { PERMISSIONED_CHAINS, RPC_URLS } from "../constants";
import useIsWindowVisible from "../hooks/useIsWindowVisible/useIsWindowVisible";
import { AppDispatch } from "../state";
import { ethers } from "ethers"
import { useActiveWeb3React } from "../hooks";
import { useEffect, useRef } from "react";
import { selectAccessToken } from "../state/slices/authSlice";
import { setBlockNumber } from "../state/slices/blockNumbersSlice";
export const BlockNumberManager = () => {
    const accessToken = useSelector(selectAccessToken)
    const providersRef = useRef<ethers.providers.JsonRpcProvider[]>([])
    const { account } = useActiveWeb3React();
    const dispatch = useDispatch<AppDispatch>();
    const windowVisible = useIsWindowVisible();


    useEffect(() => {
        //only start listening to blocks if connect wallet or login
        if ((!!accessToken || !!account) && windowVisible) {
            //providers never assigned
            if (providersRef.current.length === 0) {
                console.log("START LISTENING FOR BLOCKS")
                for (const chain of PERMISSIONED_CHAINS) {
                    const rpcUrl = RPC_URLS[chain]
                    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
                    providersRef.current.push(provider)
                    provider.getBlockNumber().then((block) => {
                        dispatch(setBlockNumber({ chainId: chain, blockNumber: block }))
                        provider.on("block", (bl) => dispatch(setBlockNumber({ chainId: chain, blockNumber: bl })))
                    }).catch((e) => {
                        console.log("BlockNumberManager:: couldn't get first block")
                    })
                }
            }
        }
        return () => {
            for (const prov of providersRef.current) {
                prov?.removeAllListeners()
            }
        }
    }, [accessToken, windowVisible, account])
    return null
}