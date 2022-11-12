import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SummonLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamptz", nullable: false })
    createdAt: Date
}
