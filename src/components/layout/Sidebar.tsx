import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderPlus,
  Folders,
  ClipboardCheck,
  Award,
  ShoppingCart,
  Receipt,
  ArrowRightLeft,
  Flame,
  FileCheck2,
  Users,
  Building,
  FileText,
  Activity,
  History,
  ShieldCheck,
  TrendingUp,
  Settings,
  User,
  Heart,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  end?: boolean;
}

export function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const producerNav: NavItem[] = [
    { label: 'Dashboard', to: '/producer', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { label: 'My Projects', to: '/producer/projects', icon: <Folders className="w-4 h-4" /> },
    { label: 'Submit Project', to: '/producer/projects/create', icon: <FolderPlus className="w-4 h-4" /> },
    { label: 'Verification Status', to: '/producer/verification', icon: <ClipboardCheck className="w-4 h-4" /> },
    { label: 'My Credits', to: '/producer/credits', icon: <Award className="w-4 h-4" /> },
    { label: 'Sell Credits', to: '/producer/sell', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'My Orders', to: '/producer/orders', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Transactions', to: '/producer/transactions', icon: <History className="w-4 h-4" /> },
    { label: 'Profile', to: '/producer/profile', icon: <User className="w-4 h-4" /> },
  ];

  const certifierNav: NavItem[] = [
    { label: 'Dashboard', to: '/certifier', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { label: 'Verification Queue', to: '/certifier/queue', icon: <ClipboardCheck className="w-4 h-4" /> },
    { label: 'Projects Review', to: '/certifier/projects', icon: <Folders className="w-4 h-4" /> },
    { label: 'Document Review', to: '/certifier/documents', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Land Records', to: '/certifier/land', icon: <Building className="w-4 h-4" /> },
    { label: 'Verification History', to: '/certifier/history', icon: <History className="w-4 h-4" /> },
    { label: 'Audit Trail', to: '/certifier/audit', icon: <FileText className="w-4 h-4" /> },
    { label: 'Verification Reports', to: '/certifier/reports', icon: <Award className="w-4 h-4" /> },
    { label: 'Profile', to: '/certifier/profile', icon: <User className="w-4 h-4" /> },
  ];

  const marketNav: NavItem[] = [
    { label: 'Dashboard', to: '/market', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { label: 'Marketplace', to: '/market/marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'My Credits', to: '/market/credits', icon: <Award className="w-4 h-4" /> },
    { label: 'Portfolio', to: '/market/portfolio', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'My Orders', to: '/market/orders', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Order Book', to: '/market/orderbook', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Transactions', to: '/market/transactions', icon: <History className="w-4 h-4" /> },
    { label: 'Transfer Credits', to: '/market/transfer', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { label: 'Retire Credits', to: '/market/retire', icon: <Flame className="w-4 h-4" /> },
    { label: 'Impact Dashboard', to: '/market/impact', icon: <Activity className="w-4 h-4" /> },
    { label: 'Watchlist', to: '/market/watchlist', icon: <Heart className="w-4 h-4" /> },
    { label: 'Profile', to: '/market/profile', icon: <User className="w-4 h-4" /> },
  ];

  const adminNav: NavItem[] = [
    { label: 'Platform Dashboard', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { label: 'User Management', to: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Project Registry', to: '/admin/projects', icon: <Folders className="w-4 h-4" /> },
    { label: 'Verification Pipeline', to: '/admin/verification', icon: <ClipboardCheck className="w-4 h-4" /> },
    { label: 'Certifiers Registry', to: '/admin/certifiers', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Credit Registry', to: '/admin/credits', icon: <Award className="w-4 h-4" /> },
    { label: 'Marketplace Oversight', to: '/admin/marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'Transactions', to: '/admin/transactions', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Blockchain Activity', to: '/admin/blockchain', icon: <Activity className="w-4 h-4" /> },
    { label: 'Audit Logs', to: '/admin/audit', icon: <FileText className="w-4 h-4" /> },
    { label: 'Reports & Analytics', to: '/admin/reports', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Platform Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Admin Profile', to: '/admin/profile', icon: <User className="w-4 h-4" /> },
  ];

  const navMap: Record<string, NavItem[]> = {
    producer: producerNav,
    certifier: certifierNav,
    market: marketNav,
    admin: adminNav,
  };

  const navItems = navMap[user.role] || [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Navigation
        </div>

        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-forest-50 text-forest-800 font-semibold shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Role Switcher Quick Shortcut for prototype demonstration */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/70">
        <div className="text-[10px] uppercase font-semibold text-gray-400 mb-1.5 px-1">
          Demo Role Switch
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <NavLink
            to="/producer"
            className="px-2 py-1 bg-white border border-gray-200 rounded text-center text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
          >
            Producer
          </NavLink>
          <NavLink
            to="/certifier"
            className="px-2 py-1 bg-white border border-gray-200 rounded text-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
          >
            Certifier
          </NavLink>
          <NavLink
            to="/market"
            className="px-2 py-1 bg-white border border-gray-200 rounded text-center text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
          >
            Market
          </NavLink>
          <NavLink
            to="/admin"
            className="px-2 py-1 bg-white border border-gray-200 rounded text-center text-gray-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
          >
            Admin
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
