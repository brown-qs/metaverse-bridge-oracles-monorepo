import { ethers } from "ethers";
import { AssetType } from "src/common/enums/AssetType";

function encodeParameters(types: readonly (string | ethers.utils.ParamType)[], values: readonly any[]) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

export async function encodeExportWithSigData(data: {hash: string}, expiration: string) {
    const {
        hash
    } = data;
    return encodeParameters(
        ['bytes32', 'uint256'],
        [hash, expiration]
    )
}

export type ImportData={
    asset: {
        assetAddress: string,
        assetId: string,
        assetType: AssetType
    },
    metaverse: string,
    owner: string,
    beneficiary: string,
    amount: string,
    salt: string
}

export async function encodeImportWithSigData(data: ImportData, expiration: string) {
    const {
        asset: {
            assetAddress,
            assetId,
            assetType
        },
        metaverse,
        owner,
        beneficiary,
        amount,
        salt
    } = data;
    return encodeParameters(
        ['address', 'uint256', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32', 'uint256'],
        [assetAddress, assetId, assetType, metaverse, owner, beneficiary, amount, salt, expiration]
    )
}

export async function encodeEnraptureWithSigData(data: ImportData, expiration: string) {
    return encodeImportWithSigData(data, expiration)
}

export type SummonData = {
    metaverse: string,
    assetId: string,
    to: string,
    amount: string,
    extradata: string
}

export async function encodeSummonWithSigData(data: SummonData, expiration: string) {
    const {
        metaverse,
        assetId,
        to,
        amount,
        extradata
    } = data;
    return encodeParameters(
        ['bytes32', 'uint256', 'address', 'uint256', 'uint256', 'bytes'],
        [ metaverse, assetId, to, amount, expiration, extradata]
    )
}

export type BeneficiaryChangeData = {
    hash: string,
    newBeneficiary: string,
    newSalt: string
}

export async function encodeChangeBeneficiaryWithSigData(data: BeneficiaryChangeData, expiration: string) {
    const {
        hash,
        newBeneficiary,
        newSalt
    } = data;
    return encodeParameters(
        ['bytes32', 'address', 'bytes32', 'uint256'],
        [hash, newBeneficiary, newSalt, expiration]
    )
}

export type OwnerChangeData = {
    hash: string,
    newOwner: string,
    newSalt: string
}

export async function encodeChangeOwnerWithSigData(data: OwnerChangeData, expiration: string) {
    const {
        hash,
        newOwner,
        newSalt
    } = data;
    return encodeParameters(
        ['bytes32', 'address', 'bytes32', 'uint256'],
        [hash, newOwner, newSalt, expiration]
    )
}

export function bytesHexStringToMessageToSign(bytesHexString: string): Buffer {
    return Buffer.from(ethers.utils.keccak256(bytesHexString).slice(2), 'hex')
}

export async function getSignature(signer: ethers.Signer, data: string): Promise<string> {
  const sig = await signer.signMessage(bytesHexStringToMessageToSign(data))
  return sig
}
