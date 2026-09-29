import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ShoppingCart, Flame, ArrowRightLeft, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { CreditCard } from '@/components/ui/CreditCard';
import { formatNumber, formatINR } from '@/lib/utils';
import type { Credit } from '@/types';

export function MarketCredits() {
  const { user } = useAuth();
  const { credits } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const myCredits = credits.filter(c => c.currentOwnerId === user?.id);

  const filtered = myCredits.filter(c =>
    c.projectName.toLowerCase().includes(search.toLowerCase()) ||
    c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = myCredits.reduce((sum, c) => sum + c.quantity, 0);
  const totalRetired = myCredits
    .filter(c => c.status === 'retired')
    .reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Carbon Credits</h1>
          <p className="text-xs text-gray-500 mt-1">
            Custody holdings, secondary market trading inventory, and retired certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/market/marketplace')}
            className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Buy More Credits
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Total Units Owned</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatNumber(totalCredits)} <span className="text-xs font-normal text-gray-400">tCO₂e</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-forest-50 text-forest-700 rounded-xl">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Available to Trade / Transfer</span>
            <span className="text-2xl font-bold text-forest-800">
              {formatNumber(Math.max(0, totalCredits - totalRetired))} <span className="text-xs font-normal text-gray-400">tCO₂e</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Permanently Retired</span>
            <span className="text-2xl font-bold text-rose-700">
              {formatNumber(totalRetired)} <span className="text-xs font-normal text-gray-400">tCO₂e</span>
            </span>
          </div>
        </div>
      </div>

      {/* Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-800">No Carbon Credits in Portfolio</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Visit the Carbon Marketplace to acquire verified carbon offset units.
            </p>
          </div>
        ) : (
          filtered.map(credit => (
            <CreditCard
              key={credit.id}
              credit={credit}
              onView={(c: Credit) => navigate(`/market/credit/${c.id}`)}
              onRetire={(c: Credit) => navigate('/market/retire')}
              onSell={(c: Credit) => navigate('/producer/sell')}
            />
          ))
        )}
      </div>
    </div>
  );
}
