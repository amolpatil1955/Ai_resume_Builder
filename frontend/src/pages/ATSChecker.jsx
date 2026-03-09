import React,{ useState, useRef } from "react";
import ResumePreview from "../components/ResumePreview.jsx";

const API = "http://localhost:5000/api/v1/upload-analyze";

function ScoreRing({ score }) {
  const r = 48, c = 2*Math.PI*r;
  const offset = c - (score/100)*c;
  const color = score>=75?"#16a34a":score>=50?"#ca8a04":"#dc2626";
  const bg = score>=75?"#dcfce7":score>=50?"#fef9c3":"#fee2e2";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <div style={{ position:"relative", width:120, height:120 }}>
        <svg width="120" height="120" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e0f2fe" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)", animation:"scoreIn 1.2s ease" }}
          />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:30, fontWeight:800, color, lineHeight:1 }}>{score}</span>
          <span style={{ fontSize:10, color:"#64748b", fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>/ 100</span>
        </div>
      </div>
      <span style={{ background:bg, color, padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>
        {score>=75?"Strong ✓":score>=50?"Average ⚠":"Weak ✕"}
      </span>
    </div>
  );
}

export default function ATSPage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [view, setView] = useState("analysis");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f?.type !== "application/pdf") return setError("Only PDF files allowed!");
    setFile(f); setError(""); setResult(null);
  };

  const analyze = async () => {
    if (!file) return setError("Pehle PDF upload karo!");
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await fetch(API, { method:"POST", body:fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (view==="improved" && result?.improvedResume) {
    return (
      <div style={{ minHeight:"100vh", padding:"40px clamp(16px,4vw,48px) 80px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, fontWeight:800, color:"#0c4a6e" }}>✨ AI-Improved Resume</h1>
              <p style={{ color:"#0369a1", marginTop:4 }}>All issues fixed — optimized for ATS</p>
            </div>
            <button className="btn-outline" onClick={()=>setView("analysis")}>← Back to Analysis</button>
          </div>
          <ResumePreview resume={result.improvedResume} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", padding:"40px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth:820, margin:"0 auto", display:"flex", flexDirection:"column", gap:28 }}>

        {/* Header */}
        <div className="fade-up">
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:800, color:"#0c4a6e", letterSpacing:"-0.03em" }}>
            ATS Score Checker
          </h1>
          <p style={{ color:"#0369a1", marginTop:8, fontSize:15 }}>Upload your resume PDF — get instant AI analysis and an improved version</p>
        </div>

        {/* Upload Zone */}
        <div
          className="fade-up"
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>inputRef.current.click()}
          style={{
            border:`2px dashed ${dragging?"#0284c7":file?"#0284c7":"#bae6fd"}`,
            borderRadius:20, padding:"clamp(30px,6vw,56px) 24px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:12,
            cursor:"pointer", transition:"all 0.3s",
            background: dragging?"rgba(2,132,199,0.04)":file?"rgba(2,132,199,0.04)":"white",
            boxShadow: dragging?"0 0 0 4px rgba(2,132,199,0.12)":"0 2px 20px rgba(14,165,233,0.06)"
          }}
        >
          <input ref={inputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          <div style={{ fontSize:48 }}>{file?"📄":"☁️"}</div>
          {file ? (
            <>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontWeight:700, color:"#0284c7", fontSize:16 }}>{file.name}</p>
                <p style={{ color:"#64748b", fontSize:13, marginTop:4 }}>{(file.size/1024).toFixed(1)} KB</p>
              </div>
              <button className="btn-outline" style={{ fontSize:13, padding:"6px 16px" }} onClick={e=>{e.stopPropagation();setFile(null);}}>✕ Remove</button>
            </>
          ) : (
            <>
              <p style={{ fontWeight:700, color:"#0c4a6e", fontSize:17 }}>Drop your resume PDF here</p>
              <p style={{ color:"#64748b", fontSize:14 }}>or click to browse — Max 5MB</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                <span className="badge badge-sky">PDF only</span>
                <span className="badge badge-sky">Max 5MB</span>
                <span className="badge badge-green">Free</span>
              </div>
            </>
          )}
        </div>

        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", color:"#dc2626", fontSize:14 }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn-sky fade-up" onClick={analyze} disabled={!file||loading}
          style={{ width:"100%", justifyContent:"center", padding:"16px", fontSize:16, borderRadius:16 }}>
          {loading
            ? <><span className="spinner"/>Analyzing your resume<Dots /></>
            : "🔍 Analyze My Resume"
          }
        </button>

        {/* Results */}
        {result && (
          <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Score Banner */}
            <div className="card-white" style={{ display:"flex", gap:clamp(20,32), alignItems:"center", padding:"28px 32px", flexWrap:"wrap" }} >
              <ScoreRing score={result.analysis.atsScore} />
              <div style={{ flex:1, minWidth:200 }}>
                <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:20, fontWeight:700, color:"#0c4a6e", marginBottom:8 }}>
                  ATS Analysis Complete
                </h2>
                <p style={{ color:"#0369a1", fontSize:14, lineHeight:1.7 }}>{result.analysis.overallFeedback}</p>
                <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                  <span className="badge badge-sky">🪙 {result.tokensUsed} tokens</span>
                  <button className="btn-sky" style={{ padding:"8px 20px", fontSize:14 }} onClick={()=>setView("improved")}>
                    ✨ View Improved Resume →
                  </button>
                </div>
              </div>
            </div>

            {/* Mistakes */}
            {result.analysis.mistakes?.length > 0 && (
              <div className="card-white fade-up" style={{ border:"1px solid #fecaca" }}>
                <SectionHead icon="❌" title="Specific Mistakes Found" color="#dc2626" />
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {result.analysis.mistakes.map((m,i)=>(
                    <div key={i} className="slide-in" style={{ animationDelay:`${i*0.06}s`, display:"flex", gap:10, padding:"10px 14px", background:"#fef2f2", borderRadius:10, fontSize:14, color:"#7f1d1d" }}>
                      <span style={{ color:"#dc2626", flexShrink:0, fontWeight:700 }}>✕</span> {m}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths + Weaknesses */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="grid-2">
              <div className="card-white fade-up" style={{ animationDelay:"0.1s" }}>
                <SectionHead icon="💪" title="Strengths" color="#16a34a" />
                {result.analysis.strengths.map((s,i)=>(
                  <Item key={i} text={s} icon="✓" color="#16a34a" bg="#f0fdf4" delay={i*0.05} />
                ))}
              </div>
              <div className="card-white fade-up" style={{ animationDelay:"0.15s" }}>
                <SectionHead icon="⚠️" title="Weaknesses" color="#ca8a04" />
                {result.analysis.weaknesses.map((w,i)=>(
                  <Item key={i} text={w} icon="!" color="#ca8a04" bg="#fefce8" delay={i*0.05} />
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="card-white fade-up">
              <SectionHead icon="🔧" title="How to Improve" color="#0284c7" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
                {result.analysis.improvements.map((imp,i)=>(
                  <div key={i} className="slide-in" style={{
                    animationDelay:`${i*0.07}s`, background:"#f0f9ff", borderRadius:12,
                    padding:"14px 16px", border:"1px solid #bae6fd", fontSize:13, color:"#0369a1", lineHeight:1.6
                  }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, color:"#0284c7", fontSize:14, marginRight:6 }}>0{i+1}</span>
                    {imp}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            {result.analysis.missingKeywords?.length > 0 && (
              <div className="card-white fade-up">
                <SectionHead icon="🔑" title="Missing Keywords" color="#0284c7" />
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {result.analysis.missingKeywords.map((kw,i)=>(
                    <span key={i} className="badge badge-yellow" style={{ fontSize:13, padding:"6px 14px" }}>+ {kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Section Feedback */}
            {result.analysis.sectionFeedback && (
              <div className="card-white fade-up">
                <SectionHead icon="📋" title="Section-wise Feedback" color="#0284c7" />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }} className="grid-2">
                  {Object.entries(result.analysis.sectionFeedback).map(([k,v])=>(
                    <div key={k} style={{ background:"#f8faff", borderRadius:12, padding:"14px 16px", border:"1px solid #e0f2fe" }}>
                      <p style={{ fontSize:11, fontWeight:700, color:"#0284c7", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6, fontFamily:"'JetBrains Mono',monospace" }}>{k}</p>
                      <p style={{ fontSize:13, color:"#0369a1", lineHeight:1.6 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button className="btn-sky fade-up" onClick={()=>setView("improved")}
              style={{ width:"100%", justifyContent:"center", padding:"16px", fontSize:16, borderRadius:16 }}>
              ✨ View & Download Improved Resume (A4 PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHead({ icon, title, color }) {
  return (
    <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
      <span>{icon}</span>{title}
    </h3>
  );
}

function Item({ text, icon, color, bg, delay }) {
  return (
    <div className="slide-in" style={{
      animationDelay:`${delay}s`, display:"flex", gap:10, alignItems:"flex-start",
      padding:"10px 12px", background:bg, borderRadius:10, fontSize:13, color:"#374151",
      lineHeight:1.55, marginBottom:8
    }}>
      <span style={{ color, fontWeight:700, flexShrink:0, marginTop:1 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Dots() {
  const [d, setD] = useState(".");
  useState(()=>{ const t=setInterval(()=>setD(p=>p.length>=3?".":".."+p),400); return()=>clearInterval(t); });
  return <span style={{ minWidth:20 }}>{d}</span>;
}

function clamp(a, b) { return `clamp(${a}px, 3vw, ${b}px)`; }