import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';

export function CertifierAuditTrail() {
  const { projects } = useApp();

  // Aggregate audit trails from projects
  const auditEntries = projects
    .flatMap(p =>
      (p.verification?.auditTrail || []).map(a => ({
        ...a,
        projectName: p.name,
        projectId: p.id,
      }))
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verification Audit Trail</h1>
        <p className="text-xs text-gray-500 mt-1">
          Chronological, tamper-evident log of all verifier assessments, checklist updates, and regulatory actions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-gray-900">Auditor Action Log</h2>
        </div>

        <div className="relative border-l border-gray-200 ml-4 space-y-6">
          {auditEntries.map((entry, idx) => (
            <div key={idx} className="relative pl-6">
              <span className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />

              <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 text-xs space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-gray-900 text-sm">{entry.action}</span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>

                <div className="text-gray-500">
                  Target: <strong className="text-gray-800">{entry.projectName}</strong> ({entry.projectId}) · Actor: {entry.actor} ({entry.role})
                </div>

                {entry.detail && (
                  <p className="text-forest-800 font-medium pt-1 border-t border-gray-200/50 mt-1">
                    Details: {entry.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
