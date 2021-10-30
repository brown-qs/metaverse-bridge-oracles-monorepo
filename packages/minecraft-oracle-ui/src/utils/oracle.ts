import { randomBytes } from "crypto";
import { Signer } from '@ethersproject/abstract-signer';
import { AbiCoder, ParamType } from '@ethersproject/abi';
import { AssetType } from "./marketplace";
import { keccak256 } from '@ethersproject/keccak256';

function encodeParameters(types: readonly (string | ParamType)[], values: readonly any[]) {
    const abi = new AbiCoder();
    return abi.encode(types, values);
}

function decodeParameters(types: readonly (string | ParamType)[], values: readonly any[]) {
    const abi = new AbiCoder();
    return abi.decode(types, values);
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

export type ImportData = {
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
    assetIds: string[],
    to: string,
    amounts: string[],
    extradata: string
}

export async function encodeSummonWithSigData(data: SummonData, expiration: string) {
    const {
        metaverse,
        assetIds,
        to,
        amounts,
        extradata
    } = data;
    return encodeParameters(
        ['uint256', 'bytes32', 'address', 'uint256[]', 'uint256[]', 'bytes'],
        [ expiration, metaverse, to, assetIds, amounts, extradata]
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
    return Buffer.from(keccak256(bytesHexString).slice(2), 'hex')
}

export async function getSignature(signer: Signer, data: string): Promise<string> {
  const sig = await signer.signMessage(bytesHexStringToMessageToSign(data))
  return sig
}

export async function getSalt() {
  const b = "0x" + randomBytes(32).toString('hex')
  return b
}

export async function utf8ToKeccak(data: string) {
    const hash = await keccak256(Buffer.from(data, 'utf8'))
    return hash
}

export async function calculateMetaAssetHash(data: ImportData) {
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
    const encoded = encodeParameters(
        ['address', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32'],
        [assetAddress, assetId, metaverse, owner, beneficiary, amount, salt]
    )
    const hash = await keccak256(encoded)
    return hash
}