import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './components/DashboardLayout';
import { RegistroPage } from './pages/RegistroPage';
import { CadastroMensalistasPage } from './pages/CadastroMensalistasPage';
import { MonitoramentoPage } from './pages/MonitoramentoPage';
import { RelatorioPage } from './pages/RelatorioPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { UserProvider, useUser } from './hooks/useUser';
import { ConfiguracaoPage } from './pages/ConfiguracaoPage'; // <-- importe a nova página


// Rota para páginas públicas: se o usuário estiver logado, redireciona para o dashboard.
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Rota para páginas privadas: se o usuário não estiver logado, redireciona para o login.
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  return user ? <>{children}</> : <Navigate to="/" />;
};

// Rota para páginas de admin: se o usuário não for admin, redireciona para o dashboard.
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={<PrivateRoute> <DashboardLayout /> </PrivateRoute>}
          >
            <Route index element={<Navigate to="registro" replace />} />
            <Route path="registro" element={<RegistroPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="mensalistas" element={<CadastroMensalistasPage />} />
            <Route path="monitoramento" element={<MonitoramentoPage />} />
            <Route
              path="relatorio"
              element={<AdminRoute> <RelatorioPage /> </AdminRoute>}
            />
            <Route
              path="configuracao"
              element={<AdminRoute> <ConfiguracaoPage /> </AdminRoute>}
            />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
