import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user/user.entity';
import { GameService } from '../game/game.service';
import { InDto } from './dtos/in.dto';
import { CALLDATA_EXPIRATION_MS, CALLDATA_EXPIRATION_THRESHOLD, METAVERSE, MultiverseVersion, RecognizedAssetType } from '../config/constants';
import { calculateMetaAssetHash, encodeExportWithSigData, encodeImportOrEnraptureWithSigData, getSalt, getSignature, StandardizedValidatedAssetInParams, standardizeValidateAssetInParams, utf8ToKeccak } from './oracleapi.utils';
import { BigNumber, Contract, ethers } from 'ethers';
import { ProviderToken } from '../provider/token';
import { AssetService } from '../asset/asset.service';
import { findRecognizedAsset, stringAssetTypeToAssetType } from '../utils';
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
import { AssetType, BridgeAssetType, StringAssetType } from '../common/enums/AssetType';
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
import { EventBus } from '@nestjs/cqrs';
import { UserProfileUpdatedEvent } from '../cqrs/events/user-profile-updated.event';
import { SkinAddedEvent } from '../cqrs/events/skin-added.event';
import { AssetAddedEvent } from '../cqrs/events/asset-added.event';
import { ResourceInventoryUpdatedEvent } from '../cqrs/events/resource-inventory-updated.event';
import { SkinRemovedEvent } from '../cqrs/events/skin-removed.event';
import { SkinSelectedEvent } from '../cqrs/events/skin-selected.event';
import { AssetRemovedEvent } from '../cqrs/events/asset-removed.event';
import { METAVERSE_V2_ABI } from '../common/contracts/MetaverseV2';
import { ChainEntity } from '../chain/chain.entity';
import Joi from 'joi';
import { CollectionFragmentService } from '../collectionfragment/collectionfragment.service';
import { CallparamDto } from './dtos/callparams.dto';

@Injectable()
export class OracleApiService {

    private locks: Map<string, MutexInterface>;

    private readonly context: string;
    private readonly oraclePrivateKey: string;
    private readonly defaultChainId: number;

    constructor(
        private readonly eventBus: EventBus,
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
        private readonly collectionFragmentService: CollectionFragmentService,
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

    public async userInRequest(user: UserEntity, data: InDto): Promise<CallparamDto> {
        const funcCallPrefix = `[${makeid(5)}] userInRequest:: uuid: ${user.uuid}`
        this.logger.debug(`${funcCallPrefix} START ImportDto: ${JSON.stringify(data)}`, this.context)
        const sanitizedChainId = !!data.chainId ? data.chainId : this.defaultChainId;

        let enraptureCollectionFrag = findRecognizedAsset(await this.getRecognizedAsset(sanitizedChainId, BridgeAssetType.ENRAPTURED), { assetAddress: data.assetAddress, assetId: String(data.assetId) });
        let importCollectionFrag = findRecognizedAsset(await this.getRecognizedAsset(sanitizedChainId, BridgeAssetType.IMPORTED), { assetAddress: data.assetAddress, assetId: String(data.assetId) })

        let collectionFragment
        if (data.enrapture) {
            if (!!enraptureCollectionFrag) {
                collectionFragment = enraptureCollectionFrag
            } else if (!!importCollectionFrag) {
                this.logger.error(`${funcCallPrefix} asset permissioned, but enrapture not supported.`, null, this.context)
                throw new UnprocessableEntityException(`Asset permissioned, but enrapture not supported.`)
            }
        } else {
            if (!!importCollectionFrag) {
                collectionFragment = importCollectionFrag
            } else if (!!enraptureCollectionFrag) {
                this.logger.error(`${funcCallPrefix} asset permissioned, but import not supported.`, null, this.context)
                throw new UnprocessableEntityException(`Asset permissioned, but import not supported.`)
            }
        }

        if (!collectionFragment) {
            this.logger.error(`${funcCallPrefix} not an permissioned asset`, null, this.context)
            throw new UnprocessableEntityException(`Not permissioned asset`)
        }

        const enraptured = collectionFragment.enrapturable === true
        this.logger.debug(`${funcCallPrefix} enrapturing: ${String(enraptured)}`, this.context)


        //standardizes and validates asset in request so hash is deterministic
        let standardizedParams: StandardizedValidatedAssetInParams
        try {
            standardizedParams = standardizeValidateAssetInParams(sanitizedChainId, stringAssetTypeToAssetType(data.assetType), data.assetAddress, data.assetId, data.amount, enraptured, data.owner)
            this.logger.debug(`${funcCallPrefix} standardized params: ${JSON.stringify(standardizedParams)}`, this.context)
        } catch (e) {
            console.log(e)
            this.logger.error(`${funcCallPrefix} failed to standardize`, e, this.context)
            throw new UnprocessableEntityException(`Failed to standard asset in request`)
        }
        const multiverseVersion = collectionFragment.collection.multiverseVersion

        const oracle = await this.getOracle(sanitizedChainId)

        if (!oracle) {
            this.logger.error(`${funcCallPrefix} oracle error`, null, this.context)
            throw new UnprocessableEntityException(`Oracle could not serve your request`)
        }

        const requestHash = await utf8ToKeccak(JSON.stringify(standardizedParams))
        this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash}`, this.context)

        const existingEntry = await this.assetService.findOne({ requestHash, collectionFragment, enraptured, pendingIn: true, owner: { uuid: user.uuid } }, { order: { expiration: 'DESC' }, relations: ['owner', 'collectionFragment'] })

        //existingEntry ? console.log(Date.now() - Number.parseInt(existingEntry.expiration) - CALLDATA_EXPIRATION_THRESHOLD) : undefined

        // we try to confirm
        if (!!existingEntry) {
            const salt = existingEntry.salt
            this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt ${salt}`, this.context)

