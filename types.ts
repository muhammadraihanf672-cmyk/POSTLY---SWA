
export enum AppStep {
  LANDING = 'LANDING',
  MENU = 'MENU',
  INFO = 'INFO',
  VISUAL = 'VISUAL',
  RESULT = 'RESULT',
}

export enum PosterMode {
  POSTER = 'Poster Edukasi',
  WORKSHEET = 'Worksheet / LKS',
  INFOGRAPHIC = 'Infografis',
  ENVELOPE = 'Amplop Hari Raya',
}

export enum WorksheetOutputMode {
  CONTENT_ONLY = 'CONTENT_ONLY',
  COVER_AND_CONTENT = 'COVER_AND_CONTENT'
}

export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan',
  MIXED = 'Campuran',
}

export enum AspectRatio {
  R_9_16 = '9:16 (Story/Reels)',
  R_1_1 = '1:1 (Square)',
  R_4_5 = '4:5 (IG Feed)',
  R_3_4 = '3:4 (Portrait)',
  R_16_9 = '16:9 (Landscape)',
  A4 = 'A4 (Print)',
  F4 = 'F4 (Print)',
  A3 = 'A3 (Print)',
  ENV_SMALL = 'Amplop Kecil (7x10cm)',
  ENV_LARGE = 'Amplop Besar (Uang Utuh)',
}

export enum VisualStyle {
  AUTO = 'AUTO',
  REALISTIC = 'REALISTIC',
  PHOTOREALISTIC = 'PHOTOREALISTIC', // New style
  THREE_D = 'THREE_D',
  THREE_D_INDOOR = 'THREE_D_INDOOR',
  THREE_D_OUTDOOR = 'THREE_D_OUTDOOR',
  VECTOR = 'VECTOR',
  WATERCOLOR = 'WATERCOLOR',
  PAPER_CRAFT = 'PAPER_CRAFT',
  PIXEL_ART = 'PIXEL_ART',
  EXPRESSIVE_EDU_ILLUSTRATION = 'EXPRESSIVE_EDU_ILLUSTRATION',
  SERENE_3D_EDU_VISUAL = 'SERENE_3D_EDU_VISUAL',
  CINEMATIC_INFOGRAPHIC_FLOW = 'CINEMATIC_INFOGRAPHIC_FLOW',
  SOFT_EMPATHY_ILLUSTRATION = 'SOFT_EMPATHY_ILLUSTRATION'
}

export enum TargetAudience {
  PAUD = 'PAUD',
  SD_LOWER = 'SD_LOWER',
  SD_UPPER = 'SD_UPPER',
  SMP = 'SMP',
  SMA = 'SMA',
  TEACHER = 'TEACHER',
  ADULT = 'ADULT',
  GEN_Z = 'GEN_Z'
}

export enum WorksheetType {
  // A. LOGICAL THINKING
  TRUE_FALSE = 'TRUE_FALSE',
  TABLE_COMPLETION = 'TABLE_COMPLETION',
  CLASSIFICATION = 'CLASSIFICATION',
  SEQUENCING = 'SEQUENCING',
  IMAGE_ANALYSIS = 'IMAGE_ANALYSIS',
  
  // B. EXPRESSION & REFLECTION
  OPINION_WRITING = 'OPINION_WRITING',
  PARAPHRASING = 'PARAPHRASING',
  SENTENCE_COMPLETION = 'SENTENCE_COMPLETION',
  STORY_WRITING = 'STORY_WRITING',
  
  // C. CREATIVE
  DIRECTED_DRAWING = 'DIRECTED_DRAWING',
  MIND_MAP = 'MIND_MAP',
  COMIC_STRIP = 'COMIC_STRIP',
  COLLAGE = 'COLLAGE',
  
  // D. ACTIVE & INTERACTIVE
  DRAG_DROP = 'DRAG_DROP',
  PUZZLE = 'PUZZLE',
  TRUE_FALSE_REASON = 'TRUE_FALSE_REASON',
  ROLE_PLAY = 'ROLE_PLAY',
  
