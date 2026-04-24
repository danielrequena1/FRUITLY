'use client';

import { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Download, 
  Mail,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { marcarVentaComoEnviada } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function FacturasList({ ventas }: { ventas: any[] }) {
  const [filter, setFilter] = useState<'pendientes' | 'enviadas'>('pendientes');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const filteredVentas = ventas.filter(v => 
    filter === 'pendientes' ? !v.enviada : v.enviada
  );

  const handleMarcarEnviada = async (id: string) => {
    setLoadingId(id);
    const res = await marcarVentaComoEnviada(id);
    if (res.success) {
      router.refresh();
    } else {
      alert('Error: ' + res.error);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Tabs de Filtro */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setFilter('pendientes')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            filter === 'pendientes' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Pendientes de enviar ({ventas.filter(v => !v.enviada).length})
        </button>
        <button
          onClick={() => setFilter('enviadas')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            filter === 'enviadas' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Enviadas ({ventas.filter(v => v.enviada).length})
        </button>
      </div>

      {/* Lista de Facturas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVentas.length > 0 ? (
          filteredVentas.map((v) => (
            <div key={v.id} className="card p-0 overflow-hidden bg-white border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.enviada ? 'bg-accent-light text-accent' : 'bg-warning-light text-warning'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 leading-none mb-1">
                      Factura #{v.id.split('-')[0].toUpperCase()}
                    </h4>
                    <p className="text-xs text-neutral-400 font-medium">
                      Cliente: <span className="text-neutral-600 font-bold">{v.clientes?.nombre}</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-neutral-900">
                    {(Number(v.pvp) * (1 + v.tipo_iva / 100)).toFixed(2)} €
                  </div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">IVA incl. ({v.tipo_iva}%)</p>
                </div>
              </div>

              <div className="px-5 py-3 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <Clock size={14} className="text-neutral-300" />
                    {new Date(v.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    {v.compras?.productos?.nombre}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-neutral-400 hover:text-drc-light hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 transition-all shadow-sm bg-white/50">
                    <Download size={18} />
                  </button>
                  {!v.enviada ? (
                    <button 
                      onClick={() => handleMarcarEnviada(v.id)}
                      disabled={loadingId === v.id}
                      className="flex items-center gap-2 bg-drc-deep text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#242775] transition-all"
                    >
                      {loadingId === v.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
                      Enviar Correo
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-accent px-4 py-1.5 rounded-lg text-xs font-bold bg-accent-light">
                      <CheckCircle2 size={14} />
                      Enviada
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <FileText className="text-neutral-100 mb-4" size={64} />
            <p className="text-neutral-400 italic">No hay facturas en esta sección</p>
          </div>
        )}
      </div>
    </div>
  );
}
