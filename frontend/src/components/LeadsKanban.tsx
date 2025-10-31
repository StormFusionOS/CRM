import React from "react";

export type LeadStatus = "new" | "contacted" | "qualified";

export interface Lead {
  id: string;
  name: string;
  company: string;
  status: LeadStatus;
}

export interface LeadsKanbanProps {
  leads: Lead[];
  onMoveLead?: (leadId: string, status: LeadStatus) => void;
}

const COLUMN_TITLES: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
};

export const LeadsKanban: React.FC<LeadsKanbanProps> = ({ leads, onMoveLead }) => {
  const grouped = leads.reduce<Record<LeadStatus, Lead[]>>(
    (acc, lead) => {
      acc[lead.status].push(lead);
      return acc;
    },
    { new: [], contacted: [], qualified: [] }
  );

  const handleMove = (leadId: string, status: LeadStatus) => {
    if (onMoveLead) {
      onMoveLead(leadId, status);
    }
  };

  return (
    <div role="list" aria-label="Leads Kanban" className="kanban">
      {Object.entries(grouped).map(([status, columnLeads]) => (
        <section key={status} aria-label={COLUMN_TITLES[status as LeadStatus]}>
          <h3>{COLUMN_TITLES[status as LeadStatus]}</h3>
          <ul>
            {columnLeads.map((lead) => (
              <li key={lead.id}>
                <p>{lead.name}</p>
                <small>{lead.company}</small>
                <div>
                  {Object.keys(COLUMN_TITLES).map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleMove(lead.id, label as LeadStatus)}
                    >
                      Move to {COLUMN_TITLES[label as LeadStatus]}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default LeadsKanban;
