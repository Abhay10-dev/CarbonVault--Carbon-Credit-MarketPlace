import React from 'react';
import { User, Building, Mail, Phone, MapPin, Wallet, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatDate } from '@/lib/utils';

export function MarketProfile() {
  const { user } = useAuth();
  const { credits } = useApp();

  if (!user) return null;

  const myCredits = credits.filter(c => c.currentOwnerId === user.id);
  const totalOwned = myCredits.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Market Participant Profile</h1>
        <p className="text-xs text-gray-500 mt-1">
          Corporate buyer registry account and connected Web3 custody settlement address.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 font-bold text-2xl shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Market Participant
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user.organization}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Corporate Email</span>
              <span className="font-semibold text-gray-800">{user.email}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Contact Line</span>
              <span className="font-semibold text-gray-800">{user.phone}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Headquarters</span>
              <span className="font-semibold text-gray-800">{user.location}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Building className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Corporate Entity</span>
              <span className="font-semibold text-gray-800">{user.organization}</span>
            </div>
          </div>

          <div className="sm:col-span-2 p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Wallet className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0">
              <span className="text-gray-400 block text-[11px]">Primary Web3 Custody Address</span>
              <span className="font-mono text-gray-800 font-semibold break-all">{user.wallet}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs">
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
            <span className="text-purple-700 block text-[11px] font-medium">Credits Owned</span>
            <span className="text-xl font-bold text-purple-900 mt-1 block">{formatNumber(totalOwned)} t</span>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
            <span className="text-purple-700 block text-[11px] font-medium">Registry Tier</span>
            <span className="text-sm font-bold text-purple-900 mt-2 block">Institutional</span>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
            <span className="text-purple-700 block text-[11px] font-medium">Joined On</span>
            <span className="text-sm font-bold text-purple-900 mt-2 block">{formatDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
