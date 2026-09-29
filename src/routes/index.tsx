import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';

// Auth
import { LoginPage } from '@/pages/auth/LoginPage';

// Producer
import { ProducerDashboard } from '@/pages/producer/ProducerDashboard';
import { ProducerProjects } from '@/pages/producer/ProducerProjects';
import { ProducerCreateProject } from '@/pages/producer/ProducerCreateProject';
import { ProducerProjectDetail } from '@/pages/producer/ProducerProjectDetail';
import { ProducerVerification } from '@/pages/producer/ProducerVerification';
import { ProducerCredits } from '@/pages/producer/ProducerCredits';
import { ProducerSellCredits } from '@/pages/producer/ProducerSellCredits';
import { ProducerOrders } from '@/pages/producer/ProducerOrders';
import { ProducerTransactions } from '@/pages/producer/ProducerTransactions';
import { ProducerProfile } from '@/pages/producer/ProducerProfile';

// Certifier
import { CertifierDashboard } from '@/pages/certifier/CertifierDashboard';
import { CertifierQueue } from '@/pages/certifier/CertifierQueue';
import { CertifierReview } from '@/pages/certifier/CertifierReview';
import { CertifierDocuments } from '@/pages/certifier/CertifierDocuments';
import { CertifierLandRecords } from '@/pages/certifier/CertifierLandRecords';
import { CertifierHistory } from '@/pages/certifier/CertifierHistory';
import { CertifierAuditTrail } from '@/pages/certifier/CertifierAuditTrail';
import { CertifierReports } from '@/pages/certifier/CertifierReports';
import { CertifierProfile } from '@/pages/certifier/CertifierProfile';

// Market Participant
import { MarketDashboard } from '@/pages/market/MarketDashboard';
import { Marketplace } from '@/pages/market/Marketplace';
import { MarketCreditDetail } from '@/pages/market/MarketCreditDetail';
import { MarketBuyCredits } from '@/pages/market/MarketBuyCredits';
import { MarketCredits } from '@/pages/market/MarketCredits';
import { MarketPortfolio } from '@/pages/market/MarketPortfolio';
import { MarketOrders } from '@/pages/market/MarketOrders';
import { MarketOrderBook } from '@/pages/market/MarketOrderBook';
import { MarketTransactions } from '@/pages/market/MarketTransactions';
import { MarketTransfer } from '@/pages/market/MarketTransfer';
import { MarketRetire } from '@/pages/market/MarketRetire';
import { MarketImpact } from '@/pages/market/MarketImpact';
import { MarketWatchlist } from '@/pages/market/MarketWatchlist';
import { MarketProfile } from '@/pages/market/MarketProfile';

// Admin
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminVerification } from '@/pages/admin/AdminVerification';
import { AdminCertifiers } from '@/pages/admin/AdminCertifiers';
import { AdminCredits } from '@/pages/admin/AdminCredits';
import { AdminMarketplace } from '@/pages/admin/AdminMarketplace';
import { AdminTransactions } from '@/pages/admin/AdminTransactions';
import { AdminBlockchain } from '@/pages/admin/AdminBlockchain';
import { AdminAuditLogs } from '@/pages/admin/AdminAuditLogs';
import { AdminReports } from '@/pages/admin/AdminReports';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminProfile } from '@/pages/admin/AdminProfile';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Producer Workspace Routes */}
      <Route
        path="/producer"
        element={
          <ProtectedRoute allowedRole="producer">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProducerDashboard />} />
        <Route path="projects" element={<ProducerProjects />} />
        <Route path="projects/create" element={<ProducerCreateProject />} />
        <Route path="projects/:id" element={<ProducerProjectDetail />} />
        <Route path="verification" element={<ProducerVerification />} />
        <Route path="credits" element={<ProducerCredits />} />
        <Route path="sell" element={<ProducerSellCredits />} />
        <Route path="orders" element={<ProducerOrders />} />
        <Route path="transactions" element={<ProducerTransactions />} />
        <Route path="profile" element={<ProducerProfile />} />
      </Route>

      {/* Certifier Workspace Routes */}
      <Route
        path="/certifier"
        element={
          <ProtectedRoute allowedRole="certifier">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<CertifierDashboard />} />
        <Route path="queue" element={<CertifierQueue />} />
        <Route path="review/:id" element={<CertifierReview />} />
        <Route path="projects" element={<CertifierQueue />} />
        <Route path="documents" element={<CertifierDocuments />} />
        <Route path="land" element={<CertifierLandRecords />} />
        <Route path="history" element={<CertifierHistory />} />
        <Route path="audit" element={<CertifierAuditTrail />} />
        <Route path="reports" element={<CertifierReports />} />
        <Route path="profile" element={<CertifierProfile />} />
      </Route>

      {/* Market Participant Workspace Routes */}
      <Route
        path="/market"
        element={
          <ProtectedRoute allowedRole="market">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<MarketDashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="credit/:id" element={<MarketCreditDetail />} />
        <Route path="buy/:id" element={<MarketBuyCredits />} />
        <Route path="credits" element={<MarketCredits />} />
        <Route path="portfolio" element={<MarketPortfolio />} />
        <Route path="orders" element={<MarketOrders />} />
        <Route path="orderbook" element={<MarketOrderBook />} />
        <Route path="transactions" element={<MarketTransactions />} />
        <Route path="transfer" element={<MarketTransfer />} />
        <Route path="retire" element={<MarketRetire />} />
        <Route path="impact" element={<MarketImpact />} />
        <Route path="watchlist" element={<MarketWatchlist />} />
        <Route path="profile" element={<MarketProfile />} />
      </Route>

      {/* Admin Workspace Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="verification" element={<AdminVerification />} />
        <Route path="certifiers" element={<AdminCertifiers />} />
        <Route path="credits" element={<AdminCredits />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="blockchain" element={<AdminBlockchain />} />
        <Route path="audit" element={<AdminAuditLogs />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
