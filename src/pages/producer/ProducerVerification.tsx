import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  ArrowRight,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDate,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';

export function ProducerVerification() {
  const { user } = useAuth();
  const { projects, updateProject, addNotification } = useApp();

  const myProjects = projects.filter(p => p.producerId === user?.id);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    myProjects.find(p => p.status === 'additional_info_required')?.id || myProjects[0]?.id || ''
  );
  const [resubmitComment, setResubmitComment] = useState('Attached updated certified 7/12 extract and GPS boundary shapefile.');
  const [isResubmitted, setIsResubmitted] = useState(false);

  const selectedProject = myProjects.find(p => p.id === selectedProjectId) || myProjects[0];

  const handleResubmit = () => {
    if (!selectedProject) return;

    updateProject(selectedProject.id, {
      status: 'under_verification',
      verification: selectedProject.verification
        ? {
            ...selectedProject.verification,
            auditTrail: [
              ...selectedProject.verification.auditTrail,
              {
                timestamp: new Date().toISOString(),
                actor: user?.name || 'Producer',
                role: 'Producer',
                action: 'Resubmitted requested verification documents',
                detail: resubmitComment,
              },
            ],
          }
        : undefined,
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'u003', // Certifier
      title: 'Producer Resubmitted Documents',
      message: `${user?.name} has resubmitted documents for ${selectedProject.name}.`,
      read: false,
      type: 'info',
      date: new Date().toISOString(),
    });

    setIsResubmitted(true);
    setTimeout(() => setIsResubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Verification Tracking & Feedback
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor your project audits by Accredited Carbon Verification Agencies and respond to clarification requests.
        </p>
      </div>

      {/* Select Project to Inspect */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {myProjects.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedProjectId === p.id
                ? 'bg-forest-700 text-white border-forest-800 shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{p.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                selectedProjectId === p.id ? 'bg-forest-800 text-emerald-200' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {PROJECT_STATUS_LABELS[p.status]}
            </span>
          </button>
        ))}
      </div>

      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Timeline & Checklist */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Status Banner */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-gray-400 block mb-1">
                  PROJECT ID: {selectedProject.id}
                </span>
                <h2 className="text-lg font-bold text-gray-900">{selectedProject.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge
                    label={PROJECT_STATUS_LABELS[selectedProject.status]}
                    colorClass={PROJECT_STATUS_COLORS[selectedProject.status]}
                  />
                  <span className="text-xs text-gray-500">
                    Expected Credits: <strong>{selectedProject.expectedCredits} tCO₂e</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Assigned Verifier</span>
                <span className="text-xs font-semibold text-gray-800 block">
                  {selectedProject.verification?.certifierName || 'Accredited Agency'}
                </span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                Evidence & Verification Checklist
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProject.verification?.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-gray-800">{item.label}</span>
                    {item.status === 'done' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Passed
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Feedback & Resubmission Box */}
          <div className="space-y-6">
            {selectedProject.status === 'additional_info_required' ? (
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-orange-900">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                  <h3 className="text-sm font-bold">Action Required by Certifier</h3>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-orange-100 text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900 block mb-1">Verifier Comment:</span>
                  "Please provide updated land ownership documentation and project boundary evidence for consistency with Gat #201/4C."
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-800">
                    Producer Response & Upload Details
                  </label>
                  <textarea
                    rows={3}
                    value={resubmitComment}
                    onChange={e => setResubmitComment(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
                  />

                  <div className="p-3 border border-dashed border-gray-300 rounded-xl bg-white/70 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white transition-colors">
                    <Upload className="w-4 h-4 text-forest-700" />
                    <span>Upload updated PDF or GeoJSON boundary</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResubmit}
                    className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Response to Certifier
                  </button>

                  {isResubmitted && (
                    <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-medium text-center animate-fade-in">
                      Response successfully submitted! Status updated to Under Verification.
                    </div>
                  )}
                </div>
              </div>
            ) : selectedProject.status === 'approved' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold">Certification Approved</h3>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  All due diligence checks have concluded. Verified carbon credits have been generated as ERC-721/NFT tokens in your wallet.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Audit in Progress</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The verification authority is currently examining submitted GIS coordinates, biomass estimation models, and revenue records.
                </p>
              </div>
            )}

            {/* Audit log for selected project */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Recent Audit Timeline
              </h3>
              <div className="space-y-3">
                {selectedProject.verification?.auditTrail.slice(-4).map((entry, idx) => (
                  <div key={idx} className="text-xs border-l-2 border-forest-600 pl-3 py-0.5 space-y-0.5">
                    <span className="font-semibold text-gray-800 block">{entry.action}</span>
                    <span className="text-[10px] text-gray-400 block">{formatDate(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
