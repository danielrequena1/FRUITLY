'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { marcarVentaComoPagada } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function MarcarPagadaButton({ ventaId }: { ventaId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarcarPagada = async () => {
    if (!confirm('¿Marcar esta factura como cobrada?')) return;
    
    setLoading(true);
    const res = await marcarVentaComoPagada(ventaId);
    if (res.success) {
      router.refresh();
    } else {
      alert('Error al actualizar');
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleMarcarPagada}
      disabled={loading}
      className="p-2 text-neutral-400 hover:text-accent hover:bg-accent-light rounded-lg transition-all"
      title="Marcar como cobrada"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />}
    </button>
  );
}
