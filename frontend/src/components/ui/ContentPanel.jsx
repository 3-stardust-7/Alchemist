import { EmailDisplay,SocialThreadDisplay, MarkdownBlock } from "../display/";
import { CheckIcon,CopyIcon,DownloadIcon } from "../icons";
import { useState, useRef, useEffect } from "react";
export default  function ContentPanel({ results }) {
  const [activeTab, setActiveTab] = useState("blog");
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: "blog",   label: "📝 Blog Post",     badge: "~500 words",  filename: "blog-post.txt",     content: results.blog_post },
    { id: "social", label: "📱 Social Thread", badge: "5 posts",     filename: "social-thread.txt", content: results.social_thread },
    { id: "email",  label: "✉️ Email Teaser",  badge: "1 paragraph", filename: "email-teaser.txt",  content: results.email_teaser },
  ];
  const active = tabs.find(t => t.id === activeTab);

  const handleCopy = () => {
    const txt = typeof active.content === "string" ? active.content : JSON.stringify(active.content, null, 2);
    navigator.clipboard.writeText(txt);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="content-panel">
      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label} <span className="tab-badge">{t.badge}</span>
          </button>
        ))}
      </div>
      <div className="panel-header">
        <span className="badge">Agent II</span>
        <div className="output-actions">
          <button className="icon-btn" onClick={handleCopy}>{copied ? <CheckIcon /> : <CopyIcon />}</button>
          <button className="icon-btn download-btn" onClick={() => downloadTxt(active.filename, active.content || "")}><DownloadIcon /></button>
        </div>
      </div>
      <div className="panel-body">
        {activeTab === "blog"   && <MarkdownBlock text={results.blog_post} />}
        {activeTab === "social" && <SocialThreadDisplay raw={results.social_thread} />}
        {activeTab === "email"  && <EmailDisplay text={results.email_teaser} />}
      </div>
    </div>
  );
}