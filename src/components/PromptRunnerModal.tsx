import React, { useEffect, useState } from "react";
import { useToast } from "../providers/ToastProvider";

interface PromptDefinition {
  description: string;
}

interface PromptResponse {
  name: string;
  rendered_prompt: string;
  result: string;
}

interface PromptRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Modal that allows admins to manually execute AI prompt templates. */
const PromptRunnerModal: React.FC<PromptRunnerModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [prompts, setPrompts] = useState<Record<string, PromptDefinition>>({});
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [parameters, setParameters] = useState<string>("{}");
  const [result, setResult] = useState<PromptResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    fetch("/api/ai/prompts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load prompt templates");
        }
        return response.json();
      })
      .then((data: Record<string, PromptDefinition>) => {
        setPrompts(data);
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          setSelectedPrompt(firstKey);
        }
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      });
  }, [isOpen, showToast]);

  const runPrompt = () => {
    if (!selectedPrompt) {
      showToast({ message: "Select a prompt template", type: "warning" });
      return;
    }
    let parsed: Record<string, unknown> = {};
    if (parameters.trim()) {
      try {
        parsed = JSON.parse(parameters);
      } catch (error) {
        showToast({ message: "Parameters must be valid JSON", type: "error" });
        return;
      }
    }

    setIsLoading(true);
    fetch("/api/ai/run_prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: selectedPrompt, parameters: parsed }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Prompt execution failed");
        }
        return response.json();
      })
      .then((data: PromptResponse) => {
        setResult(data);
        showToast({ message: "Prompt executed", type: "success" });
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      })
      .finally(() => setIsLoading(false));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          width: "min(640px, 95vw)",
          borderRadius: 8,
          padding: "1.5rem",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.2)",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>Prompt Runner</h2>
            <p style={{ margin: 0, color: "#64748b" }}>Execute AI prompts with custom parameters.</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "1.5rem" }}>
            ×
          </button>
        </header>
        <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span>Prompt Template</span>
            <select
              value={selectedPrompt}
              onChange={(event) => setSelectedPrompt(event.target.value)}
              style={{ padding: "0.5rem", borderRadius: 6, border: "1px solid #cbd5f5" }}
            >
              {Object.entries(prompts).map(([name, meta]) => (
                <option key={name} value={name}>
                  {name} — {meta.description}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span>Parameters (JSON)</span>
            <textarea
              value={parameters}
              onChange={(event) => setParameters(event.target.value)}
              rows={5}
              style={{ fontFamily: "monospace", padding: "0.75rem", borderRadius: 6, border: "1px solid #cbd5f5" }}
            />
          </label>
          <button
            onClick={runPrompt}
            disabled={isLoading}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: isLoading ? "wait" : "pointer",
            }}
          >
            {isLoading ? "Running…" : "Run Prompt"}
          </button>
        </div>
        {result && (
          <section style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>{result.name}</h3>
            <div style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "0.75rem" }}>
              {result.rendered_prompt}
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#0f172a",
                color: "#e2e8f0",
                padding: "1rem",
                borderRadius: 6,
                maxHeight: "240px",
                overflow: "auto",
              }}
            >
              {result.result}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
};

export default PromptRunnerModal;
