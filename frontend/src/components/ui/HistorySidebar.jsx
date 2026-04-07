import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory, fetchCampaignById } from "../../store/HistorySlice";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dateLabel(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function groupByDate(items) {
  const groups = [];
  const seen = {};
  for (const item of items) {
    const label = dateLabel(item.created_at);
    if (!seen[label]) {
      seen[label] = true;
      groups.push({ label, items: [] });
    }
    groups[groups.length - 1].items.push(item);
  }
  return groups;
}

// Icons as inline SVG so we don't depend on the icon barrel
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4.5v3.75L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HistorySidebar({ open, onToggle, onRestore, onNewRun }) {
  const dispatch = useDispatch();
  const { items, fetchStatus, selectedId, selectedStatus } = useSelector(
    (s) => s.history
  );

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleSelect = async (id) => {
    if (selectedStatus === "loading") return;
    const result = await dispatch(fetchCampaignById(id));
    if (fetchCampaignById.fulfilled.match(result)) {
      onRestore(result.payload);
    }
  };

  const groups = groupByDate(items);

  return (
    <aside className={`history-sidebar ${open ? "open" : "closed"}`}>

      {/* Toggle button — always visible */}
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <IconChevronLeft /> : <IconMenu />}
      </button>

      {/* Content — only shown when open */}
      {open && (
        <>
          <div className="sidebar-header">
            <span className="sidebar-title">History</span>
            <button
              className="sidebar-refresh"
              onClick={() => dispatch(fetchHistory())}
              title="Refresh"
            >
              ↻
            </button>
          </div>

          <div className="sidebar-list-wrap">
            {/* New Run shortcut */}
            <button className="sidebar-new-btn" onClick={onNewRun}>
              <IconPlus />
              New run
            </button>

            <div className="sidebar-list">
              {fetchStatus === "loading" && (
                <p className="sidebar-empty">Loading…</p>
              )}
              {fetchStatus === "error" && (
                <p className="sidebar-empty sidebar-error">Failed to load</p>
              )}
              {fetchStatus === "success" && items.length === 0 && (
                <p className="sidebar-empty">No runs yet.</p>
              )}

              {groups.map((group) => (
                <div key={group.label}>
                  <div className="sidebar-date-label">{group.label}</div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      className={`sidebar-item ${selectedId === item.id ? "active" : ""} ${selectedStatus === "loading" ? "loading" : ""}`}
                      onClick={() => handleSelect(item.id)}
                      disabled={selectedStatus === "loading"}
                    >
                      <span className="item-preview">
                        {item.source_preview || "—"}
                      </span>
                      <span className="item-time">
                        <IconClock /> {timeAgo(item.created_at)}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}