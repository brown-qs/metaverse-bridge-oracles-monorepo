import { BadRequestException, Inject, Injectable, Scope, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user/user.entity';
import { GameService } from '../game/game.service';
import { CALLDATA_EXPIRATION_MS, ChainId, METAVERSE, MultiverseVersion, TransactionStatus } from '../config/constants';
import { calculateMetaAssetHash, encodeExportWithSigData, encodeImportOrEnraptureWithSigData, getSalt, getSignature, StandardizedValidatedAssetInParams, standardizeValidateAssetInParams, utf8ToKeccak } from './oracleapi.utils';
import { BigNumber, Contract, ethers } from 'ethers';
import { ProviderToken } from '../provider/token';
import { AssetService } from '../asset/asset.service';
import { findRecognizedAsset, stringAssetTypeToAssetType } from '../utils';
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
import { CollectionFragmentService } from '../collectionfragment/collectionfragment.service';
import { CallparamDto } from './dtos/callparams.dto';
import { FaucetResponseDto, InRequestDto, MigrateResponseDto } from './dtos/index.dto';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, ILike } from 'typeorm';
import { CollectionFragmentRoutingService } from '../collectionfragmentrouting/collectionfragmentrouting.service';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { InLogService } from '../in-log/in-log.service';
import { MigrationLogService } from '../migration-log/migration-log.service';
import { SummonLogService } from '../summon-log/summon-log.service';

@Injectable()
export class OracleApiService {

    private locks: Map<string, MutexInterface>;

    public static readonly SUMMON_LOCK_KEY = 'oracle_summon'
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
        private readonly collectionFragmentRoutingService: CollectionFragmentRoutingService,

        private readonly inLogService: InLogService,
        private readonly migrationLogService: MigrationLogService,
        private readonly summonLogService: SummonLogService,


