import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateGasMargin, getSigner } from '../../utils';
import { useMarketplaceV1Contract } from '../../hooks/useContracts/useContracts';
import { useActiveWeb3React } from '../../hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import axios from 'axios'
import { StringAssetType } from 'utils/subgraph';

export enum EnraptureAssetCallbackState {
    INVALID,
    LOADING,
    VALID,
    CONFIRMED
}

export interface EnraptureRequest {
    asset: {
        assetAddress: string,
        assetId: string,
        assetType: string
    },
    owner: string | undefined | null,
    beneficiary: string| undefined | null,
    amount: string
}

export interface AssetRequest {
    asset: {
        assetAddress: string,
        assetId: string,
        assetType: string
    },
    amount: string
}

export type EnraptureRequestParams = {
    hash: string,
    data: string
    signature: string,
    confirmed: boolean
}

export function useFetchEnraptureAssetArgumentsCallback(enraptureRequest: EnraptureRequest) {
    const { library, account } = useActiveWeb3React();

    const [params, setParams] = useState<EnraptureRequestParams | undefined>(undefined)

    const stringedRequest = JSON.stringify(enraptureRequest)

    const cb = useCallback(async () => {
        if (!library || !account || !enraptureRequest.owner || !enraptureRequest.beneficiary || !enraptureRequest.asset) {
            setParams(undefined);
        }
        try {
            const resp = await axios.request<EnraptureRequestParams>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/enrapture`,
                data: enraptureRequest
            });
            setParams(resp.data)
        } catch(e) {
            console.error('Error fetching import params.')
            setParams(undefined)
        }
    }, [library, account, stringedRequest])


    useEffect(() => {
        if (library && account && enraptureRequest) {
            cb()
        }
    }, [library, account, stringedRequest])

    return params
}

export function useEnraptureAssetCallback(
    assetRequest: AssetRequest,
): {
    state: EnraptureAssetCallbackState;
    callback: null | (() => Promise<string>);
    error: string | null;
} {
    const { account, chainId, library } = useActiveWeb3React();

    //console.log('YOLO', { account, chainId, library });
    const contract = useMarketplaceV1Contract(true);
    

    const enraptureRequest = {
        ...assetRequest,
        owner: account,
        beneficiary: account
    }

    const { confirmed, data, hash, signature } = useFetchEnraptureAssetArgumentsCallback(enraptureRequest) ?? {}

    const addTransaction = useTransactionAdder();

    //console.warn('YOLO ORDER', { inputParams, inputOptions });
    const inputOptions = {
        value: assetRequest.asset.assetType.valueOf() == StringAssetType.NATIVE.valueOf() ? (assetRequest?.amount ?? '0') : '0'
    }

    return useMemo(() => {
        if (!library || !account || !chainId || !contract ) {
            return {
                state: EnraptureAssetCallbackState.INVALID,
                callback: null,
                error: 'Missing dependencies',
            };
        }

        if (confirmed) {
            return {
                state: EnraptureAssetCallbackState.CONFIRMED,
                callback: null,
                error: 'Already confirmed',
            };
        }

        if (!data || !signature || !hash) {
          console.error('Error fetching input params from oracle');
          return {
            state: EnraptureAssetCallbackState.INVALID,
            callback: null,
            error: 'Error fetching input params from oracle',
          };
        }

        const inputParams = [data, signature]

        return {
            state: EnraptureAssetCallbackState.VALID,
            callback: async function onEnraptureAsset(): Promise<string> {
                const args = inputParams;
                const methodName = 'enraptureToMetaverseSig';

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
                        const sum = `Enraptureing asset with hash ${hash}`;
                        addTransaction(response, {
                            summary: sum,
                            enraptureResult: {
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
                            console.error(`Enrapture asset failed`, error, methodName, args);
                            throw new Error(`Enrapture asset failed: ${error.message}`);
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