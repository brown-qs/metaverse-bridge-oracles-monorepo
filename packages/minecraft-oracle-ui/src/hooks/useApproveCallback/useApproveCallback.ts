import { MaxUint256 } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { useActiveWeb3React } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BalanceQuery, NewAsset } from 'hooks/marketplace/types';
import {
  useERC20Contract,
  useERC1155Contract,
  useERC721Contract,
} from 'hooks/useContracts/useContracts';
import {
  useHasPendingApproval,
  useTransactionAdder,
} from 'state/transactions/hooks';
import { calculateGasMargin, getSigner } from 'utils';
import { StringAssetType } from 'utils/subgraph';
import { MULTIVERSE_BRIDGE_V1_ADDRESS, ChainId } from '../../constants';
import { AllowanceQuery } from './useApproveCallback.types';
import { useBlockNumber } from 'state/application/hooks';
import { Contract } from '@ethersproject/contracts';
import { ERC20_ABI, ERC721_ABI, ERC1155_ABI } from '../../abi/token';
import { addApprovalTransaction } from '../../state/slices/transactionsSlice';
import store from '../../state';


export const checkApproval = async (assetAddress: string, assetType: StringAssetType, library: Web3Provider, account: string, spender: string): Promise<BigNumber> => {
  const lowerAccount = account.toLowerCase()
  const lowerSpender = spender.toLowerCase()
  const lowerAssetAddress = assetAddress.toLowerCase()
  if (assetType === StringAssetType.NATIVE) {
    return MaxUint256
  } else if (assetType === StringAssetType.ERC20) {
    const contract = new Contract(lowerAssetAddress, ERC20_ABI, library)
    return await contract.allowance(lowerAccount, lowerSpender)

  } else if (assetType === StringAssetType.ERC721) {
    const contract = new Contract(lowerAssetAddress, ERC721_ABI, library)
    const approved: boolean = await contract.isApprovedForAll(lowerAccount, lowerSpender);
    return approved ? MaxUint256 : BigNumber.from('0')

  } else if (assetType === StringAssetType.ERC1155) {
    const contract = new Contract(lowerAssetAddress, ERC1155_ABI, library)
    const approved: boolean = await contract.isApprovedForAll(lowerAccount, lowerSpender);
    return approved ? MaxUint256 : BigNumber.from('0')

  } else {
    throw new Error(`Unsupported asset type ${assetType.valueOf()}`)
  }
}


export const approveAsset = async (assetAddress: string, assetType: StringAssetType, library: Web3Provider, account: string, operator: string): Promise<TransactionResponse> => {
  const lowerOperator = operator.toLowerCase()
  const lowerAssetAddress = assetAddress.toLowerCase()
  const network = await library.getNetwork()
  let result: TransactionResponse
  if (assetType === StringAssetType.ERC20) {
    const contract = new Contract(lowerAssetAddress, ERC20_ABI, getSigner(library, account))

    let estimatedGas
    try {
      estimatedGas = await contract.estimateGas.approve(lowerOperator, MaxUint256)
    } catch (e) {
      //TO DO: tokens who restrict approval amounts
      throw e
    }
    result = await contract.approve(lowerOperator, MaxUint256, { gasLimit: calculateGasMargin(estimatedGas) })

  } else if (assetType === StringAssetType.ERC721) {
    console.log(`lowerAssetAddress: ${lowerAssetAddress} lowerOperator: ${lowerOperator}`)
    const contract = new Contract(lowerAssetAddress, ERC721_ABI, getSigner(library, account))
    const estimatedGas = await contract.estimateGas.setApprovalForAll(lowerOperator, true)
    result = await contract.setApprovalForAll(lowerOperator, true, { gasLimit: calculateGasMargin(estimatedGas) })

  } else if (assetType === StringAssetType.ERC1155) {
    const contract = new Contract(lowerAssetAddress, ERC1155_ABI, getSigner(library, account))
    const estimatedGas = await contract.estimateGas.setApprovalForAll(lowerOperator, true)
    result = await contract.setApprovalForAll(lowerOperator, true, { gasLimit: calculateGasMargin(estimatedGas) })


  } else {
    throw new Error(`Unsupported asset type ${assetType.valueOf()}`)
  }

  if (!!result) {
    console.log(`network.chainId: ${network.chainId}`)
    if (!result.hash) {
      throw new Error("Couldn't get transaction hash.")
    }
    if (!network.chainId) {
      throw new Error("Couldn't get transaction chainId.")
    }

    store.dispatch(addApprovalTransaction({ hash: result.hash, chainId: network.chainId, assetAddress, assetType, operator: lowerOperator }))
    return result
  } else {
    throw new Error(`Unsupported asset type ${assetType.valueOf()}`)
  }
}


