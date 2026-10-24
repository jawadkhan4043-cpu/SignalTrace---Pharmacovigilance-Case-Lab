"use client";

import { useState } from "react";

type Finding = {
  id: string;
  label: string;
};

type TrainingCase = {
  code: string;
  title: string;
  level: string;
  summary: string;
  timeline: { time: string; detail: string; kind: string }[];
  missing: string[];
  explanations: Record<string, string>;
};

const findings: Finding[] = [
  { id: "onset", label: "Event onset date or time" },
  { id: "outcome", label: "Current outcome or status" },
  { id: "history", label: "Relevant background information" },
  { id: "product", label: "Product identification details" },
  { id: "reporter", label: "Reporter follow-up information" },
];

const trainingCases: TrainingCase[] = [
  {
    code: "ST-014",
    title: "The Unclear Timeline",
    level: "Foundation",
    summary:
      "A fictional training note reports that a person experienced an unexpected event during a product-use period. The note does not say exactly when the event began.",
    timeline: [
      { time: "Day 01", detail: "Sample product use is recorded as started.", kind: "product" },
      { time: "Day 04", detail: "A short note mentions an unexpected event.", kind: "event" },
      { time: "Day 06", detail: "A follow-up note says the person contacted the training desk.", kind: "followup" },
    ],
    missing: ["onset", "outcome", "reporter"],
    explanations: {
      onset:
        "The note mentions an event but does not give its onset date or time. A report reviewer would need to seek clarification.",
      outcome:
        "The case does not say whether the event is ongoing, resolved, or otherwise updated.",
      reporter:
        "There is no follow-up contact information in this fictional record.",
    },
  },
  {
    code: "ST-027",
    title: "The Product Details Gap",
    level: "Intermediate",
    summary:
      "Two fictional documents describe the same reported event, but the product is identified only by a broad category. The records do not include identifying details.",
    timeline: [
      { time: "Day 01", detail: "A training record lists a sample product category.", kind: "product" },
      { time: "Day 03", detail: "An event is recorded in a separate note.", kind: "event" },
      { time: "Day 05", detail: "A follow-up document repeats the broad category only.", kind: "followup" },
    ],
    missing: ["product", "history"],
    explanations: {
      product:
        "The report uses a broad category instead of enough product-identification detail for a complete training record.",
      history:
        "Relevant background information is not included. The exercise is to flag the gap, not infer what the background might be.",
    },
  },
  {
    code: "ST-038",
    title: "The Incomplete Follow-up",
    level: "Challenge",
    summary:
      "A fictional event report includes a start date and a product description. A later note says the person was contacted, but the result of that contact is absent.",
    timeline: [
      { time: "Day 01", detail: "A sample product is recorded as started.", kind: "product" },
      { time: "Day 02", detail: "The event onset date is documented.", kind: "event" },
      { time: "Day 07", detail: "A follow-up attempt is recorded; no outcome is written down.", kind: "followup" },
    ],
    missing: ["outcome", "reporter"],
    explanations: {
      outcome:
        "The follow-up attempt is noted, but the current status or outcome is missing from the sample report.",
      reporter:
        "The training record does not provide a way to clarify the follow-up result.",
    },
  },
];

