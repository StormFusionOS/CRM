import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { getLeads, type Lead } from "../services/api";

interface TimelineEntry {
  id: string;
  type: "call" | "email" | "note";
  summary: string;
  createdAt: string;
}

export const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    getLeads().then((leads) => {
      const found = leads.find((item) => item.id === leadId) ?? null;
      setLead(found);
      setTimeline([
        { id: "1", type: "call", summary: "Spoke about project requirements", createdAt: "2023-10-30T14:00:00Z" },
        { id: "2", type: "note", summary: "Sent follow-up email with quote", createdAt: "2023-11-02T10:30:00Z" }
      ]);
    });
  }, [leadId]);

  if (!lead) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Lead not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{lead.name}</CardTitle>
          <CardDescription>{lead.source} • Stage: {lead.stage}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">Contact</p>
            <p className="text-sm text-muted-foreground">email@example.com</p>
            <p className="text-sm text-muted-foreground">(555) 123-4567</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Campaign</p>
            <p className="text-sm text-muted-foreground">{lead.campaignId ?? "Organic"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Recent interactions</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Interaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Interaction</DialogTitle>
                <DialogDescription>Capture calls, emails, or notes for this lead.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Interaction title" />
                <Textarea placeholder="Details" />
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeline.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-4">
              <p className="text-sm font-semibold capitalize">{entry.type}</p>
              <p className="text-sm text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
              <p className="mt-2 text-sm">{entry.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input type="date" />
            <Input type="time" />
            <Button>Schedule</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send Quote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Quote amount" />
            <Button>Generate Quote</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Opens: 54% • Clicks: 12%</p>
            <p className="mt-2 text-sm">Latest update synced 1 hour ago.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
