import React, { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export function AdminSettings() {
  const [platformName, setPlatformName] = useState('CarbonVault');
  const [currency, setCurrency] = useState('INR (₹)');
  const [network, setNetwork] = useState('Ethereum Goerli Testnet');
  const [fee, setFee] = useState('1.0%');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Configuration & Parameters</h1>
        <p className="text-xs text-gray-500 mt-1">
          Global exchange registry rules, smart contract deployment parameters, and fee schedules.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Platform Brand Name</label>
            <input
              type="text"
              value={platformName}
              onChange={e => setPlatformName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Base Currency Settlement</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Configured as Indian Rupee (INR)</span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Exchange Matching Fee</label>
              <input
                type="text"
                value={fee}
                onChange={e => setFee(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Blockchain Ledger Target</label>
            <input
              type="text"
              value={network}
              onChange={e => setNetwork(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-mono text-gray-900"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
            <div>
              <span className="font-semibold text-gray-900 block">System Event Alerts & Push Notifications</span>
              <span className="text-[11px] text-gray-400">Broadcast verification status updates to participants</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={e => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Save System Parameters
          </button>

          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Platform configuration parameters updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
