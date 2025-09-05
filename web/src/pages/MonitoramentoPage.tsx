
import { useEffect, useState } from "react";
import { Car } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

interface SpotStatus {
    id: string;
    code: string;
    status: 'available' | 'occupied';
    plate: string | null;
}

export function MonitoramentoPage() {
    const [spots, setSpots] = useState<SpotStatus[]>([]);

    useEffect(() => {
        const fetchSpots = async () => {
            const response = await fetch(`${API_BASE_URL}/spots/status`);
            const data = await response.json();
            setSpots(data);
        };
        fetchSpots();
        const interval = setInterval(fetchSpots, 10000);
        return () => clearInterval(interval);
    }, []);

    const availableSpots = spots.filter(s => s.status === 'available').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Monitoramento de Vagas</h1>
                <div className="text-lg">
                    <span className="font-bold text-green-600">{availableSpots}</span>
                    <span className="text-gray-600">/{spots.length} vagas livres</span>
                </div>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-15 gap-4">
                {spots.map(spot => (
                    <div
                        key={spot.id}
                        className={`p-3 rounded-lg shadow aspect-square flex flex-col justify-center items-center
                                    ${spot.status === 'available'
                                ? 'bg-green-100 border-green-300'
                                : 'bg-red-100 border-red-300'
                            }`}
                    >
                        <span className="font-bold text-lg text-gray-700">{spot.code}</span>
                        {spot.status === 'occupied' && (
                            <>
                                <Car className="my-1 text-red-600" size={24} />
                                <span className="text-xs font-mono text-red-800">{spot.plate}</span>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}