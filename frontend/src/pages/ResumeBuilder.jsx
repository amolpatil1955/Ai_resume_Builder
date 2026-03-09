import React,{ useState } from "react";
import ResumePreview from "../components/ResumePreview.jsx";

const API = "http://localhost:5000/api/v1/build";
const STEPS = ["Personal Info","Experience","Education","Skills & Projects","Preview"];

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);

  const [info, setInfo] = useState({ name:"", email:"", phone:"", location:"", linkedin:"", portfolio:"" });
  const [summary, setSummary] = useState("");
  const [exp, setExp] = useState([{ title:"", company:"", duration:"", location:"", bullets:"" }]);
  const [edu, setEdu] = useState([{ degree:"", institution:"", year:"", grade:"" }]);
  const [skills, setSkills] = useState({ technical:"", tools:"", soft:"" });
  const [projects, setProjects] = useState([{ name:"", description:"", tech:"", link:"" }]);

  const updateExp = (i,f,v) => setExp(p=>p.map((e,idx)=>idx===i?{...e,[f]:v}:e));
  const updateEdu = (i,f,v) => setEdu(p=>p.map((e,idx)=>idx===i?{...e,[f]:v}:e));
  const updateProj = (i,f,v) => setProjects(p=>p.map((pr,idx)=>idx===i?{...pr,[f]:v}:pr));

  const handleBuild = async () => {
    if (!info.name || !info.email) return setError("Name aur email required hai!");
    setLoading(true); setError("");
    try {
      const payload = {
        personalInfo: info, summary,
        experience: exp.filter(e=>e.title&&e.company).map(e=>({...e, bullets:e.bullets.split("\n").filter(Boolean)})),
        education: edu.filter(e=>e.degree&&e.institution),
        skills: {
          technical: skills.technical.split(",").map(s=>s.trim()).filter(Boolean),
          tools: skills.tools.split(",").map(s=>s.trim()).filter(Boolean),
          soft: skills.soft.split(",").map(s=>s.trim()).filter(Boolean),
        },
        projects: projects.filter(p=>p.name).map(p=>({...p, tech:p.tech.split(",").map(s=>s.trim()).filter(Boolean)}))
      };
      const res = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResume(data.resume);
      setStep(4);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (step === 4 && resume) {
    return (
      <div style={{ minHeight:"100vh", padding:"40px clamp(16px,4vw,48px) 80px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, fontWeight:800, color:"#0c4a6e" }}>🎉 Your Resume is Ready!</h1>
              <p style={{ color:"#0369a1", marginTop:4 }}>AI has crafted your professional resume</p>
            </div>
            <button className="btn-outline" onClick={()=>setStep(0)}>← Edit Details</button>
          </div>
          <ResumePreview resume={resume} onBack={()=>setStep(3)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", padding:"40px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth:720, margin:"0 auto" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom:36 }}>
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:800, color:"#0c4a6e", letterSpacing:"-0.03em" }}>
            Build Your Resume
          </h1>
          <p style={{ color:"#0369a1", marginTop:8, fontSize:15 }}>AI will craft a polished, ATS-friendly resume from your details</p>
        </div>

        {/* Step Indicator */}
        <div className="fade-up" style={{ display:"flex", alignItems:"center", marginBottom:32, overflowX:"auto", paddingBottom:4 }}>
          {STEPS.slice(0,4).map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", flex: i<3?1:"auto" }}>
              <button
                onClick={()=>{ if(i<=step||resume) setStep(i); }}
                style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", flexShrink:0 }}
              >
                <div style={{
                  width:34, height:34, borderRadius:"50%",
                  background: i<step?"#0284c7": i===step?"white":"white",
                  border: i<=step?"2px solid #0284c7":"2px solid #bae6fd",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
                  color: i<step?"white":i===step?"#0284c7":"#94a3b8",
                  boxShadow: i===step?"0 0 0 4px rgba(2,132,199,0.12)":"none",
                  transition:"all 0.3s"
                }}>
                  {i<step ? "✓" : i+1}
                </div>
                <span className="hide-mobile" style={{ fontSize:13, fontWeight:600, color:i===step?"#0284c7":i<step?"#0284c7":"#94a3b8", whiteSpace:"nowrap" }}>{s}</span>
              </button>
              {i<3&&<div style={{ flex:1, height:2, background:i<step?"#0284c7":"#e0f2fe", margin:"0 8px", minWidth:16, transition:"background 0.3s", borderRadius:1 }} />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card-white fade-up" key={step}>

          {/* Step 0: Personal Info */}
          {step===0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <SectionTitle icon="👤" title="Personal Information" sub="Basic contact details" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }} className="grid-2">
                {[["name","Full Name *"],["email","Email *"],["phone","Phone"],["location","City, Country"],["linkedin","LinkedIn URL"],["portfolio","Portfolio URL"]].map(([k,l])=>(
                  <Field key={k} label={l} value={info[k]} onChange={v=>setInfo(p=>({...p,[k]:v}))} />
                ))}
              </div>
              <div className="section-block">
                <label className="label-sky">Professional Summary (optional)</label>
                <textarea className="input-sky" rows={4} placeholder="e.g. Full-stack developer with 2 years of MERN experience..." value={summary} onChange={e=>setSummary(e.target.value)} />
                <span style={{ fontSize:11, color:"#94a3b8" }}>Leave blank — AI will write a great summary for you</span>
              </div>
            </div>
          )}

          {/* Step 1: Experience */}
          {step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <SectionTitle icon="💼" title="Work Experience" sub="Your work history" />
                <button className="btn-outline" style={{ padding:"8px 16px", fontSize:13 }} onClick={()=>setExp(p=>[...p,{title:"",company:"",duration:"",location:"",bullets:""}])}>+ Add</button>
              </div>
              {exp.map((e,i)=>(
                <div key={i} style={{ background:"#f8faff", border:"1px solid #e0f2fe", borderRadius:16, padding:"16px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#0284c7", fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>Position {i+1}</span>
                    {i>0&&<button onClick={()=>setExp(p=>p.filter((_,idx)=>idx!==i))} style={{ background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:12, fontWeight:600 }}>Remove</button>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }} className="grid-2">
                    {[["title","Job Title"],["company","Company"],["duration","Duration (e.g. Jan 2022 - Present)"],["location","Location / Remote"]].map(([f,l])=>(
                      <Field key={f} label={l} value={e[f]} onChange={v=>updateExp(i,f,v)} />
                    ))}
                  </div>
                  <div className="section-block">
                    <label className="label-sky">Key Achievements (one per line)</label>
                    <textarea className="input-sky" rows={4} placeholder={"• Led development of payment module\n• Reduced load time by 40%\n• Managed team of 3 developers"} value={e.bullets} onChange={ev=>updateExp(i,"bullets",ev.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Education */}
          {step===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <SectionTitle icon="🎓" title="Education" sub="Academic background" />
                <button className="btn-outline" style={{ padding:"8px 16px", fontSize:13 }} onClick={()=>setEdu(p=>[...p,{degree:"",institution:"",year:"",grade:""}])}>+ Add</button>
              </div>
              {edu.map((e,i)=>(
                <div key={i} style={{ background:"#f8faff", border:"1px solid #e0f2fe", borderRadius:16, padding:"16px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#0284c7", fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>Degree {i+1}</span>
                    {i>0&&<button onClick={()=>setEdu(p=>p.filter((_,idx)=>idx!==i))} style={{ background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:12, fontWeight:600 }}>Remove</button>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }} className="grid-2">
                    {[["degree","Degree / Course"],["institution","University / College"],["year","Graduation Year"],["grade","CGPA / Percentage"]].map(([f,l])=>(
                      <Field key={f} label={l} value={e[f]} onChange={v=>updateEdu(i,f,v)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Skills + Projects */}
          {step===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              <SectionTitle icon="⚡" title="Skills & Projects" sub="Technical skills and projects" />

              {/* Skills */}
              <div style={{ background:"#f8faff", border:"1px solid #e0f2fe", borderRadius:16, padding:"16px 20px" }}>
                <div style={{ fontWeight:700, color:"#0c4a6e", marginBottom:14, fontSize:15 }}>🛠 Skills <span style={{ fontSize:12, color:"#94a3b8", fontWeight:400 }}>(comma separated)</span></div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <Field label="Technical Skills" placeholder="React, Node.js, MongoDB, TypeScript..." value={skills.technical} onChange={v=>setSkills(p=>({...p,technical:v}))} />
                  <Field label="Tools & Platforms" placeholder="Git, Docker, AWS, Figma, VS Code..." value={skills.tools} onChange={v=>setSkills(p=>({...p,tools:v}))} />
                  <Field label="Soft Skills" placeholder="Leadership, Communication, Problem-solving..." value={skills.soft} onChange={v=>setSkills(p=>({...p,soft:v}))} />
                </div>
              </div>

              {/* Projects */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontWeight:700, color:"#0c4a6e", fontSize:15 }}>🚀 Projects</span>
                <button className="btn-outline" style={{ padding:"8px 16px", fontSize:13 }} onClick={()=>setProjects(p=>[...p,{name:"",description:"",tech:"",link:""}])}>+ Add</button>
              </div>
              {projects.map((pr,i)=>(
                <div key={i} style={{ background:"#f8faff", border:"1px solid #e0f2fe", borderRadius:16, padding:"16px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#0284c7", fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>Project {i+1}</span>
                    {i>0&&<button onClick={()=>setProjects(p=>p.filter((_,idx)=>idx!==i))} style={{ background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:12, fontWeight:600 }}>Remove</button>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }} className="grid-2">
                    <Field label="Project Name" value={pr.name} onChange={v=>updateProj(i,"name",v)} />
                    <Field label="Live / GitHub URL" value={pr.link} onChange={v=>updateProj(i,"link",v)} placeholder="https://..." />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <Field label="Description" value={pr.description} onChange={v=>updateProj(i,"description",v)} placeholder="Brief description of what you built..." />
                    <Field label="Tech Stack (comma separated)" value={pr.tech} onChange={v=>updateProj(i,"tech",v)} placeholder="React, Node.js, MongoDB..." />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"12px 16px", color:"#dc2626", fontSize:14, marginTop:8 }}>
              ⚠ {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, paddingTop:20, borderTop:"1px solid #e0f2fe" }}>
            <button className="btn-outline" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Back</button>
            {step<3
              ? <button className="btn-sky" onClick={()=>setStep(s=>s+1)}>Continue →</button>
              : <button className="btn-sky" onClick={handleBuild} disabled={loading} style={{ minWidth:180, justifyContent:"center" }}>
                  {loading?<><span className="spinner"/>Building Resume...</>:"🚀 Build My Resume"}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom:4 }}>
      <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:20, fontWeight:700, color:"#0c4a6e", display:"flex", alignItems:"center", gap:8 }}>
        <span>{icon}</span>{title}
      </h2>
      {sub && <p style={{ color:"#64748b", fontSize:13, marginTop:3 }}>{sub}</p>}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  const isTextarea = label==="Description" || label==="Key Achievements (one per line)";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label className="label-sky">{label}</label>
      {isTextarea
        ? <textarea className="input-sky" rows={3} placeholder={placeholder||label.replace(" *","")} value={value} onChange={e=>onChange(e.target.value)} />
        : <input className="input-sky" type={label.includes("Email")?"email":"text"} placeholder={placeholder||label.replace(" *","")} value={value} onChange={e=>onChange(e.target.value)} />
      }
    </div>
  );
}