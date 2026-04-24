'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Producto } from '@/lib/supabase/types';
import { registrarCompra } from '@/app/actions/compras';

interface Props {
  productos: Producto[];
}

export default function RegistrarCompraSheet({ productos }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad_kg: '',
    precio_compra: '',
    notas: ''
  });

  const total = Number(formData.cantidad_kg) * Number(formData.precio_compra);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.producto_id || !formData.cantidad_kg || !formData.precio_compra) return;

    setLoading(true);
    const res = await registrarCompra({
      producto_id: formData.producto_id,
      cantidad_kg: Number(formData.cantidad_kg),
      precio_compra: Number(formData.precio_compra),
      notas: formData.notas
    });

    if (res.success) {
      setFormData({ producto_id: '', cantidad_kg: '', precio_compra: '', notas: '' });
      setIsOpen(false);
    } else {
      alert('Error: ' + res.error);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Botón Principal - Siempre visible */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary w-full h-16 text-lg gap-3 shadow-lg shadow-drc-deep/20"
      >
        <Plus size={24} />
        Registrar compra
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => !loading && setIsOpen(false)}
        />
      )}

      {/* Sheet */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 z-[101] 
        transition-transform duration-300 ease-out shadow-2xl
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6" />
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading text-neutral-900">Nueva compra</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Producto</label>
            <select
              className="input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2394A3B8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
              value={formData.producto_id}
              onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
              required
            >
              <option value="">Selecciona un producto...</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Cantidad (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="input"
                placeholder="0.00"
                value={formData.cantidad_kg}
                onChange={(e) => setFormData({ ...formData, cantidad_kg: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Precio (€/kg)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input"
                placeholder="0.00"
                value={formData.precio_compra}
                onChange={(e) => setFormData({ ...formData, precio_compra: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Notas (opcional)</label>
            <textarea
              className="input min-h-[80px]"
              placeholder="Calidad, proveedor, observaciones..."
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            />
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm font-semibold text-neutral-400">Resumen total</span>
            <span className="text-xl font-bold text-drc-deep">
              {total.toFixed(2)} €
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-14 text-lg gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Confirmar registro'
            )}
          </button>
        </form>
      </div>
    </>
  );
}
