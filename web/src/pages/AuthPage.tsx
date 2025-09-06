import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { LandPlot } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

export function AuthPage() {
    const { refetchUser } = useUser();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    function showFeedback(message: string, isError = false) {
        setFeedback({ message, isError });
    }

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        showFeedback('', false);
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao registrar.');
            }

            showFeedback('Conta criada com sucesso! Por favor, faça o login.');
            setIsRegistering(false);
        } catch (error: any) {
            showFeedback(error.message, true);
        }
    }

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        showFeedback('', false);
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE_URL}/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas.');
            }

            await refetchUser();
            navigate('/dashboard');

        } catch (error: any) {
            showFeedback(error.message, true);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="flex items-center justify-center mx-auto w-16 h-16 bg-purple-100 rounded-full">
                        <LandPlot className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Sistema de Estacionamento
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Faça login ou crie sua conta
                    </p>
                </div>

                {feedback.message && (
                    <div className={`text-center text-sm p-2 rounded-md ${feedback.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {feedback.message}
                    </div>
                )}

                {isRegistering ? (
                    <form onSubmit={handleRegister} className="mt-8 space-y-6">
                        <div className="space-y-4 rounded-md shadow-sm">
                            <input name="name" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Nome completo" />
                            <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Endereço de e-mail" />
                            <input name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Senha (mínimo 6 caracteres)" />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            Criar Conta
                        </button>
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => setIsRegistering(false)} className="font-medium text-purple-600 hover:text-purple-500 bg-transparent border-none p-0 cursor-pointer">
                                Já tem uma conta? Faça o login!
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4 rounded-md shadow-sm">
                            <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Endereço de e-mail" />
                            <input name="password" type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Senha" />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            Entrar
                        </button>
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => setIsRegistering(true)} className="font-medium text-purple-600 hover:text-purple-500 bg-transparent border-none p-0 cursor-pointer">
                                Não tem uma conta? Crie uma agora!
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}