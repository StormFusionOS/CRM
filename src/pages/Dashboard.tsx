import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";

const metricCards = [
  { title: "New Leads", value: 24, description: "This week" },
  { title: "Upcoming Appointments", value: 12, description: "Next 7 days" },
  { title: "SEO Health", value: "92%", description: "Overall score" },
  { title: "Campaign CTR", value: "4.8%", description: "Last 30 days" }
];

const healthStatuses = [
  { label: "Last Backup", status: "OK", detail: "Oct 29", color: "bg-green-100 text-green-700" },
  { label: "Scraper", status: "Running", detail: "13 minutes ago", color: "bg-emerald-100 text-emerald-700" },
  { label: "Twilio", status: "Connected", detail: "API stable", color: "bg-green-100 text-green-700" },
  { label: "Google My Business", status: "Auth Needed", detail: "Token expired", color: "bg-amber-100 text-amber-700" }
];

const activities = [
  { id: 1, title: "New lead from Facebook Ads", time: "2 minutes ago" },
  { id: 2, title: "Invoice #1021 marked as paid", time: "18 minutes ago" },
  { id: 3, title: "SEO suggestion approved", time: "1 hour ago" },
  { id: 4, title: "Appointment scheduled with Sarah P.", time: "Yesterday" }
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.description}</CardDescription>
              <CardTitle className="text-3xl font-bold">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Key integrations and automations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthStatuses.map((status) => (
              <div key={status.label} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-semibold">{status.label}</p>
                  <p className="text-xs text-muted-foreground">{status.detail}</p>
                </div>
                <Badge className={status.color}>{status.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
