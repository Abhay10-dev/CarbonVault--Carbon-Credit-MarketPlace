import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  formatINR,
  formatNumber,
  generateOrderId,
  generateTxHash,
  truncateWallet,
} from '@/lib/utils';
import type { Order, Transaction, Credit } from '@/types';

export function MarketBuyCredits() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, addCredit, addOrder, addTransaction, addNotification, updateCredit } = useApp();

  const credit = credits.find(c => c.id === id) || credits[0];
  const [quantity, setQuantity] = useState(100);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState<string | null>(null);

  if (!credit) {
    return <div className="p-8 text-center text-gray-500">Credit batch not found</div>;
  }

  const unitPrice = credit.pricePerCredit || 850;
  const subtotal = quantity * unitPrice;
  const platformFee = Math.round(subtotal * 0.01);
  const totalAmount = subtotal + platformFee;

  const handleInitialConfirm = () => {
    setIsConfirmOpen(false);
    setIsWalletModalOpen(true);
  };

  const handleWalletSign = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsWalletModalOpen(false);

      const txHash = generateTxHash();
      const orderId = generateOrderId();
      setTxConfirmed(txHash);

      // Create new owned credit batch for buyer
      const purchasedCreditId = `CRD-BUY-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOwnedCredit: Credit = {
        ...credit,
        id: purchasedCreditId,
        quantity,
        currentOwnerId: user?.id || 'u004',
        currentOwner: user?.wallet || '0x91B782F3D4E56A12',
        status: 'available',
        pricePerCredit: unitPrice,
        lifecycle: [
          ...credit.lifecycle,
          {
            stage: 'Purchased on Exchange',
            date: new Date().toISOString().split('T')[0],
            actor: user?.name || 'Buyer',
            txHash,
            status: 'completed',
          },
        ],
      };

      // Reduce seller quantity
      const remainingSellerQty = Math.max(0, credit.quantity - quantity);
      updateCredit(credit.id, {
        quantity: remainingSellerQty,
        status: remainingSellerQty === 0 ? 'sold' : 'listed',
      });

      addCredit(newOwnedCredit);

      // Create completed order
      const newOrder: Order = {
        id: orderId,
        type: 'buy',
        creditId: credit.id,
        creditName: credit.projectName,
        userId: user?.id || 'u004',
        userName: user?.name || 'Buyer',
        quantity,
        price: unitPrice,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      addOrder(newOrder);

      // Create ledger transaction
      const newTx: Transaction = {
        id: `TX-${Math.floor(80000 + Math.random() * 9999)}`,
        type: 'credit_purchase',
        fromId: credit.producerId,
        fromName: credit.producerName,
        fromWallet: credit.currentOwner,
        toId: user?.id || 'u004',
        toName: user?.name || 'Buyer',
        toWallet: user?.wallet || '0x91B782F3D4E56A12',
        creditId: credit.id,
        creditName: credit.projectName,
        quantity,
        amount: totalAmount,
        txHash,
        status: 'confirmed',
        date: new Date().toISOString(),
      };
      addTransaction(newTx);

      // Add notification
      addNotification({
        id: `notif-${Date.now()}`,
        userId: user?.id || 'u004',
        title: 'Carbon Credits Purchased!',
        message: `Successfully acquired ${quantity} credits of ${credit.projectName} (${credit.tokenId}). Tx Hash: ${txHash.slice(0, 10)}...`,
        read: false,
        type: 'success',
        date: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to={`/market/credit/${credit.id}`}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Credit Overview
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Purchase Carbon Credits</h1>
        <p className="text-xs text-gray-500 mt-1">
          Instant settlement via simulated ERC-721 smart contract escrow.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Project Card Snippet */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-gray-400 block">{credit.tokenId}</span>
            <h3 className="font-bold text-gray-900 text-sm">{credit.projectName}</h3>
            <span className="text-xs text-gray-500">{credit.location} · {credit.projectType}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Unit Price</span>
            <span className="font-bold text-forest-800 text-sm">{formatINR(unitPrice)}</span>
          </div>
        </div>

        {/* Quantity Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Specify Desired Volume (tCO₂e)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max={credit.quantity}
              value={quantity}
              onChange={e => setQuantity(Math.min(credit.quantity, Math.max(1, Number(e.target.value))))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
            <span className="text-xs font-medium text-gray-500 shrink-0">tCO₂e</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Maximum available: {formatNumber(credit.quantity)} credits
          </span>
        </div>

        {/* Quick quantity presets */}
        <div className="flex gap-2 text-xs">
          {[25, 50, 100, 250, 500].map(qty => (
            <button
              key={qty}
              type="button"
              disabled={qty > credit.quantity}
              onClick={() => setQuantity(qty)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700 disabled:opacity-30"
            >
              +{qty} t
            </button>
          ))}
        </div>

        {/* Financial Breakdown Table */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-xs space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({quantity} Credits @ {formatINR(unitPrice)})</span>
            <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Matching & Registry Fee (1%)</span>
            <span className="text-gray-900">+{formatINR(platformFee)}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
            <span>Total Payable</span>
            <span className="text-forest-700">{formatINR(totalAmount)}</span>
          </div>
        </div>

        {/* Buyer Wallet Preview */}
        <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between text-xs text-purple-950">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-purple-700" />
            <span>Buyer Custody Wallet: <strong>{truncateWallet(user?.wallet || '0x0')}</strong></span>
          </div>
          <span className="font-mono text-[11px] text-purple-700">2.84 ETH Available</span>
        </div>

        {/* Purchase Action Button */}
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> Review & Confirm Order
        </button>
      </div>

      {/* Confirmation Step 1 Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Carbon Credit Purchase"
        description={
          <div>
            <p className="mb-2">
              You are about to buy <strong>{quantity} carbon credits</strong> of <strong>{credit.projectName}</strong>.
            </p>
            <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1 my-2">
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span className="font-semibold">{formatINR(unitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-forest-800">{formatINR(totalAmount)}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-gray-500">
                <span>Token ID:</span>
                <span>{credit.tokenId}</span>
              </div>
            </div>
          </div>
        }
        confirmText="Proceed to Wallet Sign"
        onConfirm={handleInitialConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Simulated Web3 Wallet Modal (Step 2) */}
      <ConfirmModal
        isOpen={isWalletModalOpen}
        title="Simulated Web3 Signature Request"
        description={
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-xl text-white text-xs font-mono">
              <div className="text-slate-400 text-[10px] mb-1">INTERACTING WITH SMART CONTRACT</div>
              <div className="truncate text-emerald-400">{credit.contractAddress}</div>
              <div className="text-slate-400 text-[10px] mt-2">FUNCTION: transferFrom(seller, buyer, {quantity})</div>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Estimated Gas:</span>
                <span className="font-mono text-gray-800">0.0018 ETH (~₹380)</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-gray-800">Ethereum Goerli Testnet</span>
              </div>
            </div>
          </div>
        }
        confirmText={isProcessing ? 'Confirming on-chain...' : 'Sign & Submit Transaction'}
        isLoading={isProcessing}
        onConfirm={handleWalletSign}
        onCancel={() => setIsWalletModalOpen(false)}
      />

      {/* Success Banner */}
      {txConfirmed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold text-emerald-950">Transaction Successfully Confirmed!</h2>
          <p className="text-xs text-emerald-800">
            {quantity} carbon credits have been added to your portfolio.
          </p>
          <div className="font-mono text-[11px] text-emerald-700 bg-emerald-100/70 p-2 rounded-lg max-w-md mx-auto truncate">
            TX: {txConfirmed}
          </div>
          <button
            onClick={() => navigate('/market/credits')}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            View in My Portfolio
          </button>
        </div>
      )}
    </div>
  );
}
