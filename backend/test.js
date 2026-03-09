// API Test File
// Pehle server chalu karo: node server.js
// Phir alag terminal mein: node apiTest.js

async function testResumeAnalyzer() {
  try {
    console.log("Testing Resume Analyzer API...\n");

    const response = await fetch("http://localhost:5000/api/resume/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText: `
          John Doe
          Software Engineer
          Email: john@gmail.com | Phone: 123-456-7890
          
          SUMMARY
          2 years of experience in web development using React, Node.js, and MongoDB.
          Built multiple full-stack applications and REST APIs.
          
          EXPERIENCE
          Junior Developer - ABC Tech (2022-2024)
          - Built REST APIs using Node.js and Express
          - Developed frontend using React.js
          - Used MongoDB for database management
          
          SKILLS
          JavaScript, React, Node.js, MongoDB, Express, Git, HTML, CSS
          
          EDUCATION
          B.Tech Computer Science - XYZ University (2022)
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data.error);
      return;
    }

    console.log("✅ API Working!\n");
    console.log("📊 ATS Score:", data.analysis.atsScore + "/100");
    console.log("\n📝 Overall Feedback:", data.analysis.overallFeedback);
    console.log("\n💪 Strengths:");
    data.analysis.strengths.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    console.log("\n⚠️  Weaknesses:");
    data.analysis.weaknesses.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
    console.log("\n🔧 Improvements:");
    data.analysis.improvements.forEach((imp, i) => console.log(`  ${i + 1}. ${imp}`));
    console.log("\n🔑 Missing Keywords:", data.analysis.missingKeywords.join(", "));
    console.log("\n🪙 Tokens Used:", data.tokensUsed);

  } catch (err) {
    console.error("❌ Error:", err.message);
    console.log("💡 Tip: Pehle server chalu karo — node server.js");
  }
}

testResumeAnalyzer();