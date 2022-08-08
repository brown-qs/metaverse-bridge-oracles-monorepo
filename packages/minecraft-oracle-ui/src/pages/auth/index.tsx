import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "hooks";
import { useEffect } from "react";
import { useOauthLogin } from "../../hooks/useOauthLogin/useOauthLogin";

const AuthPage = () => {
    const { authData, setAuthData } = useAuth();
    const params = useParams<{ jwt: string }>();
    const { oauthData, setOauthData } = useOauthLogin()

    const jwt = params?.jwt;
    const alreadyAuthed = !!authData?.jwt
    const newAuth = !!jwt

    useEffect(() => {
        if (newAuth) {
            console.log("set auth data: " + jwt)
            setAuthData({
                jwt,
                userProfile: authData?.userProfile
            });
        }
    }, [])

    if (newAuth || alreadyAuthed) {
        if (!!oauthData) {
            return <Navigate to={'/oauth/confirm'} />;
        } else {
            return <Navigate to={'/account'} />;
        }
    } else {
        return <Navigate to='/bridge' />;
    }

};

export default AuthPage;
