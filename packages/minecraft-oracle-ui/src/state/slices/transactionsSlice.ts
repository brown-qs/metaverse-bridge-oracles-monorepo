import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { tr } from "date-fns/locale";
import { AppState } from ".."
import { ChainId } from "../../constants";
import { StringAssetType } from "../../utils/subgraph";
import { InRequestDto, Oauth2PublicClientDto } from "../api/types"
export interface TransactionReceipt {
    to: string;
    from: string;
    contractAddress: string;
    transactionIndex: number;
    blockHash: string;
    transactionHash: string;
    blockNumber: number;
    status?: number;
}
export enum TransactionType {
    Approval = "APPROVAL",
    In = "IN",
    Out = "OUT"
}
export enum ApprovalType {
    Approve = "APPROVE",
    Revoke = "REVOKE"
}

export interface BaseTransaction {
    hash: string
    type: TransactionType
    addedAt: number
    receipt: TransactionReceipt | undefined
    lastCheckedBlock: number
}

export interface ApprovalTransaction extends BaseTransaction {
    type: TransactionType.Approval,
    approvalType: ApprovalType,
    chainId: ChainId
    assetType: StringAssetType
    assetAddress: string
    operator: string
}

export type InAsset = { bridgeHash: string } & InRequestDto
export interface InTransaction extends BaseTransaction {
    type: TransactionType.In,
    assets: InAsset[]
}

export interface OutTransaction extends BaseTransaction {
    type: TransactionType.Out,
    chainId: ChainId,
    bridgeHashes: string[]
}

export type AllTransactionsType = ApprovalTransaction | InTransaction | OutTransaction

export interface TransactionsSlice {
    approvalTransactions: ApprovalTransaction[]
    inTransactions: InTransaction[],
    outTransaction: OutTransaction[],
}

const initialState = { approvalTransactions: [], inTransactions: [], outTransaction: [] } as TransactionsSlice
const transactionsSlice = createSlice({
    name: "transactionsSlice",
    initialState,
    reducers: {
        addApprovalTransaction: (state, action: PayloadAction<Pick<ApprovalTransaction, "hash" | "chainId" | "assetType" | "assetAddress" | "operator">>) => {
            const payload = action.payload
            const trans: ApprovalTransaction = {
                hash: payload.hash,
                type: TransactionType.Approval,
                addedAt: new Date().getTime(),
                receipt: undefined,
                lastCheckedBlock: 0,

                approvalType: ApprovalType.Approve,
                chainId: payload.chainId,
                assetType: payload.assetType,
                assetAddress: payload.assetAddress.toLowerCase(),
                operator: payload.operator.toLowerCase()
            }
            if (!state.approvalTransactions.find(t => t.hash === trans.hash)) {
                state.approvalTransactions.push(trans)
            }
        },
        addInTransaction: (state, action: PayloadAction<Pick<InTransaction, "hash" | "assets">>) => {
            const payload = action.payload
            const trans: InTransaction = {
                hash: payload.hash,
                type: TransactionType.In,
                addedAt: new Date().getTime(),
                receipt: undefined,
                lastCheckedBlock: 0,

                assets: payload.assets
            }
            if (!state.inTransactions.find(t => t.hash === trans.hash)) {
                state.inTransactions.push(trans)
            }
        },
        addOutTransaction: (state, action: PayloadAction<Pick<OutTransaction, "hash" | "bridgeHashes" | "chainId">>) => {
            const payload = action.payload
            const trans: OutTransaction = {
                hash: payload.hash,
                type: TransactionType.Out,
                addedAt: new Date().getTime(),
                receipt: undefined,
                lastCheckedBlock: 0,

                chainId: payload.chainId,
                bridgeHashes: payload.bridgeHashes
            }
            if (!state.outTransaction.find(t => t.hash === trans.hash)) {
                state.outTransaction.push(trans)
            }
        },
        updateLastCheckedBlock: (state, action: PayloadAction<{ hash: string, block: number }>) => {
            console.log(`updateLastCheckedBlock`)

            const payload = action.payload;
            for (const [transactionTypeString, transactions] of Object.entries(state)) {
                const matchingTransaction = (transactions as any)?.find((t: AllTransactionsType) => t.hash === payload.hash)
                if (!!matchingTransaction) {
                    matchingTransaction.lastCheckedBlock = Math.max(matchingTransaction.lastCheckedBlock ?? 0, payload.block)
                    break
                }
            }
        },
        setReceipt: (state, action: PayloadAction<{ hash: string, receipt: TransactionReceipt }>) => {
            const payload = action.payload;
            for (const [transactionTypeString, transactions] of Object.entries(state)) {
                const matchingTransaction = (transactions as any)?.find((t: AllTransactionsType) => t.hash === payload.hash)
                if (!!matchingTransaction) {
                    if (!matchingTransaction.receipt) {
                        matchingTransaction.receipt = payload.receipt
                    } else {
                        console.log("setReceipt:: tried to set receipt after it had already been set.")
                    }
                    break;
                }
            }
        },
        clearAllTransactions: (state, action: PayloadAction<void>) => {
            for (const [transactionTypeString, transactions] of Object.entries(state)) {
                if (Array.isArray(transactions)) {
                    (state as any)[transactionTypeString] = []
                }
            }
        }
    }
})

