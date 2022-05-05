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
    if (this.disabled) {
      this.logger.debug('handleConfirmPatrol: disabled', this.context);
      return
    }

    const now = Date.now()
    try {
      if (Date.now() - this.lastConfirmPatrol < IMPORT_CONFIRM_CRON_INTERVAL_MS) {
        this.logger.debug('handleConfirmPatrol: this coronjob has problems with premature ejaculation', this.context);
        return;
      }
      this.lastConfirmPatrol = now
      const assets = await this.assetService.findMany({where: [{pendingIn: true, expiration: MoreThanOrEqual(now)}, {pendingOut: true, expiration: MoreThanOrEqual(now)}], relations: ['owner']})
      
      this.logger.debug(`handleConfirmPatrol: found ${assets.length} assets to check`, this.context);
      
      for(let i = 0; i < assets.length; i++) {
        const asset = assets[i]
        try {
          if (asset.pendingIn) {
            if (asset.enraptured) {
              this.logger.debug(`handleConfirmPatrol: enrapture confirm of ${asset.hash}`, this.context);
              await this.oracleApiService.userEnraptureConfirm(asset.owner, {hash: asset.hash, chainId: asset.chainId}, asset)
            } else {
              this.logger.debug(`handleConfirmPatrol: import confirm of ${asset.hash}`, this.context);
              await this.oracleApiService.userImportConfirm(asset.owner, {hash: asset.hash, chainId: asset.chainId}, asset)
            }
          }
          if (asset.pendingOut) {
            this.logger.debug(`handleConfirmPatrol: export confirm of ${asset.hash}`, this.context);
            await this.oracleApiService.userExportConfirm(asset.owner, {hash: asset.hash, chainId: asset.chainId}, asset)
          }
        } catch (e) {
          this.logger.warn(`handleConfirmPatrol: error confirming ${asset.hash}`, this.context);
          this.logger.warn(e, this.context);
        }
      }

    } catch (error) {
      this.logger.error('handleConfirmPatrol: unsuccessful task', null, this.context);
      this.logger.error(error, null, this.context);
    }
  }

@Interval(CLEAN_CRON_INTERVAL_MS)
  async handleCleanPatrol() {
    if (this.disabled) {
      this.logger.debug('handleCleanPatrol: disabled', this.context);
      return
    }

    const now = Date.now()
    try {
      if (now - this.lastCleanPatrol < CLEAN_CRON_INTERVAL_MS) {
        this.logger.debug('handleCleanPatrol: this coronjob has problems with premature ejaculation', this.context);
        return;
      }
      this.lastCleanPatrol = now
      const assets = await this.assetService.findMany({where: [{pendingIn: true, expiration: LessThan(now)}, {pendingOut: true, expiration: LessThan(now)}], relations: ['owner']})

      this.logger.debug(`handleCleanPatrol: found ${assets.length} assets to clean`, this.context);

      for(let i = 0; i < assets.length; i++) {
        let success = false
        const asset = assets[i]
        try {
          if (asset.pendingIn) {
            if (asset.enraptured) {
                this.logger.debug(`handleCleanPatrol: enrapture confirm of ${asset.hash}`, this.context);
                success = await this.oracleApiService.userEnraptureConfirm(asset.owner, {hash: asset.hash, chainId: asset.chainId}, asset)
              } else {
                this.logger.debug(`handleCleanPatrol: import confirm of ${asset.hash}`, this.context);
                success = await this.oracleApiService.userImportConfirm(asset.owner, {hash: asset.hash, chainId: asset.chainId}, asset)
              }
          }

          if (asset.pendingOut) {
            this.logger.debug(`handleCleanPatrol: export confirm of ${asset.hash}`, this.context);
            success = await this.oracleApiService.userExportConfirm(asset.owner, {hash: asset.hash, chainId: asset.chainId}, asset)
            continue
          }
        } catch (e) {
          success = false
          if (asset.pendingOut) {
            continue
          }
        }

        if (!success) {
          this.logger.log(`handleCleanPatrol: failed to confirm expired asset ${asset.hash}. Cleaning up..`, this.context);
          await this.assetService.remove(asset)
        }
      }

    } catch (error) {
      this.logger.error('handleConfirmPatrol: unsuccessful task', null, this.context);
      this.logger.error(error, null, this.context);
    }
  }
}
