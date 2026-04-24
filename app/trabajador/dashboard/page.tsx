import { createClient } from '@/lib/supabase/server';
import { getProductos, getComprasHoy } from '@/app/actions/compras';
import RegistrarCompraSheet from '@/components/trabajador/RegistrarCompraSheet';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TrabajadorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre')
    .eq('id', user?.id)
    .single();

  const productos = await getProductos();
  const comprasHoyReal = await getComprasHoy(user?.id || '');

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <div>
        <h2 className="text-2xl font-heading text-neutral-900">
          Buenos días, {profile?.nombre?.split(' ')[0] || 'Trabajador'}
        </h2>
        <p className="text-neutral-400 text-sm italic">Listo para la jornada de hoy</p>
      </div>

      {/* Métricas rápidas */}
      <div className="card flex flex-col items-center justify-center py-8 shadow-sm border-none bg-white">
        <span className="text-6xl font-bold text-accent mb-1">
          {comprasHoyReal.length.toString().padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Compras hoy</span>
      </div>

      {/* Acción Principal - ESTO ES LO QUE NO FUNCIONABA ANTES */}
      <RegistrarCompraSheet productos={productos} />

      {/* Historial Reciente */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Últimas compras</h3>
          <Link href="/trabajador/historial" className="text-xs font-bold text-drc-light uppercase tracking-wider">
            Ver todo
          </Link>
        </div>

        <div className="space-y-3">
          {comprasHoyReal.length > 0 ? (
            comprasHoyReal.slice(0, 5).map((compra) => (
              <div key={compra.id} className="card p-4 flex items-center justify-between bg-white border-neutral-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent">
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
                <div className="font-bold text-neutral-900">
                  {(Number(compra.cantidad_kg) * Number(compra.precio_compra)).toFixed(2)} €
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 card bg-neutral-50 border-dashed border-2">
              <p className="text-sm text-neutral-400 italic">No has registrado compras todavía</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
