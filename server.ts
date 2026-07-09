import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import cors from "cors";

dotenv.config();

// Initialize Gemini API client safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable Cross-Origin Resource Sharing (CORS)
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
  }));

  // Set higher limits for parsing base64 images
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // API Route: Check configuration status
  app.get("/api/config-status", (req, res) => {
    res.json({
      geminiActive: !!aiClient,
      supabaseActive: !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL !== "MY_SUPABASE_URL"),
      resendActive: !!(process.env.VITE_RESEND_API_KEY && process.env.VITE_RESEND_API_KEY !== ""),
      groqActive: !!(process.env.VITE_GROQ_API_KEY && process.env.VITE_GROQ_API_KEY !== "")
    });
  });

  // API Route: Generate Learning Roadmap
  app.post("/api/ai/generate-roadmap", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      let roadmapData;
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create a comprehensive industry-readiness weekly learning roadmap for someone with this goal: "${prompt}".
Identify missing competencies fresh grads typically have and bridge them with highly practical tasks.

Return the response strictly as a JSON object with this exact structure:
{
  "title": "String (e.g. Full-Stack Developer Roadmap)",
  "tagline": "String summarizing the roadmap purpose",
  "estimatedDuration": "String (e.g. 8 Weeks)",
  "recommendedProjects": [
    {
      "name": "Project Name",
      "description": "Short project description",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Week Topic Focus",
      "topics": ["Topic A", "Topic B"],
      "practicalTask": "A specific mini-project or practical assignment to complete",
      "resources": ["Resource 1 Link/Name", "Resource 2 Link/Name"]
    }
  ]
}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                tagline: { type: Type.STRING },
                estimatedDuration: { type: Type.STRING },
                recommendedProjects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technologies: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["name", "description", "technologies"]
                  }
                },
                weeks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      weekNumber: { type: Type.INTEGER },
                      focus: { type: Type.STRING },
                      topics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      practicalTask: { type: Type.STRING },
                      resources: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["weekNumber", "focus", "topics", "practicalTask", "resources"]
                  }
                }
              },
              required: ["title", "tagline", "estimatedDuration", "recommendedProjects", "weeks"]
            }
          }
        });

        roadmapData = JSON.parse(response.text || "{}");
      } else {
        // Fallback simulation when Gemini is not connected
        roadmapData = {
          title: `${prompt} Industry Roadmap`,
          tagline: "Bridging your academic foundations to production-grade standards.",
          estimatedDuration: "6 Weeks",
          recommendedProjects: [
            {
              name: "SkillBridge Sandbox",
              description: "Build a responsive modular sandbox with persistent state tracking.",
              technologies: ["React", "TailwindCSS", "Node.js"]
            }
          ],
          weeks: [
            {
              weekNumber: 1,
              focus: "Core Fundamentals & Architecture",
              topics: ["System Design", "State management patterns", "API layers and boundaries"],
              practicalTask: "Implement a robust service-based connector for multi-tiered application components.",
              resources: ["MDN Developer Guide", "Vercel System Standards Manual"]
            },
            {
              weekNumber: 2,
              focus: "Database Integrations & Edge Protocols",
              topics: ["PostgreSQL optimization", "Realtime Sync", "Supabase authentication and claims"],
              practicalTask: "Construct a stateful data service with local caching strategies and RLS protections.",
              resources: ["Supabase Architecture Handbook", "PostgreSQL Advanced Queries"]
            }
          ]
        };
      }

      res.json(roadmapData);
    } catch (error: any) {
      console.error("Roadmap generation error:", error);
      res.status(500).json({ error: "Failed to generate learning path: " + error.message });
    }
  });

  // API Route: Generate Interview Questions and Challenges
  app.post("/api/ai/generate-interview", async (req, res) => {
    const { role, difficulty } = req.body;
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const diff = difficulty || "Intermediate";

    try {
      let interviewData;
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create an industry-grade interview preparation pack for the role of "${role}" at a "${diff}" level.
The content should test both theory and deep practical engineering competence to bridge classroom limitations.

Return response strictly as a JSON object with this structure:
{
  "role": "${role}",
  "difficulty": "${diff}",
  "technicalQuestions": [
    {
      "id": "q1",
      "question": "Deep technical question",
      "bestAnswer": "Comprehensive industry-grade answer with code example or theoretical details",
      "topics": ["Topic1", "Topic2"]
    }
  ],
  "behavioralQuestions": [
    {
      "id": "b1",
      "question": "Behavioral/situational question",
      "intent": "What the interviewer is testing",
      "bestApproach": "STAR method guided industry answer outline"
    }
  ],
  "mcqs": [
    {
      "id": "m1",
      "question": "Challenging multiple choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "codingChallenges": [
    {
      "id": "c1",
      "title": "Practical Coding Task",
      "description": "Problem statement and description",
      "inputFormat": "Input details",
      "outputFormat": "Output details",
      "starterCode": "Template code block for candidate",
      "solutionCode": "Optimal solution code block with time/space complexity described"
    }
  ]
}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                technicalQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      bestAnswer: { type: Type.STRING },
                      topics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["id", "question", "bestAnswer", "topics"]
                  }
                },
                behavioralQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      intent: { type: Type.STRING },
                      bestApproach: { type: Type.STRING }
                    },
                    required: ["id", "question", "intent", "bestApproach"]
                  }
                },
                mcqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING }
                    },
                    required: ["id", "question", "options", "correctIndex", "explanation"]
                  }
                },
                codingChallenges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      inputFormat: { type: Type.STRING },
                      outputFormat: { type: Type.STRING },
                      starterCode: { type: Type.STRING },
                      solutionCode: { type: Type.STRING }
                    },
                    required: ["id", "title", "description", "starterCode", "solutionCode"]
                  }
                }
              },
              required: ["role", "difficulty", "technicalQuestions", "behavioralQuestions", "mcqs", "codingChallenges"]
            }
          }
        });

        interviewData = JSON.parse(response.text || "{}");
      } else {
        // Fallback mock prep pack
        interviewData = {
          role,
          difficulty: diff,
          technicalQuestions: [
            {
              id: "t-1",
              question: "Explain the virtual DOM and reconciliation algorithm in your framework of choice, detailing why direct DOM manipulations are bypassed.",
              bestAnswer: "Virtual DOM acts as an in-memory representation of UI elements. Reconciliation performs diffs on state changes to execute batch updates, bypassing expensive paint loops on physical nodes.",
              topics: ["Reconciliation", "DOM Perf", "React Framework"]
            }
          ],
          behavioralQuestions: [
            {
              id: "b-1",
              question: "Describe a project scenario where team scope expanded mid-sprint. How did you adapt your engineering deliverables?",
              intent: "Assessing prioritization and resource negotiation skills under stress.",
              bestApproach: "Utilize the STAR framework (Situation, Task, Action, Result) focusing on scoping matrices, transparent communications, and visual tracking."
            }
          ],
          mcqs: [
            {
              id: "m-1",
              question: "Which hook should be applied to prevent unnecessary deep re-evaluations of complex functional values in high-frequency renders?",
              options: ["useEffect", "useMemo", "useRef", "useCallback"],
              correctIndex: 1,
              explanation: "useMemo caches computed values based on primitives listed in dependency arrays, preventing redundant execution cycles."
            }
          ],
          codingChallenges: [
            {
              id: "c-1",
              title: "Optimal Array Partitioning",
              description: "Given a non-empty array of integers, partition the elements into balanced sub-arrays with minimal cumulative standard deviation.",
              starterCode: "function partitionArray(arr) {\n  // Write code here\n  return [];\n}",
              solutionCode: "function partitionArray(arr) {\n  // Optimized DP Solution\n  arr.sort((a,b) => a-b);\n  return [arr.slice(0, arr.length/2), arr.slice(arr.length/2)];\n}"
            }
          ]
        };
      }

      res.json(interviewData);
    } catch (error: any) {
      console.error("Interview generation error:", error);
      res.status(500).json({ error: "Failed to generate interview pack: " + error.message });
    }
  });

  // API Route: Evaluate Interview Responses
  app.post("/api/ai/evaluate-interview", async (req, res) => {
    const { qaList } = req.body;
    if (!qaList || !Array.isArray(qaList)) {
      return res.status(400).json({ error: "qaList array is required" });
    }

    try {
      let evaluationResult;
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `You are an elite lead systems engineer, technical interviewer, and behavioral grader.
Appraise this list of questions and candidate answers:
${JSON.stringify(qaList, null, 2)}

Provide a thorough critique of technical correctness, systems awareness, and STAR alignment.

Return response strictly as a JSON object with this exact structure:
{
  "score": 82, // Integer from 0 to 100
  "feedback": "Overall summary feedback block detailing core strengths and structural weaknesses",
  "critiques": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ]
}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                feedback: { type: Type.STRING },
                critiques: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["score", "feedback", "critiques"]
            }
          }
        });

        evaluationResult = JSON.parse(response.text || "{}");
      } else {
        // Fallback simulation when Gemini is not connected
        evaluationResult = {
          score: 75,
          feedback: "Great foundational understanding of systems. Work on explaining structural trade-offs in high-frequency cache invalidation.",
          critiques: [
            "Quantify past project scale by mentioning connection volumes or load percentiles.",
            "Explain DB index degradations with concrete references to B-Trees."
          ]
        };
      }

      res.json(evaluationResult);
    } catch (error: any) {
      console.error("Interview evaluation error:", error);
      res.status(500).json({ error: "Failed to evaluate interview answers: " + error.message });
    }
  });

  // API Route: Analyze Resume, Certificate, or Notes (Vision API simulation or fallback)
  app.post("/api/ai/analyze-file", async (req, res) => {
    const { fileData, mimeType, analysisType } = req.body; // base64 payload
    if (!fileData) {
      return res.status(400).json({ error: "Base64 file data is required" });
    }

    try {
      let analysisResult;
      if (aiClient) {
        // We can pass the file directly to Gemini!
        const imagePart = {
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: fileData
          }
        };

        const textPrompt = {
          text: `You are an expert technical recruiter, ATS scanner, and academic-to-industry transition advisor.
Analyze this uploaded file (which is a ${analysisType || 'Resume/Certificate/Study Notes'}).

Provide a comprehensive critique, highlighting skills, technical gaps compared to high-paying modern tech roles, specific ATS suggestions, and recommended actions.

Return the response strictly as a JSON object with this exact structure:
{
  "extractedName": "String (e.g. Candidate Name or Document Title)",
  "detectedCategory": "String (e.g. Resume, Certificate, Notes)",
  "summary": "Short professional summary of findings",
  "skills": ["Skill 1", "Skill 2"],
  "gaps": ["Competency Gap 1", "Competency Gap 2"],
  "atsScore": 75, // Integer from 0 to 100
  "atsRecommendations": [
    "ATS advice 1 (e.g., format, keyword density)",
    "ATS advice 2"
  ],
  "careerSuggestions": [
    "Specific career paths to target",
    "Actions to bridge gaps"
  ]
}`
        };

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [imagePart, textPrompt] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                extractedName: { type: Type.STRING },
                detectedCategory: { type: Type.STRING },
                summary: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                atsScore: { type: Type.INTEGER },
                atsRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                careerSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["extractedName", "detectedCategory", "summary", "skills", "gaps", "atsScore", "atsRecommendations", "careerSuggestions"]
            }
          }
        });

        analysisResult = JSON.parse(response.text || "{}");
      } else {
        // High-quality fallback analysis when no Gemini key is set
        analysisResult = {
          extractedName: "Aspirant Portfolio",
          detectedCategory: "Technical Document / Resume",
          summary: "Demonstrates strong foundational academic structures. Minor adjustments required in terms of modern industrial framework deployments and tooling.",
          skills: ["Data Structures", "Database Management", "Core Java/Python", "Object Oriented Design"],
          gaps: ["Production Deployment CI/CD", "State Management (Redux/Context)", "Relational Schema Migrations", "Real-world Project Collaborations"],
          atsScore: 68,
          atsRecommendations: [
            "Revise headers: Replace verbose coursework descriptions with project-based impact metrics.",
            "Incorporate strong action-verbs like 'Engineered', 'Orchestrated', and 'Provisioned' instead of 'Learned' or 'Helped'."
          ],
          careerSuggestions: [
            "Target Junior Full-Stack/Backend Roles with specialized node layers.",
            "Complete a comprehensive end-to-end sandbox project detailing Supabase/Firebase integrations to exhibit system integration capacity."
          ]
        };
      }

      res.json(analysisResult);
    } catch (error: any) {
      console.error("Vision file analysis error:", error);
      res.status(500).json({ error: "Failed to perform vision-guided file analysis: " + error.message });
    }
  });

  // API Route: Send Resend Email proxy (or mock log if credentials are empty)
  app.post("/api/email/send", async (req, res) => {
    const { to, subject, bodyType, data } = req.body;
    const recipient = to || "sanketr980@gmail.com";
    const resendKey = process.env.VITE_RESEND_API_KEY;

    // Resend sandbox/testing mode constraints:
    // Can only send to own verified email address. If recipient is not sanketr980@gmail.com,
    // we redirect it to sanketr980@gmail.com so delivery succeeds instead of throwing 403.
    let finalRecipient = recipient;
    let redirectNoticeHtml = "";
    if (resendKey && recipient.toLowerCase() !== "sanketr980@gmail.com") {
      finalRecipient = "sanketr980@gmail.com";
      redirectNoticeHtml = `
        <div style="background-color: #fef3c7; color: #b45309; padding: 12px; border: 1px solid #fcd34d; border-radius: 6px; font-size: 13px; margin-bottom: 20px; font-family: sans-serif;">
          <strong>Sandbox Notice:</strong> This message was originally addressed to <code>${recipient}</code>, but was routed to your verified Resend email address (<code>sanketr980@gmail.com</code>) to prevent API authorization errors in sandbox mode.
        </div>
      `;
    }

    console.log(`[Resend Email Triggered] To: ${finalRecipient} (originally: ${recipient}), Subject: ${subject}, Type: ${bodyType}`);
    
    let contentHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 4px;">SkillBridge AI</h2>
        <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 24px;">Bridging Academia and Industry</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
        ${redirectNoticeHtml}
    `;

    if (bodyType === "welcome") {
      contentHtml += `
        <h3>Welcome to SkillBridge AI, ${data?.name || "Learner"}!</h3>
        <p>Your journey from academic foundations to industrial coding excellence has begun. Get ready to bridge the gap!</p>
        <ul>
          <li><strong>Personalized AI Roadmaps</strong> to direct your studies.</li>
          <li><strong>Production-ready Projects</strong> to populate your portfolio.</li>
          <li><strong>Simulated Technical Interviews</strong> with automatic grading.</li>
        </ul>
        <p>Click below to open your customized console and build your future:</p>
        <a href="#" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">Get Started</a>
      `;
    } else if (bodyType === "milestone") {
      contentHtml += `
        <h3>🎉 Milestone Unlocked!</h3>
        <p>Excellent progress! You have completed the milestone: <strong>"${data?.milestoneName || "Skill Achievement"}"</strong>.</p>
        <p>Your readiness index has climbed to <strong>${data?.newScore || "82"}%</strong>. Industry recruiters actively seek candidates displaying this rapid skill-acquisition coefficient.</p>
        <p>Keep pushing! The next recommendation is waiting in your dashboard.</p>
      `;
    } else if (bodyType === "interview") {
      contentHtml += `
        <h3>⏳ Upcoming Prep Reminder</h3>
        <p>Hi ${data?.name || "Student"}, your simulated technical screening for <strong>"${data?.role || "Software Engineer"}"</strong> is scheduled.</p>
        <p>Set aside 45 minutes of quiet time to tackle behavioral screenings, MCQ diagnostics, and the sandbox coding console.</p>
        <p>Practice makes permanent. Bridge your fears today.</p>
      `;
    } else if (bodyType === "analytics") {
      contentHtml += `
        <h3 style="color: #4f46e5;">📊 Your SkillBridge AI Readiness Report</h3>
        <p>Hi there,</p>
        <p>We have compiled your latest career-readiness and technical competence assessment metrics from your <strong>SkillBridge AI Readiness Hub</strong>. Here is your current profile status:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #cbd5e1;">
                <th style="padding: 10px 5px; font-weight: bold; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Performance Metric</th>
                <th style="padding: 10px 5px; font-weight: bold; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Current Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Completed Skills</td>
                <td style="padding: 12px 5px; font-size: 14px; color: #0f172a; text-align: right; font-weight: bold;">${data?.completedSkills ?? 0}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Average Skill Progress</td>
                <td style="padding: 12px 5px; font-size: 14px; color: #4f46e5; text-align: right; font-weight: bold;">${data?.averageSkillProgress ?? 0}%</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Built Repositories / Projects</td>
                <td style="padding: 12px 5px; font-size: 14px; color: #7c3aed; text-align: right; font-weight: bold;">${data?.totalProjects ?? 0}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Approved Certificates</td>
                <td style="padding: 12px 5px; font-size: 14px; color: #0891b2; text-align: right; font-weight: bold;">${data?.totalCertificates ?? 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p>Keep up the amazing momentum as you bridge your way from academia to industry standards! Continue completing learning roadmap weeks, taking simulated technical mock screenings, and solving sandbox coding challenges to maximize your placement profile.</p>
      `;
    } else {
      contentHtml += `
        <h3>Notification from SkillBridge</h3>
        <p>${data?.message || "You have a new update waiting in your dashboard."}</p>
      `;
    }

    contentHtml += `
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 32px; margin-bottom: 16px;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">SkillBridge AI Inc. &bull; sanketr980@gmail.com</p>
      </div>
    `;

    try {
      if (resendKey && resendKey !== "") {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`
          },
          body: JSON.stringify({
            from: "SkillBridge AI <onboarding@resend.dev>",
            to: finalRecipient,
            subject: subject || "SkillBridge Update",
            html: contentHtml
          })
        });

        if (response.ok) {
          const resJson = await response.json();
          return res.json({ success: true, message: "Real email sent successfully!", id: resJson.id });
        } else {
          const errText = await response.text();
          console.warn("[Resend Sandbox Log] Delivery restriction message:", errText);
          return res.json({ success: false, message: "Resend returned restriction response, logged email locally.", content: contentHtml });
        }
      } else {
        // Log locally to terminal console
        console.log(`[Email Mock Sent] content preview below:\n${contentHtml}`);
        return res.json({ 
          success: true, 
          mocked: true, 
          message: "Email simulated successfully (logged inside development terminal). Configure VITE_RESEND_API_KEY in .env for real emails.",
          content: contentHtml
        });
      }
    } catch (err: any) {
      console.warn("[Resend Warning] Email channel error:", err);
      res.status(500).json({ error: "Email channel warning: " + err.message });
    }
  });

  // Vite middleware for dev mode, or static file serving for prod mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkillBridge Server] Server running on http://localhost:${PORT}`);
  });
}

startServer();
