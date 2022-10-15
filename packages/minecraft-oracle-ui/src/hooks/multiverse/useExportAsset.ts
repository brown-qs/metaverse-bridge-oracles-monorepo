import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateGasMargin, getSigner } from '../../utils';
import { useMultiverseBridgeV1Contract, useMultiverseBridgeContract } from '../../hooks/useContracts/useContracts';
import { useActiveWeb3React } from '../../hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../state/slices/authSlice';
import { MultiverseVersion } from '../../state/api/types';
import store from '../../state';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider, TransactionResponse } from '@ethersproject/providers';
import { METAVERSE_V1_ABI, METAVERSE_V2_ABI } from '../../abi/marketplace';
import { InAsset, addInTransaction, addOutTransaction } from '../../state/slices/transactionsSlice';
import { ChainId, getContractAddress } from '../../constants';


export async function assetOutTransaction(mv: MultiverseVersion, library: Web3Provider, account: string, chainId: ChainId, calls: string[], signatures: string[], bridgeHashes: string[]) {
    const contractAddress = getContractAddress(mv, chainId)
    const abi = (mv === MultiverseVersion.V1) ? METAVERSE_V1_ABI : METAVERSE_V2_ABI
    console.log(`assetOutTransaction:: mv: ${mv} chainId: ${chainId} account: ${account} contractAddress: ${contractAddress}`)
    const contract = new Contract(contractAddress, abi, getSigner(library, account))

    let methodName: string
    let args: string[] | string[][]
    if (mv === MultiverseVersion.V1) {
        methodName = "exportFromMetaverseSig"
        args = [calls[0], signatures[0]]
    } else {
        methodName = "unstakeSig"
        args = [calls, signatures]
    }

    console.log("args" + JSON.stringify(args))
    const inputOptions = {}

    let gasEstimate
    try {
        gasEstimate = await contract.estimateGas[methodName](...args, inputOptions)
    } catch (e) {
        console.log("Export error: ", e)
        let callStaticSuccess = false;
        try {
            await contract.callStatic[methodName](...args, inputOptions)
            callStaticSuccess = true

            //Unexpected successful call after failed estimate gas
        } catch (callError: any) {
            console.debug('Call threw error', methodName, args, callError);

            let cErr = callError
            if (!!callError?.data) {
                cErr = JSON.stringify(callError?.data)
            }
            let errorMessage = `The transaction cannot succeed due to error: ${cErr}`;
            throw new Error(errorMessage);

        }
        if (callStaticSuccess) {
            throw new Error('Unexpected issue with estimating the gas. Please try again.');
        }
    }
    if (!gasEstimate) {
        throw new Error('Unexpected error. Please contact support: none of the calls threw an error');
    }
    let result: TransactionResponse
    try {
        result = await contract[methodName](...args, { gasLimit: calculateGasMargin(gasEstimate), from: account, ...inputOptions })
    } catch (e: any) {
        if (e?.code === 4001) {
            throw new Error('Transaction rejected.');
        } else {
            // otherwise, the error was unexpected and we need to convey that
            // console.error(`Enrapture asset failed`, error, methodName, args);
            throw new Error(`Asset outflow failed: ${e.message}`);
        }
    }
    if (!result.hash) {
        throw new Error("Couldn't get transaction hash.")
    }
    if (!chainId) {
        throw new Error("Couldn't get chainId.")
    }

    store.dispatch(addOutTransaction({ hash: result.hash, bridgeHashes, chainId }))
    return result
}

export enum ExportAssetCallbackState {
    INVALID,
    LOADING,
    VALID,
    CONFIRMED
}

export interface ExportRequest {
    hash?: string,
    chainId?: number,
    multiverseVersion?: MultiverseVersion
}

export interface AssetRequest {
    asset: {
        assetAddress: string,
        assetId: string,
        assetType: string
    },
    amount: string
}

export type ExportRequestParams = {
    hash: string,
    data: string
    signature: string,
    confirmed: boolean
}

