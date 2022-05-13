import {
    IsString,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ConfigEntity } from 'src/exoconfig/config.entity';

@Entity()
export class AttributeEntity {

    constructor(entity: Partial<AttributeEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    @IsString()
    trait_type: string;
    
    @Column()
    @IsString()
    value: string;

    @Column()
    @IsString()
    configId?: string;

    @ValidateNested()
    @ManyToOne(() => ConfigEntity, (config) => config.attributes)
    @JoinColumn()
    config: ConfigEntity;
}