            const expirationContract = (Math.floor(Number.parseInt(existingEntry.expiration) / 1000)).toString()
            const payload = await encodeImportOrEnraptureWithSigData([standardizedParams], METAVERSE, [salt], expirationContract, multiverseVersion)
            const signature = await getSignature(oracle, payload)
            const hash = await calculateMetaAssetHash(standardizedParams, METAVERSE, salt, multiverseVersion)
            this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} request prepared from existing salt: ${[payload, signature]}`, this.context)

            let failedtoconfirm = false
            try {
                const success = await this.userInConfirm(user, { hash, chainId: sanitizedChainId })
                this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} existing inflow confirmed!`, this.context)
            } catch (e) {
                failedtoconfirm = true
                this.logger.error(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} error confirming existing inflow`, e, this.context)
            }

            if (Number.parseInt(existingEntry.expiration) <= Date.now()) {
                if (!failedtoconfirm) {
                    this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} removing request because it has not been confirmed and is expired.`, this.context)
                    await this.assetService.remove(existingEntry)
                }
            } else {
                /*
                if (!!existingEntry && Date.now() < Number.parseInt(existingEntry.expiration) - CALLDATA_EXPIRATION_THRESHOLD) {
                    return [hash, payload, signature, false]
                }
                */
                this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} returning previously used call data.`, this.context)
                //why doesn't this return the last parameter of success if the inflow was confirmed???
                return { hash, data: payload, signature, confirmed: false }
            }
        }
        //console.log('polo')
        const salt = await getSalt()

        const expiration = (Date.now() + CALLDATA_EXPIRATION_MS)
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = await encodeImportOrEnraptureWithSigData([standardizedParams], METAVERSE, [salt], expirationContract, multiverseVersion)
        const signature = await getSignature(oracle, payload)
        const hash = await calculateMetaAssetHash(standardizedParams, METAVERSE, salt, multiverseVersion)

        //TO DO: add a database transaction here, if RPC fails, if this request is called multiple times very fast can get multiple entries for same request hash
        await this.assetService.create({
            assetId: String(standardizedParams.assetId),
            assetOwner: standardizedParams.owner,
            enraptured,
            hash,
            requestHash,
            pendingIn: true,
            pendingOut: false,
            amount: standardizedParams.amount,
            expiration: expiration.toString(),
            owner: user,
            salt,
            recognizedAssetType: collectionFragment.recognizedAssetType,
            collectionFragment,
            createdAt: new Date(),
            modifiedAt: new Date()
        })
        this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} request prepared from NEW salt: ${[hash, payload, signature]}`, this.context)
        return { hash, data: payload, signature, confirmed: false }
    }


    public async userInConfirm(user: UserEntity, data: { hash: string, chainId: number }): Promise<boolean> {
        let skinAdded = false
        let resourceInventoryUpdate = false
        const hash = data.hash
        const funcCallPrefix = `[${makeid(5)}] userInConfirm:: uuid: ${user.uuid} hash: ${hash}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)


        const chainId = !!data.chainId ? data.chainId : this.defaultChainId;

        const assetEntry = await this.assetService.findOne({ hash, collectionFragment: { collection: { chainId } } }, { relations: ['collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })
        const enraptured = assetEntry.enraptured
        if (!assetEntry || assetEntry.hash !== hash) {
            this.logger.error(`${funcCallPrefix} invalid conditions. exists: ${!!assetEntry}, enraptured: ${assetEntry?.enraptured}, pendingOut: ${assetEntry?.pendingOut}, pendingIn: ${assetEntry?.pendingIn}`, null, this.context)
            throw new UnprocessableEntityException('Invalid enrapture confirm conditions')
        }

        if (assetEntry.pendingIn === false) {
            return true
        }
        const multiverseVersion = assetEntry.collectionFragment.collection.multiverseVersion
        const chainEntity = await this.chainService.findOne({ chainId })
        const assetAddress = assetEntry.collectionFragment.collection.assetAddress.toLowerCase()
        const assetType = assetEntry.collectionFragment.collection.assetType
        const assetId = assetEntry.assetId
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

        let contract: Contract = this.getContract(multiverseVersion, chainEntity, oracle)


        let mAsset: any

        if (multiverseVersion === MultiverseVersion.V1) {
            if (enraptured) {
                mAsset = await contract.getEnrapturedMetaAsset(hash)
            } else {
                mAsset = await contract.getImportedMetaAsset(hash)
            }
        } else if (multiverseVersion === MultiverseVersion.V2) {
            mAsset = await contract.getMetaAsset(hash, enraptured)
        }


        if (multiverseVersion === MultiverseVersion.V1) {
            if (!mAsset || mAsset.amount.toString() !== assetEntry.amount || mAsset.asset.assetAddress.toLowerCase() !== assetAddress) {
                this.logger.error(`${funcCallPrefix} on-chain data didn't match for mAsset: ${JSON.stringify(mAsset)}`, null, this.context)
                throw new UnprocessableEntityException(`On-chain data didn't match`)
            }
        } else if (multiverseVersion === MultiverseVersion.V2) {
            if (!mAsset || mAsset.assetAmount.toString() !== assetEntry.amount || mAsset.assetAddress.toLowerCase() !== assetAddress.toLowerCase()) {
                this.logger.error(`${funcCallPrefix} on-chain data didn't match for mAsset: ${JSON.stringify(mAsset)}`, null, this.context)
                throw new UnprocessableEntityException(`On-chain data didn't match`)
            }
        }

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
            skinAdded = true
        } else {
            this.logger.warn('EnraptureConfirm: no texture found for asset!!!', this.context)
        }

        if (!!assetEntry.collectionFragment) {
            if (assetEntry.collectionFragment.gamepass) {
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
                    skinAdded = true
                }

                await this.userService.update(user.uuid, { allowedToPlay: user.allowedToPlay, role: user.role, numGamePassAsset: user.numGamePassAsset })
            }
        }

        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false, modifiedAt: new Date() });

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

        if (assetEntry.collectionFragment.treatAsFungible === true) {
            const cid = ResourceInventoryService.calculateId({ chainId, assetAddress, assetId, uuid: user.uuid })
            const inv = await this.resourceInventoryService.findOne({ id: cid }, { relations: ['assets'] })
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
                const entry: ResourceInventoryEntity = { ...inv, amount: newAmount, assets: (inv.assets ?? []).concat([finalentry]) }
                console.log(entry)
                await this.resourceInventoryService.create(entry)
            }
            resourceInventoryUpdate = true
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
        if (skinAdded) {
            this.eventBus.publish(new SkinAddedEvent(user.uuid))
        }
        if (resourceInventoryUpdate) {
            this.eventBus.publish(new ResourceInventoryUpdatedEvent(user.uuid))
        }
        this.eventBus.publish(new UserProfileUpdatedEvent(user.uuid))
        this.eventBus.publish(new AssetAddedEvent(user.uuid))

        return true
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

        const multiverseVersion = existingEntry.collectionFragment.collection.multiverseVersion
        const salt = await getSalt()
        const expiration = Date.now() + CALLDATA_EXPIRATION_MS
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = await encodeExportWithSigData({ hash }, expirationContract, multiverseVersion)
        const signature = await getSignature(oracle, payload)

        this.logger.debug(`OutData: request prepared: ${[hash, payload, signature]}`, this.context)

        let confirmsuccess = false
        existingEntry.pendingOut = true
        existingEntry.expiration = expiration.toString()
        existingEntry.modifiedAt = new Date()
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
            if (chainEntity.multiverseV1Address)
                contract = new Contract(chainEntity.multiverseV1Address, METAVERSE_ABI, oracle)
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


    public async userExportConfirm(user: UserEntity, data: { hash: string, chainId: number }, asset?: AssetEntity): Promise<boolean> {
        let skinSelectedChanged = false
        let skinRemoved = false
        let userProfileUpdated = false
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
        const multiverseVersion = assetEntry.collectionFragment.collection.multiverseVersion

        const chainEntity = await this.chainService.findOne({ chainId })
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

        let contract: Contract = this.getContract(multiverseVersion, chainEntity, oracle)

        let exists: any;
        if (multiverseVersion === MultiverseVersion.V1) {
            exists = await contract.existsImported(hash)
        } else if (multiverseVersion === MultiverseVersion.V2) {
            exists = await contract.exists(hash, false)
        }

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
            userProfileUpdated = true
        }

        const skin = await this.skinService.findOne({ id: SkinEntity.toId(user.uuid, assetAddress, assetId) })

        if (!!skin) {
            const removed = await this.skinService.remove(skin)
            if (removed.equipped && user.allowedToPlay) {
                await this.skinService.update({ id: SkinEntity.toId(user.uuid, '0x0', '0') }, { equipped: true })
                skinSelectedChanged = true
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
            skinRemoved = true
        }

        // TODO modify composite asset if it belongs to one: either equipped, or as a base asset

        const compositeAsset = assetEntry.compositeAsset
        await this.assetService.remove(assetEntry)

            ; (async () => {
                if (!!compositeAsset) {
                    try {
                        await this.compositeApiService.reevaluate(compositeAsset, user)
                        return
                    } catch {
                        this.logger.error(`userExportConfirm:: composite reevaluation as child failed`, undefined, this.context)
                    }
                }

                const cas = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { assetAddress, chainId } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })
                if (!!cas) {
                    try {
                        await this.compositeApiService.reevaluate(cas, user)
                        return
                    } catch {
                        this.logger.error(`userExportConfirm:: composite reevaluation as parent failed`, undefined, this.context)
                    }
                }
            })();

        if (skinSelectedChanged) {
            this.eventBus.publish(new SkinSelectedEvent(user.uuid))
        }

        if (skinRemoved) {
            this.eventBus.publish(new SkinRemovedEvent(user.uuid))
        }

        if (userProfileUpdated) {
            this.eventBus.publish(new UserProfileUpdatedEvent(user.uuid))
        }
        this.eventBus.publish(new AssetRemovedEvent(user.uuid))
        return true
    }

    private getContract(multiverseVersion: MultiverseVersion, chainEntity: ChainEntity, oracle: ethers.Wallet): Contract {
        if (multiverseVersion === MultiverseVersion.V1) {
            if (chainEntity.multiverseV1Address) {
                return new Contract(chainEntity.multiverseV1Address, METAVERSE_ABI, oracle)
            } else {
                this.logger.error(`getContract:: failure not find MultiverseAddress`)
                throw new UnprocessableEntityException('getContract:: confirm MultiverseAddress error.')
            }
        } else if (multiverseVersion === MultiverseVersion.V2) {
            if (chainEntity.multiverseV2Address) {
                return new Contract(chainEntity.multiverseV2Address, METAVERSE_V2_ABI, oracle)
            } else {
                this.logger.error(`getContract:: failure not find MultiverseAddress`)
                throw new UnprocessableEntityException('getContract:: confirm MultiverseAddress error.')
            }
        } else {
            this.logger.error(`getContract:: failiure not find multiverse version`)
            throw new UnprocessableEntityException('getContract:: find multiverse version')

        }
    }

    private ensureLock(key: string) {
        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex());
        }
    }


}

function makeid(length: number): string {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}