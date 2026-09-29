import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Award,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Link2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MockMap } from '@/components/ui/MockMap';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LifecycleTimeline } from '@/components/ui/LifecycleTimeline';
import { BlockchainRecord } from '@/components/ui/BlockchainRecord';
import {
  formatINR,
  formatNumber,
  formatDate,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  DOC_STATUS_LABELS,
  DOC_STATUS_COLORS,
} from '@/lib/utils';

export function ProducerProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects, credits } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'land' | 'docs' | 'verification' | 'blockchain'>('overview');

  const project = projects.find(p => p.id === id) || projects[0];
  const projectCredits = credits.filter(c => c.projectId === project?.id);

  if (!project) {
    return <div className="p-8 text-center text-gray-500">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/producer/projects"
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Projects
        </Link>
      </div>

      {/* Project Banner Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge
                label={PROJECT_STATUS_LABELS[project.status]}
                colorClass={PROJECT_STATUS_COLORS[project.status]}
              />
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                {project.id}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {project.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(project.startDate)} – {formatDate(project.endDate)}
              </span>
              <span>·</span>
              <span className="font-medium text-forest-700">
                {project.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-forest-50 border border-forest-100 rounded-xl px-4 py-3 text-right">
              <span className="text-[11px] text-forest-700 block font-medium">Issued Credits</span>
              <span className="text-lg font-bold text-forest-900">
                {formatNumber(project.issuedCredits || 0)} <span className="text-xs font-normal">tCO₂e</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-t border-gray-100 mt-6 pt-3 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'land', label: 'Land & Coordinates' },
            { id: 'docs', label: `Documents (${project.documents.length})` },
            { id: 'verification', label: 'Verification Audit' },
            { id: 'blockchain', label: `Credits & Blockchain (${projectCredits.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Project Description</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{project.description}</p>

            <h3 className="text-sm font-semibold text-gray-800 pt-2 border-t border-gray-100">
              Methodology & Standards
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Approved standard: <strong className="text-gray-900">{project.methodology}</strong>.
              Follows baseline carbon stock evaluation and annual biomass increment calculations aligned with Bureau of Energy Efficiency (BEE) carbon offset mechanism frameworks.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Key Metrics</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Total Project Area</span>
                <span className="font-semibold text-gray-800">{project.landInfo.projectArea} hectares</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Expected CO₂ Removal</span>
                <span className="font-semibold text-forest-800">{formatNumber(project.expectedCredits)} tCO₂e</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Land Survey / Gat No.</span>
                <span className="font-mono text-gray-800">{project.landInfo.surveyNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Created On</span>
                <span className="text-gray-800">{formatDate(project.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Land & Coordinates */}
      {activeTab === 'land' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Revenue Land Information</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Survey / Gat No.</span>
                <span className="font-semibold text-gray-800 font-mono">{project.landInfo.surveyNumber}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Village</span>
                <span className="font-semibold text-gray-800">{project.landInfo.village}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Taluka</span>
                <span className="font-semibold text-gray-800">{project.landInfo.taluka}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">District / State</span>
                <span className="font-semibold text-gray-800">{project.landInfo.district}, {project.landInfo.state}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Total Parcel Area</span>
                <span className="font-semibold text-gray-800">{project.landInfo.totalArea} ha</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Project Area Mapped</span>
                <span className="font-semibold text-emerald-700">{project.landInfo.projectArea} ha</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Land Record Consistency Check — Passed
              </div>
              <p className="text-[11px] text-emerald-700">
                Extracted survey records match digitally signed 7/12 land registration records with 99.8% geometric congruence.
              </p>
            </div>
          </div>

          <div>
            <MockMap
              latitude={project.landInfo.latitude}
              longitude={project.landInfo.longitude}
              projectArea={project.landInfo.projectArea}
              surveyNumber={project.landInfo.surveyNumber}
              projectName={project.name}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs animate-fade-in">
          <h2 className="text-base font-bold text-gray-900">Submitted Documentation</h2>
          <div className="divide-y divide-gray-100">
            {project.documents.map(doc => (
              <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                    <span className="text-[11px] text-gray-400">
                      Uploaded on {formatDate(doc.uploadedAt)} · Category: {doc.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge
                    label={DOC_STATUS_LABELS[doc.status]}
                    colorClass={DOC_STATUS_COLORS[doc.status]}
                  />
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Verification */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Verification Checklist</h2>
            <div className="space-y-2">
              {project.verification?.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-gray-700">{item.label}</span>
                  {item.status === 'done' ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Verification Audit Trail</h2>
            <div className="space-y-3">
              {project.verification?.auditTrail.map((log, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl text-xs space-y-0.5">
                  <div className="flex justify-between items-baseline font-semibold text-gray-800">
                    <span>{log.action}</span>
                    <span className="text-[11px] text-gray-400 font-normal">{formatDate(log.timestamp)}</span>
                  </div>
                  <div className="text-gray-500">Actor: {log.actor} ({log.role})</div>
                  {log.detail && <p className="text-forest-800 font-medium">{log.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Credits & Blockchain */}
      {activeTab === 'blockchain' && (
        <div className="space-y-6 animate-fade-in">
          {projectCredits.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-400">
              No credits have been issued yet. Tokens are minted upon verification certification.
            </div>
          ) : (
            projectCredits.map(credit => (
              <div key={credit.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-gray-900">Tokenized Carbon Asset</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block text-[11px]">Credit Batch ID</span>
                      <span className="font-semibold text-gray-900 font-mono">{credit.id}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block text-[11px]">NFT Token ID</span>
                      <span className="font-semibold text-forest-700 font-mono">{credit.tokenId}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block text-[11px]">Verified Quantity</span>
                      <span className="font-bold text-gray-900">{formatNumber(credit.quantity)} tCO₂e</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block text-[11px]">Listing Price</span>
                      <span className="font-semibold text-gray-900">
                        {credit.pricePerCredit ? formatINR(credit.pricePerCredit) : 'Unlisted'}
                      </span>
                    </div>
                  </div>

                  <BlockchainRecord
                    tokenId={credit.tokenId}
                    contractAddress={credit.contractAddress}
                    ownerWallet={credit.currentOwner}
                    txHash={credit.issuanceTxHash}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-gray-900">Credit Lifecycle Provenance</h3>
                  <LifecycleTimeline events={credit.lifecycle} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
