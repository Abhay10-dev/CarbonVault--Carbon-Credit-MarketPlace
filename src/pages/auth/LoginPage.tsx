import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Wallet, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth, ROLE_ROOTS } from '@/context/AuthContext';
import { USERS } from '@/data/users';
import { truncateWallet } from '@/lib/utils';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('rajesh@greenroots.in');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (res.ok) {
      const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (user) {
        navigate(ROLE_ROOTS[user.role]);
      }
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleSelectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo123');
    setError(null);
  };

  const handleConnectWallet = () => {
    setIsWalletConnecting(true);
    setTimeout(() => {
      // Connect as Rajesh by default or existing selected user
      setIsWalletConnecting(false);
      const res = login(email, 'wallet_connect');
      if (res.ok) {
        const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (user) navigate(ROLE_ROOTS[user.role]);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-forest-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Left Side: Brand & Overview */}
        <div className="bg-forest-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center text-emerald-300 shadow-sm border border-forest-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight">CarbonVault</span>
                <span className="text-[10px] text-emerald-300 block font-mono">
                  BLOCKCHAIN REGISTRY
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Transparent Carbon Credit Lifecycle
            </h1>
            <p className="text-forest-200 text-sm leading-relaxed mb-6">
              From land record verification & satellite audit to tokenization, secondary market exchange, and permanent retirement.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-forest-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-role verification & due diligence checks</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-forest-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Simulated ERC-721/NFT credit provenance tokens</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-forest-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>On-chain retirement certificates with irreversible offsets</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-forest-800 text-xs text-forest-300 font-mono">
            Prototype Version 1.0 · Simulated Blockchain
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sign In to CarbonVault</h2>
              <p className="text-xs text-gray-500 mt-1">
                Select a demo persona or connect with a simulated Web3 wallet.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider">
                Or Connect Web3
              </span>
            </div>

            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isWalletConnecting}
              className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              {isWalletConnecting ? 'Connecting Mock Wallet...' : 'Connect Simulated Wallet'}
            </button>
          </div>

          {/* Quick Demo Switcher Table */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Select Demo User:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {USERS.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(u.email)}
                  className={`p-2 rounded-lg text-left text-xs border transition-all ${
                    email.toLowerCase() === u.email.toLowerCase()
                      ? 'border-forest-600 bg-forest-50/50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold text-gray-800 block truncate">{u.name}</span>
                  <span className="text-[10px] text-gray-500 capitalize block">
                    {u.role} · {truncateWallet(u.wallet)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
