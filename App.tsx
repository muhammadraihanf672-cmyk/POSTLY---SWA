
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import { Layout } from './components/Layout';
import { Button, Input, Select, TextArea, SelectGroup } from './components/UI';
import { ArrowRight, ArrowLeft, Wand2, Copy, RefreshCw, CheckCircle, User, Image as ImageIcon, Mail, AlertTriangle, Sparkles, LayoutTemplate, Palette, FileText, ListOrdered, GripVertical, Trash2, ArrowUp, ArrowDown, Upload, ExternalLink, Check, Calculator, ChefHat, BarChart, Terminal, BookOpen, HeartPulse } from 'lucide-react';
import { AppStep, PosterMode, FormData, INITIAL_DATA, AspectRatio, Gender, TargetAudience, VisualStyle, WorksheetType, WorksheetOutputMode, InfographicArchitectureType, InfographicLayoutFlow } from './types';
import { generateAutoFillContent } from './services/geminiService';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './translations';

// --- SMART PRESET LIBRARY ---
const PRESET_LIBRARY: Record<string, Partial<FormData>> = {
  // --- POSTER PRESETS ---
  'kajian_rutin': {
    title: 'KAJIAN RUTIN PEKANAN',
    subtitle: 'Pembahasan Kitab Adab & Akhlak',
    material: '- Pentingnya Menuntut Ilmu\\n- Adab kepada Orang Tua\\n- Sesi Tanya Jawab',
    topic: 'Studi Islam',
    cta: 'Terbuka untuk Umum - Hadirilah!',
    visualTheme: 'Islami, Ornamen Geometris Masjid, Emas & Hijau Tua',
    visualStyle: VisualStyle.VECTOR
  },
  'sekolah': {
    title: 'PENGUMUMAN SEKOLAH',
    subtitle: 'Libur Semester Ganjil',
    material: 'Diberitahukan kepada seluruh siswa bahwa libur semester dimulai tanggal 20 Desember s/d 5 Januari.',
    topic: 'Info Akademik',
    cta: 'Selamat Berlibur!',
    visualTheme: 'Formal, Pendidikan, Warna Biru & Putih, Ikon Buku',
    visualStyle: VisualStyle.VECTOR
  },
  'lomba_17': {
    title: 'LOMBA 17 AGUSTUS',
    subtitle: 'Meriahkan HUT RI ke-79',
    material: '- Lomba Makan Kerupuk\\n- Balap Kerupuk\\n- Panjat Pinang',
    topic: 'Event Kemerdekaan',
    cta: 'Daftar Segera di Panitia!',
    visualTheme: 'Merah Putih, Semangat, Bendera Indonesia, Meriah',
    visualStyle: VisualStyle.THREE_D
  },
  'ppdb': {
    title: 'PENERIMAAN SISWA BARU',
    subtitle: 'Tahun Ajaran 2025/2026',
    material: '- Unggul dalam Imtaq & Iptek\\n- Fasilitas Lengkap\\n- Guru Berpengalaman',
    topic: 'Promosi Sekolah',
    cta: 'Daftar Online: www.sekolahhebat.sch.id',
    visualTheme: 'Modern, Foto Siswa Bahagia, Gedung Sekolah, Cerah',
    visualStyle: VisualStyle.REALISTIC
  },

  // --- WORKSHEET PRESETS ---
  'math_basic': {
    title: 'LATIHAN BERHITUNG',
    subtitle: 'Penjumlahan Dasar',
    topic: 'Matematika SD',
    worksheetType: WorksheetType.FILL_IN,
    questionCount: '10 Soal',
    visualTheme: 'Angka-angka Lucu, Warna Warni, Kartun Buah',
    visualStyle: VisualStyle.VECTOR
  },
  'writing': {
    title: 'BELAJAR MENULIS',
    subtitle: 'Menebalkan Huruf',
    topic: 'Bahasa Indonesia',
    worksheetType: WorksheetType.TRACING, // Updated to new type
    questionCount: '5 Baris',
    visualTheme: 'Buku Tulis Garis Tiga, Pensil, Penghapus, Bersih',
    visualStyle: VisualStyle.VECTOR
  },
  'coloring_animals': {
    title: 'MEWARNAI HEWAN',
    subtitle: 'Mengenal Binatang Hutan',
    topic: 'Sains / Biologi',
    worksheetType: WorksheetType.COLORING,
    questionCount: '1 Gambar Utama',
    visualTheme: 'Hutan Rimba, Garis Hitam Putih (Outline Only), Lucu',
    visualStyle: VisualStyle.VECTOR
  },
  'science_parts': {
    title: 'ANGGOTA TUBUH',
    subtitle: 'Pasangkan Nama Bagian Tubuh',
    topic: 'IPA Dasar',
    worksheetType: WorksheetType.MATCHING,
    questionCount: '5 Pasang',
    visualTheme: 'Anak Laki-laki Kartun, Panah Petunjuk, Edukatif',
    visualStyle: VisualStyle.VECTOR
  },

  // --- INFOGRAPHIC PRESETS ---
  'infographic_recipe_simple': {
    title: 'RESEP NASI GORENG SIMPLE',
    subtitle: 'Cepat & Lezat Hanya 5 Menit!',
    material: '1. Siapkan Nasi & Bumbu\\n2. Tumis Bumbu Halus\\n3. Masukkan Nasi, Aduk Rata\\n4. Tambah Telur & Sayur\\n5. Sajikan Selagi Warm!',
    topic: 'Memasak',
    cta: 'Coba buat di rumah hari ini!',
    visualTheme: 'Flat lay food photography, minimal ingredients, bright colors',
    visualStyle: VisualStyle.REALISTIC,
    infographicArchitectureType: InfographicArchitectureType.STEP_BY_STEP_PROCESS,
    infographicLayoutFlow: InfographicLayoutFlow.VERTICAL_SCROLL,
    targetAudience: TargetAudience.ADULT,
    size: AspectRatio.R_9_16,
    showFunFact: true,
    funFact: 'Nasi goreng adalah hidangan nasional Indonesia yang sangat populer!'
  },
  'infographic_drink_recipes': {
    title: 'RESEP MINUMAN SEGAR',
    subtitle: 'Es Coklat Klasik Dingin',
    material: '1. Seduh Coklat Bubuk Panas\\n2. Tambahkan Gula & Susu\\n3. Aduk Rata, Dinginkan\\n4. Tuang ke Gelas Berisi Es\\n5. Hias dengan Whipped Cream!',
    topic: 'Minuman Dingin',
    cta: 'Sempurna untuk melepas dahaga!',
    visualTheme: 'Refreshing, cool tones, slashing liquid, 3D rendered ingredients',
    visualStyle: VisualStyle.THREE_D,
    infographicArchitectureType: InfographicArchitectureType.STEP_BY_STEP_PROCESS,
    infographicLayoutFlow: InfographicLayoutFlow.VERTICAL_SCROLL,
    targetAudience: TargetAudience.GEN_Z,
    size: AspectRatio.R_9_16,
    showFunFact: true,
    funFact: 'Cokelat panas sudah ada sejak peradaban Aztec!'
  },
  'infographic_edu_school': {
    title: 'TIPS FOKUS SAAT BELAJAR',
    subtitle: 'Strategi Ampuh untuk Pelajar',
    material: '1. Buat Jadwal Belajar\\n2. Hindari Gangguan Digital\\n3. Istirahat Cukup\\n4. Konsumsi Makanan Sehat\\n5. Cari Suasana Kondusif',
    topic: 'Edukasi',
    cta: 'Terapkan tips ini sekarang!',
    visualTheme: 'Clean, minimalist, school icons, bright colors, vector',
    visualStyle: VisualStyle.VECTOR,
    infographicArchitectureType: InfographicArchitectureType.STEP_BY_STEP_PROCESS,
    infographicLayoutFlow: InfographicLayoutFlow.MODULAR_GRID,
    targetAudience: TargetAudience.SMP,
    size: AspectRatio.R_1_1,
    showFunFact: false,
    funFact: ''
  },
  'infographic_health_light': {
    title: 'MANFAAT MINUM AIR PUTIH',
    subtitle: 'Pentingnya Hidrasi Setiap Hari',
    material: '1. Jaga Energi Tubuh\\n2. Detoksifikasi Alami\\n3. Kulit Sehat & Berseri\\n4. Bantu Fungsi Otak\\n5. Cegah Batu Ginjal',
    topic: 'Kesehatan',
    cta: 'Minumlah air putih yang cukup!',
    visualTheme: 'Soft blue, clean, water drops, simple vector icons, fresh',
    visualStyle: VisualStyle.WATERCOLOR,
    infographicArchitectureType: InfographicArchitectureType.ANATOMY_BREAKDOWN,
    infographicLayoutFlow: InfographicLayoutFlow.CENTRAL_HUB,
    targetAudience: TargetAudience.ADULT,
    size: AspectRatio.R_4_5,
    showFunFact: true,
    funFact: 'Tahukah kamu, mencuci tangan bisa membunuh jutaan kuman!'
  },
  'infographic_life_skills': {
    title: '5 CARA MENGELOLA WAKTU',
    subtitle: 'Agar Hidup Lebih Produktif',
    material: '1. Prioritaskan Tugas (Eisenhower Matrix)\\n2. Hindari Multitasking\\n3. Teknik Pomodoro\\n4. Delegasikan Tugas\\n5. Evaluasi Rutin',
    topic: 'Produktivitas',
    cta: 'Mulai kelola waktumu sekarang!',
    visualTheme: 'Modern, infographic, clean lines, professional, icon-based',
    visualStyle: VisualStyle.EXPRESSIVE_EDU_ILLUSTRATION,
    infographicArchitectureType: InfographicArchitectureType.TIMELINE_ROADMAP,
    infographicLayoutFlow: InfographicLayoutFlow.Z_PATTERN,
    targetAudience: TargetAudience.SMA,
    size: AspectRatio.R_16_9,
    showFunFact: false,
    funFact: ''
  },
  'infographic_religious': {
    title: 'RUKUN ISLAM & IMAN',
    subtitle: 'Fondasi Utama Seorang Muslim',
    material: 'Rukun Islam: 1. Syahadat\\n2. Salat\\n3. Zakat\\n4. Puasa\\n5. Haji\\n\\nRukun Iman: 1. Allah\\n2. Malaikat\\n3. Kitab\\n4. Rasul\\n5. Hari Akhir\\n6. Qada & Qadar',
    topic: 'Pendidikan Agama Islam',
    cta: 'Mari kita amalkan!',
    visualTheme: 'Islamic, elegant calligraphy, geometric patterns, soft gold and green',
    visualStyle: VisualStyle.VECTOR,
    infographicArchitectureType: InfographicArchitectureType.COMPARISON_SPLIT,
    infographicLayoutFlow: InfographicLayoutFlow.MODULAR_GRID,
    targetAudience: TargetAudience.SD_UPPER,
    size: AspectRatio.R_1_1,
    showFunFact: true,
    funFact: 'Tahukah kamu, mencuci tangan bisa membunuh jutaan kuman!'
  },
  'infographic_unique_facts': {
    title: 'FAKTA UNIK HEWAN LAUT',
    subtitle: 'Yang Mungkin Belum Kamu Tahu',
    material: '1. Gurita punya 3 hati\\n2. Hiu tidak punya tulang\\n3. Kuda laut jantan hamil\\n4. Ikan pari bisa hasilkan listrik\\n5. Paus biru hewan terbesar',
    topic: 'Sains',
    cta: 'Seru kan? Bagikan ke temanmu!',
    visualTheme: 'Underwater, cartoon sea creatures, vibrant colors, fun facts, clean layout',
    visualStyle: VisualStyle.THREE_D_OUTDOOR,
    infographicArchitectureType: InfographicArchitectureType.STATISTICAL_DASHBOARD,
    infographicLayoutFlow: InfographicLayoutFlow.VERTICAL_SCROLL,
    targetAudience: TargetAudience.SD_LOWER,
    size: AspectRatio.R_9_16,
    showFunFact: true,
    funFact: 'Tahukah kamu, mencuci tangan bisa membunuh jutaan kuman!'
  },

  // --- ENVELOPE (LEBARAN) PRESETS ---
  'thr_kids_cute': {
    title: 'SELAMAT IDUL FITRI',
    subtitle: 'Mohon Maaf Lahir Batin',
    material: 'Semoga jadi anak sholeh/sholehah, pintar, dan berbakti. Jangan lupa nabung ya!',
    senderName: 'Om & Tante',
    recipientName: 'Untuk: .........',
    visualTheme: 'Kartun Muslim Cilik, Ketupat, Warna Hijau & Kuning Cerah',
    visualStyle: VisualStyle.THREE_D,
    size: AspectRatio.ENV_SMALL
  },
  'family_floral': {
    title: 'EID MUBARAK 1446 H',
    subtitle: 'Taqabbalallahu Minna Wa Minkum',
    material: 'Di hari yang fitri ini, kami haturkan permohonan maaf atas segala khilaf.',
    senderName: 'Keluarga Bpk. Hartono',
    recipientName: 'Yth. Bapak/Ibu ......',
    visualTheme: 'Bunga Elegan (Floral), Emas (Gold), Mewah, Putih Bersih',
    visualStyle: VisualStyle.WATERCOLOR,
    size: AspectRatio.ENV_LARGE
  },
  'envelope_navy_family': {
    title: 'EID MUBARAK',
    subtitle: 'Mohon Maaf Lahir dan Batin',
    material: 'THR buat kamu. Semoga berkah!',
    senderName: '@sakinahina',
    recipientName: 'To: ..........',
    visualTheme: 'navy_night',
    visualStyle: VisualStyle.VECTOR,
    size: AspectRatio.ENV_LARGE,
    showCharacter: true,
    gender: Gender.MIXED,
    hijab: true
  },
  'envelope_happy_kids': {
    title: 'SELAMAT HARI RAYA',
    subtitle: 'Mohon Maaf Lahir & Batin',
    material: 'Semoga hari kemenangan ini membawa berkah.',
    senderName: 'Kakak Tersayang',
    recipientName: 'Adik Manis',
    visualTheme: 'happy_night_nature',
    visualStyle: VisualStyle.VECTOR,
    size: AspectRatio.ENV_LARGE,
    showCharacter: true,
    gender: Gender.MIXED,
    hijab: true
  },
  'office_formal': {
    title: 'SELAMAT HARI RAYA',
    subtitle: 'Idul Fitri 1 Syawal 1446 H',
    material: 'Semoga keberkahan dan kedamaian menyertai kita semua.',
    senderName: 'PT. MAJU MUNDUR JAYA',
    recipientName: 'Kepada Karyawan Terbaik',
    visualTheme: 'Geometris Minimalis, Corporate Blue/Navy, Simpel, Profesional',
    visualStyle: VisualStyle.VECTOR,
    size: AspectRatio.ENV_LARGE
  },
  'friend_funny': {
    title: 'THR NIH BOS!',
    subtitle: 'Maaf Lahir Batin Yaa',
    material: 'Dikit aja yang penting ikhlas. Jangan dipake buat topup game mulu!',
    senderName: 'Bestie Kamu',
    recipientName: 'To: ..........',
    visualTheme: 'Meme Style, Pop Art, Warna Mencolok, Lucu, Santai',
    visualStyle: VisualStyle.VECTOR,
    size: AspectRatio.ENV_SMALL
  },
  'infographic_sacred_prayer': { // New preset for text-centric infographic
    title: 'Doa Sebelum Belajar',
    subtitle: 'Agar Ilmu Bermanfaat',
    material: 'Robbi Zidni Ilmaa Warzuqni Fahmaa. Ya Allah, tambahkanlah kepadaku ilmu dan berilah aku pemahaman.',
    topic: 'Doa Harian',
    visualTheme: 'sacred_quotes',
    visualStyle: VisualStyle.VECTOR, // Or a suitable default
    infographicArchitectureType: InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC,
    targetAudience: TargetAudience.SD_LOWER,
    size: AspectRatio.R_1_1,
    showFunFact: false,
    funFact: '',
    cta: '' // No CTA for sacred quotes
  }
};

const UploadBox = ({ title, category, count, onFileSelect }: { title: string, category: string, count: number, onFileSelect: (category: string) => void }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(category);
    }
  };

  return (
    <div onClick={handleClick} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer group">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</span>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-full">{count}/3</span>
      </div>
      <div className="border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl h-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 group-hover:border-blue-500/50 dark:group-hover:border-blue-500/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">{t('box_click')}</span>
      </div>
    </div>
  );
};

const DisclaimerFooter = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center mt-8">
       <div className="flex justify-center mb-3">
         <AlertTriangle className="w-5 h-5 text-gray-800 dark:text-yellow-400" />
       </div>
       <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
         {t('disclaimer_user')}
       </p>
    </div>
  );
};

// Helper maps for translating Enums in UI
const useEnumTranslations = () => {
  const { t } = useLanguage();
  
  const visualStyleLabels: Record<VisualStyle, string> = React.useMemo(() => ({
    [VisualStyle.AUTO]: t('style_auto'),
    [VisualStyle.REALISTIC]: t('style_realistic'),
    [VisualStyle.PHOTOREALISTIC]: t('style_photorealistic'), // New style
    [VisualStyle.THREE_D]: t('style_3d'),
    [VisualStyle.THREE_D_INDOOR]: t('style_3d_indoor'),
    [VisualStyle.THREE_D_OUTDOOR]: t('style_3d_outdoor'),
    [VisualStyle.VECTOR]: t('style_vector'),
    [VisualStyle.WATERCOLOR]: t('style_watercolor'),
    [VisualStyle.PAPER_CRAFT]: t('style_paper'),
    [VisualStyle.PIXEL_ART]: t('style_pixel'),
    [VisualStyle.EXPRESSIVE_EDU_ILLUSTRATION]: t('style_expressive_edu'),
    [VisualStyle.SERENE_3D_EDU_VISUAL]: t('style_serene_3d_edu'),
    [VisualStyle.CINEMATIC_INFOGRAPHIC_FLOW]: t('style_cinematic_infographic_flow'),
    [VisualStyle.SOFT_EMPATHY_ILLUSTRATION]: t('style_soft_empathy_illustration')
  }), [t]);

  const targetAudienceLabels: Record<TargetAudience, string> = React.useMemo(() => ({
    [TargetAudience.PAUD]: t('aud_paud'),
    [TargetAudience.SD_LOWER]: t('aud_sd_low'),
    [TargetAudience.SD_UPPER]: t('aud_sd_high'),
    [TargetAudience.SMP]: t('aud_smp'),
    [TargetAudience.SMA]: t('aud_sma'),
    [TargetAudience.TEACHER]: t('aud_teacher'),
    [TargetAudience.ADULT]: t('aud_adult'),
    [TargetAudience.GEN_Z]: t('aud_genz'),
  }), [t]);

  const genderLabels: Record<Gender, string> = React.useMemo(() => ({
    [Gender.MALE]: t('gender_male'),
    [Gender.FEMALE]: t('gender_female'),
    [Gender.MIXED]: t('gender_mixed')
  }), [t]);

  // Improved mapping to support translations for all worksheet types
  const worksheetTypeLabels: Record<WorksheetType, string> = React.useMemo(() => ({
    [WorksheetType.TRUE_FALSE]: t('ws_true_false'),
    [WorksheetType.TABLE_COMPLETION]: t('ws_table_completion'),
    [WorksheetType.CLASSIFICATION]: t('ws_classification'),
    [WorksheetType.SEQUENCING]: t('ws_sequencing'),
    [WorksheetType.IMAGE_ANALYSIS]: t('ws_image_analysis'),
    [WorksheetType.OPINION_WRITING]: t('ws_opinion_writing'),
    [WorksheetType.PARAPHRASING]: t('ws_paraphrasing'),
    [WorksheetType.SENTENCE_COMPLETION]: t('ws_sentence_completion'),
    [WorksheetType.STORY_WRITING]: t('ws_story_writing'),
    [WorksheetType.DIRECTED_DRAWING]: t('ws_directed_drawing'),
    [WorksheetType.MIND_MAP]: t('ws_mind_map'),
    [WorksheetType.COMIC_STRIP]: t('ws_comic_strip'),
    [WorksheetType.COLLAGE]: t('ws_collage'),
    [WorksheetType.DRAG_DROP]: t('ws_drag_drop'),
    [WorksheetType.PUZZLE]: t('ws_puzzle'),
    [WorksheetType.TRUE_FALSE_REASON]: t('ws_true_false_reason'),
    [WorksheetType.ROLE_PLAY]: t('ws_role_play'),
    [WorksheetType.CASE_STUDY]: t('ws_case_study'),
    [WorksheetType.PROBLEM_SOLVING]: t('ws_problem_solving'),
    [WorksheetType.PREDICTION]: t('ws_prediction'),
    [WorksheetType.COMPARE_CONTRAST]: t('ws_compare_contrast'),
    [WorksheetType.TRACING]: t('ws_tracing'),
    [WorksheetType.PATTERN_MATCHING]: t('ws_pattern_matching'),
    [WorksheetType.GUESS_SYMBOL]: t('ws_guess_symbol'),
    // Koding Types
    [WorksheetType.CODING_MATH]: t('ws_coding_math'),
    [WorksheetType.CODING_COLOR]: t('ws_coding_color'),
    [WorksheetType.CODING_SHAPE]: t('ws_coding_shape'),
    [WorksheetType.CODING_MOVEMENT]: t('ws_coding_movement'),
    [WorksheetType.CODING_PATH]: t('ws_coding_path'),
    [WorksheetType.CODING_IMAGE]: t('ws_coding_image'),
    [WorksheetType.CODING_LOGIC]: t('ws_coding_logic'),
    // Legacy / General
    [WorksheetType.FILL_IN]: t('ws_fill'),
    [WorksheetType.MATCHING]: t('ws_match'),
    [WorksheetType.CHOICE]: t('ws_choice'),
    [WorksheetType.COLORING]: t('ws_color'),
    [WorksheetType.MIXED]: t('ws_mixed')
  }), [t]);

  const infographicArchitectureLabels: Record<InfographicArchitectureType, string> = React.useMemo(() => ({
    [InfographicArchitectureType.TIMELINE_ROADMAP]: t('arch_timeline_roadmap'),
    [InfographicArchitectureType.STEP_BY_STEP_PROCESS]: t('arch_step_by_step'),
    [InfographicArchitectureType.COMPARISON_SPLIT]: t('arch_comparison_split'),
    [InfographicArchitectureType.ANATOMY_BREAKDOWN]: t('arch_anatomy_breakdown'),
    [InfographicArchitectureType.STATISTICAL_DASHBOARD]: t('arch_statistical_dashboard'),
    [InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC]: t('arch_central_focus_text_centric'), // New
  }), [t]);

  const infographicLayoutFlowLabels: Record<InfographicLayoutFlow, string> = React.useMemo(() => ({
    [InfographicLayoutFlow.Z_PATTERN]: t('layout_z_pattern'),
    [InfographicLayoutFlow.MODULAR_GRID]: t('layout_modular_grid'),
    [InfographicLayoutFlow.CENTRAL_HUB]: t('layout_central_hub'),
    [InfographicLayoutFlow.VERTICAL_SCROLL]: t('layout_vertical_scroll'),
  }), [t]);

  return { visualStyleLabels, targetAudienceLabels, genderLabels, worksheetTypeLabels, infographicArchitectureLabels, infographicLayoutFlowLabels };
};

