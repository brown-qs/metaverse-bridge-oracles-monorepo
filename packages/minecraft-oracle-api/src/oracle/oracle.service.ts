import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { GameSessionService } from '../gamesession/gamesession.service';
import { ImportDto } from './dtos/import.dto';
import { CALLDATA_EXPIRATION_MS, CALLDATA_EXPIRATION_THRESHOLD, METAVERSE, RecognizedAsset, RecognizedAssetType } from '../config/constants';
import { calculateMetaAssetHash, encodeEnraptureWithSigData, encodeExportWithSigData, encodeImportWithSigData, getSalt, getSignature, utf8ToKeccak } from './oracle';
import { Contract, ethers, Signer } from 'ethers';
import { ProviderToken } from '../provider/token';
import { AssetService } from '../asset/asset.service';
import { assetTypeToStringAssetType } from '../utils';
import { MetaAsset } from './oracle.types';
import { ExportDto } from './dtos/export.dto';
import { SummonDto } from './dtos/summon.dto';
import { AssetEntity } from '../asset/asset.entity';
import { Mutex, MutexInterface } from 'async-mutex';
import { UserRole } from '../common/enums/UserRole';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryEntity } from 'src/inventory/inventory.entity';
import { SkinService } from 'src/skin/skin.service';
import { SkinEntity } from 'src/skin/skin.entity';

@Injectable()
export class OracleService {

    private locks: Map<string, MutexInterface>;

