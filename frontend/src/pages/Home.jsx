import { useUser } from "@clerk/clerk-react";
import React from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:    #0d0018;
    --ink2:   #2d1b4e;
    --violet: #5b21b6;
    --purple: #7c3aed;
    --grape:  #9333ea;
    --lilac:  #c4b5fd;
    --mist:   #ede9fe;
    --white:  #ffffff;
    --mid:    #6b7280;
    --light:  #e5e7eb;
  }

  html { scroll-behavior:smooth; }
  body {
    font-family:'Outfit',sans-serif;
    background:var(--white);
    color:var(--ink);
    -webkit-font-smoothing:antialiased;
  }

  @keyframes up      { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }
  @keyframes bob     { 0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)} }
  @keyframes shimmer { 0%{background-position:0% 50%}100%{background-position:200% 50%} }
  @keyframes bdance  { 0%,100%{border-color:#c4b5fd}50%{border-color:#7c3aed} }

  .u0{animation:up .55s .00s both} .u1{animation:up .55s .08s both}
  .u2{animation:up .55s .16s both} .u3{animation:up .55s .24s both}
  .u4{animation:up .55s .32s both} .u5{animation:up .55s .40s both}

  .page { min-height:100vh; display:flex; flex-direction:column; }

  /* HERO */
  .hero {
    display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center;
    padding:80px clamp(24px,6vw,100px) 60px;
    min-height:calc(100vh - 64px);
    position:relative; overflow:hidden;
  }
  .blob {
    position:absolute; border-radius:50%;
    filter:blur(80px); pointer-events:none; z-index:0;
  }

  /* Typography */
  .display {
    font-family:'Syne',sans-serif;
    font-size:clamp(42px,7.5vw,88px);
    font-weight:800; line-height:1.0; letter-spacing:-0.04em; color:var(--ink);
  }
  .display em {
    font-style:normal;
    background:linear-gradient(135deg,#5b21b6,#9333ea,#c4b5fd,#7c3aed);
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:shimmer 4s linear infinite;
  }

  /* Eyebrow */
  .eyebrow {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:600;
    letter-spacing:.06em; text-transform:uppercase;
    color:var(--purple); background:var(--mist);
    border:1px solid var(--lilac); border-radius:999px;
    padding:6px 16px; margin-bottom:24px;
    animation:bdance 3s ease infinite;
  }
  .eyebrow-dot {
    width:6px; height:6px; border-radius:50%;
    background:var(--purple); animation:bob 2s ease-in-out infinite;
  }

  /* Buttons */
  .btn-fill {
    font-family:'Syne',sans-serif; font-size:14px; font-weight:700; letter-spacing:.01em;
    background:var(--violet); color:#fff;
    border:none; border-radius:14px; padding:16px 34px; cursor:pointer;
    box-shadow:0 8px 28px rgba(91,33,182,.28),inset 0 1px 0 rgba(255,255,255,.15);
    transition:all .22s ease; display:inline-flex; align-items:center; gap:9px;
  }
  .btn-fill:hover { background:var(--purple); box-shadow:0 12px 40px rgba(91,33,182,.38); transform:translateY(-2px); }

  .btn-ghost {
    font-family:'Syne',sans-serif; font-size:14px; font-weight:700; letter-spacing:.01em;
    background:transparent; color:var(--ink2);
    border:1.5px solid var(--light); border-radius:14px; padding:16px 34px; cursor:pointer;
    transition:all .22s ease; display:inline-flex; align-items:center; gap:9px;
  }
  .btn-ghost:hover { border-color:var(--lilac); color:var(--purple); background:var(--mist); transform:translateY(-2px); }

  /* Stats */
  .stats-bar {
    display:inline-flex; align-items:stretch;
    background:var(--white); border:1px solid #e5e7eb;
    border-radius:16px; box-shadow:0 2px 16px rgba(0,0,0,.05); overflow:hidden;
  }
  .stat-cell { padding:16px 28px; text-align:center; border-right:1px solid #f3f4f6; }
  .stat-cell:last-child { border-right:none; }
  .stat-val { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:var(--violet); letter-spacing:-.02em; }
  .stat-lbl { font-size:11px; color:#9ca3af; font-weight:500; margin-top:2px; }

  /* Feature section */
  .section { max-width:1120px; margin:0 auto; width:100%; padding:0 clamp(24px,5vw,80px) 100px; }
  .sec-head { text-align:center; margin-bottom:52px; }
  .sec-title { font-family:'Syne',sans-serif; font-size:clamp(26px,4vw,42px); font-weight:800; letter-spacing:-.03em; color:var(--ink); margin-bottom:10px; }
  .sec-sub { font-size:15px; color:#9ca3af; }

  .card-wrap { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; }

  .card {
    background:var(--white); border:1px solid #f0eaff; border-radius:24px;
    padding:36px 32px; cursor:pointer; position:relative; overflow:hidden;
    transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
    box-shadow:0 2px 12px rgba(91,33,182,.04);
  }
  .card::after {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    opacity:0; transition:opacity .25s;
  }
  .card:hover { transform:translateY(-5px); box-shadow:0 20px 50px rgba(91,33,182,.10); border-color:var(--lilac); }
  .card:hover::after { opacity:1; }
  .cv::after { background:linear-gradient(90deg,#5b21b6,#9333ea); }
  .cg::after { background:linear-gradient(90deg,#059669,#34d399); }

  .card-icon {
    width:52px; height:52px; border-radius:16px;
    display:flex; align-items:center; justify-content:center; font-size:24px;
    margin-bottom:22px; animation:bob 4s ease-in-out infinite;
  }
  .iv { background:linear-gradient(135deg,#f5f3ff,#ede9fe); }
  .ig { background:linear-gradient(135deg,#ecfdf5,#d1fae5); }

  .card-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:var(--ink); letter-spacing:-.02em; margin-bottom:10px; }
  .card-body  { font-size:14px; color:var(--mid); line-height:1.75; margin-bottom:22px; }
  .tags       { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:22px; }
  .tag        { font-size:11px; font-weight:600; padding:4px 11px; border-radius:999px; letter-spacing:.02em; }
  .tv { background:#f5f3ff; color:#6d28d9; }
  .tg { background:#ecfdf5; color:#047857; }
  .card-cta { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:.01em; display:inline-flex; align-items:center; gap:5px; }
  .cv-cta { color:var(--violet); }
  .cg-cta { color:#059669; }

  .lock-tag {
    position:absolute; top:18px; right:18px;
    background:#fffbeb; color:#92400e;
    font-size:10px; font-weight:700; font-family:'Syne',sans-serif;
    padding:4px 10px; border-radius:999px; border:1px solid #fde68a; letter-spacing:.03em;
  }

  .wcip {
    display:inline-flex; align-items:center; gap:8px;
    background:var(--mist); border:1px solid var(--lilac);
    border-radius:999px; padding:8px 18px; margin-bottom:28px;
    font-size:13px; font-weight:600; color:var(--violet);
  }

  footer {
    text-align:center; padding:24px;
    border-top:1px solid #f3f4f6;
    font-size:12px; color:#d1d5db;
    font-weight:500; letter-spacing:.03em; margin-top:auto;
  }

  @media(max-width:600px){
    .stats-bar{flex-direction:column;}
    .stat-cell{border-right:none;border-bottom:1px solid #f3f4f6;}
    .stat-cell:last-child{border-bottom:none;}
  }
`;

export default function HomePage({ setPage, onProtectedNav }) {
  const { isSignedIn, user } = useUser();
  const go = (p) => { if (!isSignedIn) { onProtectedNav(p); return; } setPage(p); };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="blob" style={{width:520,height:520,top:"-18%",left:"-12%",background:"rgba(196,181,253,.18)"}} />
          <div className="blob" style={{width:380,height:380,bottom:"5%",right:"-8%",background:"rgba(147,51,234,.10)"}} />
          <div className="blob" style={{width:280,height:280,top:"42%",left:"46%",background:"rgba(91,33,182,.07)"}} />

          <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>

            {isSignedIn && (
              <div className="wcip u0">
                <span style={{fontSize:16}}>👋</span>
                Welcome back, {user?.firstName || "there"}!
              </div>
            )}

            <div className="eyebrow u0">
              <span className="eyebrow-dot" />
              Powered by Groq · LLaMA 3.3 · 70B
            </div>

            <h1 className="display u1" style={{marginTop:4,marginBottom:24,maxWidth:820}}>
              Land the job<br />with your <em>AI edge</em>
            </h1>

            <p className="u2" style={{
              fontSize:"clamp(15px,1.8vw,18px)", fontWeight:400, color:"var(--mid)",
              lineHeight:1.8, maxWidth:480, marginBottom:40,
            }}>
              Build ATS-optimized resumes in seconds — or upload yours for
              deep AI analysis, scoring, and a polished rewrite.
            </p>

            <div className="u3" style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:16}}>
              <button className="btn-fill" onClick={() => go("builder")}>
                ✍ Build My Resume
                {!isSignedIn && <span style={{fontSize:11,opacity:.75}}>· Free</span>}
              </button>
              <button className="btn-ghost" onClick={() => go("ats")}>
                📊 Check ATS Score
                {!isSignedIn && <span>🔒</span>}
              </button>
            </div>

            {!isSignedIn && (
              <p className="u4" style={{fontSize:12,color:"#9ca3af",marginBottom:40}}>
                Free account required · takes 10 seconds
              </p>
            )}

            <div className="stats-bar u5">
              {[["Free","No credit card"],["< 10s","Instant results"],["ATS-Ready","Beat the filters"],["70B AI","LLaMA 3.3"]].map(([v,l])=>(
                <div className="stat-cell" key={v}>
                  <div className="stat-val">{v}</div>
                  <div className="stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <div className="section">
          <div className="sec-head">
            <h2 className="sec-title">Two tools, one edge</h2>
            <p className="sec-sub">Everything you need to land your next role</p>
          </div>

          <div className="card-wrap">

            <div className="card cv u1" onClick={() => go("builder")}>
              {!isSignedIn && <div className="lock-tag">🔒 Login</div>}
              <div className="card-icon iv">✍️</div>
              <div className="card-title">Resume Builder</div>
              <p className="card-body">Fill a guided form — AI writes a polished, ATS-ready resume. Preview in A4 and download as PDF instantly.</p>
              <div className="tags">
                {["Multi-step form","AI polish","A4 PDF","ATS optimized"].map(t=><span className="tag tv" key={t}>{t}</span>)}
              </div>
              <div className="card-cta cv-cta">Get started →</div>
            </div>

            <div className="card cv u2" onClick={() => go("ats")}>
              {!isSignedIn && <div className="lock-tag">🔒 Login</div>}
              <div className="card-icon iv" style={{animationDelay:".6s"}}>📊</div>
              <div className="card-title">ATS Checker</div>
              <p className="card-body">Upload your PDF — instant score, mistake analysis, missing keywords, and a fully improved version.</p>
              <div className="tags">
                {["PDF upload","ATS score","Mistake analysis","Improved version"].map(t=><span className="tag tv" key={t}>{t}</span>)}
              </div>
              <div className="card-cta cv-cta">Analyze resume →</div>
            </div>

            <div className="card cg u3">
              <div className="card-icon ig" style={{animationDelay:"1.2s"}}>⚡</div>
              <div className="card-title">Blazing Fast AI</div>
              <p className="card-body">Groq's LPU inference delivers full resume analysis in under 10 seconds — the fastest AI resume tool available.</p>
              <div className="tags">
                {["Groq LPU","< 10s results","LLaMA 3.3 70B","Always free"].map(t=><span className="tag tg" key={t}>{t}</span>)}
              </div>
              <div className="card-cta cg-cta">Completely free ✓</div>
            </div>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer>ResumeAI · Built with Groq + LLaMA 3.3 · {new Date().getFullYear()}</footer>

      </div>
    </>
  );
}