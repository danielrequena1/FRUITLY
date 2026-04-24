import { getUsuarios } from '@/app/actions/admin';
import { User, Shield, UserCog, Key, Edit2 } from 'lucide-react';
import GestionUsuarioRow from '@/components/admin/GestionUsuarioRow';

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading text-neutral-900">Gestión de Usuarios</h2>
        <p className="text-neutral-400 mt-1">Administra accesos, perfiles y seguridad de la plataforma</p>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Usuario</th>
              <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Rol / Acceso</th>
              <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {usuarios.map((u) => (
              <GestionUsuarioRow key={u.id} usuario={u} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
