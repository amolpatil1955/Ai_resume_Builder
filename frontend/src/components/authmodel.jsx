import { SignIn } from "@clerk/clerk-react";
import React, { useEffect } from "react";

export default function AuthModal({ onClose, redirectTo }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(13,0,24,0.55)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:scale(.95) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(91,33,182,.18), 0 8px 24px rgba(0,0,0,.08)",
          overflow: "hidden",
          width: "100%", maxWidth: 440,
          position: "relative",
          animation: "modalIn 0.32s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "#f5f3ff", border: "1px solid #ede9fe",
            cursor: "pointer", color: "#7c3aed",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
          onMouseLeave={e => e.currentTarget.style.background = "#f5f3ff"}
        >✕</button>

        {/* Clerk SignIn — full width, no extra chrome */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignIn
            routing="hash"
            afterSignInUrl="/"
            afterSignUpUrl="/"
            appearance={{
              layout: { socialButtonsVariant: "iconButton", logoPlacement: "none" },
              variables: {
                colorPrimary: "#5b21b6",
                colorText: "#0d0018",
                colorTextSecondary: "#6b7280",
                colorBackground: "#ffffff",
                colorInputBackground: "#fafafa",
                colorInputText: "#0d0018",
                borderRadius: "12px",
                fontFamily: "'Outfit', sans-serif",
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-purple-200 hover:bg-purple-50",
                formButtonPrimary: "bg-violet-700 hover:bg-violet-800",
                footerAction: "text-violet-700",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}