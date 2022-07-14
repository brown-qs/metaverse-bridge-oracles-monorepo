export enum UserRole {
  NONE = 'NONE',
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN'
}

export type ProfileContextType = {
  uuid: string,
  email: string | null,
  minecraftUuid: string | null,
  hasGame: boolean,
  minecraftUserName: string | null,
  role: UserRole,
  allowedToPlay: boolean,
  serverId: boolean | null,
  preferredServer: boolean | null,
  numTicket: number,
  numMoonsama: number,
  allowedToPlayReason: string,
  blacklisted: boolean
}

export type AuthData = { jwt?: string, userProfile?: ProfileContextType } | undefined

export type AuthContextType = {
  authData: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
};
