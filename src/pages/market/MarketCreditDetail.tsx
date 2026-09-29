import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Award,
  ShoppingCart,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MockMap } from '@/components/ui/MockMap';
import { BlockchainRecord } from '@/components/ui/BlockchainRecord';
import { LifecycleTimeline } from '@/components/ui/LifecycleTimeline';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatINR,
  formatNumber,
  formatDate,
  CREDIT_STATUS_LABELS,
  CREDIT_STATUS_COLORS,
} from '@/lib/utils';

export function MarketCreditDetail() {
  const { id } = useParams<{ id: string }>();
  const { credits, projects } = useApp();
  const navigate = useNavigate();

  const credit = credits.find(c => c.id === id) || credits[0];
  const project = projects.find(p => p.id === credit?.projectId);

  if (!credit) {
    return <div className="p-8 text-center text-gray-500">Credit not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/market/marketplace"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>

      {/* Credit Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge
                label={CREDIT_STATUS_LABELS[credit.status]}
                colorClass={CREDIT_STATUS_COLORS[credit.status]}
              />
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Token: {credit.tokenId}
              </span>
              <span className="font-mono text-xs text-gray-400">
                Batch: {credit.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{credit.projectName}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {credit.location}
              </span>
              <span>·</span>
              <span>Developer: {credit.producerName}</span>
              <span>·</span>
              <span className="text-forest-700 font-semibold">{credit.projectType}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 shrink-0">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Price per Credit</span>
              <span className="text-2xl font-bold text-gray-900">
                {credit.pricePerCredit ? formatINR(credit.pricePerCredit) : 'Market rate'}
              </span>
              <span className="text-[11px] text-gray-500 block">
                Available: <strong>{formatNumber(credit.quantity)} tCO₂e</strong>
              </span>
            </div>

            {credit.status === 'listed' && (
              <button
                onClick={() => navigate(`/market/buy/${credit.id}`)}
                className="px-5 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> Buy Credits
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Due Diligence, Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Scope */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Project Description & Scope</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              {project?.description ||
                'Environmental restoration and emissions reduction project verified under the Indian carbon market offset crediting mechanism.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Approved Methodology</span>
                <span className="font-semibold text-gray-800">{credit.methodology}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Accredited Verifier</span>
                <span className="font-semibold text-gray-800">{credit.verifiedBy}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Verification Date</span>
                <span className="font-semibold text-gray-800">{formatDate(credit.verificationDate)}</span>
              </div>
            </div>
          </div>

          {/* Verification Provenance Checklist */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Accreditation Evidence & Due Diligence
            </h2>
            <p className="text-xs text-gray-500">
              Each credit batch is supported by authenticated cadastral title checks, multi-spectral satellite imagery, and on-site biomass sampling.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
              {[
                'Digital 7/12 Land Title Extract Checked',
                'Survey Boundary Polygon Geometrically Confirmed',
                'High-Resolution Satellite Multi-temporal Overlay',
                'Accredited Agency Carbon Sequestration Model Sign-off',
                'Irreversible Additionality Baseline Satisfied',
                'ERC-721 Token Provenance Smart Contract Verified',
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-emerald-50/50 border border-emerald-100/70 rounded-xl flex items-center gap-2 text-emerald-950 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geospatial Map */}
          {project && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest-700" />
                Project Location & Land Parcel
              </h2>
              <MockMap
                latitude={project.landInfo.latitude}
                longitude={project.landInfo.longitude}
                projectArea={project.landInfo.projectArea}
                surveyNumber={project.landInfo.surveyNumber}
                projectName={credit.projectName}
              />
            </div>
          )}
        </div>

        {/* Right Col: Blockchain Record & Lifecycle Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Blockchain Asset Token</h3>
            <BlockchainRecord
              tokenId={credit.tokenId}
              contractAddress={credit.contractAddress}
              ownerWallet={credit.currentOwner}
              txHash={credit.issuanceTxHash}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Complete Credit Lifecycle</h3>
            <LifecycleTimeline events={credit.lifecycle} />
          </div>
        </div>
      </div>
    </div>
  );
}