export const { addApprovalTransaction, clearAllTransactions, addInTransaction, addOutTransaction, updateLastCheckedBlock, setReceipt } = transactionsSlice.actions
export default transactionsSlice.reducer

export const selectApprovalTransactions = (state: AppState) => state?.newTransactions?.approvalTransactions
export const selectInTransactions = (state: AppState) => state?.newTransactions?.inTransactions
export const selectOutTransactions = (state: AppState) => state?.newTransactions?.outTransaction
export const selectAllBaseTransactions: (state: AppState) => BaseTransaction[] = createSelector([selectApprovalTransactions, selectInTransactions, selectOutTransactions], (approval, inTrans, out) => {
    const allTransactions: BaseTransaction[] =
        [...approval, ...inTrans, ...out]
            .map(t => ({ hash: t.hash, type: t.type, addedAt: t.addedAt, receipt: t.receipt, lastCheckedBlock: t.lastCheckedBlock }))
            .sort(t => t.addedAt)
    return allTransactions
})
export const selectAllTransactions: (state: AppState) => AllTransactionsType[] = createSelector([selectApprovalTransactions, selectInTransactions, selectOutTransactions], (approval, inTrans, out) => {
    const allTransactions: AllTransactionsType[] =
        [...approval, ...inTrans, ...out]
            .sort(t => t.addedAt)
    return allTransactions
})

export const selectAllTransactionsFromLastDay: (state: AppState) => AllTransactionsType[] = createSelector([selectAllTransactions], (transactions) => {
    const time = new Date().getTime()
    return transactions.filter(t => ((time - t.addedAt) < 1000 * 60 * 60 * 24))
})

export const shouldCheckTransactionOnBlock = (transaction: AllTransactionsType, latestBlock: number): boolean => {
    if (!!transaction.receipt) return false;
    if (!transaction.lastCheckedBlock) return true;
    const blocksSinceCheck = latestBlock - transaction.lastCheckedBlock
    if (blocksSinceCheck < 1) return false;
    const minutesPending = (new Date().getTime() - transaction.addedAt) / 1000 / 60;
    if (minutesPending > 60) {
        // every 10 blocks if pending for longer than an hour
        return false;
    } else if (minutesPending > 5) {
        // every 3 blocks if pending more than 5 minutes
        return blocksSinceCheck > 2;
    } else {
        // otherwise every block
        return true;
    }
}

export const transactionToChainId = (transaction: AllTransactionsType): number => {
    if (transaction.type === TransactionType.Approval) {
        return transaction.chainId
    } else if (transaction.type === TransactionType.In) {
        return transaction.assets[0].chainId
    } else if (transaction.type === TransactionType.Out) {
        return transaction.chainId
    } else {
        return 0
    }
}