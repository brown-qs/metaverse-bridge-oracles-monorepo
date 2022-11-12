import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SummonLogEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: false })
    uuid: string

    @Column({ nullable: false })
    chainId: number

    @Column({ nullable: false })
    assetAddress: string

    @Column('text', { array: true, default: [] })
    assetIds: string[];

    @Column('text', { array: true, default: [] })
    assetAmounts: string[];

    @Column({ nullable: false })
    recipient: string

    @Column({ nullable: false })
    transactionHash: string

    @Column({ type: "timestamptz", nullable: false })
    createdAt: Date
}
