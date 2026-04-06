import inlineFormat from "../utils/format";
export default  function EmailDisplay({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const els = [];
  let k = 0;
  for (const line of lines) {
    if (!line.trim()) { els.push(<div key={k++} style={{ height: "0.5em" }} />); continue; }
    if (line.startsWith("Subject:")) {
      els.push(<div key={k++} className="email-subject">{line}</div>);
    } else if (/^(Dear|Hello|Hi|Hey)/i.test(line.trim())) {
      els.push(<div key={k++} className="email-greeting">{line}</div>);
    } else {
      els.push(<p key={k++} className="md-p">{inlineFormat(line)}</p>);
    }
  }
  return <div className="md-body email-body">{els}</div>;
}