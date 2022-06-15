import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { GameService } from '../game/game.service';
import { ImportDto } from './dtos/import.dto';
import { CALLDATA_EXPIRATION_MS, CALLDATA_EXPIRATION_THRESHOLD, METAVERSE, RecognizedAssetType } from '../config/constants';
import { calculateMetaAssetHash, encodeEnraptureWithSigData, encodeExportWithSigData, encodeImportWithSigData, getSalt, getSignature, utf8ToKeccak } from './oracleapi.utils';
import { BigNumber, Contract, ethers } from 'ethers';
import { ProviderToken } from '../provider/token';
import { AssetService } from '../asset/asset.service';
import { findRecognizedAsset } from '../utils';
import { MetaAsset } from './oracleapi.types';
import { ExportDto } from './dtos/export.dto';
import { SummonDto } from './dtos/summon.dto';
import { AssetEntity } from '../asset/asset.entity';
import { Mutex, MutexInterface } from 'async-mutex';
import { UserRole } from '../common/enums/UserRole';
import { InventoryService } from '../playerinventory/inventory.service';
import { InventoryEntity } from '../playerinventory/inventory.entity';
import { SkinService } from '../skin/skin.service';
import { SkinEntity } from '../skin/skin.entity';
import { BridgeAssetType, StringAssetType } from '../common/enums/AssetType';
import { NftApiService } from '../nftapi/nftapi.service';
import { GameKind } from '../game/game.enum';
import { ChainService } from '../chain/chain.service';
import { METAVERSE_ABI } from '../common/contracts/Metaverse';
import { TypeOracleWalletProvider, TypeRecognizedChainAssetsProvider } from '../provider';
import { CompositeApiService } from '../compositeapi/compositeapi.service';
import { CompositeAssetService } from '../compositeasset/compositeasset.service';
import { MaterialService } from '../material/material.service';
import { ResourceInventoryService } from '../resourceinventory/resourceinventory.service';
import { ResourceInventoryEntity } from '../resourceinventory/resourceinventory.entity';

@Injectable()
export class OracleApiService {

    private locks: Map<string, MutexInterface>;

