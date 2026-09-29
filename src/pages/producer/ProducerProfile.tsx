import React from 'react';
import { User, Building, Mail, Phone, MapPin, Wallet, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';

export function ProducerProfile() {
  const { user } = useAuth();
  const { projects, credits } = useApp();

  if (!user) return null;

  const myProjects = projects.filter(p => p.producerId === user.id);
  const myCredits = credits.filter(c => c.producerId === user.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Producer Profile</h1>
        <p className="text-xs text-gray-500 mt-1">
          Authorized environmental project developer credentials and linked Web3 registry address.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-800 font-bold text-2xl shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Producer
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user.organization}</p>
          </div>
        </div>

        {/* Profile info fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Email Address</span>
              <span className="font-semibold text-gray-800">{user.email}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Contact Phone</span>
              <span className="font-semibold text-gray-800">{user.phone}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Primary Location</span>
              <span className="font-semibold text-gray-800">{user.location}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Building className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Registered Entity</span>
              <span className="font-semibold text-gray-800">{user.organization}</span>
            </div>
          </div>

          <div className="sm:col-span-2 p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Wallet className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0">
              <span className="text-gray-400 block text-[11px]">Linked Custody Wallet</span>
              <span className="font-mono text-gray-800 font-semibold break-all">{user.wallet}</span>
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs">
          <div className="p-3 bg-forest-50/70 border border-forest-100 rounded-xl text-center">
            <span className="text-forest-700 block text-[11px] font-medium">Projects Registered</span>
            <span className="text-xl font-bold text-forest-900 mt-1 block">{myProjects.length}</span>
          </div>

          <div className="p-3 bg-forest-50/70 border border-forest-100 rounded-xl text-center">
            <span className="text-forest-700 block text-[11px] font-medium">Credit Batches</span>
            <span className="text-xl font-bold text-forest-900 mt-1 block">{myCredits.length}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-forest-50/70 border border-forest-100 rounded-xl text-center">
            <span className="text-forest-700 block text-[11px] font-medium">Member Since</span>
            <span className="text-sm font-bold text-forest-900 mt-1 block">{formatDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
