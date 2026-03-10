import React, { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import HomePage from "./pages/Home.jsx";
import BuilderPage from "./pages/ResumeBuilder.jsx";
import ATSPage from "./pages/ATSChecker.jsx";
import AuthModal from "./components/authmodel.jsx";
import {
  FiFileText, FiBarChart2, FiHome, FiMenu, FiX,
  FiChevronRight, FiLock,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg0:     #02000a;
    --bg1:     #07021a;
    --bg2:     #0e0530;
    --v900:    #1e0b5e;
    --v800:    #2d1278;
    --v600:    #4f23b8;
    --v500:    #6131d4;
    --v400:    #7c4ef0;
    --v300:    #9b77ff;
    --v200:    #c4aeff;
    --v100:    #e8e0ff;
    --pink:    #e040fb;
    --teal:    #00e5cc;
    --gold:    #ffd95a;
    --white:   #ffffff;
    --glass:   rgba(255,255,255,0.04);
    --glass-b: rgba(255,255,255,0.07);
    --glass-bd:rgba(161,137,255,0.14);
    --text-1:  #f0ecff;
    --text-2:  #b8a8ff;
    --text-3:  #7b6fad;
    --glow-v:  rgba(97,49,212,0.45);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg0);
    color: var(--text-1);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* Noise grain overlay */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.45;
  }

  /* Global ambient background gradient */
  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 15% 0%,   rgba(78,35,154,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 85% 5%,   rgba(224,64,251,0.1) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 50% 100%,  rgba(61,24,154,0.25) 0%, transparent 60%);
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg0); }
  ::-webkit-scrollbar-thumb { background: var(--v700, #3d189a); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--v500); }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes scoreIn  { from{stroke-dashoffset:283} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes modalIn  { from{opacity:0;transform:scale(0.93) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes shimmer  { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px var(--glow-v)} 50%{box-shadow:0 0 50px var(--glow-v), 0 0 80px rgba(224,64,251,0.2)} }
  @keyframes bob      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes borderPulse { 0%,100%{border-color:rgba(161,137,255,0.14)} 50%{border-color:rgba(124,78,240,0.4)} }

  .fade-up    { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
  .fade-in    { animation: fadeIn .4s ease both; }
  .float      { animation: bob 4s ease-in-out infinite; }

  /* ── BUTTONS (global) ── */
  .btn-primary {
    position: relative; overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase;
    background: linear-gradient(135deg, var(--v600), var(--v400));
    color: #fff; border: none; border-radius: 12px;
    padding: 13px 28px; cursor: pointer;
    box-shadow: 0 0 0 1px rgba(161,137,255,.2), 0 6px 24px rgba(97,49,212,.4), inset 0 1px 0 rgba(255,255,255,.12);
    transition: all .25s ease;
    display: inline-flex; align-items: center; gap: 8px;
    animation: pulse-glow 3s ease infinite;
  }
  .btn-primary::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent);
    transition: left .4s ease;
  }
  .btn-primary:hover::before { left: 100%; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(161,137,255,.4), 0 12px 36px rgba(97,49,212,.55); }
  .btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none !important; animation: none; }

  .btn-ghost {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase;
    background: var(--glass); color: var(--v200);
    border: 1px solid var(--glass-bd); border-radius: 12px;
    padding: 13px 28px; cursor: pointer; backdrop-filter: blur(12px);
    transition: all .25s ease;
    display: inline-flex; align-items: center; gap: 8px;
    animation: borderPulse 3s ease infinite;
  }
  .btn-ghost:hover { background: rgba(97,49,212,.15); border-color: rgba(161,137,255,.45); color: var(--v100); transform: translateY(-2px); }
  .btn-ghost:disabled { opacity: .45; cursor: not-allowed; }

  /* Keep legacy class names working for sub-pages */
  .btn-sky { background: linear-gradient(135deg, var(--v600), var(--v400)); color: white; border: none; border-radius: 12px; padding: 12px 26px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .25s; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 16px rgba(97,49,212,.3); display: inline-flex; align-items: center; gap: 8px; }
  .btn-sky:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(97,49,212,.5); }
  .btn-sky:active { transform: translateY(0); }
  .btn-sky:disabled { opacity: .45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

  .btn-outline { background: var(--glass); color: var(--v200); border: 1px solid var(--glass-bd); border-radius: 12px; padding: 11px 22px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .25s; font-family: 'Plus Jakarta Sans', sans-serif; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(10px); }
  .btn-outline:hover { background: rgba(97,49,212,.15); border-color: rgba(161,137,255,.4); transform: translateY(-1px); }

  /* ── INPUTS ── */
  .input-sky {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid rgba(161,137,255,.15);
    border-radius: 12px; font-size: 14px;
    color: var(--text-1); background: rgba(14,5,48,.7);
    outline: none; transition: all .2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .input-sky:focus { border-color: var(--v400); box-shadow: 0 0 0 4px rgba(97,49,212,.12); }
  .input-sky::placeholder { color: var(--text-3); }
  textarea.input-sky { resize: vertical; min-height: 88px; line-height: 1.6; }

  /* ── CARDS ── */
  .card-white {
    background: rgba(14,5,48,.7);
    border: 1px solid rgba(161,137,255,.1);
    border-radius: 20px; padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.04);
    transition: box-shadow .3s, border-color .3s;
    backdrop-filter: blur(16px);
  }
  .card-white:hover { box-shadow: 0 6px 32px rgba(97,49,212,.15); border-color: rgba(161,137,255,.25); }

  /* ── MISC UTILITIES ── */
  .spinner { width:20px;height:20px;border-radius:50%;border:2.5px solid rgba(161,137,255,.25);border-top-color:var(--v400);animation:spin .7s linear infinite;display:inline-block;flex-shrink:0; }

  .badge { display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:'Space Mono',monospace; }
  .badge-sky    { background:rgba(97,49,212,.2);  color:var(--v200); }
  .badge-green  { background:rgba(0,229,100,.1);  color:#4ade80; }
  .badge-red    { background:rgba(239,68,68,.1);  color:#f87171; }
  .badge-yellow { background:rgba(255,217,90,.1); color:var(--gold); }
  .badge-blue   { background:rgba(97,49,212,.15); color:var(--v300); }

  .label-sky { display:block;font-size:12px;font-weight:600;color:var(--v200);margin-bottom:6px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:.04em; }
  .section-block { display:flex;flex-direction:column;gap:6px; }

  .hide-mobile { display: flex; }
  .show-mobile { display: none; }

  @media(max-width:768px){
    .hide-mobile { display: none !important; }
    .show-mobile { display: flex !important; }
    .grid-2 { grid-template-columns: 1fr !important; }
    .card-white { padding: 16px !important; border-radius: 16px !important; }
  }
`;

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, onProtectedNav }) {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [hovered, setHovered]     = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => {
    setOpen(false);
    if (p === "home") { setPage("home"); return; }
    if (!isSignedIn)  { onProtectedNav(p); return; }
    setPage(p);
  };

  const navLinks = [
    { id:"home",    label:"Home",        icon:<FiHome size={14} />,      locked:false },
    { id:"builder", label:"Build Resume",icon:<FiFileText size={14} />,  locked:!isSignedIn },
    { id:"ats",     label:"ATS Checker", icon:<FiBarChart2 size={14} />, locked:!isSignedIn },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 66,
        padding: "0 clamp(16px,4vw,48px)",
        background: scrolled
          ? "rgba(7,2,26,0.92)"
          : "rgba(2,0,10,0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? "rgba(161,137,255,0.18)" : "rgba(161,137,255,0.07)"}`,
        transition: "all .3s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
      }}>

        {/* Logo */}
        <button onClick={() => setPage("home")} style={{
          display:"flex",alignItems:"center",gap:10,
          background:"none",border:"none",cursor:"pointer",
        }}>
          <div style={{
            width:36,height:36,borderRadius:10,
            background:"linear-gradient(135deg,var(--v600),var(--pink))",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 4px 16px rgba(97,49,212,0.45)",
            fontSize:16,color:"white",
            position:"relative",
          }}>
            <HiSparkles size={18} />
            <div style={{
              position:"absolute",inset:0,borderRadius:10,
              background:"linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 60%)",
            }} />
          </div>
          <span style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:22,letterSpacing:".08em",
            background:"linear-gradient(90deg,var(--v200),var(--pink))",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          }}>
            RESUME<span style={{opacity:.7}}>.AI</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hide-mobile" style={{display:"flex",gap:2,alignItems:"center"}}>
          {navLinks.map(({ id, label, icon, locked }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  letterSpacing: ".02em",
                  background: active
                    ? "linear-gradient(135deg,rgba(79,35,184,.5),rgba(124,78,240,.35))"
                    : hovered === id
                      ? "rgba(97,49,212,.12)"
                      : "transparent",
                  color: active ? "var(--v100)" : hovered === id ? "var(--v200)" : "var(--text-3)",
                  border: active ? "1px solid rgba(161,137,255,.25)" : "1px solid transparent",
                  boxShadow: active ? "0 0 20px rgba(97,49,212,.2), inset 0 1px 0 rgba(255,255,255,.06)" : "none",
                  transition: "all .2s ease",
                  display: "inline-flex", alignItems: "center", gap: 7,
                  position: "relative",
                }}
              >
                <span style={{opacity:.8}}>{icon}</span>
                {label}
                {locked && (
                  <FiLock size={10} style={{color:"var(--gold)",opacity:.8}} />
                )}
                {active && (
                  <span style={{
                    position:"absolute",bottom:-1,left:"50%",transform:"translateX(-50%)",
                    width:24,height:2,borderRadius:999,
                    background:"linear-gradient(90deg,var(--v400),var(--pink))",
                  }} />
                )}
              </button>
            );
          })}

          <div style={{marginLeft:10,display:"flex",alignItems:"center",gap:8}}>
            {isSignedIn ? (
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  fontSize:11,fontWeight:600,color:"var(--text-3)",
                  fontFamily:"'Space Mono',monospace",letterSpacing:".04em",
                }}>
                  SIGNED IN
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <button
                className="btn-primary"
                style={{padding:"9px 22px",fontSize:12,animation:"none",
                  boxShadow:"0 0 0 1px rgba(161,137,255,.2),0 4px 16px rgba(97,49,212,.35)"}}
                onClick={() => onProtectedNav("builder")}
              >
                Sign In <FiChevronRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="show-mobile"
          onClick={() => setOpen(!open)}
          style={{
            background: "var(--glass)", border: "1px solid var(--glass-bd)",
            borderRadius: 10, padding: "8px 12px", cursor: "pointer",
            color: "var(--v200)", fontSize: 18, alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)",
            transition: "all .2s",
          }}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div style={{
          position: "fixed", top: 66, left: 0, right: 0, zIndex: 999,
          background: "rgba(7,2,26,0.97)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(161,137,255,0.12)",
          padding: "16px 20px 24px",
          display: "flex", flexDirection: "column", gap: 4,
          animation: "fadeUp .25s ease both",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}>
          {navLinks.map(({ id, label, icon, locked }) => (
            <button
              key={id}
              onClick={() => go(id)}
              style={{
                padding: "14px 18px", borderRadius: 12, border: "1px solid transparent",
                cursor: "pointer", textAlign: "left",
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                background: page === id ? "rgba(97,49,212,.2)" : "transparent",
                color: page === id ? "var(--v100)" : "var(--text-2)",
                borderColor: page === id ? "rgba(161,137,255,.2)" : "transparent",
                display: "flex", alignItems: "center", gap: 10,
                justifyContent: "space-between",
                transition: "all .2s",
              }}
            >
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:"var(--v300)"}}>{icon}</span>
                {label}
              </div>
              {locked && (
                <span style={{
                  fontSize:10,color:"var(--gold)",fontWeight:700,
                  fontFamily:"'Space Mono',monospace",letterSpacing:".04em",
                  background:"rgba(255,217,90,.1)",border:"1px solid rgba(255,217,90,.25)",
                  padding:"3px 8px",borderRadius:999,
                  display:"flex",alignItems:"center",gap:4,
                }}>
                  <FiLock size={9} /> LOGIN
                </span>
              )}
            </button>
          ))}

          <div style={{
            paddingTop:16, borderTop:"1px solid rgba(161,137,255,.08)", marginTop:8,
          }}>
            {isSignedIn ? (
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 18px"}}>
                <UserButton />
                <span style={{fontSize:12,color:"var(--text-3)",fontFamily:"'Space Mono',monospace",letterSpacing:".04em"}}>SIGNED IN</span>
              </div>
            ) : (
              <button
                className="btn-primary"
                style={{width:"100%",justifyContent:"center",animation:"none"}}
                onClick={() => { setOpen(false); onProtectedNav("builder"); }}
              >
                Sign In / Sign Up <FiChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("home");
  const [authModal, setAuthModal] = useState({ open: false, redirectTo: "builder" });
  const { isSignedIn }        = useUser();

  const onProtectedNav = (redirectTo) => setAuthModal({ open: true, redirectTo });
  const onAuthSuccess  = () => {
    setAuthModal({ open: false, redirectTo: "builder" });
    setPage(authModal.redirectTo);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg0, #02000a)", position: "relative" }}>
      <style>{GLOBAL_CSS}</style>

      <Navbar page={page} setPage={setPage} onProtectedNav={onProtectedNav} />

      <div style={{ position: "relative", zIndex: 1, paddingTop: 66 }}>
        {page === "home"    && <HomePage  setPage={setPage} onProtectedNav={onProtectedNav} />}
        {page === "builder" && <BuilderPage />}
        {page === "ats"     && <ATSPage />}
      </div>

      {authModal.open && (
        <AuthModal
          redirectTo={authModal.redirectTo}
          onClose={() => setAuthModal({ open: false, redirectTo: "builder" })}
          onSuccess={onAuthSuccess}
        />
      )}
    </div>
  );
}