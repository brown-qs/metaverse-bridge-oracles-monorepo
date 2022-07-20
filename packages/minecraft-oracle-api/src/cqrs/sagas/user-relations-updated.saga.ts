import { Injectable } from "@nestjs/common";
import { Saga, ICommand, ofType } from "@nestjs/cqrs";
import { Observable, map, debounceTime, groupBy, mergeMap } from "rxjs";
import { UserRelationsUpdatedCommand } from "../commands/user-relations-updated.command";
import { AssetAddedEvent } from "../events/asset-added.event";
import { AssetRemovedEvent } from "../events/asset-removed.event";
import { CompositeAssetUpdatedEvent } from "../events/composite-asset-updated.event";
import { ResourceInventoryOffsetUpdatedEvent } from "../events/resource-inventory-offset-updated.event";
import { ResourceInventoryUpdatedEvent } from "../events/resource-inventory-updated.event";
import { SkinAddedEvent } from "../events/skin-added.event";
import { SkinRemovedEvent } from "../events/skin-removed.event";
import { SkinSelectedEvent } from "../events/skin-selected.event";
import { UserProfileUpdatedEvent } from "../events/user-profile-updated.event";

@Injectable()
export class UserRelationsUpdatedSaga {
  @Saga()
  userRelationsUpdated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AssetAddedEvent, AssetRemovedEvent, CompositeAssetUpdatedEvent, ResourceInventoryOffsetUpdatedEvent, ResourceInventoryUpdatedEvent, SkinAddedEvent, SkinRemovedEvent, SkinSelectedEvent, UserProfileUpdatedEvent, UserProfileUpdatedEvent),
      //group by uuid so we can debounce updates to database
      groupBy(event => event.uuid),
      map(group => {
        return group.pipe(
          debounceTime(50),
          map(event => { return new UserRelationsUpdatedCommand(event.uuid) })
        )
      }),
      mergeMap(e => e)
    );
  }
}