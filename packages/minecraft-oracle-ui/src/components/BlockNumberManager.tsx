import { useDispatch, useSelector } from "react-redux";
import { PERMISSIONED_CHAINS, RPC_URLS } from "../constants";
import useIsWindowVisible from "../hooks/useIsWindowVisible/useIsWindowVisible";
import state, { AppDispatch } from "../state";
import { ethers } from "ethers"
import { useActiveWeb3React } from "../hooks";
import { useEffect, useRef } from "react";
import { selectAccessToken } from "../state/slices/authSlice";
import { setBlockNumber } from "../state/slices/blockNumbersSlice";
import { selectAllTransactions, selectAllTransactionsFromLastDay, setReceipt, shouldCheckTransactionOnBlock, transactionToChainId, TransactionType } from "../state/slices/transactionsSlice";
import store from "../state";
import { bridgeApi } from "../state/api/bridgeApi";
const DEBUG = false
export const BlockNumberManager = () => {
    const accessToken = useSelector(selectAccessToken)
    const providersRef = useRef<ethers.providers.JsonRpcProvider[]>([])
    const { account } = useActiveWeb3React();
    const dispatch = useDispatch();
    const windowVisible = useIsWindowVisible();


    useEffect(() => {
        if (DEBUG) console.log("BlockNumberManager:: UNMOUNT")
        //only start listening to blocks if connect wallet or login

        //(!!accessToken || !!account) && windowVisible
        if (true) {
            //providers never assigned
            if (providersRef.current.length === 0) {
                if (DEBUG) console.log(`BlockNumberManager:: adding block listeners...`)

                for (const chain of PERMISSIONED_CHAINS) {
                    const rpcUrl = RPC_URLS[chain]
                    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
                    providersRef.current.push(provider)
                    provider.getBlockNumber().then((block) => {
                        dispatch(setBlockNumber({ chainId: chain, blockNumber: block }))
                        provider.on("block", (bl) => {
                            if (DEBUG) console.log(`BlockNumberManager:: chain: ${chain} new block: ${bl}`)
                            dispatch(setBlockNumber({ chainId: chain, blockNumber: bl }))
                            //try to complete transactions here

                            //cant use this reactively dont want useffect to drop all the listeners each time
                            const allTransactionFromLastDay = selectAllTransactionsFromLastDay(store.getState())
                            try {
                                allTransactionFromLastDay.map(async (transaction) => {
                                    try {
                                        const chainId = transactionToChainId(transaction)
                                        if (chainId === chain) {
                                            const doCheck = shouldCheckTransactionOnBlock(transaction, bl)
                                            if (DEBUG) console.log(`BlockNumberManager:: hash: ${transaction.hash} doCheck: ${doCheck}`)
                                            if (doCheck) {
                                                const receipt = await provider.getTransactionReceipt(transaction.hash)
                                                if (receipt) {
                                                    const serializedReceipt = {
                                                        blockHash: receipt.blockHash,
                                                        blockNumber: receipt.blockNumber,
                                                        contractAddress: receipt.contractAddress,
                                                        from: receipt.from,
                                                        status: receipt.status,
                                                        to: receipt.to,
                                                        transactionHash: receipt.transactionHash,
                                                        transactionIndex: receipt.transactionIndex,
                                                    }
                                                    dispatch(setReceipt({ hash: transaction.hash, receipt: serializedReceipt }))

                                                    if (transaction.type === TransactionType.In) {
                                                        transaction.assets.map((a) => {
                                                            try {
                                                                //{ hash: a.bridgeHash, chainId: a.chainId }
                                                                if (DEBUG) console.log(`BlockNumberManager:: transaction hash: ${transaction.hash} trying to confirm bridgeHash: ${a.bridgeHash}`)

                                                                store.dispatch(bridgeApi.endpoints.inConfirm.initiate({ hash: a.bridgeHash, chainId: a.chainId }) as any)

                                                            } catch (e) {

                                                            }
                                                        })
                                                    } else if (transaction.type === TransactionType.Out) {
                                                        if (DEBUG) console.log(`BlockNumberManager:: transaction hash: ${transaction.hash} trying to confirm exports`)
                                                        transaction.bridgeHashes.map((h) => {
                                                            try {
                                                                //{ hash: a.bridgeHash, chainId: a.chainId }
                                                                if (DEBUG) console.log(`BlockNumberManager:: transaction hash: ${transaction.hash} trying to confirm export bridgeHash: ${h}`)

                                                                store.dispatch(bridgeApi.endpoints.outConfirm.initiate({ hash: h, chainId: transaction.chainId }) as any)

                                                            } catch (e) {

                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        if (DEBUG) console.log("BlockNumberManager:: Error 2", e)
                                    }
                                })
                            } catch (e) {
                                if (DEBUG) console.log("BlockNumberManager:: Error 1", e)
                            }
                        })
                    }).catch((e) => {
                        if (DEBUG) console.log("BlockNumberManager:: couldn't get first block")
                    })
                }
            }
        }
        return () => {
            if (DEBUG) console.log("BlockNumberManager:: UNMOUNT")
            for (const prov of providersRef.current) {
                prov?.removeAllListeners()
            }
            //reset so they can be re-added on next mount
            providersRef.current = []
        }
    }, []) //accessToken, windowVisible, account
    return null
}