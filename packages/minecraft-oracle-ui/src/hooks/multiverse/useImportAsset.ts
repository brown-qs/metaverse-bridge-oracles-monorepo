import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateGasMargin, getSigner } from '../../utils';
import { useMultiverseBridgeV1Contract, useMultiverseBridgeContract } from '../../hooks/useContracts/useContracts';
import { useActiveWeb3React } from '../../hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import axios from 'axios'
import { AssetType } from 'utils/marketplace';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../state/slices/authSlice';
import { MultiverseVersion } from '../../state/api/types';
import { ChainId, getContractAddress } from '../../constants';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { METAVERSE_V1_ABI, METAVERSE_V2_ABI } from '../../abi/marketplace';
import { ERC20_ABI } from '../../abi/token';
import store from '../../state';
import { addInTransaction, InAsset } from '../../state/slices/transactionsSlice';


export async function assetInTransaction(mv: MultiverseVersion, library: Web3Provider, account: string, calls: string[], signatures: string[], inAssets: InAsset[], swap: boolean) {
    const chainId = inAssets[0].chainId
    const contractAddress = getContractAddress(mv, chainId)
    const abi = (mv === MultiverseVersion.V1) ? METAVERSE_V1_ABI : METAVERSE_V2_ABI
    console.log(`assetInTransaction:: mv: ${mv} chainId: ${chainId} account: ${account} contractAddress: ${contractAddress}`)
    const contract = new Contract(contractAddress, abi, getSigner(library, account))

    let methodName: string
    let args: string[] | string[][]
    if (mv === MultiverseVersion.V1) {
        if (inAssets?.[0]?.enrapture) {
            methodName = "enraptureToMetaverseSig"
        } else {
            methodName = "importToMetaverseSig"

        }
        args = [calls[0], signatures[0]]
    } else {
        methodName = "stakeSigArray"
        args = [calls, signatures]
    }

    const inputOptions = {
        value: "0"
    }

    let gasEstimate
    try {
        gasEstimate = await contract.estimateGas[methodName](...args, inputOptions)
    } catch (e) {
        console.log("Import error: ", e)
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
            throw new Error(`Asset inflow failed: ${e.message}`);
        }
    }
    if (!result.hash) {
        throw new Error("Couldn't get transaction hash.")
    }
    if (!chainId) {
        throw new Error("Couldn't get chainId.")
    }

    store.dispatch(addInTransaction({ hash: result.hash, assets: inAssets, swap }))


    return result
}
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
    beneficiary: string | undefined | null,
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
    chainId?: number,
    multiverseVersion?: MultiverseVersion
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
    const accessToken = useSelector(selectAccessToken)


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
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setParams(resp.data)
        } catch (e) {
            console.error('Error fetching import params.')
            setParams(undefined)
        }
    }, [library, account, stringedRequest, accessToken])


    useEffect(() => {
        if (library && account && importRequest) {
            cb()
        }
    }, [library, account, stringedRequest, accessToken])

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

    // const contract = useMultiverseBridgeV1Contract(true);
    const contract = useMultiverseBridgeContract(assetRequest.multiverseVersion, true, assetRequest.chainId);

    const importRequest = {
        ...assetRequest,
        owner: account?.toLowerCase(),
        beneficiary: account?.toLowerCase()
    }

    const { confirmed, data, hash, signature } = useFetchImportAssetArgumentsCallback(importRequest) ?? {}

    const addTransaction = useTransactionAdder();

    //console.warn('YOLO ORDER', { inputParams, inputOptions });
    const inputOptions = {
        value: assetRequest?.asset?.assetType?.valueOf() == AssetType.NATIVE.valueOf() ? (assetRequest?.amount ?? '0') : '0'
    }

    return useMemo(() => {
        if (!library || !account || !chainId || !contract) {
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
                let methodName = 'importToMetaverseSig';
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
        signature,
        confirmed,
        hash,
        inputOptions.value,
        addTransaction,
        assetRequest.multiverseVersion
    ]);
}