export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export function useAllowance(
  query: AllowanceQuery,
  spender?: string
): BigNumber | undefined {
  const { account, chainId } = useActiveWeb3React();
  const blockumber = useBlockNumber();
  const [allowance, setAllowance] = useState<BigNumber | undefined>();

  const { assetAddress, assetType } = query;

  const erc20 = useERC20Contract(assetAddress, true);
  const erc1155 = useERC1155Contract(assetAddress, true);
  const erc721 = useERC721Contract(assetAddress, true);

  const type = assetType ?? StringAssetType.ERC20;

  const allowanceCheck = useCallback(async () => {
    // console.log('useAllowance', { spender, account, type });
    if (!spender) {
      setAllowance(undefined);
      return;
    }

    if (StringAssetType.NATIVE.valueOf() === type.valueOf()) {
      setAllowance(MaxUint256);
      return;
    } else if (StringAssetType.ERC20.valueOf() === type.valueOf()) {
      if (!erc20) {
        //console.error('ERC20) contract null');
        setAllowance(undefined);
        return;
      }
      const a = await erc20.allowance(account, spender);
      // console.error('ERC20 allowance', a?.toString());
      setAllowance(a);
    } else if (StringAssetType.ERC721.valueOf() === type.valueOf()) {
      if (!erc721) {
        setAllowance(undefined);
        return;
      }
      const approved: boolean = await erc721.isApprovedForAll(account, spender);
      setAllowance(approved ? MaxUint256 : BigNumber.from('0'));
    } else if (StringAssetType.ERC1155.valueOf() === type.valueOf()) {
      if (!erc1155) {
        setAllowance(undefined);
        return;
      }
      const approved: boolean = await erc1155.isApprovedForAll(
        account,
        spender
      );
      setAllowance(approved ? MaxUint256 : BigNumber.from('0'));
    } else {
      setAllowance(undefined);
    }
  }, [chainId, blockumber, account, assetAddress, spender, type]);

  useEffect(() => {
    if (assetAddress && account && spender && type) {
      allowanceCheck();
    }
  }, [chainId, blockumber, account, assetAddress, spender, type]);

  return allowance;
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  query: AllowanceQuery & { amountToApprove?: string | BigNumber }
): [ApprovalState, () => Promise<void>] {
  const { chainId, account } = useActiveWeb3React();

  const { assetId, assetAddress, amountToApprove } = query;

  const erc20 = useERC20Contract(assetAddress, true);
  const erc1155 = useERC1155Contract(assetAddress, true);
  const erc721 = useERC721Contract(assetAddress, true);

  const operator =
    query.operator ??
    (MULTIVERSE_BRIDGE_V1_ADDRESS[chainId ?? ChainId.MOONRIVER] as string);
  const toApprove = BigNumber.from(amountToApprove ?? MaxUint256);
  const currentAllowance = useAllowance(query, operator);
  const assetType = query.assetType ?? StringAssetType.ERC20;

  const pendingApproval = useHasPendingApproval(
    assetAddress,
    operator,
    assetType
  );

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    /* console.error({
       operator,
       currentAllowance: currentAllowance?.toString(),
       toApprove: toApprove?.toString(),
     });*/
    if (!assetAddress || !account || !operator || !currentAllowance)
      return ApprovalState.UNKNOWN;

    /* console.error('approvalState', {
       pendingApproval,
       assetAddress,
       account,
       operator,
       currentAllowance: currentAllowance.toString(),
       toApprove: toApprove?.toString(),
     });*/
    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(toApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [toApprove, currentAllowance, pendingApproval, operator]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (assetType.valueOf() === StringAssetType.NATIVE) {
      return;
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    if (!account) {
      console.error('no user');
      return;
    }

    if (!assetAddress) {
      console.error('no token');
      return;
    }

    if (!operator) {
      console.error('no spender');
      return;
    }

    if (assetType.valueOf() === StringAssetType.ERC20) {
      if (!erc20) {
        return;
      }

      if (!toApprove) {
        console.error('missing amount to approve');
        return;
      }
      let useExact = false;
      const estimatedGas = await erc20.estimateGas
        .approve(operator, MaxUint256)
        .catch(() => {
          // general fallback for tokens who restrict approval amounts
          useExact = true;
          return erc20.estimateGas.approve(operator, toApprove);
        });

      return erc20
        .approve(operator, useExact ? toApprove : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Approve ${assetType} ${assetAddress}`,
            approval: {
              tokenAddress: assetAddress,
              tokenType: assetType,
              spender: operator,
            },
          });
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error);
          throw error;
        });
    } else if (assetType.valueOf() === StringAssetType.ERC721) {
      if (!erc721) {
        return;
      }
      const estimatedGas = await erc721.estimateGas
        .setApprovalForAll(operator, true)
        .catch((e: Error) => {
          console.error('ERC721 approval failed', e);
          throw e;
        });

      return erc721
        .setApprovalForAll(operator, true, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Approve ${assetType} ${assetAddress}`,
            approval: {
              tokenAddress: assetAddress,
              tokenType: assetType,
              spender: operator,
            },
          });
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error);
          throw error;
        });
    } else if (assetType.valueOf() === StringAssetType.ERC1155) {
      if (!erc1155) {
        return;
      }
      // console.log({ assetType, assetAddress, assetId, account });
      const estimatedGas = await erc1155.estimateGas
        .setApprovalForAll(operator, true)
        .catch((e: Error) => {
          console.error('ERC1155 approval failed', e);
          throw e;
        });

      return erc1155
        .setApprovalForAll(operator, true, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Approve ${assetType} ${assetAddress}`,
            approval: {
              tokenAddress: assetAddress,
              tokenType: assetType,
              spender: operator,
            },
          });
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error);
          throw error;
        });
    }
  }, [
    approvalState,
    assetType,
    assetId,
    assetAddress,
    toApprove,
    operator,
    addTransaction,
  ]);

  return [approvalState, approve];
}
