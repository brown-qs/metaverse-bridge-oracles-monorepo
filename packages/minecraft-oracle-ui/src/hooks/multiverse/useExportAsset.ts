import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateGasMargin, getSigner } from '../../utils';
import { useMultiverseBridgeV1Contract, useMultiverseBridgeV2Contract } from '../../hooks/useContracts/useContracts';
import { useActiveWeb3React } from '../../hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../state/slices/authSlice';

export enum ExportAssetCallbackState {
    INVALID,
    LOADING,
    VALID,
    CONFIRMED
}

export interface ExportRequest {
    hash?: string,
    chainId?: number
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
    const contract = useMultiverseBridgeV2Contract(true, exportRequest.chainId);

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
                const args = inputParams;
                const methodName = 'exportFromMetaverseSig';

                const call = {
                    contract: contract.address,
                    parameters: inputParams,
                    methodName,
                };

                console.log(call);

                const gasEstimate = await contract.estimateGas[methodName](
                    ...args,
                    inputOptions
                ).catch((gasError: any) => {
                    console.debug(
                        'Gas estimate failed, trying eth_call to extract error',
                        call
                    );

                    return contract.callStatic[methodName](...args, inputOptions)
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

                return contract[methodName](...args, {
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
                            console.error(`Export asset failed`, error, methodName, args);
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
