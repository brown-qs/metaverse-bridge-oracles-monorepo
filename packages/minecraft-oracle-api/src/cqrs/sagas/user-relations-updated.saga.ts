import { Injectable } from "@nestjs/common";
import { Saga, ICommand, ofType } from "@nestjs/cqrs";
import { Observable, map, debounceTime, groupBy, mergeMap, EMPTY, timeoutWith, ignoreElements } from "rxjs";
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
      groupBy(event => event.uuid, event => event, eventsByUuid => {
        //clean up higher order observable after 15s to prevent memory leak
        return eventsByUuid.pipe(
          timeoutWith(15000, EMPTY),
          ignoreElements()
        )
      }),
      //map each higher order observable, debounce, then merge back into single observable
      mergeMap(group => {
        return group.pipe(
          debounceTime(1000),
          map(event => { return new UserRelationsUpdatedCommand(event.uuid) })
        )
      }),
    );
  }
}