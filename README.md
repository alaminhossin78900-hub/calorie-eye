import { useState, useRef, useEffect, useCallback } from "react";

// ─── Inline Styles & Keyframes ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --accent: #c8f55a;
    --accent2: #5af5c8;
    --text: #f0f0f8;
    --muted: #6b6b80;
    --danger: #f55a5a;
    --card-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  .light {
    --bg: #f0f0f5;
    --surface: #ffffff;
    --glass: rgba(255,255,255,0.6);
    --glass-border: rgba(0,0,0,0.08);
    --text: #0a0a0f;
    --muted: #888899;
    --card-shadow: 0 24px 64px rgba(0,0,0,0.12);
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; transition: background 0.3s, color 0.3s; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes scanLine { 0% { top: 0%; } 100% { top: 100%; } }
  @keyframes glow     { 0%,100% { box-shadow: 0 0 20px rgba(200,245,90,0.3); } 50% { box-shadow: 0 0 40px rgba(200,245,90,0.7); } }
  @keyframes countUp  { from { opacity:0; transform: scale(0.7); } to { opacity:1; transform: scale(1); } }
  @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes float    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav { display:flex; align-items:center; justify-content:space-between; padding:16px 32px; backdrop-filter:blur(20px); background:var(--glass); border-bottom:1px solid var(--glass-border); position:sticky; top:0; z-index:100; }
  .nav-logo { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; letter-spacing:-0.5px; display:flex; align-items:center; gap:8px; }
  .logo-dot { width:10px; height:10px; background:var(--accent); border-radius:50%; animation:pulse 2s infinite; }
  .nav-actions { display:flex; gap:12px; align-items:center; }
  .btn-icon { background:var(--glass); border:1px solid var(--glass-border); color:var(--text); width:40px; height:40px; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; font-size:16px; }
  .btn-icon:hover { background:var(--accent); color:#0a0a0f; border-color:var(--accent); }
  .btn-outline { background:transparent; border:1px solid var(--glass-border); color:var(--text); padding:8px 20px; border-radius:12px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; transition:all 0.2s; }
  .btn-outline:hover { border-color:var(--accent); color:var(--accent); }
  .btn-primary { background:var(--accent); border:none; color:#0a0a0f; padding:10px 22px; border-radius:12px; cursor:pointer; font-family:'Syne',sans-serif; font-size:14px; font-weight:700; transition:all 0.2s; }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(200,245,90,0.4); animation:glow 1.5s infinite; }

  /* PAGES */
  .page { flex:1; padding:48px 32px; max-width:1100px; margin:0 auto; width:100%; animation:fadeUp 0.5s ease; }

  /* HERO */
  .hero { text-align:center; padding:80px 0 60px; }
  .hero-badge { display:inline-flex; align-items:center; gap:8px; background:var(--glass); border:1px solid var(--glass-border); border-radius:100px; padding:6px 16px; font-size:12px; font-weight:500; color:var(--accent); letter-spacing:1px; text-transform:uppercase; margin-bottom:28px; }
  .hero h1 { font-family:'Syne',sans-serif; font-size:clamp(42px,7vw,88px); font-weight:800; line-height:1.0; letter-spacing:-3px; margin-bottom:24px; }
  .hero h1 span { color:var(--accent); }
  .hero p { font-size:18px; color:var(--muted); max-width:560px; margin:0 auto 40px; line-height:1.7; font-weight:300; }
  .hero-cta { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .btn-hero { background:var(--accent); color:#0a0a0f; border:none; padding:16px 36px; border-radius:16px; font-family:'Syne',sans-serif; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.3s; }
  .btn-hero:hover { transform:translateY(-2px); box-shadow:0 16px 48px rgba(200,245,90,0.5); }
  .btn-hero-ghost { background:var(--glass); color:var(--text); border:1px solid var(--glass-border); padding:16px 36px; border-radius:16px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px); }
  .btn-hero-ghost:hover { border-color:var(--accent); color:var(--accent); }

  /* STATS */
  .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:60px; }
  .stat-card { background:var(--glass); border:1px solid var(--glass-border); border-radius:20px; padding:28px; backdrop-filter:blur(16px); text-align:center; transition:all 0.3s; }
  .stat-card:hover { border-color:var(--accent); transform:translateY(-4px); }
  .stat-num { font-family:'Syne',sans-serif; font-size:36px; font-weight:800; color:var(--accent); }
  .stat-label { font-size:13px; color:var(--muted); margin-top:4px; }

  /* FEATURES */
  .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:60px; }
  .feature-card { background:var(--glass); border:1px solid var(--glass-border); border-radius:20px; padding:28px; backdrop-filter:blur(16px); transition:all 0.3s; }
  .feature-card:hover { border-color:var(--accent2); transform:translateY(-4px); box-shadow:var(--card-shadow); }
  .feature-icon { font-size:32px; margin-bottom:16px; animation:float 3s ease-in-out infinite; }
  .feature-card h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:8px; }
  .feature-card p { font-size:14px; color:var(--muted); line-height:1.6; }

  /* UPLOAD PAGE */
  .upload-header { text-align:center; margin-bottom:40px; }
  .upload-header h2 { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,48px); font-weight:800; letter-spacing:-1px; }
  .upload-header p { color:var(--muted); margin-top:8px; font-size:15px; }

  .upload-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  @media(max-width:768px) { .upload-grid { grid-template-columns:1fr; } .features-grid,.stats-row { grid-template-columns:1fr; } }

  /* DROP ZONE */
  .dropzone { background:var(--glass); border:2px dashed var(--glass-border); border-radius:24px; padding:48px 32px; text-align:center; cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden; backdrop-filter:blur(16px); }
  .dropzone:hover, .dropzone.drag-over { border-color:var(--accent); background:rgba(200,245,90,0.04); }
  .dropzone-icon { font-size:48px; margin-bottom:16px; animation:float 3s ease-in-out infinite; }
  .dropzone h3 { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; margin-bottom:8px; }
  .dropzone p { font-size:13px; color:var(--muted); margin-bottom:24px; }
  .dropzone input { display:none; }

  /* PREVIEW */
  .preview-box { position:relative; border-radius:24px; overflow:hidden; background:var(--surface); border:1px solid var(--glass-border); }
  .preview-box img { width:100%; max-height:320px; object-fit:cover; display:block; }
  .preview-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); display:flex; align-items:flex-end; padding:20px; }
  .preview-label { font-family:'Syne',sans-serif; font-size:14px; font-weight:600; color:white; }
  .scan-line { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, var(--accent), transparent); animation:scanLine 2s linear infinite; pointer-events:none; }

  /* ANALYZE BTN */
  .analyze-btn { width:100%; background:var(--accent); color:#0a0a0f; border:none; padding:18px; border-radius:16px; font-family:'Syne',sans-serif; font-size:16px; font-weight:800; cursor:pointer; transition:all 0.3s; letter-spacing:0.5px; margin-top:16px; display:flex; align-items:center; justify-content:center; gap:10px; }
  .analyze-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 16px 48px rgba(200,245,90,0.4); }
  .analyze-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .spinner { width:20px; height:20px; border:2px solid rgba(0,0,0,0.2); border-top-color:#0a0a0f; border-radius:50%; animation:spin 0.7s linear infinite; }

  /* RESULTS */
  .result-panel { background:var(--glass); border:1px solid var(--glass-border); border-radius:24px; padding:32px; backdrop-filter:blur(16px); animation:fadeUp 0.5s ease; }
  .result-food { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; letter-spacing:-0.5px; margin-bottom:4px; }
  .result-portion { font-size:13px; color:var(--muted); margin-bottom:24px; }
  .calorie-display { background:linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); border-radius:20px; padding:24px; text-align:center; margin-bottom:24px; animation:countUp 0.6s cubic-bezier(0.34,1.56,0.64,1); }
  .calorie-num { font-family:'Syne',sans-serif; font-size:64px; font-weight:800; color:#0a0a0f; line-height:1; }
  .calorie-label { font-size:13px; font-weight:600; color:rgba(0,0,0,0.6); text-transform:uppercase; letter-spacing:1px; }

  .macro-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px; }
  .macro-card { background:var(--surface); border:1px solid var(--glass-border); border-radius:16px; padding:16px; text-align:center; }
  .macro-val { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; }
  .macro-val.protein { color:#5af5c8; }
  .macro-val.carbs { color:#f5c85a; }
  .macro-val.fats { color:#f55a5a; }
  .macro-name { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }

  .confidence-bar { margin-bottom:20px; }
  .confidence-label { display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin-bottom:6px; }
  .bar-track { background:var(--surface); border-radius:100px; height:6px; overflow:hidden; }
  .bar-fill { height:100%; background:linear-gradient(90deg, var(--accent), var(--accent2)); border-radius:100px; transition:width 1s cubic-bezier(0.34,1.56,0.64,1); }

  .insights-box { background:var(--surface); border:1px solid var(--glass-border); border-radius:16px; padding:16px; }
  .insights-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.5px; color:var(--accent); text-transform:uppercase; margin-bottom:10px; }
  .insights-text { font-size:14px; color:var(--muted); line-height:1.7; }

  /* HISTORY */
  .history-section { margin-top:48px; }
  .section-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; letter-spacing:-0.5px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; }
  .history-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
  .history-card { background:var(--glass); border:1px solid var(--glass-border); border-radius:20px; overflow:hidden; cursor:pointer; transition:all 0.3s; backdrop-filter:blur(16px); }
  .history-card:hover { transform:translateY(-4px); border-color:var(--accent); box-shadow:var(--card-shadow); }
  .history-img { width:100%; height:140px; object-fit:cover; }
  .history-info { padding:14px; }
  .history-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
  .history-cal { font-size:13px; color:var(--accent); font-weight:600; }
  .history-date { font-size:11px; color:var(--muted); margin-top:4px; }
  .clear-btn { font-size:13px; color:var(--danger); background:none; border:1px solid var(--danger); border-radius:8px; padding:4px 12px; cursor:pointer; opacity:0.7; transition:opacity 0.2s; }
  .clear-btn:hover { opacity:1; }

  /* AUTH */
  .auth-container { max-width:440px; margin:0 auto; padding:60px 32px; }
  .auth-card { background:var(--glass); border:1px solid var(--glass-border); border-radius:28px; padding:40px; backdrop-filter:blur(20px); }
  .auth-title { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; letter-spacing:-1px; margin-bottom:8px; }
  .auth-sub { font-size:14px; color:var(--muted); margin-bottom:32px; }
  .form-group { margin-bottom:16px; }
  .form-label { font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; display:block; }
  .form-input { width:100%; background:var(--surface); border:1px solid var(--glass-border); border-radius:12px; padding:14px 16px; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--text); outline:none; transition:border-color 0.2s; }
  .form-input:focus { border-color:var(--accent); }
  .form-submit { width:100%; background:var(--accent); color:#0a0a0f; border:none; padding:16px; border-radius:14px; font-family:'Syne',sans-serif; font-size:15px; font-weight:800; cursor:pointer; transition:all 0.3s; margin-top:8px; }
  .form-submit:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(200,245,90,0.4); }
  .auth-switch { text-align:center; font-size:14px; color:var(--muted); margin-top:20px; }
  .auth-switch button { background:none; border:none; color:var(--accent); cursor:pointer; font-weight:600; font-family:'DM Sans',sans-serif; }
  .error-msg { background:rgba(245,90,90,0.1); border:1px solid rgba(245,90,90,0.3); border-radius:10px; padding:10px 14px; font-size:13px; color:var(--danger); margin-bottom:16px; }

  /* DASHBOARD */
  .dashboard-header { margin-bottom:40px; }
  .dashboard-header h2 { font-family:'Syne',sans-serif; font-size:36px; font-weight:800; letter-spacing:-1px; }
  .dashboard-header p { color:var(--muted); font-size:15px; margin-top:6px; }
  .user-badge { display:inline-flex; align-items:center; gap:10px; background:var(--glass); border:1px solid var(--glass-border); border-radius:100px; padding:8px 20px; margin-bottom:24px; backdrop-filter:blur(10px); }
  .user-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, var(--accent), var(--accent2)); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:14px; color:#0a0a0f; }
  .user-email { font-size:14px; font-weight:500; }
  .dash-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:40px; }
  @media(max-width:768px) { .dash-stats { grid-template-columns:repeat(2,1fr); } }
  .dash-stat { background:var(--glass); border:1px solid var(--glass-border); border-radius:20px; padding:24px; backdrop-filter:blur(16px); }
  .dash-stat-num { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; }
  .dash-stat-label { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; margin-top:4px; }

  /* FOOTER */
  .footer { border-top:1px solid var(--glass-border); padding:24px 32px; text-align:center; font-size:13px; color:var(--muted); }
  .footer span { color:var(--accent); font-weight:600; }

  /* EMPTY STATE */
  .empty-state { text-align:center; padding:60px 24px; color:var(--muted); }
  .empty-state .emoji { font-size:48px; margin-bottom:16px; animation:float 3s ease-in-out infinite; }
  .empty-state p { font-size:15px; }

  /* SHIMMER LOADING */
  .shimmer { background: linear-gradient(90deg, var(--surface) 25%, var(--glass) 50%, var(--surface) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }

  /* TAG */
  .tag { display:inline-flex; align-items:center; gap:4px; background:rgba(200,245,90,0.1); border:1px solid rgba(200,245,90,0.2); color:var(--accent); border-radius:100px; padding:3px 10px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
`;

// ─── Mock Auth ──────────────────────────────────────────────────────────────
const USERS_KEY = "calorie_eye_users";
const SESSION_KEY = "calorie_eye_session";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}
function saveUser(email, password) {
  const users = getUsers();
  if (users[email]) return { error: "Email already registered" };
  users[email] = { password, createdAt: Date.now() };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}
function loginUser(email, password) {
  const users = getUsers();
  if (!users[email]) return { error: "No account found with this email" };
  if (users[email].password !== password) return { error: "Incorrect password" };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loginAt: Date.now() }));
  return { success: true, email };
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function logout() { localStorage.removeItem(SESSION_KEY); }

// ─── History Helpers ─────────────────────────────────────────────────────────
const HISTORY_KEY = "calorie_eye_history";
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveToHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 20)));
}
function clearHistory() { localStorage.removeItem(HISTORY_KEY); }

// ─── Anthropic AI Analysis ────────────────────────────────────────────────────
async function analyzeFood(base64Image) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64Image }
          },
          {
            type: "text",
            text: `Analyze this food image. Respond ONLY with valid JSON (no markdown, no backticks) in this exact format:
{
  "foodName": "Name of the food",
  "portionSize": "Estimated portion (e.g. 1 cup, 200g)",
  "calories": 350,
  "protein": 12,
  "carbs": 45,
  "fats": 14,
  "confidence": 87,
  "healthInsight": "A brief 1-2 sentence health insight about this food",
  "emoji": "🍕"
}`
          }
        ]
      }]
    })
  });
  const data = await response.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Components ───────────────────────────────────────────────────────────────

function Nav({ page, setPage, user, onLogout, dark, setDark }) {
  return (
    <nav className="nav">
      <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
        <div className="logo-dot" />
        <span style={{ fontFamily: "'Syne',sans-serif" }}>Calorie<span style={{ color: "var(--accent)" }}>Eye</span></span>
      </div>
      <div className="nav-actions">
        <button className="btn-icon" onClick={() => setDark(!dark)} title="Toggle theme">
          {dark ? "☀️" : "🌙"}
        </button>
        {user ? (
          <>
            <button className="btn-outline" onClick={() => setPage("upload")}>🔍 Analyze</button>
            <button className="btn-outline" onClick={() => setPage("dashboard")}>Dashboard</button>
            <button className="btn-primary" onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => setPage("login")}>Login</button>
            <button className=
