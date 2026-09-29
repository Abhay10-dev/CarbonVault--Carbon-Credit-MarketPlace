import React from 'react';
import { Award, Flame, Trees, Car, Globe, FileCheck2, Printer } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatDate } from '@/lib/utils';

export function MarketImpact() {
  const { user } = useAuth();
  const { credits } = useApp();

  const myCredits = credits.filter(c => c.currentOwnerId === user?.id);
  const totalPurchased = myCredits.reduce((sum, c) => sum + c.quantity, 0);
  const retiredCredits = myCredits.filter(c => c.status === 'retired');
  const totalRetired = retiredCredits.reduce((sum, c) => sum + c.quantity, 0);

  // Equivalencies (1 tCO2 ~ 45 trees seedling grown for 10 years; 1 tCO2 ~ 4,000 km driving)
  const treesEquiv = totalRetired * 45;
  const kmEquiv = totalRetired * 4000;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Environmental Impact Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Realized climate contribution derived exclusively from permanently retired carbon credits.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" /> Export Impact Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total CO₂ Neutralized"
          value={`${formatNumber(totalRetired)} t`}
          subtitle="Net-zero emissions offset"
          icon={<Award className="w-5 h-5 text-forest-700" />}
          colorClass="text-forest-700"
        />
        <StatCard
          title="Tree Seedlings Equivalent"
          value={formatNumber(treesEquiv)}
          subtitle="10-year growth equivalent"
          icon={<Trees className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
        <StatCard
          title="Passenger Km Neutralized"
          value={`${formatNumber(kmEquiv)} km`}
          subtitle="Combustion car emissions"
          icon={<Car className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
        <StatCard
          title="Projects Supported"
          value={retiredCredits.length}
          subtitle="Ecological restoration sites"
          icon={<Globe className="w-5 h-5 text-purple-700" />}
          colorClass="text-purple-700"
        />
      </div>

      {/* Impact Statement Card */}
      <div className="bg-gradient-to-br from-forest-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-md">
        <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">
          OFFICIAL CORPORATE OFFSET STATEMENT
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {user?.organization || 'ABC Corporation'} has permanently sequestered {formatNumber(totalRetired)} metric tonnes of CO₂e
        </h2>
        <p className="text-forest-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Verified on the CarbonVault blockchain registry under strict additionality standards. The associated cryptographic tokens were burned to nullify double-claiming.
        </p>
      </div>

      {/* Retired Certificates List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-forest-700" />
            <h2 className="text-base font-bold text-gray-900">Permanent Retirement Certificates</h2>
          </div>
          <span className="text-xs text-gray-400">{retiredCredits.length} Certificates Issued</span>
        </div>

        <div className="divide-y divide-gray-100">
          {retiredCredits.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No credits have been retired yet. Retiring credits creates irrevocable ESG proof here.
            </div>
          ) : (
            retiredCredits.map(c => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {c.retirementId || 'RET-00091'}
                    </span>
                    <span className="font-semibold text-gray-900">{c.projectName}</span>
                  </div>
                  <p className="text-gray-500">
                    Reason: <strong>{c.retirementReason || 'Corporate Emissions Offset'}</strong> · Retired on {formatDate(c.retiredAt || c.issuanceDate)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-forest-800 block">
                    {formatNumber(c.quantity)} tCO₂e
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Token: {c.tokenId}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
