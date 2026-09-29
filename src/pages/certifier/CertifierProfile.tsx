import React from 'react';
import { ShieldCheck, Building, Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

export function CertifierProfile() {
  const { user } = useAuth();
  const { projects } = useApp();

  if (!user) return null;

  const verifiedCount = projects.filter(p => p.status === 'approved').length + 26;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verifier Accreditation Profile</h1>
        <p className="text-xs text-gray-500 mt-1">
          Authorized Carbon Verification Agency (ACV) credentials and sectoral auditor jurisdiction.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-2xl shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Accredited ACV Verifier
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user.organization} · Reg #ACV-BEE-014</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Official Email</span>
              <span className="font-semibold text-gray-800">{user.email}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Auditor Contact</span>
              <span className="font-semibold text-gray-800">{user.phone}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Accreditation Jurisdiction</span>
              <span className="font-semibold text-gray-800">Maharashtra & Western Region</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <Building className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[11px]">Certified Sectors</span>
              <span className="font-semibold text-gray-800">Forestry, Land Use, Renewable Energy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
            <span className="text-blue-700 block text-[11px] font-medium">Audits Conducted</span>
            <span className="text-xl font-bold text-blue-900 mt-1 block">{verifiedCount}</span>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
            <span className="text-blue-700 block text-[11px] font-medium">Accreditation Status</span>
            <span className="text-sm font-bold text-emerald-700 mt-2 block">Active Valid</span>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
            <span className="text-blue-700 block text-[11px] font-medium">Standard</span>
            <span className="text-sm font-bold text-blue-900 mt-2 block">BEE CCTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
