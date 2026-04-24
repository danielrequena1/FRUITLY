import { createClient } from '@/lib/supabase/server';
import BottomNav from '@/components/trabajador/BottomNav';
import LogoutIconButton from '@/components/LogoutIconButton';

export default async function TrabajadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre')
    .eq('id', user?.id)
    .single();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-40 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading text-drc-deep leading-none">Fruitly</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">by DRC</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-neutral-900 leading-none">
              {profile?.nombre?.split(' ')[0] || 'Usuario'}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-tighter">
              Trabajador
            </div>
          </div>
          <LogoutIconButton />
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <BottomNav />
    </div>
  );
}
