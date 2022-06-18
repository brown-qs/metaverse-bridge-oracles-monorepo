export enum UserRole {
  NONE = 'NONE',
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN'
}

export type ProfileContextType = {
  uuid: string,
  hasGame: boolean,
  userName: string,
  role: UserRole,
  allowedToPlay: boolean,
  serverId: boolean | null,
  preferredServer: boolean | null,
  numTicket: number,
  numMoonsama: number,
  allowedToPlayReason: string,
  blacklisted: boolean
}

export type AccountContextType = {
  id: string,
  provider: string,
  email?: string,
  minecraftUuid: string | null,
}

export type AuthData = { jwt?: string, emailUser?: AccountContextType, userProfile?: ProfileContextType } | undefined

export type AuthContextType = {
  authData: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
};
