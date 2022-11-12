
import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuditLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamptz", nullable: false })
    createdAt: Date
}
