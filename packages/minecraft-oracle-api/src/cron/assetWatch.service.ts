import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from '../asset/asset.service';

import { Interval } from '@nestjs/schedule';
import { CLEAN_CRON_INTERVAL_MS, IMPORT_CONFIRM_CRON_INTERVAL_MS } from '../config/constants';
import { LessThan, MoreThanOrEqual } from 'typeorm';
import { OracleApiService } from '../oracleapi/oracleapi.service';


@Injectable()
export class AssetWatchService {

  private readonly context: string
  private lastConfirmPatrol: number = 0;
  private lastCleanPatrol: number = 0;

  private disabled: boolean = false;

  constructor(
    private readonly assetService: AssetService,
    private readonly oracleApiService: OracleApiService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
  ) {
    this.context = AssetWatchService.name
    this.disabled = this.configService.get<boolean>('cron.disabled') ?? false
  }

  @Interval(IMPORT_CONFIRM_CRON_INTERVAL_MS)
  async handleConfirmPatrol() {
    //REMOVE ME 
    return
    const funcCallPrefix = `[${makeid(5)}] handleConfirmPatrol::`

    if (this.disabled) {
      this.logger.debug(`${funcCallPrefix} DISABLED`, this.context);
      return
    }

    const now = Date.now()
    try {
      if (Date.now() - this.lastConfirmPatrol < IMPORT_CONFIRM_CRON_INTERVAL_MS) {
        this.logger.debug(`${funcCallPrefix} this coronjob has problems with premature ejaculation`, this.context);
        return;
      }
      this.lastConfirmPatrol = now
      const assets = await this.assetService.findMany({ where: [{ pendingIn: true, expiration: MoreThanOrEqual(now) }, { pendingOut: true, expiration: MoreThanOrEqual(now) }], relations: ['owner', 'collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

      this.logger.debug(`${funcCallPrefix} found ${assets.length} assets to check`, this.context);

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]
        const chainId = asset.collectionFragment.collection.chainId
        this.logger.debug(`${funcCallPrefix} asset: ${i} hash: ${asset.hash} pendingIn: ${asset.pendingIn} pendingOut: ${asset.pendingOut}`, this.context);

        try {
          if (asset.pendingIn) {
            this.logger.debug(`${funcCallPrefix} asset: ${i} hash: ${asset.hash}, confirming in...`, this.context);
            //database updates are handled in below function, no need to do it here
            const inSuccess = await this.oracleApiService.userInConfirm(asset.owner, { hash: asset.hash, chainId })
            this.logger.debug(`${funcCallPrefix} asset: ${i} hash: ${asset.hash}, successful in? ${inSuccess}`, this.context);
          }
          if (asset.pendingOut) {
            this.logger.debug(`${funcCallPrefix} asset: ${i} hash: ${asset.hash}, confirming in...`, this.context);
            //database removal is handled in below function, no need to do it here
            const outSuccess = await this.oracleApiService.userOutConfirm(asset.owner, { hash: asset.hash, chainId }, asset)
            this.logger.debug(`${funcCallPrefix} asset: ${i} hash: ${asset.hash}, successful out? ${outSuccess}`, this.context);
          }
        } catch (e) {
          this.logger.error(`${funcCallPrefix} asset: ${i} hash: ${asset.hash} in or out confirm threw error ${e}`, e, this.context);
        }
      }

    } catch (error) {
      this.logger.error(`${funcCallPrefix} unsuccessful task ${error}`, error, this.context);
    }
  }

  @Interval(CLEAN_CRON_INTERVAL_MS)
  async handleCleanPatrol() {
    const funcCallPrefix = `[${makeid(5)}] handleCleanPatrol::`

    if (this.disabled) {
      this.logger.debug(`${funcCallPrefix} DISABLED`, this.context);
      return
    }

    const now = Date.now()
    try {
      if (now - this.lastCleanPatrol < CLEAN_CRON_INTERVAL_MS) {
        this.logger.debug(`${funcCallPrefix} this coronjob has problems with premature ejaculation`, this.context);
        return;
      }
      this.lastCleanPatrol = now
      const assets = await this.assetService.findMany({ where: [{ pendingIn: true, expiration: LessThan(now) }, { pendingOut: true, enraptured: false, expiration: LessThan(now) }], relations: ['owner', 'collectionFragment', 'collectionFragment.collection'], loadEagerRelations: true })

      this.logger.debug(`${funcCallPrefix} found ${assets.length} assets to clean`, this.context);

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]
        const timeDiff = Date.now() - parseInt(asset.expiration)
        const chainId = asset.collectionFragment.collection.chainId
        this.logger.debug(`${funcCallPrefix} asset: ${i} hash: ${asset.hash} pendingIn: ${asset.pendingIn} pendingOut: ${asset.pendingOut}`, this.context);

        if (timeDiff < 1000 * 60 * 5) {
          this.logger.debug(`${funcCallPrefix} hash: ${asset.hash} was attempted to be exported/import in the last 5 mins, skipping.`, this.context);
          continue
        }

        try {
          if (asset.pendingIn) {
            this.logger.debug(`${funcCallPrefix} hash: ${asset.hash} in confirm...`, this.context);
            const inSuccess = await this.oracleApiService.userInConfirm(asset.owner, { hash: asset.hash, chainId })
            if (!inSuccess) {
              this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Asset couldn't be confirmed in, removing.`, this.context);
              //use delete to make sure make sure expiration time or pending in didn't change in the time between starting cron job and now
              const deleteResult = await this.assetService.delete({ hash: asset.hash, pendingIn: true, pendingOut: false, expiration: asset.expiration })
              this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Delete result: ${deleteResult.affected}`, this.context);
              if (deleteResult?.affected === 1) {
                this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Successfully deleted.`, this.context);
              } else {
                this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Row must've changed so asset was not deleted.`, this.context);
              }
            }
          }

          if (asset.pendingOut) {
            this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Asset couldn't be confirmed out, setting pendingOut = false.`, this.context);

            this.logger.debug(`${funcCallPrefix} hash: ${asset.hash} out confirm...`, this.context);
            const outSuccess = await this.oracleApiService.userOutConfirm(asset.owner, { hash: asset.hash, chainId })
            if (!outSuccess) {
              //use update to make sure make sure expiration time or pending out didn't change in the time between starting cron job and now
              const updateResult = await this.assetService.update({ hash: asset.hash, pendingIn: false, pendingOut: true, expiration: asset.expiration }, { pendingOut: false })
              this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Delete result: ${updateResult.affected}`, this.context);
              if (updateResult?.affected === 1) {
                this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Successfully updated.`, this.context);
              } else {
                this.logger.debug(`${funcCallPrefix} hash: ${asset.hash}. Row must've changed so asset was not updated.`, this.context);
              }
            }
          }
        } catch (e) {
          this.logger.error(`${funcCallPrefix} hash: ${asset.hash} in or out confirm threw error ${e}`, e, this.context);
        }
      }

    } catch (error) {
      this.logger.error(`${funcCallPrefix} unsuccessful task ${error}`, error, this.context);
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