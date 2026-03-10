import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useRef } from "react";
import {
  FiZap, FiUpload, FiTarget, FiShield, FiArrowRight,
  FiCheckCircle, FiStar, FiAward, FiFileText, FiTrendingUp,
  FiCpu, FiLock, FiChevronRight, FiBarChart2, FiUsers,
} from "react-icons/fi";
import {
  HiSparkles, HiLightningBolt,
} from "react-icons/hi";
import { SiOpenai } from "react-icons/si";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg0:      #02000a;
    --bg1:      #07021a;
    --bg2:      #0e0530;
    --bg3:      #160a42;
    --v900:     #1e0b5e;
    --v800:     #2d1278;
    --v700:     #3d189a;
    --v600:     #4f23b8;
    --v500:     #6131d4;
    --v400:     #7c4ef0;
    --v300:     #9b77ff;
    --v200:     #c4aeff;
    --v100:     #e8e0ff;
    --pink:     #e040fb;
    --teal:     #00e5cc;
    --gold:     #ffd95a;
    --white:    #ffffff;
    --glass:    rgba(255,255,255,0.04);
    --glass-b:  rgba(255,255,255,0.08);
    --glass-bd: rgba(161,137,255,0.15);
    --text-1:   #f0ecff;
    --text-2:   #b8a8ff;
    --text-3:   #7b6fad;
    --glow-v:   rgba(97,49,212,0.5);
    --glow-p:   rgba(224,64,251,0.3);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg0);
    color: var(--text-1);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── NOISE OVERLAY ── */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp    { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes bob       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse-glow{ 0%,100%{box-shadow:0 0 20px var(--glow-v)} 50%{box-shadow:0 0 50px var(--glow-v),0 0 90px var(--glow-p)} }
  @keyframes drift     { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,10px) scale(.97)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer   { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
  @keyframes borderPulse { 0%,100%{border-color:rgba(161,137,255,0.15)} 50%{border-color:rgba(124,78,240,0.5)} }
  @keyframes scan      { 0%{top:-5%} 100%{top:105%} }
  @keyframes float1    { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-15px) rotate(3deg)} }
  @keyframes float2    { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(12px) rotate(-2deg)} }

  .u0{animation:fadeUp .6s .00s both} .u1{animation:fadeUp .6s .10s both}
  .u2{animation:fadeUp .6s .20s both} .u3{animation:fadeUp .6s .30s both}
  .u4{animation:fadeUp .6s .40s both} .u5{animation:fadeUp .6s .50s both}
  .u6{animation:fadeUp .6s .60s both}

  /* ── PAGE ── */
  .page { min-height:100vh; display:flex; flex-direction:column; position:relative; z-index:1; }

  /* ── HERO ── */
  .hero {
    position:relative; overflow:hidden;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:120px clamp(20px,6vw,100px) 80px;
    min-height:100vh;
  }

  .hero-bg-mesh {
    position:absolute; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 80% 60% at 20% 0%,   rgba(78,35,154,0.55) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 10%,  rgba(224,64,251,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 70% 40% at 50% 100%, rgba(61,24,154,0.4)  0%, transparent 60%),
      radial-gradient(ellipse 90% 70% at 50% 50%,  rgba(0,0,12,0.9)     0%, transparent 80%),
      var(--bg0);
  }

  /* Rotating ring decorations */
  .hero-ring {
    position:absolute; border-radius:50%; pointer-events:none; z-index:0;
    border:1px solid rgba(124,78,240,0.12);
  }
  .hero-ring-1 { width:700px;height:700px; top:50%;left:50%;transform:translate(-50%,-50%); animation:spin-slow 40s linear infinite; }
  .hero-ring-2 { width:500px;height:500px; top:50%;left:50%;transform:translate(-50%,-50%); border-color:rgba(224,64,251,0.08); animation:spin-slow 28s linear infinite reverse; }
  .hero-ring-3 { width:300px;height:300px; top:50%;left:50%;transform:translate(-50%,-50%); border-color:rgba(161,137,255,0.1); animation:spin-slow 18s linear infinite; }

  /* Floating orbs */
  .orb {
    position:absolute; border-radius:50%; pointer-events:none; z-index:0; filter:blur(70px);
  }
  .orb-1 { width:500px;height:500px; top:-15%;left:-10%; background:rgba(61,24,154,0.4); animation:drift 18s ease-in-out infinite; }
  .orb-2 { width:350px;height:350px; bottom:-5%;right:-5%; background:rgba(224,64,251,0.15); animation:drift 14s 4s ease-in-out infinite; }
  .orb-3 { width:250px;height:250px; top:40%;right:5%; background:rgba(97,49,212,0.25); animation:drift 22s 8s ease-in-out infinite; }

  .hero-content { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; max-width:860px; }

  /* Badge */
  .badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(97,49,212,0.2); border:1px solid rgba(161,137,255,0.3);
    border-radius:999px; padding:7px 18px; margin-bottom:28px;
    font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:var(--v200); backdrop-filter:blur(10px);
    animation:borderPulse 3s ease infinite;
  }
  .badge-dot { width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal); animation:bob 1.8s ease infinite; }

  /* Display heading */
  .display {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(64px,11vw,130px);
    line-height:.9; letter-spacing:.02em;
    color:var(--text-1);
    margin-bottom:8px;
  }
  .display .line2 {
    display:block;
    background:linear-gradient(100deg, #9b77ff 0%, #e040fb 40%, #ffd95a 70%, #00e5cc 100%);
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:shimmer 5s linear infinite;
  }

  .sub-display {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(18px,3vw,32px);
    letter-spacing:.15em; color:var(--text-3); margin-bottom:24px;
    text-transform:uppercase;
  }

  .hero-desc {
    font-size:clamp(14px,1.6vw,17px); font-weight:400; color:var(--text-2);
    line-height:1.9; max-width:520px; margin-bottom:44px;
  }

  /* CTA Buttons */
  .cta-group { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; margin-bottom:20px; }

  .btn-primary {
    position:relative; overflow:hidden;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800;
    letter-spacing:.04em; text-transform:uppercase;
    background:linear-gradient(135deg,var(--v600),var(--v400));
    color:#fff; border:none; border-radius:14px;
    padding:17px 38px; cursor:pointer;
    box-shadow:0 0 0 1px rgba(161,137,255,0.2), 0 8px 32px rgba(97,49,212,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
    transition:all .25s ease; display:inline-flex; align-items:center; gap:10px;
    animation:pulse-glow 3s ease infinite;
  }
  .btn-primary::before {
    content:''; position:absolute; top:0;left:-100%;width:100%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);
    transition:left .4s ease;
  }
  .btn-primary:hover::before { left:100%; }
  .btn-primary:hover { transform:translateY(-3px); box-shadow:0 0 0 1px rgba(161,137,255,0.4), 0 16px 48px rgba(97,49,212,0.6); }

  .btn-outline {
    font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800;
    letter-spacing:.04em; text-transform:uppercase;
    background:var(--glass); color:var(--v200);
    border:1px solid var(--glass-bd); border-radius:14px;
    padding:17px 38px; cursor:pointer; backdrop-filter:blur(12px);
    transition:all .25s ease; display:inline-flex; align-items:center; gap:10px;
  }
  .btn-outline:hover { background:rgba(97,49,212,0.15); border-color:rgba(161,137,255,0.5); color:var(--v100); transform:translateY(-3px); }

  /* Stats strip */
  .stats-strip {
    display:flex; align-items:center; justify-content:center;
    gap:0; background:rgba(255,255,255,0.03);
    border:1px solid rgba(161,137,255,0.12);
    border-radius:18px; backdrop-filter:blur(16px);
    overflow:hidden; margin-top:12px;
    box-shadow:0 0 0 1px rgba(97,49,212,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .stat-item { padding:18px 32px; text-align:center; border-right:1px solid rgba(161,137,255,0.08); }
  .stat-item:last-child { border-right:none; }
  .stat-num { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:.05em; color:var(--v300); }
  .stat-label { font-size:10px; font-weight:600; color:var(--text-3); letter-spacing:.08em; text-transform:uppercase; margin-top:2px; }

  /* ── SECTION ── */
  .section { max-width:1200px; margin:0 auto; width:100%; padding:0 clamp(20px,5vw,80px) 100px; }

  .sec-eyebrow {
    display:inline-flex; align-items:center; gap:6px;
    font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    color:var(--teal); background:rgba(0,229,204,0.08);
    border:1px solid rgba(0,229,204,0.2); border-radius:999px; padding:5px 14px;
    margin-bottom:16px;
  }
  .sec-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(36px,5vw,62px); letter-spacing:.03em; color:var(--text-1);
    margin-bottom:12px; line-height:1;
  }
  .sec-title span {
    background:linear-gradient(90deg,var(--v300),var(--pink));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .sec-sub { font-size:15px; color:var(--text-3); line-height:1.7; max-width:500px; }

  /* ── DIVIDER ── */
  .divider {
    height:1px; background:linear-gradient(90deg,transparent,rgba(161,137,255,0.2),transparent);
    margin:0 clamp(20px,5vw,80px) 100px;
  }

  /* ── HOW IT WORKS ── */
  .steps-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:2px; background:rgba(161,137,255,0.06); border-radius:24px; overflow:hidden; border:1px solid rgba(161,137,255,0.1); }

  .step-cell {
    background:var(--bg1); padding:40px 32px;
    position:relative; overflow:hidden;
    transition:background .3s ease;
  }
  .step-cell:hover { background:rgba(78,35,154,0.2); }
  .step-cell::after {
    content:''; position:absolute; bottom:0; left:0; right:0;
    height:2px;
    background:linear-gradient(90deg,var(--v600),var(--pink));
    transform:scaleX(0); transition:transform .3s ease; transform-origin:left;
  }
  .step-cell:hover::after { transform:scaleX(1); }

  .step-num {
    font-family:'Space Mono',monospace; font-size:11px; font-weight:700;
    color:var(--v400); letter-spacing:.1em; margin-bottom:20px;
    display:flex; align-items:center; gap:8px;
  }
  .step-num::after { content:''; flex:1; height:1px; background:rgba(161,137,255,0.1); }

  .step-icon { font-size:32px; color:var(--v300); margin-bottom:16px; animation:float1 5s ease-in-out infinite; }
  .step-title { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.04em; color:var(--text-1); margin-bottom:10px; }
  .step-desc { font-size:13px; color:var(--text-3); line-height:1.8; }

  /* ── FEATURE CARDS ── */
  .features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:20px; }

  .feat-card {
    position:relative; overflow:hidden;
    background:linear-gradient(145deg, rgba(22,10,66,0.8), rgba(14,5,48,0.9));
    border:1px solid rgba(161,137,255,0.1);
    border-radius:24px; padding:40px 36px;
    cursor:pointer; backdrop-filter:blur(20px);
    transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
    box-shadow:0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .feat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(124,78,240,0.5),transparent);
    opacity:0; transition:opacity .3s;
  }
  .feat-card:hover { transform:translateY(-6px) scale(1.01); border-color:rgba(161,137,255,0.3); box-shadow:0 20px 60px rgba(97,49,212,0.25), 0 0 0 1px rgba(161,137,255,0.15), inset 0 1px 0 rgba(255,255,255,0.07); }
  .feat-card:hover::before { opacity:1; }

  /* Glossy highlight */
  .feat-card::after {
    content:''; position:absolute; top:-30%; left:-30%;
    width:80%; height:60%; border-radius:50%;
    background:radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%);
    pointer-events:none;
  }

  /* Scan line effect */
  .feat-card .scan-line {
    position:absolute; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(161,137,255,0.15),transparent);
    animation:scan 4s linear infinite;
    pointer-events:none;
  }

  .feat-icon-wrap {
    width:60px; height:60px; border-radius:18px; margin-bottom:24px;
    display:flex; align-items:center; justify-content:center; font-size:26px;
    position:relative; animation:bob 5s ease-in-out infinite;
  }
  .feat-icon-wrap::after {
    content:''; position:absolute; inset:-1px; border-radius:19px;
    background:linear-gradient(135deg,rgba(161,137,255,0.3),rgba(224,64,251,0.1));
    z-index:-1;
  }
  .fi-blue  { background:linear-gradient(135deg,rgba(49,97,212,0.3),rgba(61,24,154,0.5)); color:var(--v300); }
  .fi-pink  { background:linear-gradient(135deg,rgba(224,64,251,0.2),rgba(61,24,154,0.4)); color:#e040fb; }
  .fi-teal  { background:linear-gradient(135deg,rgba(0,229,204,0.2),rgba(0,100,90,0.3)); color:var(--teal); }
  .fi-gold  { background:linear-gradient(135deg,rgba(255,217,90,0.2),rgba(180,120,0,0.3)); color:var(--gold); }

  .feat-title { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:.04em; color:var(--text-1); margin-bottom:12px; }
  .feat-desc  { font-size:14px; color:var(--text-3); line-height:1.85; margin-bottom:24px; }

  .feat-bullets { list-style:none; margin-bottom:28px; display:flex; flex-direction:column; gap:8px; }
  .feat-bullets li {
    display:flex; align-items:flex-start; gap:10px;
    font-size:13px; color:var(--text-2); line-height:1.6;
  }
  .feat-bullets li svg { color:var(--teal); margin-top:2px; flex-shrink:0; }

  .feat-cta {
    display:inline-flex; align-items:center; gap:6px;
    font-size:12px; font-weight:800; letter-spacing:.06em; text-transform:uppercase;
    color:var(--v300); transition:gap .2s ease, color .2s ease;
  }
  .feat-cta:hover { gap:10px; color:var(--v200); }
  .feat-cta.pink { color:#e040fb; }
  .feat-cta.pink:hover { color:#f06fff; }

  .feat-badge {
    position:absolute; top:20px; right:20px;
    background:rgba(255,215,0,0.12); border:1px solid rgba(255,215,0,0.3);
    color:var(--gold); font-size:10px; font-weight:700; font-family:'Space Mono',monospace;
    padding:4px 10px; border-radius:999px; letter-spacing:.05em;
  }

  /* ── SOCIAL PROOF / REVIEWS ── */
  .reviews-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; }

  .review-card {
    background:rgba(14,5,48,0.7); border:1px solid rgba(161,137,255,0.08);
    border-radius:20px; padding:28px; backdrop-filter:blur(12px);
    transition:border-color .3s; position:relative; overflow:hidden;
  }
  .review-card:hover { border-color:rgba(161,137,255,0.25); }
  .review-card::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,rgba(161,137,255,0.15),transparent); }

  .stars { display:flex; gap:3px; margin-bottom:14px; }
  .stars svg { color:var(--gold); font-size:13px; }

  .review-text { font-size:13px; color:var(--text-2); line-height:1.8; margin-bottom:18px; font-style:italic; }
  .review-text::before { content:'"'; font-size:32px; color:var(--v500); line-height:0; vertical-align:-14px; margin-right:4px; font-family:'Georgia',serif; }

  .reviewer { display:flex; align-items:center; gap:12px; }
  .reviewer-avatar {
    width:38px; height:38px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:800; font-family:'Bebas Neue',sans-serif;
    letter-spacing:.05em; color:var(--white); flex-shrink:0;
  }
  .reviewer-name { font-size:13px; font-weight:700; color:var(--text-1); }
  .reviewer-role { font-size:11px; color:var(--text-3); margin-top:2px; }

  /* ── WHY SECTION ── */
  .why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; }

  .why-item {
    background:rgba(14,5,48,0.5); border:1px solid rgba(161,137,255,0.08);
    border-radius:18px; padding:28px 24px; text-align:center;
    transition:all .3s ease;
  }
  .why-item:hover { background:rgba(78,35,154,0.15); border-color:rgba(161,137,255,0.25); transform:translateY(-4px); }

  .why-icon { font-size:28px; margin-bottom:14px; display:flex; justify-content:center; animation:float2 6s ease-in-out infinite; }
  .why-item:nth-child(2) .why-icon { animation-delay:1.5s; }
  .why-item:nth-child(3) .why-icon { animation-delay:3s; }
  .why-item:nth-child(4) .why-icon { animation-delay:4.5s; }

  .why-title { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:.04em; color:var(--text-1); margin-bottom:8px; }
  .why-desc  { font-size:12px; color:var(--text-3); line-height:1.75; }

  /* ── CTA BANNER ── */
  .cta-banner {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,rgba(61,24,154,0.6),rgba(78,35,154,0.4),rgba(22,10,66,0.8));
    border:1px solid rgba(161,137,255,0.2);
    border-radius:32px; padding:70px clamp(30px,6vw,80px);
    text-align:center; backdrop-filter:blur(20px);
    box-shadow:0 0 80px rgba(97,49,212,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom:100px;
  }
  .cta-banner::before {
    content:''; position:absolute; top:0;left:0;right:0;
    height:1px; background:linear-gradient(90deg,transparent,rgba(161,137,255,0.4),transparent);
  }
  .cta-banner-orb {
    position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none;
  }
  .cta-banner-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(42px,6vw,72px); letter-spacing:.03em; color:var(--text-1); margin-bottom:12px; position:relative; z-index:1; }
  .cta-banner-sub   { font-size:15px; color:var(--text-2); margin-bottom:36px; position:relative; z-index:1; }

  /* ── FOOTER ── */
  footer {
    border-top:1px solid rgba(161,137,255,0.08);
    padding:32px clamp(20px,5vw,80px);
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:16px;
    font-size:12px; color:var(--text-3); font-weight:500;
  }
  .footer-brand {
    font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:.1em;
    background:linear-gradient(90deg,var(--v300),var(--pink));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .footer-links { display:flex; gap:24px; }
  .footer-links a { color:var(--text-3); text-decoration:none; font-size:12px; font-weight:500; letter-spacing:.04em; transition:color .2s; }
  .footer-links a:hover { color:var(--v200); }

  /* ── WELCOME CHIP ── */
  .welcome-chip {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(0,229,204,0.1); border:1px solid rgba(0,229,204,0.25);
    border-radius:999px; padding:8px 20px; margin-bottom:20px;
    font-size:13px; font-weight:700; color:var(--teal);
  }

  /* ── GLOSS ── */
  .gloss {
    position:absolute; top:0; left:0; right:0;
    height:50%; border-radius:inherit;
    background:linear-gradient(180deg,rgba(255,255,255,0.05) 0%,transparent 100%);
    pointer-events:none; z-index:1;
  }

  /* ── TECH BADGE ── */
  .tech-row { display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-bottom:16px; }
  .tech-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(22,10,66,0.8); border:1px solid rgba(161,137,255,0.12);
    border-radius:10px; padding:6px 14px;
    font-family:'Space Mono',monospace; font-size:10px; font-weight:700;
    letter-spacing:.06em; color:var(--v200);
  }
  .tech-tag svg { font-size:12px; }

  @media(max-width:640px){
    .stats-strip { flex-direction:column; }
    .stat-item { border-right:none; border-bottom:1px solid rgba(161,137,255,0.08); }
    .stat-item:last-child { border-bottom:none; }
    .steps-grid { grid-template-columns:1fr; }
    footer { flex-direction:column; align-items:center; text-align:center; }
    .cta-banner { padding:50px 24px; }
  }
