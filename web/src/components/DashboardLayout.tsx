import { NavLink, Outlet } from 'react-router-dom';
import { Car, BarChart2, Users, Monitor, LogOut, KeySquare, Settings } from 'lucide-react';
import { useUser } from '../hooks/useUser';

interface MenuItem {
    path: string;
    icon: React.ReactNode;
    label: string;
    adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { path: '/dashboard/registro', icon: <Car size={20} />, label: 'Registro de Entrada/Saída' },
    { path: '/dashboard/vehicles', icon: <KeySquare size={20} />, label: 'Cadastro de Veículos' },
    { path: '/dashboard/mensalistas', icon: <Users size={20} />, label: 'Cadastro de Mensalistas' },
    { path: '/dashboard/monitoramento', icon: <Monitor size={20} />, label: 'Monitoramento de Vagas' },
    { path: '/dashboard/relatorio', icon: <BarChart2 size={20} />, label: 'Relatório Diário', adminOnly: true },
    { path: '/dashboard/configuracao', icon: <Settings size={20} />, label: 'Configurações', adminOnly: true },

];

const SidebarMenuItem = ({ item }: { item: MenuItem }) => (
    <li className="relative group">
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `flex items-center p-3 my-1 rounded-lg transition-colors ${isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
            }
        >
            {item.icon}
            <span
                className="absolute left-full ml-4 w-max bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded opacity-0 
                           group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
                {item.label}
            </span>
        </NavLink>
    </li>
);

export function DashboardLayout() {
    const { user, logout } = useUser();

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-20 flex flex-col items-center bg-white border-r border-gray-200 py-4">
                <div className="text-purple-600 mb-8">
                    <Car size={28} />
                </div>
                <nav>
                    <ul className="flex flex-col items-center space-y-2">
                        {menuItems
                            .filter(item => !item.adminOnly || (user && user.role === 'admin'))
                            .map(item => <SidebarMenuItem key={item.path} item={item} />)
                        }
                    </ul>
                </nav>
                <div className="mt-auto">
                    <button onClick={logout} title="Sair" className="p-3 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}