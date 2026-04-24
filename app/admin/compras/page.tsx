import { getComprasAnalytics } from '@/app/actions/admin';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  User,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default async function ComprasAdminPage() {
  const data = await getComprasAnalytics();

  if (!data) return (
    <div className="flex items-center justify-center h-64 text-neutral-400">
      Error al cargar analíticas
    </div>
  );

  const stats = [
    { name: 'Inversión Total', value: `${data.stats.totalInversion.toFixed(2)} €`, icon: Wallet, color: 'text-neutral-900', bg: 'bg-neutral-50' },
    { name: 'Ventas (PVP)', value: `${data.stats.totalVentas.toFixed(2)} €`, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent-light' },
    { name: 'Beneficio Est.', value: `${data.stats.beneficio.toFixed(2)} €`, icon: ArrowUpRight, color: 'text-drc-light', bg: 'bg-drc-light/10' },
    { name: 'Margen Medio', value: `${data.stats.margenMedio.toFixed(1)}%`, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading text-neutral-900">Analítica de Compras</h2>
        <p className="text-neutral-400 mt-1">Análisis de rentabilidad, márgenes y volumen de adquisición</p>
      </div>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.name} className="card p-6 border-none shadow-sm bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{s.name}</p>
            <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Listado de Compras con Margen */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading text-neutral-900">Registro Histórico y Rentabilidad</h3>
        
        <div className="card p-0 overflow-hidden border-neutral-100 shadow-sm bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Fecha / Trabajador</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Producto / Cantidad</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Costo Compra</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider">Venta (PVP)</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-wider text-right">Margen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.compras.map((c: any) => {
                const costoTotal = Number(c.cantidad_kg) * Number(c.precio_compra);
                const venta = c.ventas?.[0];
                const pvp = venta ? Number(venta.pvp) : 0;
                const margen = pvp - costoTotal;
                const porcentaje = pvp > 0 ? (margen / pvp) * 100 : 0;

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">
                          {new Date(c.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1 uppercase font-bold">
                          <User size={10} /> {c.profiles?.nombre?.split(' ')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">{c.productos?.nombre}</span>
                        <span className="text-xs text-neutral-400">{c.cantidad_kg} kg</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">{costoTotal.toFixed(2)} €</span>
                        <span className="text-[10px] text-neutral-400">{c.precio_compra} €/kg</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {venta ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-accent">{pvp.toFixed(2)} €</span>
                          <span className="text-[10px] text-accent-dark flex items-center gap-1 font-bold uppercase">
                            <CheckCircle2 size={10} /> Procesada
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-warning flex items-center gap-1 uppercase">
                          <Clock size={12} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {venta ? (
                        <div className="flex flex-col items-end">
                          <span className={`font-bold flex items-center gap-1 ${margen >= 0 ? 'text-drc-light' : 'text-danger'}`}>
                            {margen >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {margen.toFixed(2)} €
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400">
                            {porcentaje.toFixed(1)}% margen
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-300 italic">No disponible</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
