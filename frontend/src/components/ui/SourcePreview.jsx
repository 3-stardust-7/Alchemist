
import { useState, useRef, useEffect } from "react";
export default  function SourcePreview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const preview = text.length > 300 && !expanded ? text.slice(0, 300) + "…" : text;
  return (
    <div className="source-preview-box">
      <div className="source-preview-label">📄 Source Material</div>
      <div className="source-preview-text">{preview}</div>
      {text.length > 300 && (
        <button className="source-toggle" onClick={() => setExpanded(e => !e)}>
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}
    </div>
  );
}
