import { useState, type FormEvent } from "react";
import { LogIn } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

interface Props {
    onEntrySuccess: () => void;
}

export function RegistroEntradaForm({ onEntrySuccess }: Props) {
    const [plate, setPlate] = useState('');
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    async function handleRegisterEntry(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFeedback({ message: '', isError: false });

        try {
            const response = await fetch(`${API_BASE_URL}/records/entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plate }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro desconhecido.');

            setFeedback({ message: `Entrada do veículo ${plate.toUpperCase()} registrada!`, isError: false });
            setPlate('');
            onEntrySuccess();
        } catch (error: any) {
            setFeedback({ message: error.message, isError: true });
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Registrar Nova Entrada</h2>
            <form onSubmit={handleRegisterEntry} className="flex items-center gap-4">
                <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="Digite a placa (ex: ABC1D23)"
                    maxLength={7}
                    required
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                <button type="submit" className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700">
                    <LogIn size={18} className="mr-2" />
                    Registrar
                </button>
            </form>
            {feedback.message && (
                <p className={`mt-3 text-sm ${feedback.isError ? 'text-red-600' : 'text-green-600'}`}>
                    {feedback.message}
                </p>
            )}
        </div>
    );
}