
import { GoogleGenAI } from "@google/genai";
import { FormData, PosterMode, AspectRatio, WorksheetType, TargetAudience } from "../types";

// Helper to sanitize JSON string
const cleanJsonString = (str: string) => {
  return str.replace(/```json\n?|```/g, '').trim();
};

export const generateAutoFillContent = async (
  mode: PosterMode | string, 
  currentValues: { topic: string; title: string; subtitle: string; worksheetType?: WorksheetType; targetAudience?: TargetAudience; showFunFact?: boolean; funFact?: string; },
  context: 'topic' | 'title' | 'subtitle' | 'material' | 'cta' | 'funFact' = 'topic'
): Promise<Partial<FormData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = "";
  let responseMimeType: string | undefined = 'application/json';
  const isWorksheetMode = mode === PosterMode.WORKSHEET;
  const isInfographicMode = mode === PosterMode.INFOGRAPHIC;

  if (isWorksheetMode && context === 'material') {
    // SPECIAL CASE: Worksheet material autofill, generate plain descriptive text
    responseMimeType = undefined; // No JSON for this specific case
    prompt = `
      You are an AI AUTO-FILL CONTENT ENGINE specifically designed for the "ISI MATERI" field inside an educational worksheet application.

      This AI ONLY generates HUMAN-READABLE DESCRIPTIVE CONTENT. DO NOT output JSON, code, lists of objects, or technical formats.

      APPLICATION CONTEXT (MANDATORY)
      This content will be displayed directly to teachers or users. Therefore, the content MUST be clear, natural, and easy to understand.
      ALL generated worksheets MUST be: BLANK, STUDENT-READY, WITHOUT ANY ANSWERS OR SOLUTIONS.

      HARD CONTENT LOCK — WORKSHEET SUBTYPE
      worksheet_subtype is a HARD CONTENT FILTER.
      ALL generated content MUST strictly follow the selected worksheet_subtype.
      CRITICAL RULE: ➡️ ONLY ONE (1) ACTIVITY VARIANT is allowed per worksheet_subtype.
      You are STRICTLY FORBIDDEN from including activities outside the selected worksheet_subtype or more than one activity variant.

      Example:
      If worksheet_subtype = "Puzzle / Teka-Teki":
      ALLOWED (choose ONLY ONE):
      - Maze
      - Matching
      - Number puzzle
      - Pattern completion

      FORBIDDEN:
      - Combining multiple puzzle types in one worksheet
      - Mixing with tracing, coloring, or counting unless explicitly selected

      If more than one activity type appears or a forbidden activity is included, YOU MUST remove it and regenerate correctly.

      UNIVERSAL NO-ANSWER RULES (STRICT) - Applies to material content descriptions:
      YOU ARE STRICTLY FORBIDDEN TO MENTION OR IMPLY:
      1. Correct answers in any form.
      2. Pre-filled text, numbers, symbols, or tables.
      3. Drawn connecting lines, arrows, maze routes, or matching lines.
      4. Checked boxes, selected options, or highlighted answers.
      5. Completed patterns, solved puzzles, example responses, or sample drawings.
      6. Before–after comparisons.

      TARGET AUDIENCE ADAPTATION
      Adapt language, tone, and complexity to target_audience:
      - PAUD / TK (3–6): Kalimat sangat sederhana, fokus visual & motorik.
      - SD Kelas Rendah (7–9): Bahasa ringan, contoh konkret.
      - SD Kelas Tinggi (10-12): Bahasa jelas, mulai berpikir logis.
      - SMP (13-15): Bahasa instruktif, analitis ringan.
      - SMA (16+): Bahasa akademik, HOTS.
      - Guru: Bahasa profesional & reflektif.

      CONTENT GENERATION RULES
      You MUST generate a SHORT DESCRIPTIVE TEXT that:
      1. Menjelaskan tujuan pembelajaran secara singkat.
      2. Menjelaskan jenis aktivitas sesuai worksheet_subtype (ONLY ONE ACTIVITY VARIANT PER WORKSHEET).
      3. Relevan dengan:
         - topic: "${currentValues.topic || 'General Education'}"
         - title: "${currentValues.title || 'Worksheet'}"
         - subtitle: "${currentValues.subtitle || 'Activity'}"
      4. TIDAK menyebutkan:
         - struktur soal teknis
         - format jawaban
         - istilah sistem atau UI
         - *Apapun yang melanggar UNIVERSAL NO-ANSWER RULES (STRICT)*
      5. Panjang ideal: 3–5 bullet points ATAU 1 paragraf ringkas.
      6. Bahasa harus natural, bukan teknis AI.

      STRICT OUTPUT RULE
      Output MUST be:
      - Plain text only
      - Readable by humans
      - Ready to display in ISI MATERI field

      DO NOT include:
      - JSON
      - Markdown code blocks
      - Placeholder text
      - Explanations about the system
      - *Answers or solutions of any kind*

      BEGIN AUTO-FILL USING USER INPUT DATA.
      Generate the "ISI MATERI" content for a worksheet.
      Worksheet Subtype: "${currentValues.worksheetType || 'Isian Singkat'}"
      Target Audience: "${currentValues.targetAudience || 'SD Kelas Rendah'}"
      Topic: "${currentValues.topic || 'Pendidikan Umum'}"
      Title: "${currentValues.title || 'Judul Worksheet'}"
      Subtitle: "${currentValues.subtitle || 'Subjudul Worksheet'}"
      
      Output the descriptive content here:
    `;
  } else {
    // JSON generation for other contexts or non-worksheet modes
    let logicInstruction = "";
    let requiredFields = "";
    // Guidance for 'material' field when generating JSON for a worksheet, should be descriptive
    const worksheetMaterialGuidance = isWorksheetMode ? ` (The 'material' field must be a concise, human-readable description of the worksheet's activity and learning objectives, strictly ONE (1) activity variant, and strictly no answers or solutions. It should explain the purpose and type of activity in 3-5 bullet points or a short paragraph.)` : ``;

    if (context === 'title') {
      logicInstruction = `
        CONTEXT: The user wants a new Title based on the Topic: "${currentValues.topic || 'General'}".
        CASCADE LOGIC: 
        1. LOCKED: Topic is "${currentValues.topic}".
        2. GENERATE: New Creative "title" based on Topic.
        3. GENERATE: New "subtitle" that matches the new Title.
        4. GENERATE: New "material" that matches the new Title.${worksheetMaterialGuidance}
        CONSTRAINT: Do NOT return a "topic" field. Only return title, subtitle, and material.
      `;
      requiredFields = `"title", "subtitle", "material"`;
    } else if (context === 'subtitle') {
      logicInstruction = `
        CONTEXT: The user wants a new Subtitle. 
        CASCADE LOGIC:
        1. LOCKED: Topic is "${currentValues.topic}".
        2. LOCKED: Title is "${currentValues.title}".
        3. GENERATE: New "subtitle" that compliments the existing Title.
        4. GENERATE: New "material" that fits this specific Title & Subtitle combination.${worksheetMaterialGuidance}
        CONSTRAINT: Do NOT return "topic" or "title". Only return subtitle and material.
      `;
      requiredFields = `"subtitle", "material"`;
    } else if (context === 'material') {
      // This context will fall here for non-worksheets, or if for some reason the above worksheet material logic fails.
      // It will still generate JSON with descriptive material for worksheets.
      logicInstruction = `
        CONTEXT: The user wants new Content/Material only.
        CASCADE LOGIC:
        1. LOCKED: Topic is "${currentValues.topic}".
        2. LOCKED: Title is "${currentValues.title}".
        3. LOCKED: Subtitle is "${currentValues.subtitle}".
        4. GENERATE: Detailed "material" (3-5 bullet points or short paragraph) that perfectly fits the locked context.${worksheetMaterialGuidance}
        CONSTRAINT: Do NOT return topic, title, or subtitle. Only return material.
      `;
      requiredFields = `"material"`;
    } else if (context === 'cta') {
      logicInstruction = `
        CONTEXT: The user wants a new Call to Action (CTA).
        CASCADE LOGIC:
        1. LOCKED: Topic is "${currentValues.topic}".
        2. LOCKED: Title is "${currentValues.title}".
        3. LOCKED: Subtitle is "${currentValues.subtitle}".
        4. GENERATE: A short, engaging "cta" that is relevant to the content and target audience.
        CONSTRAINT: Do NOT return topic, title, subtitle, or material. Only return cta.
      `;
      requiredFields = `"cta"`;
    } else if (context === 'funFact' && isInfographicMode && currentValues.showFunFact) {
        logicInstruction = `
          CONTEXT: The user wants a Fun Fact for an Infographic.
          CASCADE LOGIC:
          1. LOCKED: Topic is "${currentValues.topic}".
          2. LOCKED: Title is "${currentValues.title}".
          3. GENERATE: A very short, interesting, and verifiable "funFact" related to the topic.
          CONSTRAINT: Do NOT return topic, title, subtitle, material, or cta. Only return funFact.
        `;
        requiredFields = `"funFact"`;
    }
    else {
      // context === 'topic' (Start from scratch)
      logicInstruction = `
        CONTEXT: The user wants to fill everything, starting from the Topic: "${currentValues.topic}".
        CASCADE LOGIC:
        1. If input Topic is empty, invent a popular educational topic for ${mode}. If provided, use it.
        2. Generate "title" from Topic.
        3. Generate "subtitle" from Title.
        4. Generate "material" from Title/Subtitle.${worksheetMaterialGuidance}
        5. Suggest "visualTheme".
        ${isInfographicMode && currentValues.showFunFact ? '6. Generate a relevant "funFact" if `showFunFact` is true.' : ''}
      `;
      requiredFields = `"topic", "title", "subtitle", "material", "visualTheme"${isInfographicMode && currentValues.showFunFact ? ', "funFact"' : ''}`;
    }

    // Dynamically add funFact to JSON EXAMPLE if applicable
    const funFactExample = (isInfographicMode && currentValues.showFunFact && requiredFields.includes('"funFact"')) ? `,\n        "funFact": "Lebah bisa terbang 20km/jam!"` : '';

    prompt = `
      You are an expert educational content creator for a design app called "POSTLY CREATIVE STUDIO".
      
      TASK: Auto-fill form fields based on the strict hierarchy: Topic -> Title -> Subtitle -> Material.
      MODE: ${mode}
      
      ${logicInstruction}
      
      OUTPUT REQUIREMENTS:
      - Language: Indonesian (Bahasa Indonesia).
      - Format: strictly JSON.
      - JSON must ONLY contain these fields: ${requiredFields}.
      
      JSON EXAMPLE (for a full fill):
      {
        "topic": "Tata Surya",
        "title": "MENGENAL TATA SURYA",
        "subtitle": "Planet dan Bintang di Angkasa",
        "material": "- Matahari sebagai pusat\\n- 8 Planet utama\\n- Orbit dan revolusi",
        "visualTheme": "Dark space background, neon planets, glowing stars, futuristic"${funFactExample}
      }
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: responseMimeType // Will be undefined for worksheet material, otherwise 'application/json'
      }
    });

    const text = response.text;
    if (!text) return {};
    
    if (isWorksheetMode && context === 'material' && responseMimeType === undefined) {
      // For plain text worksheet material, return it directly in the FormData partial
      return { material: text };
    } else {
      // For JSON responses, parse and return
      return JSON.parse(cleanJsonString(text));
    }
  } catch (error) {
    console.error("AutoFill GenAI Error:", error);
    return {};
  }
};
