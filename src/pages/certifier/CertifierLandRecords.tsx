import React from 'react';
import { Building, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MockMap } from '@/components/ui/MockMap';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/lib/utils';

export function CertifierLandRecords() {
  const { projects } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Land Records & Cadastral Verification</h1>
        <p className="text-xs text-gray-500 mt-1">
          Verification against digitally signed 7/12 extracts, 8A Khate books, and Maharashtra revenue boundary registries.
        </p>
      </div>

      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h3 className="font-bold text-emerald-900">Land Record Consistency Protocol</h3>
          <p className="text-emerald-700 mt-0.5 leading-relaxed">
            All submitted survey parcel numbers (Gat numbers) are cross-checked for ownership deed consistency, encumbrance certificates, and geographic boundary polygon alignment before carbon issuance approval.
          </p>
        </div>
      </div>

      {/* Grid of Projects Land Records */}
      <div className="space-y-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-gray-400 block">{p.id}</span>
                <h3 className="text-base font-bold text-gray-900">{p.name}</h3>
              </div>
              <StatusBadge
                label={PROJECT_STATUS_LABELS[p.status]}
                colorClass={PROJECT_STATUS_COLORS[p.status]}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">Survey / Gat No.</span>
                    <span className="font-mono font-bold text-gray-900">{p.landInfo.surveyNumber}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">Registered Owner</span>
                    <span className="font-semibold text-gray-900">{p.producerName}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">Location</span>
                    <span className="font-semibold text-gray-900">{p.landInfo.taluka}, {p.landInfo.district}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">State / Jurisdiction</span>
                    <span className="font-semibold text-gray-900">{p.landInfo.state}, India</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">Total Title Parcel Area</span>
                    <span className="font-semibold text-gray-900">{p.landInfo.totalArea} Hectares</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 block text-[11px] font-medium">Carbon Project Dedicated</span>
                    <span className="font-bold text-emerald-900">{p.landInfo.projectArea} Hectares</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Digital 7/12 Extract Verification:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                  </span>
                </div>
              </div>

              <div>
                <MockMap
                  latitude={p.landInfo.latitude}
                  longitude={p.landInfo.longitude}
                  projectArea={p.landInfo.projectArea}
                  surveyNumber={p.landInfo.surveyNumber}
                  projectName={p.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
