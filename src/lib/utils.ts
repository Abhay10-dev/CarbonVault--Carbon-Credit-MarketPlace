import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProjectStatus, CreditStatus, OrderStatus, TxStatus, UserStatus, DocumentStatus } from '@/types';

// ─── Tailwind class merge ──────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency formatting (INR, Intl.NumberFormat) ─────────────────────────
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

// ─── Date formatting ───────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Status display helpers ────────────────────────────────────────────────
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_verification: 'Under Verification',
  additional_info_required: 'Info Required',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  under_verification: 'bg-amber-100 text-amber-700',
  additional_info_required: 'bg-orange-100 text-orange-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export const CREDIT_STATUS_LABELS: Record<CreditStatus, string> = {
  issued: 'Issued',
  available: 'Available',
  listed: 'Listed',
  sold: 'Sold',
  transferred: 'Transferred',
  retired: 'Retired',
  revoked: 'Revoked',
};

export const CREDIT_STATUS_COLORS: Record<CreditStatus, string> = {
  issued: 'bg-blue-100 text-blue-700',
  available: 'bg-green-100 text-green-700',
  listed: 'bg-emerald-100 text-emerald-700',
  sold: 'bg-purple-100 text-purple-700',
  transferred: 'bg-indigo-100 text-indigo-700',
  retired: 'bg-gray-100 text-gray-600',
  revoked: 'bg-red-100 text-red-700',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  matched: 'Matched',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'Expired',
  listed: 'Listed',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  matched: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
  listed: 'bg-emerald-100 text-emerald-700',
};

export const TX_STATUS_COLORS: Record<TxStatus, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-600',
};

export const DOC_STATUS_COLORS: Record<DocumentStatus, string> = {
  uploaded: 'bg-blue-100 text-blue-700',
  under_review: 'bg-amber-100 text-amber-700',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  requires_update: 'bg-orange-100 text-orange-700',
};

export const DOC_STATUS_LABELS: Record<DocumentStatus, string> = {
  uploaded: 'Uploaded',
  under_review: 'Under Review',
  verified: 'Verified',
  rejected: 'Rejected',
  requires_update: 'Requires Update',
};

// ─── Wallet address truncation ─────────────────────────────────────────────
export function truncateWallet(wallet: string): string {
  if (wallet.length <= 10) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export function truncateTxHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

// ─── Generate mock IDs ─────────────────────────────────────────────────────
export function generateTxHash(): string {
  const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${hex}`;
}

export function generateOrderId(): string {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateRetirementId(): string {
  return `RET-${String(Math.floor(90000 + Math.random() * 9999)).padStart(5, '0')}`;
}
