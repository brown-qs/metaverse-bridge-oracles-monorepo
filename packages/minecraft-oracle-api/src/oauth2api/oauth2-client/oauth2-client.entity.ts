import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString
} from 'class-validator';
import { Oauth2ClientType } from 'src/common/enums/Oauth2ClientType';
import { Oauth2Scope } from 'src/common/enums/Oauth2Scope';
import { UserEntity } from 'src/user/user/user.entity';
import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserRole } from '../../common/enums/UserRole';

@Entity()
export class Oauth2ClientEntity {
  @PrimaryColumn()
  clientId: string;

  @Column({ unique: true, nullable: false })
  clientSecret: string

  @Column({ unique: true, nullable: false })
  appName: string

  //rfc6749 When registering a client, the client developer SHALL specify the client type as described in Section 2.1
  //everybody should be confidential
  @IsEnum(Oauth2ClientType)
  @Column({
    type: 'enum',
    enum: Oauth2ClientType,
    default: Oauth2ClientType.CONFIDENTIAL,
    nullable: false
  })
  clientType: Oauth2ClientType

  @Column({ nullable: false })
  redirectUri: string

  @Column({ nullable: false, type: "integer", default: 3600 })
  accessTokenValidity: number

  @Column({ nullable: false, type: "integer", default: 1209600 })
  refreshTokenValidity: number

  @Column('enum', { array: true, default: [], enum: Oauth2Scope })
  scopes: Oauth2Scope[];

  @Column({ type: "timestamptz", nullable: false })
  createdAt: Date;

  @Column({ type: "timestamptz", nullable: false })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (en) => en.uuid, { nullable: false })
  owner: UserEntity
}

