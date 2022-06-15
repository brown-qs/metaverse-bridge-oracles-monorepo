import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { allToSha256 } from '../crypto/hash';
import { UserAssetFingerprint, UserAssetFingerprintsResult, UsersAssetFingerprintQuery } from './dtos/fingerprint.dto';
import { ResourceInventoryQueryResult, SetResourceInventoryItems } from './dtos/resourceinventory.dto';
import { ResourceInventoryOffsetQueryResult, SetResourceInventoryOffsetItems } from './dtos/resourceinventoryoffset.dto';
import { ResourceInventoryService } from '../resourceinventory/resourceinventory.service';
import { ResourceInventoryOffsetService } from '../resourceinventoryoffset/resourceinventoryoffset.service';
import { UserEntity } from '../user/user.entity';
import { AssetService } from '../asset/asset.service';
import { UserService } from '../user/user.service';
import { AllAssetsQueryDto, AllAssetsResultDto } from './dtos/allassets.dto';
import { FungibleBalanceEntryDto, UsersFungibleBalancesQueryDto, UsersFungibleBalancesResultDto } from './dtos/fungiblebalances.dto';
import { CollectionFragmentService } from '../collectionfragment/collectionfragment.service';
import { In } from 'typeorm';
import { fromTokenizer } from 'file-type';

