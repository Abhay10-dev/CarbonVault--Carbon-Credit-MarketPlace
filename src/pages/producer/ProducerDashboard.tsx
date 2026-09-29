import React from 'react';
import { Link } from 'react-router-dom';
import {
  Folders,
  ClipboardCheck,
  Award,
  TrendingUp,
  FolderPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatINR,
  formatNumber,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';

export function ProducerDashboard() {
  const { user } = useAuth();
  const { projects, credits, transactions } = useApp();

  const myProjects = projects.filter(p => p.producerId === user?.id);
  const myCredits = credits.filter(c => c.producerId === user?.id);

  const totalProjects = myProjects.length;
  const approvedProjects = myProjects.filter(p => p.status === 'approved').length;
  const pendingProjects = myProjects.filter(
    p => p.status === 'under_verification' || p.status === 'submitted' || p.status === 'additional_info_required'
  ).length;

  const totalIssued = myCredits.reduce((sum, c) => sum + c.quantity, 0);
  const totalSold = transactions
    .filter(t => t.fromId === user?.id && (t.type === 'credit_purchase' || t.type === 'credit_transfer'))
    .reduce((sum, t) => sum + t.quantity, 0);
  const totalAvailable = Math.max(0, totalIssued - totalSold);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-800 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-1">
            Producer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-forest-200 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your carbon reduction projects, submit verification evidence, and tokenize verified credits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/producer/projects/create"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> New Project
          </Link>
          <Link
            to="/producer/sell"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            List Credits
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          subtitle="Registered initiatives"
          icon={<Folders className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="Approved Projects"
          value={approvedProjects}
          subtitle="Verified & active"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-700" />}
        />
        <StatCard
          title="In Verification"
          value={pendingProjects}
          subtitle="Under review"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          colorClass="text-amber-700"
        />
        <StatCard
          title="Credits Issued"
          value={`${formatNumber(totalIssued)} t`}
          subtitle="Tokenized CO₂"
          icon={<Award className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="Credits Sold"
          value={`${formatNumber(totalSold)} t`}
          subtitle="Traded on exchange"
          icon={<TrendingUp className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
        <StatCard
          title="Available Credits"
          value={`${formatNumber(totalAvailable)} t`}
          subtitle="Ready to list"
          icon={<Award className="w-5 h-5 text-forest-700" />}
        />
      </div>

      {/* Main Grid: Projects & Verification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Projects Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Projects</h2>
              <p className="text-xs text-gray-500">Your carbon sequestration and offset sites</p>
            </div>
            <Link
              to="/producer/projects"
              className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {myProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">No projects created yet.</div>
            ) : (
              myProjects.map(project => (
                <div key={project.id} className="py-4 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <StatusBadge
                        label={PROJECT_STATUS_LABELS[project.status]}
                        colorClass={PROJECT_STATUS_COLORS[project.status]}
                      />
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span>{project.location}</span>
                      <span>·</span>
                      <span>{project.landInfo.projectArea} hectares</span>
                      <span>·</span>
                      <span className="font-medium text-forest-800">
                        {formatNumber(project.expectedCredits)} tCO₂e est.
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/producer/projects/${project.id}`}
                    className="px-3 py-1.5 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg shrink-0 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Verification Activity & Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Verification Activity</h2>
              <ClipboardCheck className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-900">PRJ-0012 Approved</div>
                  <p className="text-emerald-700 mt-0.5">
                    GreenRoots Reforestation certified. 2,500 NFT credits minted to your wallet.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-amber-900">PRJ-0015 In Review</div>
                  <p className="text-amber-700 mt-0.5">
                    SolarGrid Renewable documents under verification by ACV Agency.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-orange-900">Action Required</div>
                  <p className="text-orange-700 mt-0.5">
                    PRJ-0022 requires updated boundary evidence for 7/12 consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/producer/verification"
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              Check Verification Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
