import type { AuditLog } from '@/types';

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al001', timestamp: '2026-09-10T09:00:00', userId: 'u001', userName: 'Rajesh Patil', role: 'producer', action: 'Created project', entity: 'Project', entityId: 'PRJ-0012', result: 'success' },
  { id: 'al002', timestamp: '2026-09-12T10:32:00', userId: 'u001', userName: 'Rajesh Patil', role: 'producer', action: 'Submitted project for verification', entity: 'Project', entityId: 'PRJ-0012', result: 'success' },
  { id: 'al003', timestamp: '2026-09-12T11:04:00', userId: 'u003', userName: 'Demo Verification Officer', role: 'certifier', action: 'Opened project for review', entity: 'Project', entityId: 'PRJ-0012', result: 'success' },
  { id: 'al004', timestamp: '2026-09-12T11:18:00', userId: 'u003', userName: 'Demo Verification Officer', role: 'certifier', action: 'Verified 7/12 document', entity: 'Document', entityId: 'd001', result: 'success' },
  { id: 'al005', timestamp: '2026-09-12T11:25:00', userId: 'u003', userName: 'Demo Verification Officer', role: 'certifier', action: 'Reviewed geospatial evidence', entity: 'Evidence', entityId: 'e003', result: 'success' },
  { id: 'al006', timestamp: '2026-09-12T11:41:00', userId: 'u003', userName: 'Demo Verification Officer', role: 'certifier', action: 'Requested additional information', entity: 'Project', entityId: 'PRJ-0012', result: 'success', detail: 'Updated plantation count records requested.' },
  { id: 'al007', timestamp: '2026-09-14T09:12:00', userId: 'u001', userName: 'Rajesh Patil', role: 'producer', action: 'Resubmitted documents', entity: 'Project', entityId: 'PRJ-0012', result: 'success' },
  { id: 'al008', timestamp: '2026-09-14T10:20:00', userId: 'u003', userName: 'Demo Verification Officer', role: 'certifier', action: 'Approved project', entity: 'Project', entityId: 'PRJ-0012', result: 'success' },
  { id: 'al009', timestamp: '2026-09-14T10:25:00', userId: 'system', userName: 'System', role: 'admin', action: 'Minted 2,500 carbon credits', entity: 'Credit', entityId: 'CRD-000245', result: 'success' },
  { id: 'al010', timestamp: '2026-09-15T10:00:00', userId: 'u001', userName: 'Rajesh Patil', role: 'producer', action: 'Listed credits on marketplace', entity: 'Credit', entityId: 'CRD-000245', result: 'success' },
  { id: 'al011', timestamp: '2026-09-20T14:00:00', userId: 'u004', userName: 'Abhay Kumar', role: 'market', action: 'Placed buy order', entity: 'Order', entityId: 'ORD-1028', result: 'success' },
  { id: 'al012', timestamp: '2026-09-20T14:35:00', userId: 'system', userName: 'System', role: 'admin', action: 'Matched orders ORD-1024 and ORD-1028', entity: 'Order', entityId: 'ORD-1028', result: 'success' },
  { id: 'al013', timestamp: '2026-09-20T14:35:00', userId: 'system', userName: 'System', role: 'admin', action: 'Transferred credit ownership', entity: 'Credit', entityId: 'CRD-000246', result: 'success' },
  { id: 'al014', timestamp: '2026-09-25T11:00:00', userId: 'u005', userName: 'Meera Joshi', role: 'market', action: 'Retired 300 credits', entity: 'Credit', entityId: 'CRD-000247', result: 'success', detail: 'Retirement ID: RET-00091' },
];

export const getAuditLogsByProject = (projectId: string) =>
  AUDIT_LOGS.filter(l => l.entityId === projectId);