// --- PREVIEW CAROUSEL COMPONENT ---
const CAROUSEL_ITEMS = [
  {
    id: 1,
    title: 'Matematika',
    icon: BookOpen,
    image: '/matematika.png',
    color: 'bg-rose-500'
  },
  {
    id: 2,
    title: 'Resep Masak',
    icon: ChefHat,
    image: '/recipe-soto.png',
    color: 'bg-orange-500'
  },
  {
    id: 3,
    title: 'Educational Infographic',
    icon: BarChart,
    image: '/infographic-fotosintesis.png',
    color: 'bg-emerald-500'
  },
  {
    id: 4,
    title: 'Kids Coding',
    icon: Terminal,
    image: '/koding.png',
    color: 'bg-indigo-500'
  },
  {
    id: 5,
    title: 'Lebaran Envelope',
    icon: Mail,
    image: '/lebaran envelope.png',
    color: 'bg-teal-500'
  },
  {
    id: 6,
    title: 'Hijaiyah',
    icon: Calculator,
    image: '/Hijaiyah.png',
    color: 'bg-blue-500'
  },
  {
    id: 7,
    title: 'Doa Harian',
    icon: BookOpen,
    image: '/doa.png',
    color: 'bg-emerald-600'
  },
  {
    id: 8,
    title: 'Resep Minuman',
    icon: ChefHat,
    image: '/resep minuman.png',
    color: 'bg-cyan-500'
  },
  {
    id: 9,
    title: 'Belajar Mewarnai',
    icon: Palette,
    image: '/mewarnai.png',
    color: 'bg-fuchsia-500'
  },
  {
    id: 10,
    title: 'Stay Healthy',
    icon: HeartPulse,
    image: '/stay healthy.png',
    color: 'bg-emerald-500'
  }
];

