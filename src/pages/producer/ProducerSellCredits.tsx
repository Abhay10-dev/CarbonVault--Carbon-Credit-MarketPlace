import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatINR, formatNumber, generateOrderId, generateTxHash } from '@/lib/utils';
import type { Order, Transaction } from '@/types';

export function ProducerSellCredits() {
  const { user } = useAuth();
  const { credits, addOrder, updateCredit, addTransaction, addNotification } = useApp();
  const navigate = useNavigate();

  const myCredits = credits.filter(c => c.producerId === user?.id && (c.status === 'available' || c.status === 'listed'));
  const [selectedCreditId, setSelectedCreditId] = useState(myCredits[0]?.id || '');
  const [quantity, setQuantity] = useState(200);
  const [price, setPrice] = useState(850);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCredit = myCredits.find(c => c.id === selectedCreditId) || myCredits[0];

  const subtotal = quantity * price;
  const platformFee = Math.round(subtotal * 0.01);
  const netEarnings = subtotal - platformFee;

  const handleList = () => {
    if (!selectedCredit) return;

    const orderId = generateOrderId();
    const txHash = generateTxHash();

    const newOrder: Order = {
      id: orderId,
      type: 'sell',
      creditId: selectedCredit.id,
      creditName: selectedCredit.projectName,
      userId: user?.id || 'u001',
      userName: user?.name || 'Rajesh Patil',
      quantity,
      price,
      status: 'listed',
      createdAt: new Date().toISOString(),
    };

    const newTx: Transaction = {
      id: `TX-${Math.floor(80000 + Math.random() * 9999)}`,
      type: 'credit_listing',
      fromId: user?.id || 'u001',
      fromName: user?.name || 'Producer',
      fromWallet: user?.wallet || '0x0',
      toId: user?.id || 'u001',
      toName: user?.name || 'Producer',
      toWallet: user?.wallet || '0x0',
      creditId: selectedCredit.id,
      creditName: selectedCredit.projectName,
      quantity,
      amount: subtotal,
      txHash,
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    addOrder(newOrder);
    addTransaction(newTx);
    updateCredit(selectedCredit.id, {
      status: 'listed',
      pricePerCredit: price,
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: user?.id || 'u001',
      title: 'Credits Listed on Exchange',
      message: `Successfully listed ${quantity} credits of ${selectedCredit.projectName} at ₹${price}/credit.`,
      read: false,
      type: 'success',
      date: new Date().toISOString(),
    });

    setIsConfirmOpen(false);
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/producer/orders');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">List Credits for Sale</h1>
        <p className="text-xs text-gray-500 mt-1">
          Make your verified carbon credits available to corporate buyers on the CarbonVault exchange.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
        {/* Credit Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Select Carbon Credit Batch *
          </label>
          <select
            value={selectedCreditId}
            onChange={e => setSelectedCreditId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          >
            {myCredits.map(c => (
              <option key={c.id} value={c.id}>
                {c.projectName} ({c.tokenId}) — {formatNumber(c.quantity)} tCO₂e Available
              </option>
            ))}
          </select>
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Quantity to Sell (tCO₂e) *
            </label>
            <input
              type="number"
              min="1"
              max={selectedCredit?.quantity || 1000}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
            />
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Max available: {formatNumber(selectedCredit?.quantity || 0)} tCO₂e
            </span>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Asking Price (₹ / Credit) *
            </label>
            <input
              type="number"
              step="10"
              min="100"
              value={price}
              onChange={e => setPrice(Math.max(100, Number(e.target.value)))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
            />
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Average market benchmark: ₹820 – ₹900
            </span>
          </div>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Gross Order Value ({quantity} × {formatINR(price)})</span>
            <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Exchange Custody Fee (1%)</span>
            <span className="text-gray-900">- {formatINR(platformFee)}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
            <span>Net Estimated Payout</span>
            <span className="text-forest-700">{formatINR(netEarnings)}</span>
          </div>
        </div>

        {/* Token summary banner */}
        {selectedCredit && (
          <div className="p-3 bg-forest-50/70 border border-forest-100 rounded-xl flex items-center gap-3 text-xs text-forest-900">
            <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0" />
            <div>
              <span className="font-semibold block">Listing NFT Token {selectedCredit.tokenId}</span>
              <span className="text-[11px] text-forest-700">
                A smart contract lock will reserve these credits in an escrow balance until matched.
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Tag className="w-4 h-4" /> Review & List on Marketplace
        </button>

        {isSuccess && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Order successfully posted to order book! Redirecting...
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Marketplace Listing"
        description={
          <div>
            <p className="mb-2">
              You are about to list <strong>{quantity} credits</strong> of <strong>{selectedCredit?.projectName}</strong> at <strong>{formatINR(price)}/credit</strong>.
            </p>
            <p className="text-xs text-gray-500">
              Total Order: {formatINR(subtotal)} · Token ID: {selectedCredit?.tokenId}
            </p>
          </div>
        }
        confirmText="Confirm Listing"
        onConfirm={handleList}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
