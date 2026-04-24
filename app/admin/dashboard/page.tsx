import { 
  ShoppingBag, 
  Clock, 
  Euro, 
  Users 
} from 'lucide-react';
import { getAdminDashboardData, getClientes } from '@/app/actions/admin';
import ProcesarCompraModal from '@/components/admin/ProcesarCompraModal';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [data, clientes] = await Promise.all([
    getAdminDashboardData(),
    getClientes()
  ]);

  const metricas = [
    { name: 'Compras hoy', value: data.metrics.comprasHoy.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pendientes', value: data.metrics.pendientes.toString(), icon: Clock, color: 'text-warning', bg: 'bg-warning-light' },
    { name: 'Facturado hoy', value: `${data.metrics.facturadoHoy.toFixed(2)} €`, icon: Euro, color: 'text-accent', bg: 'bg-accent-light' },
    { name: 'Clientes', value: data.metrics.clientes.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-neutral-900">Panel de control</h2>
          <p className="text-neutral-400 mt-1">Estado general del negocio en tiempo real</p>
        </div>
        <div className="text-sm font-semibold text-neutral-400 bg-neutral-100 px-4 py-2 rounded-full">
          {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="card p-6 flex items-center gap-5 border-none shadow-sm">
              <div className={`w-12 h-12 rounded-lg ${m.bg} ${m.color} flex items-center justify-center`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{m.name}</p>
                <p className="text-2xl font-bold text-neutral-900">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla de Pendientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading text-neutral-900">Compras pendientes de procesar</h3>
          <button className="text-sm font-bold text-drc-light hover:underline">Ver todas</button>
        </div>

        <div className="card p-0 overflow-hidden border-neutral-100 shadow-sm bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Trabajador</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.pendientes.length > 0 ? (
                data.pendientes.map((p: any) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {p.profiles?.nombre || 'Desconocido'}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {p.productos?.nombre || 'Producto'}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">
                      {p.cantidad_kg} kg
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-xs">
                      {new Date(p.created_at).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProcesarCompraModal compra={p} clientes={clientes} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-400 italic">
                    No hay compras pendientes de procesar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