    private readonly context: string;
    private readonly oraclePrivateKey: string;
    private readonly defaultChainId: number;

    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly skinService: SkinService,
        private readonly gameService: GameService,
        private readonly assetService: AssetService,
        private readonly inventoryService: InventoryService,
        private readonly nftApiService: NftApiService,
        private readonly chainService: ChainService,
        private readonly compositeApiService: CompositeApiService,
        private readonly compositeAssetService: CompositeAssetService,
        private readonly materialService: MaterialService,
        private readonly resourceInventoryService: ResourceInventoryService,
        private configService: ConfigService,
        @Inject(ProviderToken.ORACLE_WALLET_CALLBACK) private getOracle: TypeOracleWalletProvider,
        @Inject(ProviderToken.RECOGNIZED_CHAIN_ASSETS_CALLBACK) private getRecognizedAsset: TypeRecognizedChainAssetsProvider,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = OracleApiService.name
        this.locks = new Map();
        this.oraclePrivateKey = this.configService.get<string>('network.oracle.privateKey');
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')
    }

    public async userInRequest(user: UserEntity, data: ImportDto, enraptured: boolean): Promise<[string, string, string, boolean]> {
        this.logger.debug(`userInRequest: ${JSON.stringify(data)}, enraptured: ${enraptured}`, this.context)
        const sanitizedChainId = !!data.chainId ? data.chainId : this.defaultChainId;
        const collectionFragment = enraptured ?
            findRecognizedAsset(await this.getRecognizedAsset(sanitizedChainId, BridgeAssetType.ENRAPTURED), data.asset)
            : findRecognizedAsset(await this.getRecognizedAsset(sanitizedChainId, BridgeAssetType.IMPORTED), data.asset)

        if (!collectionFragment) {
            this.logger.error(`userInRequest: not an permissioned asset`, null, this.context)
            throw new UnprocessableEntityException(`Not permissioned asset`)
        }

        const oracle = await this.getOracle(sanitizedChainId)

        if (!oracle) {
            this.logger.error(`userInRequest: oracle error`, null, this.context)
            throw new UnprocessableEntityException(`Oracle could not serve your request`)
        }

        const requestHash = await utf8ToKeccak(JSON.stringify(data))
        const existingEntry = await this.assetService.findOne({ requestHash, collectionFragment, enraptured, pendingIn: true, owner: { uuid: user.uuid } }, { order: { expiration: 'DESC' }, relations: ['owner', 'collectionFragment'] })

        existingEntry ? console.log(Date.now() - Number.parseInt(existingEntry.expiration) - CALLDATA_EXPIRATION_THRESHOLD) : undefined

        // we try to confirm
        if (!!existingEntry) {
            //console.log('exists?')
            const salt = existingEntry.salt
            const ma = {
                asset: data.asset,
                beneficiary: data.beneficiary,
                owner: data.owner,
                amount: data.amount,
                chainId: sanitizedChainId,
                metaverse: METAVERSE,
                salt
            }
            const expirationContract = (Math.floor(Number.parseInt(existingEntry.expiration) / 1000)).toString()
            const payload = enraptured ? await encodeEnraptureWithSigData(ma, expirationContract) : await encodeImportWithSigData(ma, expirationContract)
            const signature = await getSignature(oracle, payload)
            const hash = await calculateMetaAssetHash(ma)

            this.logger.debug(`InData: request prepared: ${[hash, payload, signature]}`, this.context)

            let failedtoconfirm = false
            try {
                const success = enraptured ? await this.userEnraptureConfirm(user, { hash, chainId: sanitizedChainId }) : await this.userImportConfirm(user, { hash, chainId: sanitizedChainId })
                this.logger.debug(`InData: previous inflow was confirmed: ${hash}`, this.context)
            } catch (e) {
                failedtoconfirm = true
                this.logger.debug(`InData: previous inflow confirmation fail: ${hash}`, this.context)
            }

            if (Number.parseInt(existingEntry.expiration) <= Date.now()) {
                if (!failedtoconfirm) {
                    await this.assetService.remove(existingEntry)
                }
            } else {
                /*
                if (!!existingEntry && Date.now() < Number.parseInt(existingEntry.expiration) - CALLDATA_EXPIRATION_THRESHOLD) {
                    return [hash, payload, signature, false]
                }
                */
                this.logger.debug(`InData: returning previously stored calldata: ${hash}`, this.context)
                return [hash, payload, signature, false]
            }
        }
        //console.log('polo')
        const salt = await getSalt()
        const ma = {
            asset: data.asset,
            beneficiary: data.beneficiary,
            owner: data.owner.toLowerCase(),
            amount: data.amount,
            chainId: sanitizedChainId,
            metaverse: METAVERSE,
            salt
        }
        const expiration = (Date.now() + CALLDATA_EXPIRATION_MS)
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = enraptured ? await encodeEnraptureWithSigData(ma, expirationContract) : await encodeImportWithSigData(ma, expirationContract)

        const signature = await getSignature(oracle, payload)
        const hash = await calculateMetaAssetHash(ma)

        await this.assetService.create({
            assetId: ma.asset.assetId,
            assetOwner: ma.owner,
            enraptured,
            hash,
            requestHash,
            pendingIn: true,
            pendingOut: false,
            amount: ma.amount,
            expiration: expiration.toString(),
            owner: user,
            salt,
            collectionFragment
        })
        this.logger.debug(`InData: request: ${[hash, payload, signature]}`, this.context)
        return [hash, payload, signature, false]
    }

    public async userOutRequest(user: UserEntity, { hash, chainId }: ExportDto): Promise<[string, string, string, boolean]> {
        this.logger.debug(`userOutRequest: ${hash}`, this.context)

        if (user.blacklisted) {
            this.logger.error(`userOutRequest: user blacklisted`, null, this.context)
            throw new UnprocessableEntityException(`Blacklisted`)
        }

        if (!hash) {
            throw new UnprocessableEntityException(`No hash was received.`)
        }

        const oracle = await this.getOracle(!!chainId ? chainId : this.defaultChainId)

        if (!oracle) {
            this.logger.error(`userOutRequest`, null, this.context)
            throw new UnprocessableEntityException(`Oracle could not serve the request`)
        }

        const ongoingGame = await this.gameService.findOne({ ongoing: true, type: GameKind.CARNAGE })
        if (!!ongoingGame) {
            this.logger.error(`userOutRequest: forbidden during ongoing game`, null, this.context)
            throw new UnprocessableEntityException(`Forbidden during ongoing game`)
        }

        const existingEntry = await this.assetService.findOne({ hash, collectionFragment: { collection: { chainId } }, enraptured: false, pendingIn: false, owner: { uuid: user.uuid } }, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })
        if (!existingEntry) {
            this.logger.error(`userOutRequest: exportable asset not found ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`Exportable asset not found`)
        }

        const salt = await getSalt()
        const expiration = Date.now() + CALLDATA_EXPIRATION_MS
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = await encodeExportWithSigData({ hash }, expirationContract)
        const signature = await getSignature(oracle, payload)

        this.logger.debug(`OutData: request prepared: ${[hash, payload, signature]}`, this.context)

        let confirmsuccess = false
        existingEntry.pendingOut = true
        existingEntry.expiration = expiration.toString()
        await this.assetService.create(existingEntry)

        try {
            confirmsuccess = await this.userExportConfirm(user, { hash, chainId })
        } catch (e) {
        }

        if (confirmsuccess) {
            return [hash, payload, signature, true]
        }
        return [hash, payload, signature, false]
    }

    public async userSummonRequest(user: UserEntity, { recipient, chainId }: SummonDto): Promise<boolean> {
        this.logger.debug(`userSummonRequest user ${user.uuid} to ${recipient} ID is ${chainId}`, this.context)

        if (!recipient || recipient.length !== 42 || !recipient.startsWith('0x')) {
            this.logger.error(`Summon: recipient invalid: ${recipient}}`, null, this.context)
            throw new UnprocessableEntityException('Recipient invalid')
        }

        if (user.blacklisted) {
            this.logger.error(`userSummonRequest: user blacklisted`, null, this.context)
            throw new UnprocessableEntityException(`Blacklisted`)
        }

        this.ensureLock('oracle_summon')
        const oracleLock = this.locks.get('oracle_summon')

        const snapshots = await this.inventoryService.findMany({ relations: ['owner', 'material'], where: { owner: { uuid: user.uuid }, summonInProgress: false } })

        if (!snapshots || snapshots.length === 0) {
            const snapshots2 = await this.inventoryService.findMany({ relations: ['owner'], where: { owner: { uuid: user.uuid }, summonInProgress: true } })

            if (!snapshots2 || snapshots2.length === 0) {
                return false
            } else {
                return true
            }
        }

        await Promise.all(
            snapshots.map(async (snap) => {
                snap.summonInProgress = true
                await this.inventoryService.update(snap.id, { summonInProgress: snap.summonInProgress })
            })
        )

        const res = await oracleLock.runExclusive(async () => {

            // safety vibe check
            if (!snapshots[0].summonInProgress) {
                this.logger.warn(`Summon: summonInProgress vibe check fail for ${user.uuid}`, this.context)
                return false
            }

            const groups: { [key: string]: { ids: string[], amounts: string[], entities: InventoryEntity[] } } = {}
            snapshots.map(snapshot => {
                const amount = (snapshot.material.multiplier ?? 1) * Number.parseFloat(snapshot.amount)
                const assetAddress = snapshot.material.assetAddress.toLowerCase()
                if (!(assetAddress in groups)) {
                    groups[assetAddress] = {
                        ids: [],
                        amounts: [],
                        entities: []
                    }
                }
                groups[assetAddress]['amounts'].push(ethers.utils.parseEther(amount.toString()).toString())
                groups[assetAddress]['ids'].push(snapshot.material.assetId)
                groups[assetAddress]['entities'].push(snapshot)
            })

            const addresses = Object.keys(groups)

            const chainEntity = await this.chainService.findOne({ chainId })
            const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
            const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

            let contract: Contract;
            if (chainEntity.multiverseAddress)
                contract = new Contract(chainEntity.multiverseAddress, METAVERSE_ABI, oracle)
            else {
                this.logger.error(`Summon: failiure not find MultiverseAddress`)
                throw new UnprocessableEntityException('Summon MultiverseAddress error.')
            }

            for (let i = 0; i < addresses.length; i++) {
                try {

                    const ids = groups[addresses[i]].ids
                    const amounts = groups[addresses[i]].amounts
                    //console.log({METAVERSE, recipient, ids, amounts, i})
                    // console.log("SummonResult",this.metaverseChain[chainId])

                    const receipt = await ((await contract.summonFromMetaverse(METAVERSE, recipient, ids, amounts, [], { value: 0, gasPrice: '3000000000', gasLimit: '1000000' })).wait())

                    try {
                        await this.inventoryService.removeAll(groups[addresses[i]].entities)
                    } catch (e) {
                        this.logger.error(`Summon: failiure to remove entities, ids ${JSON.stringify(groups[addresses[i]].ids)}`, e, this.context)
                    }

                    this.logger.log(`Summon: successful summon for user ${user.uuid}`, this.context)
                } catch (e) {
                    //console.log(e)
                    this.logger.error(`Summon: failiure to summon ids ${JSON.stringify(groups[addresses[i]].ids)}`, e, this.context)

                    await Promise.all(
                        groups[addresses[i]].entities.map(async (snap) => {
                            snap.summonInProgress = false
                            await this.inventoryService.update(snap.id, { summonInProgress: snap.summonInProgress })
                        })
                    )

                    throw new UnprocessableEntityException('Summon error.')
                }
            }

            user.lastUsedAddress = recipient.toLowerCase()
            if (!user.usedAddresses.includes(user.lastUsedAddress)) {
                user.usedAddresses.push(user.lastUsedAddress)
            }
            await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress })

            return true
        })

        return res
    }

    public async userImportConfirm(user: UserEntity, data: { hash: string, chainId: number }, asset?: AssetEntity): Promise<boolean> {
        const hash = data.hash;
        this.logger.log(`ImportConfirm: started ${user.uuid}: ${hash}`, this.context)

        const chainId = !!data.chainId ? data.chainId : this.defaultChainId;
        const assetEntry = !!asset ? asset : await this.assetService.findOne({ hash, collectionFragment: { collection: { chainId } } }, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

        if (!assetEntry || assetEntry.hash !== hash || assetEntry.enraptured !== false) {
            this.logger.error(`ImportConfirm: invalid conditions. exists: ${!!assetEntry}, hash: ${hash}, enraptured: ${assetEntry?.enraptured}, pendingOut: ${assetEntry?.pendingOut}, pendingIn: ${assetEntry?.pendingIn}`)
            throw new UnprocessableEntityException('Invalid import confirm conditions')
        }

        if (assetEntry.pendingIn === false) {
            return true
        }

        const assetAddress = assetEntry.collectionFragment.collection.assetAddress.toLowerCase()
        const assetType = assetEntry.collectionFragment.collection.assetType
        const assetId = assetEntry.assetId
        const chainEntity = await this.chainService.findOne({ chainId })
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

        let contract: Contract;
        if (chainEntity.multiverseAddress)
            contract = new Contract(chainEntity.multiverseAddress, METAVERSE_ABI, oracle)
        else {
            this.logger.error(`Summon: failiure not find MultiverseAddress`)
            throw new UnprocessableEntityException('Summon MultiverseAddress error.')
        }

        const mAsset: MetaAsset = await contract.getImportedMetaAsset(hash)

        if (!mAsset || mAsset.amount.toString() !== assetEntry.amount || mAsset.asset.assetAddress.toLowerCase() !== assetAddress) {
            this.logger.error(`ImportConfirm: on-chaind data didn't match for hash: ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`On-chain data didn't match`)
        }
        const importableAssets = await this.getRecognizedAsset(chainId, BridgeAssetType.IMPORTED)
        const recognizedAsset = findRecognizedAsset(importableAssets, { assetAddress, assetId })

        // assign skin if asset unlocks one
        const texture = await this.textureService.findOne({ assetAddress, assetId: assetId })
        if (!!texture) {
            this.logger.log('ImportConfirm: Moonsama, texture found', this.context)
            await this.skinService.create({
                id: SkinEntity.toId(user.uuid, texture.assetAddress, texture.assetId),
                owner: user,
                equipped: false,
                texture
            })
        } else {
            this.logger.warn('ImportConfirm: no texture found for asset!!!', this.context)
        }

        if (!!recognizedAsset) {
            if (recognizedAsset.gamepass) {
                user.allowedToPlay = true
                user.role = user.role?.valueOf() === UserRole.NONE.valueOf() ? UserRole.PLAYER : user.role
                user.numGamePassAsset = (user.numGamePassAsset ?? 0) + 1

                // this means user had no skins/in game eligible assets imported before
                if (user.numGamePassAsset === 1) {
                    try {
                        await this.skinService.createMultiple([
                            {
                                id: SkinEntity.toId(user.uuid, '0x0', '0'),
                                owner: user,
                                equipped: true,
                                texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE })
                            },
                            {
                                id: SkinEntity.toId(user.uuid, '0x0', '1'),
                                owner: user,
                                equipped: false,
                                texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '1', assetType: StringAssetType.NONE })
                            }
                        ])
                    } catch (error) {
                        this.logger.warn(`ImportConfirm: error trying to set default skins for user ${user.uuid}`, this.context)
                    }
                }

                await this.userService.update(user.uuid, { allowedToPlay: user.allowedToPlay, role: user.role, numGamePassAsset: user.numGamePassAsset })
            }
        }

        assetEntry.recognizedAssetType = recognizedAsset?.recognizedAssetType ?? RecognizedAssetType.NONE;
        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false });

        (async () => {
            let metadata = null
            let world = null
            try {
                metadata = (await this.nftApiService.getNFT(chainId.toString(), assetType, assetAddress, [assetId]))?.[0] as any ?? null
                world = metadata?.tokenURI?.plot?.world ?? null
            } catch {
                this.logger.error(`ImportConfirm: couldn't fetch asset metadata: ${hash}`, undefined, this.context)
            }
            if (!!metadata) {
                await this.assetService.update({ hash: assetEntry.hash }, { metadata, world })
            }
        })()

        if (!finalentry) {
            this.logger.error(`ImportConfirm: couldn't change pending flag: ${hash}`, undefined, this.context)
            throw new UnprocessableEntityException(`Database error`)
        }

        user.lastUsedAddress = mAsset.owner.toLowerCase()
        if (!user.usedAddresses.includes(user.lastUsedAddress)) {
            user.usedAddresses.push(user.lastUsedAddress)
        }
        await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress, numGamePassAsset: user.numGamePassAsset })

        return true
    }

    public async userEnraptureConfirm(user: UserEntity, data: { hash: string, chainId: number }, asset?: AssetEntity): Promise<boolean> {
        const hash = data.hash
        this.logger.log(`EnraptureConfirm: started ${user.uuid}: ${hash}`, this.context)

        const chainId = !!data.chainId ? data.chainId : this.defaultChainId;

        const assetEntry = !!asset ? asset : await this.assetService.findOne({ hash, collectionFragment: { collection: { chainId } } }, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

        if (!assetEntry || assetEntry.hash !== hash || assetEntry.enraptured !== true) {
            this.logger.error(`EnraptureConfirm: invalid conditions. exists: ${!!assetEntry}, hash: ${hash}, enraptured: ${assetEntry?.enraptured}, pendingOut: ${assetEntry?.pendingOut}, pendingIn: ${assetEntry?.pendingIn}`)
            throw new UnprocessableEntityException('Invalid enrapture confirm conditions')
        }

        if (assetEntry.pendingIn === false) {
            return true
        }

        const chainEntity = await this.chainService.findOne({ chainId })
        const assetAddress = assetEntry.collectionFragment.collection.assetAddress.toLowerCase()
        const assetType = assetEntry.collectionFragment.collection.assetType
        const assetId = assetEntry.assetId
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

        let contract: Contract;
        if (chainEntity.multiverseAddress)
            contract = new Contract(chainEntity.multiverseAddress, METAVERSE_ABI, oracle)
        else {
            this.logger.error(`Summon: failiure not find MultiverseAddress`)
            throw new UnprocessableEntityException('Summon MultiverseAddress error.')
        }

        const mAsset: MetaAsset = await contract.getEnrapturedMetaAsset(hash)

        if (!mAsset || mAsset.amount.toString() !== assetEntry.amount || mAsset.asset.assetAddress.toLowerCase() !== assetAddress) {
            this.logger.error(`EnraptureConfirm: on-chaind data didn't match for hash: ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`On-chain data didn't match`)
        }

        const enrapturableAssets = await this.getRecognizedAsset(chainId, BridgeAssetType.ENRAPTURED)
        const recognizedAsset = findRecognizedAsset(enrapturableAssets, { assetAddress, assetId })

        // assign skin if asset unlocks one
        const texture = await this.textureService.findOne({ assetAddress, assetId })
        if (!!texture) {
            this.logger.log('EnraptureConfirm: texture found', this.context)
            await this.skinService.create({
                id: SkinEntity.toId(user.uuid, texture.assetAddress, texture.assetId),
                owner: user,
                equipped: false,
                texture
            })
        } else {
            this.logger.warn('EnraptureConfirm: no texture found for asset!!!', this.context)
        }

        if (!!recognizedAsset) {
            if (recognizedAsset.gamepass) {
                user.allowedToPlay = true
                user.role = user.role?.valueOf() === UserRole.NONE.valueOf() ? UserRole.PLAYER : user.role
                user.numGamePassAsset = (user.numGamePassAsset ?? 0) + 1

                // this means user had no skins/in game eligible assets imported before
                if (user.numGamePassAsset === 1) {
                    try {
                        await this.skinService.createMultiple([
                            {
                                id: SkinEntity.toId(user.uuid, '0x0', '0'),
                                owner: user,
                                equipped: true,
                                texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE })
                            },
                            {
                                id: SkinEntity.toId(user.uuid, '0x0', '1'),
                                owner: user,
                                equipped: false,
                                texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '1', assetType: StringAssetType.NONE })
                            }
                        ])
                    } catch (error) {
                        this.logger.warn(`ImportConfirm: error trying to set default skins for user ${user.uuid}`, this.context)
                    }
                }

                await this.userService.update(user.uuid, { allowedToPlay: user.allowedToPlay, role: user.role, numGamePassAsset: user.numGamePassAsset })
            }
        }

        assetEntry.recognizedAssetType = recognizedAsset?.recognizedAssetType ?? RecognizedAssetType.NONE;
        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false });

        // TODO proper sideffects
        
        (async () => {
            let metadata = null
            let world = null
            try {
                metadata = (await this.nftApiService.getNFT(chainId.toString(), assetType, assetAddress, [assetId]))?.[0] as any ?? null
                world = metadata?.tokenURI?.plot?.world ?? null
            } catch {
                this.logger.error(`ImportConfirm: couldn't fetch asset metadata: ${hash}`, undefined, this.context)
            }
            if (!!metadata) {
                await this.assetService.update({ hash: assetEntry.hash }, { metadata, world })
            }
        })()

        // TODO disgustang

        if (assetEntry.recognizedAssetType.valueOf() === RecognizedAssetType.RESOURCE.valueOf()) {
            const cid = ResourceInventoryService.calculateId({chainId, assetAddress, assetId, uuid: user.uuid})
            const inv = await this.resourceInventoryService.findOne({id: cid}, {relations: ['assets']})
            if (!inv) {
                await this.resourceInventoryService.create({
                    amount: assetEntry.amount,
                    owner: user,
                    id: cid,
                    assetId,
                    collectionFragment: assetEntry.collectionFragment,
                    assets: [finalentry]
                })
            } else {
                const newAmount = (BigNumber.from(inv.amount).add(assetEntry.amount)).toString()
                const entry: ResourceInventoryEntity = {...inv, amount: newAmount, assets: (inv.assets ?? []).concat([finalentry])}
                console.log(entry)
                await this.resourceInventoryService.create(entry)
            }
        }

        if (!finalentry) {
            this.logger.error(`EnraptureConfirm: couldn't change pending flag: ${hash}`, undefined, this.context)
            throw new UnprocessableEntityException(`Database error`)
        }

        user.lastUsedAddress = mAsset.owner.toLowerCase()
        if (!user.usedAddresses.includes(user.lastUsedAddress)) {
            user.usedAddresses.push(user.lastUsedAddress)
        }
        await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress, numGamePassAsset: user.numGamePassAsset })

        return true
    }

    public async userExportConfirm(user: UserEntity, data: { hash: string, chainId: number }, asset?: AssetEntity): Promise<boolean> {

        const hash = data.hash
        if (!hash) {
            this.logger.warn(`ExportConfirm: hash not received`, this.context)
            return false
        }

        const chainId = !!data.chainId ? data.chainId : this.defaultChainId;
        const assetEntry = !!asset ? asset : await this.assetService.findOne({ hash, collectionFragment: { collection: { chainId } }, enraptured: false }, { relations: ['collectionFragment', 'collectionFragment.collection', 'compositeAsset'], loadEagerRelations: true })

        if (!assetEntry) {
            this.logger.warn(`ExportConfirm: asset not found: ${chainId}-${hash}`, this.context)
            return true
        }

        if (!assetEntry.pendingOut) {
            this.logger.warn(`ExportConfirm: asset exists but is not pending for export`, this.context)
            return false
        }

        const assetAddress = assetEntry.collectionFragment.collection.assetAddress
        const assetId = assetEntry.assetId

        const chainEntity = await this.chainService.findOne({ chainId })
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

        let contract: Contract;
        if (chainEntity.multiverseAddress)
            contract = new Contract(chainEntity.multiverseAddress, METAVERSE_ABI, oracle)
        else {
            this.logger.error(`Summon: failiure not find MultiverseAddress`)
            throw new UnprocessableEntityException('Summon MultiverseAddress error.')
        }

        const exists = await contract.existsImported(hash)

        if (exists) {
            this.logger.error(`ExportConfirm: not exported yet: ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`Not exported yet`)
        }

        const exportableAssets = await this.getRecognizedAsset(chainId, BridgeAssetType.EXPORTED)
        const recognizedAsset = findRecognizedAsset(exportableAssets, { assetAddress, assetId })

        if (!!recognizedAsset && recognizedAsset.gamepass) {
            user.numGamePassAsset = (user.numGamePassAsset ?? 0) > 0 ? user.numGamePassAsset - 1 : 0

            user.allowedToPlay = (user.numGamePassAsset ?? 0) > 0
            if (!user.role || user.role?.valueOf() !== UserRole.ADMIN.valueOf()) {
                user.role = user.allowedToPlay ? UserRole.PLAYER : UserRole.NONE
            }
            await this.userService.update(user.uuid, { numGamePassAsset: user.numGamePassAsset, allowedToPlay: user.allowedToPlay, role: user.role })
        }

        const skin = await this.skinService.findOne({ id: SkinEntity.toId(user.uuid, assetAddress, assetId) })

        if (!!skin) {
            const removed = await this.skinService.remove(skin)
            if (removed.equipped && user.allowedToPlay) {
                await this.skinService.update({ id: SkinEntity.toId(user.uuid, '0x0', '0') }, { equipped: true })
            }
        }

        if (!user.allowedToPlay) {
            await this.skinService.removeMultiple(
                [
                    {
                        id: SkinEntity.toId(user.uuid, '0x0', '0'),
                        owner: user,
                        equipped: true,
                        texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE })
                    },
                    {
                        id: SkinEntity.toId(user.uuid, '0x0', '1'),
                        owner: user,
                        equipped: false,
                        texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '1', assetType: StringAssetType.NONE })
                    }
                ]
            )
        }

        // TODO modify composite asset if it belongs to one: either equipped, or as a base asset

        const compositeAsset = assetEntry.compositeAsset
        await this.assetService.remove(assetEntry)

        ;(async () => {
            if (!!compositeAsset) {
                try {
                    await this.compositeApiService.reevaluate(compositeAsset, user)
                    return
                } catch {
                    this.logger.error(`userExportConfirm:: composite reevaluation as child failed`, undefined, this.context)
                }
            }

            const cas = await this.compositeAssetService.findOne({assetId, compositeCollectionFragment: {collection: {assetAddress, chainId}}}, {relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true})
            if (!!cas) {
                try {
                    await this.compositeApiService.reevaluate(cas, user)
                    return
                } catch {
                    this.logger.error(`userExportConfirm:: composite reevaluation as parent failed`, undefined, this.context)
                }
            }
        })();
        return true
    }

    private ensureLock(key: string) {
        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex());
        }
    }
}
