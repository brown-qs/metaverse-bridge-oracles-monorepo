import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MigrationLogEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: false })
    bridgeHash: string

    @Column({ nullable: false })
    summonTransactionHash: string

    @Column({ type: "timestamptz", nullable: false })
    createdAt: Date
}
