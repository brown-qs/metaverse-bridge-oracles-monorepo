import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateGasMargin } from '../../utils';
import { useMultiverseBridgeV1Contract } from '../../hooks/useContracts/useContracts';
import { useActiveWeb3React, useAuth } from '../../hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import axios from 'axios'
import { AssetType } from 'utils/marketplace';

export enum CreateImportAssetCallbackState {
    INVALID,
    LOADING,
    VALID,
    CONFIRMED
}

export interface ImportRequest {
    asset?: {
        assetAddress?: string,
        assetId?: string,
        assetType?: AssetType
    },
    owner: string | undefined | null,
    beneficiary: string| undefined | null,
    amount: string,
    chainId?: number
}

export interface AssetRequest {
    asset?: {
        assetAddress?: string,
        assetId?: string,
        assetType?: AssetType
    },
    amount: string,
    chain?: number
}

export type ImportRequestParams = {
    hash: string,
    data: string
    signature: string,
    confirmed: boolean
}

export function useFetchImportAssetArgumentsCallback(importRequest: ImportRequest) {
    const { library, account } = useActiveWeb3React();

    const [params, setParams] = useState<ImportRequestParams | undefined>(undefined)
    const { authData } =  useAuth();
    
    const {jwt} = authData ?? {}
    
    const stringedRequest = JSON.stringify(importRequest)

    const cb = useCallback(async () => {
        if (!library || !account || !importRequest.owner || !importRequest.beneficiary || !importRequest.asset) {
            setParams(undefined);
        }
        try {
            const resp = await axios.request<ImportRequestParams>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/import`,
                data: importRequest,
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setParams(resp.data)
        } catch(e) {
            console.error('Error fetching import params.')
            setParams(undefined)
        }
    }, [library, account, stringedRequest, jwt])


    useEffect(() => {
        if (library && account && importRequest) {
            cb()
        }
    }, [library, account, stringedRequest, jwt])

    return params
}

export function useImportAssetCallback(
    assetRequest: AssetRequest,
): {
    state: CreateImportAssetCallbackState;
    callback: null | (() => Promise<string>);
    error: string | null;
    hash?: string
} {
    const { account, chainId, library } = useActiveWeb3React();

    const contract = useMultiverseBridgeV1Contract(true);

    const importRequest = {
        ...assetRequest,
        owner: account,
        beneficiary: account
    }

    const { confirmed, data, hash, signature } = useFetchImportAssetArgumentsCallback(importRequest) ?? {}

    const addTransaction = useTransactionAdder();

    //console.warn('YOLO ORDER', { inputParams, inputOptions });
    const inputOptions = {
        value: assetRequest?.asset?.assetType?.valueOf() == AssetType.NATIVE.valueOf() ? (assetRequest?.amount ?? '0') : '0'
    }

    return useMemo(() => {
        if (!library || !account || !chainId || !contract ) {
            return {
                state: CreateImportAssetCallbackState.INVALID,
                callback: null,
                error: 'Missing dependencies',
                hash
            };
        }

        if (confirmed) {
            return {
                state: CreateImportAssetCallbackState.CONFIRMED,
                callback: null,
                error: 'Already confirmed',
                hash
            };
        }

        if (!data || !signature || !hash) {
          console.error('Error fetching input params from oracle');
          return {
            state: CreateImportAssetCallbackState.INVALID,
            callback: null,
            error: 'Error fetching input params from oracle',
            hash
          };
        }

        const inputParams = [data, signature]
        return {
            state: CreateImportAssetCallbackState.VALID,
            hash,
            callback: async function onImportAsset(): Promise<string> {
                const args = inputParams;
                const methodName = 'importToMetaverseSig';

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
                        const sum = `Importing asset with hash ${hash}`;
                        addTransaction(response, {
                            summary: sum,
                            importResult: {
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
                            console.error(`Import asset failed`, error, methodName, args);
                            throw new Error(`Import asset failed: ${error.message}`);
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
        signature,,
        confirmed,
        hash,
        inputOptions.value,
        addTransaction,
    ]);
}
