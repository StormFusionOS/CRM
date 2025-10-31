import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/Dashboard";
import { InboxPage } from "./pages/Inbox";
import { LeadsPage } from "./pages/Leads";
import { LeadDetailPage } from "./pages/LeadDetail";
import { CalendarPage } from "./pages/Calendar";
import { QuotesPage } from "./pages/Quotes";
import { CampaignBuilderPage } from "./pages/CampaignBuilder";
import { ReviewQueuePage } from "./pages/ReviewQueue";
import { SettingsPage } from "./pages/Settings";
import { LoginPage } from "./pages/Login";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:leadId" element={<LeadDetailPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="campaigns" element={<CampaignBuilderPage />} />
        <Route path="review" element={<ReviewQueuePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
