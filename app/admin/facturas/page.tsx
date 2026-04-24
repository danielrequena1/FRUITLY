import { getVentas } from '@/app/actions/admin';
import FacturasList from '@/components/admin/FacturasList';
import { Search, Filter, DownloadCloud } from 'lucide-react';

export default async function FacturasPage() {
  const ventas = await getVentas();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-heading text-neutral-900">Facturación</h2>
          <p className="text-neutral-400 mt-1">Control de ventas, envíos y generación de documentos fiscales</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <DownloadCloud size={18} />
          Exportar Excel
        </button>
      </div>

      {/* Buscador y Acciones Rápidas */}
      <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por Nº de factura, cliente o producto..." 
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 rounded-md text-sm font-semibold text-neutral-600 flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all">
            <Filter size={16} />
            Filtrar por Fecha
          </button>
        </div>
      </div>

      {/* Componente de Lista (Client Component) */}
      <FacturasList ventas={ventas} />
    </div>
  );
}
