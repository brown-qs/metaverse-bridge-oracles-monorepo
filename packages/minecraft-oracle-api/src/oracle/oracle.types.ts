import { BigNumber } from "ethers";

export type MetaAsset = {
        /* the asset (token) */
        asset: {
            assetId: BigNumber
            assetAddress: string
            assetType: number
        };
        /* metaverse id */
        metaverse: string;
        /* owner of the asset */
        owner: string;
        /* beneficiary of the asset */
        beneficiary: string;
        /* units of the asset */
        amount: BigNumber;
        /* random number */
        salt: string;
    }