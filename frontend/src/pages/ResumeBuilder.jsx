import React, { useState } from "react";
import ResumePreview from "../components/ResumePreview.jsx";
import {
  FiUser, FiBriefcase, FiBook, FiZap, FiEye,
  FiPlus, FiTrash2, FiArrowLeft, FiArrowRight,
  FiCheck, FiAlertCircle, FiFileText,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const API   = "https://ai-resume-backend-ya4p.onrender.com/api/v1/build";
const STEPS = [
  { label:"Personal",   icon:<FiUser size={15} /> },
  { label:"Experience", icon:<FiBriefcase size={15} /> },
  { label:"Education",  icon:<FiBook size={15} /> },
  { label:"Skills",     icon:<FiZap size={15} /> },
  { label:"Preview",    icon:<FiEye size={15} /> },
];

const css = `
  .builder-wrap { min-height:100vh; padding:48px clamp(16px,4vw,48px) 100px; position:relative; }

  /* Step bar */
  .step-bar { display:flex; align-items:center; margin-bottom:36px; overflow-x:auto; padding-bottom:4px; gap:0; }
  .step-btn {
    display:flex; align-items:center; gap:8px;
    background:none; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    white-space:nowrap; padding:4px 0;
    transition:all .2s;
  }
  .step-circle {
    width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700;
    font-family:'Space Mono',monospace;
    transition:all .3s ease; flex-shrink:0; position:relative;
  }
  .step-circle.done  { background:linear-gradient(135deg,#4f23b8,#7c4ef0); border:2px solid rgba(161,137,255,.4); color:#fff; box-shadow:0 0 16px rgba(97,49,212,.4); }
  .step-circle.active{ background:rgba(14,5,48,.9); border:2px solid #9b77ff; color:#9b77ff; box-shadow:0 0 0 5px rgba(97,49,212,.12), 0 0 20px rgba(97,49,212,.25); }
  .step-circle.idle  { background:rgba(14,5,48,.5); border:2px solid rgba(161,137,255,.15); color:rgba(161,137,255,.35); }
  .step-label { font-size:12px; font-weight:700; letter-spacing:.02em; transition:color .2s; }
  .step-label.active { color:#9b77ff; }
  .step-label.done   { color:#7c4ef0; }
  .step-label.idle   { color:rgba(161,137,255,.3); }
  .step-line { flex:1; height:2px; margin:0 10px; min-width:20px; border-radius:1px; transition:background .4s; }
  .step-line.done   { background:linear-gradient(90deg,#4f23b8,#7c4ef0); }
  .step-line.active { background:linear-gradient(90deg,#4f23b8,rgba(161,137,255,.15)); }
  .step-line.idle   { background:rgba(161,137,255,.08); }

  /* Form card */
  .form-card {
    background:linear-gradient(145deg,rgba(22,10,66,.85),rgba(14,5,48,.92));
    border:1px solid rgba(161,137,255,.12);
    border-radius:24px;
    padding:36px clamp(20px,4vw,40px);
    box-shadow:0 8px 40px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05);
    backdrop-filter:blur(20px);
    position:relative; overflow:hidden;
  }
  .form-card::before {
    content:''; position:absolute; top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(161,137,255,.25),transparent);
  }
  .form-card-gloss {
    position:absolute; top:0;left:0;right:0;height:40%;
    background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.04) 0%,transparent 70%);
    pointer-events:none;
  }

  /* Section title */
  .sec-title-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .sec-title-inner h2 { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:.04em; color:#f0ecff; display:flex; align-items:center; gap:10px; }
  .sec-title-inner p  { color:#7b6fad; font-size:13px; margin-top:4px; }
  .sec-icon { width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px; flex-shrink:0; }

  /* Sub-cards (experience/education blocks) */
  .sub-card {
    background:rgba(14,5,48,.6);
    border:1px solid rgba(161,137,255,.1);
    border-radius:18px; padding:20px 22px;
    position:relative; overflow:hidden;
    transition:border-color .25s;
  }
  .sub-card:hover { border-color:rgba(161,137,255,.22); }
  .sub-card::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,rgba(124,78,240,.3),transparent); }
  .sub-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
  .sub-card-index { font-size:11px; font-weight:700; color:#7c4ef0; font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:.07em; }

  /* Remove btn */
  .btn-remove {
    background:rgba(239,68,68,.1); color:#f87171;
    border:1px solid rgba(239,68,68,.2); border-radius:8px;
    padding:5px 12px; cursor:pointer; font-size:12px; font-weight:700;
    font-family:'Plus Jakarta Sans',sans-serif;
    display:inline-flex;align-items:center;gap:5px;
    transition:all .2s;
  }
  .btn-remove:hover { background:rgba(239,68,68,.2); border-color:rgba(239,68,68,.35); }

  /* Grid helpers */
  .g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:600px){ .g2 { grid-template-columns:1fr !important; } }

  /* Error / info */
  .err-box {
    background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25);
    border-radius:12px; padding:14px 18px;
    color:#f87171; font-size:13px; font-weight:600;
    display:flex; align-items:center; gap:10px; margin-top:16px;
  }

  /* Nav row */
  .nav-row {
    display:flex; justify-content:space-between; align-items:center;
    margin-top:32px; padding-top:24px;
    border-top:1px solid rgba(161,137,255,.1);
    flex-wrap:wrap; gap:12px;
  }

  /* Success header */
  .success-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:32px; flex-wrap:wrap; gap:14px;
  }
  .success-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(26px,4vw,38px); letter-spacing:.04em; color:#f0ecff; }
  .success-sub   { color:#7b6fad; margin-top:5px; font-size:14px; }

  /* Tags hint */
  .hint-text { font-size:11px; color:#7b6fad; margin-top:4px; }

  /* Skills section inner */
  .skills-block {
    background:rgba(14,5,48,.5); border:1px solid rgba(161,137,255,.1);
    border-radius:18px; padding:20px 22px;
  }
  .skills-block-title { font-size:14px; font-weight:700; color:#c4aeff; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
`;

export default function BuilderPage() {
  const [step,     setStep]     = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [resume,   setResume]   = useState(null);

  const [info,     setInfo]     = useState({ name:"",email:"",phone:"",location:"",linkedin:"",portfolio:"" });
  const [summary,  setSummary]  = useState("");
  const [exp,      setExp]      = useState([{ title:"",company:"",duration:"",location:"",bullets:"" }]);
  const [edu,      setEdu]      = useState([{ degree:"",institution:"",year:"",grade:"" }]);
  const [skills,   setSkills]   = useState({ technical:"",tools:"",soft:"" });
  const [projects, setProjects] = useState([{ name:"",description:"",tech:"",link:"" }]);

  const updateExp  = (i,f,v) => setExp(p=>p.map((e,idx)=>idx===i?{...e,[f]:v}:e));
  const updateEdu  = (i,f,v) => setEdu(p=>p.map((e,idx)=>idx===i?{...e,[f]:v}:e));
  const updateProj = (i,f,v) => setProjects(p=>p.map((pr,idx)=>idx===i?{...pr,[f]:v}:pr));

  const handleBuild = async () => {
    if (!info.name || !info.email) return setError("Full name and email are required.");
    setLoading(true); setError("");
    try {
      const payload = {
        personalInfo: info, summary,
        experience: exp.filter(e=>e.title&&e.company).map(e=>({...e,bullets:e.bullets.split("\n").filter(Boolean)})),
        education:  edu.filter(e=>e.degree&&e.institution),
        skills: {
          technical: skills.technical.split(",").map(s=>s.trim()).filter(Boolean),
          tools:     skills.tools.split(",").map(s=>s.trim()).filter(Boolean),
          soft:      skills.soft.split(",").map(s=>s.trim()).filter(Boolean),
        },
        projects: projects.filter(p=>p.name).map(p=>({...p,tech:p.tech.split(",").map(s=>s.trim()).filter(Boolean)}))
      };
      const res  = await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResume(data.resume);
      setStep(4);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // ── Preview ──────────────────────────────────────────────────────────────────
  if (step === 4 && resume) {
    return (
      <div className="builder-wrap">
        <style>{css}</style>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div className="success-header">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4f23b8,#e040fb)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <HiSparkles size={18} color="#fff" />
                </div>
                <p className="success-title">Resume Ready!</p>
              </div>
              <p className="success-sub">AI has crafted your professional, ATS-optimized resume</p>
            </div>
            <button className="btn-ghost" onClick={()=>setStep(0)}>
              <FiArrowLeft size={14} /> Edit Details
            </button>
          </div>
          <ResumePreview resume={resume} onBack={()=>setStep(3)} />
        </div>
      </div>
    );
  }

  // ── Step status helpers ───────────────────────────────────────────────────────
  const stepState = (i) => i < step ? "done" : i === step ? "active" : "idle";

  return (
    <div className="builder-wrap">
      <style>{css}</style>
      <div style={{maxWidth:740,margin:"0 auto"}}>

        {/* Header */}
        <div className="fade-up" style={{marginBottom:36}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{
              width:44,height:44,borderRadius:14,
              background:"linear-gradient(135deg,rgba(79,35,184,.4),rgba(224,64,251,.2))",
              border:"1px solid rgba(161,137,255,.2)",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <FiFileText size={20} color="#9b77ff" />
            </div>
            <div>
              <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,4vw,42px)",letterSpacing:".04em",color:"#f0ecff",lineHeight:1}}>
                Build Your Resume
              </h1>
              <p style={{color:"#7b6fad",fontSize:13,marginTop:2}}>
                AI crafts a polished, ATS-ready resume from your details
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-bar fade-up">
          {STEPS.slice(0,4).map((s,i)=>(
            <React.Fragment key={i}>
              <button
                className="step-btn"
                onClick={()=>{ if(i<=step||resume) setStep(i); }}
              >
                <div className={`step-circle ${stepState(i)}`}>
                  {i < step ? <FiCheck size={14} /> : s.icon}
                </div>
                <span className={`step-label hide-mobile ${stepState(i)}`}>{s.label}</span>
              </button>
              {i < 3 && (
                <div className={`step-line ${i < step ? "done" : i === step ? "active" : "idle"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="form-card fade-up" key={step}>
          <div className="form-card-gloss" />

          {/* ── Step 0: Personal ── */}
          {step===0 && (
            <div style={{display:"flex",flexDirection:"column",gap:22}}>
              <SecTitle
                icon={<FiUser size={18} color="#9b77ff" />}
                iconBg="rgba(97,49,212,.2)"
                title="Personal Information"
                sub="Your contact details and professional identity"
              />
              <div className="g2">
                {[["name","Full Name *"],["email","Email Address *"],["phone","Phone Number"],["location","City, Country"],["linkedin","LinkedIn URL"],["portfolio","Portfolio / GitHub URL"]].map(([k,l])=>(
                  <Field key={k} label={l} value={info[k]} onChange={v=>setInfo(p=>({...p,[k]:v}))}
                    type={l.includes("Email")?"email":"text"}
                  />
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label className="label-sky">Professional Summary <span style={{color:"#7b6fad",fontWeight:400,textTransform:"none",letterSpacing:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>(optional)</span></label>
                <textarea className="input-sky" rows={4}
                  placeholder="e.g. Full-stack engineer with 3 years of MERN experience building scalable SaaS products..."
                  value={summary} onChange={e=>setSummary(e.target.value)}
                />
                <span className="hint-text">✦ Leave blank — AI will write a compelling summary for you</span>
              </div>
            </div>
          )}

          {/* ── Step 1: Experience ── */}
          {step===1 && (
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div className="sec-title-row">
                <SecTitle
                  icon={<FiBriefcase size={18} color="#e040fb" />}
                  iconBg="rgba(224,64,251,.15)"
                  title="Work Experience"
                  sub="Your professional history"
                />
                <button className="btn-ghost" style={{padding:"9px 18px",fontSize:12,animation:"none"}}
                  onClick={()=>setExp(p=>[...p,{title:"",company:"",duration:"",location:"",bullets:""}])}>
                  <FiPlus size={13} /> Add Position
                </button>
              </div>
              {exp.map((e,i)=>(
                <div className="sub-card" key={i}>
                  <div className="sub-card-header">
                    <span className="sub-card-index">Position {String(i+1).padStart(2,"0")}</span>
                    {i>0&&(
                      <button className="btn-remove" onClick={()=>setExp(p=>p.filter((_,idx)=>idx!==i))}>
                        <FiTrash2 size={11} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="g2" style={{marginBottom:14}}>
                    {[["title","Job Title"],["company","Company"],["duration","Duration (e.g. Jan 2022–Present)"],["location","Location / Remote"]].map(([f,l])=>(
                      <Field key={f} label={l} value={e[f]} onChange={v=>updateExp(i,f,v)} />
                    ))}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    <label className="label-sky">Key Achievements <span style={{color:"#7b6fad",fontWeight:400,textTransform:"none",letterSpacing:0,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>(one per line)</span></label>
                    <textarea className="input-sky" rows={4}
                      placeholder={"Led development of a payment module used by 50k+ users\nReduced page load time by 40% via code splitting\nManaged a cross-functional team of 4 engineers"}
                      value={e.bullets} onChange={ev=>updateExp(i,"bullets",ev.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 2: Education ── */}
          {step===2 && (
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div className="sec-title-row">
                <SecTitle
                  icon={<FiBook size={18} color="#00e5cc" />}
                  iconBg="rgba(0,229,204,.12)"
                  title="Education"
                  sub="Academic background and qualifications"
                />
                <button className="btn-ghost" style={{padding:"9px 18px",fontSize:12,animation:"none"}}
                  onClick={()=>setEdu(p=>[...p,{degree:"",institution:"",year:"",grade:""}])}>
                  <FiPlus size={13} /> Add Degree
                </button>
              </div>
              {edu.map((e,i)=>(
                <div className="sub-card" key={i}>
                  <div className="sub-card-header">
                    <span className="sub-card-index">Degree {String(i+1).padStart(2,"0")}</span>
                    {i>0&&(
                      <button className="btn-remove" onClick={()=>setEdu(p=>p.filter((_,idx)=>idx!==i))}>
                        <FiTrash2 size={11} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="g2">
                    {[["degree","Degree / Course"],["institution","University / College"],["year","Graduation Year"],["grade","CGPA / Percentage"]].map(([f,l])=>(
                      <Field key={f} label={l} value={e[f]} onChange={v=>updateEdu(i,f,v)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 3: Skills + Projects ── */}
          {step===3 && (
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <SecTitle
                icon={<FiZap size={18} color="#ffd95a" />}
                iconBg="rgba(255,217,90,.12)"
                title="Skills & Projects"
                sub="Technical stack, tools, and what you've built"
              />

              {/* Skills */}
              <div className="skills-block">
                <div className="skills-block-title">
                  <span style={{fontSize:16}}>🛠</span> Skills
                  <span style={{fontSize:11,color:"#7b6fad",fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>— comma separated</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Field label="Technical Skills" placeholder="React, Node.js, TypeScript, MongoDB, Python..." value={skills.technical} onChange={v=>setSkills(p=>({...p,technical:v}))} />
                  <Field label="Tools & Platforms" placeholder="Git, Docker, AWS, Figma, VS Code, Linux..." value={skills.tools} onChange={v=>setSkills(p=>({...p,tools:v}))} />
                  <Field label="Soft Skills" placeholder="Leadership, Communication, Problem-solving..." value={skills.soft} onChange={v=>setSkills(p=>({...p,soft:v}))} />
                </div>
              </div>

              {/* Projects */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:".04em",color:"#f0ecff",display:"flex",alignItems:"center",gap:8}}>
                  <span>🚀</span> Projects
                </div>
                <button className="btn-ghost" style={{padding:"9px 18px",fontSize:12,animation:"none"}}
                  onClick={()=>setProjects(p=>[...p,{name:"",description:"",tech:"",link:""}])}>
                  <FiPlus size={13} /> Add Project
                </button>
              </div>

              {projects.map((pr,i)=>(
                <div className="sub-card" key={i}>
                  <div className="sub-card-header">
                    <span className="sub-card-index">Project {String(i+1).padStart(2,"0")}</span>
                    {i>0&&(
                      <button className="btn-remove" onClick={()=>setProjects(p=>p.filter((_,idx)=>idx!==i))}>
                        <FiTrash2 size={11} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="g2" style={{marginBottom:14}}>
                    <Field label="Project Name" value={pr.name} onChange={v=>updateProj(i,"name",v)} />
                    <Field label="Live / GitHub URL" value={pr.link} onChange={v=>updateProj(i,"link",v)} placeholder="https://..." />
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <Field label="Description" value={pr.description} onChange={v=>updateProj(i,"description",v)} placeholder="What you built, the problem it solves, impact..." />
                    <Field label="Tech Stack (comma separated)" value={pr.tech} onChange={v=>updateProj(i,"tech",v)} placeholder="React, Node.js, MongoDB, Tailwind..." />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="err-box">
              <FiAlertCircle size={16} /> {error}
            </div>
          )}

          {/* Navigation */}
          <div className="nav-row">
            <button className="btn-ghost" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
              style={{animation:"none"}}>
              <FiArrowLeft size={14} /> Back
            </button>

            {step < 3 ? (
              <button className="btn-primary" onClick={()=>setStep(s=>s+1)}
                style={{minWidth:160,justifyContent:"center"}}>
                Continue <FiArrowRight size={14} />
              </button>
            ) : (
              <button className="btn-primary" onClick={handleBuild} disabled={loading}
                style={{minWidth:200,justifyContent:"center"}}>
                {loading ? (
                  <><span className="spinner" /> Building Resume…</>
                ) : (
                  <><HiSparkles size={15} /> Build My Resume</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Step hint */}
        <p style={{textAlign:"center",marginTop:16,fontSize:11,color:"rgba(161,137,255,.3)",fontFamily:"'Space Mono',monospace",letterSpacing:".05em"}}>
          STEP {step+1} OF 4 — {STEPS[step].label.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SecTitle({ icon, iconBg, title, sub }) {
  return (
    <div className="sec-title-inner" style={{display:"flex",alignItems:"flex-start",gap:12}}>
      <div className="sec-icon" style={{background:iconBg,border:"1px solid rgba(161,137,255,.12)"}}>{icon}</div>
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type="text" }) {
  const isArea = label==="Description" || label.includes("Achievements");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label className="label-sky">{label}</label>
      {isArea ? (
        <textarea
          className="input-sky" rows={3}
          placeholder={placeholder || label.replace(" *","")}
          value={value}
          onChange={e=>onChange(e.target.value)}
        />
      ) : (
        <input
          className="input-sky"
          type={type}
          placeholder={placeholder || label.replace(" *","")}
          value={value}
          onChange={e=>onChange(e.target.value)}
        />
      )}
    </div>
  );
}
