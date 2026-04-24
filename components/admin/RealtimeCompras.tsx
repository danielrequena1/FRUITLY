'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  initialCompras: any[];
}

export default function RealtimeCompras({ initialCompras }: Props) {
  const [compras, setCompras] = useState(initialCompras);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'compras',
        },
        () => {
          // Simplificamos: refrescamos via router para obtener los joins actualizados
          router.refresh();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  useEffect(() => {
    setCompras(initialCompras);
  }, [initialCompras]);

  if (compras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400 space-y-4">
        <div className="p-4 bg-success-light rounded-full text-success">
          <CheckCircle size={48} strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-neutral-900">Todo procesado por hoy</p>
          <p className="text-xs">No hay compras pendientes de revisión</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          {compras.length} registros encontrados
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-neutral-300'}`} />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {isConnected ? 'En vivo' : 'Desconectado'}
          </span>
        </div>
      </div>
      
      <table className="w-full text-left">
        <thead className="bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Trabajador</th>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4">Cantidad</th>
            <th className="px-6 py-4">Precio Compra</th>
            <th className="px-6 py-4">Hora</th>
            <th className="px-6 py-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {compras.map((compra) => (
            <tr key={compra.id} className="hover:bg-neutral-50 transition-colors group">
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-neutral-900">{compra.profiles?.nombre}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-600">{compra.productos?.nombre}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-neutral-900">{compra.cantidad_kg} kg</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-600">{compra.precio_compra} €/kg</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-neutral-400 font-medium">
                  {new Date(compra.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => router.push(`/admin/compras/${compra.id}`)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold text-drc-deep bg-drc-deep/5 hover:bg-drc-deep hover:text-white transition-all"
                >
                  Procesar <ArrowRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
