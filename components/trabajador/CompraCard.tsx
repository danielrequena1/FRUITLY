import { Compra, Producto } from '@/lib/supabase/types';
import { Apple, Package, Clock } from 'lucide-react';

interface Props {
  compra: Compra;
  productos: Producto[];
}

export default function CompraCard({ compra, productos }: Props) {
  const producto = productos.find(p => p.id === compra.producto_id);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pendiente': return 'badge-pendiente';
      case 'completada': return 'badge-completada';
      case 'cancelada': return 'badge-cancelada';
      default: return '';
    }
  };

  return (
    <div className="card bg-white flex items-center gap-4 p-4 hover:border-drc-light/30 transition-colors">
      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 shrink-0">
        <Package size={24} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-bold text-neutral-900 truncate">
            {producto?.nombre || 'Producto'}
          </h4>
          <span className={`badge ${getStatusClass(compra.estado)} shrink-0`}>
            {compra.estado}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span className="font-medium">{compra.cantidad_kg} kg</span>
          <span className="text-neutral-200">|</span>
          <span>{compra.precio_compra} €/kg</span>
        </div>
        
        <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
          <Clock size={10} />
          {formatDate(compra.created_at)}
        </div>
      </div>
    </div>
  );
}
