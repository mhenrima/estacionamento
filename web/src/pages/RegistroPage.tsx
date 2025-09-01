// src/pages/RegistroPage.tsx
import { useEffect, useState } from 'react';
import { VeiculosEstacionadosList } from '../components/VeiculosEstacionadosList';
import { RegistroEntradaForm } from '../components/RegistroEntradaForm';

const API_BASE_URL = 'http://localhost:3000';

// Definimos o tipo de dado que esperamos do backend
export interface ActiveRecord {
    id: string;
    entryAt: string;
    vehicle: {
        plate: string;
        brand: string;
        model: string;
    };
}

export function RegistroPage() {
    const [activeRecords, setActiveRecords] = useState<ActiveRecord[]>([]);
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    // Função para buscar os dados do backend
    const fetchActiveRecords = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/records/active`);
            if (!response.ok) throw new Error('Falha ao buscar veículos.');
            const data = await response.json();
            setActiveRecords(data);
        } catch (error: any) {
            setFeedback({ message: error.message, isError: true });
        }
    };

    // Busca os dados assim que o componente é montado
    useEffect(() => {
        fetchActiveRecords();
    }, []);

    // Função que será chamada pelos componentes filhos para atualizar a lista
    const handleRecordUpdate = () => {
        fetchActiveRecords();
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Registro de Entrada e Saída</h1>
                <p className="text-gray-600 mt-1">Gerencie o fluxo de veículos no estacionamento.</p>
            </div>

            {/* Formulário para registrar novas entradas */}
            <RegistroEntradaForm onEntrySuccess={handleRecordUpdate} />

            {/* Lista de veículos que já estão no pátio */}
            <VeiculosEstacionadosList records={activeRecords} onExitSuccess={handleRecordUpdate} />
        </div>
    );
}