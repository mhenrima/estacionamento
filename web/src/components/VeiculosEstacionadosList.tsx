// src/components/VeiculosEstacionadosList.tsx
import { LogOut } from "lucide-react";
import type { ActiveRecord } from "../pages/RegistroPage";

const API_BASE_URL = 'http://localhost:3000';

interface Props {
    records: ActiveRecord[];
    onExitSuccess: () => void;
}

export function VeiculosEstacionadosList({ records, onExitSuccess }: Props) {

    async function handleRegisterExit(plate: string) {
        if (!confirm(`Deseja confirmar a saída do veículo de placa ${plate}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/records/exit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plate }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro desconhecido.');

            alert(`Saída do veículo ${plate.toUpperCase()} registrada com sucesso!`);
            onExitSuccess();
        } catch (error: any) {
            alert(`Falha ao registrar saída: ${error.message}`);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Veículos no Pátio ({records.length})</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Modelo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    Nenhum veículo no estacionamento no momento.
                                </td>
                            </tr>
                        )}
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-semibold text-gray-900">{record.vehicle.plate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.vehicle.brand} / {record.vehicle.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(record.entryAt).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button onClick={() => handleRegisterExit(record.vehicle.plate)} className="flex items-center ml-auto px-3 py-1 bg-red-100 text-red-700 font-medium rounded-md hover:bg-red-200 text-sm">
                                        <LogOut size={14} className="mr-1.5" />
                                        Registrar Saída
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}