export function useFetchExportAssetArgumentsCallback(exportRequest: ExportRequest) {
    const { library, account } = useActiveWeb3React();

    const [params, setParams] = useState<ExportRequestParams | undefined>(undefined)
    const accessToken = useSelector(selectAccessToken)

    const { hash, chainId } = exportRequest ?? {}

    const cb = useCallback(async () => {
        if (!library || !account || !hash || !chainId) {
            setParams(undefined);
        }
        try {
            const resp = await axios.request<ExportRequestParams>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/export`,
                data: exportRequest,
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setParams(resp.data)
        } catch (e) {
            console.error('Error fetching export params.')
            setParams(undefined)
        }
    }, [library, account, hash, accessToken, chainId])


    useEffect(() => {
        if (library && account && exportRequest) {
            cb()
        }
    }, [library, account, hash, accessToken])

    return params
}

export function useExportAssetCallback(
    exportRequest: ExportRequest,
): {
    state: ExportAssetCallbackState;
    callback: null | (() => Promise<string>);
    error: string | null;
} {
    const { account, chainId, library } = useActiveWeb3React();

    //console.log('YOLO', { account, chainId, library });
    // const contract = useMultiverseBridgeV1Contract(true);
    const contract = useMultiverseBridgeContract(exportRequest.multiverseVersion, true, exportRequest.chainId);

    const { confirmed, data, hash, signature } = useFetchExportAssetArgumentsCallback(exportRequest) ?? {}

    const addTransaction = useTransactionAdder();

    //console.warn('YOLO ORDER', { inputParams, inputOptions });
    const inputOptions = {}

    return useMemo(() => {
        if (!library || !account || !chainId || !contract) {
            return {
                state: ExportAssetCallbackState.INVALID,
                callback: null,
                error: 'Missing dependencies',
            };
        }

        if (confirmed) {
            return {
                state: ExportAssetCallbackState.CONFIRMED,
                callback: null,
                error: 'Already confirmed',
            };
        }

        if (!data || !signature || !hash) {
            console.error('Error fetching input params from oracle');
            return {
                state: ExportAssetCallbackState.INVALID,
                callback: null,
                error: 'Error fetching input params from oracle',
            };
        }

        const inputParams = [data, signature]

        return {
            state: ExportAssetCallbackState.VALID,
            callback: async function onEnraptureAsset(): Promise<string> {
                let methodName = 'exportFromMetaverseSig';
                let parameters: any = inputParams
                if (exportRequest.multiverseVersion === MultiverseVersion.V2) {
                    methodName = 'unstakeSig'
                    parameters = [[inputParams[0]], [inputParams[1]]]
                }
                const call = {
                    contract: contract.address,
                    parameters,
                    methodName,
                };

                console.log(call);

                const gasEstimate = await contract.estimateGas[methodName](
                    ...parameters,
                    inputOptions
                ).catch((gasError: any) => {
                    console.debug(
                        'Gas estimate failed, trying eth_call to extract error',
                        call
                    );

                    return contract.callStatic[methodName](...parameters, inputOptions)
                        .then((result: any) => {
                            console.debug(
                                'Unexpected successful call after failed estimate gas',
                                call,
                                gasError,
                                result
                            );
                            throw new Error(
                                'Unexpected issue with estimating the gas. Please try again.'
                            );
                        })
                        .catch((callError: any) => {
                            console.debug('Call threw error', call, callError);
                            let errorMessage = `The transaction cannot succeed due to error: ${callError.reason}`;
                            throw new Error(errorMessage);
                        });
                });

                if (!gasEstimate) {
                    throw new Error(
                        'Unexpected error. Please contact support: none of the calls threw an error'
                    );
                }

                return contract[methodName](...parameters, {
                    gasLimit: calculateGasMargin(gasEstimate),
                    from: account,
                    ...inputOptions,
                })
                    .then((response: any) => {
                        const sum = `Exporting asset with hash ${hash}`;
                        addTransaction(response, {
                            summary: sum,
                            exportResult: {
                                hash
                            },
                        });
                        return response.hash;
                    })
                    .catch((error: any) => {
                        // if the user rejected the tx, pass this along
                        if (error?.code === 4001) {
                            throw new Error('Transaction rejected.');
                        } else {
                            // otherwise, the error was unexpected and we need to convey that
                            console.error(`Export asset failed`, error, methodName, parameters);
                            throw new Error(`Export asset failed: ${error.message}`);
                        }
                    });
            },
            error: null,
        };
    }, [
        library,
        account,
        chainId,
        data,
        signature, ,
        confirmed,
        hash,
        addTransaction,
    ]);
}
