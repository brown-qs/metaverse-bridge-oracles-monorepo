import { useParams, Redirect } from "react-router-dom";
import { useAuth } from "hooks";
import { useEffect } from "react";

const AuthPage = () => {
    const { authData, setAuthData } = useAuth();
    const params = useParams<{ jwt: string }>();
    const jwt = params?.jwt;
    const alreadyAuthed = !!authData?.jwt
    const newAuth = !!jwt

    useEffect(() => {
        if (newAuth) {
            console.log("set auth data: " + jwt)
            setAuthData({
                jwt,
                emailUser: authData?.emailUser,
                userProfile: authData?.userProfile
            });
        }
    }, [])

    if (newAuth || alreadyAuthed) {
        return <Redirect to={'/account'} />;

    } else {
        return <Redirect to='/account/login' />;
    }

};

export default AuthPage;
