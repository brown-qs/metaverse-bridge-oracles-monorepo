import {
    IsString,
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConfigEntity {

    constructor(entity: Partial<ConfigEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn()
    id?: string;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    description: string;


    @Column()
    @IsString()
    image: string;

    @Column()
    @IsString()
    artist: string;

    @Column()
    @IsString()
    artist_url: string;

    @Column()
    @IsString()
    external_link: string;

}
