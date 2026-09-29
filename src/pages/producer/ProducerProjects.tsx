import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, Search, MapPin, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatNumber,
  formatDate,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';
import type { ProjectStatus } from '@/types';

export function ProducerProjects() {
  const { user } = useAuth();
  const { projects } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const myProjects = projects.filter(p => p.producerId === user?.id);

  const filteredProjects = myProjects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Carbon Projects</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track registration, due diligence documentation, and certification progress.
          </p>
        </div>

        <Link
          to="/producer/projects/create"
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <FolderPlus className="w-4 h-4" /> Create New Project
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, ID, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'approved', 'under_verification', 'additional_info_required', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all'
                ? 'All Statuses'
                : PROJECT_STATUS_LABELS[status as ProjectStatus] || status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-200 p-8">
            <h3 className="text-sm font-semibold text-gray-800">No Projects Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No registered carbon project matches your current filter query.
            </p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge
                    label={PROJECT_STATUS_LABELS[project.status]}
                    colorClass={PROJECT_STATUS_COLORS[project.status]}
                  />
                  <span className="text-xs font-mono text-gray-400">{project.id}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
                  {project.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-3 mb-4 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Area</span>
                    <span className="font-semibold text-gray-800">
                      {project.landInfo.projectArea} ha
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Est. CO₂ Removal</span>
                    <span className="font-semibold text-forest-800 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-forest-600" />
                      {formatNumber(project.expectedCredits)} t
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Methodology</span>
                    <span className="font-medium text-gray-700 truncate block">
                      {project.methodology}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Submitted</span>
                    <span className="font-medium text-gray-700">
                      {formatDate(project.submittedAt || project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/producer/projects/${project.id}`}
                className="w-full py-2 bg-gray-100 hover:bg-forest-50 hover:text-forest-800 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                Open Project Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
