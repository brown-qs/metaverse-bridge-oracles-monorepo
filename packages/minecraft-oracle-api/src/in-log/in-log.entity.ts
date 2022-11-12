
import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InLogEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: false })
    hash: string;

    @Column({ nullable: true })
    uuid: string;

    @Column({ type: "timestamptz", nullable: false })
    createdAt: Date
}
