import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreeDBook } from './components/ThreeDBook';

export default function App() {
  const [mode, setMode] = useState<'hover' | 'cursor'>('hover');
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(45); // Motion response
  const [stagger, setStagger] = useState(70); // Default to more atmospheric/unified opening
  const [theme, setTheme] = useState<'studio' | 'blueprint' | 'darkroom'>('studio');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0, z: 0 });

  const [isAutoPilot, setIsAutoPilot] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      setScale(width < 640 ? Math.min(width / 400, 0.8) : 1);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const themes = {
    studio: { 
      bg: 'bg-[#fcfaf7]', 
      text: 'text-[#1a1a1a]', 
      border: 'border-black/[0.08]', 
      grid: 'opacity-[0.04]', 
      accent: '#5b9bd5',
      ui: 'bg-white/40',
      grain: 'mix-blend-multiply opacity-[0.14]'
    },
    blueprint: { 
      bg: 'bg-[#0a192f]', 
      text: 'text-[#94a3b8]', 
      border: 'border-[#1e293b]', 
      grid: 'opacity-[0.18]', 
      accent: '#38bdf8',
      ui: 'bg-[#0f172a]/60',
      grain: 'mix-blend-overlay opacity-[0.1]'
    },
    darkroom: { 
      bg: 'bg-[#080808]', 
      text: 'text-[#e5e5e5]', 
      border: 'border-white/[0.06]', 
      grid: 'opacity-[0.05]', 
      accent: '#5a9bd5',
      ui: 'bg-white/[0.03]',
      grain: 'mix-blend-screen opacity-[0.05]'
    },
    deadnote: {
      bg: 'bg-[#0a0a0a]',
      text: 'text-[#d4d4d4]',
      border: 'border-red-900/20',
      grid: 'opacity-[0.02]',
      accent: '#991b1b',
      ui: 'bg-red-950/5',
      grain: 'mix-blend-overlay opacity-[0.2]'
    }
  };

  const modeColors = {
    hover: theme === 'deadnote' ? 'bg-red-900/50' : 'bg-[#5b9bd5]',
    cursor: theme === 'deadnote' ? 'bg-red-900/50' : 'bg-[#5b9bd5]'
  };

  return (
    <main 
      onMouseMove={handleMouseMove}
      className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden ${themes[theme].bg} font-sans selection:bg-[#5b9bd5]/20 cursor-crosshair transition-colors duration-1000 p-4 md:p-8`}
    >
      {/* Immersive Architectural Background */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000`}>
        {/* Film Grain Texture Overlay */}
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${themes[theme].grain}`} />

        {/* Dynamic Spatial Grid */}
        <div className={`absolute inset-0 ${themes[theme].grid}`} 
             style={{ backgroundImage: `linear-gradient(${theme === 'studio' ? '#000' : themes[theme].accent} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'studio' ? '#000' : themes[theme].accent} 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
        <div className={`absolute inset-0 opacity-[0.02]`} 
             style={{ backgroundImage: `linear-gradient(${theme === 'studio' ? '#000' : themes[theme].accent} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'studio' ? '#000' : themes[theme].accent} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
        
        {/* Viewport Crosshair Scanner */}
        <motion.div 
           className={`absolute left-0 w-full h-[1px] ${theme === 'studio' ? 'bg-black/[0.05]' : 'bg-white/[0.08]'}`}
           animate={{ top: mousePos.y }}
           transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 0.5 }}
        />
        <motion.div 
           className={`absolute top-0 h-full w-[1px] ${theme === 'studio' ? 'bg-black/[0.05]' : 'bg-white/[0.08]'}`}
           animate={{ left: mousePos.x }}
           transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 0.5 }}
        />
      </div>

      {/* Premium UI Navigation - Right Floating Rail */}
      <div className="absolute top-6 bottom-24 right-6 md:top-12 md:right-12 z-50 flex flex-col items-end gap-10 md:gap-16 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-end gap-8 md:gap-12">
          {/* Environment Toggle */}
          <div className="flex flex-col items-end gap-3">

            <div className={`flex gap-3 p-2 ${themes[theme].ui} rounded-full backdrop-blur-xl ring-1 ${themes[theme].border} shadow-xl`}>
              {(['studio', 'blueprint', 'darkroom', 'deadnote'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 transition-all duration-500 relative ${
                    theme === t 
                      ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                      : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                  style={{ 
                    backgroundColor: t === 'studio' ? '#fafafa' : t === 'blueprint' ? '#102a43' : t === 'deadnote' ? '#1a0a0a' : '#111'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">

            <nav className={`flex flex-col gap-1.5 p-1.5 ${themes[theme].ui} ring-1 ${themes[theme].border} shadow-2xl rounded-lg backdrop-blur-xl`}>
              {(['hover', 'cursor'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative w-36 md:w-40 py-2 md:py-2.5 px-4 text-[9px] uppercase tracking-[0.2em] transition-all duration-500 rounded-md overflow-hidden group ${
                    mode === m ? 'text-white' : (theme === 'studio' ? 'text-black/40 hover:text-black/70' : 'text-white/40 hover:text-white/70')
                  }`}
                >
                  <span className="relative z-10">{m === 'hover' ? 'Hover' : 'Cursor'}</span>
                  {mode === m && (
                    <motion.div 
                      layoutId="nav-bg"
                      className={`absolute inset-0 ${m === 'hover' ? (theme === 'studio' ? 'bg-black' : 'bg-blue-600') : 'bg-[#5b9bd5]'}`}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    />
                  )}
                </button>
              ))}
              
              {/* Auto Pilot Feature toggle */}
              <button
                onClick={() => setIsAutoPilot(!isAutoPilot)}
                className={`relative w-36 md:w-40 py-2 md:py-2.5 px-4 text-[9px] uppercase tracking-[0.2em] transition-all duration-500 rounded-md overflow-hidden group flex items-center justify-between ${
                  isAutoPilot ? 'text-white' : (theme === 'studio' ? 'text-black/40 hover:text-black/70' : 'text-white/40 hover:text-white/70')
                }`}
              >
                <span className="relative z-10">Auto-Pilot</span>
                {isAutoPilot && (
                   <motion.div 
                     layoutId="nav-bg-2"
                     className="absolute inset-0 bg-emerald-600"
                     transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                   />
                )}
                <div className={`relative z-10 w-1.5 h-1.5 rounded-full ${isAutoPilot ? 'bg-white animate-pulse' : 'bg-current opacity-30'}`} />
              </button>
            </nav>
          </div>


          <div className="hidden sm:flex flex-col items-end gap-10 w-44">
            {/* Motion Inertia Control */}
            <div className="flex flex-col items-end gap-4 w-full px-2">
              <div className={`flex justify-between w-full items-end pb-1 border-b ${theme === 'studio' ? 'border-black/[0.03]' : 'border-white/[0.03]'}`}>

                <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{speed}%</span>
              </div>
              <div className="relative w-full py-4 group">
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current hover:bg-current/20 transition-all focus:outline-none`}
                />
                <div className="absolute top-1/2 left-0 w-full flex justify-between pointer-events-none px-0.5">
                   {Array.from({length: 11}).map((_, i) => (
                     <div key={i} className={`w-[1px] h-1 ${theme === 'studio' ? 'bg-black/10' : 'bg-white/10'} ${i % 5 === 0 ? 'h-2 bg-current/20' : ''}`} />
                   ))}
                </div>
              </div>
            </div>

            {/* Sequential Depth Control */}
            <div className="flex flex-col items-end gap-4 w-full px-2">
              <div className={`flex justify-between w-full items-end pb-1 border-b ${theme === 'studio' ? 'border-black/[0.03]' : 'border-white/[0.03]'}`}>

                <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{stagger}%</span>
              </div>
              <div className="relative w-full py-4 group">
                <input 
                  type="range" 
                  min="10" 
                  max="95" 
                  value={stagger}
                  onChange={(e) => setStagger(parseInt(e.target.value))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-[#5b9bd5] transition-all focus:outline-none`}
                />
                <div className="absolute top-1/2 left-0 w-full flex justify-between pointer-events-none px-0.5">
                   {Array.from({length: 11}).map((_, i) => (
                     <div key={i} className={`w-[1px] h-1 ${theme === 'studio' ? 'bg-black/10' : 'bg-white/10'} ${i % 5 === 0 ? 'h-2 bg-current/20' : ''}`} />
                   ))}
                </div>
              </div>
            </div>

            {/* Viewport Spatial Controllers */}
            <div className="flex flex-col items-end gap-6 w-full px-2 pt-6 border-t border-current/5">
              <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex justify-between items-end pb-1 overflow-hidden">
                  <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Translate_X</span>
                  <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{viewport.x}</span>
                </div>
                <input 
                  type="range" min="-300" max="300" step="1" value={viewport.x}
                  onChange={(e) => setViewport(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current focus:outline-none`}
                />
              </div>

              <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex justify-between items-end pb-1 overflow-hidden">
                  <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Translate_Y</span>
                  <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{viewport.y}</span>
                </div>
                <input 
                  type="range" min="-300" max="300" step="1" value={viewport.y}
                  onChange={(e) => setViewport(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current focus:outline-none`}
                />
              </div>

              <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex justify-between items-end pb-1 overflow-hidden">
                  <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Depth_Z</span>
                  <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{viewport.z}</span>
                </div>
                <input 
                  type="range" min="-600" max="600" step="1" value={viewport.z}
                  onChange={(e) => setViewport(prev => ({ ...prev, z: parseInt(e.target.value) }))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current focus:outline-none`}
                />
              </div>

              <button 
                onClick={() => setViewport({ x: 0, y: 0, z: 0 })}
                className={`mt-2 text-[8px] font-mono uppercase tracking-[0.2em] border px-3 py-1.5 transition-all ${theme === 'studio' ? 'border-black/10 hover:bg-black/5 text-black/40' : 'border-white/10 hover:bg-white/5 text-white/40'} rounded-md`}
              >
                Reset_Viewport
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-auto px-2 transition-opacity duration-1000 ${theme === 'studio' ? 'opacity-30' : 'opacity-60'}`}>
          <div className={`w-16 h-[1px] ${theme === 'studio' ? 'bg-black/20' : 'bg-white/30'} self-end mt-4 ml-auto`} />
        </div>
      </div>

      {/* Main 3D Stage */}
      <section 
        className="relative z-10 perspective-3000"
        style={{ transform: `scale(${scale})` }}
      >
        <ThreeDBook mode={mode} speed={speed} stagger={stagger} theme={theme} isAutoPilot={isAutoPilot} viewport={viewport} />
      </section>


      {/* Status Bar - Technical Footer */}
      <footer className={`absolute bottom-0 left-0 w-full py-4 px-12 z-50 flex justify-center items-center transition-colors duration-1000 ${theme === 'studio' ? 'bg-[#fafafa]/80 border-black/5' : theme === 'blueprint' ? 'bg-[#0a192f]/80 border-blue-400/10' : 'bg-[#0a0a0a]/80 border-white/5'} backdrop-blur-sm border-t`}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className={`text-[10px] tracking-[0.5em] uppercase font-bold flex items-center gap-3 ${theme === 'studio' ? 'text-black' : 'text-white'}`}
        >
          <span className="text-[#5b9bd5]">FS FERDOWS</span>
        </motion.div>
      </footer>
    </main>
  );
}
