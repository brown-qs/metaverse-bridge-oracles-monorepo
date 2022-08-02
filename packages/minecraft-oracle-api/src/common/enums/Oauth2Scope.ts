export enum Oauth2Scope {
    UserUuidRead = 'user:uuid.read',
    UserGamerTagRead = 'user:gamer_tag.read'
}

export enum Oauth2PrettyScope {
    UserUuidRead = 'Read your Moonsama user id',
    UserGamerTagRead = 'Read your Moonsama gamer tag'
}

export function scopeToPrettyScope(sc: Oauth2Scope): Oauth2PrettyScope {
    for (const [key, val] of Object.entries(Oauth2Scope)) {
        if (val === sc.valueOf()) {
            return Oauth2PrettyScope[key as keyof typeof Oauth2PrettyScope]
        }
    }
}

console.log(`scopeToPrettyScope: ${scopeToPrettyScope(Oauth2Scope.UserUuidRead)}`)
//force compiler to verify that each Oauth2Scope has an entry in Oauth2PrettyScope
interface Oauth2ScopeInterface extends Record<keyof typeof Oauth2Scope, string> { }
type VerifyExtends<T, U extends T> = true
type VerifyOauth2PrettyScope = VerifyExtends<Oauth2ScopeInterface, typeof Oauth2PrettyScope>;