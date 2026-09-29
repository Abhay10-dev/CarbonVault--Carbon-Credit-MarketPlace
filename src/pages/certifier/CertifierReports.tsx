import React, { useState } from 'react';
import { Award, Printer, ShieldCheck, CheckCircle2, Download, Building } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDate, formatNumber } from '@/lib/utils';

export function CertifierReports() {
  const { projects } = useApp();
  const approvedProjects = projects.filter(p => p.status === 'approved');
  const [selectedId, setSelectedId] = useState(approvedProjects[0]?.id || 'PRJ-0012');

  const project = projects.find(p => p.id === selectedId) || approvedProjects[0];

  if (!project) {
    return <div className="p-8 text-center text-gray-500">No approved project available for report generation.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Formal Verification Report</h1>
          <p className="text-xs text-gray-500 mt-1">
            Official compliance certificate issued by Accredited Carbon Verification Agency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none"
          >
            {approvedProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Official Certificate Style Report Card */}
      <div className="bg-white rounded-3xl border-2 border-forest-600/30 p-8 sm:p-10 shadow-lg relative overflow-hidden space-y-6">
        <div className="flex justify-between items-start border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-emerald-300 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-forest-700 uppercase tracking-widest block">
                CARBON ACCREDITATION REGISTRY
              </span>
              <h2 className="text-xl font-bold text-gray-900">Certificate of Carbon Verification</h2>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-gray-400 block font-mono">REPORT #CV-ACV-2026-0012</span>
            <span className="text-gray-700 font-semibold">{formatDate(project.approvedAt || project.createdAt)}</span>
          </div>
        </div>

        {/* Project & Verifier Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block text-[11px]">Certified Project</span>
            <span className="font-bold text-gray-900 text-sm">{project.name}</span>
            <span className="text-gray-500 block">{project.location}</span>
          </div>

          <div>
            <span className="text-gray-400 block text-[11px]">Accredited Verification Body</span>
            <span className="font-bold text-gray-900 text-sm">Green Certification Agency (ACV-BEE-014)</span>
            <span className="text-gray-500 block">Lead Auditor: Demo Verification Officer</span>
          </div>
        </div>

        {/* Verification Summary Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 text-[11px]">
              <tr>
                <th className="p-3">Audit Component</th>
                <th className="p-3">Evidence Base</th>
                <th className="p-3">Auditor Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-medium text-gray-800">Legal Title & Due Diligence</td>
                <td className="p-3 text-gray-500">7/12 Extract, 8A Khate, Mutation Deed</td>
                <td className="p-3 text-emerald-700 font-semibold">Verified ✓</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-800">Geospatial Parcel Congruence</td>
                <td className="p-3 text-gray-500">GPS Polygon Boundary & Satellite Overlap</td>
                <td className="p-3 text-emerald-700 font-semibold">Verified ✓</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-800">Baseline Multi-Temporal Imagery</td>
                <td className="p-3 text-gray-500">Sentinel-2 & High-Res Drone Photos</td>
                <td className="p-3 text-emerald-700 font-semibold">Verified ✓</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-800">Carbon Stock Increment Model</td>
                <td className="p-3 text-gray-500">{project.methodology}</td>
                <td className="p-3 text-emerald-700 font-semibold">Accepted ✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verified Quantities */}
        <div className="bg-forest-50/70 border border-forest-100 rounded-2xl p-5 flex items-center justify-between text-xs">
          <div>
            <span className="text-forest-700 font-medium block">Approved Net Carbon Credits</span>
            <span className="text-2xl font-bold text-forest-900">
              {formatNumber(project.issuedCredits || project.expectedCredits)} tCO₂e
            </span>
          </div>

          <div className="text-right">
            <span className="text-forest-700 font-medium block">Token Standard</span>
            <span className="text-base font-bold text-forest-900 font-mono">ERC-721 / NFT</span>
          </div>
        </div>

        {/* Seal and Signatures */}
        <div className="pt-6 border-t border-gray-200 flex items-end justify-between text-xs">
          <div>
            <div className="w-16 h-16 rounded-full border-2 border-forest-600 border-dashed flex items-center justify-center text-forest-700 text-[10px] font-bold uppercase text-center p-2">
              Official ACV Seal
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-gray-400 block text-[10px]">DIGITALLY SIGNED</span>
            <span className="font-bold text-gray-900 text-xs block">Demo Verification Officer</span>
            <span className="text-[11px] text-gray-500">Accredited Carbon Verifier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
