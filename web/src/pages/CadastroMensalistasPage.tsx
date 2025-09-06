// src/pages/CadastroMensalistasPage.tsx
import { useEffect, useState, type FormEvent } from "react";

const API_BASE_URL = 'http://localhost:3000/api';

interface MonthlyParker {
    id: string;
    name: string;
    document: string;
    planStartDate: string;
    status: 'active' | 'inactive' | 'expired';
    vehicle: {
        plate: string;
        model: string;
        color: string;
    }
}

export function CadastroMensalistasPage() {
    const [parkers, setParkers] = useState<MonthlyParker[]>([]);
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    async function fetchParkers() {
        try {
            const response = await fetch(`${API_BASE_URL}/monthly-parkers`, { credentials: 'include' });
            if (!response.ok) throw new Error("Falha ao buscar mensalistas.");
            const data = await response.json();
            setParkers(data);
        } catch (error: any) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchParkers();
    }, []);

    async function handleCreateParker(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE_URL}/monthly-parkers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Erro desconhecido.');

            setFeedback({ message: 'Mensalista cadastrado com sucesso!', isError: false });
            form.reset();
            fetchParkers(); // Atualiza a lista
        } catch (error: any) {
            setFeedback({ message: error.message, isError: true });
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Cadastro de Mensalistas</h1>

            {/* Formulário de Cadastro */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Novo Mensalista</h2>
                <form onSubmit={handleCreateParker} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Nome Completo" required className="px-3 py-2 border rounded-md" />
                    <input name="document" placeholder="CPF/Documento" required className="px-3 py-2 border rounded-md" />
                    <input name="email" type="email" placeholder="E-mail (opcional)" className="px-3 py-2 border rounded-md" />
                    <input name="phone" placeholder="Telefone (opcional)" className="px-3 py-2 border rounded-md" />
                    <input name="plate" placeholder="Placa do Veículo" required className="px-3 py-2 border rounded-md" />
                    <div>
                        <label className="text-sm text-gray-600">Início do Plano</label>
                        <input name="planStartDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <button type="submit" className="md:col-span-2 py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700">
                        Cadastrar Mensalista
                    </button>
                    {feedback.message && (
                        <p className={`md:col-span-2 text-sm ${feedback.isError ? 'text-red-600' : 'text-green-600'}`}>
                            {feedback.message}
                        </p>
                    )}
                </form>
            </div>

            {/* Lista de Mensalistas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Mensalistas Cadastrados</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Veículo (Placa)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {parkers.map(parker => (
                                <tr key={parker.id}>
                                    <td className="px-4 py-2 whitespace-nowrap">{parker.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{parker.document}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{parker.vehicle.plate}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parker.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {parker.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}