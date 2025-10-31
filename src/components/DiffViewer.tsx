import React, { useMemo } from "react";

export type DiffSegmentType = "unchanged" | "added" | "removed";

export interface DiffSegment {
  value: string;
  type: DiffSegmentType;
}

export interface DiffViewerProps {
  base: string;
  target: string;
  mode?: "split" | "inline";
  className?: string;
}

/**
 * Compute a diff between two text blobs. The algorithm is a simple
 * line-based longest common subsequence which is sufficient for admin review.
 */
function computeDiff(base: string, target: string): DiffSegment[] {
  const baseLines = base.split(/\r?\n/);
  const targetLines = target.split(/\r?\n/);
  const m = baseLines.length;
  const n = targetLines.length;

  const lcs: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      if (baseLines[i] === targetLines[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }
  }

  const segments: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (baseLines[i] === targetLines[j]) {
      pushSegment(segments, { value: baseLines[i], type: "unchanged" });
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      pushSegment(segments, { value: baseLines[i], type: "removed" });
      i += 1;
    } else {
      pushSegment(segments, { value: targetLines[j], type: "added" });
      j += 1;
    }
  }

  while (i < m) {
    pushSegment(segments, { value: baseLines[i], type: "removed" });
    i += 1;
  }
  while (j < n) {
    pushSegment(segments, { value: targetLines[j], type: "added" });
    j += 1;
  }

  return segments;
}

function pushSegment(collection: DiffSegment[], next: DiffSegment) {
  const last = collection[collection.length - 1];
  if (last && last.type === next.type) {
    last.value = `${last.value}\n${next.value}`;
  } else {
    collection.push({ ...next });
  }
}

/**
 * Dual-pane or inline diff viewer with simple color coding for added/removed lines.
 */
export const DiffViewer: React.FC<DiffViewerProps> = ({
  base,
  target,
  mode = "split",
  className,
}) => {
  const segments = useMemo(() => computeDiff(base, target), [base, target]);

  if (mode === "split") {
    const baseSegments = segments.filter((segment) => segment.type !== "added");
    const targetSegments = segments.filter((segment) => segment.type !== "removed");
    return (
      <div className={className} style={{ display: "flex", gap: "1rem", fontFamily: "monospace" }}>
        <DiffPane title="Current" segments={baseSegments} />
        <DiffPane title="Proposed" segments={targetSegments} />
      </div>
    );
  }

  return (
    <div className={className} style={{ fontFamily: "monospace" }}>
      {segments.map((segment, index) => (
        <DiffLine key={index} segment={segment} />
      ))}
    </div>
  );
};

interface DiffPaneProps {
  title: string;
  segments: DiffSegment[];
}

const paneStyles: Record<DiffSegmentType, React.CSSProperties> = {
  unchanged: { backgroundColor: "transparent" },
  added: { backgroundColor: "#e6ffed" },
  removed: { backgroundColor: "#ffeef0" },
};

const DiffPane: React.FC<DiffPaneProps> = ({ title, segments }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{title}</div>
    <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: "0.5rem" }}>
      {segments.map((segment, index) => (
        <pre
          key={`${segment.type}-${index}`}
          style={{
            ...paneStyles[segment.type],
            margin: 0,
            padding: "0.25rem 0.5rem",
            whiteSpace: "pre-wrap",
            borderRadius: 4,
          }}
        >
          {segment.value}
        </pre>
      ))}
    </div>
  </div>
);

interface DiffLineProps {
  segment: DiffSegment;
}

const indicator: Record<DiffSegmentType, string> = {
  unchanged: " ",
  added: "+",
  removed: "-",
};

const inlineStyles: Record<DiffSegmentType, React.CSSProperties> = {
  unchanged: { backgroundColor: "transparent" },
  added: { backgroundColor: "#e6ffed" },
  removed: { backgroundColor: "#ffeef0" },
};

const DiffLine: React.FC<DiffLineProps> = ({ segment }) => (
  <pre
    style={{
      ...inlineStyles[segment.type],
      padding: "0.25rem 0.5rem",
      margin: 0,
      borderRadius: 4,
      whiteSpace: "pre-wrap",
    }}
  >
    {`${indicator[segment.type]} ${segment.value}`}
  </pre>
);

export default DiffViewer;
