export enum UserRole {
    NONE='NONE',
    PLAYER='PLAYER',
    ADMIN='ADMIN'
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
  numMoonsama: number
}

export type AuthContextType = {
    authData: { jwt: string, userProfile: ProfileContextType | undefined } | undefined;
    setAuthData: React.Dispatch<React.SetStateAction<{jwt: string, userProfile: ProfileContextType | undefined } | undefined>>;
};
