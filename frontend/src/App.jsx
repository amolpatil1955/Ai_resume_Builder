import React,{ useState, useEffect, useRef } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import HomePage from "./pages/Home.jsx";
import BuilderPage from "./pages/ResumeBuilder.jsx";
import ATSPage from "./pages/ATSChecker.jsx";
import AuthModal from "./components/authmodel.jsx";

// ─── THREE.JS PARTICLE BACKGROUND ─────────────────────────────────────────────
function ThreeBackground() {
  const mountRef = useRef(null);
  useEffect(() => {
    let animId;
    const init = async () => {
      const THREE = await import("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
      if (!mountRef.current) return;
      const W = window.innerWidth, H = window.innerHeight;
      const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
      renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, W/H, 0.1, 1000);
      camera.position.z = 28;
      const count = W < 768 ? 55 : 100;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count*3);
      const vel = [];
      for (let i=0;i<count;i++){
        pos[i*3]=(Math.random()-.5)*70; pos[i*3+1]=(Math.random()-.5)*50; pos[i*3+2]=(Math.random()-.5)*20;
        vel.push({x:(Math.random()-.5)*.015, y:(Math.random()-.5)*.015});
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
      const dotMat = new THREE.PointsMaterial({color:0x0ea5e9,size:0.28,transparent:true,opacity:0.45});
      const dots = new THREE.Points(geo,dotMat); scene.add(dots);
      const lineMat = new THREE.LineBasicMaterial({color:0x7dd3fc,transparent:true,opacity:0.12});
      let lines;
      const buildLines=()=>{
        if(lines) scene.remove(lines);
        const lpts=[];
        for(let i=0;i<count;i++) for(let j=i+1;j<count;j++){
          const dx=pos[i*3]-pos[j*3],dy=pos[i*3+1]-pos[j*3+1],dz=pos[i*3+2]-pos[j*3+2];
          if(Math.sqrt(dx*dx+dy*dy+dz*dz)<11) lpts.push(pos[i*3],pos[i*3+1],pos[i*3+2],pos[j*3],pos[j*3+1],pos[j*3+2]);
        }
        const lg=new THREE.BufferGeometry();
        lg.setAttribute("position",new THREE.BufferAttribute(new Float32Array(lpts),3));
        lines=new THREE.LineSegments(lg,lineMat); scene.add(lines);
      };
      [14,20,27].forEach((r,i)=>{
        const m=new THREE.Mesh(new THREE.TorusGeometry(r,.05,8,100),new THREE.MeshBasicMaterial({color:0xbae6fd,transparent:true,opacity:.05+i*.02}));
        m.rotation.x=1.1+i*.3; m.rotation.z=i*.5; m.position.set(i*8-8,i*3-3,-15); scene.add(m);
      });
      let frame=0;
      const animate=()=>{
        frame++;
        for(let i=0;i<count;i++){
          pos[i*3]+=vel[i].x; pos[i*3+1]+=vel[i].y;
          if(Math.abs(pos[i*3])>35) vel[i].x*=-1;
          if(Math.abs(pos[i*3+1])>25) vel[i].y*=-1;
        }
        geo.attributes.position.needsUpdate=true;
        if(frame%4===0) buildLines();
        dots.rotation.y+=.0003;
        renderer.render(scene,camera);
        animId=requestAnimationFrame(animate);
      };
      buildLines(); animate();
      const onResize=()=>{const W=window.innerWidth,H=window.innerHeight;renderer.setSize(W,H);camera.aspect=W/H;camera.updateProjectionMatrix();};
      window.addEventListener("resize",onResize);
      mountRef.current._cleanup=()=>{window.removeEventListener("resize",onResize);cancelAnimationFrame(animId);renderer.dispose();};
    };
    init();
    return ()=>{if(mountRef.current?._cleanup) mountRef.current._cleanup();};
  },[]);
  return <div ref={mountRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}} />;
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, onProtectedNav }) {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  const go=(p)=>{
    setOpen(false);
    if(p==="home"){setPage("home");return;}
    if(!isSignedIn){onProtectedNav(p);return;}
    setPage(p);
  };

  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,height:64,
        padding:"0 clamp(16px,4vw,40px)",
        background:scrolled?"rgba(255,255,255,0.96)":"rgba(240,249,255,0.75)",
        backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
        borderBottom:`1px solid ${scrolled?"#bae6fd":"transparent"}`,
        transition:"all 0.3s ease",
        display:"flex",alignItems:"center",justifyContent:"space-between"
      }}>
        <button onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer"}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#0284c7,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(2,132,199,0.3)",fontSize:16,color:"white"}}>✦</div>
          <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:20,fontWeight:800,color:"#0c4a6e",letterSpacing:"-0.03em"}}>
            Resume.<span style={{color:"#0284c7"}}>AI</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div style={{display:"flex",gap:4,alignItems:"center"}} className="hide-mobile">
          {[["home","Home"],["builder","✍ Build Resume"],["ats","📊 ATS Checker"]].map(([p,l])=>(
            <button key={p} onClick={()=>go(p)} style={{
              padding:"8px 18px",borderRadius:10,border:"none",cursor:"pointer",
              fontSize:14,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",
              background:page===p?"linear-gradient(135deg,#0284c7,#0ea5e9)":"transparent",
              color:page===p?"white":"#0369a1",
              boxShadow:page===p?"0 4px 12px rgba(2,132,199,0.25)":"none",
              transition:"all 0.2s", position:"relative"
            }}
              onMouseEnter={e=>{if(page!==p)e.currentTarget.style.background="#e0f2fe";}}
              onMouseLeave={e=>{if(page!==p)e.currentTarget.style.background="transparent";}}
            >
              {l}
              {(p==="builder"||p==="ats")&&!isSignedIn&&(
                <span style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:"#f59e0b",border:"2px solid white"}} />
              )}
            </button>
          ))}
          <div style={{marginLeft:8}}>
            {isSignedIn
              ? <UserButton afterSignOutUrl="/" />
              : <button className="btn-sky" style={{padding:"8px 20px",fontSize:14}} onClick={()=>onProtectedNav("builder")}>Sign In</button>
            }
          </div>
        </div>

        <button onClick={()=>setOpen(!open)} className="show-mobile" style={{background:"none",border:"1.5px solid #bae6fd",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:"#0284c7",fontSize:18}}>
          {open?"✕":"☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open&&(
        <div style={{position:"fixed",top:64,left:0,right:0,zIndex:999,background:"rgba(255,255,255,0.98)",backdropFilter:"blur(20px)",borderBottom:"1px solid #e0f2fe",padding:"16px 20px",display:"flex",flexDirection:"column",gap:4}}>
          {[["home","🏠 Home"],["builder","✍ Build Resume"],["ats","📊 ATS Checker"]].map(([p,l])=>(
            <button key={p} onClick={()=>go(p)} style={{padding:"12px 16px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",background:page===p?"#e0f2fe":"transparent",color:page===p?"#0284c7":"#0c4a6e",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              {l}
              {(p==="builder"||p==="ats")&&!isSignedIn&&<span style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>🔒 Login required</span>}
            </button>
          ))}
          <div style={{padding:"8px 0",borderTop:"1px solid #e0f2fe",marginTop:4}}>
            {isSignedIn
              ? <UserButton />
              : <button className="btn-sky" style={{width:"100%",justifyContent:"center"}} onClick={()=>{setOpen(false);onProtectedNav("builder");}}>Sign In / Sign Up</button>
            }
          </div>
        </div>
      )}
    </>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [authModal, setAuthModal] = useState({open:false, redirectTo:"builder"});
  const { isSignedIn } = useUser();

  const onProtectedNav=(redirectTo)=>setAuthModal({open:true, redirectTo});
  const onAuthSuccess=()=>{setAuthModal({open:false,redirectTo:"builder"});setPage(authModal.redirectTo);};

  return (
    <div style={{minHeight:"100vh",background:"#f0f9ff"}}>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f0f9ff;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#f0f9ff;}::-webkit-scrollbar-thumb{background:#7dd3fc;border-radius:3px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes scoreIn{from{stroke-dashoffset:283;}}
        @keyframes slideRight{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.93) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
        .fade-up{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;}
        .fade-in{animation:fadeIn 0.4s ease both;}
        .float{animation:float 4s ease-in-out infinite;}
        .btn-sky{background:linear-gradient(135deg,#0284c7,#0ea5e9);color:white;border:none;border-radius:12px;padding:12px 26px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 4px 16px rgba(2,132,199,0.25);display:inline-flex;align-items:center;gap:8px;}
        .btn-sky:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(2,132,199,0.4);}
        .btn-sky:active{transform:translateY(0);}
        .btn-sky:disabled{opacity:0.45;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
        .btn-outline{background:white;color:#0284c7;border:1.5px solid #bae6fd;border-radius:12px;padding:11px 22px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.25s;font-family:'Plus Jakarta Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;}
        .btn-outline:hover{background:#f0f9ff;border-color:#0284c7;box-shadow:0 4px 16px rgba(2,132,199,0.12);transform:translateY(-1px);}
        .input-sky{width:100%;padding:12px 16px;border:1.5px solid #e0f2fe;border-radius:12px;font-size:14px;color:#0c4a6e;background:white;outline:none;transition:all 0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .input-sky:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(2,132,199,0.08);}
        .input-sky::placeholder{color:#94a3b8;}
        textarea.input-sky{resize:vertical;min-height:88px;line-height:1.6;}
        .card-white{background:white;border:1px solid #e0f2fe;border-radius:20px;padding:24px;box-shadow:0 2px 20px rgba(14,165,233,0.06);transition:box-shadow 0.3s;}
        .card-white:hover{box-shadow:0 6px 32px rgba(14,165,233,0.1);}
        .spinner{width:20px;height:20px;border-radius:50%;border:2.5px solid #bae6fd;border-top-color:#0284c7;animation:spin 0.7s linear infinite;display:inline-block;flex-shrink:0;}
        .badge{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:'JetBrains Mono',monospace;}
        .badge-sky{background:#e0f2fe;color:#0284c7;}
        .badge-green{background:#dcfce7;color:#16a34a;}
        .badge-red{background:#fee2e2;color:#dc2626;}
        .badge-yellow{background:#fef9c3;color:#ca8a04;}
        .badge-blue{background:#dbeafe;color:#2563eb;}
        .label-sky{display:block;font-size:12px;font-weight:600;color:#0369a1;margin-bottom:6px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.04em;}
        .section-block{display:flex;flex-direction:column;gap:6px;}
        .hide-mobile{display:flex;}
        .show-mobile{display:none;}
        @media(max-width:768px){
          .hide-mobile{display:none!important;}
          .show-mobile{display:flex!important;}
          .grid-2{grid-template-columns:1fr!important;}
          .card-white{padding:16px!important;border-radius:16px!important;}
        }
      `}</style>

      <ThreeBackground />
      <Navbar page={page} setPage={setPage} onProtectedNav={onProtectedNav} />

      <div style={{position:"relative",zIndex:1,paddingTop:64}}>
        {page==="home"    && <HomePage setPage={setPage} onProtectedNav={onProtectedNav} />}
        {page==="builder" && <BuilderPage />}
        {page==="ats"     && <ATSPage />}
      </div>

      {authModal.open && <AuthModal redirectTo={authModal.redirectTo} onClose={()=>setAuthModal({open:false,redirectTo:"builder"})} onSuccess={onAuthSuccess} />}
    </div>
  );
}