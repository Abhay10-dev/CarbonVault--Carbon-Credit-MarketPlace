import React from 'react';
import { ClipboardCheck, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/lib/utils';

export function AdminVerification() {
  const { projects } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verification Pipeline Oversight</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor auditor turnaround times, review workloads, and accreditation stage bottlenecks.
        </p>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Submitted Queue"
          value={42}
          subtitle="Awaiting auditor assignment"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          colorClass="text-amber-700"
        />
        <StatCard
          title="Under Active Audit"
          value={18}
          subtitle="GIS & doc review"
          icon={<ClipboardCheck className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
        <StatCard
          title="Clarification"
          value={11}
          subtitle="Additional info requested"
          icon={<AlertTriangle className="w-5 h-5 text-orange-700" />}
          colorClass="text-orange-700"
        />
        <StatCard
          title="Certified Approved"
          value={271}
          subtitle="Credits minted"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
        <StatCard
          title="Rejected Proposals"
          value={25}
          subtitle="Ineligible methodology"
          icon={<XCircle className="w-5 h-5 text-red-700" />}
          colorClass="text-red-700"
        />
      </div>

      {/* Pipeline Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Auditor Assignments & Review Progress</h2>
          <span className="text-xs text-gray-400">Live Stage Tracker</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Project ID & Title</th>
                <th className="px-4 py-3.5">Developer</th>
                <th className="px-4 py-3.5">Assigned Verifier Agency</th>
                <th className="px-4 py-3.5">Submission Date</th>
                <th className="px-4 py-3.5">Current Pipeline Status</th>
                <th className="px-4 py-3.5">Bottleneck Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-gray-400 text-[10px] block">{p.id}</span>
                    <span className="font-semibold text-gray-900 text-xs">{p.name}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{p.producerName}</td>
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {p.verification?.certifierName || 'Green Certification Agency'}
                  </td>
                  <td className="px-4 py-4 text-gray-500">{formatDate(p.submittedAt || p.createdAt)}</td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      label={PROJECT_STATUS_LABELS[p.status]}
                      colorClass={PROJECT_STATUS_COLORS[p.status]}
                    />
                  </td>
                  <td className="px-4 py-4">
                    {p.status === 'additional_info_required' ? (
                      <span className="text-orange-700 font-semibold text-[11px]">
                        Pending developer response
                      </span>
                    ) : p.status === 'under_verification' ? (
                      <span className="text-blue-700 font-medium text-[11px]">
                        On-track (&lt; 48h turnaround)
                      </span>
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
