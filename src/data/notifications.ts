import type { Notification } from '@/types';

export const NOTIFICATIONS: Notification[] = [
  // Producer u001 notifications
  { id: 'n001', userId: 'u001', title: 'Project Submitted', message: 'GreenRoots Reforestation Project has been submitted for verification.', read: true, type: 'success', date: '2026-09-12T10:32:00' },
  { id: 'n002', userId: 'u001', title: 'Additional Documents Required', message: 'Your project PRJ-0012 requires updated plantation count records. Please resubmit.', read: true, type: 'warning', date: '2026-09-12T11:41:00' },
  { id: 'n003', userId: 'u001', title: 'Project Approved', message: 'GreenRoots Reforestation Project (PRJ-0012) has been approved by the certifier.', read: false, type: 'success', date: '2026-09-14T10:20:00' },
  { id: 'n004', userId: 'u001', title: '2,500 Carbon Credits Issued', message: '2,500 carbon credits have been issued for GreenRoots Reforestation Project.', read: false, type: 'success', date: '2026-09-14T10:25:00' },
  { id: 'n005', userId: 'u001', title: 'Order Matched', message: 'Your sell order ORD-1024 for 200 credits has been matched at ₹850/credit.', read: false, type: 'success', date: '2026-09-20T14:35:00' },
  { id: 'n006', userId: 'u001', title: 'AgroCarbon Project Rejected', message: 'Project PRJ-0019 has been rejected. Reason: Carbon calculation methodology not sufficiently documented.', read: true, type: 'warning', date: '2026-09-16T15:00:00' },
  // Certifier u003 notifications
  { id: 'n010', userId: 'u003', title: 'New Verification Request', message: 'GreenRoots Reforestation Project (PRJ-0012) submitted by Rajesh Patil is pending verification.', read: true, type: 'info', date: '2026-09-12T10:32:00' },
  { id: 'n011', userId: 'u003', title: 'Producer Resubmitted Documents', message: 'Rajesh Patil has submitted additional documents for PRJ-0012. Ready for final review.', read: true, type: 'info', date: '2026-09-14T09:12:00' },
  { id: 'n012', userId: 'u003', title: 'New Verification Request', message: 'SolarGrid Renewable Energy Initiative (PRJ-0015) submitted by Priya Sharma is pending verification.', read: false, type: 'info', date: '2026-09-13T10:00:00' },
  { id: 'n013', userId: 'u003', title: 'New Verification Request', message: 'WasteZero Biogas Initiative (PRJ-0022) submitted by Priya Sharma is pending verification.', read: false, type: 'info', date: '2026-09-20T14:00:00' },
  // Market participant u004 notifications
  { id: 'n020', userId: 'u004', title: 'Order Matched', message: 'Your buy order ORD-1028 for 200 GreenRoots credits has been matched at ₹850/credit.', read: true, type: 'success', date: '2026-09-20T14:35:00' },
  { id: 'n021', userId: 'u004', title: '600 Credits Transferred', message: '600 GreenRoots carbon credits (NFT-246) have been transferred to your wallet.', read: false, type: 'success', date: '2026-09-20T14:35:00' },
  { id: 'n022', userId: 'u004', title: 'New Verified Project', message: 'A new verified project is available in the marketplace: SolarGrid Initiative.', read: false, type: 'info', date: '2026-09-28T09:00:00' },
  // Market participant u005 notifications
  { id: 'n030', userId: 'u005', title: '300 Credits Transferred', message: '300 GreenRoots credits (NFT-247) have been transferred to your wallet.', read: true, type: 'success', date: '2026-09-21T09:15:00' },
  { id: 'n031', userId: 'u005', title: 'Credits Retired', message: '300 carbon credits (RET-00091) have been successfully retired. CO₂ Offset: 300 tCO₂e.', read: false, type: 'success', date: '2026-09-25T11:00:00' },
  // Admin u006 notifications
  { id: 'n040', userId: 'u006', title: '42 Projects Pending Verification', message: 'There are 42 projects awaiting verification in the queue.', read: false, type: 'warning', date: '2026-09-29T09:00:00' },
  { id: 'n041', userId: 'u006', title: '2,500 Credits Issued', message: '2,500 credits issued for GreenRoots Reforestation Project (PRJ-0012).', read: true, type: 'success', date: '2026-09-14T10:25:00' },
  { id: 'n042', userId: 'u006', title: 'New User Registered', message: 'Meera Joshi (Market Participant) joined the platform.', read: true, type: 'info', date: '2026-09-21T08:00:00' },
];

export const getNotificationsByUser = (userId: string) =>
  NOTIFICATIONS.filter(n => n.userId === userId).sort((a, b) => b.date.localeCompare(a.date));
