"use client"
import React, { createContext, ReactNode, useContext, useState } from 'react';


interface UserAuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

// Define a type for your user data
interface User {
    id: number;
    username: string;
    email: string;
}

// Create a context with an initial value
const UserAuthContext = createContext<UserAuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
});

type UserProviderPropsType = {
    children: ReactNode;
};

// Custom hook to consume the UserAuthContext
export const useUserAuth = () => {
    return useContext(UserAuthContext);
  };

// Create a provider component
export const UserAuthProvider:  React.FC<UserProviderPropsType> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserAuthContext.Provider value={{ user, login, logout }}>
            {children}
        </UserAuthContext.Provider>
    );
};