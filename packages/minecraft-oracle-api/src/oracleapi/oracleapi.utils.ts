import { randomBytes } from "crypto";
import { ethers } from "ethers";
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
            ['bytes32[]'],
            [[hash]]
        )
    }

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

export async function encodeImportWithSigData(data: ImportData, expiration: string, multiverseVersion: MultiverseVersion) {
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

    if (multiverseVersion === MultiverseVersion.V2) {
        const _data = ethers.utils.formatBytes32String("")
        const types = ['address', 'uint256', 'bytes32', 'address', 'bytes32', 'uint256[]', 'uint256[]', 'bytes32[]', 'uint256', 'bool']
        const params = [assetAddress, assetType, metaverse, owner, _data, [assetId], [amount], [salt], expiration, false]
        return encodeParameters(types, params)
    }

    return encodeParameters(
        ['address', 'uint256', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32', 'uint256', 'bool'],
        [assetAddress, assetId, assetType, metaverse, owner, beneficiary, amount, salt, expiration, false]
    )
}

export async function encodeEnraptureWithSigData(data: ImportData, expiration: string, multiverseVersion: MultiverseVersion) {
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
        salt,
    } = data;

    if (multiverseVersion === MultiverseVersion.V2) {
        const _data = ethers.utils.formatBytes32String("")
        const types = ['address', 'uint256', 'bytes32', 'address', 'bytes32', 'uint256[]', 'uint256[]', 'bytes32[]', 'uint256', 'bool']
        const params = [assetAddress, assetType, metaverse, owner, _data, [assetId], [amount], [salt], expiration, true]
        return encodeParameters(types, params)
    }

    return encodeParameters(
        ['address', 'uint256', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32', 'uint256', 'bool'],
        [assetAddress, assetId, assetType, metaverse, owner, beneficiary, amount, salt, expiration, true]
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

export async function calculateMetaAssetHash(data: ImportData, multiverseVersion: MultiverseVersion) {
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

    let encoded = encodeParameters(
        ['address', 'uint256', 'bytes32', 'address', 'address', 'uint256', 'bytes32'],
        [assetAddress, assetId, metaverse, owner, beneficiary, amount, salt]
    )
    if (multiverseVersion === MultiverseVersion.V2) {
        const _data = ethers.utils.formatBytes32String("")
        const types = ['bytes32', 'address', 'uint256', 'uint256', 'uint256', 'address', 'bytes32', 'bytes32']
        const params = [metaverse, assetAddress, assetId, assetType, amount, owner, salt, _data]
        encoded = encodeParameters(types, params)
    }

    const hash = await ethers.utils.keccak256(encoded)
    return hash
}