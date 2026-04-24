import { getClientes } from '@/app/actions/admin';
import NuevoClienteModal from '@/components/admin/NuevoClienteModal';
import { Mail, Phone, MapPin, Building2, Search, Users } from 'lucide-react';

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-neutral-900">Clientes</h2>
          <p className="text-neutral-400 mt-1">Gestión de cartera de clientes y datos fiscales</p>
        </div>
        <NuevoClienteModal />
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-neutral-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, NIF o email..." 
            className="input pl-10 w-full"
          />
        </div>
        <div className="text-sm text-neutral-400 font-medium">
          Total: <span className="text-neutral-900 font-bold">{clientes.length}</span> clientes
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {clientes.length > 0 ? (
          clientes.map((c) => (
            <div key={c.id} className="card p-6 bg-white border-none shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent-light text-accent flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-accent transition-colors">
                      {c.nombre}
                    </h3>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      NIF: {c.nif}
                    </span>
                  </div>
                </div>
                <button className="text-xs font-bold text-drc-light uppercase tracking-widest hover:underline">
                  Ver Detalles
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail size={16} className="text-neutral-400" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone size={16} className="text-neutral-400" />
                  <span>{c.telefono || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 md:col-span-2">
                  <MapPin size={16} className="text-neutral-400 shrink-0" />
                  <span className="line-clamp-1">{c.direccion}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 card bg-neutral-50 border-dashed border-2 flex flex-col items-center justify-center text-center">
            <Users className="text-neutral-200 mb-4" size={64} />
            <h4 className="text-lg font-bold text-neutral-900">No hay clientes registrados</h4>
            <p className="text-neutral-400 max-w-xs mx-auto mt-2">
              Comienza añadiendo tu primer cliente para poder emitir facturas y gestionar ventas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
