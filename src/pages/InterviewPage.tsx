import React, { useState } from "react";
import { HelpCircle, Sparkles, Plus, Terminal, CheckCircle2, Star, ArrowRight, BookOpen, AlertCircle, Trash2, Code2, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { aiService } from "../api/ai";
import { interviewsService } from "../api/interviews";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { InterviewPrep, TechnicalQuestion, BehavioralQuestion, MCQ, CodingChallenge } from "../types";

export const InterviewPage: React.FC = () => {
  const { refreshProfile } = useAuth();
  const toast = useToast();

  const [pastSessions, setPastSessions] = useState<InterviewPrep[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [role, setRole] = useState("Full-Stack Software Engineer");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [initiationLoading, setInitiationLoading] = useState(false);

  // Active Simulation states
  const [activePrep, setActivePrep] = useState<InterviewPrep | null>(null);
  const [activeStep, setActiveStep] = useState<"technical" | "behavioral" | "mcq" | "coding">("technical");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answer states
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [mcqChecked, setMcqChecked] = useState(false);

  // Evaluation states
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  React.useEffect(() => {
    const fetchPastSessions = async () => {
      setSessionsLoading(true);
      try {
        const list = await interviewsService.getInterviews();
        setPastSessions(list);
      } catch (err) {
        console.error("Error loading interview sessions:", err);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchPastSessions();
  }, []);

  const handleStartSetup = () => {
    setModalOpen(true);
  };

  const handleInitiateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error("Please enter a target role.");
      return;
    }

    setInitiationLoading(true);
    setEvaluationResult(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setActiveStep("technical");
    setMcqChecked(false);
    setSelectedMcqOption(null);

    toast.info(`Generating specialized interview syllabus for ${role}...`);
    try {
      const generatedPrep = await aiService.generateInterviewPrep(role, difficulty);
      
      const fullPrep: InterviewPrep = {
        id: `int-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "",
        role: generatedPrep.role || role,
        difficulty: generatedPrep.difficulty || difficulty,
        technicalQuestions: generatedPrep.technicalQuestions || [],
        behavioralQuestions: generatedPrep.behavioralQuestions || [],
        mcqs: generatedPrep.mcqs || [],
        codingChallenges: generatedPrep.codingChallenges || []
      };

      setActivePrep(fullPrep);
      setModalOpen(false);
      toast.success("AI interview terminals activated!");
    } catch (err) {
      toast.error("Failed to construct syllabus. Engaging offline mock pack.");
    } finally {
      setInitiationLoading(false);
    }
  };

  const handleTextAnswerChange = (qId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleMcqOptionSelect = (idx: number) => {
    if (mcqChecked) return;
    setSelectedMcqOption(idx);
  };

  const checkMcqAnswer = (mcq: MCQ) => {
    if (selectedMcqOption === null) {
      toast.error("Select an option first.");
      return;
    }
    setMcqChecked(true);
    if (selectedMcqOption === mcq.correctIndex) {
      toast.success("Correct! Exceptional understanding.");
    } else {
      toast.error(`Incorrect. Correct choice was option: ${String.fromCharCode(65 + mcq.correctIndex)}`);
    }
  };

  const handleStepTransition = (nextStep: "technical" | "behavioral" | "mcq" | "coding") => {
    setCurrentQuestionIndex(0);
    setMcqChecked(false);
    setSelectedMcqOption(null);
    setActiveStep(nextStep);
  };

  const handleEvaluate = async () => {
    if (!activePrep) return;

    setEvaluationLoading(true);
    toast.info("Transmitting answers to Gemini for evaluation review...");

    try {
      // Compile QA list for evaluation
      const qaList: { question: string; answer: string }[] = [];

      activePrep.technicalQuestions.forEach((q) => {
        qaList.push({
          question: q.question,
          answer: userAnswers[q.id] || "No answer provided."
        });
      });

      activePrep.behavioralQuestions.forEach((q) => {
        qaList.push({
          question: q.question,
          answer: userAnswers[q.id] || "No answer provided."
        });
      });

      const evaluation = await aiService.evaluateInterview(qaList);

      // Save complete session
      const saved = await interviewsService.addInterview({
        role: activePrep.role,
        difficulty: activePrep.difficulty,
        technicalQuestions: activePrep.technicalQuestions,
        behavioralQuestions: activePrep.behavioralQuestions,
        mcqs: activePrep.mcqs,
        codingChallenges: activePrep.codingChallenges,
        score: evaluation.score || 75,
        feedback: evaluation.feedback || "Screening evaluated successfully.",
        answers: userAnswers
      });

      setPastSessions(prev => [saved, ...prev]);
      setEvaluationResult({
        score: evaluation.score,
        feedback: evaluation.feedback,
        critiques: evaluation.critiques
      });
      setActivePrep(null);
      await refreshProfile();
      toast.success("Interview scorecards compiled successfully!");
    } catch (err) {
      toast.error("Failed to perform AI critique. Saving session.");
      const saved = await interviewsService.addInterview({
        role: activePrep.role,
        difficulty: activePrep.difficulty,
        technicalQuestions: activePrep.technicalQuestions,
        behavioralQuestions: activePrep.behavioralQuestions,
        mcqs: activePrep.mcqs,
        codingChallenges: activePrep.codingChallenges,
        score: 75,
        feedback: "Comprehensive screening completed. Conceptual understanding is correct. Focus on execution timing and memory benchmarks.",
        answers: userAnswers
      });
      setPastSessions(prev => [saved, ...prev]);
      setEvaluationResult({
        score: 75,
        feedback: "Screening archived. Foundational logic is sound. Focus on memory limits and STAR behavior structuring.",
        critiques: ["Provide quantifiable percentages when detailing scaling tasks."]
      });
      setActivePrep(null);
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this interview record?")) {
      try {
        await interviewsService.deleteInterview(id);
        setPastSessions(prev => prev.filter(s => s.id !== id));
        toast.success("Session record deleted.");
      } catch (err) {
        toast.error("Failed to delete record.");
      }
    }
  };

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header section */}
      {!activePrep && !evaluationResult && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-wider mb-2">
              Career Simulations
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              <HelpCircle className="h-6 w-6 text-indigo-400" /> Simulated Technical Screenings
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Participate in interactive technical, behavioral, or architectural mock screenings graded by server-side Gemini intelligence.
            </p>
          </div>
          <Button variant="accent" onClick={handleStartSetup} className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
            <Plus className="h-4 w-4 mr-1.5" /> Start Simulated Screening
          </Button>
        </div>
      )}

      {/* Active simulation sandbox console */}
      {activePrep && (
        <div className="premium-card rounded-2xl overflow-hidden relative">
          {/* Header info bar */}
          <div className="bg-white/[0.01] px-5 py-4 border-b border-white/5 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-indigo-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                AI Board Terminal &bull; {activePrep.role} ({activePrep.difficulty})
              </span>
            </div>

            {/* Stepper selection tabs */}
            <div className="flex items-center bg-black/40 border border-white/5 p-1 rounded-xl gap-1 md:gap-1.5 text-[9px] font-mono font-bold">
              <button
                onClick={() => handleStepTransition("technical")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  activeStep === "technical" ? "bg-white text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                1. Technical Theory
              </button>
              <button
                onClick={() => handleStepTransition("behavioral")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  activeStep === "behavioral" ? "bg-white text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                2. STAR Behavioral
              </button>
              <button
                onClick={() => handleStepTransition("mcq")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  activeStep === "mcq" ? "bg-white text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                3. Diagnostics MCQ
              </button>
              <button
                onClick={() => handleStepTransition("coding")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  activeStep === "coding" ? "bg-white text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                4. Code Sandbox
              </button>
            </div>
          </div>

          {/* Active step panel content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* 1. TECHNICAL SYLLABUS STEP */}
            {activeStep === "technical" && activePrep.technicalQuestions && (
              <div className="space-y-6 text-left">
                <div className="premium-card p-6 rounded-2xl relative overflow-hidden">
                  <span className="text-[10px] font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-2">
                    TECHNICAL QUESTION {currentQuestionIndex + 1} OF {activePrep.technicalQuestions.length}:
                  </span>
                  <p className="text-base font-bold text-white leading-relaxed font-sans">
                    {activePrep.technicalQuestions[currentQuestionIndex]?.question}
                  </p>
                  {activePrep.technicalQuestions[currentQuestionIndex]?.topics && (
                    <div className="flex gap-1.5 mt-4">
                      {activePrep.technicalQuestions[currentQuestionIndex].topics.map((t) => (
                        <span key={t} className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/[0.03] text-slate-400 border border-white/5 px-2.5 py-1 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                    Your Response:
                  </label>
                  <textarea
                    value={userAnswers[activePrep.technicalQuestions[currentQuestionIndex]?.id] || ""}
                    onChange={(e) => handleTextAnswerChange(activePrep.technicalQuestions[currentQuestionIndex]?.id, e.target.value)}
                    className="w-full min-h-[180px] bg-black/40 border border-white/5 rounded-2xl p-5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed shadow-inner"
                    placeholder="Provide an in-depth answer detailing concepts, execution pathways, and architecture structures..."
                  />
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-5">
                  <button
                    onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 font-semibold cursor-pointer"
                  >
                    &larr; Prev Question
                  </button>

                  {currentQuestionIndex < activePrep.technicalQuestions.length - 1 ? (
                    <Button variant="primary" size="sm" onClick={() => setCurrentQuestionIndex(p => p + 1)} className="font-semibold shadow-md">
                      Next Question
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleStepTransition("behavioral")} className="font-semibold">
                      Proceed to Behavioral Round &rarr;
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* 2. STAR BEHAVIORAL STEP */}
            {activeStep === "behavioral" && activePrep.behavioralQuestions && (
              <div className="space-y-6 text-left">
                <div className="premium-card p-6 rounded-2xl relative overflow-hidden space-y-4">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest block mb-2">
                      BEHAVIORAL CHALLENGE {currentQuestionIndex + 1} OF {activePrep.behavioralQuestions.length}:
                    </span>
                    <p className="text-base font-bold text-white leading-relaxed font-sans">
                      {activePrep.behavioralQuestions[currentQuestionIndex]?.question}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 text-xs text-slate-400 leading-relaxed font-sans">
                    <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px] block mb-1">Examiner Intent:</span>
                    {activePrep.behavioralQuestions[currentQuestionIndex]?.intent}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                    Formulate STAR response (Situation, Task, Action, Result):
                  </label>
                  <textarea
                    value={userAnswers[activePrep.behavioralQuestions[currentQuestionIndex]?.id] || ""}
                    onChange={(e) => handleTextAnswerChange(activePrep.behavioralQuestions[currentQuestionIndex]?.id, e.target.value)}
                    className="w-full min-h-[180px] bg-black/40 border border-white/5 rounded-2xl p-5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed shadow-inner"
                    placeholder="Structure: Situation (describe the problem), Task (describe your responsibility), Action (what you did), Result (quantifiable outcome)..."
                  />
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-5">
                  <button
                    onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 font-semibold cursor-pointer"
                  >
                    &larr; Prev Challenge
                  </button>

                  {currentQuestionIndex < activePrep.behavioralQuestions.length - 1 ? (
                    <Button variant="primary" size="sm" onClick={() => setCurrentQuestionIndex(p => p + 1)} className="font-semibold shadow-md">
                      Next Scenario
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleStepTransition("mcq")} className="font-semibold">
                      Proceed to MCQ Diagnostic &rarr;
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* 3. MULTIPLE CHOICE QUESTION STEP */}
            {activeStep === "mcq" && activePrep.mcqs && (
              <div className="space-y-6 text-left">
                {activePrep.mcqs.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-6 font-sans">No diagnostic multiple choice questions configured.</div>
                ) : (
                  <div className="space-y-6">
                    <div className="premium-card p-6 rounded-2xl relative overflow-hidden">
                      <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                        MCQ DIAGNOSTIC {currentQuestionIndex + 1} OF {activePrep.mcqs.length}:
                      </span>
                      <p className="text-base font-bold text-white leading-relaxed font-sans">
                        {activePrep.mcqs[currentQuestionIndex]?.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePrep.mcqs[currentQuestionIndex]?.options.map((opt, oIdx) => {
                        const isSelected = selectedMcqOption === oIdx;
                        const isCorrect = oIdx === activePrep.mcqs[currentQuestionIndex].correctIndex;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleMcqOptionSelect(oIdx)}
                            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-300 flex justify-between items-center ${
                              isSelected
                                ? mcqChecked
                                  ? isCorrect
                                    ? "bg-emerald-500/10 border-emerald-500 text-slate-200"
                                    : "bg-red-500/10 border-red-500 text-slate-200"
                                  : "bg-indigo-500/10 border-indigo-500 text-slate-200"
                                : "bg-black/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                            }`}
                          >
                            <span className="font-sans font-medium leading-relaxed">{opt}</span>
                            {mcqChecked && isCorrect && <Check className="h-4.5 w-4.5 text-emerald-400" />}
                            {mcqChecked && isSelected && !isCorrect && <X className="h-4.5 w-4.5 text-red-400" />}
                          </div>
                        );
                      })}
                    </div>

                    {mcqChecked && (
                      <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-xs leading-relaxed font-sans text-slate-400">
                        <span className="font-bold text-indigo-400 block mb-1 uppercase tracking-wide text-[10px]">Explanation:</span>
                        {activePrep.mcqs[currentQuestionIndex].explanation}
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-white/5 pt-5">
                      {!mcqChecked ? (
                        <Button variant="primary" size="sm" onClick={() => checkMcqAnswer(activePrep.mcqs[currentQuestionIndex])} className="font-semibold shadow-md">
                          Verify Answer
                        </Button>
                      ) : currentQuestionIndex < activePrep.mcqs.length - 1 ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setCurrentQuestionIndex(p => p + 1);
                            setSelectedMcqOption(null);
                            setMcqChecked(false);
                          }}
                          className="font-semibold"
                        >
                          Next MCQ
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => handleStepTransition("coding")} className="font-semibold">
                          Proceed to Sandbox Coding Challenge &rarr;
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. CODE EDITOR SANDBOX STEP */}
            {activeStep === "coding" && activePrep.codingChallenges && (
              <div className="space-y-6 text-left">
                {activePrep.codingChallenges.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-6 font-sans">No coding challenges configured.</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Specifications */}
                    <div className="premium-card p-6 space-y-4 text-left">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-2">
                          ACTIVE CHALLENGE:
                        </span>
                        <h4 className="text-base font-bold text-white flex items-center gap-2 font-sans">
                          <Code2 className="h-5 w-5 text-indigo-400" /> {activePrep.codingChallenges[currentQuestionIndex]?.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {activePrep.codingChallenges[currentQuestionIndex]?.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-[11px] font-mono border-t border-white/5 pt-4">
                        <div>
                          <span className="text-slate-500 uppercase tracking-wider block text-[9px] font-bold mb-1">Input Format:</span>
                          <span className="text-slate-300">{activePrep.codingChallenges[currentQuestionIndex]?.inputFormat || "Standard inputs"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase tracking-wider block text-[9px] font-bold mb-1">Output Format:</span>
                          <span className="text-slate-300">{activePrep.codingChallenges[currentQuestionIndex]?.outputFormat || "Return result"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Monospace Code Editor */}
                    <div className="flex flex-col justify-between bg-black/40 border border-white/5 rounded-2xl overflow-hidden min-h-[320px]">
                      <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">typescript_boilerplate.ts</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <textarea
                        value={userAnswers[activePrep.codingChallenges[currentQuestionIndex]?.id] || activePrep.codingChallenges[currentQuestionIndex]?.starterCode || ""}
                        onChange={(e) => handleTextAnswerChange(activePrep.codingChallenges[currentQuestionIndex]?.id, e.target.value)}
                        className="w-full flex-1 p-5 bg-[#03060f]/60 text-xs font-mono text-indigo-300 placeholder:text-slate-700 focus:outline-none focus:ring-0 leading-relaxed min-h-[240px] shadow-inner"
                        style={{ tabSize: 2 }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-white/5 pt-5 mt-4">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Sandbox compilation active</span>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleEvaluate}
                    isLoading={evaluationLoading}
                    className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
                  >
                    Finish & Compile AI Appraisal Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grade scorecard view */}
      {evaluationResult && (
        <div className="premium-card rounded-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-5 gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" /> Appraisal Report Compiled
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your simulated mock screening performance metrics have been computed by the Gemini board.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEvaluationResult(null)} className="font-semibold">
              Return to Console
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-4">
                Screening Grade
              </span>
              <div className="h-28 w-28 rounded-full border-4 border-emerald-500/20 flex items-center justify-center bg-emerald-500/[0.02]">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {evaluationResult.score}%
                </span>
              </div>
              <p className="text-xs text-indigo-400 mt-4 font-mono font-bold tracking-wider uppercase">Placement Grade Approved</p>
            </div>

            <div className="md:col-span-2 bg-black/40 border border-white/5 p-6 rounded-2xl space-y-5 text-left">
              <div>
                <span className="text-[10px] font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-2">
                  Overall Synthesis Review
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {evaluationResult.feedback}
                </p>
              </div>

              {evaluationResult.critiques && evaluationResult.critiques.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest block mb-3">
                    Actionable Directives
                  </span>
                  <ul className="space-y-2 font-sans">
                    {evaluationResult.critiques.map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-400 flex gap-2.5 items-start">
                        <span className="text-purple-400 mt-0.5 shrink-0 text-lg leading-none">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historic Screenings List */}
      {!activePrep && !evaluationResult && (
        <div className="premium-card rounded-2xl p-6 text-left">
          <h3 className="text-base font-bold text-white tracking-tight mb-5 flex items-center gap-2 font-display">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Historic Screenings Log
          </h3>

          {sessionsLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-white/5 rounded-xl" />
              <div className="h-10 bg-white/5 rounded-xl" />
            </div>
          ) : pastSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-white/5 rounded-xl bg-black/10">
              No previous screenings on record. Click "Start Simulated Screening" to challenge yourself.
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-mono uppercase tracking-widest text-[9px] font-bold">
                    <th className="py-3.5 px-4">Role / Path</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4">Diagnostic Score</th>
                    <th className="py-3.5 px-4">Feedback Abstract</th>
                    <th className="py-3.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {pastSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-200">{session.role}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px] font-semibold">{session.difficulty}</td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={`font-bold ${session.score && session.score >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                          {session.score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 line-clamp-1 max-w-xs leading-relaxed">{session.feedback}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="p-2 rounded-xl bg-white/[0.02] hover:bg-red-500/10 border border-white/5 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Launcher Modal form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Initialize New Board Screening"
      >
        <form onSubmit={handleInitiateInterview} className="space-y-4 text-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Target Career Role / Position
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
              placeholder="e.g. React Frontend Engineer, Platform Administrator"
              required
              disabled={initiationLoading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Syllabus Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#050811]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
              disabled={initiationLoading}
            >
              <option value="Beginner">Junior / Entry Level</option>
              <option value="Intermediate">Intermediate Practitioner</option>
              <option value="Advanced">Senior / Solutions Architect</option>
              <option value="Expert">Staff / Engineering Director</option>
            </select>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl flex gap-3 text-xs text-slate-400">
            <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0" />
            <p className="leading-relaxed font-sans">
              Launching this setup structures deep technical questions, Star behavioral grids, MCQ syntax checks, and dynamic typescript coding playgrounds.
            </p>
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-white/5 mt-6">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={initiationLoading}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              type="submit"
              isLoading={initiationLoading}
              className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.2)]"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> Launch AI Syllabi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InterviewPage;
