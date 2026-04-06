import inlineFormat from "../utils/format";
export default function MarkdownBlock({ text }) {
  if (!text) return null;
  const str = typeof text === "string" ? text : JSON.stringify(text, null, 2);
  const lines = str.split("\n");
  const els = [];
  let k = 0;
  for (const line of lines) {
    if (!line.trim()) { els.push(<div key={k++} style={{ height: "0.6em" }} />); continue; }
    if (/^### /.test(line)) { els.push(<h3 key={k++} className="md-h3">{line.replace(/^### /, "")}</h3>); continue; }
    if (/^## /.test(line))  { els.push(<h2 key={k++} className="md-h2">{line.replace(/^## /, "")}</h2>); continue; }
    if (/^# /.test(line))   { els.push(<h1 key={k++} className="md-h1">{line.replace(/^# /, "")}</h1>); continue; }
    if (/^[*-] /.test(line)) { els.push(<div key={k++} className="md-bullet">· {inlineFormat(line.replace(/^[*-] /, ""))}</div>); continue; }
    els.push(<p key={k++} className="md-p">{inlineFormat(line)}</p>);
  }
  return <div className="md-body">{els}</div>;
}