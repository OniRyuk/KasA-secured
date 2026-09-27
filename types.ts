export type UserRole = "creator" | "qa_engineer" | "admin" | "viewer";

export interface Assertion {
  type: "contains" | "not_contains" | "regex" | "json_valid" | "max_latency" | "min_length" | "semantic";
  value: string;
  description: string;
  passed?: boolean;
}

export interface RegressionScenario {
  id: string;
  title: string;
  category: "hallucination" | "instruction_adherence" | "code_correctness" | "safety_boundary" | "formatting" | "reasoning" | "tone_creativity";
  description: string;
  symptomsTreated: string[];
  systemPrompt?: string;
  prompt: string;
  expectedBehavior: string;
  assertions: Assertion[];
  baselineSampleOutput?: string;
  lastTestedAt?: string;
  status?: "passed" | "failed" | "pending" | "running";
  lastScore?: number;
  tags: string[];
}

export interface ModelInstance {
  id: string;
  name: string;
  provider: "openai_chatgpt" | "gemini" | "anthropic" | "custom_endpoint" | "mock_sandbox";
  endpointUrl: string;
  modelIdentifier: string;
  apiKey?: string;
  status: "active" | "standby" | "unreachable";
  latencyMs: number;
  lastPing: string;
  temperature: number;
  maxTokens: number;
  isDefault?: boolean;
}

export interface WebhookConfig {
  id: string;
  name: string;
  targetUrl: string;
  secret: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  status: "success" | "warning" | "error";
}

export interface SessionStatus {
  currentIp: string;
  totalCycleHours: number;
  remainingMs: number;
  remainingMinutes: number;
  rollingCode: string;
  recycledCount: number;
  isBlocked: boolean;
  seamlessBypassActive: boolean;
  lastRolloverAt: string;
  poolSize: number;
}

export interface TestExecutionResult {
  scenarioId: string;
  instance: string;
  modelOutput: string;
  durationMs: number;
  score: number;
  status: "passed" | "failed";
  assertionResults: Assertion[];
  executionError: string | null;
  timestamp: string;
}

export interface PromptAsset {
  id: string;
  title: string;
  type: "art" | "poetry" | "code";
  content: string;
  tags: string[];
  createdAt: string;
}

export interface LocalSubnetModel {
  id: string;
  name: string;
  endpoint: string;
  type: "ollama" | "lmstudio" | "vllm" | "local_ai";
  status: "online" | "offline";
  latencyMs: number;
}

export interface NearbyWifiNetwork {
  ssid: string;
  signalDbm: number;
  security: string;
  channel: number;
  frequency: string;
  isKnown?: boolean;
}

export interface WifiStatus {
  ssid: string;
  bssid: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  signalDbm: number;
  signalPercent: number;
  frequency: string;
  security: string;
  status: "connected" | "connecting" | "disconnected";
  nodeMode: "client_station" | "standalone_ap";
  apSsid: string;
  apPassphrase?: string;
  localHostUrl: string;
  interfaces: { name: string; address: string; family: string; internal: boolean }[];
  isOffline: boolean;
  localModelsOnSubnet: LocalSubnetModel[];
}

export interface ApkConfig {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  targetSdk: number;
  minSdk: number;
  permissions: string[];
  orientation: "portrait" | "landscape" | "auto";
  offlineMode: "cached_first" | "network_only" | "full_autonomous";
}

export interface BiometricCredential {
  id: string;
  name: string;
  type: "face" | "id_badge" | "webauthn_passkey" | "fingerprint";
  enrolledAt: string;
  lastUsed?: string;
  samplePreview?: string;
}

export interface KeyfobCredential {
  id: string;
  name: string;
  fobId: string;
  type: "hardware_fido" | "nfc_rfid" | "virtual_token";
  lastUsed?: string;
  hardwareSerial?: string;
}

export interface SecurityLockStatus {
  isLocked: boolean;
  lockReason?: string;
  lockedAt?: string;
  autoLockMinutes: number;
  registeredFobs: KeyfobCredential[];
  registeredBiometrics: BiometricCredential[];
  lastUnlockedBy?: string;
  lastUnlockedAt?: string;
  lastUnlockMethod?: string;
}

export interface WebhookBridgeConfig {
  enabled: boolean;
  targetUrl: string;
  authBearerToken?: string;
  requestFormat?: "openai" | "ollama" | "n8n_json" | "raw_prompt";
  modelIdentifier?: string;
}

export interface PersonalGPTConfig {
  id: string;
  name: string;
  tagline: string;
  frameworkVersion: string;
  avatarIcon: string;
  systemPrompt: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  domainFocus: string;
  tone: "concise" | "technical" | "analytical" | "creative" | "assertive";
  capabilities: {
    codeExecution: boolean;
    regressionTesting: boolean;
    deepReasoning: boolean;
    webBrowsing: boolean;
    jsonSchemaEnforcement: boolean;
  };
  customKnowledge: string[];
  conversationStarters: string[];
  lastCustomizedAt: string;
  customizedByAiSummary?: string;
  webhookBridge?: WebhookBridgeConfig;
}

