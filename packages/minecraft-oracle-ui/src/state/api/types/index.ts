export type EmailLoginCode = {
    email: string
    "g-recaptcha-response": string
}

export type EmailLoginCodeResponse = {
    success: true
}

export type EmailLoginCodeVerifyResponse = {
    success: true
    jwt: string
}

export enum UserRole {
    NONE = 'NONE',
    PLAYER = 'PLAYER',
    ADMIN = 'ADMIN'
}

export type UserProfileResponse = {
    uuid: string,
    email: string | null,
    gamerTag: string | null,
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