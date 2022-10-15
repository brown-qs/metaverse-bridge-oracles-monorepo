import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { ChainId } from "../../constants";
import { StringAssetType } from "../../utils/subgraph";
import { InDto, Oauth2PublicClientDto } from "../api/types"
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
    transactionHash: string
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

export type InAsset = { bridgeHash: string } & InDto
export interface InTransaction extends BaseTransaction {
    type: TransactionType.In,
    assets: InAsset[]
}

export interface OutTransaction extends BaseTransaction {
    type: TransactionType.Out,
}

export type AllTransactionsType = ApprovalTransaction | InTransaction | OutTransaction

export interface TransactionsSlice {
    approvalTransactions: ApprovalTransaction[]
    inTransactions: InTransaction[],
    outTransaction: OutTransaction[],
}

const transactionsSlice = createSlice({
    name: "transactionsSlice",
    initialState: { approvalTransactions: [], inTransactions: [], outTransaction: [] } as TransactionsSlice,
    reducers: {
        addApprovalTransaction: (state, action: PayloadAction<Pick<ApprovalTransaction, "transactionHash" | "chainId" | "assetType" | "assetAddress" | "operator">>) => {
            const payload = action.payload
            console.log("Add approval transaction: " + JSON.stringify(payload))
            const trans: ApprovalTransaction = {
                transactionHash: payload.transactionHash,
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
            if (!state.approvalTransactions.find(t => t.transactionHash === trans.transactionHash)) {
                console.log("PUSHING TRANSACTION")
                state.approvalTransactions.push(trans)
            }
        },
        addInTransaction: (state, action: PayloadAction<Pick<InTransaction, "transactionHash" | "assets">>) => {
            const payload = action.payload
            const trans: InTransaction = {
                transactionHash: payload.transactionHash,
                type: TransactionType.In,
                addedAt: new Date().getTime(),
                receipt: undefined,
                lastCheckedBlock: 0,

                assets: payload.assets
            }
            if (!state.inTransactions.find(t => t.transactionHash === trans.transactionHash)) {
                state.inTransactions.push(trans)
            }
        },
        addOutTransaction: (state, action: PayloadAction<Pick<OutTransaction, "transactionHash">>) => {
            const payload = action.payload
            const trans: OutTransaction = {
                transactionHash: payload.transactionHash,
                type: TransactionType.Out,
                addedAt: new Date().getTime(),
                receipt: undefined,
                lastCheckedBlock: 0,

            }
            if (!state.outTransaction.find(t => t.transactionHash === trans.transactionHash)) {
                state.outTransaction.push(trans)
            }
        }
    }
})

export const { addApprovalTransaction, addInTransaction, addOutTransaction } = transactionsSlice.actions
export default transactionsSlice.reducer

export const selectApprovalTransactions = (state: AppState) => state?.newTransactions?.approvalTransactions
export const selectInTransactions = (state: AppState) => state?.newTransactions?.inTransactions
export const selectOutTransactions = (state: AppState) => state?.newTransactions?.outTransaction
export const selectAllBaseTransactions: (state: AppState) => BaseTransaction[] = createSelector([selectApprovalTransactions, selectInTransactions, selectOutTransactions], (approval, inTrans, out) => {
    const allTransactions: BaseTransaction[] =
        [...approval, ...inTrans, ...out]
            .map(t => ({ transactionHash: t.transactionHash, type: t.type, addedAt: t.addedAt, receipt: t.receipt, lastCheckedBlock: t.lastCheckedBlock }))
            .sort(t => t.addedAt)
    return allTransactions
})
export const selectAllTransactions: (state: AppState) => AllTransactionsType[] = createSelector([selectApprovalTransactions, selectInTransactions, selectOutTransactions], (approval, inTrans, out) => {
    const allTransactions: AllTransactionsType[] =
        [...approval, ...inTrans, ...out]
            .sort(t => t.addedAt)
    return allTransactions
})