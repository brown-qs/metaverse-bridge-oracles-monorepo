import { useContext } from 'react';
import { OauthLoginContext } from '../../context/oauthLogin/oauthLoginContext/OauthLoginContext';

export const useOauthLogin = () => {
    const context = useContext(OauthLoginContext);

    if (context === undefined) {
        throw new Error(
            'useAuth must be used within an AuthContextController'
        );
    }
    return context;
};
