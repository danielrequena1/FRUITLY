'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-neutral-500 hover:text-danger hover:bg-danger-light rounded-md transition-all w-full"
    >
      <LogOut size={18} />
      <span>Cerrar sesión</span>
    </button>
  );
}