export default function Home() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [summaryDraft, setSummaryDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [reviews, setReviews] = useState(0);

  const currentCase = trainingCases[caseIndex];
  const correct = selected.filter((id) => currentCase.missing.includes(id)).length;
  const missed = currentCase.missing.filter((id) => !selected.includes(id));

  function selectCase(index: number) {
    setCaseIndex(index);
    setSelected([]);
    setSummaryDraft("");
    setSubmitted(false);
  }

  function toggleFinding(id: string) {
    if (submitted) return;
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function reviewCase() {
    if (submitted) return;
    setScore((value) => value + correct);
    setReviews((value) => value + 1);
    setSubmitted(true);
  }

  function resetSession() {
    setCaseIndex(0);
    setSelected([]);
    setSummaryDraft("");
    setSubmitted(false);
    setScore(0);
    setReviews(0);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="SignalTrace home">
          <span className="brand-mark">S</span>
          <span>SignalTrace <span className="brand-light">Case Lab</span></span>
        </a>
        <span className="simulation-badge"><span /> TRAINING SIMULATION</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">PHARMACOVIGILANCE PRACTICE</p>
          <h1>Follow the timeline.<br /><em>Find the missing signal.</em></h1>
          <p className="hero-copy">
            Review fictional event records, spot missing report details, and
            practice writing a clear, neutral summary.
          </p>
          <a className="start-link" href="#case-lab">Open the case lab <span>↓</span></a>
        </div>

        <aside className="progress-card">
          <div className="progress-heading">
            <span className="eyebrow">SESSION PROGRESS</span>
            <span className="spark">✳</span>
          </div>
          <div className="score">{score}<small> pts</small></div>
          <p>{reviews} {reviews === 1 ? "case" : "cases"} reviewed</p>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, reviews * 33)}%` }}
            />
          </div>
          <button className="reset-button" onClick={resetSession}>Reset session</button>
        </aside>
      </section>

      <section id="case-lab" className="lab">
        <div className="section-title">
          <div>
            <p className="eyebrow">CASE FILES</p>
            <h2>Choose a simulation</h2>
          </div>
          <span className="muted">{trainingCases.length} fictional cases</span>
        </div>

        <nav className="case-tabs" aria-label="Training cases">
          {trainingCases.map((trainingCase, index) => (
            <button
              key={trainingCase.code}
              className={index === caseIndex ? "case-tab active" : "case-tab"}
              onClick={() => selectCase(index)}
              aria-pressed={index === caseIndex}
            >
              <span>{trainingCase.code}</span>
              {trainingCase.title}
            </button>
          ))}
        </nav>

        <div className="case-heading">
          <div>
            <span className="level">{currentCase.level}</span>
            <h3>{currentCase.title}</h3>
          </div>
          <span className="case-code">{currentCase.code}</span>
        </div>

        <div className="case-grid">
          <section className="panel timeline-panel">
            <div className="panel-title">
              <span className="panel-icon">↗</span>
              <div>
                <p className="eyebrow">SOURCE NOTE</p>
                <h4>What was reported</h4>
              </div>
            </div>
            <p className="source-summary">{currentCase.summary}</p>

            <div className="timeline">
              {currentCase.timeline.map((entry) => (
                <div className="timeline-row" key={entry.time}>
                  <div className={`timeline-marker ${entry.kind}`} />
                  <div className="timeline-content">
                    <span>{entry.time}</span>
                    <p>{entry.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="privacy-note">
              <strong>Fictional training data</strong>
              <p>These sample cases do not describe real people or products.</p>
            </div>
          </section>

          <section className="panel review-panel">
            <div className="panel-title">
              <span className="panel-icon orange">⌕</span>
              <div>
                <p className="eyebrow">YOUR REVIEW</p>
                <h4>What information is missing?</h4>
              </div>
            </div>

            <div className="checklist">
              {findings.map((finding) => {
                const checked = selected.includes(finding.id);
                const correctFinding = currentCase.missing.includes(finding.id);
                const showExplanation = submitted && currentCase.explanations[finding.id];

                return (
                  <div
                    key={finding.id}
                    className={`check-row ${checked ? "selected" : ""} ${
                      submitted && correctFinding ? "is-correct" : ""
                    } ${
                      submitted && checked && !correctFinding ? "is-extra" : ""
                    }`}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={submitted}
                        onChange={() => toggleFinding(finding.id)}
                      />
                      <span className="fake-check">{checked ? "✓" : ""}</span>
                      <span>{finding.label}</span>
                    </label>
                    {showExplanation && (
                      <p className="explanation">{currentCase.explanations[finding.id]}</p>
                    )}
                    {submitted && checked && !correctFinding && (
                      <p className="explanation">
                        This detail was available in the training case. Check the timeline and source note again.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <label className="draft-label" htmlFor="summary">
              Neutral practice summary
              <textarea
                id="summary"
                value={summaryDraft}
                onChange={(event) => setSummaryDraft(event.target.value)}
                placeholder="Summarize only what the fictional record says. Avoid guessing or adding conclusions."
                rows={4}
                disabled={submitted}
              />
            </label>

            {!submitted ? (
              <button className="review-button" onClick={reviewCase}>
                Review my case <span>→</span>
              </button>
            ) : (
              <div className="debrief" role="status">
                <strong>{correct} of {currentCase.missing.length} missing details found</strong>
                <p>
                  {missed.length
                    ? "Read the explanations, then compare them with the timeline."
                    : "You found every intended gap in this training case."}
                </p>
                <div className="report-preview">
                  <span className="eyebrow">PRACTICE REPORT · NOT SUBMITTED</span>
                  <p>{summaryDraft.trim() || "No summary entered for this exercise."}</p>
                  <small>Case {currentCase.code} · Simulation only</small>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="footer">
        <strong>SignalTrace Case Lab</strong>
        <span>Educational simulation only · No real reports are sent or stored</span>
      </footer>
    </main>
  );
}