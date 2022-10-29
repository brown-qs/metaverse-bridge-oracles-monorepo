import { randomBytes } from "crypto";
import { ethers } from "ethers";
import Joi from "joi";
import { AssetType } from "../common/enums/AssetType";
import { MultiverseVersion } from "../config/constants";

function encodeParameters(types: readonly (string | ethers.utils.ParamType)[], values: readonly any[]) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

function decodeParameters(types: readonly (string | ethers.utils.ParamType)[], values: readonly any[]) {
    const abi = new ethers.utils.AbiCoder();
    return abi.decode(types, values);
}

export async function encodeExportWithSigData(data: { hash: string }, expiration: string, multiverseVersion: MultiverseVersion) {
    const {
        hash
    } = data;

    if (multiverseVersion === MultiverseVersion.V2) {
        return encodeParameters(
            ['bytes32', 'uint256'],
            [hash, expiration]
        )
    }

    return encodeParameters(
        ['bytes32', 'uint256'],
        [hash, expiration]
    )
}

export async function encodeImportOrEnraptureWithSigData(a: StandardizedValidatedAssetInParams[], metaverse: string, salts: string[], expiration: string, multiverseVersion: MultiverseVersion) {

    if (multiverseVersion === MultiverseVersion.V2) {
        const d = ethers.utils.formatBytes32String("")

        const types = ['address', 'uint256', 'bytes32', 'address', 'bytes32', 'uint256[]', 'uint256[]', 'bytes32[]', 'uint256', 'bool']
        const params = [a[0].assetAddress, a[0].assetType, metaverse, a[0].owner, d, [a[0].assetId], [a[0].amount], [salts[0]], expiration, a[0].enrapture]
        console.log(JSON.stringify(params))
        return encodeParameters(types, params)
    }

    return encodeParameters(
        ['address', 'uint256', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32', 'uint256', 'bool'],
        [a[0].assetAddress, a[0].assetId, a[0].assetType, metaverse, a[0].owner, a[0].owner, a[0].amount, salts[0], expiration, a[0].enrapture]
    )
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
        [expiration, metaverse, to, assetIds, amounts, extradata]
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
        ['bytes32', 'address', 'bytes32', 'uint256', 'bool'],
        [hash, newBeneficiary, newSalt, expiration, false]
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
        ['bytes32', 'address', 'bytes32', 'uint256', 'bool'],
        [hash, newOwner, newSalt, expiration, true]
    )
}

export function bytesHexStringToMessageToSign(bytesHexString: string): Buffer {
    return Buffer.from(ethers.utils.keccak256(bytesHexString).slice(2), 'hex')
}

export async function getSignature(signer: ethers.Signer, data: string): Promise<string> {
    const sig = await signer.signMessage(bytesHexStringToMessageToSign(data))
    return sig
}

export async function getSalt() {
    const b = "0x" + randomBytes(32).toString('hex')
    return b
}

export async function utf8ToKeccak(data: string) {
    const hash = await ethers.utils.keccak256(Buffer.from(data, 'utf8'))
    return hash
}



async function calculateMultiverseAssetStaticPartHash(a: StandardizedValidatedAssetInParams, metaverse: string) {

    const hash = await ethers.utils.solidityKeccak256(
        ['bytes32', 'address', 'uint8'],
        [metaverse, a.assetAddress, a.assetType]
    )
    return hash
}

export async function calculateMetaAssetHash(a: StandardizedValidatedAssetInParams, metaverse: string, salt: string, multiverseVersion: MultiverseVersion) {

    let encoded = encodeParameters(
        ['address', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32'],
        [a.assetAddress, a.assetId, metaverse, a.owner, a.owner, a.amount, salt]
    )
    if (multiverseVersion === MultiverseVersion.V2) {
        const staticHash = await calculateMultiverseAssetStaticPartHash(a, metaverse)
        const _data = ethers.utils.formatBytes32String("")

        const hash = await ethers.utils.solidityKeccak256(
            ['bytes32', 'uint256', 'uint256', 'address', 'bytes32', 'bytes'],
            [staticHash, a.assetId, a.amount, a.owner, salt, _data]
        )
        return hash
    }

    const hash = await ethers.utils.keccak256(encoded)
    return hash
}

export type StandardizedValidatedAsset = {
    chainId: number,
    assetType: number,
    assetAddress: string,
    assetId: number,
}

export type StandardizedValidatedAssetInParams = StandardizedValidatedAsset & {
    amount: string,
    enrapture: boolean,
    owner: string
}

export function standardizeValidateAsset(chainId: number, assetType: number, assetAddress: string, assetId: number): StandardizedValidatedAsset {
    const result = {
        chainId,
        assetType,
        assetAddress: assetAddress?.toLowerCase(),
        assetId,
    }

    const schema = Joi.object({
        chainId: Joi.number().integer().positive().prefs({ convert: false }).required(),
        assetType: Joi.number().integer().min(0).prefs({ convert: false }).required(),
        assetAddress: Joi.string().alphanum().lowercase().regex(/^0x[a-f0-9]{40}$/).required(),
        assetId: Joi.number().integer().min(0).prefs({ convert: false }).required(),
    })
    Joi.assert(result, schema)

    return result
}

export function standardizeValidateAssetInParams(chainId: number, assetType: number, assetAddress: string, assetId: number, amount: string, enrapture: boolean, owner: string): StandardizedValidatedAssetInParams {
    const asset = standardizeValidateAsset(chainId, assetType, assetAddress, assetId)
    const partialResult = {
        amount,
        enrapture,
        owner: owner?.toLowerCase()
    }

    const schema = Joi.object({
        amount: Joi.string().regex(/^\d+$/).required(),
        enrapture: Joi.boolean().prefs({ convert: false }).required(),
        owner: Joi.string().alphanum().lowercase().regex(/^0x[a-f0-9]{40}$/).required()
    })
    Joi.assert(partialResult, schema)

    if (BigInt(partialResult.amount).toString() !== partialResult.amount) {
        throw new Error("invalid amount int string")
    }

    if (!(parseInt(partialResult.amount) >= 1)) {
        throw new Error("amount must be greater than or equal to 1")
    }
    return { ...asset, ...partialResult }
}