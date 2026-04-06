import { CheckIcon } from "../icons";

export default  function StepPill({ num, label, active, done }) {
  return (
    <div className={`step-pill ${active ? "active" : ""} ${done ? "done" : ""}`}>
      <div className="step-num">{done ? <CheckIcon /> : num}</div>
      <span>{label}</span>
    </div>
  );
}