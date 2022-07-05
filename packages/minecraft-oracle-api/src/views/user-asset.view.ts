import { Post } from "@nestjs/common";
import { Category } from "fp-ts/lib/Reader";
import { UserEntity } from "src/user/user/user.entity";
import { ViewEntity, Connection, ViewColumn } from "typeorm";

@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder().select("user.uuid", "uuid").from(UserEntity, "user")

})
export class UserAssetView {
    @ViewColumn()
    uuid: string
}