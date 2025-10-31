import React from "react";
import { Card } from "./ui/card";
import type { Lead } from "../services/api";

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  return (
    <Card className="space-y-2 p-3 text-sm">
      <div className="font-semibold">{lead.name}</div>
      <div className="text-xs text-muted-foreground">Source: {lead.source}</div>
      <div className="text-xs text-muted-foreground">Value: ${lead.value.toLocaleString()}</div>
    </Card>
  );
};
