import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { TextureService } from '../texture/texture.service';
import { UserEntity } from '../user/user.entity';
import { MaterialService } from '../material/material.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { GameSessionService } from 'src/gamesession/gamesession.service';
import { ImportDto } from './dtos/import.dto';
import { CALLDATA_EXPIRATION_MS, CALLDATA_EXPIRATION_THRESHOLD, ENRAPTURABLE_ASSETS, IMPORTABLE_ASSETS, METAVERSE, RecognizedAsset, RecognizedAssetType } from 'src/config/constants';
import { calculateMetaAssetHash, encodeEnraptureWithSigData, encodeExportWithSigData, encodeImportWithSigData, getSalt, getSignature, utf8ToKeccak } from './oracle';
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { ProviderToken } from 'src/provider/token';
import { AssetService } from 'src/asset/asset.service';
import { assetTypeToStringAssetType, stringAssetTypeToAssetType } from 'src/utils';
import { MetaAsset } from './oracle.types';
import { ExportDto } from './dtos/export.dto';
import { SummonDto } from './dtos/summon.dto';
import { SummonService } from 'src/summon/summon.service';
import { number } from 'joi';
import { SnapshotItemEntity } from 'src/snapshot/snapshotItem.entity';

@Injectable()
export class OracleService {

    private readonly context: string;
    constructor(
        private readonly userService: UserService,
        private readonly textureService: TextureService,
        private readonly materialService: MaterialService,
        private readonly snapshotService: SnapshotService,
        private readonly gameSessionService: GameSessionService,
        private readonly assetService: AssetService,
        private readonly summonService: SummonService,
        private configService: ConfigService,
        @Inject(ProviderToken.ORACLE_WALLET) private oracle: Signer,
        @Inject(ProviderToken.METAVERSE_CONTRACT) private metaverse: Contract,
        @Inject(ProviderToken.IMPORTABLE_ASSETS) private importableAssets: RecognizedAsset[],
        @Inject(ProviderToken.ENRAPTURABLE_ASSETS) private enrapturableAssets: RecognizedAsset[],
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = OracleService.name
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

        const snapshots = await this.snapshotService.findMany({ relations: ['owner', 'material'], where: { owner: { uuid: user.uuid } } })

        if(!snapshots || snapshots.length === 0) {
            return false
        }

        const groups: { [key: string]: { ids: string[], amounts: string[], entities: SnapshotItemEntity[] } } = {}
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
            try{
                const ids = groups[addresses[i]].ids
                const amounts = groups[addresses[i]].amounts
                //console.log({METAVERSE, recipient, ids, amounts, i})
                //console.log(this.metaverse)
                //console.log(JSON.stringify(this.metaverse.summonFromMetaverse))

                await (await this.metaverse.summonFromMetaverse(METAVERSE, recipient, ids, amounts, [], {value: 0, gasPrice: '1000000000', gasLimit: '1000000'})).wait()

                try{
                    await this.snapshotService.removeAll(groups[addresses[i]].entities) 
                } catch(e) {
                    this.logger.error(`Summon: failiure to remove entities, ids ${JSON.stringify(groups[addresses[i]].ids)}`, e, this.context)
                }
            } catch(e) {
                //console.log(e)
                this.logger.error(`Summon: failiure to summon ids ${JSON.stringify(groups[addresses[i]].ids)}`, e, this.context)
                throw new UnprocessableEntityException('Summon error.')
            }
        }

        return true
    }

    public async userImportConfirm(user: UserEntity, { hash }: { hash: string }): Promise<boolean> {
        
        this.logger.log(`ImportConfirm: started ${user.uuid}: ${hash}`, this.context)
        const assetEntry = await this.assetService.findOne({ hash })


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
            this.logger.error(`ImportConfirm: on-chaind data didn't match for hash: ${hash}`)
            throw new UnprocessableEntityException(`On-chain data didn't match`)
        }

        const recognizedAsset = this.importableAssets.find(x => x.address === assetEntry.assetAddress.toLowerCase())
        console.log(recognizedAsset)
        console.log(user.uuid, hash, RecognizedAssetType.MOONSAMA.valueOf(), RecognizedAssetType.TICKET.valueOf(), recognizedAsset?.id, JSON.stringify(mAsset))
        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.MOONSAMA.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === mAsset.asset.assetId.toString())) {
            this.logger.log(`ImportConfirm: setting moonsama for user ${user.uuid}: ${hash}`, this.context)
            const texture = await this.textureService.findOne({ assetAddress: assetEntry.assetAddress, assetId: assetEntry.assetId, assetType: assetEntry.assetType })
            if (!!texture) {
                texture.owner = user
                await this.textureService.create(texture)
            }
            user.allowedToPlay = true
            user.numMoonsama = (user.numMoonsama ?? 0) + 1
            await this.userService.create(user)
        }

        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === mAsset.asset.assetId.toString())) {
            this.logger.log(`ImportConfirm: setting ticket for user ${user.uuid}: ${hash}`, this.context)
            user.allowedToPlay = true
            user.numTicket = (user.numTicket ?? 0) + 1
            await this.userService.create(user)
        }

        const finalentry = await this.assetService.create({ ...assetEntry, pendingIn: false })

        if (!finalentry) {
            this.logger.error(`ImportConfirm: couldn't change pending flag: ${hash}`)
            throw new UnprocessableEntityException(`Database error`)
        }

        return true
    }

    public async userEnraptureConfirm(user: UserEntity, { hash }: { hash: string }): Promise<boolean> {
        const assetEntry = await this.assetService.findOne({ hash })

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

        return true
    }

    public async userExportConfirm(user: UserEntity, { hash }: { hash: string }): Promise<boolean> {

        if (!hash) {
            this.logger.warn(`ExportConfirm: hash not received`, this.context)
            return false
        }

        const assetEntry = await this.assetService.findOne({ hash, enraptured: false })

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
            const texture = await this.textureService.findOne({ assetAddress: assetEntry.assetAddress, assetId: assetEntry.assetId, assetType: assetEntry.assetType })
            if (!!texture) {
                texture.owner = null
                await this.textureService.create(texture)
            }
            user.numMoonsama = (user.numMoonsama ?? 0) > 0 ? user.numMoonsama - 1 : 0
            user.allowedToPlay = (user.numTicket ?? 0) > 0 || (user.numMoonsama ?? 0) > 0 
            await this.userService.create(user)
        }

        if (!!recognizedAsset && recognizedAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && (recognizedAsset.id === undefined || recognizedAsset.id === assetEntry.assetId.toString())) {
            user.numTicket = (user.numTicket ?? 0) > 0 ? user.numTicket - 1 : 0
            user.allowedToPlay = (user.numTicket ?? 0) > 0 || (user.numMoonsama ?? 0) > 0
            await this.userService.create(user)
        }

        await this.assetService.remove(assetEntry)

        return true
    }
}
