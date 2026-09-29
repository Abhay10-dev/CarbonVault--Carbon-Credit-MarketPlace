import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  Clock,
  ArrowRight,
  Folders,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDate,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';

export function CertifierDashboard() {
  const { projects } = useApp();

  const pendingList = projects.filter(
    p => p.status === 'submitted' || p.status === 'under_verification' || p.status === 'additional_info_required'
  );
  const approvedCount = projects.filter(p => p.status === 'approved').length + 26; // prototype baseline
  const rejectedCount = projects.filter(p => p.status === 'rejected').length + 3;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-1">
            Verification Authority Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Accredited Carbon Verifier Portal
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-xl">
            Independent due diligence on carbon offset proposals, revenue land registry validation, and credit issuance certification.
          </p>
        </div>

        <Link
          to="/certifier/queue"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <ClipboardCheck className="w-4 h-4" /> Open Verification Queue ({pendingList.length})
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Pending Queue"
          value={pendingList.length}
          subtitle="Awaiting review"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          colorClass="text-amber-700"
        />
        <StatCard
          title="Docs Pending"
          value={7}
          subtitle="Unverified files"
          icon={<FileCheck2 className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
        <StatCard
          title="Info Requested"
          value={3}
          subtitle="Awaiting producer"
          icon={<AlertTriangle className="w-5 h-5 text-orange-700" />}
          colorClass="text-orange-700"
        />
        <StatCard
          title="Approved Projects"
          value={approvedCount}
          subtitle="Certified to mint"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
        <StatCard
          title="Rejected Projects"
          value={rejectedCount}
          subtitle="Did not qualify"
          icon={<XCircle className="w-5 h-5 text-red-700" />}
          colorClass="text-red-700"
        />
        <StatCard
          title="Completed Reviews"
          value={approvedCount + rejectedCount}
          subtitle="Total verified"
          icon={<Folders className="w-5 h-5 text-slate-700" />}
        />
      </div>

      {/* Main Grid: Queue & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Verifications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Projects Awaiting Verification</h2>
              <p className="text-xs text-gray-500">Requires auditor checklist sign-off and GIS validation</p>
            </div>
            <Link
              to="/certifier/queue"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Full Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {pendingList.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">Queue is currently clear.</div>
            ) : (
              pendingList.map(project => (
                <div key={project.id} className="py-4 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <StatusBadge
                        label={PROJECT_STATUS_LABELS[project.status]}
                        colorClass={PROJECT_STATUS_COLORS[project.status]}
                      />
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span>Producer: {project.producerName}</span>
                      <span>·</span>
                      <span>{project.location}</span>
                      <span>·</span>
                      <span className="font-medium text-forest-800">
                        {project.expectedCredits} tCO₂e
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/certifier/review/${project.id}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0 shadow-xs transition-colors"
                  >
                    Start Audit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Verification Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4">Auditor Activity Log</h2>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="font-semibold text-emerald-900 block">✓ PRJ-0012 Certified</span>
                <p className="text-emerald-700 mt-0.5">
                  GreenRoots Reforestation project approved. 2,500 credits verified and signed.
                </p>
                <span className="text-[10px] text-emerald-500 mt-1 block">14 Sep 2026</span>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <span className="font-semibold text-orange-900 block">⚠ Information Requested</span>
                <p className="text-orange-700 mt-0.5">
                  PRJ-0022 flagged for clarification regarding 7/12 extract consistency.
                </p>
                <span className="text-[10px] text-orange-500 mt-1 block">22 Sep 2026</span>
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="font-semibold text-red-900 block">✕ PRJ-0019 Rejected</span>
                <p className="text-red-700 mt-0.5">
                  AgroCarbon project rejected due to undocumented soil methodology.
                </p>
                <span className="text-[10px] text-red-500 mt-1 block">16 Sep 2026</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/certifier/history"
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              View Verification History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
