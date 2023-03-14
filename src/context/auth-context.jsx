import { createContext, useContext } from 'react';

// default value for auth
const DEFAULT_VALUE = {
    user: undefined,
    setUser: () => null
};

export const AuthContext = createContext(DEFAULT_VALUE)

export function useAuth () {
    return useContext(AuthContext)
}
