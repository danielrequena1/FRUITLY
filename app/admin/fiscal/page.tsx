import { getFiscalData } from '@/app/actions/admin';
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  AlertCircle,
  ArrowUpRight,
  PieChart,
  DollarSign
} from 'lucide-react';
import MarcarPagadaButton from '@/components/admin/MarcarPagadaButton';

export default async function FiscalPage() {
  const data = await getFiscalData();
  if (!data) return <div className="p-8 text-neutral-400">Error al cargar datos fiscales</div>;

  const { summary, ventas } = data;

  // Calcular días para fin de trimestre
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  let endOfQuarter;
  
  if (currentMonth <= 2) endOfQuarter = new Date(now.getFullYear(), 2, 31);
  else if (currentMonth <= 5) endOfQuarter = new Date(now.getFullYear(), 5, 30);
  else if (currentMonth <= 8) endOfQuarter = new Date(now.getFullYear(), 8, 30);
  else endOfQuarter = new Date(now.getFullYear(), 11, 31);

  const daysLeft = Math.ceil((endOfQuarter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading text-neutral-900">Resumen Fiscal</h2>
        <p className="text-neutral-400 mt-1">Información simplificada para el cierre trimestral</p>
      </div>

      {/* Grid Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Días para Trimestre */}
        <div className="card p-8 bg-drc-deep text-white border-none shadow-xl flex flex-col items-center text-center">
          <Calendar className="text-drc-light mb-4" size={40} />
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Fin de Trimestre</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold">{daysLeft}</span>
            <span className="text-xl font-medium opacity-80">días</span>
          </div>
          <p className="mt-4 text-sm font-medium opacity-80">
            Faltan para el cierre del {Math.floor(currentMonth / 3) + 1}º Trimestre
          </p>
        </div>

        {/* IVA Total */}
        <div className="card p-8 bg-white border-none shadow-sm flex flex-col items-center text-center">
          <Calculator className="text-accent mb-4" size={40} />
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">IVA Total Acumulado</p>
          <span className="text-6xl font-bold text-neutral-900">
            {summary.ivaTotal.toFixed(0)}<span className="text-2xl ml-1">€</span>
          </span>
          <div className="mt-6 flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent" /> 4%: {summary.iva4.toFixed(0)}€
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-drc-light" /> 10%: {summary.iva10.toFixed(0)}€
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> 21%: {summary.iva21.toFixed(0)}€
            </div>
          </div>
        </div>
      </div>

      {/* Listado Minimalista de Pendientes */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading text-neutral-900">Facturas Pendientes de Cobro</h3>
        <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
          {ventas.filter(v => !v.pagada).length > 0 ? (
            <div className="divide-y divide-neutral-50">
              {ventas.filter(v => !v.pagada).map((v: any) => {
                const total = Number(v.pvp) * (1 + Number(v.tipo_iva) / 100);
                const isOverdue = new Date(v.vencimiento) < new Date();
                
                return (
                  <div key={v.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${isOverdue ? 'bg-danger animate-pulse' : 'bg-warning'}`} />
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{v.clientes?.nombre}</p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase">Vence: {new Date(v.vencimiento).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold text-neutral-900">{total.toFixed(2)} €</span>
                      <MarcarPagadaButton ventaId={v.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-neutral-400 italic text-sm">
              No hay cobros pendientes. ¡Todo al día!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
