import React,{ useRef } from "react";

export default function ResumePreview({ resume, onBack }) {
  const ref = useRef();

  const downloadPDF = async () => {
    const btn = document.getElementById("dl-btn");
    if(btn) { btn.textContent = "⏳ Generating..."; btn.disabled = true; }

    try {
      const html2pdf = (await import("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js")).default
        || window.html2pdf;

      if (!html2pdf && !window.html2pdf) {
        // Fallback: open print dialog
        const w = window.open("","_blank");
        w.document.write(buildHTMLString(resume));
        w.document.close();
        w.onload = () => setTimeout(()=>w.print(), 300);
        return;
      }

      const fn = window.html2pdf || html2pdf;
      await fn().set({
        margin: 0,
        filename: `${resume.personalInfo?.name?.replace(/\s+/g,"_")||"resume"}_Resume.pdf`,
        image: { type:"jpeg", quality:0.98 },
        html2canvas: { scale:2, useCORS:true, backgroundColor:"#ffffff" },
        jsPDF: { unit:"mm", format:"a4", orientation:"portrait" }
      }).from(ref.current).save();
    } catch(e) {
      const w = window.open("","_blank");
      w.document.write(buildHTMLString(resume));
      w.document.close();
      w.onload = () => setTimeout(()=>w.print(), 300);
    } finally {
      if(btn) { btn.textContent = "⬇ Download PDF (A4)"; btn.disabled = false; }
    }
  };

  const { personalInfo:p, summary, experience, education, skills, projects } = resume;
  const allSkills = [...(skills?.technical||[]), ...(skills?.tools||[]), ...(skills?.soft||[])];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center" }}>
      {/* Controls */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", width:"100%" }}>
        {onBack && (
          <button className="btn-outline" onClick={onBack}>← Back to Form</button>
        )}
        <button id="dl-btn" className="btn-sky" onClick={downloadPDF}>⬇ Download PDF (A4)</button>
      </div>

      {/* A4 Preview */}
      <div style={{ width:"100%", overflowX:"auto", display:"flex", justifyContent:"center" }}>
        <div
          ref={ref}
          id="resume-pdf-content"
          style={{
            width:"210mm", minHeight:"297mm",
            background:"white", color:"#1a1a2e",
            fontFamily:"'Georgia', 'Times New Roman', serif",
            padding:"14mm 16mm", fontSize:"10.5pt",
            lineHeight:1.55, boxSizing:"border-box",
            boxShadow:"0 8px 40px rgba(14,165,233,0.12)",
            borderRadius:8
          }}
        >
          {/* Header */}
          <div style={{ borderBottom:"2.5px solid #0284c7", paddingBottom:14, marginBottom:18 }}>
            <h1 style={{ fontFamily:"Arial,sans-serif", fontSize:"24pt", fontWeight:800, color:"#0c4a6e", margin:0, letterSpacing:"-0.02em" }}>
              {p?.name}
            </h1>
            <div style={{ display:"flex", flexWrap:"wrap", gap:14, marginTop:6, fontSize:"9.5pt", color:"#555" }}>
              {p?.email && <span>✉ {p.email}</span>}
              {p?.phone && <span>📞 {p.phone}</span>}
              {p?.location && <span>📍 {p.location}</span>}
              {p?.linkedin && <span>🔗 {p.linkedin}</span>}
              {p?.portfolio && <span>🌐 {p.portfolio}</span>}
            </div>
          </div>

          {summary && <PdfSection title="Professional Summary"><p style={{color:"#333",fontSize:"10pt",lineHeight:1.7}}>{summary}</p></PdfSection>}

          {experience?.length > 0 && (
            <PdfSection title="Experience">
              {experience.map((e,i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <strong style={{fontFamily:"Arial,sans-serif",fontSize:"11pt",color:"#0c4a6e"}}>{e.title}</strong>
                    <span style={{fontSize:"9pt",color:"#777",fontFamily:"monospace",whiteSpace:"nowrap",marginLeft:8}}>{e.duration}</span>
                  </div>
                  <div style={{fontSize:"9.5pt",color:"#0284c7",marginBottom:4}}>{e.company}{e.location?` · ${e.location}`:""}</div>
                  <ul style={{paddingLeft:18,margin:0}}>
                    {(e.bullets||[]).map((b,j)=><li key={j} style={{fontSize:"9.5pt",color:"#333",marginBottom:2}}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </PdfSection>
          )}

          {projects?.length>0 && projects[0]?.name && (
            <PdfSection title="Projects">
              {projects.map((pr,i)=>(
                <div key={i} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <strong style={{fontFamily:"Arial,sans-serif",fontSize:"10.5pt",color:"#0c4a6e"}}>{pr.name}</strong>
                    {pr.link&&<span style={{fontSize:"8.5pt",color:"#0284c7"}}>{pr.link}</span>}
                  </div>
                  <p style={{fontSize:"9.5pt",color:"#333",margin:"2px 0"}}>{pr.description}</p>
                  {pr.tech?.length>0&&<div style={{fontSize:"8.5pt",color:"#555"}}>Tech: {pr.tech.join(" · ")}</div>}
                </div>
              ))}
            </PdfSection>
          )}

          {allSkills.length > 0 && (
            <PdfSection title="Skills">
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {allSkills.map((s,i)=>(
                  <span key={i} style={{background:"#e0f2fe",color:"#0284c7",padding:"2px 10px",borderRadius:20,fontSize:"9pt",fontFamily:"monospace"}}>{s}</span>
                ))}
              </div>
            </PdfSection>
          )}

          {education?.length>0 && (
            <PdfSection title="Education">
              {education.map((ed,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <strong style={{fontFamily:"Arial,sans-serif",fontSize:"10.5pt",color:"#0c4a6e"}}>{ed.degree}</strong>
                    <div style={{fontSize:"9.5pt",color:"#0284c7"}}>{ed.institution}{ed.grade?` · ${ed.grade}`:""}</div>
                  </div>
                  <span style={{fontSize:"9pt",color:"#777",fontFamily:"monospace"}}>{ed.year}</span>
                </div>
              ))}
            </PdfSection>
          )}
        </div>
      </div>
    </div>
  );
}

function PdfSection({ title, children }) {
  return (
    <div style={{marginBottom:16}}>
      <h2 style={{
        fontFamily:"Arial,sans-serif", fontSize:"10pt", fontWeight:700,
        textTransform:"uppercase", letterSpacing:"0.1em", color:"#0284c7",
        borderBottom:"1px solid #e0f2fe", paddingBottom:4, marginBottom:8, marginTop:0
      }}>{title}</h2>
      {children}
    </div>
  );
}

function buildHTMLString(resume) {
  const { personalInfo:p, summary, experience, education, skills, projects } = resume;
  const allSkills = [...(skills?.technical||[]), ...(skills?.tools||[]), ...(skills?.soft||[])];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;padding:40px 48px;max-width:800px;margin:auto;}
  h1{font-size:26px;font-weight:800;color:#0c4a6e;margin-bottom:6px;}
  .contact{display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#555;margin-bottom:18px;padding-bottom:14px;border-bottom:2.5px solid #0284c7;}
  .sec{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#0284c7;border-bottom:1px solid #e0f2fe;padding-bottom:4px;margin:16px 0 10px;}
  .jh{display:flex;justify-content:space-between;} .jt{font-weight:700;font-size:14px;} .jd{font-size:11px;color:#777;font-family:monospace;}
  .jc{color:#0284c7;font-size:12px;margin-bottom:5px;}
  ul{padding-left:18px;} li{margin-bottom:2px;font-size:12px;color:#333;}
  .sk{display:flex;flex-wrap:wrap;gap:6px;} .stag{background:#e0f2fe;color:#0284c7;padding:2px 10px;border-radius:20px;font-size:11px;font-family:monospace;}
</style></head><body>
<h1>${p?.name||""}</h1>
<div class="contact">
  ${p?.email?`<span>✉ ${p.email}</span>`:""}
  ${p?.phone?`<span>📞 ${p.phone}</span>`:""}
  ${p?.location?`<span>📍 ${p.location}</span>`:""}
  ${p?.linkedin?`<span>${p.linkedin}</span>`:""}
  ${p?.portfolio?`<span>${p.portfolio}</span>`:""}
</div>
${summary?`<div class="sec">Summary</div><p style="font-size:13px;color:#333;line-height:1.7">${summary}</p>`:""}
${experience?.length?`<div class="sec">Experience</div>${experience.map(e=>`<div style="margin-bottom:14px"><div class="jh"><span class="jt">${e.title}</span><span class="jd">${e.duration||""}</span></div><div class="jc">${e.company||""}${e.location?` · ${e.location}`:""}</div><ul>${(e.bullets||[]).map(b=>`<li>${b}</li>`).join("")}</ul></div>`).join("")}`:""}
${education?.length?`<div class="sec">Education</div>${education.map(ed=>`<div style="margin-bottom:10px"><div class="jh"><span class="jt">${ed.degree}</span><span class="jd">${ed.year||""}</span></div><div class="jc">${ed.institution||""}${ed.grade?` · ${ed.grade}`:""}</div></div>`).join("")}`:""}
${allSkills.length?`<div class="sec">Skills</div><div class="sk">${allSkills.map(s=>`<span class="stag">${s}</span>`).join("")}</div>`:""}
${projects?.length&&projects[0]?.name?`<div class="sec">Projects</div>${projects.map(pr=>`<div style="margin-bottom:12px"><strong style="font-size:13px">${pr.name}${pr.link?` <span style="font-size:11px;color:#0284c7">${pr.link}</span>`:""}</strong><p style="font-size:12px;color:#444;margin:3px 0">${pr.description||""}</p><div class="sk" style="margin-top:4px">${(pr.tech||[]).map(t=>`<span class="stag">${t}</span>`).join("")}</div></div>`).join("")}`:""}
</body></html>`;
}