        private configService: ConfigService,
        @Inject(ProviderToken.ORACLE_WALLET_CALLBACK) private getOracle: TypeOracleWalletProvider,
        @Inject(ProviderToken.RECOGNIZED_CHAIN_ASSETS_CALLBACK) private getRecognizedAsset: TypeRecognizedChainAssetsProvider,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @InjectConnection() private connection: Connection,

    ) {
        this.context = OracleApiService.name
        this.locks = new Map();
        this.oraclePrivateKey = this.configService.get<string>('network.oracle.privateKey');
        this.defaultChainId = this.configService.get<number>('network.defaultChainId')
    }
    public async faucet(address: string, user: UserEntity): Promise<FaucetResponseDto> {
        const funcCallPrefix = `[${makeid(5)}] faucet:: address: ${address.toLowerCase()} uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)

        if (typeof user.uuid !== "string" || user.uuid.length < 5) {
            this.logger.debug(`${funcCallPrefix} user failed sanity check ${JSON.stringify(user)}`, this.context)
            throw new BadRequestException("Invalid user.")
        }

        const chainEntity = await this.chainService.findOne({ chainId: ChainId.EXOSAMANETWORK })

        if (!chainEntity.faucetEnabled) {
            throw new BadRequestException("Faucet disabled.")
        }

        //make sure faucet is only used once, pray to god typeorm doesn't fuck us over here. According to typeorm affected is only supported on some db drivers, postgres seems to have it
        let result
        try {
            result = await this.userService.update({ uuid: user.uuid, exnFaucetTransactionStatus: null }, { exnFaucetTransactionStatus: TransactionStatus.QUEUED, exnFaucetAddress: address.toLowerCase(), exnFaucetSummonedAt: new Date() })
        } catch (e) {
            const errStr = String(e)
            this.logger.debug(`${funcCallPrefix} wallet has already been used with faucet.`, this.context)
            if (errStr.includes("duplicate key")) {
                throw new BadRequestException("Wallet already used with faucet.")
            }
            throw e
        }

        if (result.affected === 1) {
            this.logger.debug(`${funcCallPrefix} first time using faucet proceeding with summon.`, this.context)
        } else {
            this.logger.debug(`${funcCallPrefix} summon seems to already have started.`, this.context)
            return await this.faucetStatus(user)
        }

        const oracleLock = this.getOrCreateLock(OracleApiService.SUMMON_LOCK_KEY)

        await oracleLock.runExclusive(async () => {
            this.logger.debug(`${funcCallPrefix} summon mutex: start`, this.context)

            const userForCheck = await this.userService.findOne({ uuid: user.uuid })


            if (userForCheck.exnFaucetTransactionStatus !== TransactionStatus.QUEUED) {
                this.logger.debug(`${funcCallPrefix} summon mutex: doesnt pass sanity check, transaction is not Queued current status: ${userForCheck.exnFaucetTransactionStatus}`, this.context)
                return
            }

            const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
            const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

            let contract = new Contract(chainEntity.multiverseV2Address, METAVERSE_V2_ABI, oracle)
            console.log(`MV ADDRESS: ${chainEntity.multiverseV2Address}`)
            let receipt
            try {
                this.logger.debug(`${funcCallPrefix} summon mutex: start summon...`, this.context)

                await this.userService.update({ uuid: user.uuid }, { exnFaucetTransactionStatus: TransactionStatus.IN_PROGRESS })

                //Should we populate data with enraptured asset bridge hash for safety???
                const amount = "50000000000000000"
                const d: any = []
                // console.log(METAVERSE, assetEntry.assetOwner, migrateRoute.outCollectionFragment.collection.assetAddress, [migrateRoute.outAssetId], [assetEntry.amount], d)
                receipt = await ((await contract.summon(METAVERSE, address?.toLowerCase(), "0x710ddbaa47a4ccdc85a507a264865260e82c18ee", [0], [amount], d, { gasPrice: '1000000000', gasLimit: '7000000' })).wait())
                this.logger.debug(`${funcCallPrefix} summon mutex: summon complete`, this.context)

                await this.userService.update({ uuid: user.uuid }, { exnFaucetTransactionStatus: TransactionStatus.SUCCESS, exnFaucetTransactionHash: receipt.transactionHash.toLowerCase() })
                user.lastUsedAddress = address.toLowerCase()
                if (!user.usedAddresses.includes(user.lastUsedAddress)) {
                    user.usedAddresses.push(user.lastUsedAddress)
                }
                await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress })

                return receipt
            } catch (e) {
                this.logger.error(`${funcCallPrefix} summon mutex: error ${JSON.stringify(e)}`, e, this.context)
                await this.userService.update({ uuid: user.uuid }, { exnFaucetTransactionStatus: TransactionStatus.ERROR })
            }
        })
        return await this.faucetStatus(user)
    }

    public async faucetStatus(user: UserEntity): Promise<FaucetResponseDto> {
        const funcCallPrefix = `[${makeid(5)}] faucetStatus:: uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)

        const userEntity = this.userService.findOne({ uuid: user.uuid })
        if (!!userEntity) {
            return { transactionStatus: user.exnFaucetTransactionStatus, transactionHash: user.exnFaucetTransactionHash }
        } else {
            throw new BadRequestException("User not found.")
        }

    }

    public async inRequest(data: InRequestDto, autoMigrate: boolean, user?: UserEntity): Promise<CallparamDto> {
        const funcCallPrefix = `[${makeid(5)}] inRequest:: uuid: ${user?.uuid} autoMigrate: ${autoMigrate}`
        this.logger.debug(`${funcCallPrefix} START ImportDto: ${JSON.stringify(data)}`, this.context)

        let enraptureCollectionFrag = findRecognizedAsset(await this.getRecognizedAsset(data.chainId, BridgeAssetType.ENRAPTURED), { assetAddress: data.assetAddress, assetId: String(data.assetId) });
        let importCollectionFrag = findRecognizedAsset(await this.getRecognizedAsset(data.chainId, BridgeAssetType.IMPORTED), { assetAddress: data.assetAddress, assetId: String(data.assetId) })

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

        if (autoMigrate && !collectionFragment.enrapturable) {
            this.logger.error(`${funcCallPrefix} cannot auto migrate a non-enrapturable asset`, null, this.context)
            throw new UnprocessableEntityException(`Cannot migrate a non-enrapturable asset`)
        }

        if (autoMigrate && !collectionFragment.migratable) {
            this.logger.error(`${funcCallPrefix} asset is not migratable`, null, this.context)
            throw new UnprocessableEntityException(`Asset is not migratable`)
        }

        if (autoMigrate) {
            const migrateRoute = await this.collectionFragmentRoutingService.findOne({ inCollectionFragment: collectionFragment, inAssetId: data.assetId })

            if (!migrateRoute) {
                this.logger.debug(`${funcCallPrefix} couldn't find migrate route for collection fragment id: ${collectionFragment?.id} asset id: ${data.assetId}`, this.context)
                throw new BadRequestException("No migrate route.")
            }
        }

        const chainId = collectionFragment.collection.chainId
        const enraptured = collectionFragment.enrapturable === true
        this.logger.debug(`${funcCallPrefix} chainId: ${chainId} enraptured: ${String(enraptured)}`, this.context)


        //standardizes and validates asset in request so hash is deterministic
        let standardizedParams: StandardizedValidatedAssetInParams
        try {
            standardizedParams = standardizeValidateAssetInParams(chainId, stringAssetTypeToAssetType(data.assetType), data.assetAddress, data.assetId, data.amount, enraptured, data.owner)
            this.logger.debug(`${funcCallPrefix} standardized params: ${JSON.stringify(standardizedParams)}`, this.context)
        } catch (e) {
            console.log(e)
            this.logger.error(`${funcCallPrefix} failed to standardize`, e, this.context)
            throw new UnprocessableEntityException(`Failed to standard asset in request`)
        }

        const multiverseVersion = collectionFragment.collection.multiverseVersion

        if (multiverseVersion === MultiverseVersion.V1 && !collectionFragment.collection.chain.multiverseV1Address) {
            this.logger.debug(`${funcCallPrefix} no multiverse address set.`, this.context)
            throw new BadRequestException("No multiverse address set.")
        } else if (multiverseVersion === MultiverseVersion.V2 && !collectionFragment.collection.chain.multiverseV2Address) {
            this.logger.debug(`${funcCallPrefix} no multiverse address set.`, this.context)
            throw new BadRequestException("No multiverse address set.")
        }

        const oracle = await this.getOracle(chainId)
        const requestHash = await utf8ToKeccak(JSON.stringify(standardizedParams))
        this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash}`, this.context)

        const assetEntry = await this.assetService.findOne({ autoMigrate, requestHash, collectionFragment, enraptured, pendingIn: true, owner: (!!user ? user : null) }, { order: { expiration: 'DESC' }, relations: ['owner', 'collectionFragment'] })

        if (!!assetEntry) {
            this.logger.debug(`${funcCallPrefix} has existing entry`, this.context)

            const salt = assetEntry.salt
            this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt ${salt}`, this.context)

            const expirationContract = (Math.floor(Number.parseInt(assetEntry.expiration) / 1000)).toString()
            const payload = await encodeImportOrEnraptureWithSigData([standardizedParams], METAVERSE, [salt], expirationContract, multiverseVersion)
            const signature = await getSignature(oracle, payload)
            const hash = await calculateMetaAssetHash(standardizedParams, METAVERSE, salt, multiverseVersion)
            this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} request prepared from existing salt: ${[payload, signature]}`, this.context)

            let failedtoconfirm = false
            try {
                const success = await this.inConfirm(hash, user)
                this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} existing inflow confirmed!`, this.context)
            } catch (e) {
                failedtoconfirm = true
                this.logger.error(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} error confirming existing inflow`, e, this.context)
            }

            if (Number.parseInt(assetEntry.expiration) <= Date.now()) {
                if (!failedtoconfirm) {
                    this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} removing request because it has not been confirmed and is expired.`, this.context)
                    await this.assetService.delete({ hash: assetEntry.hash, expiration: assetEntry.expiration })
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
        } else {
            this.logger.debug(`${funcCallPrefix} NO existing entry`, this.context)
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
            owner: (!!user ? user : null),
            salt,
            recognizedAssetType: collectionFragment.recognizedAssetType,
            collectionFragment,
            createdAt: new Date(),
            modifiedAt: new Date(),
            autoMigrate,
        })
        //log all hashes so we know what user is associated with which bridge hash incase we need to reconstruct
        await this.inLogService.create({ hash: hash, uuid: user?.uuid, createdAt: new Date() })
        this.logger.debug(`${funcCallPrefix} requestHash: ${requestHash} salt: ${salt} hash: ${hash} request prepared from NEW salt: ${[hash, payload, signature]}`, this.context)
        return { hash, data: payload, signature, confirmed: false }
    }


    public async inConfirm(hash: string, user?: UserEntity): Promise<boolean> {
        const funcCallPrefix = `[${makeid(5)}] inConfirm:: hash: ${hash} uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)

        const assetEntry = await this.assetService.findOne({ hash }, { relations: ['owner', 'collectionFragment', 'collectionFragment.collection', 'collectionFragment.collection.chain'], loadEagerRelations: true })

        try {
            this.confirmAssetEntry(assetEntry, hash, user)
        } catch (e) {
            this.logger.error(`${funcCallPrefix} this.confirmAssetEntry failure ${e}`, e, this.context)
            throw new BadRequestException(String(e).replace("Error: ", ""))
        }

        if (assetEntry.pendingIn === false) {
            return true
        }

        let skinAdded = false
        let resourceInventoryUpdate = false

        const enraptured = assetEntry.enraptured
        const multiverseVersion = assetEntry.collectionFragment.collection.multiverseVersion
        const chainEntity = assetEntry.collectionFragment.collection.chain
        const assetAddress = assetEntry.collectionFragment.collection.assetAddress.toLowerCase()
        const assetType = assetEntry.collectionFragment.collection.assetType
        const assetId = assetEntry.assetId
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);
        const owner = assetEntry.owner

        let contract: Contract = this.getContract(multiverseVersion, chainEntity, oracle)


        let exists: any;
        if (multiverseVersion === MultiverseVersion.V1) {
            if (enraptured) {
                exists = await contract.existsEnraptured(hash)
            } else {
                exists = await contract.existsImported(hash)
            }
        } else if (multiverseVersion === MultiverseVersion.V2) {
            exists = await contract.exists(hash, enraptured)
        }
        this.logger.debug(`${funcCallPrefix} Hash exists in bridge? ${exists}`, this.context)

        if (exists === false) {
            this.logger.debug(`${funcCallPrefix} hash doesn't exist in bridge.`, this.context)
            return false
        }


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


        //make sure inConfirm is done only once so fungible inventory is not double counted, pray to god typeorm doesn't fuck us over here. According to typeorm affected is only supported on some db drivers, postgres seems to have it
        const { affected } = await this.assetService.update({ hash, pendingIn: true }, { pendingIn: false })
        if (affected === 1) {
            await this.assetService.update({ hash }, { modifiedAt: new Date() })
            this.logger.debug(`${funcCallPrefix} first time confirming inRequest, doing extra stuff like adding fungible inventory.`, this.context)
        } else {
            this.logger.debug(`${funcCallPrefix} affected ${affected}, NOT doing extra stuff.`, this.context)
            return true
        }


        if (!!owner) {
            // assign skin if asset unlocks one
            const texture = await this.textureService.findOne({ assetAddress, assetId })
            if (!!texture) {
                this.logger.log('EnraptureConfirm: texture found', this.context)
                await this.skinService.create({
                    id: SkinEntity.toId(owner.uuid, texture.assetAddress, texture.assetId),
                    owner: owner,
                    equipped: false,
                    texture
                })
                skinAdded = true
            } else {
                this.logger.warn('EnraptureConfirm: no texture found for asset!!!', this.context)
            }

            if (!!assetEntry.collectionFragment) {
                if (assetEntry.collectionFragment.gamepass) {
                    owner.allowedToPlay = true
                    owner.role = owner.role?.valueOf() === UserRole.NONE.valueOf() ? UserRole.PLAYER : owner.role
                    owner.numGamePassAsset = (owner.numGamePassAsset ?? 0) + 1

                    // this means user had no skins/in game eligible assets imported before
                    if (owner.numGamePassAsset === 1) {
                        try {
                            await this.skinService.createMultiple([
                                {
                                    id: SkinEntity.toId(owner.uuid, '0x0', '0'),
                                    owner: user,
                                    equipped: true,
                                    texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE })
                                },
                                {
                                    id: SkinEntity.toId(owner.uuid, '0x0', '1'),
                                    owner: owner,
                                    equipped: false,
                                    texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '1', assetType: StringAssetType.NONE })
                                }
                            ])
                        } catch (error) {
                            this.logger.warn(`ImportConfirm: error trying to set default skins for user ${owner.uuid}`, this.context)
                        }
                        skinAdded = true
                    }

                    await this.userService.update(owner.uuid, { allowedToPlay: owner.allowedToPlay, role: owner.role, numGamePassAsset: owner.numGamePassAsset })
                }
            }
        }

        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false, modifiedAt: new Date() });

        // TODO proper sideffects
        (async () => {
            let metadata = null
            let world = null
            try {
                metadata = (await this.nftApiService.getNFT(chainEntity.chainId.toString(), assetType, assetAddress, [assetId]))?.[0] as any ?? null
                world = metadata?.tokenURI?.plot?.world ?? null
            } catch {
                this.logger.error(`ImportConfirm: couldn't fetch asset metadata: ${hash}`, undefined, this.context)
            }
            if (!!metadata) {
                await this.assetService.update({ hash: assetEntry.hash }, { metadata, world })
            }
        })()


        if (!!owner) {
            if (assetEntry.collectionFragment.treatAsFungible === true) {
                const cid = ResourceInventoryService.calculateId({ chainId: chainEntity.chainId, assetAddress, assetId, uuid: owner.uuid })
                const inv = await this.resourceInventoryService.findOne({ id: cid }, { relations: ['assets'] })
                if (!inv) {
                    await this.resourceInventoryService.create({
                        amount: assetEntry.amount,
                        owner: owner,
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
        }

        if (!finalentry) {
            this.logger.error(`EnraptureConfirm: couldn't change pending flag: ${hash}`, undefined, this.context)
            throw new UnprocessableEntityException(`Database error`)
        }

        if (!!owner) {
            owner.lastUsedAddress = mAsset.owner.toLowerCase()
            if (!owner.usedAddresses.includes(owner.lastUsedAddress)) {
                owner.usedAddresses.push(owner.lastUsedAddress)
            }
            await this.userService.update(owner.uuid, { usedAddresses: owner.usedAddresses, lastUsedAddress: owner.lastUsedAddress, numGamePassAsset: owner.numGamePassAsset })
            if (skinAdded) {
                this.eventBus.publish(new SkinAddedEvent(owner.uuid))
            }
            if (resourceInventoryUpdate) {
                this.eventBus.publish(new ResourceInventoryUpdatedEvent(owner.uuid))
            }
            this.eventBus.publish(new UserProfileUpdatedEvent(owner.uuid))
            this.eventBus.publish(new AssetAddedEvent(owner.uuid))
        }
        return true
    }



    public async migrate(hash: string, user?: UserEntity): Promise<MigrateResponseDto> {
        const funcCallPrefix = `[${makeid(5)}] migrate:: hash: ${hash} uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)

        const enraptureFinished = await this.inConfirm(hash, user)
        if (!enraptureFinished) {
            this.logger.debug(`${funcCallPrefix} Enrapture hasn't finished`, this.context)
            throw new BadRequestException("Enrapture hasn't finished.")
        }



        const assetEntry = await this.assetService.findOne({ hash }, { relations: ['collectionFragment', 'collectionFragment.collection', 'collectionFragment.collection.chain', 'owner'], loadEagerRelations: true })

        if (assetEntry.pendingIn) {
            this.logger.debug(`${funcCallPrefix} asset is pending in.`, this.context)
            throw new BadRequestException("Asset is pending in.")
        }

        if (!assetEntry.autoMigrate) {
            this.logger.debug(`${funcCallPrefix} asset does not has autoMigrate enabled.`, this.context)
            throw new BadRequestException("Only auto migrations are supported right now.")
        }

        if (!assetEntry.enraptured) {
            this.logger.debug(`${funcCallPrefix} asset is not enraptured.`, this.context)
            throw new BadRequestException("Only enraptured assets can be migrated.")
        }

        const migrateRoute = await this.collectionFragmentRoutingService.findOne({ inCollectionFragment: assetEntry.collectionFragment, inAssetId: parseInt(assetEntry.assetId) }, { relations: ['outCollectionFragment', 'outCollectionFragment.collection', 'outCollectionFragment.collection.chain'], loadEagerRelations: true })

        if (!migrateRoute) {
            this.logger.debug(`${funcCallPrefix} couldn't find migration route for collection fragment id: ${assetEntry?.collectionFragment?.id} asset id: ${assetEntry.assetId}`, this.context)
            throw new BadRequestException("No migration route.")
        }

        this.logger.debug(`${funcCallPrefix} migration route: ${assetEntry.collectionFragment.collection.assetAddress} #${assetEntry.assetId} > ${migrateRoute.outCollectionFragment.collection.assetAddress} #${migrateRoute.outAssetId}`, this.context)


        if (assetEntry.summonTransactionStatus !== null) {
            this.logger.debug(`${funcCallPrefix} summon seems to already have started. Transaction status: ${assetEntry.summonTransactionStatus}`, this.context)
            return { transactionStatus: assetEntry.summonTransactionStatus, transactionHash: assetEntry.summonTransactionHash }
        }

        //make sure summon is done only once, pray to god typeorm doesn't fuck us over here. According to typeorm affected is only supported on some db drivers, postgres seems to have it
        const { affected } = await this.assetService.update({ hash, summonTransactionStatus: null }, { summonTransactionStatus: TransactionStatus.QUEUED })
        if (affected === 1) {

            await this.assetService.update({ hash }, { modifiedAt: new Date() })
            this.logger.debug(`${funcCallPrefix} updating transaction status 1 row affected, proceeding with summon.`, this.context)
        } else {
            this.logger.debug(`${funcCallPrefix} affected ${affected}, NOT summoning.`, this.context)
            const tempAsset = await this.assetService.findOne({ hash })
            return { transactionStatus: tempAsset.summonTransactionStatus, transactionHash: tempAsset.summonTransactionHash }
        }

        //double check this bridge hash has never been summoned before
        const existingSummon = await this.migrationLogService.findOne({ bridgeHash: hash })
        if (!!existingSummon) {
            this.logger.debug(`${funcCallPrefix} CRITICAL!!! migration summon attempted that was already completed`, this.context)
            const tempAsset = await this.assetService.findOne({ hash })
            return { transactionStatus: tempAsset.summonTransactionStatus, transactionHash: tempAsset.summonTransactionHash }
        }

        this.logger.debug(`${funcCallPrefix} Waiting for mutex...`, this.context)

        const oracleLock = this.getOrCreateLock(OracleApiService.SUMMON_LOCK_KEY)

        await oracleLock.runExclusive(async () => {
            this.logger.debug(`${funcCallPrefix} summon mutex: start`, this.context)

            const assetForCheck = await this.assetService.findOne({ hash })


            if (assetForCheck.summonTransactionStatus !== TransactionStatus.QUEUED) {
                this.logger.debug(`${funcCallPrefix} summon mutex: doesnt pass sanity check, transaction is not Queued current status: ${assetForCheck.summonTransactionStatus}`, this.context)
                return
            }

            const chainEntity = migrateRoute.outCollectionFragment.collection.chain
            const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
            const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

            let contract = new Contract(chainEntity.multiverseV2Address, METAVERSE_V2_ABI, oracle)

            let receipt
            try {
                this.logger.debug(`${funcCallPrefix} summon mutex: start summon...`, this.context)

                await this.assetService.update({ hash }, { summonTransactionStatus: TransactionStatus.IN_PROGRESS, modifiedAt: new Date() })

                //Should we populate data with enraptured asset bridge hash for safety???
                const d: any = []
                // console.log(METAVERSE, assetEntry.assetOwner, migrateRoute.outCollectionFragment.collection.assetAddress, [migrateRoute.outAssetId], [assetEntry.amount], d)
                receipt = await ((await contract.summon(METAVERSE, assetEntry.assetOwner, migrateRoute.outCollectionFragment.collection.assetAddress, [migrateRoute.outAssetId], [assetEntry.amount], d, { gasPrice: '1000000000', gasLimit: '7000000' })).wait())
                this.logger.debug(`${funcCallPrefix} summon mutex: summon complete`, this.context)

                await this.assetService.update({ hash }, { summonTransactionStatus: TransactionStatus.SUCCESS, summonTransactionHash: receipt.transactionHash.toLowerCase(), summonedAt: new Date(), modifiedAt: new Date() })
                await this.migrationLogService.create({ bridgeHash: hash, summonTransactionHash: receipt.transactionHash.toLowerCase(), createdAt: new Date() })
                return receipt
            } catch (e) {
                // console.log(e)
                this.logger.error(`${funcCallPrefix} summon mutex: error ${JSON.stringify(e)}`, e, this.context)
                await this.assetService.update({ hash }, { summonTransactionStatus: TransactionStatus.ERROR, modifiedAt: new Date() })
            }

            /*
            user.lastUsedAddress = recipient.toLowerCase()
            if (!user.usedAddresses.includes(user.lastUsedAddress)) {
                user.usedAddresses.push(user.lastUsedAddress)
            }
            await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress })*/
        })

        const returnAsset = await this.assetService.findOne({ hash })
        return { transactionStatus: returnAsset.summonTransactionStatus, transactionHash: returnAsset.summonTransactionHash }
    }


    public async outRequest(hash: string, user?: UserEntity): Promise<CallparamDto> {
        const funcCallPrefix = `[${makeid(5)}] outRequest:: hash: ${hash} uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)

        const assetEntry = await this.assetService.findOne({ hash, enraptured: false, pendingIn: false }, { relations: ['collectionFragment', 'collectionFragment.collection', 'collectionFragment.collection.chain', 'owner'], loadEagerRelations: true })

        try {
            this.confirmAssetEntry(assetEntry, hash, user)
        } catch (e) {
            this.logger.error(`${funcCallPrefix} this.confirmAssetEntry failure ${e}`, e, this.context)
            throw new BadRequestException(String(e).replace("Error: ", ""))
        }

        if (assetEntry?.owner?.blacklisted) {
            this.logger.error(`${funcCallPrefix} user blacklisted`, null, this.context)
            throw new UnprocessableEntityException(`Blacklisted`)
        }

        if (!!assetEntry?.owner) {
            const ongoingGame = await this.gameService.findOne({ ongoing: true, type: GameKind.CARNAGE })
            if (!!ongoingGame) {
                this.logger.error(`${funcCallPrefix} forbidden during ongoing game`, null, this.context)
                throw new UnprocessableEntityException(`Forbidden during ongoing game`)
            }
        }


        const chainId = assetEntry.collectionFragment.collection.chain.chainId
        const oracle = await this.getOracle(chainId)

        if (!oracle) {
            this.logger.error(`${funcCallPrefix} couldn't get oracle`, null, this.context)
            throw new UnprocessableEntityException(`Oracle could not serve the request`)
        }


        const multiverseVersion = assetEntry.collectionFragment.collection.multiverseVersion

        if (multiverseVersion === MultiverseVersion.V1 && !assetEntry.collectionFragment.collection.chain.multiverseV1Address) {
            this.logger.debug(`${funcCallPrefix} no multiverse address set.`, this.context)
            throw new BadRequestException("No multiverse address set.")
        } else if (multiverseVersion === MultiverseVersion.V2 && !assetEntry.collectionFragment.collection.chain.multiverseV2Address) {
            this.logger.debug(`${funcCallPrefix} no multiverse address set.`, this.context)
            throw new BadRequestException("No multiverse address set.")
        }

        const salt = await getSalt()
        const expiration = Date.now() + CALLDATA_EXPIRATION_MS
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = await encodeExportWithSigData({ hash }, expirationContract, multiverseVersion)
        const signature = await getSignature(oracle, payload)

        this.logger.debug(`OutData: request prepared: ${[hash, payload, signature]}`, this.context)

        let confirmsuccess = false
        assetEntry.pendingOut = true
        assetEntry.expiration = expiration.toString()
        assetEntry.modifiedAt = new Date()
        await this.assetService.create(assetEntry)

        try {
            confirmsuccess = await this.outConfirm(hash, user)
        } catch (e) {
        }

        if (confirmsuccess) {
            return { hash, data: payload, signature, confirmed: true }
        }
        return { hash, data: payload, signature, confirmed: false }
    }

    public async outConfirm(hash: string, user?: UserEntity): Promise<boolean> {
        const funcCallPrefix = `[${makeid(5)}] outConfirm:: hash: ${hash} uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} START`, this.context)

        const assetEntry = await this.assetService.findOne({ hash, enraptured: false }, { relations: ['collectionFragment', 'collectionFragment.collection', 'collectionFragment.collection.chain', 'compositeAsset', 'owner'], loadEagerRelations: true })

        try {
            this.confirmAssetEntry(assetEntry, hash, user)
        } catch (e) {
            this.logger.error(`${funcCallPrefix} this.confirmAssetEntry failure ${e}`, e, this.context)
            throw new BadRequestException(String(e).replace("Error: ", ""))
        }

        if (!assetEntry.pendingOut) {
            this.logger.warn(`ExportConfirm: asset exists but is not pending for export`, this.context)
            return false
        }

        let skinSelectedChanged = false
        let skinRemoved = false
        let userProfileUpdated = false

        const assetAddress = assetEntry.collectionFragment.collection.assetAddress
        const assetId = assetEntry.assetId
        const multiverseVersion = assetEntry.collectionFragment.collection.multiverseVersion
        const chainEntity = assetEntry.collectionFragment.collection.chain
        const chainId = chainEntity.chainId
        const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
        const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);
        const owner = assetEntry?.owner

        let contract: Contract = this.getContract(multiverseVersion, chainEntity, oracle)

        let exists: any;
        if (multiverseVersion === MultiverseVersion.V1) {
            exists = await contract.existsImported(hash)
        } else if (multiverseVersion === MultiverseVersion.V2) {
            exists = await contract.exists(hash, false)
        }

        if (exists) {
            this.logger.debug(`ExportConfirm: not exported yet: ${hash}`, this.context)
            return false
        }

        const exportableAssets = await this.getRecognizedAsset(chainId, BridgeAssetType.EXPORTED)
        const recognizedAsset = findRecognizedAsset(exportableAssets, { assetAddress, assetId })

        if (!!recognizedAsset && recognizedAsset.gamepass) {
            owner.numGamePassAsset = (owner.numGamePassAsset ?? 0) > 0 ? owner.numGamePassAsset - 1 : 0

            owner.allowedToPlay = (owner.numGamePassAsset ?? 0) > 0
            if (!owner.role || owner.role?.valueOf() !== UserRole.ADMIN.valueOf()) {
                owner.role = owner.allowedToPlay ? UserRole.PLAYER : UserRole.NONE
            }
            await this.userService.update(owner.uuid, { numGamePassAsset: owner.numGamePassAsset, allowedToPlay: owner.allowedToPlay, role: owner.role })
            userProfileUpdated = true
        }

        const skin = await this.skinService.findOne({ id: SkinEntity.toId(owner.uuid, assetAddress, assetId) })

        if (!!skin) {
            const removed = await this.skinService.remove(skin)
            if (removed.equipped && owner.allowedToPlay) {
                await this.skinService.update({ id: SkinEntity.toId(owner.uuid, '0x0', '0') }, { equipped: true })
                skinSelectedChanged = true
            }
        }

        if (!owner.allowedToPlay) {
            await this.skinService.removeMultiple(
                [
                    {
                        id: SkinEntity.toId(owner.uuid, '0x0', '0'),
                        owner: owner,
                        equipped: true,
                        texture: await this.textureService.findOne({ assetAddress: '0x0', assetId: '0', assetType: StringAssetType.NONE })
                    },
                    {
                        id: SkinEntity.toId(owner.uuid, '0x0', '1'),
                        owner: owner,
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
                        await this.compositeApiService.reevaluate(compositeAsset, owner)
                        return
                    } catch {
                        this.logger.error(`userExportConfirm:: composite reevaluation as child failed`, undefined, this.context)
                    }
                }

                const cas = await this.compositeAssetService.findOne({ assetId, compositeCollectionFragment: { collection: { assetAddress, chainId } } }, { relations: ['compositeCollectionFragment', 'compositeCollectionFragment.collection'], loadEagerRelations: true })
                if (!!cas) {
                    try {
                        await this.compositeApiService.reevaluate(cas, owner)
                        return
                    } catch {
                        this.logger.error(`userExportConfirm:: composite reevaluation as parent failed`, undefined, this.context)
                    }
                }
            })();

        if (skinSelectedChanged) {
            this.eventBus.publish(new SkinSelectedEvent(owner.uuid))
        }

        if (skinRemoved) {
            this.eventBus.publish(new SkinRemovedEvent(owner.uuid))
        }

        if (userProfileUpdated) {
            this.eventBus.publish(new UserProfileUpdatedEvent(owner.uuid))
        }
        this.eventBus.publish(new AssetRemovedEvent(owner.uuid))
        return true
    }


    public async userSummonRequest(user: UserEntity, { recipient, chainId }: SummonDto): Promise<boolean> {
        const funcId = makeid(5)
        const funcCallPrefix = `[${funcId}] userSummonRequest:: uuid: ${user?.uuid}`
        this.logger.debug(`${funcCallPrefix} to ${recipient}`, this.context)

        if (!recipient || recipient.length !== 42 || !recipient.startsWith('0x')) {
            this.logger.error(`${funcCallPrefix} recipient invalid: ${recipient}}`, null, this.context)
            throw new UnprocessableEntityException('Recipient invalid')
        }

        if (user.blacklisted) {
            this.logger.error(`${funcCallPrefix} user blacklisted`, null, this.context)
            throw new UnprocessableEntityException(`Blacklisted`)
        }
        const gamepass = await this.assetService.findOne({ owner: user, assetOwner: ILike(recipient?.toLowerCase()), collectionFragment: { gamepass: true } }, { relations: ["collectionFragment"] })
        if (!gamepass) {
            this.logger.error(`${funcCallPrefix} no gamepasses associated with recipient.`, null, this.context)
            throw new UnprocessableEntityException(`No gamepasses associated with recipient.`)
        }

        const inventoryItems = await this.inventoryService.findMany({ relations: ['owner', 'material', 'material.collectionFragment', 'material.collectionFragment.collection', 'material.collectionFragment.collection.chain'], where: { owner: { uuid: user.uuid }, summonInProgress: false, material: { collectionFragment: { collection: { chain: { inventorySummonEnabled: true } } } } }, loadEagerRelations: true })


        if (!inventoryItems || inventoryItems.length === 0) {
            const inventoryItemsSummonInProgress = await this.inventoryService.findMany({ relations: ['owner'], where: { owner: { uuid: user.uuid }, summonInProgress: true } })

            if (!inventoryItemsSummonInProgress || inventoryItemsSummonInProgress.length === 0) {
                return false
            } else {
                return true
            }
        }

        await Promise.all(
            inventoryItems.map(async (item) => {
                item.summonInProgress = true
                await this.inventoryService.update(item.id, { summonInProgress: item.summonInProgress })
            })
        )

        const oracleLock = this.getOrCreateLock(OracleApiService.SUMMON_LOCK_KEY)

        const res = await oracleLock.runExclusive(async () => {

            // safety vibe check
            if (!inventoryItems[0].summonInProgress) {
                this.logger.warn(`${funcCallPrefix} vibe check fail for ${user.uuid}`, this.context)
                return false
            }

            const groups: { [key: string]: { ids: string[], amounts: string[], chainId: number, entities: InventoryEntity[] } } = {}
            inventoryItems.map(item => {
                const amount = (item.material?.multiplier ?? 1) * Number.parseFloat(item.amount)
                const assetAddress = item.material?.collectionFragment?.collection?.assetAddress?.toLowerCase()
                if (!(assetAddress in groups)) {
                    groups[assetAddress] = {
                        ids: [],
                        amounts: [],
                        entities: [],
                        chainId: ChainId.EXOSAMANETWORK
                    }
                }
                groups[assetAddress]['amounts'].push(ethers.utils.parseEther(amount.toString()).toString())
                groups[assetAddress]['ids'].push(item.material.assetId)
                groups[assetAddress]['entities'].push(item)
                groups[assetAddress]['chainId'] = item.material.collectionFragment.collection.chainId
            })

            const addresses = Object.keys(groups)

            for (let i = 0; i < addresses.length; i++) {
                try {
                    const ids = groups[addresses[i]].ids
                    const amounts = groups[addresses[i]].amounts
                    const assetChainId = groups[addresses[i]].chainId
                    const assetAddress = addresses[i]
                    //console.log({METAVERSE, recipient, ids, amounts, i})
                    // console.log("SummonResult",this.metaverseChain[chainId])

                    const chainEntity = await this.chainService.findOne({ chainId: assetChainId })
                    const provider = new ethers.providers.JsonRpcProvider(chainEntity.rpcUrl);
                    const oracle = new ethers.Wallet(this.oraclePrivateKey, provider);

                    let contract: Contract;
                    let receipt: any
                    if (!!chainEntity.multiverseV1Address) {
                        contract = new Contract(chainEntity.multiverseV1Address, METAVERSE_ABI, oracle)
                        receipt = await (await contract.summonFromMetaverse(METAVERSE, recipient, ids, amounts, [], { gasPrice: '1000000000', gasLimit: '5000000' })).wait()
                        try {
                            await this.summonLogService.create({ uuid: user.uuid, summonSession: funcId, chainId: chainEntity.chainId, assetAddress, assetIds: ids, assetAmounts: amounts, recipient: recipient.toLowerCase(), transactionHash: receipt.transactionHash.toLowerCase(), createdAt: new Date() })
                        } catch (e) { }
                    } else if (!!chainEntity.multiverseV2Address) {
                        contract = new Contract(chainEntity.multiverseV2Address, METAVERSE_V2_ABI, oracle)
                        receipt = await (await contract.summon(METAVERSE, recipient, assetAddress, ids, amounts, [], { gasPrice: '1000000000', gasLimit: '5000000' })).wait()
                        try {
                            await this.summonLogService.create({ uuid: user.uuid, summonSession: funcId, chainId: chainEntity.chainId, assetAddress, assetIds: ids, assetAmounts: amounts, recipient: recipient.toLowerCase(), transactionHash: receipt.transactionHash.toLowerCase(), createdAt: new Date() })
                        } catch (e) { }
                    } else {
                        this.logger.error(`${funcCallPrefix} failure not find MultiverseAddress`)
                        throw new UnprocessableEntityException('Summon MultiverseAddress error.')
                    }

                    try {
                        await this.inventoryService.removeAll(groups[addresses[i]].entities)
                    } catch (e) {
                        this.logger.error(`${funcCallPrefix} failure to remove entities, ids ${JSON.stringify(groups[addresses[i]].ids)}`, e, this.context)
                    }

                    this.logger.log(`${funcCallPrefix} successful summon for user ${user.uuid}`, this.context)
                } catch (e) {
                    this.logger.error(`${funcCallPrefix} failure to summon ids ${JSON.stringify(groups[addresses[i]].ids)}`, e, this.context)

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


    private confirmAssetEntry(asset: AssetEntity, hash: string, user?: UserEntity) {
        if (!asset) {
            throw new Error(`Asset entry is not defined.`)
        }

        if (!hash) {
            throw new Error(`No hash provided.`)
        }

        if (asset.hash !== hash) {
            throw new Error(`Hash mismatch.`)
        }

        if (!!user) {
            if (asset?.owner?.uuid !== user?.uuid) {
                this.logger.debug(`confirmAssetEntry:: User mismatch 1 - asset?.owner?.uuid: ${asset?.owner?.uuid} user.uuid: ${user?.uuid}`)

                throw new Error(`User mismatch.`)
            }
        } else {
            //owner should be null if there is no user
            if (!!asset.owner) {
                this.logger.debug(`confirmAssetEntry:: User mismatch 2 - asset?.owner?.uuid: ${asset?.owner?.uuid} user.uuid: ${user?.uuid}`)
                throw new Error(`User mismatch.`)
            }
        }
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

    private getOrCreateLock(key: string) {
        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex());
        }
        return this.locks.get(key)
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