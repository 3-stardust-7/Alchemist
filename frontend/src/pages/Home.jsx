import { useState, useRef } from "react";
import { FlaskIcon, CheckIcon, DownloadIcon, SparkleIcon, LinkIcon, CopyIcon } from "../components/icons";
import { StepPill, ContentPanel, AlchemyLoader, SourcePreview } from "../components/ui";
import HistorySidebar from "../components/ui/HistorySidebar";
import { MarkdownBlock } from "../components/display";
import '../../src/App.css';
import '../../src/sidebar.css';

const API_BASE = import.meta.env.VITE_API_URL;
// const API_BASE = "http://localhost:8000";

function downloadTxt(filename, text) {
  const blob = new Blob([typeof text === "string" ? text : JSON.stringify(text, null, 2)], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function fixNewlines(s) {
  if (typeof s !== "string") return s;
  return s.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

function restoreStructure(s) {
  if (!s || typeof s !== "string") return s;
  if (s.includes("\n")) return fixNewlines(s);
  return s
    .replace(/(\*\*[A-Z][^*]+:\*\*)/g, "\n$1")
    .replace(/( \* )/g, "\n* ")
    .trim();
}

function extractText(val) {
  if (!val) return "";
  if (typeof val === "string") return restoreStructure(fixNewlines(val));
  if (typeof val === "object") {
    const s =
      val.body || val.content || val.text ||
      Object.values(val).find(v => typeof v === "string" && v.length > 50) ||
      JSON.stringify(val, null, 2);
    return restoreStructure(fixNewlines(String(s)));
  }
  return String(val);
}

function extractEmail(val) {
  if (!val) return "";
  let obj = val;
  if (typeof val === "string") {
    try { obj = JSON.parse(val); } catch (_) { return restoreStructure(fixNewlines(val)); }
  }
  if (typeof obj === "object") {
    const subject  = obj.subject  || obj.Subject  || "";
    const greeting = obj.salutation || obj.greeting || obj.opening || "Dear Reader,";
    const body     = obj.body    || obj.content  || obj.text    || extractText(obj);
    const cta      = obj.cta     || obj.call_to_action || "";
    const closing  = obj.closing || obj.sign_off || "Best regards,\nThe Alchemist Team";
    const parts = [];
    if (subject)  parts.push("Subject: " + subject);
    parts.push(greeting);
    parts.push(fixNewlines(String(body)));
    if (cta)      parts.push(cta);
    parts.push(closing);
    return parts.join("\n\n");
  }
  return restoreStructure(fixNewlines(String(val)));
}

function normalizeResults(data) {
  return {
    fact_sheet:    extractText(data.fact_sheet),
    blog_post:     extractText(data.blog_post),
    social_thread: data.social_thread,
    email_teaser:  extractEmail(data.email_teaser),
  };
}

function saveSession(source, results) {
  try { sessionStorage.setItem("alchemist_session", JSON.stringify({ source, results })); } catch (_) {}
}
function loadSession() {
  try { const s = sessionStorage.getItem("alchemist_session"); return s ? JSON.parse(s) : null; } catch (_) { return null; }
}
function clearSession() {
  try { sessionStorage.removeItem("alchemist_session"); } catch (_) {}
}

export default function App() {
  const session = loadSession();

  // Sidebar state lives here so app-shell class can reflect it
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sourceType, setSourceType]           = useState("text");
  const [inputValue, setInputValue]           = useState(session?.source || "");
  const [step, setStep]                       = useState(session ? 2 : 0);
  const [results, setResults]                 = useState(session?.results || null);
  const [error, setError]                     = useState("");
  const [submittedSource, setSubmittedSource] = useState(session?.source || "");
  const [factCopied, setFactCopied]           = useState(false);
  const resultsRef = useRef(null);

  const handleTransmute = async () => {
    if (!inputValue.trim()) { setError("Please provide source material to transmute."); return; }
    setError(""); setSubmittedSource(inputValue); setStep(1); setResults(null);
    try {
      const res = await fetch(`${API_BASE}/api/process-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputValue, source_type: sourceType }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const normalized = normalizeResults(data);
      setResults(normalized);
      saveSession(inputValue, normalized);
      setStep(2);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e.message || "Transmutation failed. Is the backend running?");
      setStep(0);
    }
  };

  const handleReset = () => {
    setStep(0); setResults(null); setInputValue(""); setError(""); setSubmittedSource(""); clearSession();
  };

  // Restore a past run from sidebar
  const handleRestore = (campaignData) => {
    const normalized = normalizeResults(campaignData);
    setResults(normalized);
    setSubmittedSource(campaignData.source_content);
    setInputValue(campaignData.source_content);
    setStep(2);
    clearSession();
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDownloadAll = () => {
    if (!results) return;
    if (results.fact_sheet)    downloadTxt("fact-sheet.md",     results.fact_sheet);
    if (results.blog_post)     downloadTxt("blog-post.txt",     results.blog_post);
    if (results.social_thread) downloadTxt("social-thread.txt", typeof results.social_thread === "string" ? results.social_thread : JSON.stringify(results.social_thread, null, 2));
    if (results.email_teaser)  downloadTxt("email-teaser.txt",  results.email_teaser);
  };

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* ── Left sidebar ── */}
      <HistorySidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        onRestore={handleRestore}
        onNewRun={handleReset}
      />

      {/* ── Main content ── */}
      <div className="app-main">
        <header className="site-header">
          <div className="logo">
            <span className="logo-icon"><FlaskIcon /></span>
            <span className="logo-text">The <em>Alchemist</em></span>
          </div>
          <span className="nav-tag">Autonomous Content Factory</span>
        </header>

        <section className="hero">
          <div className="hero-bg-grid" />
          <div className="hero-glow g1" /><div className="hero-glow g2" />
          <div className="hero-content">
            <div className="hero-eyebrow"><SparkleIcon /> Two-Agent Pipeline</div>
            <h1 className="hero-title">Turn one document<br />into <em>three channels</em></h1>
            <p className="hero-sub">
              Drop your raw source material below. Agent I verifies every fact.<br />
              Agent II transmutes it into a blog post, social thread, and email teaser simultaneously.
            </p>
          </div>
          <div className="pipeline-row">
            <div className="pipe-node"><div className="pipe-dot a1" /><span className="pipe-label">Source Doc</span></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node agent"><div className="pipe-dot a2" /><span className="pipe-label">Fact-Check Agent</span></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node agent"><div className="pipe-dot a3" /><span className="pipe-label">Copywriter Agent</span></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node"><div className="pipe-dot a4" /><span className="pipe-label">3 × Content</span></div>
          </div>
        </section>

        <main className="main-content">
          {step < 2 && (
            <section className="input-section">
              <div className="steps-row">
                <StepPill num="1" label="Provide Source"   active={step === 0} done={step > 0} />
                <div className="steps-line" />
                <StepPill num="2" label="Agent Processing" active={step === 1} done={step > 1} />
                <div className="steps-line" />
                <StepPill num="3" label="Receive Content"  active={step === 2} done={false} />
              </div>
              {step === 0 && (
                <>
                  <div className="type-toggle">
                    <button className={`toggle-btn ${sourceType === "text" ? "active" : ""}`} onClick={() => setSourceType("text")}>Raw Text</button>
                    <button className={`toggle-btn ${sourceType === "url"  ? "active" : ""}`} onClick={() => setSourceType("url")}><LinkIcon /> URL</button>
                  </div>
                  <div className="textarea-wrapper">
                    <textarea
                      className="source-textarea"
                      placeholder={sourceType === "url" ? "Paste a URL…" : "Paste your raw source material here…"}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      rows={10}
                    />
                    <div className="char-count">{inputValue.length} chars</div>
                  </div>
                  {error && <p className="error-msg">⚠ {error}</p>}
                  <button className="transmute-btn" onClick={handleTransmute}>
                    <FlaskIcon /> Begin Transmutation
                  </button>
                </>
              )}
              {step === 1 && <AlchemyLoader />}
            </section>
          )}

          {step === 2 && results && (
            <section className="results-section" ref={resultsRef}>
              <div className="results-header">
                <h2 className="results-title"><SparkleIcon /> Transmutation Complete</h2>
                <button className="reset-btn" onClick={handleReset}>↩ Start Over</button>
              </div>

              {submittedSource && <SourcePreview text={submittedSource} />}

              {results.fact_sheet && (
                <div className="fact-sheet-card">
                  <div className="fact-sheet-header">
                    <div className="output-card-title">
                      <span className="output-icon">🔬</span>
                      <span>Verified Fact-Sheet</span>
                      <span className="badge">Agent I</span>
                    </div>
                    <div className="output-actions">
                      <button className="icon-btn" onClick={() => { navigator.clipboard.writeText(results.fact_sheet); setFactCopied(true); setTimeout(() => setFactCopied(false), 1800); }}>
                        {factCopied ? <CheckIcon /> : <CopyIcon />}
                      </button>
                      <button className="icon-btn download-btn" onClick={() => downloadTxt("fact-sheet.md", results.fact_sheet)}><DownloadIcon /></button>
                    </div>
                  </div>
                  <div className="fact-sheet-body">
                    <MarkdownBlock text={results.fact_sheet} />
                  </div>
                </div>
              )}

              <ContentPanel results={results} />

              <div className="download-all-row">
                <button className="download-all-btn" onClick={handleDownloadAll}>
                  <DownloadIcon /> Download All Files
                </button>
              </div>
            </section>
          )}
        </main>

        <footer className="site-footer">The Alchemist · Autonomous Content Factory</footer>
      </div>
    </div>
  );
}