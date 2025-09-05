
import { useState, type FormEvent } from "react";

const API_BASE_URL = 'http://localhost:3000';

export function ConfiguracaoPage() {
    const [totalSpots, setTotalSpots] = useState('');
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    async function handleConfigure(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFeedback({ message: '', isError: false });
        try {
            const response = await fetch(`${API_BASE_URL}/spots/configure`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalSpots: Number(totalSpots) }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro desconhecido.');
            setFeedback({ message: data.message, isError: false });
        } catch (error: any) {
            setFeedback({ message: error.message, isError: true });
        }
    }

    return (
        <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-gray-800">Configuração do Estacionamento</h1>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleConfigure}>
                    <label htmlFor="totalSpots" className="block text-sm font-medium text-gray-700">
                        Número Total de Vagas
                    </label>
                    <input
                        type="number"
                        id="totalSpots"
                        value={totalSpots}
                        onChange={(e) => setTotalSpots(e.target.value)}
                        min="1"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button type="submit" className="mt-4 w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700">
                        Salvar e Recriar Vagas
                    </button>
                    {feedback.message && (
                        <p className={`mt-3 text-sm ${feedback.isError ? 'text-red-600' : 'text-green-600'}`}>
                            {feedback.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}