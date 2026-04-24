'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  FileText, 
  Package,
  Calculator,
  Shield,
  X
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Panel de control', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Compras', href: '/admin/compras', icon: ShoppingCart },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Shield },
    { name: 'Facturas', href: '/admin/facturas', icon: FileText },
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Fiscal', href: '/admin/fiscal', icon: Calculator },
  ];

  return (
    <aside className="w-[280px] lg:w-[240px] h-screen bg-white border-r border-neutral-200 flex flex-col">
      {/* Branding */}
      <div className="p-8 pb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-drc-deep leading-none">Fruitly</h1>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">by Soluciones DRC</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-neutral-400">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all border-l-2 ${
                isActive 
                  ? 'bg-accent-light text-accent-dark border-accent' 
                  : 'text-neutral-500 hover:bg-neutral-50 border-transparent'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-neutral-100">
        <div className="px-4 py-3 mb-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Administrador</p>
          <p className="text-sm font-semibold text-neutral-900 truncate">Admin Fruitly</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
