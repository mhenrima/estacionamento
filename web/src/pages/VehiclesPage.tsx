import { useState, useEffect, type FormEvent } from "react";
import { Car } from "lucide-react";

const FIPE_API_URL = 'https://parallelum.com.br/fipe/api/v1/carros';
const API_BASE_URL = 'http://localhost:3000/api';

// Tipagem para os dados que virão da API FIPE
interface FipeData {
    codigo: string;
    nome: string;
}

export function VehiclesPage() {
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    // --- NOVOS ESTADOS PARA A API FIPE ---
    const [marcas, setMarcas] = useState<FipeData[]>([]);
    const [modelos, setModelos] = useState<FipeData[]>([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    // ------------------------------------

    // --- NOVOS EFEITOS PARA BUSCAR OS DADOS ---
    // Efeito para buscar as marcas quando o componente é montado
    useEffect(() => {
        fetch(`${FIPE_API_URL}/marcas`)
            .then(res => res.json())
            .then(data => setMarcas(data))
            .catch(err => console.error("Falha ao buscar marcas:", err));
    }, []); // Array vazio garante que rode apenas uma vez

    // Efeito para buscar os modelos sempre que uma nova marca for selecionada
    useEffect(() => {
        if (marcaSelecionada) {
            setModelos([]); // Limpa a lista de modelos antigos
            fetch(`${FIPE_API_URL}/marcas/${marcaSelecionada}/modelos`)
                .then(res => res.json())
                .then(data => setModelos(data.modelos))
                .catch(err => console.error("Falha ao buscar modelos:", err));
        } else {
            setModelos([]); // Garante que a lista de modelos esteja vazia se nenhuma marca for selecionada
        }
    }, [marcaSelecionada]); // Este efeito depende do estado 'marcaSelecionada'
    // ------------------------------------------

    async function handleCreateVehicle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFeedback({ message: '', isError: false });

        // -> CORREÇÃO AQUI (1/3): Salva a referência do formulário antes do 'await'
        const form = event.currentTarget;

        // -> CORREÇÃO AQUI (2/3): Usa a referência salva
        const formData = new FormData(form);

        const brandCode = formData.get('brand_code');
        const selectedBrand = marcas.find(marca => marca.codigo === brandCode);

        const payload = {
            brand: selectedBrand ? selectedBrand.nome : '', // Envia o nome da marca
            model: formData.get('model') as string,
            year: Number(formData.get('year')),
            color: formData.get('color') as string,
            plate: formData.get('plate') as string,
        };

        try {
            // Note que removi o 'credentials: include' pois você removeu a autenticação do backend
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao cadastrar veículo.');
            }

            setFeedback({ message: 'Veículo cadastrado com sucesso!', isError: false });

            // -> CORREÇÃO AQUI (3/3): Usa a referência salva para limpar o formulário
            form.reset();

            setMarcaSelecionada(''); // Limpa a seleção da marca após o sucesso
        } catch (error: any) {
            setFeedback({ message: error.message, isError: true });
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Cadastro de Veículos
                </h1>

                <form onSubmit={handleCreateVehicle} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* --- CAMPO MARCA (AGORA É UM SELECT) --- */}
                        <div>
                            <label htmlFor="brand_code" className="block text-sm font-medium text-gray-700">Marca</label>
                            <select
                                id="brand_code"
                                name="brand_code"
                                value={marcaSelecionada}
                                onChange={(e) => setMarcaSelecionada(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Selecione a marca</option>
                                {marcas.map(marca => (
                                    <option key={marca.codigo} value={marca.codigo}>
                                        {marca.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* --- CAMPO MODELO (AGORA É UM SELECT) --- */}
                        <div>
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                            <select
                                id="model"
                                name="model"
                                required
                                disabled={!marcaSelecionada || modelos.length === 0}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                            >
                                <option value="">Selecione o modelo</option>
                                {modelos.map(modelo => (
                                    <option key={modelo.codigo} value={modelo.nome}>
                                        {modelo.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Campos restantes continuam iguais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Ano</label>
                            <input id="year" name="year" type="number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Cor</label>
                            <input id="color" name="color" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="plate" className="block text-sm font-medium text-gray-700">Placa</label>
                        <input id="plate" name="plate" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="ABC1D23" />
                    </div>

                    {feedback.message && (
                        <div className={`text-center text-sm p-2 rounded-md ${feedback.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {feedback.message}
                        </div>
                    )}

                    <div className="pt-2">
                        <button type="submit" className="w-full flex justify-center items-center py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700">
                            <Car size={18} className="mr-2" />
                            Cadastrar Veículo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}