'use client';

import { useState, useEffect, useRef } from 'react';
import { buscarClientes, crearCliente, procesarVenta } from '@/app/actions/ventas';
import { 
  FileCheck, 
  Search, 
  Plus, 
  UserPlus, 
  ArrowLeft,
  CheckCircle,
  Package,
  User,
  Calculator
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Cliente } from '@/lib/supabase/types';

export default function ProcesarCompraPage({ params, compra }: { params: { id: string }, compra: any }) {
  const router = useRouter();
  const [pvp, setPvp] = useState('');
  const [tipoIva, setTipoIva] = useState('4');
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isNewCliente, setIsNewCliente] = useState(false);
  const [newCliente, setNewCliente] = useState({ nombre: '', nif: '', email: '', direccion: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  // Debounce para búsqueda de clientes
  useEffect(() => {
    if (!search || selectedCliente) {
      setClientes([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await buscarClientes(search);
      setClientes(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCliente]);

  const subtotal = Number(pvp) * Number(compra.cantidad_kg);
  const iva = subtotal * (Number(tipoIva) / 100);
  const total = subtotal + iva;

  const handleProcesar = async () => {
    if (!pvp || !selectedCliente) return;
    setLoading(true);

    const res = await procesarVenta(
      compra.id,
      Number(pvp),
      Number(tipoIva),
      selectedCliente.id
    );

    if (res.success) {
      alert('Venta procesada con éxito. Factura generada (Simulada).');
      router.push('/admin/dashboard');
    } else {
      alert('Error: ' + res.error);
    }
    setLoading(false);
  };

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await crearCliente(newCliente);
    if (res.success) {
      setSelectedCliente(res.data);
      setIsNewCliente(false);
      setNewCliente({ nombre: '', nif: '', email: '', direccion: '', telefono: '' });
    } else {
      alert('Error: ' + res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white border border-neutral-200 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-heading text-neutral-900">Procesar Compra</h2>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">ID: {compra.id.slice(0, 8)}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Detalle Compra */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card bg-white p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-xl">Detalle de Compra</h3>
              <span className="badge badge-pendiente">Pendiente</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Producto</p>
                  <p className="text-lg font-bold text-neutral-900">{compra.productos?.nombre}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Cantidad</p>
                  <p className="text-lg font-bold text-neutral-900">{compra.cantidad_kg} kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Precio Coste</p>
                  <p className="text-lg font-bold text-neutral-900">{compra.precio_compra} €/kg</p>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-neutral-600">Total coste compra:</span>
                <span className="text-xl font-bold text-neutral-900">
                  {(compra.cantidad_kg * compra.precio_compra).toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          <div className="card bg-drc-deep text-white p-6">
             <div className="flex items-center gap-3 mb-2">
                <Calculator size={20} className="text-drc-light" />
                <h4 className="font-bold text-sm uppercase tracking-widest">Resumen Venta</h4>
             </div>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between opacity-80">
                  <span>Subtotal:</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>IVA ({tipoIva}%):</span>
                  <span>{iva.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-lg font-bold">
                  <span>TOTAL FACTURA:</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
             </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario Venta */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card bg-white p-8">
            <h3 className="font-heading text-xl mb-8">Información de Venta</h3>
            
            <div className="space-y-8">
              {/* Precios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Precio Venta (PVP €/kg)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="input" 
                    placeholder="0.00"
                    value={pvp}
                    onChange={(e) => setPvp(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Tipo de IVA</label>
                  <select 
                    className="input"
                    value={tipoIva}
                    onChange={(e) => setTipoIva(e.target.value)}
                  >
                    <option value="4">4% (Superreducido)</option>
                    <option value="10">10% (Reducido)</option>
                    <option value="21">21% (General)</option>
                  </select>
                </div>
              </div>

              {/* Cliente */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="label">Cliente</label>
                  {!selectedCliente && (
                    <button 
                      onClick={() => setIsNewCliente(true)}
                      className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1"
                    >
                      <UserPlus size={14} /> Nuevo Cliente
                    </button>
                  )}
                </div>

                {!selectedCliente ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-neutral-400 pointer-events-none">
                      <Search size={18} />
                    </div>
                    <input 
                      type="text" 
                      className="input pl-10" 
                      placeholder="Buscar por nombre, NIF o email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    
                    {clientes.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl z-20 overflow-hidden">
                        {clientes.map(c => (
                          <button 
                            key={c.id}
                            onClick={() => setSelectedCliente(c)}
                            className="w-full text-left px-4 py-3 hover:bg-neutral-50 flex items-center justify-between border-b last:border-0 border-neutral-100"
                          >
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{c.nombre}</p>
                              <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{c.nif} · {c.email}</p>
                            </div>
                            <Plus size={16} className="text-accent" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-accent-light border border-accent/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                        {selectedCliente.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-accent-dark">{selectedCliente.nombre}</p>
                        <p className="text-xs text-accent-dark/60">{selectedCliente.nif}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedCliente(null); setSearch(''); }}
                      className="text-xs font-bold text-accent-dark/40 hover:text-danger uppercase tracking-wider"
                    >
                      Cambiar
                    </button>
                  </div>
                )}
              </div>

              {/* Botón Acción */}
              <button 
                onClick={handleProcesar}
                disabled={!pvp || !selectedCliente || loading}
                className="btn-primary w-full h-14 text-lg gap-2 mt-8"
              >
                {loading ? 'Procesando...' : <><FileCheck size={24} /> Generar factura y completar</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Cliente */}
      {isNewCliente && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-heading mb-6">Nuevo Cliente</h3>
            <form onSubmit={handleCrearCliente} className="space-y-4">
              <div>
                <label className="label">Nombre / Razón Social</label>
                <input required className="input" value={newCliente.nombre} onChange={e => setNewCliente({...newCliente, nombre: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">NIF</label>
                  <input required className="input" value={newCliente.nif} onChange={e => setNewCliente({...newCliente, nif: e.target.value})} />
                </div>
                <div>
                  <label className="label">Teléfono</label>
                  <input className="input" value={newCliente.telefono} onChange={e => setNewCliente({...newCliente, telefono: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input required type="email" className="input" value={newCliente.email} onChange={e => setNewCliente({...newCliente, email: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsNewCliente(false)} className="btn-ghost flex-1">Cancelar</button>
                <button type="submit" className="btn-secondary flex-1">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
