import React, { useState } from "react";
import { 
  Sparkles, 
  Palette, 
  BookOpen, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  GripVertical, 
  Sliders, 
  Image as ImageIcon, 
  Feather, 
  FileCode, 
  Send, 
  Plus, 
  Trash2,
  Maximize2
} from "lucide-react";
import { PromptAsset } from "../types";

interface PromptStudioProps {
  onGeneratePromptCraft: (params: any) => Promise<any>;
  onGenerateImage: (prompt: string, style?: string, aspectRatio?: string) => Promise<any>;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({
  onGeneratePromptCraft,
  onGenerateImage
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"art" | "poetry" | "code">("art");

  // Art State
  const [artTopic, setArtTopic] = useState("Sanctuary of the forgotten astronomers under solitary nocturnal rain");
  const [artStyle, setArtStyle] = useState("Renaissance Chiaroscuro & Volumetric Noir");
  const [artLament, setArtLament] = useState("Weeping stone arches, dying starlight, parched hollows filled with quiet sorrow");
  const [artAspectRatio, setArtAspectRatio] = useState("1:1");
  const [artLighting, setArtLighting] = useState("Chiaroscuro with faint bioluminescent dust");
  const [artLens, setArtLens] = useState("85mm anamorphic prime lens, soft bokeh");

  // Poetry State
  const [poetryTopic, setPoetryTopic] = useState("The solitary keeper of a bell tower after decades of silence");
  const [poetryTone, setPoetryTone] = useState("Melancholic elegance with persistent hope");
  const [poetryLament, setPoetryLament] = useState("Rust on the iron clapper, unwept autumn rain, the quiet hollow where prayers linger");
  const [poetryForm, setPoetryForm] = useState("Elegiac Quatrain");

  // Code State
  const [codeTopic, setCodeTopic] = useState("Resilient Event Bus with backpressure, retry backoff, and distributed tracing");
  const [codeLanguage, setCodeLanguage] = useState("TypeScript");
  const [codePattern, setCodePattern] = useState("Clean Hexagonal Architecture");
  const [codeComplexity, setCodeComplexity] = useState("Principal Enterprise Mastercraft");
  const [includeDocs, setIncludeDocs] = useState(true);
  const [includeUnitTests, setIncludeUnitTests] = useState(true);

  // Results & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRenderingImage, setIsRenderingImage] = useState(false);
  const [artCraftResult, setArtCraftResult] = useState<any>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [poetryCraftResult, setPoetryCraftResult] = useState<any>(null);
  const [codeCraftResult, setCodeCraftResult] = useState<any>(null);
  const [codeViewTab, setCodeViewTab] = useState<"code" | "docs" | "tests">("code");
  const [copiedState, setCopiedState] = useState(false);

  // Drag and Drop Asset Manager
  const [assets, setAssets] = useState<PromptAsset[]>([
    {
      id: "asset-1",
      title: "Nocturne of the Iron Observatory",
      type: "art",
      content: "Mastercraft oil painting of ancient stone observatory dome under rainfall, starlight reflecting in brass astrolabe, atmospheric volumetric smoke.",
      tags: ["chiaroscuro", "lament", "masterpiece"],
      createdAt: new Date(Date.now() - 3600000).toLocaleDateString()
    },
    {
      id: "asset-2",
      title: "Elegy of the Hollow Cistern",
      type: "poetry",
      content: "Upon the weathered granite spine of night, the dome unlatches to the cold abyss...",
      tags: ["quatrain", "elegiac", "cadence"],
      createdAt: new Date(Date.now() - 7200000).toLocaleDateString()
    },
    {
      id: "asset-3",
      title: "Resilient Cache with O(1) Eviction",
      type: "code",
      content: "Enterprise generic TypeScript LRU cache with lazy TTL expiration and mutex guards.",
      tags: ["typescript", "clean-architecture", "tested"],
      createdAt: new Date(Date.now() - 14400000).toLocaleDateString()
    }
  ]);

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Lament Terminology presets
  const lamentPresets = [
    "Weeping stone arches, dying starlight, parched hollows filled with quiet sorrow",
    "Faded gold leaf on ruined icons, twilight fog creeping across empty harbor piers",
    "Solitary lantern swinging against November gale, unuttered farewells in cold mist",
    "Silent observatory with dust on the celestial globes, memories carved in obsidian"
  ];

  const handleGenerateCraft = async () => {
    setIsGenerating(true);
    try {
      if (activeSubTab === "art") {
        const res = await onGeneratePromptCraft({
          mediumType: "art",
          topic: artTopic,
          stylePreset: `${artStyle}, Lighting: ${artLighting}, Lens: ${artLens}`,
          lamentTerminology: artLament,
          creativityLevel: "Mastercraft"
        });
        if (res?.result) {
          setArtCraftResult(res.result);
          // Automatically trigger visual rendering
          handleRenderVisual(res.result.masterPrompt, artStyle, artAspectRatio);
        }
      } else if (activeSubTab === "poetry") {
        const res = await onGeneratePromptCraft({
          mediumType: "poetry",
          topic: poetryTopic,
          tone: poetryTone,
          lamentTerminology: poetryLament,
          stylePreset: poetryForm
        });
        if (res?.result) {
          setPoetryCraftResult(res.result);
        }
      } else {
        const res = await onGeneratePromptCraft({
          mediumType: "code",
          topic: codeTopic,
          targetLanguage: codeLanguage,
          stylePreset: codePattern,
          codeComplexity,
          includeDocs,
          includeUnitTests
        });
        if (res?.result) {
          setCodeCraftResult(res.result);
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRenderVisual = async (promptText: string, styleText: string, aspect: string) => {
    setIsRenderingImage(true);
    try {
      const res = await onGenerateImage(promptText, styleText, aspect);
      if (res?.imageUrl) {
        setGeneratedImageUrl(res.imageUrl);
      }
    } finally {
      setIsRenderingImage(false);
    }
  };

  const handleSaveToAssets = (title: string, type: "art" | "poetry" | "code", content: string) => {
    const newAsset: PromptAsset = {
      id: "asset-" + Date.now(),
      title,
      type,
      content,
      tags: [type, "custom-creation"],
      createdAt: new Date().toLocaleDateString()
    };
    setAssets([newAsset, ...assets]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Drag and Drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    const reordered = [...assets];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setDraggedIdx(targetIdx);
    setAssets(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Mastercraft Prompt Form Creation Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune prompts for mastercraft visual art, evocative poetry, and production code architectures with integrated documentation.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveSubTab("art")}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeSubTab === "art"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Art & Imagery</span>
          </button>
          <button
            onClick={() => setActiveSubTab("poetry")}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeSubTab === "poetry"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Poetry & Literature</span>
          </button>
          <button
            onClick={() => setActiveSubTab("code")}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeSubTab === "code"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code & Documentation</span>
          </button>
        </div>
      </div>

      {/* Form and Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Controls (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          {activeSubTab === "art" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> Visual Art & Mastercraft Styling
                </span>
                <span className="text-[11px] text-slate-500">Lament Terminology Engine</span>
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Artistic Subject / Theme:
                </label>
                <textarea
                  rows={2}
                  value={artTopic}
                  onChange={(e) => setArtTopic(e.target.value)}
                  placeholder="e.g. Ancient marble observatory on mountain peak during thunderstorm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Lament Terminology Presets & Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-medium text-purple-300">
                    Lament Terminology & Mood (Transmutes sorrow to sublime beauty):
                  </label>
                  <span className="text-[10px] text-slate-500">Click preset:</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {lamentPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setArtLament(preset)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 transition cursor-pointer truncate max-w-[220px]"
                    >
                      {preset.slice(0, 32)}...
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={artLament}
                  onChange={(e) => setArtLament(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none font-serif italic"
                />
              </div>

              {/* Styling Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Art Aesthetic Style:
                  </label>
                  <select
                    value={artStyle}
                    onChange={(e) => setArtStyle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer"
                  >
                    <option value="Renaissance Chiaroscuro & Volumetric Noir">Renaissance Chiaroscuro & Noir</option>
                    <option value="Cyberpunk Rain & Holographic Atmospheric">Cyberpunk Volumetric Rain</option>
                    <option value="Ethereal Cosmic Watercolor & Ink">Ethereal Cosmic Ink & Wash</option>
                    <option value="Ukiyo-e Woodblock with Modern Minimalist Geometry">Ukiyo-e Woodblock Fusion</option>
                    <option value="Brutalist Architecture & Golden Hour Chasm">Brutalist Golden Chasm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Aspect Ratio:
                  </label>
                  <select
                    value={artAspectRatio}
                    onChange={(e) => setArtAspectRatio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer"
                  >
                    <option value="1:1">1:1 Square (800x800)</option>
                    <option value="16:9">16:9 Cinematic Landscape</option>
                    <option value="9:16">9:16 Portrait Mobile</option>
                    <option value="4:3">4:3 Classic Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Lighting Atmosphere:
                  </label>
                  <input
                    type="text"
                    value={artLighting}
                    onChange={(e) => setArtLighting(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Lens & Camera Caliber:
                  </label>
                  <input
                    type="text"
                    value={artLens}
                    onChange={(e) => setArtLens(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "poetry" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Feather className="w-4 h-4" /> Poetic Form & Expressive Cadence
                </span>
                <span className="text-[11px] text-slate-500">Meter & Lament Symphony</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Poetic Theme & Subject:
                </label>
                <textarea
                  rows={2}
                  value={poetryTopic}
                  onChange={(e) => setPoetryTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-purple-300 mb-1">
                  Lament Terminology & Acoustic Tone:
                </label>
                <textarea
                  rows={2}
                  value={poetryLament}
                  onChange={(e) => setPoetryLament(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none font-serif italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Poetic Form:
                  </label>
                  <select
                    value={poetryForm}
                    onChange={(e) => setPoetryForm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer"
                  >
                    <option value="Elegiac Quatrain">Elegiac Quatrain (Iambic Pentameter)</option>
                    <option value="Shakespearean Sonnet">Shakespearean Sonnet (14 Lines)</option>
                    <option value="Meditative Free Verse">Meditative Free Verse</option>
                    <option value="Villanelle of Repetition">Villanelle of Echoes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Emotional Cadence:
                  </label>
                  <input
                    type="text"
                    value={poetryTone}
                    onChange={(e) => setPoetryTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "code" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" /> Polyglot Architecture & Documentation
                </span>
                <span className="text-[11px] text-slate-500">Zero 'any' Guarantee</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Software Engineering Specification:
                </label>
                <textarea
                  rows={2}
                  value={codeTopic}
                  onChange={(e) => setCodeTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Programming Language:
                  </label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer"
                  >
                    <option value="TypeScript">TypeScript (Strict)</option>
                    <option value="Python">Python (Type Hints & Asyncio)</option>
                    <option value="Rust">Rust (Ownership & Concurrency)</option>
                    <option value="Go">Go (Goroutines & Channels)</option>
                    <option value="SQL">PostgreSQL / Cloud SQL</option>
                    <option value="C++">C++20 (Modern RAII)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Architecture Pattern:
                  </label>
                  <select
                    value={codePattern}
                    onChange={(e) => setCodePattern(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer"
                  >
                    <option value="Clean Hexagonal Architecture">Clean Hexagonal / Ports</option>
                    <option value="Event-Driven Reactive Pattern">Event-Driven Reactive</option>
                    <option value="Zero-Allocation High Throughput">Zero-Allocation High Perf</option>
                    <option value="Domain-Driven Design (DDD)">Domain-Driven Design (DDD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Complexity Caliber:
                  </label>
                  <select
                    value={codeComplexity}
                    onChange={(e) => setCodeComplexity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none cursor-pointer"
                  >
                    <option value="Principal Enterprise Mastercraft">Principal Enterprise</option>
                    <option value="Modular Production-Grade">Modular Production</option>
                    <option value="Minimalist High-Clarity">Minimalist Clean</option>
                  </select>
                </div>
              </div>

              {/* Checkbox options */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeDocs}
                    onChange={(e) => setIncludeDocs(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Comprehensive Documentation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeUnitTests}
                    onChange={(e) => setIncludeUnitTests(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Unit Test Suite</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Generates calibrated prompt, structured payload & assets
            </span>
            <button
              onClick={handleGenerateCraft}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer shadow-md shadow-purple-600/20"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGenerating ? "Crafting Masterpiece..." : "Craft Masterpiece Prompt"}</span>
            </button>
          </div>
        </div>

        {/* Right Output: Art Canvas, Poetry Reader, or Polyglot Code Studio (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Visual Output for Art */}
          {activeSubTab === "art" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  Extensively Beautiful Visual Render & Canvas
                </span>
                {generatedImageUrl && (
                  <div className="flex items-center gap-2">
                    <a
                      href={generatedImageUrl}
                      download={`masterpiece-${Date.now()}.png`}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1 border border-slate-700 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Render</span>
                    </a>
                    <button
                      onClick={() => handleSaveToAssets(artTopic.slice(0, 32), "art", artCraftResult?.masterPrompt || artTopic)}
                      className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded text-[11px] flex items-center gap-1 border border-purple-700/50 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Save Asset</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Image Stage */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center group shadow-inner">
                {isRenderingImage ? (
                  <div className="text-center space-y-2 p-6">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                    <p className="text-xs text-purple-300 font-medium">Synthesizing mastercraft visual art...</p>
                    <p className="text-[11px] text-slate-500">Volumetric lighting, Chiaroscuro depth & lament atmosphere</p>
                  </div>
                ) : generatedImageUrl ? (
                  <img
                    src={generatedImageUrl}
                    alt="Mastercraft Art Render"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-500 text-xs space-y-2">
                    <Palette className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-slate-400">No render active yet.</p>
                    <p className="text-[11px]">Click "Craft Masterpiece Prompt" on the left to transmute lament terminology into visual art.</p>
                  </div>
                )}
              </div>

              {/* Master Prompt Breakdown */}
              {artCraftResult && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-purple-300 font-semibold">Mastercraft Text-to-Image Prompt:</span>
                    <button
                      onClick={() => handleCopy(artCraftResult.masterPrompt)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copiedState ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="p-3 bg-slate-950 rounded-lg text-slate-200 font-serif leading-relaxed text-[11px] border border-slate-800/70 max-h-28 overflow-y-auto">
                    {artCraftResult.masterPrompt}
                  </p>

                  {artCraftResult.artisticStatement && (
                    <div className="p-2.5 bg-purple-950/20 border border-purple-900/30 rounded-lg text-[11px] text-purple-200/90 font-sans">
                      <span className="font-semibold text-purple-300">Artistic Rationale: </span>
                      {artCraftResult.artisticStatement}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Poetry Output */}
          {activeSubTab === "poetry" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Poetic Mastercraft & Stanza Layout
                </span>
                {poetryCraftResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(poetryCraftResult.poemText)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1 border border-slate-700 cursor-pointer"
                    >
                      {copiedState ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Verse</span>
                    </button>
                    <button
                      onClick={() => handleSaveToAssets(poetryCraftResult.title || poetryTopic.slice(0, 32), "poetry", poetryCraftResult.poemText)}
                      className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded text-[11px] flex items-center gap-1 border border-purple-700/50 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Save Asset</span>
                    </button>
                  </div>
                )}
              </div>

              {poetryCraftResult ? (
                <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-lg p-6 font-serif">
                  <div className="text-center border-b border-slate-800/80 pb-3">
                    <h3 className="text-sm font-semibold text-purple-200 tracking-wide">
                      {poetryCraftResult.title || "Elegy of the Unuttered"}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1 block">
                      {poetryCraftResult.poeticForm || poetryForm}
                    </span>
                  </div>
                  <div className="py-2 text-xs text-slate-200 whitespace-pre-wrap leading-loose text-center italic">
                    {poetryCraftResult.poemText}
                  </div>
                  {poetryCraftResult.analysis && (
                    <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-sans text-slate-400 italic">
                      <span className="font-semibold text-slate-300 not-italic">Acoustic Structure: </span>
                      {poetryCraftResult.analysis}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs bg-slate-950 border border-dashed border-slate-800 rounded-lg">
                  Configure poetic theme and lament tone on the left, then click Craft Masterpiece Prompt.
                </div>
              )}
            </div>
          )}

          {/* Polyglot Code Output */}
          {activeSubTab === "code" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCodeViewTab("code")}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${
                      codeViewTab === "code"
                        ? "bg-purple-900/60 text-purple-200 border border-purple-700/50"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Implementation ({codeLanguage})
                  </button>
                  <button
                    onClick={() => setCodeViewTab("docs")}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${
                      codeViewTab === "docs"
                        ? "bg-purple-900/60 text-purple-200 border border-purple-700/50"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Documentation
                  </button>
                  <button
                    onClick={() => setCodeViewTab("tests")}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${
                      codeViewTab === "tests"
                        ? "bg-purple-900/60 text-purple-200 border border-purple-700/50"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Unit Tests
                  </button>
                </div>

                {codeCraftResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(codeViewTab === "code" ? codeCraftResult.code : codeViewTab === "docs" ? codeCraftResult.documentation : codeCraftResult.unitTests)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedState ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => handleSaveToAssets(codeCraftResult.title || codeTopic.slice(0, 32), "code", codeCraftResult.code)}
                      className="px-2 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              {codeCraftResult ? (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  {codeViewTab === "code" && (
                    <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {codeCraftResult.code}
                    </pre>
                  )}
                  {codeViewTab === "docs" && (
                    <div className="text-xs text-slate-300 leading-relaxed max-h-96 overflow-y-auto space-y-2 p-1">
                      <h4 className="font-semibold text-purple-300 text-sm">Operational Architecture & SLA</h4>
                      <p className="whitespace-pre-wrap font-sans">{codeCraftResult.documentation}</p>
                      {codeCraftResult.architectureNotes && (
                        <div className="p-2.5 bg-slate-900 rounded border border-slate-800 mt-2">
                          <span className="font-mono text-cyan-300 block mb-1">Architecture Decisions:</span>
                          <p className="font-mono text-[11px] text-slate-400">{codeCraftResult.architectureNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {codeViewTab === "tests" && (
                    <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {codeCraftResult.unitTests || "// No test suite generated."}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs bg-slate-950 border border-dashed border-slate-800 rounded-lg font-mono">
                  No code synthesized. Set language and pattern on the left, then click Craft Masterpiece.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drag-and-Drop Prompt Asset Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Drag-and-Drop Prompt Asset Manager ({assets.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Drag cards to reorder your creative pipeline or load directly into active generation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {assets.map((asset, index) => (
            <div
              key={asset.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                draggedIdx === index
                  ? "opacity-50 border-purple-500 bg-purple-950/20"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <GripVertical className="w-3.5 h-3.5 text-slate-600" />
                  <span className="font-semibold text-slate-200 truncate max-w-[150px]">
                    {asset.title}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono bg-slate-900 text-purple-300 border border-purple-900/50">
                  {asset.type}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-3 mb-3 font-mono">
                {asset.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                <div className="flex items-center gap-1">
                  {asset.tags.map((t, ti) => (
                    <span key={ti} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleCopy(asset.content)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