    private readonly context: string;
    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly skinService: SkinService,
        private readonly gameSessionService: GameSessionService,
        private readonly assetService: AssetService,
        private readonly inventoryService: InventoryService,
        private configService: ConfigService,
        @Inject(ProviderToken.ORACLE_WALLET) private oracle: Signer,
        @Inject(ProviderToken.METAVERSE_CONTRACT) private metaverse: Contract,
        @Inject(ProviderToken.IMPORTABLE_ASSETS) private importableAssets: RecognizedAsset[],
        @Inject(ProviderToken.ENRAPTURABLE_ASSETS) private enrapturableAssets: RecognizedAsset[],
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = OracleService.name
        this.locks = new Map();

    }

    public async userInRequest(user: UserEntity, data: ImportDto, enraptured: boolean): Promise<[string, string, string, boolean]> {
        this.logger.debug(`userInRequest: ${JSON.stringify(data)}`, this.context)
        const inAsset = enraptured ? this.enrapturableAssets.find(x => x.address.toLowerCase() === data.asset.assetAddress.toLowerCase()) : this.importableAssets.find(x => x.address.toLowerCase() === data.asset.assetAddress.toLowerCase())

        if (!inAsset) {
            this.logger.error(`userInRequest: not an permissioned asset`, null, this.context)
            throw new UnprocessableEntityException(`Not permissioned asset`)
        }

        console.log(data)
        const requestHash = await utf8ToKeccak(JSON.stringify(data))
        const existingEntry = await this.assetService.findOne({ requestHash, enraptured, pendingIn: true, owner: { uuid: user.uuid } }, { order: { expiration: 'DESC' }, relations: ['owner'] })

        existingEntry ? console.log(Date.now() - Number.parseInt(existingEntry.expiration) - CALLDATA_EXPIRATION_THRESHOLD) : undefined

        // we try to confirm
        if (!!existingEntry) {
            console.log('exists?')
            const salt = existingEntry.salt
            const ma = {
                asset: data.asset,
                beneficiary: data.beneficiary,
                owner: data.owner,
                amount: data.amount,
                metaverse: METAVERSE,
                salt
            }
            const expirationContract = (Math.floor(Number.parseInt(existingEntry.expiration) / 1000)).toString()
            const payload = enraptured ? await encodeEnraptureWithSigData(ma, expirationContract) : await encodeImportWithSigData(ma, expirationContract)
            const signature = await getSignature(this.oracle, payload)
            const hash = await calculateMetaAssetHash(ma)

            this.logger.debug(`InData: request prepared: ${[hash, payload, signature]}`, this.context)

            let failedtoconfirm = false
            try {
                const success = enraptured ? await this.userEnraptureConfirm(user, { hash }) : await this.userImportConfirm(user, { hash })
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
        console.log('polo')
        const salt = await getSalt()
        const ma = {
            asset: data.asset,
            beneficiary: data.beneficiary,
            owner: data.owner,
            amount: data.amount,
            metaverse: METAVERSE,
            salt
        }
        const expiration = (Date.now() + CALLDATA_EXPIRATION_MS)
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = enraptured ? await encodeEnraptureWithSigData(ma, expirationContract) : await encodeImportWithSigData(ma, expirationContract)

        const signature = await getSignature(this.oracle, payload)
        const hash = await calculateMetaAssetHash(ma)

        const assetEntry = await this.assetService.create({
            assetAddress: ma.asset.assetAddress,
            assetType: assetTypeToStringAssetType(ma.asset.assetType),
            assetId: ma.asset.assetId,
            enraptured,
            hash,
            requestHash,
            pendingIn: true,
            pendingOut: false,
            amount: ma.amount,
            expiration: expiration.toString(),
            owner: user,
            salt
        })
        this.logger.debug(`InData: request: ${[hash, payload, signature]}`, this.context)
        return [hash, payload, signature, false]
    }

    public async userOutRequest(user: UserEntity, { hash }: ExportDto): Promise<[string, string, string, boolean]> {
        this.logger.debug(`userOutRequest: ${hash}`, this.context)

        if (user.blacklisted) {
            this.logger.error(`userOutRequest: user blacklisted`, null, this.context)
            throw new UnprocessableEntityException(`Blacklisted`)
        }

        if (!hash) {
            throw new UnprocessableEntityException(`No hash was received.`)
        }

        const ongoingGame = await this.gameSessionService.findOne({ ongoing: true })
        if (!!ongoingGame) {
            this.logger.error(`userOutRequest: forbidden during ongoing game`, null, this.context)
            throw new UnprocessableEntityException(`Forbidden during ongoing game`)
        }

        const existingEntry = await this.assetService.findOne({ hash, enraptured: false, pendingIn: false, owner: { uuid: user.uuid } })
        if (!existingEntry) {
            this.logger.error(`userOutRequest: exportable asset not found ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`Exportable asset not found`)
        }

        const salt = await getSalt()
        const expiration = Date.now() + CALLDATA_EXPIRATION_MS
        const expirationContract = (Math.floor(expiration / 1000)).toString()
        const payload = await encodeExportWithSigData({ hash }, expirationContract)
        const signature = await getSignature(this.oracle, payload)

        this.logger.debug(`OutData: request prepared: ${[hash, payload, signature]}`, this.context)

        let confirmsuccess = false
        existingEntry.pendingOut = true
        existingEntry.expiration = expiration.toString()
        await this.assetService.create(existingEntry)

        try {
            confirmsuccess = await this.userExportConfirm(user, { hash })
        } catch (e) {
        }

        if (confirmsuccess) {
            return [hash, payload, signature, true]
        }
        return [hash, payload, signature, false]
    }

    public async userSummonRequest(user: UserEntity, { recipient }: SummonDto): Promise<boolean> {
        this.logger.debug(`userSummonRequest user ${user.uuid} to ${recipient}`, this.context)

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


            for (let i = 0; i < addresses.length; i++) {
                try {
                    const ids = groups[addresses[i]].ids
                    const amounts = groups[addresses[i]].amounts
                    //console.log({METAVERSE, recipient, ids, amounts, i})
                    //console.log(this.metaverse)
                    //console.log(JSON.stringify(this.metaverse.summonFromMetaverse))

                    const receipt = await (await this.metaverse.summonFromMetaverse(METAVERSE, recipient, ids, amounts, [], { value: 0, gasPrice: '3000000000', gasLimit: '1000000' })).wait()

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

    public async userImportConfirm(user: UserEntity, { hash }: { hash: string }, asset?: AssetEntity): Promise<boolean> {

        this.logger.log(`ImportConfirm: started ${user.uuid}: ${hash}`, this.context)

        const assetEntry = !!asset ? asset : await this.assetService.findOne({ hash })


        if (!assetEntry || assetEntry.hash !== hash || assetEntry.enraptured !== false) {
            this.logger.error(`ImportConfirm: invalid conditions. exists: ${!!assetEntry}, hash: ${hash}, enraptured: ${assetEntry?.enraptured}, pendingOut: ${assetEntry?.pendingOut}, pendingIn: ${assetEntry?.pendingIn}`)
            throw new UnprocessableEntityException('Invalid import confirm conditions')
        }

        if (assetEntry.pendingIn === false) {
            return true
        }

        console.log(hash)
        const mAsset: MetaAsset = await this.metaverse.getImportedMetaAsset(hash)

        if (!mAsset || mAsset.amount.toString() !== assetEntry.amount || mAsset.asset.assetAddress.toLowerCase() !== assetEntry.assetAddress.toLowerCase()) {
            this.logger.error(`ImportConfirm: on-chaind data didn't match for hash: ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`On-chain data didn't match`)
        }

        const recognizedAsset = this.importableAssets.find(x => x.address === assetEntry.assetAddress.toLowerCase())
        console.log(recognizedAsset)
        console.log(user.uuid, hash, RecognizedAssetType.MOONSAMA.valueOf(), RecognizedAssetType.TICKET.valueOf(), recognizedAsset?.id, JSON.stringify(mAsset))

        // assign skin if asset unlocks one
        const texture = await this.textureService.findOne({ assetAddress: assetEntry.assetAddress.toLowerCase(), assetId: assetEntry.assetId })
        if (!!texture) {
            this.logger.log('ImportConfirm: Moonsama, texture found', this.context)
            await this.skinService.create({
                id: SkinEntity.toId(user.uuid, texture.assetAddress, texture.assetId),
                owner: user,
                equipped: false,
                texture   
            })
        } else {
            this.logger.warn('ImportConfirm: Moonsama but no texture found!!!', this.context)
        }

        // if asset is moonsama, user can play
        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.MOONSAMA.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === mAsset.asset.assetId.toString())) {
            this.logger.log(`ImportConfirm: setting moonsama for user ${user.uuid}: ${hash}`, this.context)
            user.allowedToPlay = true
            user.numMoonsama = (user.numMoonsama ?? 0) + 1
            user.role = user.role?.valueOf() === UserRole.NONE.valueOf() ? UserRole.PLAYER : user.role
            await this.userService.update(user.uuid, { allowedToPlay: user.allowedToPlay, role: user.role, numMoonsama: user.numMoonsama })
        }

        // if asset is VIP ticket, user can play
        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === mAsset.asset.assetId.toString())) {
            this.logger.log(`ImportConfirm: setting ticket for user ${user.uuid}: ${hash}`, this.context)
            user.allowedToPlay = true
            user.numTicket = (user.numTicket ?? 0) + 1
            user.role = user.role?.valueOf() === UserRole.NONE.valueOf() ? UserRole.PLAYER : user.role
            await this.userService.update(user.uuid, { allowedToPlay: user.allowedToPlay, role: user.role, numTicket: user.numTicket })
        }

        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false })

        if (!finalentry) {
            this.logger.error(`ImportConfirm: couldn't change pending flag: ${hash}`)
            throw new UnprocessableEntityException(`Database error`)
        }

        user.lastUsedAddress = mAsset.owner.toLowerCase()
        if (!user.usedAddresses.includes(user.lastUsedAddress)) {
            user.usedAddresses.push(user.lastUsedAddress)
        }
        await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress })

        return true
    }

    public async userEnraptureConfirm(user: UserEntity, { hash }: { hash: string }, asset?: AssetEntity): Promise<boolean> {
        const assetEntry = !!asset ? asset : await this.assetService.findOne({ hash })

        if (!assetEntry || assetEntry.hash !== hash || assetEntry.enraptured !== true) {
            this.logger.error(`EnraptureConfirm: invalid conditions. exists: ${!!assetEntry}, hash: ${hash}, enraptured: ${assetEntry.enraptured}, pendingOut: ${assetEntry.pendingOut}, pendingIn: ${assetEntry.pendingIn}`)
            throw new UnprocessableEntityException('Invalid enrapture confirm conditions')
        }

        if (assetEntry.pendingIn === false) {
            return true
        }

        const mAsset: MetaAsset = await this.metaverse.getEnrapturedMetaAsset(hash)

        if (!mAsset || mAsset.amount.toString() !== assetEntry.amount || mAsset.asset.assetAddress.toLowerCase() !== assetEntry.assetAddress.toLowerCase()) {
            this.logger.error(`EnraptureConfirm: on-chaind data didn't match for hash: ${hash}`)
            throw new UnprocessableEntityException(`On-chain data didn't match`)
        }

        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false })

        if (!finalentry) {
            this.logger.error(`EnraptureConfirm: couldn't change pending flag: ${hash}`)
            throw new UnprocessableEntityException(`Database error`)
        }

        user.lastUsedAddress = mAsset.owner.toLowerCase()
        if (!user.usedAddresses.includes(user.lastUsedAddress)) {
            user.usedAddresses.push(user.lastUsedAddress)
        }
        await this.userService.update(user.uuid, { usedAddresses: user.usedAddresses, lastUsedAddress: user.lastUsedAddress })

        return true
    }

    public async userExportConfirm(user: UserEntity, { hash }: { hash: string }, asset?: AssetEntity): Promise<boolean> {

        if (!hash) {
            this.logger.warn(`ExportConfirm: hash not received`, this.context)
            return false
        }

        const assetEntry = !!asset ? asset : await this.assetService.findOne({ hash, enraptured: false })

        if (!assetEntry) {
            this.logger.warn(`ExportConfirm: asset not found`, this.context)
            return true
        }

        if (!assetEntry.pendingOut) {
            this.logger.warn(`ExportConfirm: asset exists but is not pending for export`, this.context)
            return false
        }

        const exists = await this.metaverse.existsImported(hash)

        if (exists) {
            this.logger.error(`ExportConfirm: not exported yet: ${hash}`, null, this.context)
            throw new UnprocessableEntityException(`Not exported yet`)
        }

        const recognizedAsset = this.importableAssets.find(x => x.address === assetEntry.assetAddress.toLowerCase())

        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.MOONSAMA.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === assetEntry.assetId.toString())) {
            
            // if it was a moonsama we remove the skin
            const skin = await this.skinService.findOne({id: SkinEntity.toId(user.uuid, assetEntry.assetAddress, assetEntry.assetId)})
            if (!!skin) {
                await this.skinService.remove(skin)
            }
            user.numMoonsama = (user.numMoonsama ?? 0) > 0 ? user.numMoonsama - 1 : 0
            user.allowedToPlay = (user.numTicket ?? 0) > 0 || (user.numMoonsama ?? 0) > 0
            if (!user.role || user.role?.valueOf() !== UserRole.ADMIN.valueOf()) {
                user.role = user.allowedToPlay ? UserRole.PLAYER : UserRole.NONE
            }
            await this.userService.create(user)
        }

        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === assetEntry.assetId.toString())) {
            user.numTicket = (user.numTicket ?? 0) > 0 ? user.numTicket - 1 : 0
            user.allowedToPlay = (user.numTicket ?? 0) > 0 || (user.numMoonsama ?? 0) > 0
            if (!user.role || user.role?.valueOf() !== UserRole.ADMIN.valueOf()) {
                user.role = user.allowedToPlay ? UserRole.PLAYER : UserRole.NONE
            }
            await this.userService.create(user)
        }
        await this.assetService.remove(assetEntry)
        return true
    }

    private ensureLock(key: string) {
        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex());
        }
    }
}
