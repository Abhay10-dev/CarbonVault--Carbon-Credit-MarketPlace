import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  MapPin,
  Award,
  Layers,
  Send,
  Building,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { MockMap } from '@/components/ui/MockMap';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDate,
  formatNumber,
  generateTxHash,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  DOC_STATUS_LABELS,
  DOC_STATUS_COLORS,
} from '@/lib/utils';
import type { Credit, Transaction } from '@/types';

export function CertifierReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, updateProject, addCredit, addTransaction, addNotification } = useApp();

  const project = projects.find(p => p.id === id) || projects[1]; // default to PRJ-0015 if not specified

  // Local checklist state for interactive verification
  const [checklist, setChecklist] = useState([
    { label: 'Project General Information & Eligibility', done: true },
    { label: 'Producer Legal Identity & Authorization', done: true },
    { label: 'Revenue Land 7/12 & 8A Record Authenticity', done: true },
    { label: 'Project Parcel Boundary Geometry Congruence', done: true },
    { label: 'GPS Coordinates Precision & Boundary Closure', done: true },
    { label: 'Baseline Satellite Imagery & Multi-temporal Verification', done: true },
    { label: 'Physical Site Plantation / Installation Photos', done: true },
    { label: 'Carbon Accounting Sequestration Calculations', done: true },
    { label: 'Additionality & Environmental Safeguards Assessment', done: true },
    { label: 'Statutory Local Permissions & Approvals', done: true },
  ]);

  const toggleChecklist = (index: number) => {
    setChecklist(prev =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  };

  const progressPercent = Math.round(
    (checklist.filter(c => c.done).length / checklist.length) * 100
  );

  // Modals state
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Form states
  const [infoComment, setInfoComment] = useState(
    'Please provide an updated land record extract (7/12) and clarify boundary polygon discrepancies with Gat survey maps.'
  );
  const [rejectReason, setRejectReason] = useState('Invalid documentation');
  const [rejectComment, setRejectComment] = useState('Submitted methodology lacks validated baseline stock metrics.');

  if (!project) {
    return <div className="p-8 text-center text-gray-500">Project not found</div>;
  }

  // Action: Approve
  const handleApprove = () => {
    const txHash = generateTxHash();
    const tokenId = `NFT-${Math.floor(250 + Math.random() * 200)}`;
    const creditId = `CRD-000${Math.floor(250 + Math.random() * 100)}`;

    const newCredit: Credit = {
      id: creditId,
      projectId: project.id,
      projectName: project.name,
      projectType: project.type,
      producerId: project.producerId,
      producerName: project.producerName,
      quantity: project.expectedCredits,
      tokenId,
      contractAddress: '0x8A7B3C4D5E6F7A8B',
      currentOwner: '0x7A32F18B9E4D92F1', // producer wallet
      currentOwnerId: project.producerId,
      status: 'available',
      pricePerCredit: 850,
      issuanceDate: new Date().toISOString().split('T')[0],
      issuanceTxHash: txHash,
      location: project.location,
      methodology: project.methodology,
      verifiedBy: user?.organization || 'Green Certification Agency',
      verificationDate: new Date().toISOString().split('T')[0],
      lifecycle: [
        { stage: 'Project Created', date: formatDate(project.createdAt), actor: project.producerName, status: 'completed' },
        { stage: 'Verified', date: new Date().toISOString().split('T')[0], actor: user?.name || 'Certifier', txHash: '0xVERIFIED', status: 'completed' },
        { stage: 'Credit Issued', date: new Date().toISOString().split('T')[0], actor: 'System', txHash, status: 'completed' },
        { stage: 'Tokenized', date: new Date().toISOString().split('T')[0], actor: 'System', txHash: `0xMINT-${tokenId}`, status: 'completed' },
        { stage: 'Listed', date: '', actor: '', status: 'pending' },
        { stage: 'Traded', date: '', actor: '', status: 'pending' },
        { stage: 'Retired', date: '', actor: '', status: 'pending' },
      ],
    };

    const newTx: Transaction = {
      id: `TX-${Math.floor(80000 + Math.random() * 9999)}`,
      type: 'credit_mint',
      fromId: 'system',
      fromName: 'System',
      fromWallet: '0x0000000000000000',
      toId: project.producerId,
      toName: project.producerName,
      toWallet: '0x7A32F18B9E4D92F1',
      creditId,
      creditName: project.name,
      quantity: project.expectedCredits,
      txHash,
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    updateProject(project.id, {
      status: 'approved',
      issuedCredits: project.expectedCredits,
      approvedAt: new Date().toISOString(),
      verification: project.verification
        ? {
            ...project.verification,
            decision: 'approved',
            completedAt: new Date().toISOString(),
            auditTrail: [
              ...project.verification.auditTrail,
              {
                timestamp: new Date().toISOString(),
                actor: user?.name || 'Certifier',
                role: 'Certifier',
                action: 'Certified and Approved Project for Tokenization',
                detail: `Minted ${project.expectedCredits} credits (${tokenId})`,
              },
            ],
          }
        : undefined,
    });

    addCredit(newCredit);
    addTransaction(newTx);

    addNotification({
      id: `notif-${Date.now()}`,
      userId: project.producerId,
      title: 'Project Approved & Credits Issued!',
      message: `${project.name} has been certified. ${project.expectedCredits} carbon credits minted to your wallet.`,
      read: false,
      type: 'success',
      date: new Date().toISOString(),
    });

    setIsApproveOpen(false);
    navigate('/certifier/queue');
  };

  // Action: Request Info
  const handleRequestInfo = () => {
    updateProject(project.id, {
      status: 'additional_info_required',
      verification: project.verification
        ? {
            ...project.verification,
            decision: 'info_requested',
            decisionReason: infoComment,
            auditTrail: [
              ...project.verification.auditTrail,
              {
                timestamp: new Date().toISOString(),
                actor: user?.name || 'Certifier',
                role: 'Certifier',
                action: 'Requested clarification from producer',
                detail: infoComment,
              },
            ],
          }
        : undefined,
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: project.producerId,
      title: 'Clarification Required for Verification',
      message: infoComment,
      read: false,
      type: 'warning',
      date: new Date().toISOString(),
    });

    setIsInfoOpen(false);
    navigate('/certifier/queue');
  };

  // Action: Reject
  const handleReject = () => {
    updateProject(project.id, {
      status: 'rejected',
      verification: project.verification
        ? {
            ...project.verification,
            decision: 'rejected',
            decisionReason: `${rejectReason}: ${rejectComment}`,
            completedAt: new Date().toISOString(),
            auditTrail: [
              ...project.verification.auditTrail,
              {
                timestamp: new Date().toISOString(),
                actor: user?.name || 'Certifier',
                role: 'Certifier',
                action: 'Project REJECTED',
                detail: `${rejectReason}: ${rejectComment}`,
              },
            ],
          }
        : undefined,
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: project.producerId,
      title: 'Project Verification Rejected',
      message: `Project ${project.id} was rejected. Reason: ${rejectReason}.`,
      read: false,
      type: 'warning',
      date: new Date().toISOString(),
    });

    setIsRejectOpen(false);
    navigate('/certifier/queue');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <Link
            to="/certifier/queue"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Verification Queue
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
            <StatusBadge
              label={PROJECT_STATUS_LABELS[project.status]}
              colorClass={PROJECT_STATUS_COLORS[project.status]}
            />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Producer: <strong>{project.producerName}</strong> · Location: {project.location} · ID: {project.id}
          </p>
        </div>

        {/* Audit Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            className="px-3.5 py-2 border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" /> Request Info
          </button>
          <button
            type="button"
            onClick={() => setIsRejectOpen(true)}
            className="px-3.5 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button
            type="button"
            onClick={() => setIsApproveOpen(true)}
            disabled={progressPercent < 80}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <ShieldCheck className="w-4 h-4" /> Approve & Certify
          </button>
        </div>
      </div>

      {/* Verification Checklist Progress Widget */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-gray-900 mb-2">
          <span>Verification Checklist Progress</span>
          <span className="text-forest-700">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Click checklist items below to toggle verification checks before issuing certification approval.
        </p>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Land, Docs, Geospatial & Carbon Calc */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Land Records & Consistency */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Land Record & Survey Verification
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Land Consistency Passed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Survey / Gat No.</span>
                <span className="font-semibold text-gray-900 font-mono">{project.landInfo.surveyNumber}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Taluka / District</span>
                <span className="font-semibold text-gray-900">{project.landInfo.taluka}, {project.landInfo.district}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Claimed Area</span>
                <span className="font-semibold text-gray-900">{project.landInfo.projectArea} ha</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Total Title Parcel</span>
                <span className="font-semibold text-gray-900">{project.landInfo.totalArea} ha</span>
              </div>
            </div>

            {/* Satellite Map */}
            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-1">
                Geospatial Boundary & Satellite Overlap
              </span>
              <MockMap
                latitude={project.landInfo.latitude}
                longitude={project.landInfo.longitude}
                projectArea={project.landInfo.projectArea}
                surveyNumber={project.landInfo.surveyNumber}
                projectName={project.name}
              />
            </div>
          </div>

          {/* Section: Document Review Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              Document Due Diligence
            </h2>

            <div className="divide-y divide-gray-100 text-xs">
              {project.documents.map(doc => (
                <div key={doc.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                    <span className="text-[11px] text-gray-400">
                      Category: {doc.category} · Uploaded: {formatDate(doc.uploadedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      label={DOC_STATUS_LABELS[doc.status]}
                      colorClass={DOC_STATUS_COLORS[doc.status]}
                    />
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-500" title="Verify Document">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-700 text-gray-500" title="Flag Document">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Carbon Accounting Evaluation */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-forest-700" />
              Carbon Sequestration Methodology Review
            </h2>

            <div className="p-4 bg-gray-50 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Methodology Framework:</span>
                <span className="font-semibold text-gray-900">{project.methodology}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Annual CO₂ Removal:</span>
                <span className="font-semibold text-forest-800">
                  {formatNumber(Math.round(project.expectedCredits / 5))} tCO₂e / year
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Verification Crediting Period:</span>
                <span className="font-semibold text-gray-900">5 Years</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                <span>Eligible Credits to Issue upon Approval:</span>
                <span className="text-forest-700">{formatNumber(project.expectedCredits)} tCO₂e</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Checklist & Decision Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Auditor Sign-Off Checklist
            </h3>

            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                    item.done
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 font-medium'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                      item.done ? 'bg-emerald-600 text-white' : 'border border-gray-300'
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-[11px] leading-tight select-none">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsApproveOpen(true)}
                disabled={progressPercent < 80}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4" /> Certify & Issue Credits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <ConfirmModal
        isOpen={isApproveOpen}
        title="Confirm Carbon Credit Certification"
        type="success"
        description={
          <div>
            <p className="mb-2">
              You are certifying that <strong>{project.name}</strong> satisfies all verification due diligence guidelines.
            </p>
            <p className="text-xs text-gray-600">
              <strong>{formatNumber(project.expectedCredits)} tCO₂e</strong> will be tokenized as an ERC-721 credit NFT and minted directly into the developer's wallet.
            </p>
          </div>
        }
        confirmText="Confirm & Issue Credits"
        onConfirm={handleApprove}
        onCancel={() => setIsApproveOpen(false)}
      />

      {/* Request Info Modal */}
      <ConfirmModal
        isOpen={isInfoOpen}
        title="Request Additional Information"
        type="warning"
        description={
          <div>
            <p className="mb-2">
              Send a clarification request to <strong>{project.producerName}</strong>. The project status will become <em>Additional Information Required</em>.
            </p>
            <textarea
              rows={3}
              value={infoComment}
              onChange={e => setInfoComment(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
            />
          </div>
        }
        confirmText="Send Clarification Request"
        onConfirm={handleRequestInfo}
        onCancel={() => setIsInfoOpen(false)}
      />

      {/* Reject Modal */}
      <ConfirmModal
        isOpen={isRejectOpen}
        title="Reject Carbon Project Proposal"
        type="danger"
        description={
          <div>
            <p className="mb-2">
              Specify the primary regulatory or evidential ground for rejection.
            </p>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs mb-2"
            >
              <option value="Invalid documentation">Invalid documentation</option>
              <option value="Ownership record mismatch">Ownership record mismatch</option>
              <option value="Insufficient baseline evidence">Insufficient baseline evidence</option>
              <option value="Geospatial boundary discrepancy">Geospatial boundary discrepancy</option>
              <option value="Carbon calculation methodology flawed">Carbon calculation methodology flawed</option>
            </select>
            <textarea
              rows={2}
              value={rejectComment}
              onChange={e => setRejectComment(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
            />
          </div>
        }
        confirmText="Confirm Rejection"
        onConfirm={handleReject}
        onCancel={() => setIsRejectOpen(false)}
      />
    </div>
  );
}
