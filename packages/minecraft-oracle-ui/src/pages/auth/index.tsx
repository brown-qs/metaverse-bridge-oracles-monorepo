import { useParams, Redirect } from "react-router-dom";
import { useAuth } from "hooks";
import { useEffect } from "react";
import { useProfileCallback } from "hooks/multiverse/useProfile";

const AuthPage = () => {
    const { authData, setAuthData } = useAuth();
    const params = useParams<{ jwt: string }>();
    const jwt = params.jwt;
    const redirectRoute = window.sessionStorage.getItem('authSuccessRedirect') ?? '/profile';
    
    if(!!authData?.jwt){
        return <Redirect to='/profile'  />;
    }

    if(jwt) {
        setAuthData({
           jwt,
           userProfile: authData?.userProfile
        });

        return <Redirect to={redirectRoute} />;
    }

    return <Redirect to='/login'  />;
};

export default AuthPage;
