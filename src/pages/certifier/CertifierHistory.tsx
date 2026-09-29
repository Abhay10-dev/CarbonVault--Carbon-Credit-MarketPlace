import React from 'react';
import { History, ShieldCheck, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDate,
  formatNumber,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';

export function CertifierHistory() {
  const { projects } = useApp();

  const completedProjects = projects.filter(
    p => p.status === 'approved' || p.status === 'rejected'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verification History</h1>
        <p className="text-xs text-gray-500 mt-1">
          Historical record of completed accreditation audits, certified approvals, and formal project rejections.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Project ID & Title</th>
                <th className="px-4 py-3.5">Developer</th>
                <th className="px-4 py-3.5">Methodology</th>
                <th className="px-4 py-3.5">Issued / Scope</th>
                <th className="px-4 py-3.5">Decision Date</th>
                <th className="px-4 py-3.5">Final Decision</th>
                <th className="px-5 py-3.5 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {completedProjects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-gray-400 text-[10px] block">{p.id}</span>
                    <span className="font-semibold text-gray-900 text-xs">{p.name}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium">{p.producerName}</td>
                  <td className="px-4 py-4 text-gray-600">{p.type}</td>
                  <td className="px-4 py-4">
                    {p.status === 'approved' ? (
                      <span className="font-bold text-forest-800">
                        {formatNumber(p.issuedCredits || p.expectedCredits)} tCO₂e
                      </span>
                    ) : (
                      <span className="text-gray-400">0 t (Rejected)</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    {formatDate(p.approvedAt || p.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      label={PROJECT_STATUS_LABELS[p.status]}
                      colorClass={PROJECT_STATUS_COLORS[p.status]}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to="/certifier/reports"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                    >
                      View Report <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
