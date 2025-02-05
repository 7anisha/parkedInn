/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

type User = {
    id: number;
    email: string;
    name: string;
    mobile: string;
    avatar: string;
}

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}

type ProviderProps = {
    children: React.ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export default UserProvider;