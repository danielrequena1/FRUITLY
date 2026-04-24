'use client';

import { useState } from 'react';
import { 
  X, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Calculator,
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import { procesarCompra } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';
import { Cliente } from '@/lib/supabase/types';

interface Props {
  compra: any;
  clientes: Cliente[];
}

export default function ProcesarCompraModal({ compra, clientes }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    pvp: '',
    tipo_iva: 4,
    cliente_id: ''
  });

  const selectedCliente = clientes.find(c => c.id === formData.cliente_id);
  const subtotal = Number(formData.pvp) || 0;
  const iva = (subtotal * Number(formData.tipo_iva)) / 100;
  const total = subtotal + iva;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await procesarCompra({
      compra_id: compra.id,
      cliente_id: formData.cliente_id,
      pvp: subtotal,
      tipo_iva: Number(formData.tipo_iva)
    });

    if (res.success) {
      setIsOpen(false);
      setStep(1);
      router.refresh();
    } else {
      alert('Error al procesar: ' + res.error);
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold text-accent hover:text-accent-dark uppercase tracking-widest border border-accent/20 px-3 py-1.5 rounded hover:bg-accent-light transition-all"
      >
        Procesar
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header con Steps */}
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-accent text-white' : 'bg-neutral-200'}`}>1</div>
                <div className={`h-px w-6 ${step >= 2 ? 'bg-accent' : 'bg-neutral-200'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-accent text-white' : 'bg-neutral-200'}`}>2</div>
                <div className={`h-px w-6 ${step >= 3 ? 'bg-accent' : 'bg-neutral-200'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-accent text-white' : 'bg-neutral-200'}`}>3</div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {/* PASO 1: Precio e IVA */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Calculator className="text-accent" size={24} />
                    <h3 className="text-xl font-heading text-neutral-900">Importe de Venta</h3>
                  </div>
                  <p className="text-sm text-neutral-400">Indica el precio de venta (Base Imponible) y el tipo de IVA aplicable para este género.</p>
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="label">Precio de Venta (Base Imponible €)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="input text-lg font-bold" 
                        placeholder="0.00"
                        value={formData.pvp}
                        onChange={e => setFormData({...formData, pvp: e.target.value})}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="label">Tipo de IVA (%)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[4, 10, 21].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setFormData({...formData, tipo_iva: val})}
                            className={`py-2 rounded-lg border-2 font-bold transition-all ${
                              formData.tipo_iva === val 
                                ? 'border-accent bg-accent-light text-accent-dark' 
                                : 'border-neutral-100 bg-neutral-50 text-neutral-400'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: Cliente */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCircle className="text-accent" size={24} />
                    <h3 className="text-xl font-heading text-neutral-900">Vincular Cliente</h3>
                  </div>
                  <p className="text-sm text-neutral-400">Selecciona el cliente final al que se le facturará esta venta.</p>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="label">Seleccionar Cliente</label>
                      <select 
                        className="input"
                        value={formData.cliente_id}
                        onChange={e => setFormData({...formData, cliente_id: e.target.value})}
                      >
                        <option value="">Buscar cliente...</option>
                        {clientes.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre} ({c.nif})</option>
                        ))}
                      </select>
                    </div>
                    {selectedCliente && (
                      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Datos de facturación</p>
                        <p className="text-sm font-semibold text-neutral-900">{selectedCliente.nombre}</p>
                        <p className="text-xs text-neutral-500">{selectedCliente.direccion}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PASO 3: Confirmación */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-accent" size={24} />
                    <h3 className="text-xl font-heading text-neutral-900">Resumen y Confirmación</h3>
                  </div>

                  <div className="space-y-3 bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Género:</span>
                      <span className="font-bold text-neutral-900">{compra.productos?.nombre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Cliente:</span>
                      <span className="font-bold text-neutral-900">{selectedCliente?.nombre}</span>
                    </div>
                    <div className="h-px bg-neutral-200 my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Base Imponible:</span>
                      <span className="font-bold text-neutral-900">{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">IVA ({formData.tipo_iva}%):</span>
                      <span className="font-bold text-neutral-900">{iva.toFixed(2)} €</span>
                    </div>
                    <div className="h-px bg-neutral-200 my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-neutral-900 uppercase tracking-widest text-xs">Total Factura:</span>
                      <span className="text-2xl font-bold text-accent">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botonera Navigation */}
              <div className="mt-10 flex gap-3">
                {step > 1 && (
                  <button 
                    onClick={handleBack}
                    className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl font-bold text-neutral-600 hover:bg-neutral-50 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Atrás
                  </button>
                )}
                
                {step < 3 ? (
                  <button 
                    disabled={step === 1 ? !formData.pvp : !formData.cliente_id}
                    onClick={handleNext}
                    className="flex-2 btn-primary px-6 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Siguiente
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-2 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent-dark flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Confirmar y Finalizar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
