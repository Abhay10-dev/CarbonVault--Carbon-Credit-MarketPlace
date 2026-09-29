import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShieldAlert, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatNumber, generateRetirementId, generateTxHash } from '@/lib/utils';
import type { Credit, Transaction } from '@/types';

export function MarketRetire() {
  const { user } = useAuth();
  const { credits, addCredit, addTransaction, addNotification, updateCredit } = useApp();
  const navigate = useNavigate();

  const myCredits = credits.filter(c => c.currentOwnerId === user?.id && c.status !== 'retired');
  const [selectedCreditId, setSelectedCreditId] = useState(myCredits[0]?.id || '');
  const [quantity, setQuantity] = useState(100);
  const [reason, setReason] = useState('Corporate Scope 1 & 2 Emissions Neutralization');
  const [beneficiary, setBeneficiary] = useState(user?.organization || 'ABC Corporation');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [retirementResult, setRetirementResult] = useState<{ id: string; txHash: string } | null>(null);

  const selectedCredit = myCredits.find(c => c.id === selectedCreditId) || myCredits[0];

  const handleRetire = () => {
    if (!selectedCredit) return;

    const retirementId = generateRetirementId();
    const txHash = generateTxHash();

    // If partial retirement, split or mark
    if (quantity >= selectedCredit.quantity) {
      updateCredit(selectedCredit.id, {
        status: 'retired',
        retirementId,
        retirementReason: reason,
        retiredAt: new Date().toISOString(),
      });
    } else {
      // Split into retired batch
      updateCredit(selectedCredit.id, {
        quantity: selectedCredit.quantity - quantity,
      });

      const retiredBatch: Credit = {
        ...selectedCredit,
        id: `CRD-RET-${Math.floor(1000 + Math.random() * 9000)}`,
        quantity,
        status: 'retired',
        retirementId,
        retirementReason: reason,
        retiredAt: new Date().toISOString(),
      };
      addCredit(retiredBatch);
    }

    const burnTx: Transaction = {
      id: `TX-${Math.floor(80000 + Math.random() * 9999)}`,
      type: 'credit_retirement',
      fromId: user?.id || 'u004',
      fromName: user?.name || 'Participant',
      fromWallet: user?.wallet || '0x0',
      toId: 'system',
      toName: 'Retirement Burn Address',
      toWallet: '0x000000000000000000000000000000000000dEaD',
      creditId: selectedCredit.id,
      creditName: selectedCredit.projectName,
      quantity,
      txHash,
      status: 'confirmed',
      date: new Date().toISOString(),
    };
    addTransaction(burnTx);

    addNotification({
      id: `notif-${Date.now()}`,
      userId: user?.id || 'u004',
      title: 'Carbon Credits Retired!',
      message: `${quantity} tCO₂e retired under certificate ${retirementId}. Permanent emissions reduction locked.`,
      read: false,
      type: 'success',
      date: new Date().toISOString(),
    });

    setIsConfirmOpen(false);
    setRetirementResult({ id: retirementId, txHash });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Retire Carbon Credits</h1>
        <p className="text-xs text-gray-500 mt-1">
          Permanently remove carbon credits from market circulation to make official net-zero ESG climate claims.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
        {/* Warning Banner */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-950">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-900">Irreversible Action</h4>
            <p className="text-rose-800 mt-0.5 leading-relaxed">
              Retiring carbon credits burns the NFT tokens on-chain. Retired credits can never be resold, transferred, or relisted, ensuring verifiable additionality against double-counting.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Select Owned Carbon Asset *
          </label>
          <select
            value={selectedCreditId}
            onChange={e => setSelectedCreditId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600"
          >
            {myCredits.map(c => (
              <option key={c.id} value={c.id}>
                {c.projectName} ({c.tokenId}) — {formatNumber(c.quantity)} tCO₂e Available
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Volume to Permanently Retire (tCO₂e) *
          </label>
          <input
            type="number"
            min="1"
            max={selectedCredit?.quantity || 100}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
          />
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Offset Impact: <strong>{formatNumber(quantity)} metric tonnes of CO₂ equivalent</strong>
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Retirement Reason & ESG Objective *
          </label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
          >
            <option value="Corporate Scope 1 & 2 Emissions Neutralization">Corporate Scope 1 & 2 Emissions Neutralization</option>
            <option value="Product Carbon Neutrality Claim">Product Carbon Neutrality Claim</option>
            <option value="Voluntary Net-Zero Target Alignment">Voluntary Net-Zero Target Alignment</option>
            <option value="Annual Sustainability Reporting">Annual Sustainability Reporting</option>
            <option value="Event Emissions Offset">Event Emissions Offset</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Beneficiary Name (Printed on Certificate) *
          </label>
          <input
            type="text"
            value={beneficiary}
            onChange={e => setBeneficiary(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Flame className="w-4 h-4" /> Permanently Burn & Retire Credits
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Permanent Carbon Credit Burn"
        type="danger"
        description={
          <div>
            <p className="mb-2">
              You are about to irreversibly retire <strong>{quantity} tCO₂e</strong> of <strong>{selectedCredit?.projectName}</strong> on behalf of <strong>{beneficiary}</strong>.
            </p>
            <p className="text-xs text-gray-500">
              The credits will be transferred to the dead burn address <code>0x00...dEaD</code> and a unique immutable Retirement ID will be issued.
            </p>
          </div>
        }
        confirmText="Confirm Permanent Retirement"
        onConfirm={handleRetire}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Success Certificate Banner */}
      {retirementResult && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 space-y-4 animate-fade-in shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                IMMUTABLE RETIREMENT CONFIRMED
              </span>
              <h2 className="text-lg font-bold text-gray-900">Certificate of Carbon Retirement</h2>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Retirement ID:</span>
              <span className="font-mono font-bold text-emerald-800">{retirementResult.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Carbon Offset:</span>
              <span className="font-bold text-gray-900">{formatNumber(quantity)} tCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Beneficiary:</span>
              <span className="font-semibold text-gray-900">{beneficiary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Burn Tx Hash:</span>
              <span className="font-mono text-gray-600 truncate max-w-xs">{retirementResult.txHash}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/market/impact')}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            View Environmental Impact Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
