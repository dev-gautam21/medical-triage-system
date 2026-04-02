import { useState, useEffect} from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   MEDITRIAGE — AI-Assisted Medical Triage & Case Summarization System
   All styles are injected via <style> tag to guarantee they load correctly.
───────────────────────────────────────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:    #0D1B2A;
    --navy-2:  #1B2E45;
    --blue:    #1A6FBF;
    --blue-lt: #2E86D4;
    --blue-pale: #E8F4FD;
    --blue-pale2: #D0E9F8;
    --teal:    #0FA890;
    --teal-lt: #E0F7F4;
    --white:   #FFFFFF;
    --gray-50: #F8FAFC;
    --gray-100:#F1F5F9;
    --gray-200:#E2E8F0;
    --gray-400:#94A3B8;
    --gray-600:#475569;
    --gray-800:#1E293B;
    --red:     #C0392B;
    --red-lt:  #FDEDEC;
    --red-border: #E57373;
    --yellow:  #B7770D;
    --yellow-lt:#FEF9EC;
    --yellow-border:#F5C842;
    --green:   #0E7A54;
    --green-lt:#EAFAF3;
    --green-border:#52C599;
    --radius:  14px;
    --radius-lg: 20px;
    --shadow-sm: 0 1px 4px rgba(13,27,42,0.07);
    --shadow:  0 4px 20px rgba(13,27,42,0.10);
    --shadow-lg: 0 10px 40px rgba(13,27,42,0.14);
    --font: 'Plus Jakarta Sans', system-ui, sans-serif;
    --font-serif: 'Lora', Georgia, serif;
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font);
    background: var(--gray-50);
    color: var(--gray-800);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── APP SHELL ── */
  .mt-app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(ellipse 70% 50% at 100% 0%, rgba(26,111,191,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 0% 100%, rgba(15,168,144,0.06) 0%, transparent 60%),
      #F8FAFC;
  }

  /* ── HEADER ── */
  .mt-header {
    position: sticky; top: 0; z-index: 200;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--gray-200);
    box-shadow: var(--shadow-sm);
  }
  .mt-header-inner {
    max-width: 900px; margin: 0 auto;
    padding: 0 1.5rem;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .mt-logo {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; user-select: none; text-decoration: none;
  }
  .mt-logo-mark {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--blue), var(--teal));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; color: white;
    box-shadow: 0 2px 8px rgba(26,111,191,0.3);
  }
  .mt-logo-text { display: flex; flex-direction: column; line-height: 1; }
  .mt-logo-name {
    font-size: 1.05rem; font-weight: 800;
    color: var(--navy); letter-spacing: -0.02em;
  }
  .mt-logo-tag {
    font-size: 0.65rem; color: var(--gray-400);
    font-weight: 500; letter-spacing: 0.04em;
    text-transform: uppercase; margin-top: 2px;
  }
  .mt-scope-badge {
    font-size: 0.72rem; font-weight: 600;
    color: var(--blue); background: var(--blue-pale);
    border: 1px solid var(--blue-pale2);
    padding: 5px 12px; border-radius: 100px;
    letter-spacing: 0.01em;
  }

  /* ── MAIN ── */
  .mt-main {
    flex: 1;
    max-width: 900px; width: 100%;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* ── FOOTER ── */
  .mt-footer {
    background: var(--white);
    border-top: 1px solid var(--gray-200);
    padding: 1rem 1.5rem;
  }
  .mt-footer-inner {
    max-width: 900px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center;
    gap: 1rem; flex-wrap: wrap;
    font-size: 0.72rem; color: var(--gray-400);
    text-align: center;
  }
  .mt-footer-inner span { display: flex; align-items: center; gap: 4px; }

  /* ── ANIMATIONS ── */
  @keyframes mt-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mt-slide-right {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes mt-slide-left {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes mt-pulse-ring {
    0%   { transform: scale(1);   opacity: 0.5; }
    80%  { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes mt-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes mt-dot-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1;   }
  }
  @keyframes mt-bar-grow {
    from { width: 0; }
  }
  @keyframes mt-banner-pop {
    0%   { opacity: 0; transform: scale(0.97) translateY(8px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  .mt-fade-up       { animation: mt-fade-up 0.45s var(--ease) both; }
  .mt-slide-right   { animation: mt-slide-right 0.35s var(--ease) both; }
  .mt-slide-left    { animation: mt-slide-left 0.35s var(--ease) both; }

  /* ────────────────────────────────────────────────────────────
     HOME VIEW
  ──────────────────────────────────────────────────────────── */
  .mt-home { display: flex; flex-direction: column; gap: 2.5rem; }

  /* Disclaimer */
  .mt-disc {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: var(--yellow-lt);
    border: 1px solid var(--yellow-border);
    border-left: 4px solid var(--yellow);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    font-size: 0.875rem; color: #7c5600;
    animation: mt-fade-up 0.4s var(--ease) both;
  }
  .mt-disc-icon { font-size: 1.1rem; flex-shrink: 0; padding-top: 1px; }

  /* Hero */
  .mt-hero {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1.25rem;
    animation: mt-fade-up 0.5s 0.05s var(--ease) both;
  }
  .mt-hero-orb {
    position: relative; width: 90px; height: 90px;
    display: flex; align-items: center; justify-content: center;
  }
  .mt-orb-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid var(--blue-lt);
    animation: mt-pulse-ring 2.5s ease-out infinite;
  }
  .mt-orb-ring-2 { animation-delay: 1.25s; border-color: var(--teal); }
  .mt-orb-core {
    width: 62px; height: 62px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; color: white;
    box-shadow: 0 4px 20px rgba(26,111,191,0.35);
    position: relative; z-index: 1;
  }
  .mt-hero-title {
    font-family: var(--font-serif);
    font-size: clamp(1.9rem, 4.5vw, 2.8rem);
    color: var(--navy); line-height: 1.15; letter-spacing: -0.02em;
  }
  .mt-hero-title em { font-style: italic; color: var(--blue); }
  .mt-hero-sub {
    max-width: 500px; color: var(--gray-600);
    font-size: 1rem; line-height: 1.7; font-weight: 400;
  }

  /* Stats strip */
  .mt-stats {
    display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;
    margin-top: 0.5rem;
  }
  .mt-stat {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
  }
  .mt-stat-val {
    font-size: 1.4rem; font-weight: 800; color: var(--blue);
  }
  .mt-stat-lbl { font-size: 0.72rem; color: var(--gray-400); font-weight: 500; }

  /* Symptom select */
  .mt-symptom-section {
    animation: mt-fade-up 0.5s 0.1s var(--ease) both;
  }
  .mt-section-eyebrow {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--gray-400);
    text-align: center; margin-bottom: 1.25rem;
  }
  .mt-symptom-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem;
  }
  .mt-symptom-btn {
    all: unset;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    padding: 2rem 1rem 1.6rem;
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.22s var(--ease);
    box-shadow: var(--shadow-sm);
    position: relative; overflow: hidden;
    text-align: center;
  }
  .mt-symptom-btn::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--accent-color, linear-gradient(90deg, var(--blue), var(--teal)));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.25s var(--ease);
  }
  .mt-symptom-btn:hover {
    border-color: var(--blue-lt);
    box-shadow: 0 8px 28px rgba(26,111,191,0.14);
    transform: translateY(-4px);
  }
  .mt-symptom-btn:hover::after { transform: scaleX(1); }
  .mt-symptom-emoji { font-size: 2.6rem; line-height: 1; }
  .mt-symptom-name {
    font-size: 1.05rem; font-weight: 700; color: var(--navy);
  }
  .mt-symptom-desc {
    font-size: 0.76rem; color: var(--gray-400); line-height: 1.5;
  }
  .mt-symptom-arrow {
    font-size: 1rem; color: var(--blue);
    opacity: 0; margin-top: 4px;
    transition: opacity 0.2s, transform 0.2s;
    transform: translateX(-4px);
  }
  .mt-symptom-btn:hover .mt-symptom-arrow {
    opacity: 1; transform: translateX(0);
  }

  /* Home footer info */
  .mt-home-meta {
    display: flex; align-items: center; justify-content: center;
    gap: 1rem; flex-wrap: wrap;
    font-size: 0.75rem; color: var(--gray-400);
    animation: mt-fade-up 0.5s 0.15s var(--ease) both;
  }
  .mt-home-meta-dot { color: var(--gray-200); }

  /* ────────────────────────────────────────────────────────────
     QUESTIONS VIEW
  ──────────────────────────────────────────────────────────── */
  .mt-questions { display: flex; flex-direction: column; gap: 1.75rem; }

  /* Progress */
  .mt-progress-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
    padding: 1.1rem 1.4rem;
    box-shadow: var(--shadow-sm);
  }
  .mt-progress-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.7rem;
  }
  .mt-progress-symptom {
    font-size: 0.85rem; font-weight: 700; color: var(--blue);
    display: flex; align-items: center; gap: 6px;
  }
  .mt-progress-step {
    font-size: 0.78rem; color: var(--gray-400); font-weight: 500;
  }
  .mt-progress-track {
    height: 6px; background: var(--gray-100); border-radius: 100px; overflow: hidden;
  }
  .mt-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blue), var(--teal));
    border-radius: 100px;
    transition: width 0.5s var(--ease);
    animation: mt-bar-grow 0.5s var(--ease);
  }

  /* Question card */
  .mt-q-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 2.5rem 2.25rem;
    box-shadow: var(--shadow);
    display: flex; flex-direction: column; gap: 1.3rem;
  }
  .mt-q-badge {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--blue-pale);
    color: var(--blue); font-weight: 800; font-size: 0.8rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mt-q-text {
    font-family: var(--font-serif);
    font-size: clamp(1.15rem, 2.8vw, 1.5rem);
    color: var(--navy); line-height: 1.3; font-weight: 500;
  }
  .mt-q-sub {
    font-size: 0.875rem; color: var(--gray-400);
    margin-top: -0.6rem; line-height: 1.55;
  }

  /* Number input */
  .mt-num-wrap {
    display: flex; align-items: center; gap: 0.85rem; margin: 0.25rem 0;
  }
  .mt-num-input {
    width: 130px; padding: 0.9rem 1rem;
    font-size: 1.5rem; font-weight: 700;
    font-family: var(--font);
    color: var(--navy);
    text-align: center;
    border: 2px solid var(--gray-200);
    border-radius: var(--radius);
    outline: none;
    background: var(--white);
    transition: border-color 0.2s, box-shadow 0.2s;
    -moz-appearance: textfield;
  }
  .mt-num-input::-webkit-outer-spin-button,
  .mt-num-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .mt-num-input:focus {
    border-color: var(--blue-lt);
    box-shadow: 0 0 0 4px rgba(26,111,191,0.12);
  }
  .mt-num-unit { font-size: 0.9rem; color: var(--gray-400); font-weight: 500; }

  /* Boolean buttons */
  .mt-bool-row {
    display: flex; gap: 1rem; margin: 0.25rem 0;
  }
  .mt-bool-btn {
    all: unset;
    flex: 1; max-width: 180px;
    padding: 1.1rem 1.5rem;
    border: 2px solid var(--gray-200);
    border-radius: var(--radius);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.7rem;
    font-family: var(--font); font-size: 1rem; font-weight: 600;
    color: var(--gray-600);
    background: var(--white);
    transition: all 0.2s var(--ease);
  }
  .mt-bool-btn:hover {
    border-color: var(--blue-lt);
    background: var(--blue-pale);
    color: var(--blue);
  }
  .mt-bool-btn.active {
    border-color: var(--blue);
    background: var(--blue-pale);
    color: var(--blue);
    box-shadow: 0 0 0 3px rgba(26,111,191,0.15);
  }
  .mt-bool-btn.active-no {
    border-color: var(--teal);
    background: var(--teal-lt);
    color: var(--teal);
    box-shadow: 0 0 0 3px rgba(15,168,144,0.12);
  }
  .mt-bool-icon { font-size: 1.2rem; }

  /* Error */
  .mt-field-error {
    display: flex; align-items: center; gap: 8px;
    background: var(--red-lt); border: 1px solid var(--red-border);
    border-radius: 8px; padding: 0.65rem 0.9rem;
    font-size: 0.85rem; color: var(--red); font-weight: 500;
  }

  /* Actions */
  .mt-q-actions {
    display: flex; gap: 0.75rem; margin-top: 0.5rem;
  }

  /* Q disclaimer */
  .mt-q-disclaimer {
    text-align: center; font-size: 0.76rem; color: var(--red);
    font-weight: 600; letter-spacing: 0.01em;
  }

  /* ── BUTTONS ── */
  .mt-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 0.85rem 1.75rem;
    background: linear-gradient(135deg, var(--blue), #1558A8);
    color: var(--white); border: none; border-radius: var(--radius);
    font-family: var(--font); font-size: 0.95rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.01em;
    box-shadow: 0 3px 12px rgba(26,111,191,0.35);
    transition: all 0.2s var(--ease);
  }
  .mt-btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1558A8, var(--blue));
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(26,111,191,0.4);
  }
  .mt-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .mt-btn-outline {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 0.85rem 1.4rem;
    background: var(--white); color: var(--blue);
    border: 1.5px solid var(--blue-lt); border-radius: var(--radius);
    font-family: var(--font); font-size: 0.9rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s var(--ease);
  }
  .mt-btn-outline:hover {
    background: var(--blue-pale);
    box-shadow: var(--shadow-sm);
  }

  .mt-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 0.85rem 1.2rem;
    background: transparent; color: var(--gray-600);
    border: 1.5px solid var(--gray-200); border-radius: var(--radius);
    font-family: var(--font); font-size: 0.88rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s var(--ease);
  }
  .mt-btn-ghost:hover {
    background: var(--gray-100); border-color: var(--gray-400);
  }

  .mt-btn-sm { padding: 0.55rem 1rem; font-size: 0.82rem; }

  /* ── LOADING VIEW ── */
  .mt-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 55vh;
  }
  .mt-loading-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 3rem 2.5rem;
    box-shadow: var(--shadow-lg);
    text-align: center;
    max-width: 420px; width: 100%;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
  }
  .mt-spinner {
    position: relative; width: 72px; height: 72px;
    display: flex; align-items: center; justify-content: center;
  }
  .mt-spinner-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 3px solid var(--gray-100);
    border-top-color: var(--blue);
    animation: mt-spin 0.85s linear infinite;
  }
  .mt-spinner-ring-2 {
    inset: 8px; border-top-color: var(--teal);
    animation-direction: reverse; animation-duration: 1.3s;
  }
  .mt-spinner-sym { font-size: 1.5rem; position: relative; z-index: 1; }
  .mt-loading-title {
    font-family: var(--font-serif);
    font-size: 1.35rem; color: var(--navy); font-weight: 500;
  }
  .mt-loading-sub { font-size: 0.875rem; color: var(--gray-400); line-height: 1.6; }
  .mt-dots { display: flex; gap: 6px; margin-top: 4px; }
  .mt-dots span {
    width: 8px; height: 8px; background: var(--blue);
    border-radius: 50%; animation: mt-dot-bounce 1.4s ease-in-out infinite;
  }
  .mt-dots span:nth-child(2) { animation-delay: 0.18s; }
  .mt-dots span:nth-child(3) { animation-delay: 0.36s; }

  /* ── RESULT VIEW ── */
  .mt-result { display: flex; flex-direction: column; gap: 1.5rem; }

  /* Urgency banner */
  .mt-urgency-banner {
    display: flex; align-items: center; gap: 1.5rem;
    padding: 1.5rem 1.75rem;
    border-radius: var(--radius-lg);
    border-width: 2px; border-style: solid;
    box-shadow: var(--shadow);
    animation: mt-banner-pop 0.5s var(--ease) both;
  }
  .mt-urgency-banner.red    { background: var(--red-lt);    border-color: var(--red-border); }
  .mt-urgency-banner.yellow { background: var(--yellow-lt); border-color: var(--yellow-border); }
  .mt-urgency-banner.green  { background: var(--green-lt);  border-color: var(--green-border); }

  .mt-urgency-icon-wrap {
    width: 64px; height: 64px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; flex-shrink: 0;
  }
  .red    .mt-urgency-icon-wrap { background: rgba(192,57,43,0.12); }
  .yellow .mt-urgency-icon-wrap { background: rgba(183,119,13,0.12); }
  .green  .mt-urgency-icon-wrap { background: rgba(14,122,84,0.12); }

  .mt-urgency-label {
    font-size: 1.6rem; font-weight: 900; letter-spacing: -0.02em;
    line-height: 1;
  }
  .red    .mt-urgency-label { color: var(--red); }
  .yellow .mt-urgency-label { color: var(--yellow); }
  .green  .mt-urgency-label { color: var(--green); }

  .mt-urgency-tagline { font-size: 0.9rem; color: var(--gray-600); margin-top: 4px; font-weight: 500; }
  .mt-urgency-desc {
    font-size: 0.875rem; color: var(--gray-600); line-height: 1.65;
    background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius); padding: 1rem 1.25rem;
    box-shadow: var(--shadow-sm);
  }

  /* Summary card */
  .mt-summary-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    box-shadow: var(--shadow);
    display: flex; flex-direction: column; gap: 0;
  }
  .mt-summary-head {
    display: flex; align-items: center; gap: 0.9rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--gray-100);
    margin-bottom: 0.5rem;
  }
  .mt-summary-head-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: var(--blue-pale);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
  }
  .mt-summary-head-title {
    font-family: var(--font-serif);
    font-size: 1.1rem; color: var(--navy); font-weight: 500;
  }
  .mt-summary-head-sub {
    display: block; font-size: 0.7rem; color: var(--gray-400);
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    margin-top: 2px;
  }

  .mt-sum-row {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid var(--gray-100);
  }
  .mt-sum-row:last-child { border-bottom: none; }
  .mt-sum-row-icon { font-size: 1rem; width: 22px; text-align: center; flex-shrink: 0; }
  .mt-sum-row-label { flex: 1; font-size: 0.85rem; color: var(--gray-400); font-weight: 500; }
  .mt-sum-row-value { font-size: 0.925rem; font-weight: 700; color: var(--gray-800); }
  .mt-sum-row-value.flag { color: var(--red); }
  .mt-sum-row-value.urgency-red    { color: var(--red);    font-size: 1rem; }
  .mt-sum-row-value.urgency-yellow { color: var(--yellow); font-size: 1rem; }
  .mt-sum-row-value.urgency-green  { color: var(--green);  font-size: 1rem; }
  .mt-sum-row.highlighted {
    background: #FFF5F5; margin: 0 -0.25rem;
    padding: 0.9rem 0.25rem; border-radius: 8px;
  }

  /* Red flags */
  .mt-red-flags {
    background: var(--red-lt); border: 1.5px solid var(--red-border);
    border-radius: var(--radius); padding: 1.1rem 1.25rem;
    margin-top: 1rem;
  }
  .mt-red-flags-title {
    font-size: 0.82rem; font-weight: 800; color: var(--red);
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.65rem;
  }
  .mt-red-flags-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
  .mt-red-flags-list li {
    font-size: 0.875rem; color: var(--red);
    padding-left: 1.1rem; position: relative; line-height: 1.5;
  }
  .mt-red-flags-list li::before { content: '•'; position: absolute; left: 0; }

  /* Summary disclaimer */
  .mt-sum-disc {
    margin-top: 1rem; padding: 0.75rem 1rem;
    background: var(--gray-50); border: 1px solid var(--gray-200);
    border-radius: 8px; font-size: 0.74rem; color: var(--gray-400);
    font-style: italic; line-height: 1.55;
  }

  /* Result actions */
  .mt-result-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

  /* ── DOCTOR VIEW ── */
  .mt-doctor { display: flex; flex-direction: column; gap: 1.5rem; }
  .mt-doc-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap;
  }
  .mt-doc-title {
    font-family: var(--font-serif);
    font-size: 1.65rem; color: var(--navy); font-weight: 500;
    letter-spacing: -0.01em;
  }
  .mt-doc-subtitle { font-size: 0.875rem; color: var(--gray-400); margin-top: 4px; }
  .mt-doc-header-actions { display: flex; gap: 0.6rem; }

  .mt-doc-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
  }
  .mt-doc-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s;
  }
  .mt-doc-card:hover { box-shadow: var(--shadow); }
  .mt-doc-card.full  { grid-column: 1 / -1; }
  .mt-doc-card.flag  { border-color: var(--red-border); background: var(--red-lt); }
  .mt-doc-card.urgency-card-red    { border-color: var(--red-border);    background: var(--red-lt); }
  .mt-doc-card.urgency-card-yellow { border-color: var(--yellow-border); background: var(--yellow-lt); }
  .mt-doc-card.urgency-card-green  { border-color: var(--green-border);  background: var(--green-lt); }

  .mt-doc-card-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gray-400);
    margin-bottom: 0.55rem;
    display: flex; align-items: center; gap: 6px;
  }
  .mt-flag-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--red);
    display: inline-block; flex-shrink: 0;
    animation: mt-pulse-ring 1.5s ease-out infinite;
    box-shadow: 0 0 0 2px var(--red-lt);
  }
  .mt-doc-val { font-size: 1rem; font-weight: 700; color: var(--gray-800); }
  .mt-doc-val.big { font-size: 1.65rem; font-weight: 900; color: var(--navy); }
  .mt-doc-val.flag-val { color: var(--red); font-size: 1rem; }
  .mt-doc-val.urg-red    { color: var(--red);    font-size: 1.5rem; font-weight: 900; }
  .mt-doc-val.urg-yellow { color: var(--yellow); font-size: 1.5rem; font-weight: 900; }
  .mt-doc-val.urg-green  { color: var(--green);  font-size: 1.5rem; font-weight: 900; }
  .mt-doc-val-sub { font-size: 0.82rem; color: var(--gray-400); margin-top: 4px; font-weight: 500; }

  .mt-doc-flag-list { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.5rem; }
  .mt-doc-flag-list li {
    font-size: 0.875rem; color: var(--red);
    padding: 0.65rem 0.9rem;
    background: rgba(192,57,43,0.07);
    border-radius: 8px; border-left: 3px solid var(--red);
    line-height: 1.5;
  }

  .mt-doc-disc {
    background: var(--gray-50); border-color: var(--gray-200);
    font-size: 0.8rem; color: var(--gray-400);
    line-height: 1.65; font-style: italic;
  }

  /* ── PRINT ── */
  @media print {
    .no-print, .mt-header, .mt-footer, .mt-result-actions, .mt-doc-header-actions { display: none !important; }
    body { background: white; }
    .mt-app { background: white; }
    .mt-main { max-width: 100%; padding: 0; }
    .mt-summary-card, .mt-doc-card, .mt-urgency-banner { box-shadow: none !important; break-inside: avoid; }
    .mt-doc-grid { break-inside: avoid; }
    .mt-header-inner { display: none !important; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .mt-symptom-grid { grid-template-columns: 1fr; }
    .mt-doc-grid { grid-template-columns: 1fr; }
    .mt-doc-card.full { grid-column: auto; }
    .mt-urgency-banner { flex-direction: column; text-align: center; align-items: center; }
    .mt-result-actions { flex-direction: column; }
    .mt-q-card { padding: 1.75rem 1.25rem; }
    .mt-bool-row { flex-direction: column; max-width: 260px; }
    .mt-bool-btn { max-width: 100%; }
    .mt-q-actions { flex-direction: column-reverse; }
    .mt-btn-primary, .mt-btn-ghost { width: 100%; }
    .mt-stats { gap: 1.25rem; }
    .mt-doc-header { flex-direction: column; }
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
const QUESTIONS = {
  Fever: [
    { id: "feverDays", type: "number", label: "How many days have you had a fever?", sub: "Count from the first day you noticed an elevated temperature.", placeholder: "e.g. 2", unit: "days" },
    { id: "breathing", type: "bool",   label: "Are you experiencing any difficulty breathing?", sub: "Includes shortness of breath, rapid breathing, or wheezing." },
    { id: "chestPain", type: "bool",   label: "Do you have any chest pain or pressure?",       sub: "Any discomfort, tightness, or pain in the chest area." },
  ],
  Cold: [
    { id: "feverDays", type: "number", label: "How many days have you had cold symptoms?",    sub: "Runny nose, congestion, sneezing — count from day one.", placeholder: "e.g. 3", unit: "days" },
    { id: "breathing", type: "bool",   label: "Are you experiencing any difficulty breathing?", sub: "Includes shortness of breath, rapid breathing, or wheezing." },
    { id: "chestPain", type: "bool",   label: "Do you have any chest pain or pressure?",       sub: "Any discomfort, tightness, or pain in the chest area." },
  ],
  Cough: [
    { id: "feverDays", type: "number", label: "How many days have you been coughing?",        sub: "Count from when the cough first started.", placeholder: "e.g. 5", unit: "days" },
    { id: "breathing", type: "bool",   label: "Are you experiencing any difficulty breathing?", sub: "Includes shortness of breath, rapid breathing, or wheezing." },
    { id: "chestPain", type: "bool",   label: "Do you have any chest pain or pressure?",       sub: "Any discomfort, tightness, or pain in the chest area." },
  ],
};

const SYMPTOMS = [
  { id: "Fever", emoji: "🌡️", desc: "High temperature, chills, sweating"   },
  { id: "Cold",  emoji: "🤧", desc: "Runny nose, congestion, sneezing"     },
  { id: "Cough", emoji: "😮‍💨", desc: "Persistent dry or wet cough"          },
];

const URGENCY = {
  Emergency:        { cls: "red",    icon: "🚨", label: "🔴 Emergency",        tagline: "Seek immediate emergency care now", desc: "Your symptoms indicate a potential emergency. Call emergency services (112/108) or go to the nearest ER immediately. Do not drive yourself." },
  "Doctor Required":{ cls: "yellow", icon: "⚕️", label: "🟡 Doctor Required",  tagline: "See a physician within 24–48 hours", desc: "Your symptoms suggest you should see a doctor soon. Visit an urgent care clinic or schedule a same-day appointment with your physician." },
  Routine:          { cls: "green",  icon: "✅", label: "🟢 Routine",           tagline: "Rest & home care recommended",        desc: "Your symptoms appear mild and manageable at home. Rest well, stay hydrated, and monitor your condition. Seek care if symptoms worsen." },
};

const VIEWS = { HOME: "home", QUESTIONS: "questions", LOADING: "loading", RESULT: "result", DOCTOR: "doctor" };

// ── Main Component ────────────────────────────────────────────────────────────
export default function App() {
  const [view,      setView]      = useState(VIEWS.HOME);
  const [symptom,   setSymptom]   = useState(null);
  const [step,      setStep]      = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [val,       setVal]       = useState("");
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState("");
  const [anim,      setAnim]      = useState("mt-slide-right");

  // Inject CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "mt-styles";
    el.textContent = CSS;
    if (!document.getElementById("mt-styles")) document.head.appendChild(el);

    // Also update page title
    document.title = "MediTriage — AI-Assisted Medical Triage System";
    // Add Google Fonts link
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,400&display=swap";
    if (!document.querySelector('link[href*="Plus+Jakarta"]')) document.head.appendChild(link);
  }, []);

  const reset = () => { setView(VIEWS.HOME); setSymptom(null); setStep(0); setAnswers({}); setVal(""); setResult(null); setError(""); };

  const qs = symptom ? QUESTIONS[symptom] : [];
  const totalSteps = qs.length;
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  const transition = (fn) => { setAnim(""); setTimeout(() => { fn(); setAnim("mt-slide-right"); }, 20); };

  const next = async () => {
    const q = qs[step];
    if (q.type === "number") {
      if (val === "" || isNaN(Number(val)) || Number(val) < 0) { setError("Please enter a valid number of days."); return; }
    } else {
      if (!val) { setError("Please select Yes or No."); return; }
    }

    const newAnswers = { ...answers, [q.id]: q.type === "bool" ? val === "yes" : Number(val) };
    setAnswers(newAnswers);
    setError("");

    if (step < totalSteps - 1) {
      transition(() => { setStep(s => s + 1); setVal(""); });
    } else {
      await submit(newAnswers);
    }
  };

  const back = () => {
    setError("");
    if (step === 0) { setView(VIEWS.HOME); return; }
    transition(() => {
      setStep(s => s - 1);
      const prev = answers[qs[step - 1].id];
      if (typeof prev === "boolean") setVal(prev ? "yes" : "no");
      else setVal(prev !== undefined ? String(prev) : "");
    });
  };

  const submit = async (finalAnswers) => {
    setView(VIEWS.LOADING);
    try {
      const res = await fetch("http://localhost:3001/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom, ...finalAnswers }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setResult({ ...data, payload: finalAnswers });
      setView(VIEWS.RESULT);
    } catch (e) {
      setView(VIEWS.QUESTIONS);
      setError(
        e.message.includes("fetch") || e.message.includes("Failed")
          ? "Cannot connect to backend (port 3001). Please make sure the server is running."
          : e.message
      );
    }
  };

  const urgCfg = result ? (URGENCY[result.urgency] || URGENCY.Routine) : null;
  const hasFlags = result && (result.summary.breathingDifficulty === "Yes" || result.summary.chestPain === "Yes");

  return (
    <div className="mt-app">
      {/* ── Header ── */}
      <header className="mt-header no-print">
        <div className="mt-header-inner">
          <div className="mt-logo" onClick={reset}>
            <div className="mt-logo-mark">⚕</div>
            <div className="mt-logo-text">
              <span className="mt-logo-name">MediTriage</span>
              <span className="mt-logo-tag">AI Clinical Assessment</span>
            </div>
          </div>
          <span className="mt-scope-badge">Fever · Cold · Cough</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mt-main">

        {/* HOME */}
        {view === VIEWS.HOME && (
          <div className="mt-home">
            <div className="mt-disc">
              <span className="mt-disc-icon">⚠️</span>
              <span>
                <strong>Important Notice:</strong> This tool is for triage support only and does{" "}
                <strong>NOT</strong> provide medical diagnosis, prescriptions, or treatment advice.
                Always consult a licensed physician for medical decisions.
              </span>
            </div>

            <div className="mt-hero">
              <div className="mt-hero-orb">
                <div className="mt-orb-ring" />
                <div className="mt-orb-ring mt-orb-ring-2" />
                <div className="mt-orb-core">⚕</div>
              </div>
              <h1 className="mt-hero-title">
                AI-Assisted <em>Medical Triage</em><br />& Case Summarization
              </h1>
              <p className="mt-hero-sub">
                Answer a short series of guided clinical questions. Our system will evaluate
                your urgency level and generate a structured summary for physician review.
              </p>
              <div className="mt-stats">
                <div className="mt-stat"><span className="mt-stat-val">~60s</span><span className="mt-stat-lbl">Assessment Time</span></div>
                <div className="mt-stat"><span className="mt-stat-val">3</span><span className="mt-stat-lbl">Questions</span></div>
                <div className="mt-stat"><span className="mt-stat-val">3</span><span className="mt-stat-lbl">Urgency Levels</span></div>
              </div>
            </div>

            <div className="mt-symptom-section">
              <p className="mt-section-eyebrow">Select your primary symptom to begin</p>
              <div className="mt-symptom-grid">
                {SYMPTOMS.map(s => (
                  <button key={s.id} className="mt-symptom-btn" onClick={() => { setSymptom(s.id); setStep(0); setVal(""); setAnswers({}); setView(VIEWS.QUESTIONS); }}>
                    <span className="mt-symptom-emoji">{s.emoji}</span>
                    <span className="mt-symptom-name">{s.id}</span>
                    <span className="mt-symptom-desc">{s.desc}</span>
                    <span className="mt-symptom-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-home-meta">
              <span>🔒 No personal data stored</span>
              <span className="mt-home-meta-dot">·</span>
              <span>🏥 For emergencies, call 108 immediately</span>
              <span className="mt-home-meta-dot">·</span>
              <span>📋 Portfolio Project · Not for Clinical Use</span>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {view === VIEWS.QUESTIONS && (
          <div className="mt-questions mt-fade-up">
            {/* Progress */}
            <div className="mt-progress-card">
              <div className="mt-progress-meta">
                <span className="mt-progress-symptom">
                  {symptom === "Fever" ? "🌡️" : symptom === "Cold" ? "🤧" : "😮‍💨"} {symptom}
                </span>
                <span className="mt-progress-step">Step {step + 1} of {totalSteps}</span>
              </div>
              <div className="mt-progress-track">
                <div className="mt-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question */}
            <div className={`mt-q-card ${anim}`}>
              <div className="mt-q-badge">Q{step + 1}</div>
              <h2 className="mt-q-text">{qs[step]?.label}</h2>
              <p className="mt-q-sub">{qs[step]?.sub}</p>

              {qs[step]?.type === "number" && (
                <div className="mt-num-wrap">
                  <input
                    className="mt-num-input"
                    type="number" min="0" max="90"
                    value={val}
                    placeholder={qs[step].placeholder}
                    onChange={e => { setVal(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && next()}
                    autoFocus
                  />
                  <span className="mt-num-unit">{qs[step].unit}</span>
                </div>
              )}

              {qs[step]?.type === "bool" && (
                <div className="mt-bool-row">
                  {[{ v: "yes", icon: "✓", label: "Yes" }, { v: "no", icon: "✗", label: "No" }].map(opt => (
                    <button
                      key={opt.v}
                      className={`mt-bool-btn ${val === opt.v ? (opt.v === "yes" ? "active" : "active-no") : ""}`}
                      onClick={() => { setVal(opt.v); setError(""); }}
                    >
                      <span className="mt-bool-icon">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {error && <div className="mt-field-error">⚠ {error}</div>}

              <div className="mt-q-actions">
                <button className="mt-btn-ghost" onClick={back}>← Back</button>
                <button className="mt-btn-primary" onClick={next} disabled={!val}>
                  {step === totalSteps - 1 ? "Submit Assessment →" : "Next →"}
                </button>
              </div>
            </div>

            <p className="mt-q-disclaimer">
              🚨 If you are experiencing a medical emergency, stop and call 108 immediately.
            </p>
          </div>
        )}

        {/* LOADING */}
        {view === VIEWS.LOADING && (
          <div className="mt-loading mt-fade-up">
            <div className="mt-loading-card">
              <div className="mt-spinner">
                <div className="mt-spinner-ring" />
                <div className="mt-spinner-ring mt-spinner-ring-2" />
                <span className="mt-spinner-sym">⚕</span>
              </div>
              <h2 className="mt-loading-title">Analyzing your symptoms…</h2>
              <p className="mt-loading-sub">
                Our clinical rule engine is evaluating your responses<br />and generating a structured case summary.
              </p>
              <div className="mt-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {view === VIEWS.RESULT && result && urgCfg && (
          <div className="mt-result mt-fade-up">
            {/* Urgency Banner */}
            <div className={`mt-urgency-banner ${urgCfg.cls}`}>
              <div className="mt-urgency-icon-wrap">{urgCfg.icon}</div>
              <div>
                <div className="mt-urgency-label">{urgCfg.label}</div>
                <div className="mt-urgency-tagline">{urgCfg.tagline}</div>
              </div>
            </div>

            <p className="mt-urgency-desc">{urgCfg.desc}</p>

            {/* Summary */}
            <div className="mt-summary-card">
              <div className="mt-summary-head">
                <div className="mt-summary-head-icon">📋</div>
                <div>
                  <div className="mt-summary-head-title">Clinical Case Summary</div>
                  <span className="mt-summary-head-sub">AI-Generated · Not a Medical Diagnosis</span>
                </div>
              </div>

              {[
                { icon: "🏷️", label: "Primary Symptom",      value: result.summary.primarySymptom },
                { icon: "📅", label: "Symptom Duration",      value: result.summary.duration },
                { icon: "🌬️", label: "Breathing Difficulty",  value: result.summary.breathingDifficulty, flag: result.summary.breathingDifficulty === "Yes" },
                { icon: "❤️", label: "Chest Pain / Pressure", value: result.summary.chestPain, flag: result.summary.chestPain === "Yes" },
                { icon: "⚡", label: "Urgency Level",         value: result.summary.urgencyLevel, urgency: result.urgency },
              ].map((row, i) => (
                <div key={i} className={`mt-sum-row ${row.flag ? "highlighted" : ""}`}>
                  <span className="mt-sum-row-icon">{row.icon}</span>
                  <span className="mt-sum-row-label">{row.label}</span>
                  <span className={`mt-sum-row-value ${
                    row.flag ? "flag" :
                    row.urgency === "Emergency" ? "urgency-red" :
                    row.urgency === "Doctor Required" ? "urgency-yellow" :
                    row.urgency === "Routine" ? "urgency-green" : ""
                  }`}>
                    {row.flag && "⚠ "}{row.value}
                  </span>
                </div>
              ))}

              {hasFlags && (
                <div className="mt-red-flags">
                  <div className="mt-red-flags-title">🚩 Red Flags Identified</div>
                  <ul className="mt-red-flags-list">
                    {result.summary.breathingDifficulty === "Yes" && <li>Breathing difficulty — possible respiratory distress. Evaluate O₂ saturation and respiratory rate.</li>}
                    {result.summary.chestPain === "Yes"           && <li>Chest pain — urgent cardiac/pulmonary workup required. Rule out ACS, PE, pericarditis.</li>}
                  </ul>
                </div>
              )}

              <div className="mt-sum-disc">
                ⚠ This summary is generated by a rule-based triage algorithm using self-reported symptoms. It is intended for preliminary urgency classification only and does not constitute a medical diagnosis or treatment plan. Present this document to a licensed healthcare professional.
              </div>
            </div>

            <div className="mt-result-actions">
              <button className="mt-btn-primary" onClick={() => setView(VIEWS.DOCTOR)}>👨‍⚕️ Doctor Dashboard</button>
              <button className="mt-btn-outline" onClick={() => window.print()}>📄 Download PDF</button>
              <button className="mt-btn-ghost"   onClick={reset}>↩ New Assessment</button>
            </div>
          </div>
        )}

        {/* DOCTOR VIEW */}
        {view === VIEWS.DOCTOR && result && urgCfg && (
          <div className="mt-doctor mt-fade-up">
            <div className="mt-doc-header">
              <div>
                <h2 className="mt-doc-title">👨‍⚕️ Physician Dashboard</h2>
                <p className="mt-doc-subtitle">AI-generated triage summary for clinical decision support</p>
              </div>
              <div className="mt-doc-header-actions no-print">
                <button className="mt-btn-outline mt-btn-sm" onClick={() => window.print()}>🖨 Print</button>
                <button className="mt-btn-ghost   mt-btn-sm" onClick={() => setView(VIEWS.RESULT)}>← Result</button>
              </div>
            </div>

            <div className="mt-doc-grid">
              {/* Urgency — full width */}
              <div className={`mt-doc-card full urgency-card-${urgCfg.cls}`}>
                <div className="mt-doc-card-label">Urgency Classification</div>
                <div className={`mt-doc-val urg-${urgCfg.cls}`}>{urgCfg.label}</div>
                <div className="mt-doc-val-sub">{urgCfg.tagline}</div>
              </div>

              {/* Primary Symptom */}
              <div className="mt-doc-card">
                <div className="mt-doc-card-label">Primary Complaint</div>
                <div className="mt-doc-val big">{result.summary.primarySymptom}</div>
              </div>

              {/* Duration */}
              <div className="mt-doc-card">
                <div className="mt-doc-card-label">Symptom Duration</div>
                <div className="mt-doc-val big">{result.summary.duration}</div>
              </div>

              {/* Breathing */}
              <div className={`mt-doc-card ${result.summary.breathingDifficulty === "Yes" ? "flag" : ""}`}>
                <div className="mt-doc-card-label">
                  {result.summary.breathingDifficulty === "Yes" && <span className="mt-flag-dot" />}
                  Breathing Difficulty
                </div>
                <div className={`mt-doc-val ${result.summary.breathingDifficulty === "Yes" ? "flag-val" : ""}`}>
                  {result.summary.breathingDifficulty === "Yes" ? "⚠ YES — Red Flag" : "None Reported"}
                </div>
              </div>

              {/* Chest Pain */}
              <div className={`mt-doc-card ${result.summary.chestPain === "Yes" ? "flag" : ""}`}>
                <div className="mt-doc-card-label">
                  {result.summary.chestPain === "Yes" && <span className="mt-flag-dot" />}
                  Chest Pain / Pressure
                </div>
                <div className={`mt-doc-val ${result.summary.chestPain === "Yes" ? "flag-val" : ""}`}>
                  {result.summary.chestPain === "Yes" ? "⚠ YES — Red Flag" : "None Reported"}
                </div>
              </div>

              {/* Associated Symptoms */}
              <div className="mt-doc-card full">
                <div className="mt-doc-card-label">Associated / Secondary Symptoms</div>
                <div className="mt-doc-val">
                  {hasFlags
                    ? [result.summary.breathingDifficulty === "Yes" && "Breathing difficulty", result.summary.chestPain === "Yes" && "Chest pain / tightness"].filter(Boolean).join(" · ")
                    : "None reported by patient"}
                </div>
              </div>

              {/* Clinical Red Flags */}
              {hasFlags && (
                <div className="mt-doc-card full flag">
                  <div className="mt-doc-card-label">🚩 Clinical Red Flags & Recommended Actions</div>
                  <ul className="mt-doc-flag-list">
                    {result.summary.breathingDifficulty === "Yes" && (
                      <li><strong>Respiratory Alert:</strong> Patient reports breathing difficulty — assess O₂ saturation, respiratory rate, auscultate lungs. Consider CXR, ABG. Rule out pneumonia, bronchospasm, PE.</li>
                    )}
                    {result.summary.chestPain === "Yes" && (
                      <li><strong>Cardiac Alert:</strong> Patient reports chest pain — immediate ECG, cardiac enzymes (Troponin, CK-MB). Rule out ACS, STEMI, pericarditis, aortic dissection.</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-doc-card full mt-doc-disc">
                <strong>⚠ Clinical Decision Support Tool — Not a Diagnostic System:</strong> This summary was generated by a rule-based AI triage algorithm using patient self-reported symptoms. It is intended solely as preliminary urgency classification to support (not replace) physician assessment. All clinical decisions must be made by a licensed healthcare professional following complete history, physical examination, and appropriate investigations.
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="mt-footer no-print">
        <div className="mt-footer-inner">
          <span>⚕ MediTriage · AI-Assisted Triage System</span>
          <span>·</span>
          <span>🔬 Scope: Fever, Cold & Cough only</span>
          <span>·</span>
          <span>⚠ NOT a diagnosis system</span>
          <span>·</span>
          <span>📋 Portfolio Project</span>
        </div>
      </footer>
    </div>
  );
}