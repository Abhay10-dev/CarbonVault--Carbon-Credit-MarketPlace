import React, { useState } from 'react';
import { Search, Bell, Wallet, LogOut, ShieldCheck, ChevronDown, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { truncateWallet } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenWallet: () => void;
  onToggleMobileSidebar?: () => void;
}

export function Header({ onOpenNotifications, onOpenWallet, onToggleMobileSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!user) return null;

  const unreadCount = notifications.filter(n => n.userId === user.id && !n.read).length;

  const roleColors: Record<string, string> = {
    producer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    certifier: 'bg-blue-100 text-blue-800 border-blue-200',
    market: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-slate-800 text-slate-100 border-slate-700',
  };

  const roleLabels: Record<string, string> = {
    producer: 'Producer Workspace',
    certifier: 'Verification Authority',
    market: 'Market Participant',
    admin: 'Platform Admin',
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Brand & Role */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Toggle Sidebar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link to={`/${user.role}`} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-gray-900 text-lg tracking-tight">CarbonVault</span>
            <span className="text-[10px] text-gray-400 block -mt-1 font-mono">REGISTRY & EXCHANGE</span>
          </div>
        </Link>

        <span
          className={`ml-2 text-xs font-semibold px-2.5 py-1 rounded-md border ${
            roleColors[user.role] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {roleLabels[user.role]}
        </span>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, credits, token IDs, records..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications, Wallet, User */}
      <div className="flex items-center gap-3">
        {/* Wallet Button */}
        <button
          onClick={onOpenWallet}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors text-xs font-medium"
          title="Open Web3 Wallet"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Wallet className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-mono hidden lg:inline">{truncateWallet(user.wallet)}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-800 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold text-gray-800 block leading-tight">{user.name}</span>
              <span className="text-[10px] text-gray-400 block capitalize">{user.organization}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
              </div>

              <Link
                to={`/${user.role}/profile`}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              >
                <UserCheck className="w-4 h-4 text-gray-400" />
                View Profile
              </Link>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Disconnect & Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
