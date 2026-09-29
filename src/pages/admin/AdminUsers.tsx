import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { USERS } from '@/data/users';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  truncateWallet,
  USER_STATUS_COLORS,
  formatDate,
} from '@/lib/utils';
import type { User, Role, UserStatus } from '@/types';

export function AdminUsers() {
  const [userList, setUserList] = useState<User[]>(USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editRole, setEditRole] = useState<Role>('producer');
  const [editStatus, setEditStatus] = useState<UserStatus>('active');

  const filteredUsers = userList.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.organization.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditStatus(user.status);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;
    setUserList(prev =>
      prev.map(u =>
        u.id === selectedUser.id ? { ...u, role: editRole, status: editStatus } : u
      )
    );
    setIsEditModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'User Name',
      render: (u: User) => (
        <div>
          <span className="font-semibold text-gray-900 block">{u.name}</span>
          <span className="text-[11px] text-gray-400">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u: User) => (
        <span className="font-semibold capitalize text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          {u.role}
        </span>
      ),
    },
    {
      key: 'organization',
      header: 'Organization / Company',
      render: (u: User) => <span className="text-gray-700 font-medium">{u.organization}</span>,
    },
    {
      key: 'wallet',
      header: 'Web3 Wallet',
      render: (u: User) => (
        <span className="font-mono text-xs text-gray-500">{truncateWallet(u.wallet)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (u: User) => (
        <StatusBadge
          label={u.status.toUpperCase()}
          colorClass={USER_STATUS_COLORS[u.status]}
        />
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (u: User) => <span className="text-gray-400 text-xs">{formatDate(u.joinedAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u: User) => (
        <button
          onClick={() => handleOpenEdit(u)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
        >
          Manage
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User & Role Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review participant credentials, change role assignments, and manage platform access suspensions.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'producer', 'certifier', 'market', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                roleFilter === role
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : role.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-gray-900">Registered Platform Users</h2>
          </div>
          <span className="text-xs text-gray-400">{filteredUsers.length} Users</span>
        </div>

        <DataTable columns={columns} data={filteredUsers} />
      </div>

      {/* User Edit Modal */}
      {selectedUser && (
        <ConfirmModal
          isOpen={isEditModalOpen}
          title={`Manage User: ${selectedUser.name}`}
          description={
            <div className="space-y-4 my-2 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Role</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as Role)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs text-gray-800"
                >
                  <option value="producer">Producer</option>
                  <option value="certifier">Certifier</option>
                  <option value="market">Market Participant</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as UserStatus)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs text-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          }
          confirmText="Save Changes"
          onConfirm={handleSaveUser}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
