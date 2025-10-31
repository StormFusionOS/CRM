import { Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { StatusPage } from '@/pages/status/StatusPage';
import { ScraperDashboard } from '@/pages/scraper/ScraperDashboard';
import { ScraperTargets } from '@/pages/scraper/ScraperTargets';
import { ScraperSchedules } from '@/pages/scraper/ScraperSchedules';
import { ScraperJobs } from '@/pages/scraper/ScraperJobs';
import { ScraperConfigPage } from '@/pages/scraper/ScraperConfig';
import { ScraperLogs } from '@/pages/scraper/ScraperLogs';
import { ScraperSnapshots } from '@/pages/scraper/ScraperSnapshots';
import { ScraperQuarantine } from '@/pages/scraper/ScraperQuarantine';
import { ScraperNetwork } from '@/pages/scraper/ScraperNetwork';

export const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/status" element={<StatusPage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin', 'tech']} redirectTo="/dashboard" /> }>
        <Route path="/scraper" element={<ScraperDashboard />} />
        <Route path="/scraper/targets" element={<ScraperTargets />} />
        <Route path="/scraper/schedules" element={<ScraperSchedules />} />
        <Route path="/scraper/jobs" element={<ScraperJobs />} />
        <Route path="/scraper/config" element={<ScraperConfigPage />} />
        <Route path="/scraper/logs" element={<ScraperLogs />} />
        <Route path="/scraper/snapshots" element={<ScraperSnapshots />} />
        <Route path="/scraper/quarantine" element={<ScraperQuarantine />} />
        <Route path="/scraper/network" element={<ScraperNetwork />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
