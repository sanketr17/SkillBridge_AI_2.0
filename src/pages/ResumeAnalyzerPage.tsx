import React, { useState, useRef } from "react";
import { FileSearch, Sparkles, UploadCloud, CheckCircle2, AlertTriangle, Eye, RefreshCw } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useToast } from "../hooks/useToast";
import { visionService } from "../api/vision";
import { Button } from "../components/ui/Button";

export const ResumeAnalyzerPage: React.FC = () => {
  const { analyses, addAnalysis } = useDashboard();
  const toast = useToast();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setSelectedFile(file);
        toast.success(`Loaded ${file.name} successfully.`);
      } else {
        toast.error("Please drop a PDF document or a resume snapshot (PNG/JPEG).");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast.success(`Loaded ${file.name}.`);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    toast.info("Parsing document margins. Aligning ATS standards...");

    try {
      // Simulate file to base64 conversion
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        try {
          const report = await visionService.analyzeFile(base64Data, selectedFile.type, "Resume");
          
          addAnalysis(report);
          setActiveAnalysis(report);
          toast.success("Document critique finalized successfully! View scorecard.");
        } catch (err) {
          toast.error("Failed to generate Vision critique. Falling back to structured simulation.");
          const fallbackReport = {
            id: `anl-${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            extractedName: selectedFile.name,
            atsScore: 74,
            summary: "Overall strong resume. Your education credentials match junior requirements perfectly.",
            gaps: [
              "Vague action verbs (e.g. 'Responsible for' instead of 'Authored' or 'Orchestrated')",
              "Missing specific metrics demonstrating SaaS deployment values"
            ],
            skills: ["Kubernetes", "TypeScript", "Unit Testing", "CI/CD Pipelines"],
            atsRecommendations: [
              "Original: Worked on frontend features with React. Suggestion: Orchestrated responsive client portals utilizing React 19 and Redux, accelerating loading throughput by 14%."
            ],
            careerSuggestions: ["Junior Developer"]
          };
          addAnalysis(fallbackReport);
          setActiveAnalysis(fallbackReport);
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setAnalyzing(false);
      toast.error("Error reading file.");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setActiveAnalysis(null);
  };

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header section */}
      {!activeAnalysis && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/15 text-[10px] text-cyan-300 font-mono font-bold uppercase tracking-wider mb-2">
              ATS Vision Parser
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              <FileSearch className="h-6 w-6 text-cyan-400" /> ATS Document Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Upload study drafts or resumes. Get instant layout diagnostics, verb appraisals, and exact industry keyword gaps mapped by Gemini Vision.
            </p>
          </div>
        </div>
      )}

      {/* Main interactive upload panel */}
      {!activeAnalysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Uploader Box */}
          <div className="lg:col-span-2 premium-card rounded-2xl p-6 flex flex-col justify-between group">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1 font-sans">Upload Document</h3>
              <p className="text-xs text-slate-400 mb-6 font-sans">Drop PDFs or images (resume snapshot, certificate) up to 5MB.</p>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                  dragActive
                    ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                    : selectedFile
                    ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf,image/*"
                  className="hidden"
                />

                {selectedFile ? (
                  <>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-3 shadow-md animate-pulse">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-white truncate max-w-xs font-sans">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready to Analyze
                    </span>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-black/40 border border-white/5 text-slate-500 rounded-full mb-3 shadow-md group-hover:scale-105 transition-transform">
                      <UploadCloud className="h-6 w-6 text-slate-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300 font-sans">Drag & Drop Resume PDF</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">or click to search computer file directory</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-5 mt-6">
              <button
                onClick={() => setSelectedFile(null)}
                disabled={!selectedFile || analyzing}
                className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 cursor-pointer font-bold uppercase tracking-wider"
              >
                Clear File
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAnalyze}
                disabled={!selectedFile}
                isLoading={analyzing}
                className="font-semibold shadow-[0_4px_20px_rgba(34,211,238,0.2)]"
              >
                <Sparkles className="h-4 w-4 mr-1.5" /> Analyze Document
              </Button>
            </div>
          </div>

          {/* Past Analyses lists */}
          <div className="premium-card rounded-2xl p-6 text-left">
            <h3 className="text-base font-bold text-white tracking-tight mb-4 font-display">Historic Upload Audits</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 font-sans scrollbar-thin">
              {analyses.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 font-sans">No historic analyses.</div>
              ) : (
                analyses.map((anl) => (
                  <div
                    key={anl.id}
                    onClick={() => setActiveAnalysis(anl)}
                    className="p-3 bg-black/40 hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col gap-0.5 truncate pr-2 font-sans text-left">
                      <span className="text-slate-200 font-bold truncate">{anl.extractedName || "Resume file"}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">
                        {new Date(anl.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${anl.atsScore >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                        {anl.atsScore}%
                      </span>
                      <Eye className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Report Dashboard */
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-5 gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" /> Resume Critique Finalized
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Parsed document <span className="text-cyan-400 font-bold font-mono">{activeAnalysis.extractedName}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleReset} className="font-semibold">
                <RefreshCw className="h-4 w-4 mr-1.5" /> Scan Different File
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Score Box */}
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-4">
                ATS Compatibility Score
              </span>
              <div className="h-28 w-28 rounded-full border-4 border-cyan-500/20 bg-cyan-500/[0.02] flex items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {activeAnalysis.atsScore}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-4 max-w-xs font-sans leading-relaxed text-center">
                {activeAnalysis.summary}
              </p>
            </div>

            {/* Right: Detailed critiques */}
            <div className="lg:col-span-2 space-y-6">
              {/* Omissions & Flaws */}
              {activeAnalysis.gaps && activeAnalysis.gaps.length > 0 && (
                <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold font-mono text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> Structural Flaws & Gaps
                  </span>
                  <ul className="space-y-2 font-sans text-left">
                    {activeAnalysis.gaps.map((flaw: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 flex gap-2.5 items-start">
                        <span className="text-red-400 mt-0.5 shrink-0 text-base leading-none">&bull;</span>
                        <span className="leading-relaxed">{flaw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keyword Audits */}
              {activeAnalysis.skills && activeAnalysis.skills.length > 0 && (
                <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-3 text-left">
                  <span className="text-[10px] font-bold font-mono text-indigo-400 uppercase tracking-widest block">
                    Detected Industry Skills & Keywords
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeAnalysis.skills.map((kw: string) => (
                      <span
                        key={kw}
                        className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-lg"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Rewrites */}
              {activeAnalysis.atsRecommendations && activeAnalysis.atsRecommendations.length > 0 && (
                <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-3 text-left">
                  <span className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest block">
                    Recommended Enhancements
                  </span>
                  <ul className="space-y-2 list-disc list-inside text-xs text-slate-300 font-sans leading-relaxed">
                    {activeAnalysis.atsRecommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="marker:text-purple-400">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;
