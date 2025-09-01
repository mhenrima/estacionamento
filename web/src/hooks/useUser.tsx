import { useState, useEffect, useContext, createContext, type ReactNode } from 'react'; // <-- A CORREÇÃO ESTÁ AQUI
import { useNavigate } from 'react-router-dom';

// A interface User que já usamos antes
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
}

// O que nosso Context irá fornecer
interface UserContextType {
    user: User | null;
    isLoading: boolean; // Para sabermos se a verificação inicial está acontecendo
    logout: () => void;
    refetchUser: () => void; // Para atualizar os dados do usuário após o login
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// O Provedor, que vai "abraçar" nossa aplicação
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:3000/api';

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/sessions/logout`, { method: 'POST', credentials: 'include' });
            setUser(null);
            navigate('/'); // Redireciona para a tela de login
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, logout, refetchUser: fetchUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

// O Hook personalizado que nossos componentes usarão
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};