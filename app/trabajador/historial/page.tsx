import { getHistoricoCompras, getProductos } from '@/app/actions/compras';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShoppingBag, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function HistorialPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [compras, productos] = await Promise.all([
    getHistoricoCompras(user.id),
    getProductos()
  ]);

  // Agrupar compras por fecha
  const comprasAgrupadas = compras.reduce((acc: any, compra) => {
    const fecha = new Date(compra.created_at).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(compra);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/trabajador/dashboard" className="p-2 -ml-2 text-neutral-400">
          <ChevronRight className="rotate-180" size={24} />
        </Link>
        <h2 className="text-2xl font-heading text-neutral-900">Mi Historial</h2>
      </div>

      {Object.keys(comprasAgrupadas).length > 0 ? (
        Object.entries(comprasAgrupadas).map(([fecha, items]: [string, any]) => (
          <div key={fecha} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">
              <Calendar size={14} />
              {fecha}
            </div>
            
            <div className="space-y-3">
              {items.map((compra: any) => (
                <div key={compra.id} className="card p-4 flex items-center justify-between bg-white border-neutral-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {productos.find(p => p.id === compra.producto_id)?.nombre || 'Producto'}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {new Date(compra.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {compra.cantidad_kg} kg
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-neutral-900">
                      {(Number(compra.cantidad_kg) * Number(compra.precio_compra)).toFixed(2)} €
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-tighter ${
                      compra.estado === 'pendiente' ? 'text-warning' : 
                      compra.estado === 'completada' ? 'text-accent' : 'text-danger'
                    }`}>
                      {compra.estado}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 card bg-white border-dashed border-2">
          <ShoppingBag className="mx-auto text-neutral-200 mb-4" size={48} />
          <p className="text-neutral-400 italic">No tienes compras registradas aún</p>
          <Link href="/trabajador/dashboard" className="text-drc-light font-bold text-sm mt-4 block">
            Registrar mi primera compra
          </Link>
        </div>
      )}
    </div>
  );
}
