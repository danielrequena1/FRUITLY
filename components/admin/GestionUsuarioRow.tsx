'use client';

import { useState } from 'react';
import { User, Shield, Key, Edit2, Loader2, Save, X, Circle } from 'lucide-react';
import { actualizarUsuario, resetearPassword } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function GestionUsuarioRow({ usuario }: { usuario: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(usuario.nombre);
  const [role, setRole] = useState(usuario.role);
  const [activo, setActivo] = useState(usuario.activo ?? true);
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    const res = await actualizarUsuario(usuario.id, { nombre, role, activo });
    if (res.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert('Error: ' + res.error);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    const res = await resetearPassword(usuario.id, newPassword);
    if (res.success) {
      setIsResetting(false);
      setNewPassword('');
      alert('Contraseña actualizada con éxito');
    } else {
      alert('Error: ' + res.error);
    }
    setLoading(false);
  };

  return (
    <tr className="hover:bg-neutral-50/50 transition-colors">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <User size={20} />
          </div>
          {isEditing ? (
            <input 
              className="input h-10 w-48"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          ) : (
            <div>
              <p className="font-bold text-neutral-900">{usuario.nombre}</p>
              <p className="text-xs text-neutral-400">{usuario.email}</p>
            </div>
          )}
        </div>
      </td>
      <td className="px-8 py-6">
        {isEditing ? (
          <select 
            className="input h-10 w-40"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="trabajador">Trabajador</option>
            <option value="administrador">Administrador</option>
          </select>
        ) : (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${usuario.role === 'administrador' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            <Shield size={12} />
            {usuario.role}
          </div>
        )}
      </td>
      <td className="px-8 py-6">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={activo} 
              onChange={(e) => setActivo(e.target.checked)}
              className="w-4 h-4 text-accent rounded border-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-700">Activo</span>
          </div>
        ) : (
          <div className={`inline-flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider ${usuario.activo ? 'text-success' : 'text-neutral-400'}`}>
            <Circle size={8} fill="currentColor" />
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </div>
        )}
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <button onClick={handleUpdate} disabled={loading} className="p-2 text-accent hover:bg-accent-light rounded-lg">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              </button>
              <button onClick={() => setIsEditing(false)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                <X size={18} />
              </button>
            </>
          ) : isResetting ? (
            <div className="flex items-center gap-2">
              <input 
                type="password"
                placeholder="Nueva clave"
                className="input h-9 w-32 text-xs"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleResetPassword} disabled={loading} className="p-2 text-danger hover:bg-danger-light rounded-lg">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              </button>
              <button onClick={() => setIsResetting(false)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                title="Editar Perfil"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => setIsResetting(true)}
                className="p-2 text-neutral-400 hover:text-danger hover:bg-danger-light rounded-lg transition-all"
                title="Resetear Contraseña"
              >
                <Key size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
