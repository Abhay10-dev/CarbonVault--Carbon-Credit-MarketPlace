import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, ShoppingCart, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { CreditCard } from '@/components/ui/CreditCard';
import { formatNumber } from '@/lib/utils';
import type { Credit } from '@/types';

export function ProducerCredits() {
  const { user } = useAuth();
  const { credits } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const myCredits = credits.filter(c => c.producerId === user?.id);

  const filteredCredits = myCredits.filter(c =>
    c.projectName.toLowerCase().includes(search.toLowerCase()) ||
    c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = myCredits.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Carbon Credits</h1>
          <p className="text-xs text-gray-500 mt-1">
            Tokenized carbon credits issued following Accredited Carbon Verification audit.
          </p>
        </div>

        <Link
          to="/producer/sell"
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> List Credits for Sale
        </Link>
      </div>

      {/* Summary Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-forest-50 text-forest-700 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Total Minted Carbon Inventory</span>
            <span className="text-2xl font-bold text-forest-900">
              {formatNumber(totalCredits)} <span className="text-sm font-normal text-gray-500">tCO₂e</span>
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search credits or token ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          />
        </div>
      </div>

      {/* Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCredits.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
            <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-800">No Carbon Credits Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Credits appear here as soon as submitted projects pass certifier review and are minted on the simulated blockchain ledger.
            </p>
          </div>
        ) : (
          filteredCredits.map(credit => (
            <CreditCard
              key={credit.id}
              credit={credit}
              onView={(c: Credit) => navigate(`/producer/projects/${c.projectId}`)}
              onSell={() => navigate('/producer/sell')}
            />
          ))
        )}
      </div>
    </div>
  );
}
