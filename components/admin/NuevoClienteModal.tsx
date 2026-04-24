'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Save } from 'lucide-react';
import { crearCliente } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function NuevoClienteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    nif: '',
    telefono: ''
  });

  const [addressData, setAddressData] = useState({
    calle: '',
    numero: '',
    piso: '',
    cp: '',
    poblacion: '',
    provincia: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Concatenar dirección fiscal
    const direccionCompleta = `${addressData.calle} ${addressData.numero}${addressData.piso ? ', ' + addressData.piso : ''}. CP: ${addressData.cp}. ${addressData.poblacion} (${addressData.provincia})`;

    const res = await crearCliente({
      ...formData,
      direccion: direccionCompleta
    });
    
    if (res.success) {
      setIsOpen(false);
      setFormData({ nombre: '', email: '', nif: '', telefono: '' });
      setAddressData({ calle: '', numero: '', piso: '', cp: '', poblacion: '', provincia: '' });
      router.refresh();
    } else {
      alert('Error al crear cliente: ' + res.error);
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus size={18} />
        Nuevo Cliente
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-xl font-heading text-neutral-900">Datos Fiscales del Cliente</h2>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
              {/* Sección 1: Datos Generales */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">Identificación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Razón Social / Nombre Comercial</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Ej: Frutería García SL"
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="label">NIF / CIF</label>
                    <input 
                      type="text" 
                      className="input uppercase" 
                      placeholder="B12345678"
                      value={formData.nif}
                      onChange={e => setFormData({...formData, nif: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="input" 
                      placeholder="600 000 000"
                      value={formData.telefono}
                      onChange={e => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Email de Facturación</label>
                    <input 
                      type="email" 
                      className="input" 
                      placeholder="facturacion@cliente.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Dirección Fiscal */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">Dirección Fiscal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Calle / Vía</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Av. de la Constitución"
                      value={addressData.calle}
                      onChange={e => setAddressData({...addressData, calle: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="label">Número</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="12"
                      value={addressData.numero}
                      onChange={e => setAddressData({...addressData, numero: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="label">Piso / Puerta</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="2º B"
                      value={addressData.piso}
                      onChange={e => setAddressData({...addressData, piso: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">Código Postal</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="28001"
                      value={addressData.cp}
                      onChange={e => setAddressData({...addressData, cp: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Población / Ciudad</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Madrid"
                      value={addressData.poblacion}
                      onChange={e => setAddressData({...addressData, poblacion: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="label">Provincia</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Madrid"
                      value={addressData.provincia}
                      onChange={e => setAddressData({...addressData, provincia: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white pb-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-md text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-2 btn-primary flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Registrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
