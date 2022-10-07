import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateGasMargin } from '../../utils';
import { useMultiverseBridgeV1Contract, useMultiverseBridgeContract } from '../../hooks/useContracts/useContracts';
import { useActiveWeb3React } from '../../hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import axios from 'axios'
import { AssetType } from 'utils/marketplace';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../state/slices/authSlice';
import { MultiverseVersion } from '../../state/api/types';

export enum EnraptureAssetCallbackState {
    INVALID,
    LOADING,
    VALID,
    CONFIRMED
}

export interface EnraptureRequest {
    asset?: {
        assetAddress?: string,
        assetId?: string,
        assetType?: AssetType
    },
    owner: string | undefined | null,
    beneficiary: string | undefined | null,
    amount: string,
    chain?: number
}

export interface AssetRequest {
    asset?: {
        assetAddress?: string,
        assetId?: string,
        assetType?: AssetType,
    },
    amount: string,
    chainId?: number,
    multiverseVersion?: MultiverseVersion
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
    const accessToken = useSelector(selectAccessToken)

    const stringedRequest = JSON.stringify(enraptureRequest)

    // console.log('enrapture request', enraptureRequest)

    const cb = useCallback(async () => {
        if (!library || !account || !enraptureRequest.owner || !enraptureRequest.beneficiary || !enraptureRequest.asset || !enraptureRequest.asset.assetAddress || !enraptureRequest.asset.assetId) {
            setParams(undefined);
        }
        try {
            const resp = await axios.request<EnraptureRequestParams>({
                method: 'put',
                url: `${process.env.REACT_APP_BACKEND_API_URL}/oracle/enrapture`,
                data: enraptureRequest,
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setParams(resp.data)
        } catch (e) {
            //console.error('Error fetching import params.')
            setParams(undefined)
        }
    }, [library, account, stringedRequest, accessToken])


    useEffect(() => {
        if (library && account && enraptureRequest) {
            cb()
        }
    }, [library, account, stringedRequest, accessToken])

    return params
}

export function useEnraptureAssetCallback(
    assetRequest: AssetRequest,
): {
    state: EnraptureAssetCallbackState;
    callback: null | (() => Promise<string>);
    error: string | null;
    hash?: string;
} {
    const { account, chainId, library } = useActiveWeb3React();

    //console.log('YOLO', { account, chainId, library });
    // const contract = useMultiverseBridgeV1Contract(true);
    const contract = useMultiverseBridgeContract(assetRequest.multiverseVersion, true, assetRequest.chainId);

    const enraptureRequest = {
        ...assetRequest,
        owner: account?.toLowerCase(),
        beneficiary: account?.toLowerCase(),
    }

    const { confirmed, data, hash, signature } = useFetchEnraptureAssetArgumentsCallback(enraptureRequest) ?? {}

    const addTransaction = useTransactionAdder();

    //console.warn('YOLO ORDER', { inputParams, inputOptions });
    const inputOptions = {
        value: assetRequest?.asset?.assetType?.valueOf() == AssetType.NATIVE.valueOf() ? (assetRequest?.amount ?? '0') : '0'
    }

    return useMemo(() => {
        if (!library || !account || !chainId || !contract) {
            return {
                state: EnraptureAssetCallbackState.INVALID,
                callback: null,
                error: 'Missing dependencies',
                hash
            };
        }

        if (confirmed) {
            return {
                state: EnraptureAssetCallbackState.CONFIRMED,
                callback: null,
                error: 'Already confirmed',
                hash
            };
        }

        if (!data || !signature || !hash) {
            //console.error('Error fetching input params from oracle');
            return {
                state: EnraptureAssetCallbackState.INVALID,
                callback: null,
                error: 'Error fetching input params from oracle',
                hash
            };
        }

        const inputParams = [data, signature]

        return {
            state: EnraptureAssetCallbackState.VALID,
            hash,
            callback: async function onEnraptureAsset(): Promise<string> {
                const args = inputParams;
                let methodName = 'enraptureToMetaverseSig';
                if (assetRequest.multiverseVersion === MultiverseVersion.V2) {
                    methodName = 'stakeSig'
                }
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
                    /*console.debug(
                        'Gas estimate failed, trying eth_call to extract error',
                        call
                    );*/

                    return contract.callStatic[methodName](...args, inputOptions)
                        .then((result: any) => {
                            /*console.debug(
                                'Unexpected successful call after failed estimate gas',
                                call,
                                gasError,
                                result
                            );*/
                            throw new Error(
                                'Unexpected issue with estimating the gas. Please try again.'
                            );
                        })
                        .catch((callError: any) => {
                            // console.debug('Call threw error', call, callError);
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
                        const sum = `Enrapturing asset with hash ${hash}`;
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
                            // console.error(`Enrapture asset failed`, error, methodName, args);
                            throw new Error(`Enrapture asset failed: ${error.message}`);
                        }
                    });
            },
            error: null
        };
    }, [
        library,
        account,
        chainId,
        data,
        signature, ,
        confirmed,
        hash,
        inputOptions.value,
        addTransaction,
    ]);
}
