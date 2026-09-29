import React from 'react';
import { User, ShieldCheck, Mail, Building, Wallet, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export function AdminProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Administrator Profile</h1>
        <p className="text-xs text-gray-500 mt-1">
          Master administrative credentials and governance system keys.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className="bg-slate-800 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Root Administrator
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user.organization} Core Operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">System Email</span>
              <span className="font-semibold text-gray-800">{user.email}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Building className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Organization</span>
              <span className="font-semibold text-gray-800">{user.organization}</span>
            </div>
          </div>

          <div className="sm:col-span-2 p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Wallet className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0">
              <span className="text-gray-400 block text-[11px]">Deployer / Registry Admin Wallet</span>
              <span className="font-mono text-gray-800 font-semibold break-all">{user.wallet}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <span className="text-gray-500 block text-[11px] font-medium">Access Tier</span>
            <span className="text-sm font-bold text-gray-900 mt-1 block">Tier-0 Full Root</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <span className="text-gray-500 block text-[11px] font-medium">Account Status</span>
            <span className="text-sm font-bold text-emerald-700 mt-1 block">Active Verified</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <span className="text-gray-500 block text-[11px] font-medium">System Registered</span>
            <span className="text-sm font-bold text-gray-900 mt-1 block">{formatDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
