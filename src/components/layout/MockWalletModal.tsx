import React, { useState } from 'react';
import { X, Wallet, Copy, CheckCircle2, ArrowUpRight, ArrowDownLeft, ShieldCheck, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { truncateWallet, formatNumber } from '@/lib/utils';

interface MockWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MockWalletModal({ isOpen, onClose }: MockWalletModalProps) {
  const { user } = useAuth();
  const { credits, transactions } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  // Calculate owned credits for this user
  const userCredits = credits.filter(c => c.currentOwnerId === user.id);
  const totalAvailable = userCredits
    .filter(c => c.status === 'available' || c.status === 'listed' || c.status === 'transferred')
    .reduce((sum, c) => sum + c.quantity, 0);

  const totalRetired = credits
    .filter(c => c.currentOwnerId === user.id && c.status === 'retired')
    .reduce((sum, c) => sum + c.quantity, 0);

  // User's recent transactions
  const userTxs = transactions
    .filter(t => t.fromId === user.id || t.toId === user.id)
    .slice(0, 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.wallet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">CarbonVault Web3 Wallet</h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Ethereum Testnet
            </span>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-slate-900 rounded-xl p-4 text-white mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Account Address</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
              {user.role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-wider">{truncateWallet(user.wallet)}</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Copy Address"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">ETH Balance</span>
              <span className="text-lg font-bold text-white">2.845 ETH</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Carbon Credits</span>
              <span className="text-lg font-bold text-emerald-400">
                {formatNumber(totalAvailable)} <span className="text-xs text-slate-400 font-normal">tCO₂e</span>
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            <div>
              <div className="text-[11px] text-gray-500">Active NFTs</div>
              <div className="text-sm font-semibold text-gray-900">{userCredits.length} Tokens</div>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 flex items-center gap-2">
            <Flame className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-[11px] text-gray-500">Retired CO₂</div>
              <div className="text-sm font-semibold text-gray-900">{formatNumber(totalRetired)} tCO₂e</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Recent Blockchain Activity
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {userTxs.length === 0 ? (
              <div className="text-xs text-gray-400 text-center py-3">No recent transactions</div>
            ) : (
              userTxs.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {tx.toId === user.id ? (
                      <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-md bg-blue-100 text-blue-700">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {tx.type.replace('credit_', '')}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {truncateWallet(tx.txHash)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      {tx.toId === user.id ? '+' : '-'}{formatNumber(tx.quantity)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">tCO₂e</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
