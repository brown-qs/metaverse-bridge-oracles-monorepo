import {
    IsNumber,
    IsString,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SecretEntity {

    constructor(secretEntity: Partial<SecretEntity>) {
        Object.assign(this, secretEntity);
    }

    @PrimaryGeneratedColumn()
    @IsNumber()
    id?: number;

    @Column({ unique: true })
    @IsString()
    name: string;
    
    @Column()
    @IsString()
    secret: string;
}
