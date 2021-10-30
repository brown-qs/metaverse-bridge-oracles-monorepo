import React from 'react';
import { useParams, Redirect } from "react-router-dom";
import { useAuth } from "hooks";

const AuthPage = () => {
    const { authData, setAuthData } = useAuth();
    const params = useParams<{ jwt: string }>();
    const jwt = params.jwt;

    if(!!authData?.jwt){
        return <Redirect to='/profile'  />;
    }

    if(jwt) {
        setAuthData({
           jwt,
           userProfile: {},
        });

        return <Redirect to='/profile'  />;
    }

    return <Redirect to='/login'  />;
};

export default AuthPage;
