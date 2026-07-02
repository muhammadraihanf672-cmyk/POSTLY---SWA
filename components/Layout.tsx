
import React, { useState, useEffect } from 'react';
import { Search, Info, Globe, Sun, Moon, ZoomIn, ZoomOut, RefreshCcw, X, Check, Star, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Load theme from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Effect to apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 150)); // Max 150%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 60)); // Min 60%
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'id', label: 'ID (Indonesia)' },
    { code: 'en', label: 'EN (English)' },
    { code: 'ar', label: 'AR (Arabic)' },
    { code: 'ms', label: 'MS (Malay)' },
    { code: 'zh', label: 'ZH (Chinese)' },
    { code: 'ja', label: 'JA (Japanese)' },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white' : 'bg-slate-50 text-slate-900 selection:bg-blue-100'} relative font-sans`}>
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 relative z-50 sticky top-0 transition-colors duration-300 shadow-sm">
        <div className="w-full px-4 py-4 md:px-8 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 select-none cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="bg-blue-600 text-white p-2 rounded-2xl shadow-blue-500/20 shadow-lg transition-transform group-hover:scale-105">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none tracking-tight text-slate-900 dark:text-white">
                {t('app_title')}
              </span>
              <span className="font-bold text-[10px] leading-none tracking-[0.2em] text-purple-600 dark:text-purple-400 uppercase mt-1">
                {t('app_subtitle')}
              </span>
            </div>
          </div>

          {/* Toolbar Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden text-slate-600 dark:text-slate-400 font-medium text-sm shadow-sm">
              <button 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 60}
                className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <div onClick={resetZoom} className="px-4 py-1.5 bg-white dark:bg-slate-800 font-mono cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" title="Reset Zoom">
                {zoomLevel}%
              </div>
              
              <button 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 150}
                className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 border-l border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setIsInfoModalOpen(true)}
              className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm"
            >
              <Info className="w-5 h-5" />
            </button>
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm uppercase text-sm"
              >
                <Globe className="w-4 h-4" /> {language} <span className="text-[10px] opacity-50">▼</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between ${language === lang.code ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {lang.label}
                      {language === lang.code && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2.5 border rounded-xl transition-all shadow-sm ${isDarkMode ? 'border-amber-500/30 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-blue-500'}`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Zoom */}
      <main 
        className="flex-grow relative z-10 flex flex-col justify-start origin-top transition-transform duration-200 ease-out"
        style={{ 
          transform: `scale(${zoomLevel / 100})`,
          width: `${100 * (100 / zoomLevel)}%`, 
          height: `${100 * (100 / zoomLevel)}%`  
        }}
      >
        {children}
      </main>

      {/* About/Info Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsInfoModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl">
                   <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                   {t('about_title')}
                 </h2>
              </div>
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-10">
               {/* Description */}
               <div className="space-y-4">
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                    {t('about_desc')}
                  </p>
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('about_created_by')}
                  </p>
               </div>

               {/* Features */}
               <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {t('about_features')}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[t('feat_1'), t('feat_2'), t('feat_3'), t('feat_4')].map((feat, idx) => (
                       <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                         <div className="mt-0.5 bg-emerald-500/10 p-0.5 rounded-md">
                           <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                         </div>
                         {feat}
                       </li>
                     ))}
                  </ul>
               </div>

               {/* How To Use */}
               <div>
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" /> {t('about_howto')}
                  </h3>
                  <div className="space-y-6">
                    {[t('step_1'), t('step_2'), t('step_3'), t('step_4')].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-5">
                        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold rounded-xl shadow-lg shadow-blue-600/20 shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-base font-medium text-slate-700 dark:text-slate-200 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Footer / Version */}
               <div className="pt-8 flex flex-col items-center justify-center text-center border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{t('version')}</span>
                  </div>
                  <button 
                    onClick={() => setIsInfoModalOpen(false)}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                  >
                    {t('close')}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
