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


/*
-- used in tests that use HSQL
create table oauth_client_details (
  client_id VARCHAR(256) PRIMARY KEY,
  resource_ids VARCHAR(256),
  client_secret VARCHAR(256),
  scope VARCHAR(256),
  authorized_grant_types VARCHAR(256),
  web_server_redirect_uri VARCHAR(256),
  authorities VARCHAR(256),
  access_token_validity INTEGER,
  refresh_token_validity INTEGER,
  additional_information VARCHAR(4096),
  autoapprove VARCHAR(256)
);

create table oauth_client_token (
  token_id VARCHAR(256),
  token LONGVARBINARY,
  authentication_id VARCHAR(256) PRIMARY KEY,
  user_name VARCHAR(256),
  client_id VARCHAR(256)
);

create table oauth_access_token (
  token_id VARCHAR(256),
  token LONGVARBINARY,
  authentication_id VARCHAR(256) PRIMARY KEY,
  user_name VARCHAR(256),
  client_id VARCHAR(256),
  authentication LONGVARBINARY,
  refresh_token VARCHAR(256)
);

create table oauth_refresh_token (
  token_id VARCHAR(256),
  token LONGVARBINARY,
  authentication LONGVARBINARY
);

create table oauth_code (
  code VARCHAR(256), authentication LONGVARBINARY
);

create table oauth_approvals (
    userId VARCHAR(256),
    clientId VARCHAR(256),
    scope VARCHAR(256),
    status VARCHAR(10),
    expiresAt TIMESTAMP,
    lastModifiedAt TIMESTAMP
);


-- customized oauth_client_details table
create table ClientDetails (
  appId VARCHAR(256) PRIMARY KEY,
  resourceIds VARCHAR(256),
  appSecret VARCHAR(256),
  scope VARCHAR(256),
  grantTypes VARCHAR(256),
  redirectUrl VARCHAR(256),
  authorities VARCHAR(256),
  access_token_validity INTEGER,
  refresh_token_validity INTEGER,
  additionalInformation VARCHAR(4096),
  autoApproveScopes VARCHAR(256)
);

*/