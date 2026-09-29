import React from 'react';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { CreditCard } from '@/components/ui/CreditCard';
import type { Credit } from '@/types';

export function MarketWatchlist() {
  const { credits } = useApp();
  const navigate = useNavigate();

  // Pick sample watchlisted credits
  const watchlist = credits.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Projects & Watchlist</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor carbon offset projects and credit batches of strategic interest for your corporate net-zero targets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {watchlist.map(credit => (
          <CreditCard
            key={credit.id}
            credit={credit}
            onView={(c: Credit) => navigate(`/market/credit/${c.id}`)}
            onBuy={(c: Credit) => navigate(`/market/buy/${c.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
