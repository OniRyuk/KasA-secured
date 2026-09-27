import React, { useState } from "react";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Cpu, 
  Layers, 
  FileText, 
  Check, 
  Copy, 
  RefreshCw, 
  Plus, 
  Sliders, 
  Activity,
  Terminal,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { RegressionScenario, ModelInstance, TestExecutionResult } from "../types";

interface RegressionSuiteProps {
  scenarios: RegressionScenario[];
  instances: ModelInstance[];
  onRunTest: (scenarioId: string, instanceId: string, customSystemPrompt?: string, customPrompt?: string) => Promise<TestExecutionResult | null>;
  onGenerateFromSymptoms: (symptoms: string, descriptors: string, category: string, targetModel: string) => Promise<RegressionScenario | null>;
  isGeneratingScenario: boolean;
  isRunningBatch: boolean;
  onRunBatch: (instanceId: string) => Promise<void>;
}

export const RegressionSuite: React.FC<RegressionSuiteProps> = ({
  scenarios,
  instances,
  onRunTest,
  onGenerateFromSymptoms,
  isGeneratingScenario,
  isRunningBatch,
  onRunBatch
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || "");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>(instances[0]?.id || "");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Symptom input states
  const [symptomsInput, setSymptomsInput] = useState("");
  const [descriptorsInput, setDescriptorsInput] = useState("");
  const [symptomCategory, setSymptomCategory] = useState("hallucination");

  // Active execution state
  const [isExecutingSingle, setIsExecutingSingle] = useState(false);
  const [lastResult, setLastResult] = useState<TestExecutionResult | null>(null);
  const [showDiffView, setShowDiffView] = useState(true);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Editable test parameters
  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const [customPrompt, setCustomPrompt] = useState<string>(activeScenario?.prompt || "");
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(activeScenario?.systemPrompt || "");

  // Update prompt inputs when scenario selection changes
  React.useEffect(() => {
    if (activeScenario) {
      setCustomPrompt(activeScenario.prompt);
      setCustomSystemPrompt(activeScenario.systemPrompt || "");
      setLastResult(null);
    }
  }, [selectedScenarioId]);

  const filteredScenarios = scenarios.filter((s) => {
    const matchesCat = categoryFilter === "all" || s.category === categoryFilter;
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleRunCurrent = async () => {
    if (!activeScenario || isExecutingSingle) return;
    setIsExecutingSingle(true);
    try {
      const result = await onRunTest(
        activeScenario.id,
        selectedInstanceId,
        customSystemPrompt,
        customPrompt
      );
      if (result) {
        setLastResult(result);
      }
    } finally {
      setIsExecutingSingle(false);
    }
  };

  const handleSymptomPreset = (symptomText: string, descText: string, cat: string) => {
    setSymptomsInput(symptomText);
    setDescriptorsInput(descText);
    setSymptomCategory(cat);
  };

  const handleSynthesizeScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;
    const targetModelObj = instances.find((i) => i.id === selectedInstanceId);
    const newScen = await onGenerateFromSymptoms(
      symptomsInput,
      descriptorsInput,
      symptomCategory,
      targetModelObj?.modelIdentifier || "ChatGPT-4o"
    );
    if (newScen) {
      setSelectedScenarioId(newScen.id);
      setSymptomsInput("");
      setDescriptorsInput("");
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Diagnostics & Symptom-Based Regression Generator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-900/30 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Symptom & Descriptor Diagnostic Engine
              </h2>
              <span className="text-[11px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-medium border border-indigo-500/30">
                Auto-Synthesizes Complete Tests
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Input observed ChatGPT anomalies, hallucinatory behavior, or descriptor changes. The engine dynamically constructs tailored test assertions, inputs, expected behavioral criteria, and baseline outputs.
            </p>
          </div>

          {/* Quick Symptom Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Quick Symptoms:</span>
            <button
              type="button"
              onClick={() => handleSymptomPreset("Fabricating citations for non-existent arXiv papers", "Occurs under dense research literature queries with temperature >= 0.7", "hallucination")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[11px]"
            >
              Paper Hallucinations
            </button>
            <button
              type="button"
              onClick={() => handleSymptomPreset("Markdown table pipes broken and introductory chit-chat added", "System prompt specifies raw markdown only, but output has intro text", "formatting")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[11px]"
            >
              Broken Markdown Tables
            </button>
            <button
              type="button"
              onClick={() => handleSymptomPreset("TypeScript refactoring defaulting to 'any' and omitting strict return types", "Complex generic mapping function regression", "code_correctness")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[11px]"
            >
              TypeScript 'any' Regression
            </button>
            <button
              type="button"
              onClick={() => handleSymptomPreset("Over-refusing benign fictional writing involving cyber defense", "Triggers false-positive refusal disclaimer", "safety_boundary")}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[11px]"
            >
              Creative Over-Refusal
            </button>
          </div>
        </div>

        {/* Symptoms Form */}
        <form onSubmit={handleSynthesizeScenario} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Observed Symptoms (What went wrong?):
            </label>
            <input
              type="text"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="e.g. Model started answering with apologetic loops and skipping Python type hints"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Descriptors / Environment Context:
            </label>
            <input
              type="text"
              value={descriptorsInput}
              onChange={(e) => setDescriptorsInput(e.target.value)}
              placeholder="e.g. Temperature 0.8, high token output, multi-turn reasoning context"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Domain Category:
            </label>
            <select
              value={symptomCategory}
              onChange={(e) => setSymptomCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
            >
              <option value="hallucination">Hallucination</option>
              <option value="instruction_adherence">Instruction Adherence</option>
              <option value="code_correctness">Code Correctness</option>
              <option value="safety_boundary">Safety Boundary</option>
              <option value="formatting">Formatting & Schema</option>
              <option value="tone_creativity">Tone & Creativity</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isGeneratingScenario || !symptomsInput.trim()}
              className="w-full h-[34px] bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center justify-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
              title="Synthesize Automated Regression Scenario"
            >
              {isGeneratingScenario ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Left Scenarios Explorer, Right Test Runner & Diff Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tried & True Scenarios Library (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Tried & True Scenarios ({filteredScenarios.length})
              </h3>
            </div>
            <button
              onClick={() => onRunBatch(selectedInstanceId)}
              disabled={isRunningBatch}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded border border-slate-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              {isRunningBatch ? (
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
              ) : (
                <Play className="w-3 h-3 text-emerald-400" />
              )}
              <span>Run Full Suite</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios or symptoms..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="hallucination">Hallucination</option>
              <option value="instruction_adherence">Instruction</option>
              <option value="code_correctness">Code Strictness</option>
              <option value="formatting">Formatting</option>
              <option value="safety_boundary">Safety Boundary</option>
              <option value="tone_creativity">Tone & Creativity</option>
            </select>
          </div>

          {/* Scenarios List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredScenarios.map((scenario) => {
              const isSelected = scenario.id === activeScenario?.id;
              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          scenario.status === "passed"
                            ? "bg-emerald-400"
                            : scenario.status === "failed"
                            ? "bg-rose-400"
                            : "bg-amber-400"
                        }`} />
                        <h4 className="text-xs font-semibold text-slate-100 tracking-tight">
                          {scenario.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {scenario.description}
                      </p>
                    </div>

                    {scenario.lastScore !== undefined && (
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                        scenario.lastScore >= 80
                          ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/50"
                          : "bg-rose-950/70 text-rose-300 border border-rose-800/50"
                      }`}>
                        {scenario.lastScore}%
                      </span>
                    )}
                  </div>

                  {/* Badges and Symptoms treated */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium capitalize">
                      {scenario.category.replace("_", " ")}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800/70 text-[10px] text-slate-400 font-mono">
                      {scenario.assertions.length} Assertions
                    </span>
                    {scenario.symptomsTreated.slice(0, 1).map((sym, i) => (
                      <span key={i} className="text-[10px] text-indigo-300/80 bg-indigo-950/40 px-1.5 py-0.5 rounded truncate max-w-[170px]" title={sym}>
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredScenarios.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No regression scenarios match filter. Try clearing your search query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Execution Runner, Assertions & Real-Time Diff Monitor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeScenario ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              {/* Header: Title, Target Instance & Run Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-900/60 text-indigo-300 rounded border border-indigo-700/50 capitalize">
                      {activeScenario.category.replace("_", " ")}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {activeScenario.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeScenario.description}
                  </p>
                </div>

                {/* Instance Selector and Execute */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedInstanceId}
                    onChange={(e) => setSelectedInstanceId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
                  >
                    {instances.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.modelIdentifier})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleRunCurrent}
                    disabled={isExecutingSingle}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isExecutingSingle ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isExecutingSingle ? "Testing..." : "Run Test"}</span>
                  </button>
                </div>
              </div>

              {/* Editable Prompt & System Instructions Accordion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Target System & User Prompt Parameters:</span>
                  <span className="text-[11px] text-slate-500">Fine-tune before running</span>
                </div>

                {activeScenario.systemPrompt && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">System Instruction:</span>
                    <textarea
                      rows={2}
                      value={customSystemPrompt}
                      onChange={(e) => setCustomSystemPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Evaluation Prompt:</span>
                  <textarea
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Assertions Checklist Matrix */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Assertion Matrix ({activeScenario.assertions.length})</span>
                  <span className="text-[11px] text-slate-400">Real-time heuristics & schema verifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(lastResult?.assertionResults || activeScenario.assertions).map((ast, idx) => {
                    const isPassed = (ast as any).passed;
                    const hasRun = lastResult !== null;

                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded border flex items-center justify-between ${
                          hasRun
                            ? isPassed
                              ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
                              : "bg-rose-950/30 border-rose-800/60 text-rose-200"
                            : "bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {hasRun ? (
                            isPassed ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                          )}
                          <span className="text-[11px] truncate" title={ast.description}>
                            {ast.description}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 uppercase px-1 bg-black/40 rounded">
                          {ast.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-Time Monitoring Output & Diff Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">
                      Model Output & Regression Analysis
                    </span>
                    {lastResult && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        lastResult.status === "passed"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                      }`}>
                        {lastResult.status} ({lastResult.score}%) • {lastResult.durationMs}ms
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDiffView(!showDiffView)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                    >
                      {showDiffView ? "Hide Baseline Diff" : "Show Baseline Diff"}
                    </button>
                    {lastResult?.modelOutput && (
                      <button
                        onClick={() => handleCopyText(lastResult.modelOutput)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                        title="Copy candidate output"
                      >
                        {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Response Viewers */}
                {lastResult ? (
                  <div className="space-y-3">
                    {/* Candidate Model Output */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium text-cyan-300 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" />
                          Candidate Output ({lastResult.instance}):
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {lastResult.timestamp.slice(11, 19)} UTC
                        </span>
                      </div>
                      <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                        {lastResult.modelOutput}
                      </pre>
                    </div>

                    {/* Baseline Tried & True Reference Output (Diff/Comparison) */}
                    {showDiffView && activeScenario.baselineSampleOutput && (
                      <div className="bg-slate-950/80 border border-indigo-950/80 rounded-lg p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-medium text-indigo-300 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                            Baseline Verified Gold Standard Output:
                          </span>
                          <span className="text-[10px] text-slate-500">Regression Benchmark</span>
                        </div>
                        <pre className="text-xs font-mono text-slate-300/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-slate-900/40 p-2.5 rounded border border-indigo-900/30">
                          {activeScenario.baselineSampleOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-lg p-8 text-center text-xs text-slate-500 space-y-2">
                    <Terminal className="w-6 h-6 text-slate-600 mx-auto" />
                    <p>Select target instance above and click <span className="text-emerald-400 font-semibold">Run Test</span> to execute real-time model evaluation and assertion scoring.</p>
                    {activeScenario.baselineSampleOutput && (
                      <div className="pt-2 text-left max-w-lg mx-auto">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Pristine Baseline Output:</span>
                        <p className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded line-clamp-3">
                          {activeScenario.baselineSampleOutput}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
              Select a scenario from the left to view details and execute tests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
