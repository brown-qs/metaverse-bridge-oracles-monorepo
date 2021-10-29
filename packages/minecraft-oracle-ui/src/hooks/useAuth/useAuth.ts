import { useContext } from 'react';
import { AuthContext } from 'context/auth/AuthContext/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            'useAuth must be used within an AuthContextController'
        );
    }
    return context;
};