const CarouselCard = ({ item, isCenter, isLeft, isRight, isHovered, direction, onClick }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const lightX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const lightY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const background = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`;

  const hoverValue = useMotionValue(0);
  useEffect(() => {
    hoverValue.set(isHovered ? 1 : 0);
  }, [isHovered, hoverValue]);
  const hoverSpring = useSpring(hoverValue, { stiffness: 300, damping: 30 });

  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);
  
  // Interpolate shadow properties based on hover state
  const shadowYBase = useTransform(hoverSpring, [0, 1], [25, 0]);
  const shadowBlur = useTransform(hoverSpring, [0, 1], [50, 50]);
  const shadowSpread = useTransform(hoverSpring, [0, 1], [-10, -10]);
  const shadowAlpha = useTransform(hoverSpring, [0, 1], [0.2, 0.3]);
  
  const boxShadow = useMotionTemplate`${shadowX}px calc(${shadowY}px + ${shadowYBase}px) ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowAlpha}), 0 0 30px rgba(59, 130, 246, 0.15)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCenter) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      custom={direction}
      variants={{
        initial: (dir) => ({ 
          x: dir === 1 ? (isRight ? 280 : -280) : (isLeft ? -280 : 280), 
          scale: 0.8, 
          opacity: 0,
          zIndex: 0
        }),
        animate: { 
          x: isCenter ? 0 : isLeft ? -200 : 200,
          scale: isCenter ? (isHovered ? 1.05 : 1.0) : 0.92,
          opacity: isCenter ? 1 : 0.85,
          zIndex: isCenter ? 10 : 5,
          y: isCenter ? (isHovered ? -6 : 0) : 0,
          boxShadow: isCenter 
            ? '0 25px 50px -10px rgba(0, 0, 0, 0.2), 0 0 30px rgba(59, 130, 246, 0.15)'
            : '0 10px 20px -5px rgba(0, 0, 0, 0.1)'
        },
        exit: (dir) => ({ 
          x: dir === 1 ? -280 : 280, 
          scale: 0.8, 
          opacity: 0,
          zIndex: 0
        })
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        rotateX: isCenter ? rotateX : 0,
        rotateY: isCenter ? rotateY : 0,
        boxShadow: isCenter ? boxShadow : undefined,
        transformStyle: "preserve-3d",
      }}
      className="absolute w-[180px] aspect-[4/5] rounded-2xl cursor-pointer"
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative w-full h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div 
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ transform: "translateZ(20px)" }}
        >
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
          {item.content && item.content}
        </motion.div>
        
        {/* Top Label */}
        <motion.div 
          className="absolute top-3 left-3 right-3 flex items-center gap-1.5 bg-slate-900/80 dark:bg-slate-800/90 border border-white/20 dark:border-slate-600/50 rounded-xl p-1.5 shadow-lg"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className={`p-1 rounded-lg ${item.color} text-white`}>
            <item.icon className="w-3 h-3" />
          </div>
          <span className="text-white font-semibold text-[10px] tracking-tight truncate shadow-sm">{item.title}</span>
        </motion.div>

        {/* Dynamic Lighting */}
        {isCenter && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: background,
              opacity: hoverSpring,
              transform: "translateZ(50px)"
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

const PreviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const getVisibleItems = () => {
    const items = [];
    for (let i = -1; i <= 1; i++) {
      let index = (currentIndex + i) % CAROUSEL_ITEMS.length;
      if (index < 0) index += CAROUSEL_ITEMS.length;
      items.push({ ...CAROUSEL_ITEMS[index], offset: i });
    }
    return items;
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      <div className="flex justify-center items-center h-[280px] relative" style={{ transformStyle: "preserve-3d" }}>
        <AnimatePresence initial={false} custom={direction}>
          {getVisibleItems().map((item) => {
            const isCenter = item.offset === 0;
            const isLeft = item.offset === -1;
            const isRight = item.offset === 1;

            return (
              <CarouselCard
                key={item.id}
                item={item}
                isCenter={isCenter}
                isLeft={isLeft}
                isRight={isRight}
                isHovered={isHovered}
                direction={direction}
                onClick={() => {
                  if (isLeft) {
                    setDirection(-1);
                    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
                  }
                  if (isRight) {
                    setDirection(1);
                    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
                  }
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-3 mb-2 md:mb-3">
        {CAROUSEL_ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? 'bg-blue-600 w-[18px]' : 'bg-slate-300 dark:bg-slate-700 w-1.5 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const PerspectiveGrid = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 3D Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '1000px',
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* The Grid Plane */}
        <div 
          className="absolute w-[400vw] h-[400vh] bottom-[-100vh] text-slate-900/20 dark:text-white/20"
          style={{
            transform: 'rotateX(75deg) translateZ(-200px)',
            transformOrigin: 'bottom center',
            backgroundImage: `
              linear-gradient(to right, currentColor 2px, transparent 2px),
              linear-gradient(to bottom, currentColor 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          {/* Secondary larger grid for depth layering */}
          <div 
            className="absolute inset-0 text-slate-900/30 dark:text-white/30"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 3px, transparent 3px),
                linear-gradient(to bottom, currentColor 3px, transparent 3px)
              `,
              backgroundSize: '400px 400px',
            }}
          ></div>
        </div>
      </div>

      {/* Top fade out for natural transition */}
      <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-slate-50 via-slate-50/50 to-transparent dark:from-slate-950 dark:via-slate-950/50 dark:to-transparent z-10"></div>
      
      {/* Vignette / Shading on sides */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-transparent to-slate-50/50 dark:from-slate-950/50 dark:via-transparent dark:to-slate-950/50 z-10"></div>
    </div>
  );
};

export const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [geminiResult, setGeminiResult] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  // `newPageItem` state and related functions are removed as `pageSequence` is no longer used for Infographic.
  const [assetCounts, setAssetCounts] = useState({
    char: 0,
    logo: 0,
    ref: 0,
    attr: 0
  });
  
  // Track which item has been copied
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const { t } = useLanguage();
  const { visualStyleLabels, targetAudienceLabels, genderLabels, worksheetTypeLabels, infographicArchitectureLabels, infographicLayoutFlowLabels } = useEnumTranslations();

  // Helper to get grouped worksheet options for Select
  const getWorksheetGroups = (): SelectGroup[] => [
    {
      label: "A. BERPIKIR LOGIS (LOGICAL)",
      options: [
        { value: WorksheetType.TRUE_FALSE, label: worksheetTypeLabels[WorksheetType.TRUE_FALSE] },
        { value: WorksheetType.TABLE_COMPLETION, label: worksheetTypeLabels[WorksheetType.TABLE_COMPLETION] },
        { value: WorksheetType.CLASSIFICATION, label: worksheetTypeLabels[WorksheetType.CLASSIFICATION] },
        { value: WorksheetType.SEQUENCING, label: worksheetTypeLabels[WorksheetType.SEQUENCING] },
        { value: WorksheetType.IMAGE_ANALYSIS, label: worksheetTypeLabels[WorksheetType.IMAGE_ANALYSIS] },
      ]
    },
    {
      label: "B. EKSPRESI & BAHASA",
      options: [
        { value: WorksheetType.OPINION_WRITING, label: worksheetTypeLabels[WorksheetType.OPINION_WRITING] },
        { value: WorksheetType.PARAPHRASING, label: worksheetTypeLabels[WorksheetType.PARAPHRASING] },
        { value: WorksheetType.SENTENCE_COMPLETION, label: worksheetTypeLabels[WorksheetType.SENTENCE_COMPLETION] },
        { value: WorksheetType.STORY_WRITING, label: worksheetTypeLabels[WorksheetType.STORY_WRITING] },
      ]
    },
    {
      label: "C. KREATIF",
      options: [
        { value: WorksheetType.DIRECTED_DRAWING, label: worksheetTypeLabels[WorksheetType.DIRECTED_DRAWING] },
        { value: WorksheetType.MIND_MAP, label: worksheetTypeLabels[WorksheetType.MIND_MAP] },
        { value: WorksheetType.COMIC_STRIP, label: worksheetTypeLabels[WorksheetType.COMIC_STRIP] },
        { value: WorksheetType.COLLAGE, label: worksheetTypeLabels[WorksheetType.COLLAGE] },
      ]
    },
    {
      label: "D. INTERAKTIF",
      options: [
        { value: WorksheetType.DRAG_DROP, label: worksheetTypeLabels[WorksheetType.DRAG_DROP] },
        { value: WorksheetType.PUZZLE, label: worksheetTypeLabels[WorksheetType.PUZZLE] },
        { value: WorksheetType.TRUE_FALSE_REASON, label: worksheetTypeLabels[WorksheetType.TRUE_FALSE_REASON] },
        { value: WorksheetType.ROLE_PLAY, label: worksheetTypeLabels[WorksheetType.ROLE_PLAY] },
      ]
    },
    {
      label: "E. HOTS (HIGHER ORDER)",
      options: [
        { value: WorksheetType.CASE_STUDY, label: worksheetTypeLabels[WorksheetType.CASE_STUDY] },
        { value: WorksheetType.PROBLEM_SOLVING, label: worksheetTypeLabels[WorksheetType.PROBLEM_SOLVING] },
        { value: WorksheetType.PREDICTION, label: worksheetTypeLabels[WorksheetType.PREDICTION] },
        { value: WorksheetType.COMPARE_CONTRAST, label: worksheetTypeLabels[WorksheetType.COMPARE_CONTRAST] },
      ]
    },
    {
      label: "F. ANAK USIA DINI (PAUD)",
      options: [
        { value: WorksheetType.TRACING, label: worksheetTypeLabels[WorksheetType.TRACING] },
        { value: WorksheetType.PATTERN_MATCHING, label: worksheetTypeLabels[WorksheetType.PATTERN_MATCHING] },
        { value: WorksheetType.GUESS_SYMBOL, label: worksheetTypeLabels[WorksheetType.GUESS_SYMBOL] },
      ]
    },
    {
      label: t('ws_group_coding'), // New group for coding
      options: [
        { value: WorksheetType.CODING_MATH, label: worksheetTypeLabels[WorksheetType.CODING_MATH] },
        { value: WorksheetType.CODING_COLOR, label: worksheetTypeLabels[WorksheetType.CODING_COLOR] },
        { value: WorksheetType.CODING_SHAPE, label: worksheetTypeLabels[WorksheetType.CODING_SHAPE] },
        { value: WorksheetType.CODING_MOVEMENT, label: worksheetTypeLabels[WorksheetType.CODING_MOVEMENT] },
        { value: WorksheetType.CODING_PATH, label: worksheetTypeLabels[WorksheetType.CODING_PATH] },
        { value: WorksheetType.CODING_IMAGE, label: worksheetTypeLabels[WorksheetType.CODING_IMAGE] },
        { value: WorksheetType.CODING_LOGIC, label: worksheetTypeLabels[WorksheetType.CODING_LOGIC] },
      ]
    },
    {
      label: "STANDARD / UMUM",
      options: [
        { value: WorksheetType.FILL_IN, label: worksheetTypeLabels[WorksheetType.FILL_IN] },
        { value: WorksheetType.MATCHING, label: worksheetTypeLabels[WorksheetType.MATCHING] },
        { value: WorksheetType.CHOICE, label: worksheetTypeLabels[WorksheetType.CHOICE] },
        { value: WorksheetType.COLORING, label: worksheetTypeLabels[WorksheetType.COLORING] },
        { value: WorksheetType.MIXED, label: worksheetTypeLabels[WorksheetType.MIXED] },
      ]
    }
  ];

  // Update handlers
  const updateData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (category: string) => {
      setAssetCounts(prev => ({
          ...prev,
          [category]: Math.min((prev as any)[category] + 1, 3)
      }));
  };

  const handleCopy = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    // Reset copy state after 2 seconds
    setTimeout(() => {
        setCopiedId(null);
    }, 2000);
  };

  const isWorksheet = formData.mode === PosterMode.WORKSHEET;
  const isInfographic = formData.mode === PosterMode.INFOGRAPHIC;
  const isEnvelope = formData.mode === PosterMode.ENVELOPE;

  // Helper to generate dynamic worksheet content (for autofill to material field)
  const generateWorksheetContent = useCallback((type: WorksheetType, title: string, topic: string, audience: TargetAudience, countStr: string) => {
    const safeTopic = topic || "Materi Umum";
    const safeTitle = title || "Latihan Siswa";
    const num = parseInt(countStr?.replace(/\D/g, '') || '5') || 5; 

    let content = `Judul: ${safeTitle}\\nTopik: ${safeTopic}\\nLevel: ${audience}\\n\\n`;

    // A. LOGICAL
    if (type === WorksheetType.TRUE_FALSE) {
        content += `Instruksi: Beri tanda centang (V) pada kolom Benar atau Salah.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. | [Pernyataan tentang ${safeTopic} ${i}] | ... | ... \\n`;
    } else if (type === WorksheetType.TABLE_COMPLETION) {
        content += `Instruksi: Lengkapi tabel berikut dengan informasi yang tepat.\\n\\n`;
        content += `KATEGORI A | KATEGORI B | KETERANGAN\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. [Item ${i}] | ........... | ........... \\n`;
    } else if (type === WorksheetType.CLASSIFICATION) {
        content += `Instruksi: Kelompokkan kata-words berikut ke dalam kategori yang benar.\\n\\n`;
        content += `KUMPULAN KATA: [Kata 1, Kata 2, Kata 3, ... terkait ${safeTopic}]\\n\\n`;
        content += `KELOMPOK 1: ........................\\nKELOMPOK 2: ........................\\n`;
    } else if (type === WorksheetType.SEQUENCING) {
        content += `Instruksi: Urutkan langkah/peristiwa berikut dengan memberi nomor 1-${num}.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `[ ] Langkah/Peristiwa acak ${i} tentang ${safeTopic}\\n`;
    } else if (type === WorksheetType.IMAGE_ANALYSIS) {
        content += `Instruksi: Perhatikan gambar di atas, lalu jawab pertanyaan berikut.\\n\\n`;
        content += `[Area untuk Gambar ${safeTopic}]\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. Apa yang terjadi pada gambar bagian ${i}?\\n`;
    } 
    // B. EXPRESSION
    else if (type === WorksheetType.OPINION_WRITING) {
        content += `Instruksi: Tuliskan pendapatmu tentang topik berikut.\\n\\n`;
        content += `Topik: "${safeTopic}"\\n\\nMenurut saya: ...................................................\\nAlasannya: ...................................................\\n`;
    } else if (type === WorksheetType.PARAPHRASING) {
        content += `Instruksi: Tulis ulang kalimat berikut dengan bahasamu sendiri.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. "[Kalimat asli ${i}]" \\n   -> ...................................................\\n`;
    } else if (type === WorksheetType.SENTENCE_COMPLETION) {
        content += `Instruksi: Lengkapi kalimat rumpang di bawah ini.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. ${safeTopic} adalah ........ karena ........\\n`;
    } else if (type === WorksheetType.STORY_WRITING) {
        content += `Instruksi: Tulis cerita pendek berdasarkan tema "${safeTopic}".\\n\\n`;
        content += `Judul Cerita: .....................\\n\\n[Area Menulis Paragraf 1]\\n[Area Menulis Paragraf 2]\\n`;
    }
    // C. CREATIVE
    else if (type === WorksheetType.DIRECTED_DRAWING) {
        content += `Instruksi: Ikuti langkah-langhat menggambar di bawah ini.\\n\\n`;
        content += `1. Gambar bentuk dasar...\\n2. Tambahkan detail...\\n3. Warnai sesuai kreasi.\\n[Box Kosong Besar untuk Menggambar]\\n`;
    } else if (type === WorksheetType.MIND_MAP) {
        content += `Instruksi: Buatlah Peta Konsep (Mind Map) tentang "${safeTopic}".\\n\\n`;
        content += `[Lingkaran Tengah: TOPIK UTAMA]\\n   -> Cabang 1: .................\\n   -> Cabang 2: .................\\n   -> Cabang 3: .................\\n`;
    } else if (type === WorksheetType.COMIC_STRIP) {
        content += `Instruksi: Lengkapi dialog dalam komik strip berikut.\\n\\n`;
        content += `[Panel 1: Gambar Karakter A & B] -> Balon Kata Kosong\\n[Panel 2: Konflik] -> Balon Kata Kosong\\n[Panel 3: Solusi] -> Balon Kata Kosong\\n`;
    } else if (type === WorksheetType.COLLAGE) {
        content += `Instruksi: Gunting gambar di lembar lampiran dan tempelkan di sini.\\n\\n`;
        content += `Tema: ${safeTopic}\\n[Area Tempel 1] [Area Tempel 2]\\n`;
    }
    // D. INTERACTIVE
    else if (type === WorksheetType.DRAG_DROP) {
        content += `Instruksi: Tarik garis atau potong-tempel objek ke tempat yang benar.\\n\\n`;
        content += `OBJEK: [Benda A], [Benda B], [Benda C]\\n\\nTEMPAT 1 (Kategori X): ...........\\nTEMPAT 2 (Kategori Y): ...........\\n`;
    } else if (type === WorksheetType.PUZZLE) {
        content += `Instruksi: Temukan kata-words berikut dalam kotak huruf (Word Search).\\n\\n`;
        for (let i = 1; i <= num; i++) content += `Cari Kata: ${safeTopic}1, ${safeTopic}2, ${safeTopic}3...\\n[Grid Kotak Huruf 10x10]\\n`;
    } else if (type === WorksheetType.TRUE_FALSE_REASON) {
        content += `Instruksi: Pilih Benar/Salah dan jelaskan alasanmu.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. Pernyataan: ...... [ B / S ]\\n   Alasan: ........................\\n`;
    } else if (type === WorksheetType.ROLE_PLAY) {
        content += `Instruksi: Lakukan peran berikut bersama temanmu.\\n\\n`;
        content += `Skenario: ${safeTopic}\\nPeran A: ............\\nPeran B: ............\\nDialog:\\nA: ....................\\nB: ....................\\n`;
    }
    // E. HOTS
    else if (type === WorksheetType.CASE_STUDY) {
        content += `Instruksi: Baca kasus di bawah ini dan jawab pertanyaan analisis.\\n\\n`;
        content += `KASUS: "Sebuah masalah terjadi pada ${safeTopic}..."\\n\\n1. Apa penyebab utama masalah?\\n2. Bagaimana dampaknya?\\n3. Apa solusi terbaik menurutmu?\\n`;
    } else if (type === WorksheetType.PROBLEM_SOLVING) {
        content += `Instruksi: Identifikasi masalah dan temukan solusinya.\\n\\n`;
        content += `Masalah: ........................\\nAkar Masalah: ........................\\nSolusi Alternatif 1: ........................\\nSolusi Alternatif 2: ........................\\nKeputusan: ........................\\n`;
    } else if (type === WorksheetType.PREDICTION) {
        content += `Instruksi: Apa yang akan terjadi selanjutnya? Jelaskan hipotesismu.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. Situasi Awal: ${safeTopic}....\\nPrediksi saya: ........................\\nBukti pendukung: ........................\\n`;
    } else if (type === WorksheetType.COMPARE_CONTRAST) {
        content += `Instruksi: Bandingkan dua hal berikut (Persamaan & Perbedaan).\\n\\n`;
        content += `HAL A vs HAL B\\n\\n[Diagram Venn atau Tabel]\\nPersamaan: ........................\\nPerbedaan A: ........................\\nBerbedaan B: ........................\\n`;
    }
    // F. PAUD
    else if (type === WorksheetType.TRACING) {
        content += `Instruksi: Tebalkan garis putus-putus berikut.\\n\\n`;
        content += `[Garis Putus-putus Pola ${safeTopic}]\\n[Garis Putus-putus Huruf]\\n[Garis Putus-putus Angka]\\n`;
    } else if (type === WorksheetType.PATTERN_MATCHING) {
        content += `Instruksi: Lingkari gambar yang melengkapi pola.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `1. Segitiga - Bulat - Segitiga - [ ..... ]\\n2. Merah - Biru - Merah - [ ..... ]\\n`;
    } else if (type === WorksheetType.GUESS_SYMBOL) {
        content += `Instruksi: Tebak nama gambar/simbol ini.\\n\\n`;
        content += `[Gambar ${safeTopic}]\\nIni adalah gambar: ....................\\n`;
    }
    // NEW KODING Types rules
    else if (type === WorksheetType.CODING_COLOR) {
      content += `
                KODING WORKSHEET RULES:
                - Code reference (colors) MAY be shown.
                - The RESULT area MUST be EMPTY.
                - NO decoded answers.
                - NO solved examples.
                - No arrows, lines, or paths drawn.
                - Objects MUST be uncolored or neutral (outline only).
                - Show a simple object for coloring, with a code number on it.
                - Provide a color key (e.g., [Color Box 1]: Red).
                - Only one activity variant.
                
                Instruksi: Warnai gambar gunting berikut ini berdasarkan kode angka yang tepat! Jangan warnai objek, sediakan hanya outline hitam putih.
                Contoh:
                KODE WARNA:
                [Lingkaran warna 1]: Hijau (1)
                [Lingkaran warna 2]: Biru (2)
                [Lingkaran warna 3]: Merah (3)
                [Lingkaran warna 4]: Teal (4)
                [Lingkaran warna 5]: Kuning (5)
                
                Area gambar untuk diwarnai: 5 Stickman dengan kode angka pada bagian tubuhnya, dan 2 baris lingkaran kosong untuk mewarnai.
              `;
    } else if (type === WorksheetType.CODING_SHAPE) {
      content += `
                KODING WORKSHEET RULES:
                - Code reference (shapes) MAY be shown.
                - The RESULT area MUST be EMPTY.
                - NO decoded answers.
                - NO solved examples.
                - No connecting lines drawn.
                - Show complex shapes on the left, and basic component shapes on the right.
                - Provide dots/placeholders for matching.
                - Only one activity variant.

                Instruksi: Perhatikan gambar di kiri, temukan bagian-bagiannya lalu hubungkan dengan garis ke bentuk dasar di kanan. Jangan gambar garis penghubung.
                Contoh:
                [Gambar bebek dari bentuk geometris] . -> [Kumpulan bentuk dasar acak (lingkaran, segitiga, setengah lingkaran)]
                [Gambar mobil dari bentuk geometris] . -> [Kumpulan bentuk dasar acak (persegi panjang, lingkaran, trapesium)]
              `;
    } else if (type === WorksheetType.CODING_MATH) {
      content += `
                KODING WORKSHEET RULES:
                - Code reference (symbols/images mapped to numbers) MUST be shown in a table.
                - The math problem area MUST be EMPTY for calculations.
                - NO decoded answers or solved examples.
                - Only one activity variant.

                Instruksi: isilah pertanyaan sesuai dengan kode pada tabel. Area soal harus kosong untuk jawaban.
                Contoh:
                TABEL KODE:
                [Gambar Payung] = 1
                [Gambar Ember] = 2
                [Gambar Gayung] = 3
                [Gambar Jas Hujan] = 4
                [Gambar Selang] = 5
                [Gambar Bola Pantai] = 6
                [Gambar Shower] = 7
                [Gambar Handuk] = 8
                [Gambar Bebek Mainan] = 9
                
                Soal:
                [Gambar Ember] + [Gambar Payung] = ...... + ...... = ......
                [Gambar Jas Hujan] + [Gambar Selang] = ...... + ...... = ......
              `;
    } else if (type === WorksheetType.CODING_MOVEMENT) {
      content += `
                KODING WORKSHEET RULES:
                - Show a grid map with START/END points and simple obstacles.
                - The path/route MUST NOT be drawn.
                - Provide separate arrow pieces (up, down, left, right) for cutting and pasting.
                - The area for placing the movement sequence MUST be EMPTY.
                - Only one activity variant.

                Instruksi: Bantu Daniel mencari jalan menuju rumah dengan tepat! Sediakan potongan panah arah terpisah (atas, bawah, kiri, kanan) untuk digunting dan ditempel pada kotak yang kosong di bawah grid. Jangan gambar jalur solusi. Hanya satu aktivitas jenis ini.
                Contoh:
                [Grid peta 7x4 kosong dengan karakter Daniel di pojok kanan atas, rumah di pojok kiri bawah, and beberapa batu sebagai rintangan]
                
                Potong kemudian tempel tanda arah pada kotak di bawah ini!
                [7 Kotak kosong berlabel 1-7 untuk urutan gerakan]
                [Area dengan gambar panah arah untuk digunting: ↑ ↓ ← →]
              `;
    } else if (type === WorksheetType.CODING_PATH) {
      content += `
                KODING WORKSHEET RULES:
                - Show a blank maze with start/end points, no solution path drawn.
                - Provide basic directional symbols (↑ ↓ ← →).
                - The area for writing the path sequence MUST be EMPTY.
                - Only one activity variant.

                Instruksi: Susun urutan simbol arah untuk memecahkan labirin dan tunjukkan jalurnya. Sediakan labirin kosong. Jangan gambar jalur solusi.
                Contoh:
                [Labirin kosong sederhana 5x5 with titik awal dan akhir, tanpa solusi]
                
                SIMBOL ARAH: ↑ ↓ ← → 
                
                Area untuk menulis urutan jalur: Baris kosong bergaris.
              `;
    } else if (type === WorksheetType.CODING_IMAGE) {
      content += `
                KODING WORKSHEET RULES:
                - Code reference (images mapped to letters) MUST be shown in a table.
                - The RESULT area MUST be EMPTY.
                - NO decoded answers.
                - NO solved examples.
                - Show a sequence of images to be decoded.
                - Only one activity variant.

                Instruksi: Terjemahkan gambar di bawah ini menjadi sebuah kalimat! Gunakan tabel kode yang disediakan. Area untuk menulis kalimat kosong.
                Contoh:
                TABEL KODE:
                a = [Gambar Cupcake Strawberry]
                b = [Gambar Cupcake Coklat]
                c = [Gambar Cupcake Biru]
                k = [Gambar Cupcake Pink]
                u = [Gambar Cupcake Kuning]
                r = [Gambar Cupcake Mint]
                s = [Gambar Cupcake Coklat Tua]
                m = [Gambar Cupcake Oranye]
                
                Deretan gambar cupcake untuk diterjemahkan: Beberapa baris berisi 6-8 gambar cupcake.
                Area kosong bergaris untuk menulis kalimat hasil terjemahan.
              `;
    } else if (type === WorksheetType.CODING_LOGIC) {
      content += `
                KODING WORKSHEET RULES:
                - Present a short problem/scenario.
                - Provide a list of possible actions.
                - The area for sequencing the logical steps MUST be EMPTY.
                - NO solved logical sequences or examples.
                - Only one activity variant.

                Instruksi: Pecahkan kode tersebut menjadi operasi bilangan dengan tepat! Gunakan tabel kode buah. Area soal harus kosong untuk jawaban.
                Contoh:
                TABEL KODE:
                1 = [Gambar Strawberry]
                2 = [Gambar Jeruk]
                3 = [Gambar Lemon]
                4 = [Gambar Kiwi]
                5 = [Gambar Apel]
                6 = [Gambar Labu]
                7 = [Gambar Mangga]
                8 = [Gambar Melon]
                9 = [Gambar Strawberry 2]
                0 = [Gambar Belimbing]
                
                Soal:
                [Gambar Strawberry] - [Gambar Jeruk] = ...... + ...... = ......
                [Gambar Labu] - [Gambar Lemon] = ...... + ...... = ......
                [Gambar Kiwi] - [Gambar Strawberry] = ...... + ...... = ......
              `;
    }
    // LEGACY / STANDARD
    else if (type === WorksheetType.FILL_IN) {
        content += `Instruksi: Lengkapi titik-titik di bawah ini dengan jawaban yang tepat.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. [Pertanyaan tentang ${safeTopic} no. ${i}] .....................................\\n`;
    } else if (type === WorksheetType.MATCHING) {
        content += `Instruksi: Tarik garis untuk menjodohkan bagian kiri dan kanan.\\n\\n`;
        content += `KOLOM KIRI (Konsep)          KOLOM KANAN (Jawaban)\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. [Item ${safeTopic} ${i}]                -> [Pasangan ${i}]\\n`;
    } else if (type === WorksheetType.CHOICE) {
        content += `Instruksi: Lingkari huruf A, B, atau C pada jawaban yang benar.\\n\\n`;
        for (let i = 1; i <= num; i++) content += `${i}. Soal tentang ${safeTopic} nomor ${i}?\\n   A. [Pilihan 1]\\n   B. [Pilihan 2]\\n   C. [Pilihan 3]\\n\\n`;
    } else if (type === WorksheetType.COLORING) {
        content += `Instruksi: Warnai gambar di bawah ini dengan rapi.\\n\\n`;
        content += `Objek Utama: Ilustrasi besar bertema "${safeTopic}"\\n`;
        content += `Detail Elemen:\\n- [Objek 1 terkait ${safeTopic}]\\n- [Objek 2 terkait ${safeTopic}]\\n- Latar belakang suasana yang ceria.\\n`;
        content += `Area Kosong: Sediakan area kosong di bawah untuk menulis nama siswa.`;
    } else {
        // Mixed or Default
        content += `Instruksi: Kerjakan berbagai jenis soal di bawah ini.\\n\\n`;
        content += `A. PILIHAN GANDA\\n1. Soal...\\n\\nB. MENJODOHKAN\\n1. Soal...\\n\\nC. ISIAN\\n1. Soal...\\n`;
    }
    return content;
  }, [t]); // Add 't' as a dependency if translations are used inside

  const handlePresetChange = (presetKey: string) => {
    // 1. Update the preset key itself
    updateData('preset', presetKey);

    // 2. Find and apply the data if it exists
    if (presetKey && PRESET_LIBRARY[presetKey]) {
      const presetData = PRESET_LIBRARY[presetKey];
      
      // Special logic for Worksheet: Generate material dynamic if it's not hardcoded in preset
      let dynamicMaterial = presetData.material;
      let dynamicMaterials: string[] = [];
      const pCount = presetData.worksheetPromptCount || formData.worksheetPromptCount || 1;

      if (formData.mode === PosterMode.WORKSHEET) {
        if (!dynamicMaterial) {
          if (pCount > 1) {
            for (let i = 0; i < pCount; i++) {
              const itemTitle = `${presetData.title || 'Latihan'} - Bagian ${i + 1}`;
              dynamicMaterials.push(generateWorksheetContent(
                presetData.worksheetType as WorksheetType || WorksheetType.FILL_IN,
                itemTitle,
                presetData.topic || '',
                formData.targetAudience as TargetAudience,
                presetData.questionCount || '5'
              ));
            }
            dynamicMaterial = dynamicMaterials[0] || '';
          } else {
            dynamicMaterial = generateWorksheetContent(
              presetData.worksheetType as WorksheetType || WorksheetType.FILL_IN,
              presetData.title || 'Latihan',
              presetData.topic || '',
              formData.targetAudience as TargetAudience,
              presetData.questionCount || '5'
            );
            dynamicMaterials = [dynamicMaterial];
          }
        } else {
          dynamicMaterials = [dynamicMaterial];
        }
      }

      setFormData(prev => ({
        ...prev,
        ...presetData,
        material: dynamicMaterial || presetData.material || '', // Apply generated material
        materials: dynamicMaterials.length > 0 ? dynamicMaterials : (presetData.materials || [presetData.material || '']),
        preset: presetKey 
      }));
    }
  };

  const reset = () => {
    setFormData(INITIAL_DATA);
    setStep(AppStep.MENU);
    setGeminiResult("");
  };

  // Fix: Update `context` parameter type to include 'cta' and 'funFact'
  const autoFill = async (context: 'topic' | 'title' | 'subtitle' | 'material' | 'cta' | 'funFact' = 'topic') => {
    setIsAutofilling(true);
    try {
      // Use AI to generate content if we can, especially if topic is provided or we want creative defaults
      // Fix: Pass `showFunFact` and `funFact` to `generateAutoFillContent`
      const generatedData = await generateAutoFillContent(
        formData.mode || PosterMode.POSTER, // Pass PosterMode enum for better typing
        {
          topic: formData.topic,
          title: formData.title,
          subtitle: formData.subtitle,
          worksheetType: formData.worksheetType as WorksheetType, // Pass worksheetType
          targetAudience: formData.targetAudience as TargetAudience, // Pass targetAudience
          showFunFact: formData.showFunFact, // Pass showFunFact
          funFact: formData.funFact, // Pass current funFact
        },
        context
      );
      
      if (generatedData && Object.keys(generatedData).length > 0) {
        // AI Success: Apply generated data
        if (generatedData.topic) updateData('topic', generatedData.topic);
        if (generatedData.title) updateData('title', generatedData.title);
        if (generatedData.subtitle) updateData('subtitle', generatedData.subtitle);
        if (generatedData.material) {
          updateData('material', generatedData.material);
          const pCount = formData.worksheetPromptCount || 1;
          const mats: string[] = [];
          for (let i = 0; i < pCount; i++) {
            if (i === 0) {
              mats.push(generatedData.material);
            } else {
              mats.push('');
            }
          }
          updateData('materials', mats);
        }
        if (generatedData.visualTheme) updateData('visualTheme', generatedData.visualTheme);
        if (generatedData.infographicArchitectureType) updateData('infographicArchitectureType', generatedData.infographicArchitectureType);
        if (generatedData.infographicLayoutFlow) updateData('infographicLayoutFlow', generatedData.infographicLayoutFlow);
        if (generatedData.cta) updateData('cta', generatedData.cta); // Apply generated CTA
        if (generatedData.funFact) updateData('funFact', generatedData.funFact); // Apply generated Fun Fact
        
        // Defaults for other fields if empty
        if (!formData.cta && !isInfographic && !isEnvelope) updateData('cta', 'Yuk amalkan setiap hari!'); // Existing CTA default, check if Infographic is covered
        if (!formData.senderName && isEnvelope) updateData('senderName', 'Keluarga Bpk. Ahmad');
        if (!formData.recipientName && isEnvelope) updateData('recipientName', 'Untuk: .........');
        
      } else {
        // Fallback to old hardcoded defaults if AI fails or returns empty
        if (isWorksheet) {
          const currentTitle = formData.title || 'Latihan Harian';
          const currentTopic = formData.topic || 'Pengetahuan Umum';
          const currentType = formData.worksheetType as WorksheetType || WorksheetType.FILL_IN;
          const currentCount = formData.questionCount || '10 Soal';
          
          if (!formData.title) updateData('title', currentTitle);
          if (!formData.subtitle) updateData('subtitle', 'Lembar Kerja Siswa');
          if (!formData.topic) updateData('topic', currentTopic);
          if (!formData.worksheetType) updateData('worksheetType', currentType);
          if (!formData.questionCount) updateData('questionCount', currentCount);
          if (!formData.size) updateData('size', AspectRatio.A4);
          if (!formData.cta) updateData('cta', 'Nama: _________  Nilai: ____');
          if (!formData.visualTheme) updateData('visualTheme', 'Bersih, Edukatif, Ikon Menarik');

          const pCount = formData.worksheetPromptCount || 1;
          if (pCount > 1) {
            const mats: string[] = [];
            for (let i = 0; i < pCount; i++) {
              const itemTitle = pCount > 1 ? `${currentTitle} - Bagian ${i + 1}` : currentTitle;
              mats.push(generateWorksheetContent(currentType, itemTitle, currentTopic, formData.targetAudience as TargetAudience, currentCount));
            }
            updateData('materials', mats);
            updateData('material', mats[0] || '');
          } else {
            const generatedMaterial = generateWorksheetContent(currentType, currentTitle, currentTopic, formData.targetAudience as TargetAudience, currentCount);
            updateData('material', generatedMaterial);
            updateData('materials', [generatedMaterial]);
          }

        } else if (isInfographic) {
          updateData('title', 'INFOGRAFIS: Pentingnya Menjaga Kebersihan');
          updateData('subtitle', 'Panduan Sehari-hari untuk Hidup Sehat');
          updateData('material', '- Cuci Tangan dengan Sabun\\n- Mandi Dua Kali Sehari\\n- Buang Sampah pada Tempatnya\\n- Jaga Kebersihan Lingkungan');
          updateData('topic', 'Kesehatan & Kebersihan');
          updateData('cta', 'Yuk jaga kebersihan!');
          updateData('visualTheme', 'Clean White Paper Aesthetic');
          updateData('size', AspectRatio.R_9_16); // Common ratio for infographics
          updateData('infographicArchitectureType', InfographicArchitectureType.STEP_BY_STEP_PROCESS);
          updateData('infographicLayoutFlow', InfographicLayoutFlow.VERTICAL_SCROLL);
          updateData('targetAudience', TargetAudience.ADULT);
          if (formData.showFunFact) updateData('funFact', 'Tahukah kamu, mencuci tangan bisa membunuh jutaan kuman!');
        } else if (isEnvelope) {
          updateData('title', 'SELAMAT IDUL FITRI');
          updateData('subtitle', 'Mohon Maaf Lahir & Batin - 1446 H');
          updateData('senderName', 'Keluarga Besar Bpk. Ahmad');
          updateData('recipientName', 'Untuk: Keponakan Tersayang');
          updateData('material', 'Semoga berkah dan bermanfaat. Jangan lupa ditabung ya!');
          updateData('visualTheme', 'Nuansa Hijau Emas, Ketupat, Masjid, Ceria');
          updateData('size', AspectRatio.ENV_SMALL);
        } else {
          updateData('title', 'Adab Makan & Minum');
          updateData('subtitle', 'Sunnah Rasulullah SAW');
          updateData('material', '1. Mencuci tangan\\n2. Membaca Bismillah\\n3. Makan dengan tangan kanan\\n4. Tidak sambil berdiri');
          updateData('topic', 'Pendidikan Agama Islam / Akhlak');
          updateData('cta', 'Yuk amalkan setiap hari!');
          updateData('visualTheme', 'Ceria, warna pastel, taman hijau');
        }
      }
    } catch (e) {
      console.error("AutoFill Error:", e);
    } finally {
      setIsAutofilling(false);
    }
  };

  // Helper function for common worksheet visual instructions
  const generateWorksheetVisualRules = useCallback((
    formData: FormData, 
    worksheetTypeLabels: Record<WorksheetType, string>, 
    targetAudienceLabels: Record<TargetAudience, string>,
    customMaterial?: string
  ) => {
    const selectedWorksheetTypeLabel = worksheetTypeLabels[formData.worksheetType as WorksheetType] || formData.worksheetType;
    const selectedTargetAudienceLabel = targetAudienceLabels[formData.targetAudience as TargetAudience] || formData.targetAudience;
    const safeTopic = formData.topic || 'General Education'; // Use safeTopic consistently
    const title = formData.title || 'Worksheet';
    const subtitle = formData.subtitle || 'Activity';
    const questionCount = formData.questionCount || '5';
    const material = customMaterial !== undefined ? customMaterial : formData.material; 
    const num = parseInt(questionCount.replace(/\D/g, '') || '5') || 5; // Define num here
    const type = formData.worksheetType as WorksheetType; // Define type here

    let activitySpecificRules = '';
    let stylePresetRules = '';

    // Activity-Specific Blank Rules
    if (type === WorksheetType.TRUE_FALSE) {
        activitySpecificRules = `Tampilkan pertanyaan Benar-Salah dengan kotak kosong untuk tanda. Jangan isi jawaban. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.TABLE_COMPLETION) {
        activitySpecificRules = `Tampilkan tabel dengan beberapa kolom kosong untuk diisi. Jangan isi jawaban. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.CLASSIFICATION) {
        activitySpecificRules = `Tampilkan daftar kata atau gambar untuk dikelompokkan ke dalam kategori yang benar. Sediakan ruang kosong untuk kategori. Jangan isi kategori. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.SEQUENCING) {
        activitySpecificRules = `Tampilkan item atau langkah-langkah dalam urutan acak dengan ruang kosong untuk penomoran. Jangan urutkan. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.IMAGE_ANALYSIS) {
        activitySpecificRules = `Tampilkan satu gambar untuk dianalisis dan pertanyaan terbuka di bawahnya. Jangan berikan analisis atau jawaban. Hanya satu aktivitas jenis ini.`;
    } 
    // B. EXPRESSION
    else if (type === WorksheetType.OPINION_WRITING) {
        activitySpecificRules = `Tampilkan satu prompt pertanyaan terbuka. Sediakan area menulis yang luas, kosong. Jangan berikan contoh tulisan. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.PARAPHRASING) {
        activitySpecificRules = `Tampilkan kalimat asli dan ruang kosong di bawahnya untuk parafrasa. Jangan parafrasa. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.SENTENCE_COMPLETION) {
        activitySpecificRules = `Tampilkan kalimat-kalimat dengan bagian kosong di tengah atau akhir. Jangan lengkapi kalimat. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.STORY_WRITING) {
        activitySpecificRules = `Tulis cerita pendek berdasarkan tema "${safeTopic}". Sediakan area menulis yang luas, kosong. Jangan berikan contoh cerita. Hanya satu aktivitas jenis ini.`;
    }
    // C. CREATIVE
    else if (type === WorksheetType.DIRECTED_DRAWING) {
        activitySpecificRules = `Tampilkan instruksi menggambar langkah demi langkah (teks saja). Sediakan kanvas kosong untuk menggambar. Jangan sertakan gambar yang sudah jadi. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.MIND_MAP) {
        activitySpecificRules = `Tampilkan ide utama ("${safeTopic}") di tengah. Sediakan cabang-cabang kosong untuk diisi. Jangan isi peta pikiran. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.COMIC_STRIP) {
        activitySpecificRules = `Tampilkan panel-panel komik dengan balon kata kosong. Jangan isi dialog atau gambar lengkap. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.COLLAGE) {
        activitySpecificRules = `Tampilkan area kosong untuk menempelkan potongan gambar. Sediakan potongan gambar terpisah (jika relevan). Jangan tempelkan gambar. Hanya satu aktivitas jenis ini.`;
    }
    // D. INTERACTIVE
    else if (type === WorksheetType.DRAG_DROP) {
        activitySpecificRules = `Tampilkan item-item untuk diseret atau dipotong/tempel dan area penempatan kosong yang relevan. Jangan letakkan item di tempatnya. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.PUZZLE) {
        activitySpecificRules = `Tampilkan satu jenis puzzle (misal: labirin, pencarian kata, teka-teki silang) dalam format kosong. JANGAN tampilkan jalur solusi atau jawaban puzzle. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.TRUE_FALSE_REASON) {
        activitySpecificRules = `Tampilkan pernyataan dengan pilihan Benar/Salah dan ruang kosong untuk alasan. Jangan pilih atau tulis alasan. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.ROLE_PLAY) {
        activitySpecificRules = `Tampilkan skenario dan peran untuk permainan peran. Jangan sertakan contoh dialog. Hanya satu aktivitas jenis ini.`;
    }
    // E. HOTS
    else if (type === WorksheetType.CASE_STUDY) {
        activitySpecificRules = `Tampilkan deskripsi studi kasus ("Sebuah masalah terjadi pada ${safeTopic}...") dan pertanyaan analisis. Sediakan area kosong untuk jawaban. Jangan berikan solusi. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.PROBLEM_SOLVING) {
        activitySpecificRules = `Tampilkan deskripsi masalah. Sediakan area kosong untuk mengidentifikasi masalah, akar masalah, dan solusi. Jangan pecahkan masalah. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.PREDICTION) {
        activitySpecificRules = `Tampilkan situasi awal dan pertanyaan prediksi. Sediakan area kosong untuk prediksi dan hipotesis. Jangan berikan prediksi. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.COMPARE_CONTRAST) {
        activitySpecificRules = `Instruksi: Bandingkan dua hal berikut (Persamaan & Perbedaan).\\n\\n`;
        activitySpecificRules += `HAL A vs HAL B\\n\\n[Diagram Venn atau Tabel]\\nPersamaan: ........................\\nPerbedaan A: ........................\\nBerbedaan B: ........................\\n`;
    }
    // F. PAUD
    else if (type === WorksheetType.TRACING) {
        activitySpecificRules = `Tampilkan garis putus-putus untuk menjiplak (huruf, angka, bentuk) terkait "${safeTopic}". Jangan sertakan garis yang sudah tersambung. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.PATTERN_MATCHING) {
        activitySpecificRules = `Tampilkan urutan pola dengan bagian yang hilang. Sediakan pilihan kosong atau ruang kosong untuk melengkapi pola. Jangan lengkapi pola. Hanya satu aktivitas jenis ini.`;
    } else if (type === WorksheetType.GUESS_SYMBOL) {
        activitySpecificRules = `Tampilkan gambar/simbol terkait "${safeTopic}" and ruang kosong untuk menebak namanya. Jangan sertakan jawaban. Hanya satu aktivitas jenis ini.`;
    }
    // NEW KODING Types rules
    else if (type === WorksheetType.CODING_COLOR) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Code reference (colors) MAY be shown.
            - THE RESULT AREA MUST BE EMPTY.
            - NO decoded answers.
            - NO solved examples.
            - No arrows, lines, or paths drawn.
            - Objects MUST be uncolored or neutral (outline only).
            - Show a simple object for coloring, with a code number on it.
            - Provide a color key (e.g., [Color Box 1]: Red).
            - Only one activity variant.
            
            Instruksi: Warnai gambar gunting berikut ini berdasarkan kode angka yang tepat! Jangan warnai objek, sediakan hanya outline hitam putih.
            Contoh:
            KODE WARNA:
            [Lingkaran warna 1]: Hijau (1)
            [Lingkaran warna 2]: Biru (2)
            [Lingkaran warna 3]: Merah (3)
            [Lingkaran warna 4]: Teal (4)
            [Lingkaran warna 5]: Kuning (5)
            
            Area gambar untuk diwarnai: 5 Stickman dengan kode angka pada bagian tubuhnya, dan 2 baris lingkaran kosong untuk mewarnai.
          `;
    } else if (type === WorksheetType.CODING_SHAPE) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Code reference (shapes) MAY be shown.
            - THE RESULT AREA MUST BE EMPTY.
            - NO decoded answers.
            - NO solved examples.
            - No connecting lines drawn.
            - Show complex shapes on the left, and basic component shapes on the right.
            - Provide dots/placeholders for matching.
            - Only one activity variant.

            Instruksi: Perhatikan gambar di kiri, temukan bagian-bagiannya lalu hubungkan dengan garis ke bentuk dasar di kanan. Jangan gambar garis penghubung.
            Contoh:
            [Gambar bebek dari bentuk geometris] . -> [Kumpulan bentuk dasar acak (lingkaran, segitiga, setengah lingkaran)]
            [Gambar mobil dari bentuk geometris] . -> [Kumpulan bentuk dasar acak (persegi panjang, lingkaran, trapesium)]
          `;
    } else if (type === WorksheetType.CODING_MATH) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Code reference (symbols/images mapped to numbers) MUST be shown in a table.
            - The math problem area MUST be EMPTY for calculations.
            - NO decoded answers or solved examples.
            - Only one activity variant.

            Instruksi: isilah pertanyaan sesuai dengan kode pada tabel. Area soal harus kosong untuk jawaban.
            Contoh:
            TABEL KODE:
            [Gambar Payung] = 1
            [Gambar Ember] = 2
            [Gambar Gayung] = 3
            [Gambar Jas Hujan] = 4
            [Gambar Selang] = 5
            [Gambar Bola Pantai] = 6
            [Gambar Shower] = 7
            [Gambar Handuk] = 8
            [Gambar Bebek Mainan] = 9
            
            Soal:
            [Gambar Ember] + [Gambar Payung] = ...... + ...... = ......
            [Gambar Jas Hujan] + [Gambar Selang] = ...... + ...... = ......
          `;
    } else if (type === WorksheetType.CODING_MOVEMENT) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Show a grid map with START/END points and simple obstacles.
            - THE PATH/ROUTE MUST NOT BE DRAWN.
            - Provide separate arrow pieces (up, down, left, right) for cutting and pasting.
            - THE AREA FOR PLACING THE MOVEMENT SEQUENCE MUST BE EMPTY.
            - Only one activity variant.

            Instruksi: Bantu Daniel mencari jalan menuju rumah dengan tepat! Sediakan potongan panah arah terpisah (atas, bawah, kiri, kanan) untuk digunting dan ditempel pada kotak yang kosong di bawah grid. Jangan gambar jalur solusi. Hanya satu aktivitas jenis ini.
            Contoh:
            [Grid peta 7x4 kosong dengan karakter Daniel di pojok kanan atas, rumah di pojok kiri bawah, and beberapa batu sebagai rintangan]
            
            Potong kemudian tempel tanda arah pada kotak di bawah ini!
            [7 Kotak kosong berlabel 1-7 untuk urutan gerakan]
            [Area dengan gambar panah arah untuk digunting: ↑ ↓ ← →]
          `;
    } else if (type === WorksheetType.CODING_PATH) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Show a blank maze with start/end points, no solution path drawn.
            - Provide basic directional symbols (↑ ↓ ← →).
            - THE AREA FOR WRITING THE PATH SEQUENCE MUST BE EMPTY.
            - Only one activity variant.

            Instruksi: Susun urutan simbol arah untuk memecahkan labirin dan tunjukkan jalurnya. Sediakan labirin kosong. Jangan gambar jalur solusi.
            Contoh:
            [Labirin kosong sederhana 5x5 with titik awal dan akhir, tanpa solusi]
            
            SIMBOL ARAH: ↑ ↓ ← → 
            
            Area untuk menulis urutan jalur: Baris kosong bergaris.
          `;
    } else if (type === WorksheetType.CODING_IMAGE) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Code reference (images mapped to letters) MUST be shown in a table.
            - THE RESULT AREA MUST BE EMPTY.
            - NO decoded answers.
            - NO solved examples.
            - Show a sequence of images to be decoded.
            - Only one activity variant.

            Instruksi: Terjemahkan gambar di bawah ini menjadi sebuah kalimat! Gunakan tabel kode yang disediakan. Area untuk menulis kalimat kosong.
            Contoh:
            TABEL KODE:
            a = [Gambar Cupcake Strawberry]
            b = [Gambar Cupcake Coklat]
            c = [Gambar Cupcake Biru]
            k = [Gambar Cupcake Pink]
            u = [Gambar Cupcake Kuning]
            r = [Gambar Cupcake Mint]
            s = [Gambar Cupcake Coklat Tua]
            m = [Gambar Cupcake Oranye]
            
            Deretan gambar cupcake untuk diterjemahkan: Beberapa baris berisi 6-8 gambar cupcake.
            Area kosong bergaris untuk menulis kalimat hasil terjemahan.
          `;
    } else if (type === WorksheetType.CODING_LOGIC) {
      activitySpecificRules = `
            KODING WORKSHEET RULES:
            - Present a short problem/scenario.
            - Provide a list of possible actions.
            - THE AREA FOR SEQUENCING THE LOGICAL STEPS MUST BE EMPTY.
            - NO solved logical sequences or examples.
            - Only one activity variant.

            Instruksi: Pecahkan kode tersebut menjadi operasi bilangan dengan tepat! Gunakan tabel kode buah. Area soal harus kosong untuk jawaban.
            Contoh:
            TABEL KODE:
            1 = [Gambar Strawberry]
            2 = [Gambar Jeruk]
            3 = [Gambar Lemon]
            4 = [Gambar Kiwi]
            5 = [Gambar Apel]
            6 = [Gambar Labu]
            7 = [Gambar Mangga]
            8 = [Gambar Melon]
            9 = [Gambar Strawberry 2]
            0 = [Gambar Belimbing]
            
            Soal:
            [Gambar Strawberry] - [Gambar Jeruk] = ...... + ...... = ......
            [Gambar Labu] - [Gambar Lemon] = ...... + ...... = ......
            [Gambar Kiwi] - [Gambar Strawberry] = ...... + ...... = ......
          `;
    }
    // LEGACY / STANDARD
    else if (type === WorksheetType.FILL_IN) {
        activitySpecificRules = `Instruksi: Lengkapi titik-titik di bawah ini dengan jawaban yang tepat.\\n\\n`;
        for (let i = 1; i <= num; i++) activitySpecificRules += `${i}. [Pertanyaan tentang ${safeTopic} no. ${i}] .....................................\\n`;
    } else if (type === WorksheetType.MATCHING) {
        activitySpecificRules = `Instruksi: Tarik garis untuk menjodohkan bagian kiri dan kanan.\\n\\n`;
        activitySpecificRules += `KOLOM KIRI (Konsep)          KOLOM KANAN (Jawaban)\\n`;
        for (let i = 1; i <= num; i++) activitySpecificRules += `${i}. [Item ${safeTopic} ${i}]                -> [Pasangan ${i}]\\n`;
    } else if (type === WorksheetType.CHOICE) {
        activitySpecificRules = `Instruksi: Lingkari huruf A, B, atau C pada jawaban yang benar.\\n\\n`;
        for (let i = 1; i <= num; i++) activitySpecificRules += `${i}. Soal tentang ${safeTopic} nomor ${i}?\\n   A. [Pilihan 1]\\n   B. [Pilihan 2]\\n   C. [Pilihan 3]\\n\\n`;
    } else if (type === WorksheetType.COLORING) {
        activitySpecificRules = `Instruksi: Warnai gambar di bawah ini dengan rapi.\\n\\n`;
        activitySpecificRules += `Objek Utama: Ilustrasi besar bertema "${safeTopic}"\\n`;
        activitySpecificRules += `Detail Elemen:\\n- [Objek 1 terkait ${safeTopic}]\\n- [Objek 2 terkait ${safeTopic}]\\n- Latar belakang suasana yang ceria.\\n`;
        activitySpecificRules += `Area Kosong: Sediakan area kosong di bawah untuk menulis nama siswa.`;
    } else {
        // Mixed or Default
        activitySpecificRules = `Instruksi: Kerjakan berbagai jenis soal di bawah ini.\\n\\n`;
        activitySpecificRules += `A. PILIHAN GANDA\\n1. Soal...\\n\\nB. MENJODOHKAN\\n1. Soal...\\n\\nC. ISIAN\\n1. Soal...\\n`;
    }

    // Populate stylePresetRules
    if (formData.visualTheme === 'minimal_white_frame_edu') {
      stylePresetRules = `
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      STYLE PRESET (MANDATORY)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      STYLE_ID: minimal_white_frame_edu

      STYLE PURPOSE:
      A calm, clean, and focused worksheet style
      with dominant white background and minimal color usage,
      inspired by clean educational reference worksheets.

      BACKGROUND:
      - Pure white or very light off-white background (#FFFFFF – #FAFAFA)
      - Background MUST feel spacious and breathable
      - NO textures, NO patterns, NO gradients on background

      COLOR USAGE RULES (STRICT):
      - Colors are ALLOWED ONLY for:
        1. Outer border / frame
        2. Section outlines or dividers
        3. Educational illustrations (icons, shapes, objects)
      - Text colors MUST remain minimal:
        - Title: dark navy / deep charcoal
        - Body text: dark gray
        - No colorful text decorations

      BORDER & FRAME DESIGN:
      - A visible outer frame is REQUIRED
      - Frame style:
        - Rounded corners
        - Soft stroke
        - Single solid color
      - Frame color:
        - Pastel or muted tone (blue, mint, peach, light coral)
      - Border acts as the PRIMARY visual accent

      LAYOUT STRUCTURE:
      - Strong white space usage
      - Clear separation between:
        - Header
        - Activity area
        - Footer
      - Content aligned cleanly and symmetrically
      - Calm, uncluttered composition

      ILLUSTRATION STYLE:
      - Flat vector illustrations ONLY
      - Simple geometric shapes or icons
      - Solid fill colors
      - NO gradients, NO shadows, NO realism
      - Illustrations may be colorful
        BUT must not dominate the layout

      TEXT & TYPOGRAPHY:
      - Simple, rounded, readable font
      - Friendly but not playful-noisy
      - No decorative fonts
      - Text hierarchy is clear and minimal

      VISUAL MOOD:
      - Calm
      - Focused
      - Clean
      - Professional
      - Student-friendly

      FORBIDDEN ELEMENTS:
      - Colorful backgrounds
      - Excessive accent colors
      - Rainbow palettes
      - Decorative patterns
      - 3D illustrations
      - Photorealistic objects
      - Busy layouts

      RECOMMENDED USAGE:
      - Coding worksheets
      - Logic & reasoning worksheets
      - Classification & grouping
      - Pattern recognition
      - PAUD structured worksheets
      - SD upper level worksheets

      STYLE PRIORITY:
      If this style is selected,
      clarity and calmness take precedence
      over decorative creativity.
    `;
    } else if (formData.visualTheme === 'clean_white_paper') {
        stylePresetRules = `
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ENHANCED CLEAN WHITE PAPER VISUAL RULE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Lembar kerja DILARANG terlihat datar atau kosong, meskipun menggunakan estetika kertas putih bersih.

        PENINGKATAN VISUAL WAJIB:
        1. GUNAKAN KONTAINER STRUKTURAL LEMBUT
           - Persegi panjang membulat (Rounded rectangles)
           - Kartu lembut (Soft cards)
           - Panel terang untuk area konten
           - TIDAK boleh kotak tajam/keras

        2. GUNAKAN BENTUK AKSEN LATAR BELAKANG
           - Bentuk "blob", gelombang, awan, atau bentuk membulat yang halus (Subtle blobs, waves, clouds, or rounded shapes)
           - Opasitas sangat rendah (Very low opacity)
           - Ditempatkan di belakang konten, tidak mengganggu
           - Terinspirasi dari lembar kerja edukasi yang ramah anak

        3. BUAT HIERARKI VISUAL
           - Area judul di dalam blok header yang lembut
           - Area aktivitas di dalam kontainer utama yang membulat
           - Teks footer dipisahkan secara halus

        4. GUNAKAN AKSEN WARNA RAMAH
           - Warna pastel atau cerah lembut
           - Warna HARUS sesuai dengan tema topik
             (Matematika → aksen biru, hijau, kuning)
           - TIDAK boleh warna gelap, TIDAK boleh kontras keras

        5. TAMBAHKAN KEDALAMAN CAHAYA
           - Bayangan lembut (Soft shadows)
           - Elevasi halus pada kartu (Gentle elevation on cards)
           - Tampilan datar namun berlapis (Flat but layered look - BUKAN REALISME)

        6. JAGA KONTEN TETAP JELAS
           - Ruang putih DI DALAM kontainer
           - Jarak yang jelas antara elemen
           - TIDAK boleh berantakan/penuh

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        VISUAL STYLE REFERENCE BEHAVIOR
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Hasil visual harus terasa seperti:
        - Lembar kerja anak yang dapat dicetak
        - Materi kelas yang ramah
        - Mirip dengan contoh dengan:
          - Bingkai membulat
          - Desain yang ceria namun rapi
          - Aksen ilustrasi yang lembut

        DILARANG:
        - Halaman putih polos dengan elemen mengambang saja
        - Tekstur berat
        - Latar belakang foto-realistis
        - Tata letak yang terasa kosong

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        FINAL VISUAL CHECK
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Sebelum menyelesaikan lembar kerja:
        TANYAKAN PADA DIRI SENDIRI:
        "Apakah ini terasa hidup, ramah, dan menarik bagi anak-anak?"

        Jika jawabannya TIDAK:
        Anda HARUS meningkatkan struktur tata letak dan aksen visual
        sambil menjaga lembar kerja tetap aman dan kosong.
        `;
    } else if (formData.visualTheme === 'premium_kids_activity_infographic') {
        stylePresetRules = `
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PREMIUM KIDS ACTIVITY INFOGRAPHIC RULE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Style worksheet edukasi anak modern dengan tampilan premium seperti printable Pinterest/Etsy educational content. Menggabungkan konsep worksheet, infographic, activity board, dan visual storytelling.

        LAYOUT:
        Menggunakan format worksheet modern dengan modular card sections, asymmetrical/dynamic composition, sudut kotak membulat (rounded corners), layout mini infographic, dan struktur spacing yang rapi. Hindari layout kosong dan simetris monoton.

        COLOR SYSTEM & ADAPTATION:
        Otomatis menyelaraskan warna pastel modern bertema materi.
        - Islami: cream, gold, sage
        - Angka/Huruf: baby blue, peach, mint
        - Sains: sky blue, green, yellow
        - Kesehatan: teal, mint, aqua
        - Hewan/Buah: earthy brown/fresh palette
        
        ILUSTRASI & STORYTELLING:
        Gunakan karakter edukasi lucu bergaya kawaii (muslim/muslimah untuk agama islami, scientist untuk sains, dll.) yang menunjuk soal atau menemani aktivitas. Elemen dekorasi seperti awan, bintang, stiker, panah lucu dalam batas wajar agar tetap clean.

        ACTIVITY STYLE & TYPO:
        Gunakan rounded bold heading dan font ramah anak. Terdapat visual instruction yang imersif dan playful. Hasil akhirnya harus dinamis, bernuansa premium, cozy, fun, dan tidak seperti tugas generik yang membosankan.
        `;
    }

    // Combine the sections
    return `
      Anda adalah AI WORKSHEET GENERATION ENGINE
      digunakan untuk menghasilkan LEMBAR KERJA SISWA di dalam aplikasi edukasi.

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      GLOBAL WORKSHEET SAFETY MODE (MANDATORY)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      ALL worksheets MUST be:
      - BLANK
      - READY FOR STUDENTS
      - WITHOUT answers, solutions, or examples

      YOU MUST NEVER generate:
      - Answer keys
      - Filled answers
      - Example solutions
      - Pre-drawn paths or connections

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      UNIVERSAL NO-ANSWER RULES (VERY STRICT)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      YOU ARE STRICTLY FORBIDDEN TO:
      1. Show correct answers in ANY form
      2. Pre-fill:
         - numbers
         - text
         - symbols
      3. Draw:
         - connecting lines
         - arrows
         - maze paths
         - matching lines
      4. Display:
         - checked boxes
         - highlighted answers
         - solved puzzles
         - completed patterns
      5. Show before–after comparisons

      If ANY answer or solution appears,
      YOU MUST regenerate the worksheet as BLANK.

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ONE WORKSHEET = ONE ACTIVITY RULE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      Each worksheet MUST contain:
      - ONLY ONE activity type

      Mixing activities is FORBIDDEN
      unless worksheet_type = "MIXED".

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      HEADER RULE (STRICT)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      Header MUST contain ONLY:
      - Nama
      - Kelas OR Nilai (depending on level)

      FORBIDDEN in header:
      - Date
      - School name
      - Long titles
      - Decorative graphics
      - Any answer-related content

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      INSTRUCTION VISIBILITY CONTROL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      The worksheet image MUST NOT display
      long instructional paragraphs.

      STRICT RULES:
      - NO paragraphs like:
        "Lembar kerja ini dirancang untuk..."
      - NO learning objectives in narrative form
      - NO long explanations

      Instructions (if included) MUST:
      - Be MAX 1 short sentence
      - Be simple & direct
      - Be optional

      It is ALLOWED to generate worksheets
      with NO instruction text at all.

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      FOOTER SERIES LABEL RULE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      The worksheet MUST include
      a SMALL footer series label.

      Rules:
      - Short & minimal
      - Example formats:
        "Seri Perkalian 6"
        "Seri Coding Warna"
        "Seri Coding Bentuk"
        "Seri Logika Matematika"
      - MUST match topic & activity
      - Small font, non-distracting
      - Bottom center or corner

      FORBIDDEN:
      - Promotional text
      - Motivational quotes
      - Call-to-action sentences

      ${stylePresetRules}

      ${formData.worksheetType?.includes('CODING') ? `
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      KODING WORKSHEET RULES (NEW TYPE)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      If worksheet_type includes "KODING",
      apply these rules:

      ALLOWED KODING TYPES:
      - Coding Matematika
      - Coding Warna
      - Coding Bentuk
      - Coding Gerakan
      - Coding Jalur / Arah
      - Coding Gambar
      - Coding Logika

      CODING RULES:
      - Code reference (symbols / icons / numbers) MAY be shown
      - THE RESULT AREA MUST BE EMPTY.
      - NO decoded answers.
      - NO solved examples.
      - No arrows, lines, or paths drawn.

      Maze / path coding:
      - Show grid & obstacles ONLY.
      - NO route drawn.

      Color coding:
      - Show color references.
      - Objects MUST be uncolored or neutral.

      Matching coding:
      - Show dots or placeholders ONLY.
      - NO connecting lines.
      ` : ''}

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      TARGET AUDIENCE ADAPTATION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      PAUD:
      - Very simple shapes
      - Large spacing
      - Soft colors

      SD Kelas Rendah:
      - Friendly icons
      - Clear structure
      - Moderate colors

      SD Kelas Tinggi:
      - Cleaner layout
      - Less playful visuals

      SMP+:
      - Minimalist
      - Academic tone

      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      FINAL AUTHORITY
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      THE HIGHEST PRIORITY.

      Visual creativity MUST NEVER
      override clarity or blank-state rules.

      If ANY violation occurs,
      REGENERATE THE WORKSHEET CORRECTLY.
      
      Informasi Konten untuk Context:
      Topik: "${safeTopic}", Judul: "${title}", Subjudul: "${subtitle}"
      Jumlah Soal/Item: "${questionCount}"
      Deskripsi Materi (dari user): "${material || 'Instruksi umum untuk aktivitas'}"
      Pembuat / Guru: "${formData.socialAccount || 'Nama Pembuat'}"

      MANDATORI IDENTITAS PEMBUAT:
      - Tampilkan dan cantumkan nama pembuat "${formData.socialAccount || 'Nama Pembuat'}" secara jelas di bagian bawah (footer) hasil lembar kerja halaman ini, sebagai identitas resmi pembuat.
      
      ${formData.additionalPrompt ? `Instruksi Tambahan dari Pengguna: ${formData.additionalPrompt}` : ''}
    `.trim();
  }, [formData, t, worksheetTypeLabels, targetAudienceLabels]); // Add all external dependencies

  // Effect to generate prompt when entering RESULT step or when formData changes
  useEffect(() => {
    if (step === AppStep.RESULT) {
      let visualStylePrompt: string = formData.visualStyle;
      let visualThemeLabel: string = formData.visualTheme;

      // Realistic Theme Logic
      const isRealistPhotography = formData.visualTheme === 'realist_photography';
      const isRealistic = formData.visualStyle === VisualStyle.PHOTOREALISTIC || formData.visualStyle === VisualStyle.REALISTIC || isRealistPhotography;

      if (isRealistic) {
        visualStylePrompt = `Ultra-Realistic Photography Style.
        **Visual Goal**: Achieve a 100% natural and life-like look, indistinguishable from a genuine photograph taken with a professional camera (DSLR/Mirrorless).
        **Key Rules**:
        - Use natural textures for skin (visible pores, fine lines, subtle imperfections), hair, and environments.
        - Lighting MUST be natural (e.g., natural sunlight, soft daylight) or professional studio lighting with realistic soft shadows and highlights.
        - Materials like fabric, wood, metal, and plastic must have authentic material properties and reflections.
        - Avoid over-smoothing or artificial glowing.
        - Use realistic depth of field (subtle bokeh) where appropriate.
        - All elements, including icons, objects, and props, must be real physical objects, not stylized graphics.
        - If displaying food or products, adhere to high-end food and product photography standards.
        - Strictly maintain human anatomy and object proportions in a realistic manner.`;
      }

      if (isRealistPhotography) {
          visualThemeLabel = 'Realistic / Real Photography';
      } else if (formData.visualTheme === 'pixar') {
          visualThemeLabel = '3D Animation Style (Cinematic)';
          visualStylePrompt = `Pixar-inspired 3D Animated Style. 
          **Visual Characteristics**: High-quality 3D rendering with smooth shading (Octane Render style). Characters with round, cute proportions and expressive features. Soft, cinematic lighting with a warm, inviting atmosphere.
          **Environment**: Clean, detailed, and vibrant backgrounds suitable for educational content.
          **Strict Constraints**: NO "Disney" or "Pixar" logos/text/watermarks. NO imitation of existing copyrighted characters (e.g. no Woody, no Buzz). Create ORIGINAL generic characters in this style.`;
      } else if (formData.visualTheme === 'pastel') {
          visualThemeLabel = 'Cute Pastel Aesthetic (Kawaii)';
          visualStylePrompt = `Cute Kawaii Aesthetic Style. Soft pastel color palette (e.g., baby pink, mint green, soft blue, cream). Flat vector illustration with thick soft outlines. Characters should be chibi/cute style with happy expressions. Icons and elements should be adorable (e.g., smiling objects, sparkles, clouds). Overall look: Clean, organized, cheerful, and 'Instagram-aesthetic', perfect for planners or checklists. Adapt colors and icons to the topic '${formData.topic || 'General'}'.`;
      } else if (formData.visualTheme === 'watercolor_islamic') {
          visualThemeLabel = 'Elegant Islamic Watercolor (Floral)';
          visualStylePrompt = `Elegant Islamic Watercolor Style. Soft, hand-painted digital watercolor texture. Features decorative Islamic elements like hanging lanterns (fanoos), crescent moons, mosque silhouettes, and lush floral/botanical borders (sage green leaves, soft flowers). Palette: Cream/Beige background, Sage Green, Soft Pink, and Gold accents. Layout: Clean, festive money envelope design (Amplop THR). Vibe: Warm, blessed, elegant, and traditional.`;
      } else if (formData.visualTheme === 'pink_family') {
          visualThemeLabel = 'Cute Pink Muslim Family (Vector)';
          visualStylePrompt = `Cute Pink Muslim Family Style (Vector). Flat vector illustration with a dominant soft/bubblegum Pink background. Elements: Hanging gold lanterns at the top. A cute, happy Muslim family illustration (wearing modest clothing, hijab, koko) in the center/side. Floral garden or white fence at the bottom. Atmosphere: Cheerful, sweet, family-oriented, and festive.`;
      } else if (formData.visualTheme === 'navy_night') {
          visualThemeLabel = 'Navy Gold Islamic Night (Family)';
          visualStylePrompt = `Navy Gold Islamic Night Style (Vector). Deep Navy Blue background representing a holy night.
          **Elements:** Gold Geometric/Mandala ornaments at the top (luxury touch). Silhouette of Mosque Domes and Minarets at the bottom. A crescent moon and stars in the sky.
          **Center Illustration:** A cute, happy Muslim family (Father, Mother, Kids) greeting.
          **Color Palette:** Navy Blue, Gold, White (text), Soft Skin tones.
          **Vibe:** Elegant, Peaceful, Family-centric, Religious.`;
      } else if (formData.visualTheme === 'happy_night_nature') {
          visualThemeLabel = 'Cheerful Night & Nature (Kids)';
          visualStylePrompt = `Cheerful Night & Nature Kids Style (Vector Illustration). 
          **Visual Theme**: A playful split or blend between "Fresh Green Nature" (rolling hills, grass, trees) and "Deep Blue Night Sky" (stars, clouds, silhouette of a mosque in the distance).
          **Key Elements**: A large, bright Yellow Crescent Moon (cartoon style) dominating the top. Hanging lanterns or stars. 
          **Typography**: Playful, bold, handwritten-style font for the greetings ("Selamat Hari Raya", "Mohon Maaf..."). Text placed on ribbons or fluffy cloud shapes.
          **Characters**: Cute Muslim kids (Chibi style) with happy expressions. Boys wearing koko/peci, girls wearing hijab/gamis. They are greeting or holding lanterns.
          **Vibe**: Fun, colorful, festive, and kid-friendly.`;
      } else if (formData.visualTheme === 'chibi') {
          visualThemeLabel = 'Chibi Anime Style';
          visualStylePrompt = `Chibi Anime Style.
          **Character Proportions**: Big head (1:2 or 1:3 ratio), large expressive eyes, small body, tiny hands and feet. Cute, exaggerated expressions.
          **Line Art**: Clean, thick, smooth outlines (cel-shaded or soft shaded).
          **Colors**: Vibrant, cheerful, and saturated colors.
          **Vibe**: Adorable, fun, playful, and energetic.
          **Background**: Simple, colorful, or pattern-based (polka dots, stars) to keep focus on characters.`;
      } else if (formData.visualTheme === 'paper_cut_craft') {
          visualThemeLabel = 'Paper Cut Craft';
          visualStylePrompt = `Paper Cut Craft style.
          **Visual Characteristics**: Intricate layered paper cut-out effect. Elements should appear as if constructed from multiple layers of paper.
          **Depth & Shadows**: Create subtle, soft shadows beneath each layer to give a distinct 3D, pop-up book effect. The shadow direction should be consistent.
          **Edges**: Clean, sharp edges on all cut-out shapes, mimicking precise paper cutting.
          **Color Palette**: Use a harmonious, often pastel or vibrant, color palette with distinct colors for each paper layer. Colors should be solid and not have gradients within a single 'paper' layer.
          **Textures**: Minimal to no paper texture, focus on the clean, flat color and layered composition.
          **Composition**: Clean, organized, and balanced composition, suitable for educational content, making elements easy to distinguish.
          **Prohibitions**: AVOID realistic photos, 3D renders (except for the layered depth effect), watercolor textures, or fuzzy edges.`;
      } else if (formData.visualTheme === 'retro_pixel_art') {
          visualThemeLabel = 'Retro Pixel Art';
          visualStylePrompt = `Retro Pixel Art style.
          **Visual Characteristics**: Low-resolution, blocky, pixelated aesthetic reminiscent of 8-bit or 16-bit video games. Each element must be composed of clearly defined squares (pixels).
          **Colors**: Limited, vibrant color palette with sharp color transitions, typical of old-school digital art. No smooth gradients.
          **Lines & Shapes**: All lines and shapes should be visibly pixelated, with jagged edges where curves or diagonals occur.
          **Characters**: If human characters are included, they should be stylized with blocky, simplified features. Faceless/semi-faceless characters are preferred if applicable to maintain a generic feel.
          **Background**: Simple, tiled patterns or abstract landscapes made from large pixels. The background should complement the pixelated foreground elements without overwhelming them.
          **Overall Mood**: Playful, nostalgic, and clear for educational purposes.
          **Prohibitions**: ABSOLUTELY NO smooth lines, NO high-resolution details, NO realistic textures, NO complex shading. Every element must be visibly pixelated.`;
      } else if (formData.visualTheme === 'premium_kids_activity_infographic') {
        visualThemeLabel = 'Premium Kids Activity Infographic';
        visualStylePrompt = `Premium Kids Activity Infographic Style.
        **Visual Style**: Modern kids educational worksheet aesthetic, similar to high-quality Pinterest/Etsy printables. Soft kawaii educational style, playful learning board, colorful but soft pastel palette.
        **Layout**: Modular card sections, asymmetrical dynamic composition, rounded corner boxes, visually structured spacing with miniature infographic-style layouts within the worksheet.
        **Characters & Elements**: Cute educational mascots or characters matching the theme, subtle decorative elements (stars, clouds, arrows, badges).
        **Typography**: Rounded bold headings and clean sans-serif body text.
        **Avoid**: Flat empty worksheets, neon colors, generic cliparts, stiff compositions, low quality styling.`;
      } else if (formData.visualTheme === 'clean_white_paper') {
          visualThemeLabel = 'Clean White Paper Aesthetic';
          visualStylePrompt = `Clean White Paper Aesthetic.
          **Background**: Pure white or extremely light off-white (#F8F8F8 to #FFFFFF) background. It must be plain, pristine, and minimal. Avoid any heavy textures, dark gradients, or busy patterns. Maximize white space.
          **Main Content Visuals**: All primary elements, objects, illustrations (e.g., fruits, food items, educational graphics, supporting objects) must be BRIGHTLY COLORED and lively. Use natural, vibrant colors that stand out clearly against the white background. Examples: red apples, green leaves, yellow sun, colorful educational icons.
          **Composition**: THE visual focus is entirely on the main content. Utilize negative space effectively for a neat and uncluttered appearance. Simple, centralized, and easy-to-read layout.
          **Overall Style**: Clean, Minimalist, Modern, Professional, and highly suitable for educational content, food & drink visuals, informative carousels, and infographics.
          **Prohibitions**: NO dark backgrounds, no heavy grey, no strong cream colors. Do NOT make the appearance dull or monochrome. Avoid excessive decorative elements that distract from the main content.`;
      } else if (formData.visualTheme === 'sacred_quotes') { // New theme logic
        visualThemeLabel = 'Sacred Quotes / Affirmation (Minimalist)';
        visualStylePrompt = `Sacred Quotes / Affirmation (Minimalist).
        **Visual Style**: Clean, serene, and minimalist digital illustration or design. The focus MUST be entirely on the central text.
        **Text Presentation**: The main text ("${formData.material}") should be large, clear, and centrally placed. Use elegant, readable typography that conveys reverence or inspiration. Consider subtle embellishments around the text if fitting (e.g., delicate borders, light glows) but ensure they do not distract.
        **Color Palette**: Soft, calming, and harmonious colors. Think muted tones, gentle gradients, or monochromatic schemes with subtle contrasts. Examples: soft blues, greens, creams, purples, or a touch of gold/silver for elegance. Avoid harsh, vibrant, or dark colors.
        **Background & Supporting Elements**: Simple, uncluttered background. This could be a soft texture, a subtle ethereal glow, a gentle gradient, or a very abstract, minimal pattern (e.g., barely visible geometric Islamic patterns, soft clouds, faint floral outlines). Any supporting visual elements (e.g., a crescent moon, a small branch, an abstract light source) must be minimal, placed carefully to enhance the central text without competition, and consistent with the calming mood.
        **Composition**: Symmetrical or balanced composition with a strong central focus on the text. Maximize whitespace.
        **Prohibitions**: NO busy backgrounds, NO complex illustrations, NO human characters, NO aggressive or dynamic scenes, NO photorealism. The overall impression should be peaceful, respectful, and highly readable.`;
      }


      const commonVisuals = {
        mode: visualStylePrompt,
        theme: visualThemeLabel || 'Custom/Manual',
        character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
        extra_prompt: formData.additionalPrompt
      };
      
      let generatedPrompt = "";

      if (formData.mode === PosterMode.WORKSHEET) {
        // --- WORKSHEET COVER PROMPT ---
        if (formData.worksheetOutputMode === WorksheetOutputMode.COVER_AND_CONTENT) {
          generatedPrompt += `
# WORKSHEET COVER VISUAL INSTRUCTIONS

**OVERALL RULES**:
- Design a captivating and educational cover for a worksheet.
- Focus on visual appeal and clearly communicate the topic.
- Include space for student's name and class.

**Worksheet Details**:
- Mode: ${t('mode_worksheet_title')}
- Sub-Type: ${worksheetTypeLabels[formData.worksheetType as WorksheetType] || formData.worksheetType}
- Target Audience: ${targetAudienceLabels[formData.targetAudience as TargetAudience] || formData.targetAudience}
- Topic: ${formData.topic}
- Title: ${formData.title}
- Subtitle: ${formData.subtitle}
- Question Count: ${formData.questionCount}
- Material Content (as displayed on cover): "${formData.material}"

**General Visual Aesthetics**:
- Visual Style: ${commonVisuals.mode}
- Visual Theme: ${commonVisuals.theme}
${commonVisuals.character.includes('faceless') ? ' (NO human characters, only objects/icons)' : ` (Characters: ${commonVisuals.character})`}
- Page Size / Aspect Ratio: ${formData.size}
- Pembuat / Guru (Akun Sosial): ${formData.socialAccount || 'Nama Pembuat'}
- MANDATORI IDENTITAS PEMBUAT: Tampilkan nama pembuat/instansi "${formData.socialAccount || 'Nama Pembuat'}" secara anggun dan jelas di bagian bawah (footer) cover ini.

**Additional AI Instructions**:
- "${commonVisuals.extra_prompt}"

**Cover Specific Elements**:
- Clearly display "LEMBAR KERJA SISWA" or "WORKSHEET" as a prominent header.
- Include a visually engaging illustration related to the topic.
- Provide blank lines or boxes for "Nama: ........................." and "Kelas: .........................".
- Use a vibrant and inviting color palette.
- The cover should feel inspiring and educational.
`;
          generatedPrompt += '\n--- CONTENT WORKSHEET PROMPT ---\n'; // Delimiter for splitting
        }
        // --- WORKSHEET CONTENT PROMPTS --- (always generated for worksheet mode)
        const promptCount = formData.worksheetPromptCount || 1;
        if (promptCount > 1) {
          const materialsList = formData.materials || [];
          for (let i = 0; i < promptCount; i++) {
            const customMat = materialsList[i] || '';
            generatedPrompt += `\n=== WORKSHEET CONTENT PROMPT (Bagian ${i + 1} dari ${promptCount}) ===\n`;
            generatedPrompt += generateWorksheetVisualRules(formData, worksheetTypeLabels, targetAudienceLabels, customMat);
            if (i < promptCount - 1) {
              generatedPrompt += '\n';
            }
          }
        } else {
          generatedPrompt += generateWorksheetVisualRules(formData, worksheetTypeLabels, targetAudienceLabels);
        }
      } else if (formData.mode === PosterMode.INFOGRAPHIC) {
        // Existing Infographic prompt
        generatedPrompt += `
          # INFOGRAPHIC VISUAL INSTRUCTIONS

          **OVERALL RULES**:
          - Create a visually compelling and easy-to-understand infographic.
          - Ensure clear hierarchy and smooth flow of information.
          - Adapt all visual elements to the chosen architecture and layout.

          **Infographic Details**:
          - Mode: ${t('mode_infographic_title')}
          - Architecture Type: ${infographicArchitectureLabels[formData.infographicArchitectureType as InfographicArchitectureType] || formData.infographicArchitectureType}
          - Layout Flow: ${infographicLayoutFlowLabels[formData.infographicLayoutFlow as InfographicLayoutFlow] || formData.infographicLayoutFlow}
          - Target Audience: ${targetAudienceLabels[formData.targetAudience as TargetAudience] || formData.targetAudience}
          - Topic: ${formData.topic}
          - Title: ${formData.title}
          - Description / Subtitle: "${formData.subtitle}"
          - Main Content (Key Points): "${formData.material}"
          ${formData.showFunFact && formData.funFact ? `- Fun Fact: "${formData.funFact}"` : ''}
          - Call to Action: "${formData.cta || 'None'}"

          **General Visual Aesthetics**:
          - Visual Style: ${commonVisuals.mode}
          - Visual Theme: ${commonVisuals.theme}
          ${commonVisuals.character.includes('faceless') ? ' (NO human characters, only objects/icons)' : ` (Characters: ${commonVisuals.character})`}
          - Aspect Ratio: ${formData.size}
          - Pembuat / Guru (Akun Sosial): ${formData.socialAccount || 'Nama Pembuat'}
          - MANDATORI IDENTITAS PEMBUAT: Tampilkan nama pembuat "${formData.socialAccount || 'Nama Pembuat'}" secara anggun dan jelas di bagian bawah (footer) infografis ini.

          **Architecture Specific Visuals**:
          - If Architecture Type is "Timeline / Roadmap": Use a clear chronological path or progress bar visual.
          - If Architecture Type is "Step-by-Step Process": Use numbered steps, flow diagrams, or sequential panels.
          - If Architecture Type is "Comparison Split (A vs B)": Use a split screen, two-column layout, or Venn diagram.
          - If Architecture Type is "Anatomy Breakdown (Central Object)": Use a central object with labels and lines pointing to its parts/features.
          - If Architecture Type is "Statistical Dashboard (Data Heavy)": Use charts, graphs, and data visualization elements.
          - If Architecture Type is "Central Focus / Central Hub (Text-Centric)": Place the main text/quote prominently in the center, surrounded by minimal, harmonious decorative elements. Maximize readability of the central text.

          **Layout Specific Visuals**:
          - If Layout Flow is "Z-Pattern (Zig-zag)": Guide the eye with a zig-zag path, alternating left and right content blocks.
          - If Layout Flow is "Modular Grid (Symmetric Boxes)": Use a balanced grid of equally sized content blocks.
          - If Layout Flow is "Central Hub (Center & Branches)": A central point with radiating branches for related information.
          - If Layout Flow is "Vertical Scroll (Mobile Friendly)": Design for easy vertical scanning, with clear sections and ample spacing.

          **Additional AI Instructions**:
          - "${commonVisuals.extra_prompt}"
        `;
      } else if (formData.mode === PosterMode.ENVELOPE) {
        // Existing Envelope prompt
        generatedPrompt += `
          # ENVELOPE / GREETING CARD VISUAL INSTRUCTIONS

          **OVERALL RULES**:
          - Design a festive and personalized holiday envelope or greeting card.
          - Ensure all text is legible and well-integrated into the design.

          **Envelope Details**:
          - Mode: ${t('mode_envelope_title')}
          - Main Greeting / Title: "${formData.title}"
          - Sub-Greeting / Year: "${formData.subtitle}"
          - Additional Message: "${formData.material}"
          - Sender Name (From): "${formData.senderName}"
          - Recipient Name (To): "${formData.recipientName}"

          **General Visual Aesthetics**:
          - Visual Style: ${commonVisuals.mode}
          - Visual Theme: ${commonVisuals.theme}
          ${commonVisuals.character.includes('faceless') ? ' (NO human characters, only objects/icons)' : ` (Characters: ${commonVisuals.character})`}
          - Aspect Ratio: ${formData.size} (Note: Envelope sizes are specific, so respect the chosen aspect ratio like 7x10cm or full cash size, these will be rendered to fit standard envelope proportions)
          - Pembuat / Guru (Akun Sosial): ${formData.socialAccount || 'Nama Pembuat'}
          - MANDATORI IDENTITAS PEMBUAT: Tampilkan nama pembuat "${formData.socialAccount || 'Nama Pembuat'}" di pojok atau bagian penutup amplop ini secara ramah dan profesional.

          **Envelope Specific Elements**:
          - Prominently display the main greeting (e.g., "Selamat Idul Fitri").
          - Include "Dari: ${formData.senderName}" and "Untuk: ${formData.recipientName}" clearly.
          - Integrate small, festive, and relevant decorative elements (e.g., ketupat, mosque silhouettes, lanterns, flowers, crescent moon, stars).
          - Use a color palette that evokes a sense of joy, warmth, and celebration (e.g., greens, golds, yellows, soft pastels).

          **Additional AI Instructions**:
          - "${commonVisuals.extra_prompt}"
        `;
      } else { // Default to Poster Mode
        // Existing Poster prompt
        generatedPrompt += `
          # POSTER VISUAL INSTRUCTIONS

          **OVERALL RULES**:
          - Create a professional and visually appealing educational poster.
          - Ensure the main message is clear and easy to read from a distance.

          **Poster Details**:
          - Mode: ${t('mode_poster_title')}
          - Target Audience: ${targetAudienceLabels[formData.targetAudience as TargetAudience] || formData.targetAudience}
          - Topic: ${formData.topic}
          - Title: ${formData.title}
          - Subtitle: ${formData.subtitle}
          - Main Content (Key Points): "${formData.material}"
          - Call to Action: "${formData.cta}"

          **General Visual Aesthetics**:
          - Visual Style: ${commonVisuals.mode}
          - Visual Theme: ${commonVisuals.theme}
          ${commonVisuals.character.includes('faceless') ? ' (NO human characters, only objects/icons)' : ` (Characters: ${commonVisuals.character})`}
          - Aspect Ratio: ${formData.size}
          - Pembuat / Guru (Akun Sosial): ${formData.socialAccount || 'Nama Pembuat'}
          - MANDATORI IDENTITAS PEMBUAT: Tampilkan nama pembuat "${formData.socialAccount || 'Nama Pembuat'}" secara anggun dan jelas di bagian bawah (footer) poster ini.

          **Additional AI Instructions**:
          - "${commonVisuals.extra_prompt}"
        `;
      }
      setGeminiResult(generatedPrompt.trim());
    }
  }, [
    step, 
    formData, 
    t, 
    worksheetTypeLabels, 
    targetAudienceLabels, 
    infographicArchitectureLabels, 
    infographicLayoutFlowLabels, 
    generateWorksheetVisualRules 
  ]);


  // Step Navigation Logic
  const renderStep = () => {
    switch (step) {
      case AppStep.LANDING:
        return (
          <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-5 pb-16 md:pb-24 animate-fade-in relative overflow-visible">
            {/* Soft gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-slate-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 pointer-events-none"></div>
            
            {/* 3D Perspective Grid Background */}
            <PerspectiveGrid />

            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="bg-gradient-to-b from-white/90 to-white/50 dark:from-slate-900/90 dark:to-slate-900/50 backdrop-blur-md px-8 pt-4 pb-12 md:px-12 lg:px-16 max-w-5xl w-full text-center rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_0_0_1px_rgba(255,255,255,0.3),0_24px_48px_-12px_rgba(37,99,235,0.15),0_12px_24px_-6px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.05),0_24px_48px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all z-10 mt-3 -translate-y-7">
              {/* Premium Gradient Border */}
              <div 
                className="absolute inset-0 rounded-[2rem] pointer-events-none border-[1.5px] border-transparent bg-gradient-to-b from-blue-400/50 to-blue-600/10 dark:from-blue-400/30 dark:to-blue-600/5 z-20"
                style={{
                  backgroundOrigin: 'border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude'
                }}
              ></div>

              {/* Inner Noise Texture for the Box */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
              
              {/* Decorative Background Layers */}
              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>
              
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
                style={{
                  backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
                  backgroundSize: '64px 64px',
                  maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, black 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, black 100%)'
                }}
              ></div>

              {/* Dot Pattern */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
                style={{
                  backgroundImage: `radial-gradient(#64748b 1.5px, transparent 1.5px)`,
                  backgroundSize: '32px 32px',
                  maskImage: 'linear-gradient(to bottom, black 10%, transparent 60%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 60%)'
                }}
              ></div>

              {/* Blurred Blobs for Depth */}
              <div 
                className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, rgba(96,165,250,0) 70%)' }}
              ></div>
              <div 
                className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(168,85,247,0) 70%)' }}
              ></div>
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, rgba(99,102,241,0) 70%)' }}
              ></div>
              
              {/* Small floating dots */}
              <motion.div 
                className="absolute top-20 left-20 w-3 h-3 bg-blue-400/50 rounded-full"
                animate={{ y: [-10, 10, -10], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-32 right-24 w-4 h-4 bg-purple-400/50 rounded-full"
                animate={{ y: [10, -10, 10], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div 
                className="absolute top-40 right-32 w-2 h-2 bg-emerald-400/50 rounded-full"
                animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex justify-center mt-2 mb-4">
                  <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-sm backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                      POWERED BY SCALEUPWITHAI
                    </span>
                  </div>
                </div>

                {/* Inner Container (New Visual Layer) */}
                <div className="w-[calc(100%-48px)] max-w-4xl mx-auto mb-3 p-2 md:p-3 rounded-[28px] bg-gradient-to-b from-slate-50/80 to-slate-100/40 dark:from-slate-800/40 dark:to-slate-900/40 border border-black/5 border-t-white/40 dark:border-white/5 dark:border-t-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.05),0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.2),0_10px_30px_rgba(0,0,0,0.2)] relative z-20">
                  {/* Carousel Wrapper */}
                  <motion.div 
                    className="w-full relative py-5 px-5 md:py-6 md:px-6 rounded-[20px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.1)]"
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Soft glow behind center card (No Blur) */}
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)' }}
                    ></div>
                    
                    {/* Subtle floating particles inside carousel bg (No Blur) */}
                    <motion.div 
                      className="absolute top-0 left-1/4 w-[200px] h-[200px] rounded-full pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, rgba(96,165,250,0) 70%)' }}
                      animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0) 70%)' }}
                      animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />

                    <PreviewCarousel />
                  </motion.div>
                </div>

                {/* Text content below */}
                <div className="space-y-2 mt-2 mb-2.5 relative">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.15] text-slate-900 dark:text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white">
                      {t('landing_h1_1')}
                    </span>
                  </h1>
                </div>

                <div className="max-w-2xl mx-auto mb-4 relative opacity-85">
                  <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-snug">
                    {t('landing_desc')}
                  </p>
                </div>

                <button 
                  onClick={() => setStep(AppStep.MENU)}
                  className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl text-lg font-bold tracking-tight shadow-[0_8px_20px_rgb(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgb(79,70,229,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden mt-0"
                >
                  {/* Soft reflection/light effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {t('start_now')} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        );

      case AppStep.MENU:
        return (
          <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
            {/* Main Container Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none relative transition-all">
              
              {/* Back Button (Top Left) */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <button 
                  onClick={() => setStep(AppStep.LANDING)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('back')}
                </button>
              </div>

              {/* Header Title */}
              <div className="text-center mt-12 md:mt-4 mb-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t('menu_title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm md:text-base">
                  {t('menu_desc')}
                </p>
              </div>

              {/* Grid 4 Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[
                  { 
                    mode: PosterMode.POSTER, 
                    titleKey: 'mode_poster_title',
                    descKey: 'mode_poster_desc',
                    icon: ImageIcon, 
                    color: 'bg-amber-500',
                    tagKey: 'tag_popular'
                  },
                  { 
                    mode: PosterMode.WORKSHEET, 
                    titleKey: 'mode_worksheet_title',
                    descKey: 'mode_worksheet_desc',
                    icon: CheckCircle, 
                    color: 'bg-blue-500',
                    tagKey: 'tag_education'
                  },
                  { 
                    mode: PosterMode.INFOGRAPHIC,
                    titleKey: 'mode_infographic_title',
                    descKey: 'mode_infographic_desc',
                    icon: LayoutTemplate,
                    color: 'bg-rose-500',
                    tagKey: 'tag_interactive'
                  },
                  { 
                    mode: PosterMode.ENVELOPE, 
                    titleKey: 'mode_envelope_title',
                    descKey: 'mode_envelope_desc',
                    icon: Mail, 
                    color: 'bg-emerald-500',
                    tagKey: 'tag_seasonal'
                  }
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      updateData('mode', item.mode);
                      setStep(AppStep.INFO);
                    }}
                    className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all text-left flex flex-col h-full"
                  >
                    {/* Icon Box */}
                    <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Text Content */}
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t(item.titleKey as any)}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed mb-6">
                      {t(item.descKey as any)}
                    </p>

                    {/* Bottom Tag */}
                    <div className="mt-auto pt-6 w-full border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        {t(item.tagKey as any)}
                      </span>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Disclaimer Footer Box */}
              <DisclaimerFooter />

            </div>
          </div>
        );

      case AppStep.INFO:
        // Dynamic labels based on mode
        let titleLabel = t('label_title');
        let subtitleLabel = t('label_subtitle');
        let titlePlaceholder = t('ph_title_poster');
        let subtitlePlaceholder = t('ph_subtitle_poster');

        if (isInfographic) {
            titleLabel = t('label_infographic_title');
            subtitleLabel = t('label_infographic_desc');
            titlePlaceholder = t('ph_title_infographic');
            subtitlePlaceholder = t('ph_subtitle_infographic');
        } else if (isEnvelope) {
            titleLabel = t('label_envelope_title');
            subtitleLabel = t('label_envelope_sub');
            titlePlaceholder = t('ph_title_envelope');
            subtitlePlaceholder = t('ph_subtitle_envelope');
        }

        let typeLabel = t('label_type');
        if (isWorksheet) typeLabel = t('label_worksheet_type');
        else if (isInfographic) typeLabel = t('label_infographic_content');
        else if (isEnvelope) typeLabel = t('label_envelope_type');

        return (
          <div className="max-w-4xl mx-auto px-4 w-full py-8 animate-slide-down">
            {/* Header Area */}
            <div className="bg-blue-600 border border-blue-500 border-b-0 p-8 md:p-12 rounded-t-[2.5rem] relative overflow-hidden shadow-2xl shadow-blue-500/20 z-10 transition-all">
              <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
              
              <button 
                onClick={() => setStep(AppStep.MENU)}
                className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 z-20 backdrop-blur-md"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>

              <div className="text-center relative z-10 mt-8 md:mt-4">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                   {formData.mode || 'POSTER EDUKASI'}
                </h2>
                
                {/* Stepper */}
                <div className="max-w-md mx-auto mt-8">
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-bold text-blue-100 uppercase tracking-widest mb-3">
                    <span>{t('loading')}</span>
                    <span>33%</span>
                  </div>
                  <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden relative">
                     <div className="absolute left-0 top-0 h-full bg-emerald-400 w-1/3 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-blue-200">
                    <span className="text-emerald-400">1. {t('step_info')}</span>
                    <span>2. {t('step_upload')}</span>
                    <span>3. {t('step_result')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-b-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none relative z-20 -mt-1 transition-colors">
              
              {/* Preset Section */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl mb-8">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                     <LayoutTemplate className="w-4 h-4" /> {t('label_preset')}
                   </label>
                 </div>
                 <Select 
                    label="" 
                    value={formData.preset}
                    onChange={e => handlePresetChange(e.target.value)}
                    options={[
                      { label: t('opt_preset_default'), value: '' },
                      ...(isWorksheet ? [
                          { label: 'Matematika Dasar', value: 'math_basic' },
                          { label: 'Belajar Menulis Huruf', value: 'writing' },
                          { label: 'Mewarnai Hewan', value: 'coloring_animals' },
                          { label: 'IPA Anggota Tubuh', value: 'science_parts' }
                      ] : isInfographic ? [
                          { label: t('preset_recipe_simple'), value: 'infographic_recipe_simple' },
                          { label: t('preset_drink_recipes'), value: 'infographic_drink_recipes' },
                          { label: t('preset_edu_school_infographic'), value: 'infographic_edu_school' },
                          { label: t('preset_health_infographic'), value: 'infographic_health_light' },
                          { label: t('preset_life_skills_infographic'), value: 'infographic_life_skills' },
                          { label: t('preset_religious_infographic'), value: 'infographic_religious' },
                          { label: t('preset_unique_facts_infographic'), value: 'infographic_unique_facts' },
                          { label: t('preset_sacred_prayer_infographic'), value: 'infographic_sacred_prayer' },
                      ] : isEnvelope ? [
                          { label: 'Navy Gold Islamic Night (Family)', value: 'envelope_navy_family' },
                          { label: 'Cheerful Night & Nature (Kids)', value: 'envelope_happy_kids' },
                          { label: 'Amplop THR Lucu (Anak)', value: 'thr_kids_cute' },
                          { label: 'Amplop Keluarga Elegant (Floral)', value: 'family_floral' },
                          { label: 'Amplop Kantor/Resmi', value: 'office_formal' },
                          { label: 'Amplop Bestie (Meme/Lucu)', value: 'friend_funny' }
                      ] : [
                          { label: 'Kajian Rutin Masjid', value: 'kajian_rutin' },
                          { label: 'Pengumuman Sekolah', value: 'sekolah' },
                          { label: 'Lomba 17 Agustus', value: 'lomba_17' },
                          { label: 'Penerimaan Siswa Baru (PPDB)', value: 'ppdb' }
                      ])
                    ]}
                    className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                 />
              </div>

              {/* Infographic Architecture & Layout */}
              {isInfographic && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_infographic_architecture')}</label>
                        </div>
                        <Select
                            label=""
                            value={formData.infographicArchitectureType}
                            onChange={e => updateData('infographicArchitectureType', e.target.value as InfographicArchitectureType)}
                            options={Object.values(InfographicArchitectureType).map(type => ({ label: infographicArchitectureLabels[type], value: type }))}
                            className="rounded-xl border-slate-200 dark:border-slate-700"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_infographic_layout_flow')}</label>
                        </div>
                        <Select
                            label=""
                            value={formData.infographicLayoutFlow}
                            onChange={e => updateData('infographicLayoutFlow', e.target.value as InfographicLayoutFlow)}
                            options={Object.values(InfographicLayoutFlow).map(flow => ({ label: infographicLayoutFlowLabels[flow], value: flow }))}
                            className="rounded-xl border-slate-200 dark:border-slate-700"
                        />
                    </div>
                 </div>
              )}

              {/* Worksheet Specific: Output Mode & Prompt Count Selection */}
              {isWorksheet && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                           {t('label_ws_output')}
                        </label>
                    </div>
                    <Select 
                        label=""
                        value={formData.worksheetOutputMode || WorksheetOutputMode.CONTENT_ONLY}
                        onChange={e => updateData('worksheetOutputMode', e.target.value)}
                        options={[
                            { label: t('opt_ws_content'), value: WorksheetOutputMode.CONTENT_ONLY },
                            { label: t('opt_ws_cover_content'), value: WorksheetOutputMode.COVER_AND_CONTENT }
                        ]}
                        className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                           {t('label_ws_prompt_count')}
                        </label>
                    </div>
                    <Select 
                        label=""
                        value={String(formData.worksheetPromptCount || 1)}
                        onChange={e => {
                          const count = parseInt(e.target.value, 10) || 1;
                          updateData('worksheetPromptCount', count);
                          
                          const currentMaterials = formData.materials || [];
                          const newMaterials = [...currentMaterials];
                          if (newMaterials.length < count) {
                            for (let i = newMaterials.length; i < count; i++) {
                              newMaterials.push(i === 0 ? (formData.material || '') : '');
                            }
                          } else if (newMaterials.length > count) {
                            newMaterials.splice(count);
                          }
                          updateData('materials', newMaterials);
                        }}
                        options={Array.from({ length: 10 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }))}
                        className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* TOPIC FIELD */}
              {(!isEnvelope && formData.infographicArchitectureType !== InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC) && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                           {t('label_topic')}
                        </label>
                       </div>
                       <button 
                         onClick={() => autoFill('topic')} 
                         disabled={isAutofilling}
                         className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                       >
                         {isAutofilling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                         {t('btn_autofill')}
                       </button>
                    </div>
                    <Input 
                      label="" 
                      placeholder={t('ph_topic')} 
                      value={formData.topic}
                      onChange={e => updateData('topic', e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
                    />
                </div>
              )}

              {/* Title & Subtitle Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                           {isInfographic ? t('label_infographic_title') : titleLabel}
                        </label>
                       </div>
                       {(!isWorksheet && formData.infographicArchitectureType !== InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC) && (
                         <button 
                           onClick={() => autoFill('title')}
                           disabled={isAutofilling}
                           className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                         >
                           {isAutofilling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                           {t('btn_autofill')}
                         </button>
                       )}
                    </div>
                    <Input 
                      label="" 
                      placeholder={isInfographic ? t('ph_title_infographic') : titlePlaceholder}
                      value={formData.title}
                      onChange={e => updateData('title', e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                           {isInfographic ? t('label_infographic_desc') : subtitleLabel}
                        </label>
                       </div>
                       {(!isWorksheet && formData.infographicArchitectureType !== InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC) && (
                         <button 
                           onClick={() => autoFill('subtitle')}
                           disabled={isAutofilling} 
                           className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                         >
                           {isAutofilling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                           {t('btn_autofill')}
                         </button>
                       )}
                    </div>
                    <Input 
                      label="" 
                      placeholder={isInfographic ? t('ph_subtitle_infographic') : subtitlePlaceholder}
                      value={formData.subtitle}
                      onChange={e => updateData('subtitle', e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
                    />
                </div>
              </div>

              {/* Main Content Grid: Configs & Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 {/* Left Column: All Configurations */}
                 <div className="space-y-8">
                    {/* Content Type / Mode */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                             {isWorksheet ? <><FileText className="w-4 h-4" /> {typeLabel}</> : isInfographic ? <><LayoutTemplate className="w-4 h-4" /> {typeLabel}</> : isEnvelope ? <><Mail className="w-4 h-4" /> {typeLabel}</> : typeLabel}
                          </label>
                        </div>
                        {isWorksheet ? (
                            <Select 
                              label=""
                              value={formData.worksheetType}
                              onChange={e => updateData('worksheetType', e.target.value)}
                              groups={getWorksheetGroups()}
                              className="rounded-xl border-slate-200 dark:border-slate-700"
                            />
                        ) : isInfographic ? (
                             <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white">
                               {t('label_infographic_content')}
                            </div>
                        ) : (
                             <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white">
                               {formData.mode}
                            </div>
                        )}
                    </div>

                    {/* Target Audience */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                             <User className="w-4 h-4" /> {t('label_audience')}
                          </label>
                        </div>
                        <Select 
                          label=""
                          value={formData.targetAudience}
                          onChange={e => updateData('targetAudience', e.target.value)}
                          options={Object.values(TargetAudience).map(t => ({ label: targetAudienceLabels[t], value: t }))}
                          className="rounded-xl border-slate-200 dark:border-slate-700"
                        />
                    </div>

                    {/* CTA Field */}
                    {(!isWorksheet && !isEnvelope && formData.infographicArchitectureType !== InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC) && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_cta')}</label>
                              </div>
                              <button 
                                onClick={() => autoFill('cta')}
                                disabled={isAutofilling} 
                                className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                              >
                                {isAutofilling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                                {t('btn_autofill')}
                              </button>
                            </div>
                            <Input 
                                label="" 
                                placeholder={t('ph_cta')} 
                                value={formData.cta}
                                onChange={e => updateData('cta', e.target.value)} 
                                className="rounded-xl border-slate-200 dark:border-slate-700" 
                            />
                        </div>
                    )}

                    {/* Fun Fact Field */}
                    {isInfographic && formData.infographicArchitectureType !== InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                                    <label htmlFor="showFunFact" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="showFunFact"
                                            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-600"
                                            checked={formData.showFunFact}
                                            onChange={e => {
                                                updateData('showFunFact', e.target.checked);
                                                if (!e.target.checked) updateData('funFact', '');
                                            }}
                                        />
                                        {t('label_fun_fact')}
                                    </label>
                                </div>
                                <button 
                                    onClick={() => autoFill('funFact')}
                                    disabled={isAutofilling || !formData.showFunFact} 
                                    className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                                >
                                    {isAutofilling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                                    {t('btn_autofill_fun_fact')}
                                </button>
                            </div>
                            <TextArea 
                                label="" 
                                placeholder={t('ph_fun_fact')} 
                                value={formData.funFact}
                                onChange={e => updateData('funFact', e.target.value)} 
                                className="rounded-xl border-slate-200 dark:border-slate-700 min-h-[100px]"
                                disabled={!formData.showFunFact}
                            />
                        </div>
                    )}

                    {/* Message Body for Envelope */}
                    {isEnvelope && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_message_body')}</label>
                            </div>
                            <TextArea 
                                label="" 
                                placeholder={t('ph_message')} 
                                value={formData.material}
                                onChange={e => updateData('material', e.target.value)} 
                                className="rounded-xl border-slate-200 dark:border-slate-700 min-h-[140px]" 
                            />
                        </div>
                    )}
                    
                    {/* Question Count for Worksheet */}
                    {isWorksheet && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <ListOrdered className="w-4 h-4" /> {t('label_question_count')}
                              </label>
                            </div>
                            <Input 
                                label="" 
                                placeholder={t('ph_question_count')} 
                                value={formData.questionCount} 
                                onChange={e => updateData('questionCount', e.target.value)} 
                                className="rounded-xl border-slate-200 dark:border-slate-700" 
                            />
                        </div>
                    )}
                 </div>

                 {/* Right Column: Material Text Area or Envelope Details */}
                 <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          {isEnvelope ? t('label_envelope_detail') : t('label_material')}
                        </label>
                       </div>
                       {formData.infographicArchitectureType !== InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC && (
                         <button 
                           onClick={() => autoFill('material')}
                           disabled={isAutofilling} 
                           className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                         >
                           {isAutofilling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                           {t('btn_autofill')}
                         </button>
                       )}
                    </div>
                    
                    {isEnvelope ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-8 flex-grow shadow-sm">
                             <div>
                                <Input 
                                  label={t('label_sender')}
                                  placeholder={t('ph_sender')}
                                  value={formData.senderName}
                                  onChange={e => updateData('senderName', e.target.value)}
                                  className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
                                />
                             </div>
                             <div>
                                <Input 
                                  label={t('label_recipient')}
                                  placeholder={t('ph_recipient')}
                                  value={formData.recipientName}
                                  onChange={e => updateData('recipientName', e.target.value)}
                                  className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
                                />
                             </div>
                             <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-6 rounded-r-2xl mt-auto">
                                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                  {t('tip_envelope')}
                                </p>
                             </div>
                        </div>
                    ) : isWorksheet && (formData.worksheetPromptCount || 1) > 1 ? (
                        <div className="flex-grow w-full flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
                           {Array.from({ length: formData.worksheetPromptCount || 1 }).map((_, idx) => {
                              const materialsList = formData.materials || [];
                              const val = materialsList[idx] || '';
                              return (
                                 <div key={idx} className="flex flex-col gap-1.5">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                       {t('label_material')} {idx + 1}
                                    </span>
                                    <textarea 
                                       className="w-full border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[120px] bg-white dark:bg-slate-800 dark:text-white shadow-sm text-sm"
                                       placeholder={`${t('ph_material')} ${idx + 1}...`}
                                       value={val}
                                       onChange={e => {
                                          const nextMaterials = [...materialsList];
                                          while (nextMaterials.length <= idx) {
                                             nextMaterials.push('');
                                          }
                                          nextMaterials[idx] = e.target.value;
                                          updateData('materials', nextMaterials);
                                          
                                          if (idx === 0) {
                                             updateData('material', e.target.value);
                                          }
                                       }}
                                    />
                                 </div>
                              );
                           })}
                        </div>
                    ) : (
                        <textarea 
                          className="flex-grow w-full border border-slate-200 dark:border-slate-800 p-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[300px] bg-white dark:bg-slate-800 dark:text-white shadow-sm"
                          placeholder={t('ph_material')}
                          value={formData.material}
                          onChange={e => updateData('material', e.target.value)}
                        />
                    )}
                 </div>
              </div>

              {/* Separator */}
              <div className="w-full border-b border-slate-100 dark:border-slate-800 my-10"></div>

              {/* Contact Information */}
              {(!isEnvelope || isInfographic) && (
                <div className="mb-8">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_identity')}</label>
                   </div>
                   <Input label="" placeholder={t('ph_identity')} value={formData.socialAccount} onChange={e => updateData('socialAccount', e.target.value)} className="rounded-xl border-slate-200 dark:border-slate-700" />
                </div>
              )}

              {/* Advanced Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {isWorksheet || isInfographic ? t('label_paper_size') : t('label_aspect_ratio')}
                      </label>
                   </div>
                   <Select 
                      label=""
                      value={formData.size}
                      onChange={e => updateData('size', e.target.value)}
                      options={
                        isEnvelope 
                        ? [
                             { label: t('size_env_small'), value: AspectRatio.ENV_SMALL },
                             { label: t('size_env_large'), value: AspectRatio.ENV_LARGE },
                          ]
                        : (isWorksheet || isInfographic)
                        ? [
                            { label: AspectRatio.A4, value: AspectRatio.A4 },
                            { label: AspectRatio.F4, value: AspectRatio.F4 },
                            { label: AspectRatio.A3, value: AspectRatio.A3 },
                            { label: AspectRatio.R_9_16, value: AspectRatio.R_9_16 },
                            { label: AspectRatio.R_1_1, value: AspectRatio.R_1_1 },
                            { label: AspectRatio.R_3_4, value: AspectRatio.R_3_4 },
                            { label: AspectRatio.R_4_5, value: AspectRatio.R_4_5 },
                          ]
                        : Object.values(AspectRatio).filter(r => r !== AspectRatio.ENV_SMALL && r !== AspectRatio.ENV_LARGE).map(r => ({ label: r, value: r }))
                      }
                      className="rounded-xl border-slate-200 dark:border-slate-700"
                   />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_visual_style')}</label>
                   </div>
                   <Select 
                      label=""
                      value={formData.visualStyle}
                      onChange={e => updateData('visualStyle', e.target.value)}
                      options={Object.values(VisualStyle)
                        .filter(v => ![
                          VisualStyle.EXPRESSIVE_EDU_ILLUSTRATION, 
                          VisualStyle.SERENE_3D_EDU_VISUAL, 
                          VisualStyle.CINEMATIC_INFOGRAPHIC_FLOW, 
                          VisualStyle.SOFT_EMPATHY_ILLUSTRATION
                        ].includes(v))
                        .map(v => ({ label: visualStyleLabels[v], value: v }))
                      }
                      className="rounded-xl border-slate-200 dark:border-slate-700"
                   />
                </div>
                <div>
                   <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_visual_theme')}</label>
                      </div>
                      <Select 
                        label=""
                        value={['pixar', 'auto', 'pastel', 'watercolor_islamic', 'pink_family', 'navy_night', 'happy_night_nature', 'chibi', 'paper_cut_craft', 'retro_pixel_art', 'clean_white_paper', 'minimal_white_frame_edu', 'magic_kids_islamic_glow', 'faith_storybook_3d', 'clay_3d', 'cinematic_story_illustration', 'expressive_edu_illustration', 'serene_3d_edu_visual', 'cinematic_infographic_flow', 'soft_empathy_illustration', 'corporate_flat_vector', '3d_isometric_glass', 'hand_drawn_sketch', 'edu_faceless_3d', 'rajut_educatif', 'sacred_quotes', 'realist_photography', 'nusantara_cozy_infographic', 'premium_kids_activity_infographic'].includes(formData.visualTheme) ? formData.visualTheme : 'custom'}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'custom') updateData('visualTheme', '');
                          else updateData('visualTheme', val);
                        }}
                        options={[
                          { label: t('opt_preset_default'), value: '' },
                          { label: t('theme_auto'), value: 'auto' },
                          { label: t('theme_nusantara_cozy_infographic'), value: 'nusantara_cozy_infographic' },
                          { label: t('theme_realist_photography'), value: 'realist_photography' },
                          { label: t('theme_pixar'), value: 'pixar' },
                          { label: t('theme_pastel'), value: 'pastel' },
                          { label: t('theme_watercolor_islamic'), value: 'watercolor_islamic' },
                          { label: t('theme_pink_family'), value: 'pink_family' },
                          { label: t('theme_navy_night'), value: 'navy_night' },
                          { label: t('theme_happy_night_nature'), value: 'happy_night_nature' },
                          { label: t('theme_chibi'), value: 'chibi' }, 
                          { label: t('theme_paper_cut_craft'), value: 'paper_cut_craft' },
                          { label: t('theme_retro_pixel_art'), value: 'retro_pixel_art' },
                          { label: t('theme_clean_white_paper'), value: 'clean_white_paper' },
                          { label: t('theme_minimal_white_frame_edu'), value: 'minimal_white_frame_edu' },
                          { label: t('theme_magic_kids_islamic_glow'), value: 'magic_kids_islamic_glow' },
                          { label: t('theme_faith_storybook_3d'), value: 'faith_storybook_3d' }, 
                          { label: t('theme_clay_3d'), value: 'clay_3d' },
                          { label: t('theme_cinematic_story_illustration'), value: 'cinematic_story_illustration' },
                          { label: t('theme_expressive_edu'), value: 'expressive_edu_illustration' },
                          { label: t('theme_serene_3d_edu'), value: 'serene_3d_edu_visual' },
                          { label: t('theme_cinematic_infographic_flow'), value: 'cinematic_infographic_flow' },
                          { label: t('theme_soft_empathy_illustration'), value: 'soft_empathy_illustration' },
                          { label: t('theme_corporate_flat_vector'), value: 'corporate_flat_vector' },
                          { label: t('theme_3d_isometric_glass'), value: '3d_isometric_glass' },
                          { label: t('theme_hand_drawn_sketch'), value: 'hand_drawn_sketch' },
                          { label: t('theme_edu_faceless_3d'), value: 'edu_faceless_3d' },
                          { label: t('theme_rajut_educatif'), value: 'rajut_educatif' },
                          { label: t('theme_sacred_quotes'), value: 'sacred_quotes' },
                          { label: t('theme_premium_kids_activity_infographic'), value: 'premium_kids_activity_infographic' },
                          { label: t('theme_manual'), value: 'custom' }
                        ]}
                        className="rounded-xl border-slate-200 dark:border-slate-700 mb-2"
                      />
                      {!['', 'pixar', 'auto', 'pastel', 'watercolor_islamic', 'pink_family', 'navy_night', 'happy_night_nature', 'chibi', 'paper_cut_craft', 'retro_pixel_art', 'clean_white_paper', 'minimal_white_frame_edu', 'magic_kids_islamic_glow', 'faith_storybook_3d', 'clay_3d', 'cinematic_story_illustration', 'expressive_edu_illustration', 'serene_3d_edu_visual', 'cinematic_infographic_flow', 'soft_empathy_illustration', 'corporate_flat_vector', '3d_isometric_glass', 'hand_drawn_sketch', 'edu_faceless_3d', 'rajut_educatif', 'sacred_quotes', 'realist_photography', 'nusantara_cozy_infographic', 'premium_kids_activity_infographic'].includes(formData.visualTheme) && (
                        <div className="flex gap-2">
                          <Input label="" placeholder={t('ph_visual_theme')} value={formData.visualTheme} onChange={e => updateData('visualTheme', e.target.value)} className="rounded-xl border-slate-200 dark:border-slate-700" />
                          <button className="bg-blue-600 text-white rounded-xl p-3 hover:bg-blue-700 transition-colors">
                            <Palette className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="mb-10">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('label_ai_instruct')}</label>
                 </div>
                 <textarea 
                    className="w-full border border-slate-200 dark:border-slate-800 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-28 text-sm font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50"
                    placeholder={t('ph_ai_instruct')}
                    value={formData.additionalPrompt}
                    onChange={e => updateData('additionalPrompt', e.target.value)}
                 />
              </div>

              <div className="w-full border-b border-slate-100 dark:border-slate-800 mb-10"></div>

              <div className="flex justify-center">
                 <button 
                  onClick={() => setStep(AppStep.VISUAL)}
                  disabled={!formData.title}
                  className="bg-blue-600 text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                 >
                   {t('btn_next_assets')} <ArrowRight className="w-5 h-5" />
                 </button>
              </div>

              <DisclaimerFooter />

            </div>
          </div>
        );

      case AppStep.VISUAL:
        return (
          <div className="max-w-4xl mx-auto px-4 w-full py-8 animate-fade-in">
             {/* Header with Progress */}
             <div className="bg-blue-600 border border-blue-500 border-b-0 p-8 md:p-12 rounded-t-[2.5rem] relative overflow-hidden shadow-2xl shadow-blue-500/20 z-10">
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                
                <button 
                  onClick={() => setStep(AppStep.INFO)}
                  className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 z-20 backdrop-blur-md"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('back')}
                </button>

                <div className="text-center relative z-10">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                     {formData.mode || 'POSTER EDUKASI'}
                  </h2>
                  {/* Stepper */}
                  <div className="max-w-md mx-auto mt-8">
                    <div className="flex items-center justify-between text-[10px] md:text-xs font-bold text-blue-100 uppercase tracking-widest mb-3">
                      <span>{t('loading')}</span>
                      <span>50%</span>
                    </div>
                    <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden relative">
                       <div className="absolute left-0 top-0 h-full bg-emerald-400 w-1/2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-bold text-blue-200">
                      <span>1. {t('step_info')}</span>
                      <span className="text-emerald-400">2. {t('step_upload')}</span>
                      <span>3. {t('step_result')}</span>
                    </div>
                  </div>
                </div>
             </div>

             {/* Main Card */}
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-16 rounded-b-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none relative z-20 -mt-1 transition-colors">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                   <div className="flex items-center justify-center gap-3 mb-4">
                     <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl">
                       <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                     </div>
                     <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('title_visual_upload')}</h3>
                   </div>
                   <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-xl mx-auto">{t('desc_visual_upload')}</p>
                </div>

                {/* Character Toggle Box */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                     <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                       <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                     </div>
                     <span className="font-bold text-sm md:text-base uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('label_show_char')}</span>
                   </div>
                   <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <button 
                        onClick={() => updateData('showCharacter', false)}
                        className={`px-8 py-3 rounded-xl font-bold text-xs uppercase transition-all ${!formData.showCharacter ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                      >
                        {t('btn_no_faceless')}
                      </button>
                      <button 
                        onClick={() => updateData('showCharacter', true)}
                        className={`px-8 py-3 rounded-xl font-bold text-xs uppercase transition-all ${formData.showCharacter ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                      >
                        {t('btn_yes')}
                      </button>
                   </div>
                </div>

                {/* Hidden Character Settings (Only if YES) */}
                {formData.showCharacter && (
                  <div className="mb-10 p-8 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-3xl animate-slide-down">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <Select 
                            label={t('label_gender')}
                            value={formData.gender || Gender.MALE}
                            onChange={e => updateData('gender', e.target.value)}
                            options={Object.values(Gender).map(g => ({ label: genderLabels[g], value: g }))}
                            className="rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                         
                         {/* Hijab Dropdown - Only for Non-Male */}
                         {formData.gender !== Gender.MALE && (
                            <Select 
                                label={t('label_hijab')}
                                value={formData.hijab ? 'Ya' : 'Tidak'}
                                onChange={e => {
                                  const val = e.target.value === 'Ya';
                                  updateData('hijab', val);
                                  if (!val) updateData('niqab', false); // Reset niqab if hijab is off
                                }}
                                options={[
                                    { label: t('opt_no'), value: 'Tidak' },
                                    { label: t('opt_yes'), value: 'Ya' }
                                ]}
                                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                             />
                         )}

                         {/* Niqab Dropdown - Only if Hijab is On */}
                         {formData.gender !== Gender.MALE && formData.hijab && (
                            <Select 
                                label={t('label_niqab')}
                                value={formData.niqab ? 'Ya' : 'Tidak'}
                                onChange={e => updateData('niqab', e.target.value === 'Ya')}
                                options={[
                                    { label: t('opt_no'), value: 'Tidak' },
                                    { label: t('opt_yes'), value: 'Ya' }
                                ]}
                                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                             />
                         )}
                      </div>
                  </div>
                )}

                {/* Upload Grid (4 Boxes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                   <UploadBox title={t('box_char_photo')} category="char" count={assetCounts.char} onFileSelect={handleFileUpload} />
                   <UploadBox title={t('box_logo')} category="logo" count={assetCounts.logo} onFileSelect={handleFileUpload} />
                   <UploadBox title={t('box_ref')} category="ref" count={assetCounts.ref} onFileSelect={handleFileUpload} />
                   <UploadBox title={t('box_attr')} category="attr" count={assetCounts.attr} onFileSelect={handleFileUpload} />
                </div>

                <div className="w-full border-b border-slate-100 dark:border-slate-800 mb-10"></div>

                {/* Action Button */}
                <div className="flex justify-center mt-12">
                   <button 
                     onClick={() => setStep(AppStep.RESULT)}
                     className="bg-emerald-500 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-xl shadow-emerald-500/25 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4 uppercase tracking-wider"
                   >
                     <Sparkles className="w-6 h-6" /> {t('btn_generate_prompt')}
                   </button>
                </div>

                <DisclaimerFooter />
             </div>
          </div>
        );

      case AppStep.RESULT:
        let displayJson: any = {};
        let multiPageResults: { title: string, content: any }[] = [];

        // Realistic Theme Logic
        const isRealistPhotography = formData.visualTheme === 'realist_photography';
        const isRealistic = formData.visualStyle === VisualStyle.PHOTOREALISTIC || formData.visualStyle === VisualStyle.REALISTIC || isRealistPhotography;

        const realisticNegativePrompts = [
          "plastic skin", "wax face", "doll body", "CGI", "3D render", "illustration", "anime", "cartoon", 
          "AI generated look", "over-smooth fabric", "glossy print", "floating artwork", "fake lighting", "blurry text"
        ];

        // Check if it's an infographic and likely a recipe
        const isRecipeInfographic = isInfographic && (
          formData.topic.toLowerCase().includes('resep') ||
          formData.topic.toLowerCase().includes('memasak') ||
          formData.topic.toLowerCase().includes('minuman') ||
          formData.preset.toLowerCase().includes('recipe') ||
          formData.preset.toLowerCase().includes('drink_recipes')
        );

        if (formData.mode === PosterMode.WORKSHEET && formData.visualTheme === 'premium_kids_activity_infographic') {
             const pCount = formData.worksheetPromptCount || 1;
             const materialsList = formData.materials || [];
             const footerSeriesLabel = `Seri ${formData.topic || 'Edukatif'}: ${formData.title || formData.worksheetType}`;

             const usiaTarget = targetAudienceLabels[formData.targetAudience as TargetAudience] || formData.targetAudience;
             const formatDesain = formData.size;
             const styleVisualSelected = visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle;
             const paletWarna = `pastel modern sesuai konteks tema ${formData.topic || 'edukasi'} (misal: Islami -> cream/gold/sage, Sains -> sky blue/green, Angka/Huruf -> baby blue/peach, Hewan -> earthy brown)`;
             const deskripsiHero = formData.topic ? `Ilustrasi interaktif tentang ${formData.topic}` : 'Ilustrasi utama yang menarik dan playful';
             const elemenDekoratif = `Elemen yang mendukung tema ${formData.topic || 'pembelajaran'}`;
             const teksEdukasiSingkat = formData.funFact ? `Belajar Seru: ${formData.funFact}` : `Fakta seru tentang ${formData.topic || 'materi ini'}`;
             const aktivitasInteraktif = worksheetTypeLabels[formData.worksheetType as WorksheetType] || formData.worksheetType;
             const funFactEdukasi = formData.funFact || `[AI to generate: fun fact edukasi tambahan]`;
             const judulRewardSection = "Hebat! Warnai Bintangmu";
             const styleBackground = "clean pastel, subtle texture, soft gradient, atau playful pattern minimalis";

             // Define these to be compatible with legacy template variables
             const judulMateri = formData.title || '[Judul Materi]';
             const subheadlineMateri = formData.subtitle || '[Sub Judul]';
             const isiMateriUtama = formData.material || '[AI to generate: materi pembelajaran singkat]';

             const buildSinglePremiumPrompt = (itemJudul: string, itemIsi: string) => {
                 return `Buat desain worksheet edukasi anak premium bergaya Premium Kids Activity Infographic untuk audience anak usia ${usiaTarget} dalam format ${formatDesain} seperti printable educational content premium Pinterest/Etsy. Desain dibuat dalam satu halaman utuh dengan layout modular infographic worksheet yang dinamis, playful, clean, engaging, mudah dipahami anak, dan tidak monoton.

Tema utama worksheet adalah:
"${itemJudul}"

Dengan subheadline:
"${subheadlineMateri}"

Fokus pada visual yang premium, educational, aesthetic, fun, immersive, dan terlihat seperti modern kids learning content profesional.

Gunakan gaya visual:
${styleVisualSelected}

Gunakan palet warna harmonis dan child-friendly seperti:
${paletWarna}

Buat suasana visual terasa:
- cozy
- playful
- educational
- premium printable aesthetic
- engaging untuk anak
- modern homeschooling worksheet style

Tampilkan hero section utama berupa:
${deskripsiHero}

Tambahkan elemen dekoratif yang relevan dengan tema seperti:
${elemenDekoratif}

Gunakan karakter visual yang:
- cute
- clean
- modern
- friendly
- toddler-safe
- expressive
- soft kawaii illustration style
- premium educational aesthetic

Gunakan komposisi asymmetrical modern dengan visual hierarchy yang jelas. Variasikan ukuran elemen, posisi section, decorative shape, framing visual, floating elements, dan activity placement agar layout terasa hidup, modern, playful, immersive, dan tidak repetitif.

Tambahkan section identitas di bagian atas:
- Nama
- Nilai
- Pembuat / Guru: ${formData.socialAccount || 'Nama Pembuat'}

Gunakan typography:
- rounded bold modern font untuk headline
- clean sans-serif font untuk isi
- child-friendly readability
- premium educational printable typography

Tampilkan section pengenalan materi menggunakan visual modular card.

Isi section menyesuaikan dengan:
${itemIsi}

Setiap card materi ditampilkan menggunakan:
- visual utama besar
- label/judul
- penjelasan sederhana
- clean rounded card
- soft shadow
- modern educational infographic style
- premium pastel aesthetic

Tambahkan mini section edukasi:
"${teksEdukasiSingkat}"

Tampilkan aktivitas utama menggunakan layout modular activity card.

Aktivitas dapat berupa:
${aktivitasInteraktif}

Gunakan visual activity seperti:
- tracing activity
- matching game
- circle activity
- connect line
- puzzle sederhana
- coloring section
- sticker interaction
- visual guide
- handwriting practice
- playful learning interaction
- educational icons

Tambahkan section fun educational note:
"${funFactEdukasi}"

Tambahkan section reward:
"${judulRewardSection}"

dengan visual:
- bintang lucu
- badge reward
- cute achievement icon
- self appreciation area anak

Gunakan layout zig-zag modern atau dynamic infographic composition agar worksheet tidak monoton.

Tambahkan decorative educational elements seperti:
- cloud doodle
- stars
- sparkle
- playful arrows
- sticker elements
- learning badges
- floating shapes
- decorative icons
- soft background decoration
- cute educational objects

Gunakan background:
${styleBackground}

Pastikan seluruh desain terlihat seperti premium printable worksheet dengan kualitas visual tinggi.

Style visual harus memiliki karakteristik:
- modern kids infographic
- Pinterest printable aesthetic
- Montessori inspired layout
- premium homeschooling printable
- clean editorial educational layout
- playful activity board
- immersive visual storytelling
- aesthetic educational composition
- modern modular worksheet
- engaging visual hierarchy

Hindari hasil visual seperti:
- worksheet polos
- flat worksheet
- clipart random
- font jadul
- visual kosong
- layout monoton
- crowded composition
- neon color berlebihan
- generic AI worksheet
- low quality educational sheet
- messy typography
- scary character
- AI artifact
- blurry text
- ugly spacing

Hasil akhir harus terlihat seperti premium modern educational printable worksheet siap print/publish dengan visual yang:
- engaging
- aesthetic
- educational
- playful
- immersive
- profesional
- modern
- high quality
- Pinterest/Etsy printable aesthetic
- tidak monoton
- clean premium composition
- visually balanced
- child-friendly
- interactive
- editorial quality`;
             };

             if (formData.worksheetOutputMode === WorksheetOutputMode.COVER_AND_CONTENT) {
                 const coverJson = {
                    project_type: "WORKSHEET_COVER_PAGE",
                    target_audience: formData.targetAudience,
                    app_source: "POSTLY CREATIVE STUDIO",
                    specs: {
                       size: formData.size,
                       type: "COVER DESIGN ONLY"
                    },
                    content: {
                       title_big: formData.title,
                       subtitle: formData.subtitle,
                       subject_topic: formData.topic,
                       identity_section: {
                          required_fields: ["Nama", "Kelas", "Sekolah"],
                          creator_name: formData.socialAccount || "Nama Pembuat",
                          placement: "Bottom / Center Bottom",
                          style: "Clean fillable lines"
                       },
                       footer_text: formData.cta,
                       creator_name: formData.socialAccount || "Nama Pembuat",
                       footer_series_label: footerSeriesLabel
                    },
                    visual_style: {
                        mode: styleVisualSelected,
                        theme: formData.visualTheme || 'Custom/Manual',
                        character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                        extra_prompt: formData.additionalPrompt,
                        ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                        description: `Desain COVER halaman depan untuk Worksheet/LKS. Judul Besar: "${formData.title}". Subjudul: "${formData.subtitle}". Ilustrasi utama: ${formData.topic}. Gaya: ${styleVisualSelected}. WAJIB sertakan area identitas siswa (Nama, Kelas, Sekolah) dengan layout rapi dan garis isian di bagian bawah cover. Fokus pada estetika cover yang edukatif & profesional.
                          \nPembuat / Guru: "${formData.socialAccount || 'Nama Pembuat'}"
                          \nFOOTER SERIES LABEL RULE: Footer harus ada di bagian bawah cover, dengan teks: "${footerSeriesLabel}".`
                    }
                 };
                 multiPageResults.push({ title: "PROMPT COVER WORKSHEET", content: coverJson });

                 for (let i = 0; i < pCount; i++) {
                     const customMat = materialsList[i] || formData.material || '';
                     const itemTitle = pCount > 1 ? `${formData.title || '[Judul Materi]'} - Bagian ${i + 1}` : (formData.title || '[Judul Materi]');
                     const pageTitle = pCount > 1 ? `PROMPT ISI WORKSHEET ${i + 1} (Bagian ${i+1} dari ${pCount})` : "PROMPT ISI WORKSHEET";
                     multiPageResults.push({ title: pageTitle, content: buildSinglePremiumPrompt(itemTitle, customMat) });
                 }
             } else if (pCount > 1) {
                 for (let i = 0; i < pCount; i++) {
                     const customMat = materialsList[i] || formData.material || '';
                     const itemTitle = `${formData.title || '[Judul Materi]'} - Bagian ${i + 1}`;
                     const pageTitle = `PROMPT ISI WORKSHEET ${i + 1} (Bagian ${i+1} dari ${pCount})`;
                     multiPageResults.push({ title: pageTitle, content: buildSinglePremiumPrompt(itemTitle, customMat) });
                 }
             }

             displayJson = `Buat desain worksheet edukasi anak premium bergaya Premium Kids Activity Infographic untuk audience anak usia ${usiaTarget} dalam format ${formatDesain} seperti printable educational content premium Pinterest/Etsy. Desain dibuat dalam satu halaman utuh dengan layout modular infographic worksheet yang dinamis, playful, clean, engaging, mudah dipahami anak, dan tidak monoton.

Tema utama worksheet adalah:
"${judulMateri}"

Dengan subheadline:
"${subheadlineMateri}"

Fokus pada visual yang premium, educational, aesthetic, fun, immersive, dan terlihat seperti modern kids learning content profesional.

Gunakan gaya visual:
${styleVisualSelected}

Gunakan palet warna harmonis dan child-friendly seperti:
${paletWarna}

Buat suasana visual terasa:
- cozy
- playful
- educational
- premium printable aesthetic
- engaging untuk anak
- modern homeschooling worksheet style

Tampilkan hero section utama berupa:
${deskripsiHero}

Tambahkan elemen dekoratif yang relevan dengan tema seperti:
${elemenDekoratif}

Gunakan karakter visual yang:
- cute
- clean
- modern
- friendly
- toddler-safe
- expressive
- soft kawaii illustration style
- premium educational aesthetic

Gunakan komposisi asymmetrical modern dengan visual hierarchy yang jelas. Variasikan ukuran elemen, posisi section, decorative shape, framing visual, floating elements, dan activity placement agar layout terasa hidup, modern, playful, immersive, dan tidak repetitif.

Tambahkan section identitas di bagian atas:
- Nama
- Nilai
- Pembuat / Guru: ${formData.socialAccount || 'Nama Pembuat'}

Gunakan typography:
- rounded bold modern font untuk headline
- clean sans-serif font untuk isi
- child-friendly readability
- premium educational printable typography

Tampilkan section pengenalan materi menggunakan visual modular card.

Isi section menyesuaikan dengan:
${isiMateriUtama}

Setiap card materi ditampilkan menggunakan:
- visual utama besar
- label/judul
- penjelasan sederhana
- clean rounded card
- soft shadow
- modern educational infographic style
- premium pastel aesthetic

Tambahkan mini section edukasi:
"${teksEdukasiSingkat}"

Tampilkan aktivitas utama menggunakan layout modular activity card.

Aktivitas dapat berupa:
${aktivitasInteraktif}

Gunakan visual activity seperti:
- tracing activity
- matching game
- circle activity
- connect line
- puzzle sederhana
- coloring section
- sticker interaction
- visual guide
- handwriting practice
- playful learning interaction
- educational icons

Tambahkan section fun educational note:
"${funFactEdukasi}"

Tambahkan section reward:
"${judulRewardSection}"

dengan visual:
- bintang lucu
- badge reward
- cute achievement icon
- self appreciation area anak

Gunakan layout zig-zag modern atau dynamic infographic composition agar worksheet tidak monoton.

Tambahkan decorative educational elements seperti:
- cloud doodle
- stars
- sparkle
- playful arrows
- sticker elements
- learning badges
- floating shapes
- decorative icons
- soft background decoration
- cute educational objects

Gunakan background:
${styleBackground}

Pastikan seluruh desain terlihat seperti premium printable worksheet dengan kualitas visual tinggi.

Style visual harus memiliki karakteristik:
- modern kids infographic
- Pinterest printable aesthetic
- Montessori inspired layout
- premium homeschooling printable
- clean editorial educational layout
- playful activity board
- immersive visual storytelling
- aesthetic educational composition
- modern modular worksheet
- engaging visual hierarchy

Hindari hasil visual seperti:
- worksheet polos
- flat worksheet
- clipart random
- font jadul
- visual kosong
- layout monoton
- crowded composition
- neon color berlebihan
- generic AI worksheet
- low quality educational sheet
- messy typography
- scary character
- AI artifact
- blurry text
- ugly spacing

Hasil akhir harus terlihat seperti premium modern educational printable worksheet siap print/publish dengan visual yang:
- engaging
- aesthetic
- educational
- playful
- immersive
- profesional
- modern
- high quality
- Pinterest/Etsy printable aesthetic
- tidak monoton
- clean premium composition
- visually balanced
- child-friendly
- interactive
- editorial quality`;
        } else if (formData.mode === PosterMode.WORKSHEET) {
           const footerSeriesLabel = `Seri ${formData.topic || 'Edukatif'}: ${formData.title || formData.worksheetType}`;
           const pCount = formData.worksheetPromptCount || 1;
           const materialsList = formData.materials || [];

           if (formData.worksheetOutputMode === WorksheetOutputMode.COVER_AND_CONTENT) {
               const coverJson = {
                  project_type: "WORKSHEET_COVER_PAGE",
                  target_audience: formData.targetAudience,
                  app_source: "POSTLY CREATIVE STUDIO",
                  specs: {
                     size: formData.size,
                     type: "COVER DESIGN ONLY"
                  },
                  content: {
                     title_big: formData.title,
                     subtitle: formData.subtitle,
                     subject_topic: formData.topic,
                     identity_section: {
                        required_fields: ["Nama", "Kelas", "Sekolah"],
                        creator_name: formData.socialAccount || "Nama Pembuat",
                        placement: "Bottom / Center Bottom",
                        style: "Clean fillable lines"
                     },
                     footer_text: formData.cta,
                     creator_name: formData.socialAccount || "Nama Pembuat",
                     footer_series_label: footerSeriesLabel
                  },
                  visual_style: {
                      mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle, 
                      theme: formData.visualTheme || 'Custom/Manual',
                      character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                      extra_prompt: formData.additionalPrompt,
                      ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                      description: `Desain COVER halaman depan untuk Worksheet/LKS. Judul Besar: "${formData.title}". Subjudul: "${formData.subtitle}". Ilustrasi utama: ${formData.topic}. Gaya: ${visualStyleLabels[formData.visualStyle as VisualStyle]}. WAJIB sertakan area identitas siswa (Nama, Kelas, Sekolah) dengan layout rapi dan garis isian di bagian bawah cover. Fokus pada estetika cover yang edukatif & profesional.
                        \nPembuat / Guru: "${formData.socialAccount || 'Nama Pembuat'}"
                        \nFOOTER SERIES LABEL RULE: Footer harus ada di bagian bawah cover, dengan teks: "${footerSeriesLabel}".`
                  }
               };
               multiPageResults.push({ title: "PROMPT COVER WORKSHEET", content: coverJson });

               for (let i = 0; i < pCount; i++) {
                  const customMat = materialsList[i] || '';
                  const pageTitle = pCount > 1 ? `PROMPT ISI WORKSHEET ${i + 1} (Bagian ${i+1} dari ${pCount})` : "PROMPT ISI WORKSHEET";
                  const contentJson = {
                     project_type: "WORKSHEET_CONTENT_PAGE",
                     target_audience: formData.targetAudience,
                     app_source: "POSTLY CREATIVE STUDIO",
                     specs: {
                        size: formData.size,
                        worksheet_type: formData.worksheetType,
                        total_questions: formData.questionCount,
                        layout: pCount > 1 ? `Content Page Layout - Part ${i + 1} of ${pCount}` : "Content Page Layout"
                     },
                     content: {
                        header_fields: ["Nama", "Nilai"],
                        instructions: customMat ? customMat.split('\n').filter(line => line.trim() !== '') : [],
                        question_space: "Sufficient writing area",
                        creator_name: formData.socialAccount || "Nama Pembuat",
                        footer_series_label: footerSeriesLabel
                     },
                     visual_style: {
                         mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                         theme: formData.visualTheme || 'Custom/Manual',
                         character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                         extra_prompt: formData.additionalPrompt,
                         ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                         description: `Desain HALAMAN ISI (Content Page) untuk Worksheet. Layout rapi untuk ${formData.worksheetType}. Area untuk ${formData.questionCount}. Gaya visual, font, dan warna harus konsisten dengan cover.
                           \nPembuat / Guru: "${formData.socialAccount || 'Nama Pembuat'}"
                           \n${generateWorksheetVisualRules(formData, worksheetTypeLabels, targetAudienceLabels, customMat)}`
                     }
                  };
                  multiPageResults.push({ title: pageTitle, content: contentJson });
               }

           } else if (pCount > 1) {
               for (let i = 0; i < pCount; i++) {
                  const customMat = materialsList[i] || '';
                  const pageTitle = `PROMPT ISI WORKSHEET ${i + 1} (Bagian ${i+1} dari ${pCount})`;
                  const contentJson = {
                     project_type: "WORKSHEET_LKS",
                     target_audience: formData.targetAudience,
                     app_source: "POSTLY CREATIVE STUDIO",
                     specs: {
                        size: formData.size,
                        worksheet_type: formData.worksheetType,
                        total_questions: formData.questionCount
                     },
                     content: {
                        topic: formData.topic,
                        title: pCount > 1 ? `${formData.title} - Bagian ${i + 1}` : formData.title,
                        creator_name: formData.socialAccount || "Nama Pembuat",
                        subtitle: formData.subtitle,
                        instructions: customMat ? customMat.split('\n').filter(line => line.trim() !== '') : [],
                        header_fields: ["Nama", "Nilai"],
                        footer_series_label: footerSeriesLabel
                     },
                     visual_style: {
                         mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                         theme: formData.visualTheme || 'Custom/Manual',
                         character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                         extra_prompt: formData.additionalPrompt,
                         ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                         description: `Desain Worksheet/LKS lengkap.
                           \nPembuat / Guru: "${formData.socialAccount || 'Nama Pembuat'}"
                           \n${generateWorksheetVisualRules(formData, worksheetTypeLabels, targetAudienceLabels, customMat)}`
                     }
                  };
                  multiPageResults.push({ title: pageTitle, content: contentJson });
               }
           } else {
               displayJson = {
                  project_type: "WORKSHEET_LKS",
                  target_audience: formData.targetAudience,
                  app_source: "POSTLY CREATIVE STUDIO",
                  specs: {
                     size: formData.size,
                     worksheet_type: formData.worksheetType,
                     total_questions: formData.questionCount
                  },
                  content: {
                     topic: formData.topic,
                     title: formData.title,
                     creator_name: formData.socialAccount || "Nama Pembuat",
                     subtitle: formData.subtitle,
                     instructions: formData.material ? formData.material.split('\n').filter(line => line.trim() !== '') : [],
                     header_fields: ["Nama", "Nilai"],
                     footer_series_label: footerSeriesLabel
                  },
                  visual_style: {
                      mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                      theme: formData.visualTheme || 'Custom/Manual',
                      character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                      extra_prompt: formData.additionalPrompt,
                      ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                      description: `Desain Worksheet/LKS lengkap.
                        \nPembuat / Guru: "${formData.socialAccount || 'Nama Pembuat'}"
                        \n${generateWorksheetVisualRules(formData, worksheetTypeLabels, targetAudienceLabels)}`
                  }
               };
           }
        } else if (isRecipeInfographic) { // New logic for recipe infographics
          const styleVisualContent = visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle;
          const targetAudienceContent = targetAudienceLabels[formData.targetAudience as TargetAudience] || formData.targetAudience;
          let layoutContent = infographicLayoutFlowLabels[formData.infographicLayoutFlow as InfographicLayoutFlow] || formData.infographicLayoutFlow;
          let characterContent = formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "tanpa karakter (faceless)";
          let additionalStyleDetails = formData.visualTheme || 'Premium, aesthetic, photorealistic';
          let specificNegativePrompt = 'anime, cartoon, CGI, 3D render, plastic texture, wax skin, doll effect, fake lighting, glossy fabric, blurry text, distorted objects, messy composition, oversaturated colors, flat lighting, low quality, AI generated look.';
          let backgroundDetails = `* cafe aesthetic\n* kitchen environment\n* dark wooden table\n* marble texture\n* street food ambiance\n* clean studio backdrop\n* natural restaurant atmosphere`;

          if (formData.visualTheme === 'nusantara_cozy_infographic') {
              characterContent = formData.showCharacter ? `karakter faceless dengan pose natural sedang memegang, menyajikan, memasak, atau menikmati makanan.\n\n- Jika karakter perempuan: warna outfit feminin lembut (cream, beige, olive, sage green, mocca, soft brown, dusty pink, warm caramel, latte, ivory).\n- Jika karakter laki-laki: warna outfit maskulin warm aesthetic (dark olive, earthy brown, khaki, warm grey, black coffee, navy muted, forest green, terracotta, sand beige).\nPastikan warna outfit karakter selalu selaras dengan tone makanan` : "tanpa karakter (faceless)";
              additionalStyleDetails = `soft clay semi-realistic illustration, warm earthy palette, cozy Indonesian culinary ambience, layered rounded infographic cards, smooth organic composition, soft cinematic lighting, realistic food texture, heritage modern typography, premium cozy social media infographic.\nTone warna menyesuaikan jenis masakan (misal: soto -> warm yellow/turmeric gold, pedas -> red chili/smoky black, dessert -> cream pastel, jajanan pasar -> banana leaf green/palm sugar brown, kopi -> espresso brown/cream latte).`;
              specificNegativePrompt = `anime, cartoon berlebihan, CGI, glossy plastic texture, wax skin, neon cyberpunk, futuristic UI, over saturated color, fake lighting, doll effect, low quality render, AI artifacts, messy composition.`;
              layoutContent = 'vertical scroll modern, asymmetrical composition, zig-zag section flow, rounded layered card, cozy spacing, premium editorial balance';
              backgroundDetails = `* angkringan aesthetic\n* dapur tradisional modern\n* pasar nusantara\n* rustic wooden table\n* cafe heritage\n* warm kitchen\n* Indonesian cultural ambience`;
          }

          displayJson = `Buat desain infografis resep ${formData.topic || 'makanan/minuman'} realistis bergaya ${formData.visualTheme || 'Modern'} untuk audience ${targetAudienceContent} dalam format ${formData.size} seperti konten media sosial modern. Desain dibuat dalam satu halaman utuh dengan layout ${layoutContent} yang dinamis, modern, clean, mudah dipahami, dan tidak monoton. Fokus pada visual yang premium, engaging, serta terlihat seperti konten profesional social media.

Gunakan gaya visual ${styleVisualContent} dengan pencahayaan cinematic/natural lighting. Tone warna menyesuaikan tema makanan atau minuman yang dibahas agar terlihat harmonis, menggugah selera, dan sesuai dengan mood visual.

Tampilkan hero section utama berupa close-up ${formData.topic || 'hidangan utama'} dengan detail realistis seperti texture makanan/minuman, embun air, asap hangat, topping, garnish, sauce drizzle, splash effect, atau elemen visual lain yang sesuai dengan jenis menu. Tambahkan suasana environment yang relevan seperti cafe modern, kitchen aesthetic, meja restoran, outdoor food market, atau background sesuai tema konten.

Jika terdapat karakter, gunakan karakter ${characterContent} dengan pose natural dan realistis yang mendukung aktivitas memasak, menyajikan, atau memegang makanan/minuman secara aesthetic. Pastikan outfit, gesture, dan visual karakter terlihat natural, elegan, dan tidak memiliki efek AI berlebihan.

Gunakan komposisi asymmetrical modern dengan visual hierarchy yang jelas. Variasikan ukuran elemen, posisi teks, framing visual, dan layout tiap section agar desain terasa hidup, dinamis, dan tidak repetitif.

Bagian atas desain menampilkan headline besar:
“${formData.title}”

dengan subheadline:
“${formData.subtitle}”

Gunakan typography bold modern font untuk headline dan clean sans-serif font untuk body text. Pastikan teks mudah dibaca dan terlihat premium seperti editorial infographic modern.

Tampilkan section bahan menggunakan floating ingredient layout berisi:
[AI to generate: concise list of main ingredients and spices with measurements]

Tambahkan visual realistis dari bahan utama, bumbu, topping, garnish, atau elemen pendukung yang melayang estetik di sekitar section bahan.

Tampilkan section alat menggunakan icon atau visual realistis:
[AI to generate: concise list of cooking/serving tools]

Tampilkan langkah pembuatan secara step-by-step menggunakan visual realistis berbeda di setiap langkah:
${formData.material || '[AI to generate: Step-by-step instructions]'}

Setiap langkah harus memiliki focal point visual berbeda seperti:
* close-up pouring shot
* mixing texture
* cooking process
* steam effect
* crispy texture
* sauce drizzle
* garnish close-up
* cinematic serving shot

Gunakan layout zig-zag modern atau dynamic composition agar visual tidak monoton.

Tambahkan section tips dengan gaya visual modern:
[AI to generate: secret cooking tips]

Tambahkan section fun fact:
“${formData.funFact || '[AI to generate: Fun fact tentang resep]'}”

Tambahkan section serving suggestion:
“[AI to generate: best serving method]”

Tambahkan call to action besar di bagian bawah:
“${formData.cta}”

Tambahkan identitas Pembuat / Guru di bagian footer:
“${formData.socialAccount || 'Nama Pembuat'}”

Tambahkan elemen dekoratif realistis yang sesuai dengan tema seperti:
* splash effect
* floating ingredients
* steam
* smoke
* powder texture
* sauce texture
* water droplets
* soft shadow
* realistic reflection
* layered infographic elements
* dynamic modern shapes
* wooden texture
* banana leaf
* woven bamboo tray
* ceramic bowl

Gunakan background yang menyesuaikan tema makanan/minuman seperti:
${backgroundDetails}

Pastikan seluruh desain terlihat seperti premium social media infographic dengan kualitas visual tinggi.

Style visual harus:
${additionalStyleDetails}

Hindari hasil visual seperti:
${specificNegativePrompt}

Hasil akhir harus terlihat seperti infografis resep premium siap publish untuk media sosial modern dengan visual realistis yang kuat, aesthetic, profesional, engaging, dan tidak monoton.`;
        } else if (isInfographic && formData.infographicArchitectureType === InfographicArchitectureType.CENTRAL_FOCUS_TEXT_CENTRIC) {
          // New logic for Central Focus / Text-Centric Infographic
          displayJson = {
            project_type: "INFOGRAPHIC_TEXT_CENTRIC",
            target_audience: formData.targetAudience,
            app_source: "POSTLY CREATIVE STUDIO",
            specs: {
              size: formData.size,
              architecture_type: formData.infographicArchitectureType,
            },
            header: {
              main_title: formData.title,
              sub_title: formData.subtitle,
              topic: formData.topic, // Still include topic for context if available
            },
            body: {
              main_text: formData.material, // The core content is the material
            },
            footer: {
              identity: formData.socialAccount || "Nama Pembuat"
            },
            visual_style: {
              mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
              theme: formData.visualTheme || 'Custom/Manual',
              character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
              extra_prompt: formData.additionalPrompt,
              ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
              description: `Generate a visually appealing, clean, and minimalist infographic with a strong central focus on the text.
                **Content**: The main message is: "${formData.material}". Title: "${formData.title}". Subtitle: "${formData.subtitle}".
                **Creator/Identity**: "${formData.socialAccount || 'Nama Pembuat'}".
                **Style**: ${visualStyleLabels[formData.visualStyle as VisualStyle]}. Target audience: ${formData.targetAudience}.`
            },
            constraints: {
              single_page_design: true,
              no_animation_implied: true,
              focus_on_clarity: true,
              text_centric_layout: true,
              no_cta_element: true, // Explicitly state no CTA
              no_content_points: true, // Explicitly state no content points
            },
            instruction_to_model: "Create a single infographic design with the main text prominently displayed in the center."
          };
        }
        else if (isInfographic) { // Existing generic infographic logic
           displayJson = {
              project_type: "INFOGRAPHIC_EDUCATION",
              target_audience: formData.targetAudience,
              app_source: "POSTLY CREATIVE STUDIO",
              layout: {
                ratio: formData.size
              },
              header: {
                main_title: formData.title,
                sub_title: formData.subtitle,
                topic: formData.topic
              },
              body: {
                content_points: formData.material ? formData.material.split('\\n').filter(line => line.trim() !== '') : [],
                cta_element: formData.cta,
                ...(formData.showFunFact && formData.funFact && { fun_fact: formData.funFact }) // Conditionally add fun_fact
              },
              footer: {
                identity: formData.socialAccount || "Nama Pembuat"
              },
              visual_style: {
                mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                theme: formData.visualTheme || 'Custom/Manual',
                character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                extra_prompt: formData.additionalPrompt,
                ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                description: `Desain infografis edukasi. Judul Utama: "${formData.title}". Subjudul: "${formData.subtitle}". Topik: "${formData.topic}". Gaya: ${visualStyleLabels[formData.visualStyle as VisualStyle]}. Arsitektur: ${formData.infographicArchitectureType}. Tata Letak: ${formData.infographicLayoutFlow}. Target audiens: ${formData.targetAudience}. Pembuat/Guru: "${formData.socialAccount || 'Nama Pembuat'}".`
              },
              constraints: {
                single_page_design: true,
                no_animation_implied: true,
                focus_on_clarity: true
              },
              instruction_to_model: "Buat satu desain infografis yang lengkap dan siap publikasi, bukan multiple slides atau buku."
           };
        } else if (isEnvelope) {
          const isSmall = formData.size === AspectRatio.ENV_SMALL;
          
          if (isSmall) {
             displayJson = {
                "project_type": "PRINT_TEMPLATE_ENVELOPE_LARGE",
                "envelope_size": "SMALL",
                "paper_specification": {
                  "paper_type": "A4",
                  "paper_color": "white",
                  "orientation": "vertical",
                  "unit": "cm",
                  "paper_size": {
                    "width": 21,
                    "height": 29.7
                  }
                },
                "specs": {
                  "final_closed_size": {
                    "unit": "cm",
                    "width": 7,
                    "height": 10
                  },
                  "body_height_cm": 10,
                  "unfolded_print_size": {
                    "unit": "cm",
                    "width": 15,
                    "height": 14
                  },
                  "layout_type": "unfolded_envelope_dieline",
                  "print_mode": "print_ready",
                  "view": "top_view_flat",
                  "orientation": "horizontal_only",
                  "background": "plain_white"
                },
                "structure": {
                  "panels": [
                    {
                      "name": "left_panel",
                      "role": "sender_and_recipient_info",
                      "width_cm": 7
                    },
                    {
                      "name": "center_panel_front",
                      "role": "main_visible_front",
                      "width_cm": 7
                    },
                    {
                      "name": "right_panel",
                      "role": "glue_tab",
                      "width_cm": 1
                    },
                    {
                      "name": "top_flap",
                      "role": "decorative_only",
                      "height_cm": 2
                    },
                    {
                      "name": "bottom_flap",
                      "role": "folding_only_no_text",
                      "height_cm": 2
                    }
                  ],
                  "guides": [
                    "fold_lines",
                    "cut_lines"
                  ]
                },
                "content_rules": {
                  "text_allowed": true,
                  "placement": {
                    "main_greeting": "center_panel_front",
                    "message_or_prayer": "center_panel_front_below_greeting",
                    "sender_name": "left_panel_top",
                    "recipient_name": "left_panel_below_sender"
                  },
                  "forbidden_text_areas": [
                    "bottom_flap",
                    "right_panel"
                  ]
                },
                "content_data": {
                    "main_greeting": formData.title,
                    "message_or_prayer": formData.material || formData.subtitle,
                    "sender_name": formData.senderName,
                    "recipient_name": formData.recipientName,
                    "creator_name": formData.socialAccount || "Nama Pembuat"
                },
                "visual_rules": {
                  "design_style_source": {
                      "theme_name": formData.visualTheme || 'Custom/Manual',
                      "description": visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                      "detail": {
                        "mode": visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                        "theme": formData.visualTheme || 'Custom/Manual',
                        "character": formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                        "extra_prompt": formData.additionalPrompt
                      }
                  },
                  "ornament_distribution": {
                    "center_panel": "<AUTO>",
                    "left_panel": "<AUTO>",
                    "right_panel": "none_or_minimal",
                    "top_flap": "<AUTO>",
                    "bottom_flap": "none"
                  },
                  "no_poster_composition": true,
                  "no_single_canvas_design": true
                },
                "negative_prompt": [
                  "horizontal_canvas",
                  "horizontal_layout",
                  "landscape_orientation",
                  "landscape_a4",
                  "rotated_canvas",
                  "sideways_layout",
                  "non_a4_paper",
                  "letter_size",
                  "legal_size",
                  "square_canvas",
                  "poster_design",
                  "mockup",
                  "3d_render",
                  "perspective_view",
                  "shadow",
                  "depth_effect",
                  "single_page_design",
                  "vertical_reinterpretation_of_layout"
                ],
                "instruction_to_model": "Generate a SMALL print-ready unfolded envelope dieline with a 10 cm body height, placed on a single vertical A4 white paper sheet. The envelope layout must remain horizontal and flat. This is a professional envelope printing template, not a mockup or poster."
              };
          } else {
             displayJson = {
                "project_type": "PRINT_TEMPLATE_ENVELOPE_LARGE",
                "envelope_size": "LARGE",
                "paper_specification": {
                  "paper_type": "A4",
                  "paper_color": "white",
                  "orientation": "vertical",
                  "unit": "cm",
                  "paper_size": {
                    "width": 21,
                    "height": 29.7
                  }
                },
                "specs": {
                  "body_height_cm": 15,
                  "unfolded_print_size": {
                    "unit": "cm",
                    "width": 16,
                    "height": 21
                  },
                  "layout_type": "unfolded_envelope_dieline",
                  "print_mode": "print_ready",
                  "view": "top_view_flat",
                  "orientation": "horizontal_only",
                  "background": "plain_white"
                },
                "structure": {
                  "panels": [
                    {
                      "name": "left_panel",
                      "role": "sender_and_recipient_info",
                      "width_cm": 7.5
                    },
                    {
                      "name": "center_panel_front",
                      "role": "main_visible_front",
                      "width_cm": 7.5
                    },
                    {
                      "name": "right_panel",
                      "role": "glue_tab",
                      "width_cm": 1
                    },
                    {
                      "name": "top_flap",
                      "role": "decorative_only",
                      "height_cm": 3
                    },
                    {
                      "name": "bottom_flap",
                      "role": "folding_only_no_text",
                      "height_cm": 3
                    }
                  ],
                  "guides": [
                    "fold_lines",
                    "cut_lines"
                  ]
                },
                "content_rules": {
                  "text_allowed": true,
                  "placement": {
                    "main_greeting": "center_panel_front",
                    "message_or_prayer": "center_panel_front_below_greeting",
                    "sender_name": "left_panel_top",
                    "recipient_name": "left_panel_below_sender"
                  },
                  "forbidden_text_areas": [
                    "bottom_flap",
                    "right_panel"
                  ]
                },
                "content_data": {
                    "main_greeting": formData.title,
                    "message_or_prayer": formData.material || formData.subtitle,
                    "sender_name": formData.senderName,
                    "recipient_name": formData.recipientName,
                    "creator_name": formData.socialAccount || "Nama Pembuat"
                },
                "visual_rules": {
                  "design_style_source": {
                      "theme_name": formData.visualTheme || 'Custom/Manual',
                      "description": visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                       "detail": {
                        "mode": visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                        "theme": formData.visualTheme || 'Custom/Manual',
                        "character": formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                        "extra_prompt": formData.additionalPrompt
                      }
                  },
                  "ornament_distribution": {
                    "center_panel": "<AUTO>",
                    "left_panel": "<AUTO>",
                    "right_panel": "none_or_minimal",
                    "top_flap": "<AUTO>",
                    "bottom_flap": "none"
                  },
                  "no_poster_composition": true,
                  "no_single_canvas_design": true
                },
                "negative_prompt": [
                  "horizontal_canvas",
                  "horizontal_layout",
                  "landscape_orientation",
                  "landscape_a4",
                  "rotated_canvas",
                  "sideways_layout",
                  "non_a4_paper",
                  "letter_size",
                  "legal_size",
                  "square_canvas",
                  "poster_design",
                  "mockup",
                  "3d_render",
                  "perspective_view",
                  "shadow",
                  "depth_effect",
                  "single_page_design",
                  "vertical_reinterpretation_of_layout"
                ],
                "instruction_to_model": "Generate a LARGE print-ready unfolded envelope dieline with a 15 cm body height, placed on a single vertical A4 white paper sheet. The envelope layout must remain horizontal and flat. This is a professional envelope printing template, not a mockup or poster."
              };
          }
        } else {
           // Default Poster Mode logic
           displayJson = {
              project_type: "POSTER_DAKWAH_OR_INFO",
              target_audience: formData.targetAudience,
              app_source: "POSTLY CREATIVE STUDIO",
              layout: {
                ratio: formData.size
              },
              header: {
                main_title: formData.title,
                sub_title: formData.subtitle
              },
              body: {
                topic: formData.topic,
                points: formData.material ? formData.material.split('\\n').filter(line => line.trim() !== '') : []
              },
              footer: {
                cta: formData.cta,
                contact_person: formData.socialAccount || "Nama Pembuat",
                creator_name: formData.socialAccount || "Nama Pembuat"
              },
              visual_style: {
                mode: visualStyleLabels[formData.visualStyle as VisualStyle] || formData.visualStyle,
                theme: formData.visualTheme || 'Custom/Manual',
                character: formData.showCharacter ? `${formData.gender}${formData.hijab ? ', Hijab' : ''}${formData.niqab ? ', Cadar' : ''}` : "faceless / no human",
                extra_prompt: formData.additionalPrompt,
                ...(isRealistic && { negative_prompt: realisticNegativePrompts }),
                creator_name: formData.socialAccount || "Nama Pembuat"
              }
           };
        }

        const jsonString = typeof displayJson === 'string' ? displayJson : JSON.stringify(displayJson, null, 2);

        return (
          <div className="w-full animate-fade-in flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
             {/* Header Section (Blue) */}
             <div className="bg-blue-600 p-6 md:p-10 relative overflow-hidden transition-colors rounded-b-[3rem] shadow-xl shadow-blue-500/20">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '20px 20px'}}></div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                   {/* Top Row: Back Button & Title */}
                   <div className="flex items-center justify-between mb-8">
                      <button 
                        onClick={() => setStep(AppStep.VISUAL)} 
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-md"
                      >
                        <ArrowLeft className="w-4 h-4" /> {t('back')}
                      </button>
                      <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight text-center flex-1">
                        {formData.mode || 'POSTER'}
                      </h2>
                      <div className="w-[100px] hidden md:block"></div>
                   </div>

                   {/* Progress Bar */}
                   <div className="max-w-md mx-auto">
                      <div className="flex justify-between text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-2">
                         <span>{t('loading')}</span>
                         <span>100%</span>
                      </div>
                      <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden relative">
                         <div className="absolute inset-0 bg-emerald-400 w-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                      </div>
                      <div className="flex justify-between mt-3 text-[10px] font-bold text-blue-200">
                         <span>1. {t('step_info')}</span>
                         <span>2. {t('step_upload')}</span>
                         <span className="text-emerald-400">3. {t('step_result')}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Main Content */}
             <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10">
                
                {multiPageResults.length > 0 ? (
                    <div className="space-y-8">
                        {/* MULTI PAGE RENDER (WORKSHEET COVER+CONTENT) */}
                        {multiPageResults.map((page, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base uppercase tracking-widest flex items-center gap-2">
                                        <LayoutTemplate className="w-4 h-4 text-blue-600" /> {page.title}
                                    </h3>
                                    <button 
                                        onClick={() => handleCopy(typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2), idx)}
                                        className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${copiedId === idx ? 'bg-emerald-500 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'}`}
                                    >
                                        {copiedId === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 
                                        {copiedId === idx ? t('btn_copied') : t('btn_copy')}
                                    </button>
                                </div>
                                <div className="p-4 md:p-6 bg-slate-950 overflow-x-auto max-h-[250px] overflow-y-auto custom-scrollbar border-t border-slate-800">
                                    <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
                        {/* STANDARD MODE RENDER: Single Block */}
                        <div className="bg-slate-950 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
                            <span className="font-mono text-xs md:text-sm font-bold text-emerald-400 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div> OUTPUT_STREAM.JSON
                            </span>
                            <button 
                                onClick={() => handleCopy(jsonString, 'main')}
                                className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${copiedId === 'main' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {copiedId === 'main' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 
                                {copiedId === 'main' ? t('btn_copied') : t('btn_copy')}
                            </button>
                        </div>

                        <div className="bg-slate-950 p-6 md:p-8 overflow-x-auto max-h-[250px] overflow-y-auto custom-scrollbar">
                            <pre className="font-mono text-xs md:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                                {jsonString}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
                   <button 
                     onClick={() => setStep(AppStep.INFO)}
                     className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 min-w-[220px]"
                   >
                      <LayoutTemplate className="w-5 h-5" /> {t('btn_repair')}
                   </button>

                   <button 
                     onClick={() => window.open('https://gemini.google.com/app?hl=id', '_blank')}
                     className="bg-violet-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-violet-500/25 hover:bg-violet-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 min-w-[220px]"
                   >
                      <Wand2 className="w-5 h-5" /> {t('btn_open_gemini')}
                   </button>
                </div>

                {/* Footer */}
                <DisclaimerFooter />
             </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      {renderStep()}
    </Layout>
  );
};
