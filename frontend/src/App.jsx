import { useDispatch, useSelector } from "react-redux";
import {
  setSourceContent,
  setSourceType,
  submitDocument,
  resetCampaign,
} from "./store/Campaignslice";

export default function App() {
  const dispatch = useDispatch();
  const { sourceContent, sourceType, submitStatus, submitError, serverResponse } =
    useSelector((state) => state.campaign);

  const handleSubmit = () => {
    if (!sourceContent.trim()) return;
    dispatch(submitDocument({ content: sourceContent, source_type: sourceType }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-700 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <circle cx="4" cy="8" r="2" fill="#e0e7ff" />
              <circle cx="12" cy="5" r="2" fill="#a5b4fc" />
              <circle cx="12" cy="11" r="2" fill="#a5b4fc" />
              <line x1="6" y1="8" x2="10" y2="5.5" stroke="#a5b4fc" strokeWidth="1" />
              <line x1="6" y1="8" x2="10" y2="10.5" stroke="#a5b4fc" strokeWidth="1" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">ContentFactory</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-900">How it works</span>
          <span className="cursor-pointer hover:text-gray-900">Agents</span>
          <span className="cursor-pointer hover:text-gray-900">Features</span>
        </div>
        <button className="text-sm bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium">
          Try it free
        </button>
      </nav>

      {/* Hero */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-500 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          Powered by multi-agent AI
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-4">
          One doc.{" "}
          <span className="text-indigo-600">Two agents.</span>
          <br />
          Full campaign — instantly.
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
          Drop in a product brief. A Fact-Check Agent verifies the truth, then a
          Copywriter Agent produces your Blog, Social Thread, and Email — automatically.
        </p>
      </div>

      {/* Agent Pipeline */}
      <div className="flex items-center justify-center gap-3 px-8 mb-12 flex-wrap">
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-4 w-32 text-center">
          <div className="text-2xl mb-1">📄</div>
          <p className="text-xs text-gray-500">Source doc</p>
        </div>
        <span className="text-gray-400 text-lg">→</span>
        <div className="bg-white border border-gray-200 rounded-xl p-4 w-40">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-2">🔍</div>
          <p className="text-xs font-medium text-gray-800 mb-0.5">Fact-Check Agent</p>
          <p className="text-xs text-gray-400">Extracts & verifies facts</p>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full mt-1.5 inline-block">Analytical brain</span>
        </div>
        <span className="text-gray-400 text-lg">→</span>
        <div className="bg-white border border-gray-200 rounded-xl p-4 w-40">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mb-2">✍️</div>
          <p className="text-xs font-medium text-gray-800 mb-0.5">Copywriter Agent</p>
          <p className="text-xs text-gray-400">Blog, thread & email</p>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full mt-1.5 inline-block">The voice</span>
        </div>
        <span className="text-gray-400 text-lg">→</span>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 w-32 text-center">
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full block mb-1">Output</span>
          <p className="text-xs text-gray-500">Blog · Thread · Email</p>
        </div>
      </div>

      {/* Upload / Input Area */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => dispatch(setSourceType("text"))}
              className={`text-sm px-4 py-1.5 rounded-md border transition-colors ${
                sourceType === "text"
                  ? "bg-indigo-700 text-white border-indigo-700"
                  : "text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              Paste text
            </button>
            <button
              onClick={() => dispatch(setSourceType("url"))}
              className={`text-sm px-4 py-1.5 rounded-md border transition-colors ${
                sourceType === "url"
                  ? "bg-indigo-700 text-white border-indigo-700"
                  : "text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              Enter URL
            </button>
          </div>

          <textarea
            rows={6}
            value={sourceContent}
            onChange={(e) => dispatch(setSourceContent(e.target.value))}
            placeholder={
              sourceType === "text"
                ? "Paste your product brief, blog post, or technical document here..."
                : "Enter a URL to a product page or article..."
            }
            className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300"
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">{sourceContent.length} characters</span>
            <div className="flex gap-2">
              {submitStatus !== "idle" && (
                <button
                  onClick={() => dispatch(resetCampaign())}
                  className="text-sm text-gray-400 border border-gray-200 px-4 py-2 rounded-lg hover:text-gray-600"
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!sourceContent.trim() || submitStatus === "loading"}
                className="text-sm bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-800 transition-colors"
              >
                {submitStatus === "loading" ? "Sending..." : "Run agents →"}
              </button>
            </div>
          </div>
        </div>

        {/* Status feedback */}
        {submitStatus === "success" && serverResponse && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm font-medium text-emerald-800 mb-1">
              ✓ Document received by backend
            </p>
            <p className="text-xs text-emerald-600">
              {serverResponse.char_count} characters · {serverResponse.message}
            </p>
            <p className="text-xs text-gray-400 mt-1 italic">Preview: "{serverResponse.preview}..."</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-medium text-red-700">✗ Could not reach backend</p>
            <p className="text-xs text-red-500 mt-1">{submitError}</p>
            <p className="text-xs text-gray-400 mt-1">Make sure FastAPI is running on port 8000</p>
          </div>
        )}
      </div>

      {/* Features strip */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto px-4 mb-16">
        {[
          { icon: "🔍", title: "Fact extraction", desc: "Specs, features & audience pulled automatically" },
          { icon: "✍️", title: "3-format output", desc: "Blog, social thread, and email in one run" },
          { icon: "📦", title: "Export ready", desc: "Download your full campaign kit instantly" },
        ].map((f) => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl mb-2">{f.icon}</div>
            <p className="text-sm font-medium text-gray-800 mb-1">{f.title}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="text-center pb-8 text-xs text-gray-400">
        Built with React · Tailwind · Redux · FastAPI · Claude API
      </footer>
    </div>
  );
}