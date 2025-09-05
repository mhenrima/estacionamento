// src/pages/RelatorioPage.tsx
import { useEffect, useState } from "react";
import { DollarSign, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

// Interface para os dados do relatório
interface DailyReport {
    date: string;
    entries: number;
    exits: number;
    revenue: number;
}

// Função para formatar data (ex: 05/09/2025)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
};

// Função para formatar moeda (ex: R$ 50,00)
const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function RelatorioPage() {
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await fetch(`${API_BASE_URL}/reports/daily-summary`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Falha ao buscar relatórios. Acesso negado ou erro no servidor.');
                }
                const data = await response.json();
                setReports(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, []);

    if (loading) {
        return <div>Carregando relatórios...</div>;
    }

    if (error) {
        return <div className="text-red-600">Erro: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatório Diário de Movimentações</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entradas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saídas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faturamento</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Nenhuma movimentação registrada.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.date}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{formatDate(report.date)}</td>

                                        {/* --- CÓDIGO CORRIGIDO ABAIXO --- */}
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            <div className="flex items-center">
                                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
                                                {report.entries}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            <div className="flex items-center">
                                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-2" />
                                                {report.exits}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
                                            <div className="flex items-center">
                                                <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                                                {formatCurrency(report.revenue)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}