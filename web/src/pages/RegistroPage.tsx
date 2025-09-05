import { useEffect, useState } from 'react';
import { VeiculosEstacionadosList } from '../components/VeiculosEstacionadosList';
import { RegistroEntradaForm } from '../components/RegistroEntradaForm';

const API_BASE_URL = 'http://localhost:3000';

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

    useEffect(() => {
        fetchActiveRecords();
    }, []);

    const handleRecordUpdate = () => {
        fetchActiveRecords();
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Registro de Entrada e Saída</h1>
                <p className="text-gray-600 mt-1">Gerencie o fluxo de veículos no estacionamento.</p>
            </div>

            <RegistroEntradaForm onEntrySuccess={handleRecordUpdate} />

            <VeiculosEstacionadosList records={activeRecords} onExitSuccess={handleRecordUpdate} />
        </div>
    );
}