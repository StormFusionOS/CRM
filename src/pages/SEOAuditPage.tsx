import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../providers/ToastProvider";

interface IssueCounts {
  [severity: string]: number;
}

interface PageAuditSummary {
  id: number;
  url: string;
  audited_at: string;
  score: number;
  status: string;
  issue_counts: IssueCounts;
}

interface AuditIssue {
  id: number;
  severity: string;
  description: string;
  action_url?: string | null;
}

interface PageAuditDetail extends PageAuditSummary {
  issues: AuditIssue[];
}

const severityOptions = ["all", "critical", "warning", "info"];

/** Admin page that lists SEO audits and surfaces actionable issues. */
const SEOAuditPage: React.FC = () => {
  const { showToast } = useToast();
  const [audits, setAudits] = useState<PageAuditSummary[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<PageAuditDetail | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (severityFilter !== "all") {
      params.append("severity", severityFilter);
    }
    fetch(`/api/seo/audits?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load audits");
        }
        return response.json();
      })
      .then((data: PageAuditSummary[]) => {
        setAudits(data);
      })
      .catch((error) => {
        console.error(error);
        showToast({ message: error.message, type: "error" });
      })
      .finally(() => setLoading(false));
  }, [severityFilter, showToast]);

  const filteredAudits = useMemo(() => {
    if (!search.trim()) {
      return audits;
    }
    const lower = search.toLowerCase();
    return audits.filter((audit) => audit.url.toLowerCase().includes(lower));
  }, [audits, search]);

  const selectAudit = (audit: PageAuditSummary) => {
    fetch(`/api/seo/audits/${audit.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load audit details");
        }
        return response.json();
      })
      .then((data: PageAuditDetail) => {
        setSelectedAudit(data);
        showToast({ message: "Loaded audit details", type: "success" });
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      });
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1>SEO Audits</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            type="search"
            placeholder="Filter by URL"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          >
            {severityOptions.map((option) => (
              <option key={option} value={option === "all" ? "all" : option}>
                {option === "all" ? "All severities" : option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </header>
      {loading ? (
        <p>Loading audits…</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "0.5rem" }}>URL</th>
              <th style={{ padding: "0.5rem" }}>Audited</th>
              <th style={{ padding: "0.5rem" }}>Score</th>
              <th style={{ padding: "0.5rem" }}>Status</th>
              <th style={{ padding: "0.5rem" }}>Issues</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.map((audit) => (
              <tr
                key={audit.id}
                onClick={() => selectAudit(audit)}
                style={{ cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
              >
                <td style={{ padding: "0.5rem", color: "#0366d6" }}>{audit.url}</td>
                <td style={{ padding: "0.5rem" }}>{new Date(audit.audited_at).toLocaleString()}</td>
                <td style={{ padding: "0.5rem" }}>{audit.score}</td>
                <td style={{ padding: "0.5rem" }}>{audit.status.toUpperCase()}</td>
                <td style={{ padding: "0.5rem" }}>
                  {Object.entries(audit.issue_counts)
                    .map(([severity, count]) => `${severity}: ${count}`)
                    .join(", ") || "No issues"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedAudit && (
        <section style={{ marginTop: "1.5rem" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Issues for {selectedAudit.url}</h2>
            <button
              onClick={() => setSelectedAudit(null)}
              style={{ padding: "0.5rem 1rem", borderRadius: 4, border: "1px solid #ccc" }}
            >
              Close
            </button>
          </header>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {selectedAudit.issues.map((issue) => (
              <li
                key={issue.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 6,
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                  background: issue.severity === "critical" ? "#fff5f5" : "#fafafa",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {issue.severity.toUpperCase()} · Issue #{issue.id}
                </div>
                <p style={{ margin: "0.25rem 0" }}>{issue.description}</p>
                {issue.action_url && (
                  <a href={issue.action_url} target="_blank" rel="noreferrer">
                    Review content
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SEOAuditPage;
