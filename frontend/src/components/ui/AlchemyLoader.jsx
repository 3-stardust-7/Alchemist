import { FlaskIcon } from "../icons";
import { useState, useRef, useEffect } from "react";
export default  function AlchemyLoader() {
  const messages = [
    "Agent I scanning source material…",
    "Extracting facts & technical specs…",
    "Building verified Fact-Sheet…",
    "Agent II crafting blog post…",
    "Generating social media thread…",
    "Composing email teaser…",
    "Transmutation complete ✦",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loader-wrapper">
      <div className="loader-orb">
        <div className="orb-ring r1" /><div className="orb-ring r2" /><div className="orb-ring r3" />
        <div className="orb-core"><FlaskIcon /></div>
      </div>
      <p className="loader-msg">{messages[idx]}</p>
    </div>
  );
}