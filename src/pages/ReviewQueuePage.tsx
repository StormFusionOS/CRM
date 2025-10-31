import React, { useEffect, useState } from "react";
import DiffViewer from "../components/DiffViewer";
import { useToast } from "../providers/ToastProvider";

interface ChangeLogSummary {
  id: number;
  content_id: string;
  status: string;
  current_version: number;
  proposed_version: number;
}

interface ChangeLogDetail extends ChangeLogSummary {
  current_content: string;
  proposed_content: string;
}

const ReviewQueuePage: React.FC = () => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<ChangeLogSummary[]>([]);
  const [selected, setSelected] = useState<ChangeLogDetail | null>(null);

  const loadEntries = () => {
    fetch("/api/change-log/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load review queue");
        }
        return response.json();
      })
      .then((data: ChangeLogSummary[]) => {
        setEntries(data);
        const firstPending = data.find((entry) => entry.status === "pending");
        if (firstPending) {
          loadEntryDetail(firstPending.id);
        }
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      });
  };

  const loadEntryDetail = (id: number) => {
    fetch(`/api/change-log/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load change detail");
        }
        return response.json();
      })
      .then((detail: ChangeLogDetail) => {
        setSelected(detail);
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      });
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const processChange = (entry: ChangeLogDetail, action: "approve" | "reject") => {
    fetch(`/api/change-log/${entry.id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor: "admin@example.com" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to ${action} change`);
        }
        return response.json();
      })
      .then((data: ChangeLogDetail) => {
        const summary: ChangeLogSummary = {
          id: data.id,
          content_id: data.content_id,
          status: data.status,
          current_version: data.current_version,
          proposed_version: data.proposed_version,
        };
        setEntries((current) => current.map((item) => (item.id === data.id ? summary : item)));
        setSelected(data.status === "pending" ? data : null);
        showToast({
          message: action === "approve" ? "Change approved" : "Change rejected",
          type: action === "approve" ? "success" : "info",
        });
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "80vh" }}>
      <aside style={{ borderRight: "1px solid #e2e8f0", padding: "1rem", overflowY: "auto" }}>
        <h2 style={{ marginTop: 0 }}>Pending Changes</h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.5rem" }}>
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => loadEntryDetail(entry.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.5rem 0.75rem",
                  borderRadius: 6,
                  border: "1px solid #e2e8f0",
                  background: selected?.id === entry.id ? "#eff6ff" : "white",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>#{entry.id} · {entry.content_id}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{entry.status}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ padding: "1.5rem" }}>
        {selected ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ margin: 0 }}>Review #{selected.id}</h1>
                <p style={{ margin: 0, color: "#64748b" }}>
                  Compare current vs. proposed copy for <strong>{selected.content_id}</strong>.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => processChange(selected, "reject")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => processChange(selected, "approve")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    border: "none",
                    background: "#22c55e",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Approve
                </button>
              </div>
            </header>
            <DiffViewer base={selected.current_content} target={selected.proposed_content} />
          </div>
        ) : (
          <p>Select a change to review the diff.</p>
        )}
      </main>
    </div>
  );
};

export default ReviewQueuePage;
