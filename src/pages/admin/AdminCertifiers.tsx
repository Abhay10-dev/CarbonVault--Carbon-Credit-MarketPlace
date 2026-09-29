import React from 'react';
import { ShieldCheck, Award, Building, CheckCircle2, Clock } from 'lucide-react';

export function AdminCertifiers() {
  const certifiers = [
    {
      id: 'ACV-BEE-014',
      name: 'Green Certification Agency',
      leadAuditor: 'Demo Verification Officer',
      sectors: 'Forestry, Agroforestry, Land Restoration',
      status: 'Active',
      completed: 32,
      pending: 4,
      joined: '2026-01-15',
    },
    {
      id: 'ACV-BEE-018',
      name: 'EcoVerify Climate Solutions',
      leadAuditor: 'Dr. Sanjay Deshmukh',
      sectors: 'Renewable Energy, Grid Solar, Biogas',
      status: 'Active',
      completed: 21,
      pending: 2,
      joined: '2026-02-01',
    },
    {
      id: 'ACV-BEE-022',
      name: 'IndoCarbon Auditing Services',
      leadAuditor: 'Sunita Rao',
      sectors: 'Agricultural Practices, Soil Carbon, Biochar',
      status: 'Active',
      completed: 18,
      pending: 5,
      joined: '2026-03-10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Accredited Verifiers Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Registered Accredited Carbon Verification Agencies (ACVs) authorized under the BEE compliance framework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {certifiers.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {c.id}
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {c.status}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-base mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 mb-4">Lead Auditor: {c.leadAuditor}</p>

              <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Auditing Sectors:</span>
                  <span className="font-medium text-gray-800 text-right truncate max-w-[150px]">{c.sectors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed Reviews:</span>
                  <span className="font-bold text-emerald-800">{c.completed} Projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Workload:</span>
                  <span className="font-bold text-amber-700">{c.pending} In Progress</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors">
              View Verifier Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
