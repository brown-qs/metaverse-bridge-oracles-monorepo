import { useParams, Redirect } from "react-router-dom";
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
            return <Redirect to={'/oauth/confirm'} />;
        } else {
            return <Redirect to={'/account'} />;
        }

    } else {
        return <Redirect to='/account/login' />;
    }

};

export default AuthPage;
