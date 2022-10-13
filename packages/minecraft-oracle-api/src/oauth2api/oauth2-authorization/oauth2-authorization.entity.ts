import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString
} from 'class-validator';
import { Oauth2ClientType } from '../../common/enums/Oauth2ClientType';
import { Oauth2Scope } from '../../common/enums/Oauth2Scope';
import { UserEntity } from '../../user/user/user.entity';
import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserRole } from '../../common/enums/UserRole';
import { Oauth2ClientEntity } from '../oauth2-client/oauth2-client.entity';

@Entity()
export class Oauth2AuthorizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  code: string

  @Column({ type: "timestamptz", nullable: false })
  codeCreatedAt: Date;

  @Column('enum', { array: true, default: [], enum: Oauth2Scope, nullable: false })
  scopes: Oauth2Scope[];

  @ManyToOne(() => UserEntity, (en) => en.uuid, { nullable: false })
  user: UserEntity

  @ManyToOne(() => Oauth2ClientEntity, (en) => en.clientId, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Oauth2ClientEntity

  @Column({ nullable: false })
  redirectUri: string;

  @Column({ nullable: true })
  accessToken: string

  @Column({ type: "timestamptz", nullable: true })
  accessTokenCreatedAt: Date;

  @Column({ nullable: true })
  refreshToken: string

  @Column({ type: "timestamptz", nullable: true })
  refreshTokenCreatedAt: Date;

  @Column({ nullable: true })
  state: string;

  @Column({ type: "boolean", default: true, nullable: false })
  valid: boolean;
}