export interface PersonalGPTMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  latencyMs?: number;
  tokens?: number;
  generatedImageUrl?: string;
  imageUrl?: string;
  framework?: string;
  webhookTarget?: string;
}

export interface IntegrityFileReport {
  path: string;
  exists: boolean;
  status: string;
  sha256: string | null;
  sizeBytes: number;
  lineCount: number;
  tampered: boolean;
  lastChecked?: string;
}

export interface IntegrityCheckResponse {
  appName: string;
  appVersion: string;
  timestamp: string;
  overallStatus: "verified_clean" | "tampering_detected";
  monitoredCount: number;
  files: IntegrityFileReport[];
  patchVersion: string;
  patchAvailable: boolean;
  summary: string;
}

export type KasaEmblemStyle = "crimson_ronin" | "cyberpunk_kasa" | "shadow_shinobi" | "gold_shogun" | "neon_oni";

export type KeyboardTheme = "cyber_katana" | "crimson_nebula" | "blood_wave" | "obsidian_stealth" | "neon_shogun";

export interface VisualThemeSettings {
  backgroundStyle: "cyber_katana" | "crimson_nebula" | "blood_wave" | "obsidian_stealth";
  movingBorderEnabled: boolean;
  borderSpeed: "slow" | "normal" | "fast";
  borderColor: "crimson" | "sakura" | "flame" | "ruby";
  japaneseFontEnabled: boolean;
  fontWaveEnabled: boolean;
  buttonShineEnabled: boolean;
  glowIntensity: "subtle" | "vivid" | "intense";
  emblemStyle: KasaEmblemStyle;
  lagPreventionTurbo: boolean;
  keyboardTheme: KeyboardTheme;
  virtualKeyboardOpen: boolean;
  voiceNarrationEnabled: boolean;
  activeSwordId?: string;
}

export type SwordElement = "blood" | "frost" | "divine" | "shadow" | "plasma" | "void" | "gold" | "fire" | "lightning" | "spirit";

export interface SwordConfig {
  id: string;
  name: string;
  japaneseName: string;
  kanjiSymbol: string;
  lore: string;
  quote: string;
  sheathColor: string;
  sheathAccent: string;
  bladeTint: string;
  tsubaStyle: string;
  element: SwordElement;
  sliceColor: string;
  auraGlow: string;
  powerRating: number;
  speedRating: number;
  defenseRating: number;
  integritySeal: string;
}

export interface VaultFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  sha256: string;
  encrypted: boolean;
  integrityStatus: "intact" | "tampered" | "verified";
  content: string; // text or base64 or encrypted ciphertext
  iv?: string;
  salt?: string;
  algorithm?: string;
  tamperedSimulated?: boolean;
  tags: string[];
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  privacyShieldActive: boolean;
  trackersBlockedCount: number;
  sandboxed: boolean;
  isTorMode: boolean;
}

export interface UserProfileRequest {
  id: string;
  timestamp: string;
  requestType: "clearance_escalation" | "biometric_sync" | "key_rotation" | "offline_certificate" | "audit_export";
  reason: string;
  status: "approved" | "pending" | "denied";
  approvedBy: string;
}

export type PrivacyBlindMode = "blackout" | "polarized_frost" | "camouflage_diagnostic";

export interface PrivacyBlindConfig {
  isActive: boolean;
  mode: PrivacyBlindMode;
  autoBlindOnIdleMinutes: number;
  watermarkEnabled: boolean;
  pinRequired: boolean;
  pinCode?: string;
  antiShoulderSurfingActive: boolean;
  disableRightClick: boolean;
}

export interface CreatorWorkDraft {
  id: string;
  title: string;
  category: "invention" | "script" | "system_design" | "prompt_formula" | "confidential_memo";
  content: string;
  createdAt: string;
  updatedAt: string;
  sha256Seal: string;
  owner: string;
  watermarkText: string;
  isEncryptedInVault: boolean;
  tags: string[];
}

export type KasaProjectType = "anime" | "app" | "art";

export interface KasaProjectItem {
  id: string;
  type: KasaProjectType;
  title: string;
  summary: string;
  status: "genesis" | "refining" | "finalized";
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  creatorSignature: string;
}

export interface KasaCreativePack {
  id: string;
  name: string;
  japaneseTitle: string;
  category: "anime" | "app" | "art" | "compute";
  description: string;
  features: string[];
  highlight: string;
  overheadSupportNote: string;
  tier: "standard" | "creator" | "master";
  iconName: string;
}

// Aliases for KasA Sovereign Intelligence
export type KasaConfig = PersonalGPTConfig;
export type KasaMessage = PersonalGPTMessage;