`;

const REVIEWS = [
  { name:"Aryan K.",   role:"Software Engineer at Google",     avatar:"AK", color:"#6131d4", text:"Got 3 callbacks in a week after using the ATS checker. The rewrite it gave me was night-and-day different." },
  { name:"Priya M.",   role:"Product Manager, fintech startup", avatar:"PM", color:"#e040fb", text:"Built my entire resume from scratch in under 5 minutes. The AI understood exactly what I needed to highlight." },
  { name:"James L.",   role:"Data Scientist @ Meta",           avatar:"JL", color:"#00b5a0", text:"The ATS score jumped from 54 to 91 after following the suggestions. Finally understand what recruiters see." },
  { name:"Sofia R.",   role:"UX Designer, remote",             avatar:"SR", color:"#ffd95a", text:"Clean A4 PDF, great keywords, no fluff. I've recommended this to everyone in my network." },
  { name:"Rahul D.",   role:"Backend Dev, seeking new role",   avatar:"RD", color:"#f97316", text:"Fastest AI tool I've ever used. Results in 8 seconds flat and genuinely useful, not generic." },
  { name:"Mei C.",     role:"Marketing Lead",                  avatar:"MC", color:"#3d60ff", text:"The 'missing keywords' section alone was worth it. Instantly spotted 6 skills I'd forgotten to include." },
];

export default function HomePage({ setPage, onProtectedNav }) {
  const { isSignedIn, user } = useUser();
  const go = (p) => { if (!isSignedIn) { onProtectedNav(p); return; } setPage(p); };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-bg-mesh" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="hero-ring hero-ring-1" />
          <div className="hero-ring hero-ring-2" />
          <div className="hero-ring hero-ring-3" />

          <div className="hero-content">

            {isSignedIn ? (
              <div className="welcome-chip u0">
                <HiSparkles size={14} />
                Welcome back, {user?.firstName || "there"} — your edge awaits
              </div>
            ) : (
              <div className="badge u0">
                <span className="badge-dot" />
                Powered by Groq · LLaMA 3.3 · 70B — Always Free
              </div>
            )}

            <h1 className="display u1">
              GET HIRED<br />
              <span className="line2">FASTER.</span>
            </h1>

            <p className="sub-display u2">The AI Resume Engine Built to Win</p>

            <p className="hero-desc u3">
              Build ATS-crushing resumes in seconds or upload yours for a deep
              AI audit — scoring, gap analysis, keyword detection, and a
              polished rewrite. Land interviews. Get the job.
            </p>

            <div className="tech-row u3">
              {[
                [<FiCpu />, "Groq LPU Inference"],
                [<HiLightningBolt />, "< 10s Results"],
                [<FiShield />, "ATS-Optimized"],
                [<SiOpenai />, "LLaMA 3.3 70B"],
              ].map(([icon, label]) => (
                <div className="tech-tag" key={label}>{icon}{label}</div>
              ))}
            </div>

            <div className="cta-group u4">
              <button className="btn-primary" onClick={() => go("builder")}>
                <FiFileText size={16} />
                Build My Resume
                <FiArrowRight size={15} />
              </button>
              <button className="btn-outline" onClick={() => go("ats")}>
                <FiBarChart2 size={16} />
                Check ATS Score
                {!isSignedIn && <FiLock size={13} />}
              </button>
            </div>

            <div className="stats-strip u5">
              {[
                ["100%","Free Forever"],
                ["< 10s","Analysis Speed"],
                ["ATS-91%","Avg Score Lift"],
                ["50K+","Resumes Built"],
              ].map(([v,l]) => (
                <div className="stat-item" key={v}>
                  <div className="stat-num">{v}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <div className="section">
          <div style={{marginBottom:40}}>
            <div className="sec-eyebrow"><FiZap size={10} /> How It Works</div>
            <h2 className="sec-title">Simple. Fast. <span>Lethal.</span></h2>
            <p className="sec-sub">From blank page to interview-ready in under 3 minutes.</p>
          </div>

          <div className="steps-grid">
            {[
              { n:"01", icon:<FiFileText size={30} />, title:"Fill or Upload", desc:"Start fresh with our guided form — or drop your existing PDF resume for instant analysis. No account needed to start." },
              { n:"02", icon:<FiCpu size={30} />,      title:"AI Engine Fires", desc:"Groq's LPU processes your resume through LLaMA 3.3 70B in milliseconds. It reads context, not just keywords." },
              { n:"03", icon:<FiTarget size={30} />,   title:"Score + Fix", desc:"Receive an ATS compatibility score, missing keyword alerts, formatting issues, and a fully rewritten version." },
              { n:"04", icon:<FiAward size={30} />,    title:"Download + Win", desc:"Export your polished A4 PDF resume. Apply with confidence. Get the callbacks you deserve." },
            ].map(s => (
              <div className="step-cell" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* ── FEATURES ── */}
        <div className="section">
          <div style={{marginBottom:48}}>
            <div className="sec-eyebrow"><HiSparkles size={10} /> Core Tools</div>
            <h2 className="sec-title">Two weapons.<br /><span>One arsenal.</span></h2>
            <p className="sec-sub">Everything the modern job seeker needs — powered by the fastest AI inference on earth.</p>
          </div>

          <div className="features-grid">

            {/* Resume Builder */}
            <div className="feat-card" onClick={() => go("builder")}>
              <div className="gloss" />
              <div className="scan-line" />
              <div className="feat-icon-wrap fi-blue" style={{animationDelay:"0s"}}>
                <FiFileText />
              </div>
              <div className="feat-title">Resume Builder</div>
              <p className="feat-desc">
                Answer guided prompts — our AI assembles a perfectly structured, ATS-friendly resume tailored to your industry and target role. Zero design skills needed.
              </p>
              <ul className="feat-bullets">
                {["Multi-step smart form with AI autofill","Role-specific language injection","A4 PDF instant download","Passes top ATS systems: Workday, Greenhouse, Lever"].map(b => (
                  <li key={b}><FiCheckCircle size={13} />{b}</li>
                ))}
              </ul>
              <div className="feat-cta" onClick={() => go("builder")}>
                Start Building <FiChevronRight size={14} />
              </div>
            </div>

            {/* ATS Checker */}
            <div className="feat-card" onClick={() => go("ats")}>
              <div className="gloss" />
              <div className="scan-line" style={{animationDelay:"2s"}} />
              {!isSignedIn && <div className="feat-badge">🔒 LOGIN</div>}
              <div className="feat-icon-wrap fi-pink" style={{animationDelay:".8s"}}>
                <FiBarChart2 />
              </div>
              <div className="feat-title">ATS Checker</div>
              <p className="feat-desc">
                Upload your existing resume. Our AI scores it against real ATS algorithms, surfaces every flaw, and hands you a fully improved version.
              </p>
              <ul className="feat-bullets">
                {["0–100 ATS compatibility score","Missing keyword detection by role","Grammar & formatting issue report","Full AI-rewritten improved resume"].map(b => (
                  <li key={b}><FiCheckCircle size={13} />{b}</li>
                ))}
              </ul>
              <div className="feat-cta pink" onClick={() => go("ats")}>
                Analyze Now <FiChevronRight size={14} />
              </div>
            </div>

            {/* Speed */}
            <div className="feat-card">
              <div className="gloss" />
              <div className="scan-line" style={{animationDelay:"1s"}} />
              <div className="feat-icon-wrap fi-teal" style={{animationDelay:"1.6s"}}>
                <FiZap />
              </div>
              <div className="feat-title">Groq-Powered Speed</div>
              <p className="feat-desc">
                Traditional AI tools keep you waiting. Groq's Language Processing Unit delivers full resume analysis in under 10 seconds — every time.
              </p>
              <ul className="feat-bullets">
                {["Groq LPU: world's fastest AI inference","LLaMA 3.3 70B — 70 billion parameters","No throttling, no queues","Scales to any load instantly"].map(b => (
                  <li key={b}><FiCheckCircle size={13} />{b}</li>
                ))}
              </ul>
              <div className="feat-cta" style={{color:"var(--teal)"}}>
                See benchmarks <FiChevronRight size={14} />
              </div>
            </div>

            {/* Free Forever */}
            <div className="feat-card">
              <div className="gloss" />
              <div className="scan-line" style={{animationDelay:"3s"}} />
              <div className="feat-icon-wrap fi-gold" style={{animationDelay:"2.4s"}}>
                <FiStar />
              </div>
              <div className="feat-title">Free Forever</div>
              <p className="feat-desc">
                No subscriptions. No credits. No paywalls. Every feature is completely free because we believe everyone deserves equal access to career tools.
              </p>
              <ul className="feat-bullets">
                {["Unlimited resume builds","Unlimited ATS checks","No credit card ever required","Permanent free tier — no bait-and-switch"].map(b => (
                  <li key={b}><FiCheckCircle size={13} />{b}</li>
                ))}
              </ul>
              <div className="feat-cta" style={{color:"var(--gold)"}}>
                Always free ✓ <FiChevronRight size={14} />
              </div>
            </div>

          </div>
        </div>

        <div className="divider" />

        {/* ── WHY RESUMEAI ── */}
        <div className="section">
          <div style={{marginBottom:44}}>
            <div className="sec-eyebrow"><FiTrendingUp size={10} /> Why ResumeAI</div>
            <h2 className="sec-title">The unfair <span>advantage.</span></h2>
            <p className="sec-sub">Most applicants never make it past the ATS filter. Now you will.</p>
          </div>

          <div className="why-grid">
            {[
              { icon:<FiShield size={24} color="#9b77ff" />,  title:"ATS-Proof",    desc:"75% of resumes are rejected before a human sees them. We make sure yours passes every filter." },
              { icon:<FiZap size={24} color="#00e5cc" />,     title:"10 Sec Flat",  desc:"Groq's LPU is 10× faster than GPU-based AI. Results before you can pour a coffee." },
              { icon:<FiUsers size={24} color="#e040fb" />,   title:"50K+ Users",   desc:"Tens of thousands of job seekers have already landed interviews using ResumeAI." },
              { icon:<FiUpload size={24} color="#ffd95a" />,  title:"PDF Ready",    desc:"Download a pixel-perfect A4 PDF the moment your resume is ready. Apply instantly." },
            ].map(w => (
              <div className="why-item" key={w.title}>
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <p className="why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* ── REVIEWS ── */}
        <div className="section">
          <div style={{marginBottom:44}}>
            <div className="sec-eyebrow"><FiStar size={10} /> Real Results</div>
            <h2 className="sec-title">People are <span>getting hired.</span></h2>
            <p className="sec-sub">Don't take our word for it.</p>
          </div>

          <div className="reviews-grid">
            {REVIEWS.map(r => (
              <div className="review-card" key={r.name}>
                <div className="stars">{[...Array(5)].map((_,i) => <FiStar key={i} />)}</div>
                <p className="review-text">{r.text}</p>
                <div className="reviewer">
                  <div className="reviewer-avatar" style={{background:r.color}}>{r.avatar}</div>
                  <div>
                    <div className="reviewer-name">{r.name}</div>
                    <div className="reviewer-role">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="section">
          <div className="cta-banner">
            <div className="cta-banner-orb" style={{width:400,height:400,top:"-50%",left:"-10%",background:"rgba(97,49,212,0.3)"}} />
            <div className="cta-banner-orb" style={{width:300,height:300,bottom:"-40%",right:"5%",background:"rgba(224,64,251,0.15)"}} />
            <div className="gloss" />
            <h2 className="cta-banner-title">YOUR DREAM JOB<br />IS ONE RESUME AWAY</h2>
            <p className="cta-banner-sub">Join 50,000+ job seekers who've upgraded their resume with AI. Free. Always.</p>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",position:"relative",zIndex:1}}>
              <button className="btn-primary" onClick={() => go("builder")}>
                <FiFileText size={16} />
                Build My Resume — Free
                <FiArrowRight size={15} />
              </button>
              <button className="btn-outline" onClick={() => go("ats")}>
                <FiBarChart2 size={16} />
                Check My ATS Score
                {!isSignedIn && <FiLock size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-brand">ResumeAI</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <div style={{color:"var(--text-3)",fontSize:11,letterSpacing:".04em"}}>
            Built with Groq + LLaMA 3.3 · © {new Date().getFullYear()} ResumeAI
          </div>
        </footer>

      </div>
    </>
  );
}