import { getProductosConStock } from '@/app/actions/admin';
import { Package, Plus, TrendingDown, TrendingUp, Search } from 'lucide-react';

export default async function ProductosPage() {
  const productos = await getProductosConStock();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-neutral-900">Catálogo y Stock</h2>
          <p className="text-neutral-400 mt-1">Control de inventario y gestión de productos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* Buscador y Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              className="input pl-10 w-full"
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center justify-between px-8">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Variedades</p>
            <p className="text-2xl font-bold text-neutral-900">{productos.length}</p>
          </div>
          <Package className="text-neutral-100" size={40} />
        </div>
      </div>

      {/* Lista de Productos con Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {productos.map((p) => (
          <div key={p.id} className="card p-6 bg-white border-none shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-accent-light group-hover:text-accent transition-colors">
                <Package size={24} />
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${p.activo ? 'bg-accent-light text-accent' : 'bg-neutral-100 text-neutral-400'}`}>
                {p.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mb-1">{p.nombre}</h3>
            <p className="text-xs text-neutral-400 font-medium mb-6 uppercase tracking-wider">Unidad de medida: {p.unidad}</p>

            <div className="bg-neutral-50 rounded-xl p-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Stock Actual</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${p.stock > 0 ? 'text-neutral-900' : 'text-danger'}`}>
                    {p.stock}
                  </span>
                  <span className="text-sm font-bold text-neutral-400">{p.unidad}</span>
                </div>
              </div>
              
              <div className="text-right">
                {p.stock > 50 ? (
                  <div className="flex items-center gap-1 text-accent text-xs font-bold">
                    <TrendingUp size={14} />
                    Stock Alto
                  </div>
                ) : p.stock > 0 ? (
                  <div className="flex items-center gap-1 text-warning text-xs font-bold">
                    <TrendingDown size={14} />
                    Stock Bajo
                  </div>
                ) : (
                  <div className="text-danger text-xs font-bold uppercase tracking-tighter">
                    Sin Existencias
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-50 flex gap-2">
              <button className="flex-1 text-xs font-bold text-neutral-400 hover:text-neutral-900 uppercase tracking-widest transition-colors">
                Editar
              </button>
              <div className="w-px h-4 bg-neutral-100" />
              <button className="flex-1 text-xs font-bold text-drc-light hover:text-drc-deep uppercase tracking-widest transition-colors">
                Movimientos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
