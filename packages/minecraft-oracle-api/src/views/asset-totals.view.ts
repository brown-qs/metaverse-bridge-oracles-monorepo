import { Post } from "@nestjs/common";
import { Category } from "fp-ts/lib/Reader";
import { ViewEntity, Connection, ViewColumn, Column } from "typeorm";
import { AssetEntity } from "../asset/asset.entity";
import { CollectionFragmentEntity } from "../collectionfragment/collectionfragment.entity";
import { UserEntity } from "../user/user/user.entity";

@ViewEntity({
    expression: (connection: Connection) => {

        //add limit so view is not editable
        //https://stackoverflow.com/questions/58026241/how-to-create-a-read-only-view-in-postgresql-similar-to-oracle
        return connection.createQueryBuilder()
            .select(`collection_fragment.name`, "name")
            // .addSelect(`collection_fragment.recognizedAssetType`, "recognizedAssetType")
            .from(CollectionFragmentEntity, "collection_fragment")
            .orderBy("collection_fragment.name", "ASC")
            .limit(1000 * 1000 * 1000)

    }
})
export class ZAssetTotalsView {
    @ViewColumn()
    uuid: string

    @ViewColumn()
    email: string

    @ViewColumn()
    minecraftUserName: string

    @ViewColumn()
    collectionName: string
}