  // E. HOTS
  CASE_STUDY = 'CASE_STUDY',
  PROBLEM_SOLVING = 'PROBLEM_SOLVING',
  PREDICTION = 'PREDICTION',
  COMPARE_CONTRAST = 'COMPARE_CONTRAST',
  
  // F. EARLY CHILDHOOD (PAUD)
  TRACING = 'TRACING',
  PATTERN_MATCHING = 'PATTERN_MATCHING',
  GUESS_SYMBOL = 'GUESS_SYMBOL',

  // New KODING Types
  CODING_MATH = 'CODING_MATH',
  CODING_COLOR = 'CODING_COLOR',
  CODING_SHAPE = 'CODING_SHAPE',
  CODING_MOVEMENT = 'CODING_MOVEMENT',
  CODING_PATH = 'CODING_PATH',
  CODING_IMAGE = 'CODING_IMAGE',
  CODING_LOGIC = 'CODING_LOGIC',

  // Legacy / General
  FILL_IN = 'FILL_IN',
  MATCHING = 'MATCHING',
  CHOICE = 'CHOICE',
  COLORING = 'COLORING',
  MIXED = 'MIXED'
}

export enum InfographicArchitectureType {
  TIMELINE_ROADMAP = 'TIMELINE_ROADMAP',
  STEP_BY_STEP_PROCESS = 'STEP_BY_STEP_PROCESS',
  COMPARISON_SPLIT = 'COMPARISON_SPLIT',
  ANATOMY_BREAKDOWN = 'ANATOMY_BREAKDOWN',
  STATISTICAL_DASHBOARD = 'STATISTICAL_DASHBOARD',
  CENTRAL_FOCUS_TEXT_CENTRIC = 'CENTRAL_FOCUS_TEXT_CENTRIC', // New type
}

export enum InfographicLayoutFlow {
  Z_PATTERN = 'Z_PATTERN',
  MODULAR_GRID = 'MODULAR_GRID',
  CENTRAL_HUB = 'CENTRAL_HUB',
  VERTICAL_SCROLL = 'VERTICAL_SCROLL',
}

export interface FormData {
  mode: PosterMode | null;
  // Main Fields
  preset: string;
  targetAudience: string;
  topic: string;
  title: string;
  subtitle: string;
  material: string;
  cta: string;
  
  // Specific for Worksheet
  worksheetOutputMode?: WorksheetOutputMode;
  worksheetPromptCount?: number;
  materials?: string[];
  worksheetType?: string;
  questionCount?: string;

  // Specific for Infographic
  infographicArchitectureType?: InfographicArchitectureType;
  infographicLayoutFlow?: InfographicLayoutFlow;
  showFunFact: boolean; // New field
  funFact: string; // New field

  // Specific for Envelope
  senderName?: string;
  recipientName?: string;

  // Identity
  socialAccount: string;
  watermark: string;
  
  // Advanced
  size: string;
  visualStyle: string;
  visualTheme: string;
  additionalPrompt: string;
  
  // Character (Step 2)
  showCharacter: boolean;
  gender: Gender | null;
  hijab: boolean;
  niqab: boolean;
}

export const INITIAL_DATA: FormData = {
  mode: null,
  preset: '',
  targetAudience: TargetAudience.SD_LOWER,
  topic: '',
  title: '',
  subtitle: '',
  material: '',
  cta: '',
  socialAccount: '',
  watermark: '',
  worksheetOutputMode: WorksheetOutputMode.CONTENT_ONLY,
  worksheetPromptCount: 1,
  materials: [],
  worksheetType: WorksheetType.FILL_IN,
  questionCount: '',
  // Infographic specific fields
  infographicArchitectureType: InfographicArchitectureType.STEP_BY_STEP_PROCESS,
  infographicLayoutFlow: InfographicLayoutFlow.VERTICAL_SCROLL,
  showFunFact: false, // Default to false
  funFact: '', // Default empty
  senderName: '',
  recipientName: '',
  size: AspectRatio.R_9_16,
  visualStyle: VisualStyle.AUTO,
  visualTheme: '',
  additionalPrompt: '',
  showCharacter: false,
  gender: Gender.MALE,
  hijab: false,
  niqab: false,
};
