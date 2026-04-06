import { FlaskIcon } from "../icons";

function parseSocialThread(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(p =>
      typeof p === "string" ? p
      : p.tweet || p.text || p.content || p.post || JSON.stringify(p)
    );
  }
  if (typeof raw === "object") {
    const arr = raw.posts || raw.tweets || raw.thread ||
      Object.values(raw).find(Array.isArray);
    if (arr) return parseSocialThread(arr);
    const strings = Object.values(raw).filter(v => typeof v === "string" && v.length > 10);
    if (strings.length > 1) return strings;
    return [extractText(raw)];
  }
  if (typeof raw === "string") {
    try { return parseSocialThread(JSON.parse(raw)); } catch (_) {}
    const parts = raw.split(/\n?---\n?/).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
    const numbered = raw.match(/[0-9][/][0-9][^\n]*/g);
    if (numbered && numbered.length > 1) return numbered.map(s => s.trim());
    return [raw];
  }
  return [String(raw)];
}

function stripMd(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

export default  function SocialThreadDisplay({ raw }) {
  const posts = parseSocialThread(raw);
  return (
    <div className="social-thread">
      {posts.map((post, i) => (
        <div key={i} className="tweet-card">
          <div className="tweet-avatar"><FlaskIcon /></div>
          <div className="tweet-body">
            <div className="tweet-handle">
              @thealchemist
              <span className="tweet-num">{i + 1}/{posts.length}</span>
            </div>
            <div className="tweet-text">{stripMd(post)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}