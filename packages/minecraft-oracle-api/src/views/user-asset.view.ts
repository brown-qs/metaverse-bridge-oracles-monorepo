import { Post } from "@nestjs/common";
import { Category } from "fp-ts/lib/Reader";
import { AssetEntity } from "src/asset/asset.entity";
import { CollectionFragmentEntity } from "src/collectionfragment/collectionfragment.entity";
import { UserEntity } from "src/user/user/user.entity";
import { ViewEntity, Connection, ViewColumn, Column } from "typeorm";

@ViewEntity({
    expression: (connection: Connection) => {

        //add limit so view is not editable
        //https://stackoverflow.com/questions/58026241/how-to-create-a-read-only-view-in-postgresql-similar-to-oracle
        return connection.createQueryBuilder()
            .select("asset.hash", "hash")
            .addSelect("asset.ownerUuid", "uuid")
            .addSelect(`asset.metadata->'tokenURI'->'name'`, "name")
            .addSelect("user.email", "email")
            .addSelect("user.minecraftUserName", "minecraftUserName")
            .addSelect("collection_fragment.name", "collectionName")
            .from(AssetEntity, "asset")
            .leftJoin(CollectionFragmentEntity, "collection_fragment", "collection_fragment.id = asset.collectionFragmentId")
            .leftJoin(UserEntity, "user", "user.uuid = asset.ownerUuid")
            .orderBy("collection_fragment.name", "ASC")
            .orderBy("asset.ownerUuid", "ASC")
            .limit(1000 * 1000 * 1000)

    }
})
export class ZUserAssetView {
    @ViewColumn()
    uuid: string

    @ViewColumn()
    email: string

    @ViewColumn()
    minecraftUserName: string

    @ViewColumn()
    collectionName: string
}