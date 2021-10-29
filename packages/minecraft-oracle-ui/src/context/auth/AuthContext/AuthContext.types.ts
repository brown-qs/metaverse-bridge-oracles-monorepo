export type AuthContextType = {
    authData: { jwt: string, userProfile: object } | null;
    setAuthData: React.Dispatch<React.SetStateAction<{jwt: string, userProfile: object } | null>>;
};
