import React from 'react';
import { Receipt, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatINR,
  formatNumber,
  formatDate,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@/lib/utils';
import type { Order } from '@/types';

export function ProducerOrders() {
  const { user } = useAuth();
  const { orders } = useApp();

  const myOrders = orders.filter(o => o.userId === user?.id);

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (o: Order) => <span className="font-mono font-semibold text-gray-900">{o.id}</span>,
    },
    {
      key: 'creditName',
      header: 'Project / Asset',
      render: (o: Order) => (
        <div>
          <span className="font-medium text-gray-900 block">{o.creditName}</span>
          <span className="text-[11px] text-gray-400 capitalize">{o.type} Order</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (o: Order) => (
        <span className="font-medium text-gray-800">
          {formatNumber(o.quantity)} <span className="text-xs text-gray-400">tCO₂e</span>
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price / Unit',
      render: (o: Order) => (
        <span className="font-medium text-gray-900">{formatINR(o.price)}</span>
      ),
    },
    {
      key: 'total',
      header: 'Order Total',
      render: (o: Order) => (
        <span className="font-bold text-forest-800">{formatINR(o.quantity * o.price)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (o: Order) => (
        <StatusBadge
          label={ORDER_STATUS_LABELS[o.status] || o.status}
          colorClass={ORDER_STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      render: (o: Order) => (
        <span className="text-xs text-gray-500">{formatDate(o.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review active marketplace listings, matched bids, and trade settlements.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-forest-700" />
            <h2 className="text-base font-bold text-gray-900">Submitted Orders</h2>
          </div>
          <span className="text-xs text-gray-500">{myOrders.length} Total Orders</span>
        </div>

        <DataTable
          columns={columns}
          data={myOrders}
          emptyMessage="No marketplace orders recorded."
        />
      </div>
    </div>
  );
}
