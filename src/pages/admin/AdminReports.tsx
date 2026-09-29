import React from 'react';
import { TrendingUp, Printer, Folders, Award, Users, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatINR } from '@/lib/utils';

export function AdminReports() {
  const { projects, credits, transactions } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Analytics & Reports</h1>
          <p className="text-xs text-gray-500 mt-1">
            Aggregated institutional statistics across ecological projects, verification velocity, and secondary exchange liquidity.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Quarterly Report
        </button>
      </div>

      {/* High-level Aggregate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Folders className="w-5 h-5 text-forest-700" />
            <h2 className="text-base font-bold text-gray-900">Project Supply Velocity</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Cumulative Proposals:</span>
              <span className="font-bold text-gray-900">356 Projects</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Certified Issuances:</span>
              <span className="font-bold text-emerald-700">271 Approved (76%)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Average Audit Turnaround:</span>
              <span className="font-bold text-gray-900">3.8 Business Days</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Total Hectares Mapped:</span>
              <span className="font-bold text-forest-800">4,280 Hectares</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-gray-900">Credit Tokenization Metrics</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Total Credits Minted:</span>
              <span className="font-bold text-gray-900">185,420 tCO₂e</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Permanently Retired:</span>
              <span className="font-bold text-rose-700">18,430 tCO₂e (10%)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Average Settlement Price:</span>
              <span className="font-bold text-gray-900">₹855 / Credit</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Gross Carbon Value:</span>
              <span className="font-bold text-forest-800">₹15,85,34,100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-700" />
            <h2 className="text-base font-bold text-gray-900">Marketplace Liquidity</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Total Trading Volume:</span>
              <span className="font-bold text-gray-900">72,850 tCO₂e</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Executed Bilateral Trades:</span>
              <span className="font-bold text-purple-800">2,841 Settlements</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Matching Engine Fill Rate:</span>
              <span className="font-bold text-emerald-700">87.4%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Platform Custody Fees (1%):</span>
              <span className="font-bold text-gray-900">₹6,22,867</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
