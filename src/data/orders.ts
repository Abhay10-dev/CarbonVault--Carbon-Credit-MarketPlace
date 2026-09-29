import type { Order } from '@/types';

export const ORDERS: Order[] = [
  { id: 'ORD-1024', type: 'sell', creditId: 'CRD-000245', creditName: 'GreenRoots Reforestation', userId: 'u001', userName: 'Rajesh Patil', quantity: 200, price: 850, status: 'matched', createdAt: '2026-09-15T10:00:00', matchedOrderId: 'ORD-1028' },
  { id: 'ORD-1025', type: 'sell', creditId: 'CRD-000245', creditName: 'GreenRoots Reforestation', userId: 'u001', userName: 'Rajesh Patil', quantity: 100, price: 875, status: 'listed', createdAt: '2026-09-15T10:30:00' },
  { id: 'ORD-1026', type: 'sell', creditId: 'CRD-000245', creditName: 'GreenRoots Reforestation', userId: 'u001', userName: 'Rajesh Patil', quantity: 250, price: 820, status: 'completed', createdAt: '2026-09-16T09:00:00' },
  { id: 'ORD-1027', type: 'sell', creditId: 'CRD-000248', creditName: 'GreenRoots Reforestation', userId: 'u004', userName: 'Abhay Kumar', quantity: 150, price: 900, status: 'listed', createdAt: '2026-09-23T11:00:00' },
  { id: 'ORD-1028', type: 'buy', creditId: 'CRD-000245', creditName: 'GreenRoots Reforestation', userId: 'u004', userName: 'Abhay Kumar', quantity: 200, price: 850, status: 'completed', createdAt: '2026-09-20T14:00:00', matchedOrderId: 'ORD-1024' },
  { id: 'ORD-1029', type: 'buy', creditId: 'CRD-000245', creditName: 'GreenRoots Reforestation', userId: 'u004', userName: 'Abhay Kumar', quantity: 100, price: 840, status: 'pending', createdAt: '2026-09-28T10:00:00' },
  { id: 'ORD-1030', type: 'buy', creditId: 'CRD-000245', creditName: 'GreenRoots Reforestation', userId: 'u005', userName: 'Meera Joshi', quantity: 300, price: 850, status: 'completed', createdAt: '2026-09-21T09:00:00' },
  { id: 'ORD-1031', type: 'sell', creditId: 'CRD-000246', creditName: 'GreenRoots Reforestation', userId: 'u004', userName: 'Abhay Kumar', quantity: 100, price: 860, status: 'listed', createdAt: '2026-09-25T14:00:00' },
];

export const getOrdersByUser = (userId: string) => ORDERS.filter(o => o.userId === userId);
export const getBuyOrders = () => ORDERS.filter(o => o.type === 'buy' && o.status !== 'completed');
export const getSellOrders = () => ORDERS.filter(o => o.type === 'sell' && (o.status === 'listed' || o.status === 'pending'));
