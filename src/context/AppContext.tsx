import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Project, Credit, Order, Transaction, Notification } from '@/types';
import { PROJECTS } from '@/data/projects';
import { CREDITS } from '@/data/credits';
import { ORDERS } from '@/data/orders';
import { TRANSACTIONS } from '@/data/transactions';
import { NOTIFICATIONS } from '@/data/notifications';

interface AppContextValue {
  projects: Project[];
  credits: Credit[];
  orders: Order[];
  transactions: Transaction[];
  notifications: Notification[];

  addProject: (p: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  addCredit: (c: Credit) => void;
  updateCredit: (id: string, patch: Partial<Credit>) => void;
  addOrder: (o: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  addTransaction: (t: Transaction) => void;
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [credits, setCredits] = useState<Credit[]>(CREDITS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const addProject = useCallback((p: Project) => setProjects(prev => [p, ...prev]), []);
  const updateProject = useCallback((id: string, patch: Partial<Project>) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p)), []);

  const addCredit = useCallback((c: Credit) => setCredits(prev => [c, ...prev]), []);
  const updateCredit = useCallback((id: string, patch: Partial<Credit>) =>
    setCredits(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c)), []);

  const addOrder = useCallback((o: Order) => setOrders(prev => [o, ...prev]), []);
  const updateOrder = useCallback((id: string, patch: Partial<Order>) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o)), []);

  const addTransaction = useCallback((t: Transaction) => setTransactions(prev => [t, ...prev]), []);

  const addNotification = useCallback((n: Notification) =>
    setNotifications(prev => [n, ...prev]), []);

  const markNotificationRead = useCallback((id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);

  const markAllNotificationsRead = useCallback((userId: string) =>
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n)), []);

  return (
    <AppContext.Provider value={{
      projects, credits, orders, transactions, notifications,
      addProject, updateProject,
      addCredit, updateCredit,
      addOrder, updateOrder,
      addTransaction,
      addNotification, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
