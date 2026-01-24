import Link from 'next/link';
import { LayoutDashboard, Dumbbell, Users, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-10"> 
      <aside className="w-64 bg-slate-900/50 border-r border-white/10 p-6 hidden md:block fixed h-full">
        <h2 className="text-xl font-bold mb-8 text-neon flex items-center gap-2">
            <LayoutDashboard /> Admin
        </h2>
        <nav className="space-y-4 text-slate-400 font-medium">
           <Link href="/admin/dashboard" className="flex items-center gap-3 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
              <LayoutDashboard size={20} /> Dashboard
           </Link>
           <Link href="/admin/inventory" className="flex items-center gap-3 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Dumbbell size={20} /> Inventory
           </Link>
           <Link href="/admin/users" className="flex items-center gap-3 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Users size={20} /> Users
           </Link>
           <Link href="/admin/settings" className="flex items-center gap-3 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Settings size={20} /> Settings
           </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 md:ml-64">
        {children}
      </main>
    </div>
  )
}