@Injectable()
export class AssetApiService {
    constructor(
        private readonly userService: UserService,
        private readonly assetService: AssetService,
        private readonly resourceInventoryService: ResourceInventoryService,
        private readonly resourceInventoryOffsetService: ResourceInventoryOffsetService,
        private readonly collectionFragmentService: CollectionFragmentService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { }

    async userAssets(user: UserEntity) {
        let userAssets = await this.assetService.findMany({ where: { owner: user.uuid, pendingIn: false } })
        return userAssets
    }

    async allUserAssets(dto: AllAssetsQueryDto) {
        const take = dto.take ?? 100
        const skip = dto.offset ?? 0

        const specs = typeof dto.specifics === 'string' ? [dto.specifics] : dto.specifics

        const users = dto.specifics ? await this.userService.findMany({ where: { uuid: In(specs) }, order: { uuid: 'ASC' }, relations: ['assets'] })
             : await this.userService.findMany({ take, skip, order: { uuid: 'ASC' }, relations: ['assets'] })
        return {
            results: users.map(u => {
                return {
                    user: {
                        name: u.userName,
                        uuid: u.uuid
                    },
                    assets: (u.assets ?? []).filter(a => !a.pendingIn)
                }
            })
        }
    }

    async allAssets(dto: AllAssetsQueryDto): Promise<AllAssetsResultDto> {
        const take = dto.take ?? 1000
        const skip = dto.offset ?? 0

        const specs = typeof dto.specifics === 'string' ? [dto.specifics] : dto.specifics

        const assets = dto.specifics ? await this.assetService.findMany({ where: { hash: In(specs)}, order: { hash: 'ASC' }, relations: ['owner'] })
            : await this.assetService.findMany({ where: { pendingIn: false }, take, skip, order: { hash: 'ASC' }, relations: ['owner'] })
        return {
            results: assets.map(a => {
                return { ...a, owner: { name: a.owner.userName, uuid: a.owner.uuid } }
            })
        }
    }

    getAssetFingerprintForPlayer(user: UserEntity): UserAssetFingerprint {

        if (!user) {
            return undefined
        }

        //console.log(user.userName)
        const hash = user.assets.filter(asset => !asset.pendingIn)
            .reduce((prevResult, element) => {
                const leafHash = allToSha256(element.collectionFragment.collection.chainId, element.collectionFragment.collection.assetAddress, element.assetId, JSON.stringify(element.metadata))
                const result = allToSha256(prevResult, leafHash)
                //console.log('    ', {leafHash, result: result.toString('hex')})
                return result
            }, Buffer.from([]))

        if (!hash || hash.length === 0) {
            return undefined
        }

        return {
            uuid: user.uuid,
            assetsFingerprint: hash.toString('hex')
        }
    }

    async getAssetFingerprints(dto: UsersAssetFingerprintQuery): Promise<UserAssetFingerprintsResult> {
        const take = dto.take ?? 100
        const skip = dto.offset ?? 0

        const specs = typeof dto.specifics === 'string' ? [dto.specifics] : dto.specifics

        const users = dto.specifics ? await this.userService.findMany({ where: { hasGame: true, uuid: In(specs) }, relations: ['assets', 'assets.collectionFragment', 'assets.collectionFragment.collection'], loadEagerRelations: true, order: { uuid: 'ASC' } })
            : await this.userService.findMany({ where: { hasGame: true }, relations: ['assets', 'assets.collectionFragment', 'assets.collectionFragment.collection'], loadEagerRelations: true, take, skip, order: { uuid: 'ASC' } })
        const results: UserAssetFingerprint[] = users.map(user => this.getAssetFingerprintForPlayer(user)).filter(x => !!x)

        return {
            fingerprints: results
        };
    }

    async getResourceInventoryPlayer(user: UserEntity): Promise<ResourceInventoryQueryResult[]> {
        const res = await this.resourceInventoryService.findMany({ where: { owner: { uuid: user.uuid } }, relations: ['owner', 'collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

        return res.map(x => {
            return {
                assetId: x.assetId,
                assetAddress: x.collectionFragment.collection.assetAddress,
                chainId: x.collectionFragment.collection.chainId,
                assetType: x.collectionFragment.collection.assetType,
                amount: formatEther(x.amount)
            }
        })
    }

    async setResourceInventoryPlayer(user: UserEntity, dto: SetResourceInventoryItems): Promise<boolean> {
        const res = await this.resourceInventoryService.findMany({ where: { owner: { uuid: user.uuid } }, relations: ['owner'] })

        await Promise.all(dto.items.map(async (x) => {
            const id = ResourceInventoryService.calculateId({ ...x, uuid: user.uuid })

            await this.resourceInventoryService.create({
                amount: parseEther(x.amount).toString(),
                id,
                owner: user,
                assetId: x.assetId,
                collectionFragment: await this.collectionFragmentService.findOne({ collection: { assetAddress: x.assetAddress.toLowerCase(), chainId: x.chainId } }, { relations: ['collection'] })
            })
        }))

        return true
    }

    async getResourceInventoryOffsetPlayer(user: UserEntity): Promise<ResourceInventoryOffsetQueryResult[]> {
        const res = await this.resourceInventoryOffsetService.findMany({ where: { owner: { uuid: user.uuid } }, relations: ['owner', 'resourceInventory', 'resourceInventory.collectionFragment', 'resourceInventory.collectionFragment.collection'], loadEagerRelations: true })

        return res.map(x => {
            return {
                assetId: x.resourceInventory.assetId,
                assetAddress: x.resourceInventory.collectionFragment.collection.assetAddress,
                chainId: x.resourceInventory.collectionFragment.collection.chainId,
                assetType: x.resourceInventory.collectionFragment.collection.assetType,
                amount: formatEther(x.amount)
            }
        })
    }

    async setResourceInventoryOffsetPlayer(user: UserEntity, dto: SetResourceInventoryOffsetItems): Promise<boolean> {
        await Promise.all(dto.items.map(async (x) => {
            const id = ResourceInventoryOffsetService.calculateId({ ...x, uuid: user.uuid })

            const resourceInventory = await this.resourceInventoryService.findOne({ id })

            if (!resourceInventory) {
                return undefined
            }

            await this.resourceInventoryOffsetService.create({
                amount: parseEther(x.amount).toString(),
                id,
                resourceInventory
            })
        }))

        return true
    }

    async getFungibleBalancesForPlayer(user: UserEntity): Promise<FungibleBalanceEntryDto> {
        const res = await this.resourceInventoryService.findMany({ where: { owner: { uuid: user.uuid } }, relations: ['owner', 'offset', 'collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true})

        if (!res) {
            return { balances: [], user: { uuid: user.uuid, name: user.userName } }
        }
        const results = await Promise.all(res.map(async (x) => {
            return {
                assetId: x.assetId,
                assetAddress: x.collectionFragment.collection.assetAddress,
                chainId: x.collectionFragment.collection.chainId,
                assetType: x.collectionFragment.collection.assetType,
                amount: x.offset?.amount ? formatEther(BigNumber.from(x.amount).sub(x.offset?.amount ?? '0')) : formatEther(x.amount)
            }
        }))

        return { balances: results, user: { uuid: user.uuid, name: user.userName } }
    }

    async getPlayersFungibleBalances(dto: UsersFungibleBalancesQueryDto): Promise<UsersFungibleBalancesResultDto> {
        const take = dto.take ?? 100
        const skip = dto.offset ?? 0

        const specs = typeof dto.specifics === 'string' ? [dto.specifics] : dto.specifics

        const res = dto.specifics ? await this.userService.findMany({ where: {uuid: In(specs)}, relations: ['resourceInventoryItems', 'resourceInventoryItems.offset', 'resourceInventoryItems.collectionFragment', 'resourceInventoryItems.collectionFragment.collection'], loadEagerRelations: true, order: { uuid: 'ASC' } })
            : await this.userService.findMany({ relations: ['resourceInventoryItems', 'resourceInventoryItems.offset', 'resourceInventoryItems.collectionFragment', 'resourceInventoryItems.collectionFragment.collection'], loadEagerRelations: true, take, skip, order: { uuid: 'ASC' } })

        const results = res.map((user) => {
            return {
                user: {
                    uuid: user.uuid,
                    name: user.userName
                },
                balances: user.resourceInventoryItems.map(x => {
                    return {
                        assetId: x.assetId,
                        assetAddress: x.collectionFragment.collection.assetAddress,
                        chainId: x.collectionFragment.collection.chainId,
                        assetType: x.collectionFragment.collection.assetType,
                        amount: x.offset?.amount ? formatEther(BigNumber.from(x.amount).sub(x.offset?.amount ?? '0')) : formatEther(x.amount)
                    }
                })
            }
        })

        if ((dto.excludeEmpty as any as string).toLowerCase() === 'true') {
            return {
                results: results.filter(x => x.balances.length > 0)
            }
        }

        return { results }
    }
}
