import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Filter, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CreditCard } from '@/components/ui/CreditCard';
import type { Credit, ProjectType } from '@/types';

export function Marketplace() {
  const { credits } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(1000);

  // Filter listed and available credits
  const listedCredits = credits.filter(c => c.status === 'listed' || c.status === 'available');

  const filteredCredits = listedCredits.filter(c => {
    const matchesSearch =
      c.projectName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.tokenId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || c.projectType === typeFilter;
    const matchesPrice = !c.pricePerCredit || c.pricePerCredit <= priceMax;
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Carbon Credit Exchange</h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore and purchase verified carbon credits issued under independent due diligence accreditation.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project title, state, or NFT Token ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span>Max Price: ₹{priceMax}</span>
              <input
                type="range"
                min="700"
                max="1200"
                step="25"
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-24 accent-forest-700"
              />
            </div>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none"
            >
              <option value="all">All Project Types</option>
              <option value="Reforestation">Reforestation</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Agricultural Practices">Agricultural Practices</option>
              <option value="Waste Management">Waste Management</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex gap-2 overflow-x-auto pt-1 text-xs">
          {['all', 'Reforestation', 'Renewable Energy', 'Agricultural Practices', 'Waste Management'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Credit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCredits.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
            <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-gray-800">No Carbon Credits Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria, raising your price filter, or selecting another project methodology.
            </p>
          </div>
        ) : (
          filteredCredits.map(credit => (
            <CreditCard
              key={credit.id}
              credit={credit}
              onView={(c: Credit) => navigate(`/market/credit/${c.id}`)}
              onBuy={(c: Credit) => navigate(`/market/buy/${c.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
