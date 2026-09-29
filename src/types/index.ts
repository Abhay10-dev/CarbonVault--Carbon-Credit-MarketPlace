// ─── Core Enums / Unions ───────────────────────────────────────────────────

export type Role = 'producer' | 'certifier' | 'market' | 'admin';

export type ProjectStatus =
  | 'draft'
  | 'submitted'
  | 'under_verification'
  | 'additional_info_required'
  | 'approved'
  | 'rejected';

export type ProjectType =
  | 'Reforestation'
  | 'Afforestation'
  | 'Renewable Energy'
  | 'Waste Management'
  | 'Agricultural Practices'
  | 'Other';

export type CreditStatus =
  | 'issued'
  | 'available'
  | 'listed'
  | 'sold'
  | 'transferred'
  | 'retired'
  | 'revoked';

export type OrderType = 'buy' | 'sell';

export type OrderStatus = 'pending' | 'matched' | 'completed' | 'cancelled' | 'expired' | 'listed';

export type TransactionType =
  | 'credit_mint'
  | 'credit_transfer'
  | 'credit_retirement'
  | 'credit_purchase'
  | 'credit_listing';

export type TxStatus = 'confirmed' | 'pending' | 'failed';

export type UserStatus = 'active' | 'suspended' | 'inactive';

export type DocumentStatus = 'uploaded' | 'under_review' | 'verified' | 'rejected' | 'requires_update';

export type VerificationStage =
  | 'project_info'
  | 'producer_info'
  | 'land_ownership'
  | 'land_record'
  | 'project_boundary'
  | 'coordinates'
  | 'satellite_evidence'
  | 'project_evidence'
  | 'carbon_calculation'
  | 'field_verification';

// ─── Entities ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  organization: string;
  phone: string;
  location: string;
  wallet: string;
  status: UserStatus;
  joinedAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface LandInfo {
  surveyNumber: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  totalArea: number;   // hectares
  projectArea: number; // hectares
  latitude: number;
  longitude: number;
}

export interface Document {
  id: string;
  category: string;
  name: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  certifierComment?: string;
}

export interface Evidence {
  id: string;
  type: string;
  description: string;
  status: DocumentStatus;
  uploadedAt: string;
  certifierComment?: string;
}

export interface VerificationChecklist {
  stage: VerificationStage;
  label: string;
  status: 'done' | 'in_progress' | 'pending';
}

export interface VerificationRecord {
  certifierId: string;
  certifierName: string;
  startedAt: string;
  completedAt?: string;
  decision?: 'approved' | 'rejected' | 'info_requested';
  decisionReason?: string;
  checklist: VerificationChecklist[];
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  detail?: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  producerId: string;
  producerName: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  location: string;
  methodology: string;
  expectedCredits: number;  // tCO2e
  issuedCredits?: number;
  landInfo: LandInfo;
  documents: Document[];
  evidence: Evidence[];
  verification?: VerificationRecord;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface LifecycleEvent {
  stage: string;
  date: string;
  actor: string;
  txHash?: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Credit {
  id: string;             // CRD-000245
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  producerId: string;
  producerName: string;
  quantity: number;
  tokenId: string;        // NFT-245
  contractAddress: string;
  currentOwner: string;   // wallet address
  currentOwnerId: string; // user ID
  status: CreditStatus;
  pricePerCredit?: number;
  issuanceDate: string;
  issuanceTxHash: string;
  lifecycle: LifecycleEvent[];
  location: string;
  methodology: string;
  verifiedBy: string;
  verificationDate: string;
  retirementId?: string;
  retirementReason?: string;
  retiredAt?: string;
}

export interface Order {
  id: string;
  type: OrderType;
  creditId: string;
  creditName: string;
  userId: string;
  userName: string;
  quantity: number;
  price: number;        // per credit, INR
  status: OrderStatus;
  createdAt: string;
  matchedOrderId?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  fromId: string;
  fromName: string;
  fromWallet: string;
  toId: string;
  toName: string;
  toWallet: string;
  creditId: string;
  creditName: string;
  quantity: number;
  amount?: number;    // INR
  txHash: string;
  status: TxStatus;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'success' | 'warning' | 'info';
  date: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  entity: string;
  entityId: string;
  result: 'success' | 'failed';
  detail?: string;
}

export interface Retirement {
  id: string;        // RET-00091
  creditId: string;
  userId: string;
  userName: string;
  quantity: number;
  reason: string;
  txHash: string;
  date: string;
}
