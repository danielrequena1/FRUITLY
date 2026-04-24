'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (!profile) {
      setError('Perfil no encontrado. Contacta con el administrador.')
      setLoading(false)
      return
    }

    if (profile.role === 'administrador') {
      router.push('/admin/dashboard')
    } else {
      router.push('/trabajador/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white border border-neutral-200 p-8 rounded-xl shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-[#2E3192] text-[28px] leading-none mb-1">Fruitly</h1>
          <p className="text-[#94A3B8] text-[12px] font-semibold uppercase tracking-wider">by Soluciones DRC</p>
        </div>

        <div className="h-px bg-neutral-100 my-6" />

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="text-danger text-sm font-medium text-center p-2 bg-danger-light rounded">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-900 block">Email</label>
            <input 
              type="email" 
              className="input h-[44px]" 
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-900 block">Contraseña</label>
            <input 
              type="password" 
              className="input h-[44px]" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[44px] bg-[#2E3192] text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
