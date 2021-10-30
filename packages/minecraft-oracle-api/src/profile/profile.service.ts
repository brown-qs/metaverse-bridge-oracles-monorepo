

import {Inject, Injectable} from '@nestjs/common';
import { ProfileDto } from './dtos/profile.dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from '../asset/asset.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { UserEntity } from '../user/user.entity';
import { RecognizedAsset, RecognizedAssetType } from '../config/constants';
import { ProviderToken } from '../provider/token';
import { ProfileItemDto, ProfileItemsDto } from './dtos/profileItem.dto';
import { GameSessionService } from 'src/gamesession/gamesession.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly snapshotService: SnapshotService,
        private readonly assetService: AssetService,
        private readonly gameSessionService: GameSessionService,
        @Inject(ProviderToken.IMPORTABLE_ASSETS) private importableAssets: RecognizedAsset[],
        @Inject(ProviderToken.ENRAPTURABLE_ASSETS) private enrapturableAssets: RecognizedAsset[],
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {}

    async getPlayeritems(user: UserEntity): Promise<ProfileItemsDto> {
        const snapshots = await this.snapshotService.findMany({relations:['material', 'owner'], where: {owner: {uuid: user.uuid}}})
        
        const resources: ProfileItemDto[] = snapshots.map(snapshot => {
            return {
                amount: snapshot.amount,
                assetAddress: snapshot.material.assetAddress,
                assetType: snapshot.material.assetType,
                assetId: snapshot.material.assetId,
                name: snapshot.material.name,
                exportable: true,
            }
        })

        const userAssets = await this.assetService.findMany({where: {owner: user.uuid, pendingIn: false}})

        const tickets: ProfileItemDto[] = []
        const moonsamas: ProfileItemDto[] = []

        userAssets.map(asset => {
            const recongizedEnraptureAsset = this.enrapturableAssets.find(x => x.address.toLowerCase() === asset.assetAddress.toLowerCase())
            
            if (!!recongizedEnraptureAsset && recongizedEnraptureAsset.type.valueOf() === RecognizedAssetType.MOONSAMA.valueOf()) {
                moonsamas.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedEnraptureAsset.name,
                    exportable: !asset.enraptured
                })
                return
            }

            if (!!recongizedEnraptureAsset && recongizedEnraptureAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && asset.assetId === recongizedEnraptureAsset.id) {
                tickets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedEnraptureAsset.name,
                    exportable: !asset.enraptured
                })
                return
            }

            const recongizedImportAsset = this.importableAssets.find(x => x.address.toLowerCase() === asset.assetAddress.toLowerCase())
            
            if (!!recongizedImportAsset && recongizedImportAsset.type.valueOf() === RecognizedAssetType.MOONSAMA.valueOf()) {
                moonsamas.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedImportAsset.name,
                    exportable: !asset.enraptured
                })
                return
            }

            if (!!recongizedImportAsset && recongizedImportAsset.type.valueOf() === RecognizedAssetType.TICKET.valueOf() && asset.assetId === recongizedImportAsset.id) {
                tickets.push({
                    amount: asset.amount,
                    assetAddress: asset.assetAddress.toLowerCase(),
                    assetType: asset.assetType,
                    assetId: asset.assetId,
                    name: recongizedImportAsset.name,
                    exportable: !asset.enraptured
                })
                return
            }
        })

        return {
            resources,
            tickets,
            moonsamas
        }
    }

    public userProfile(user: UserEntity): ProfileDto {
        return {
            uuid: user.uuid,
            hasGame: user.hasGame,
            userName: user.userName,
            role: user.role,
            allowedToPlay: user.allowedToPlay,
            serverId: user.serverId,
            preferredServer: user.preferredServer,
            numTicket: user.numTicket,
            numMoonsama: user.numMoonsama
        }
    }

    public async getGameInProgress(): Promise<boolean> {
        return !!(await this.gameSessionService.getOngoing())
    }

}
