import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Folders,
  Award,
  Clock,
  TrendingUp,
  Flame,
  ShieldCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatINR } from '@/lib/utils';

export function AdminDashboard() {
  const { projects, credits, transactions, orders } = useApp();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-forest-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Governance & Platform Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            CarbonVault Control Center
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
            System-wide monitoring of participant identities, accreditation pipelines, tokenized credit registries, and exchange order matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Users className="w-4 h-4" /> Manage Users
          </Link>
          <Link
            to="/admin/blockchain"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Activity className="w-4 h-4" /> Blockchain Events
          </Link>
        </div>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Users"
          value="1,248"
          subtitle="420 Prod · 18 Cert · 810 Mkt"
          icon={<Users className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
        <StatCard
          title="Total Projects"
          value="356"
          subtitle="Registered initiatives"
          icon={<Folders className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="Pending Queue"
          value="42"
          subtitle="In verification pipeline"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          colorClass="text-amber-700"
        />
        <StatCard
          title="Credits Issued"
          value="185,420 t"
          subtitle="Minted ERC-721 tokens"
          icon={<Award className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="Credits Traded"
          value="72,850 t"
          subtitle="Secondary market trades"
          icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
        <StatCard
          title="Credits Retired"
          value="18,430 t"
          subtitle="Permanently burned offsets"
          icon={<Flame className="w-5 h-5 text-rose-700" />}
          colorClass="text-rose-700"
        />
      </div>

      {/* Platform Activity & Lifecycle Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Funnels & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Pipeline Funnel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Project Accreditation Status</h2>
                <p className="text-xs text-gray-500">Distribution across verification workflow stages</p>
              </div>
              <Link to="/admin/verification" className="text-xs text-forest-700 font-semibold flex items-center gap-1">
                Monitor Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium text-gray-700 mb-1">
                  <span>Approved & Certified (271)</span>
                  <span>76%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-gray-700 mb-1">
                  <span>Under Active Auditor Review (42)</span>
                  <span>12%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-gray-700 mb-1">
                  <span>Additional Documents Requested (18)</span>
                  <span>5%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-gray-700 mb-1">
                  <span>Rejected Due Diligence (25)</span>
                  <span>7%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Credit Lifecycle Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Credit Volume Lifecycle</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Total Issued</span>
                <span className="text-base font-bold text-gray-900">185,420 t</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 block text-[11px] font-medium">Available / Listed</span>
                <span className="text-base font-bold text-emerald-900">94,140 t</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-blue-700 block text-[11px] font-medium">Traded Secondary</span>
                <span className="text-base font-bold text-blue-900">72,850 t</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-rose-700 block text-[11px] font-medium">Permanently Retired</span>
                <span className="text-base font-bold text-rose-900">18,430 t</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Platform Activity Stream */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Real-time Platform Feed</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="font-semibold text-emerald-900 block">✓ Project Approved</span>
                <p className="text-emerald-700 mt-0.5">GreenRoots Reforestation (PRJ-0012) certified.</p>
                <span className="text-[10px] text-emerald-500 font-mono mt-1 block">Tx: 0xA91B...3A4B</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="font-semibold text-blue-900 block">✓ Order Matched</span>
                <p className="text-blue-700 mt-0.5">200 credits traded between Rajesh Patil and Abhay Kumar.</p>
                <span className="text-[10px] text-blue-500 font-mono mt-1 block">Tx: 0xTRADE...2009</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="font-semibold text-rose-900 block">🔥 Credits Retired</span>
                <p className="text-rose-700 mt-0.5">300 tCO₂e retired under certificate RET-00091.</p>
                <span className="text-[10px] text-rose-500 font-mono mt-1 block">Tx: 0xRETIRE...2509</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-semibold text-gray-800 block">User Registration</span>
                <p className="text-gray-600 mt-0.5">EcoBuyers Ltd. joined as Institutional Participant.</p>
                <span className="text-[10px] text-gray-400 mt-1 block">21 Sep 2026</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/admin/audit"
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              Platform Audit Logs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
