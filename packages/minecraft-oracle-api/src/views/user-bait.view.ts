import { Post } from "@nestjs/common";
import { Category } from "fp-ts/lib/Reader";
import { AssetEntity } from "src/asset/asset.entity";
import { ResourceInventory } from "src/assetapi/dtos/resourceinventory.dto";
import { CollectionFragmentEntity } from "src/collectionfragment/collectionfragment.entity";
import { ResourceInventoryEntity } from "src/resourceinventory/resourceinventory.entity";
import { ResourceInventoryOffsetEntity } from "src/resourceinventoryoffset/resourceinventoryoffset.entity";
import { UserEntity } from "src/user/user/user.entity";
import { ViewEntity, Connection, ViewColumn, Column } from "typeorm";

@ViewEntity({
    expression: (connection: Connection) => {

        //add limit so view is not editable
        //https://stackoverflow.com/questions/58026241/how-to-create-a-read-only-view-in-postgresql-similar-to-oracle
        return connection.createQueryBuilder()
            .addSelect("resource_inventory.ownerUuid", "uuid")
            .addSelect("resource_inventory.amount", "amount")
            .addSelect("resource_inventory_offset.amount", "offset")
            .addSelect("")
            .from(ResourceInventoryEntity, "resource_inventory")
            .leftJoin(UserEntity, "user", "user.uuid = resource_inventory.ownerUuid")
            .leftJoin(ResourceInventoryOffsetEntity, "resource_inventory_offset", "resource_inventory.id = resource_inventory_offset.resourceInventoryId")
            .orderBy("resource_inventory.ownerUuid", "ASC")
            .limit(1000 * 1000 * 1000)

    }
})
export class ZUserBaitView {
    @ViewColumn()
    uuid: string

    @ViewColumn()
    email: string

    @ViewColumn()
    minecraftUserName: string

    @ViewColumn()
    collectionName: string
}