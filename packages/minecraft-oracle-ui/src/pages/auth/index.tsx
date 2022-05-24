import { useParams, Redirect } from "react-router-dom";
import { useAuth } from "hooks";

const AuthPage = () => {
    const { authData, setAuthData } = useAuth();
    const params = useParams<{ jwt: string }>();
    const jwt = params.jwt;
    const redirectRoute = window.sessionStorage.getItem('authSuccessRedirect') ?? '/bridge';
    
    if(!!authData?.jwt){
        return <Redirect to='/bridge'  />;
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
