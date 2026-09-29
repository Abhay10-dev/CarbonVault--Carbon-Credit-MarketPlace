import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { AUDIT_LOGS } from '@/data/auditLogs';
import { DataTable } from '@/components/ui/DataTable';
import { formatDateTime } from '@/lib/utils';
import type { AuditLog } from '@/types';

export function AdminAuditLogs() {
  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: AuditLog) => (
        <span className="font-mono text-gray-500 text-[11px]">
          {formatDateTime(log.timestamp)}
        </span>
      ),
    },
    {
      key: 'userName',
      header: 'User & Role',
      render: (log: AuditLog) => (
        <div>
          <span className="font-semibold text-gray-900 block">{log.userName}</span>
          <span className="text-[10px] text-gray-400 capitalize">{log.role}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action Performed',
      render: (log: AuditLog) => (
        <div>
          <span className="font-medium text-gray-800 block">{log.action}</span>
          {log.detail && <span className="text-[11px] text-gray-400">{log.detail}</span>}
        </div>
      ),
    },
    {
      key: 'entity',
      header: 'Entity / Target',
      render: (log: AuditLog) => (
        <span className="text-gray-600 font-mono text-xs">
          {log.entity}: {log.entityId}
        </span>
      ),
    },
    {
      key: 'result',
      header: 'Result',
      render: (log: AuditLog) => (
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            log.result === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {log.result}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Audit & Compliance Logs</h1>
        <p className="text-xs text-gray-500 mt-1">
          Immutable system-wide action tracking for regulatory due diligence and ISO 14064 compliance.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-gray-900">Platform Audit Events</h2>
          </div>
          <span className="text-xs text-gray-400">{AUDIT_LOGS.length} Logged Events</span>
        </div>

        <DataTable columns={columns} data={AUDIT_LOGS} />
      </div>
    </div>
  );
}
