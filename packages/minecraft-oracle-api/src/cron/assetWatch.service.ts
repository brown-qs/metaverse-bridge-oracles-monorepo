import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AssetService } from 'src/asset/asset.service';
import { GameSessionService } from 'src/gamesession/gamesession.service';
import { MaterialService } from 'src/material/material.service';
import { SnapshotService } from 'src/snapshot/snapshot.service';
import { SummonService } from 'src/summon/summon.service';
import { TextureService } from 'src/texture/texture.service';
import { UserService } from 'src/user/user.service';

import { Cron, Interval } from '@nestjs/schedule';
import { CLEAN_CRON_INTERVAL_MS, IMPORT_CONFIRM_CRON_INTERVAL_MS } from 'src/config/constants';
import { LessThan, MoreThan, MoreThanOrEqual } from 'typeorm';
import { OracleService } from 'src/oracle/oracle.service';

const MULTICALL_ADDRESS = '0x7d7737D8EDDDB5f3149b88a3Cde4c5E9D59098C3';
const SUSU_ADDRESS = '0x9cd9CAECDC816C3E7123A4F130A91A684D01f4Dc';
const XSUSU_ADDRESS = '0x1C41d2223dc95605fc4395294e65f170A4Fb1b40';


@Injectable()
export class AssetWatchService {

  private readonly context: string
  private lastConfirmPatrol: number = 0;
  private lastCleanPatrol: number = 0;

  constructor(
    private readonly assetService: AssetService,
    private readonly oracleService: OracleService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
      this.context = ConfigService.name
  }

  @Interval(IMPORT_CONFIRM_CRON_INTERVAL_MS)
  async handleConfirmPatrol() {
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
        try {
          if (assets[i].pendingIn) {
            if (assets[i].enraptured) {
              this.logger.debug(`handleConfirmPatrol: enrapture confirm of ${assets[i].hash}`, this.context);
              await this.oracleService.userEnraptureConfirm(assets[i].owner, {hash: assets[i].hash}, assets[i])
            } else {
              this.logger.debug(`handleConfirmPatrol: import confirm of ${assets[i].hash}`, this.context);
              await this.oracleService.userImportConfirm(assets[i].owner, {hash: assets[i].hash}, assets[i])
            }
          }
          if (assets[i].pendingOut) {
            this.logger.debug(`handleConfirmPatrol: export confirm of ${assets[i].hash}`, this.context);
            await this.oracleService.userExportConfirm(assets[i].owner, {hash: assets[i].hash}, assets[i])
          }
        } catch (e) {
          this.logger.warn(`handleConfirmPatrol: error confirming ${assets[i].hash}`, this.context);
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
        try {
          if (assets[i].pendingIn) {
            if (assets[i].enraptured) {
                this.logger.debug(`handleCleanPatrol: enrapture confirm of ${assets[i].hash}`, this.context);
                success = await this.oracleService.userEnraptureConfirm(assets[i].owner, {hash: assets[i].hash}, assets[i])
              } else {
                this.logger.debug(`handleCleanPatrol: import confirm of ${assets[i].hash}`, this.context);
                success = await this.oracleService.userImportConfirm(assets[i].owner, {hash: assets[i].hash}, assets[i])
              }
          }

          if (assets[i].pendingOut) {
            this.logger.debug(`handleCleanPatrol: export confirm of ${assets[i].hash}`, this.context);
            success = await this.oracleService.userExportConfirm(assets[i].owner, {hash: assets[i].hash}, assets[i])
          }
        } catch (e) {
          success = false
        }

        if (!success) {
          this.logger.log(`handleCleanPatrol: failed to confirm expired asset ${assets[i].hash}. Cleaning up..`, this.context);
          await this.assetService.remove(assets[i])
        }
      }

    } catch (error) {
      this.logger.error('handleConfirmPatrol: unsuccessful task', null, this.context);
      this.logger.error(error, null, this.context);
    }
  }
}
