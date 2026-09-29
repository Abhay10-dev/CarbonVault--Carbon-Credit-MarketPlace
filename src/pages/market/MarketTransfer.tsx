import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatNumber, generateTxHash, truncateWallet } from '@/lib/utils';
import type { Transaction } from '@/types';

export function MarketTransfer() {
  const { user } = useAuth();
  const { credits, addTransaction, addNotification, updateCredit } = useApp();
  const navigate = useNavigate();

  const myCredits = credits.filter(c => c.currentOwnerId === user?.id && c.status !== 'retired');
  const [selectedCreditId, setSelectedCreditId] = useState(myCredits[0]?.id || '');
  const [quantity, setQuantity] = useState(50);
  const [recipientWallet, setRecipientWallet] = useState('0xE72A19C8B3F560D4');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCredit = myCredits.find(c => c.id === selectedCreditId) || myCredits[0];

  const handleTransfer = () => {
    if (!selectedCredit) return;

    const txHash = generateTxHash();

    // Deduct quantity
    const newQty = Math.max(0, selectedCredit.quantity - quantity);
    updateCredit(selectedCredit.id, {
      quantity: newQty,
    });

    const newTx: Transaction = {
      id: `TX-${Math.floor(80000 + Math.random() * 9999)}`,
      type: 'credit_transfer',
      fromId: user?.id || 'u004',
      fromName: user?.name || 'Sender',
      fromWallet: user?.wallet || '0x0',
      toId: 'external',
      toName: 'Recipient Wallet',
      toWallet: recipientWallet,
      creditId: selectedCredit.id,
      creditName: selectedCredit.projectName,
      quantity,
      txHash,
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    addTransaction(newTx);

    addNotification({
      id: `notif-${Date.now()}`,
      userId: user?.id || 'u004',
      title: 'Carbon Credits Transferred',
      message: `Transferred ${quantity} credits of ${selectedCredit.projectName} to ${truncateWallet(recipientWallet)}.`,
      read: false,
      type: 'success',
      date: new Date().toISOString(),
    });

    setIsConfirmOpen(false);
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/market/credits');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transfer Carbon Credits</h1>
        <p className="text-xs text-gray-500 mt-1">
          Peer-to-peer on-chain transfer of verified carbon assets to any external Web3 wallet address.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Select Carbon Credit Holding *
          </label>
          <select
            value={selectedCreditId}
            onChange={e => setSelectedCreditId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
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
            Transfer Volume (tCO₂e) *
          </label>
          <input
            type="number"
            min="1"
            max={selectedCredit?.quantity || 100}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
          />
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Max available in batch: {formatNumber(selectedCredit?.quantity || 0)} tCO₂e
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Recipient Web3 Wallet Address *
          </label>
          <input
            type="text"
            value={recipientWallet}
            onChange={e => setRecipientWallet(e.target.value)}
            placeholder="0x..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1.5 text-gray-600">
          <div className="flex justify-between">
            <span>Asset:</span>
            <span className="font-semibold text-gray-900">{selectedCredit?.projectName}</span>
          </div>
          <div className="flex justify-between">
            <span>Token Standard:</span>
            <span className="font-mono text-gray-800">ERC-721 NFT</span>
          </div>
          <div className="flex justify-between">
            <span>Network Gas:</span>
            <span className="text-emerald-700 font-medium">Free (Testnet Escrow)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" /> Review Transfer Details
        </button>

        {isSuccess && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Transfer completed on simulated blockchain! Redirecting...
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Wallet Credit Transfer"
        description={
          <div>
            <p className="mb-2">
              You are about to transfer <strong>{quantity} credits</strong> of <strong>{selectedCredit?.projectName}</strong> to:
            </p>
            <div className="p-2 bg-gray-100 rounded font-mono text-xs text-gray-800 break-all mb-2">
              {recipientWallet}
            </div>
            <p className="text-[11px] text-gray-500">
              This will update on-chain ownership in the simulated contract ledger.
            </p>
          </div>
        }
        confirmText="Confirm Transfer"
        onConfirm={handleTransfer}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
