import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ThreeDBook } from './components/ThreeDBook';

export default function App() {
  const [mode, setMode] = useState<'hover' | 'cursor'>('hover');
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(45); // Motion response
  const [stagger, setStagger] = useState(70); // Default to more atmospheric/unified opening
  const [theme, setTheme] = useState<'studio' | 'blueprint' | 'darkroom'>('studio');
  
  // Use MotionValues for high-frequency updates to avoid full-component re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smoothed versions for the visual scanner
  const smoothMouseX = useSpring(mouseX, { stiffness: 200, damping: 30, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 200, damping: 30, mass: 0.5 });

  const [viewport, setViewport] = useState({ x: 0, y: 0, z: 0 });

  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Fluid scaling logic for mobile/tablet/desktop
      if (width < 640) {
        setScale(Math.min(width / 420, 0.75));
      } else if (width < 1024) {
        setScale(Math.min(width / 768, 0.9));
      } else {
        const verticalScale = Math.min(height / 800, 1);
        setScale(Math.min(1, verticalScale));
      }

      if (width <= 768) {
        // Default to closed on mobile, but keep state if user toggled
      } else {
        setIsControlsOpen(true);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
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
           style={{ top: smoothMouseY }}
        />
        <motion.div 
           className={`absolute top-0 h-full w-[1px] ${theme === 'studio' ? 'bg-black/[0.05]' : 'bg-white/[0.08]'}`}
           style={{ left: smoothMouseX }}
        />
      </div>

      {/* Premium UI Navigation - Right Floating Rail */}
      <div className={`absolute top-4 bottom-20 right-4 md:top-12 md:right-12 z-50 flex flex-col items-end gap-4 md:gap-16 pointer-events-none ${isControlsOpen ? 'max-h-[85vh]' : 'max-h-12'} transition-all duration-700 overflow-y-auto no-scrollbar pb-10`}>
        
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsControlsOpen(!isControlsOpen)}
          className={`md:hidden pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-2xl ring-1 shadow-2xl transition-all duration-500 ${
            theme === 'studio' ? 'bg-white/80 ring-black/5 text-black' : 'bg-black/80 ring-white/10 text-white'
          } ${isControlsOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          <div className="w-4 h-[1px] bg-current relative">
            <div className={`absolute top-[-4px] left-0 w-full h-full bg-current transition-transform duration-500 ${isControlsOpen ? 'translate-y-[4px] rotate-45' : ''}`} />
            <div className={`absolute bottom-[-4px] left-0 w-full h-full bg-current transition-transform duration-500 ${isControlsOpen ? 'translate-y-[-4px] -rotate-45' : ''}`} />
          </div>
        </button>

        <motion.div 
          animate={{ opacity: isControlsOpen ? 1 : 0, scale: isControlsOpen ? 1 : 0.95, y: isControlsOpen ? 0 : 20 }}
          initial={false}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className={`pointer-events-auto flex flex-col items-end gap-6 md:gap-12 w-full ${!isControlsOpen ? 'pointer-events-none invisible md:visible md:pointer-events-auto opacity-0 md:opacity-100' : ''}`}
        >
          {/* Environment Toggle */}
          <div className="flex flex-col items-end gap-3">
            <div className={`flex gap-3 p-1.5 md:p-2 ${themes[theme].ui} rounded-full backdrop-blur-xl ring-1 ${themes[theme].border} shadow-xl`}>
              {(['studio', 'blueprint', 'darkroom', 'deadnote'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-8 h-8 md:w-8 md:h-8 rounded-full border-2 transition-all duration-500 relative flex-shrink-0 ${
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
                  className={`relative w-32 md:w-40 py-2.5 md:py-3 px-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 rounded-md overflow-hidden group min-h-[44px] flex items-center justify-center ${
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
                className={`relative w-32 md:w-40 py-2.5 md:py-3 px-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 rounded-md overflow-hidden group flex items-center justify-between min-h-[44px] ${
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

          {/* Advanced Controls - Toggleable on mobile/small tablets for space */}
          <div className="flex flex-col items-end gap-1 md:gap-4 w-32 md:w-44">
            {/* Motion Inertia Control */}
            <div className="flex flex-col items-end gap-1 w-full px-2">
              <div className={`flex justify-between w-full items-end pb-1 border-b ${theme === 'studio' ? 'border-black/[0.03]' : 'border-white/[0.03]'}`}>
                <span className={`text-[8px] font-mono opacity-40 uppercase ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Speed</span>
                <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{speed}%</span>
              </div>
              <div className="relative w-full py-5 md:py-4 group">
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current hover:bg-current/20 transition-all focus:outline-none`}
                />
              </div>
            </div>

            {/* Sequential Depth Control */}
            <div className="flex flex-col items-end gap-1 w-full px-2">
              <div className={`flex justify-between w-full items-end pb-1 border-b ${theme === 'studio' ? 'border-black/[0.03]' : 'border-white/[0.03]'}`}>
                <span className={`text-[8px] font-mono opacity-40 uppercase ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Stagger</span>
                <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{stagger}%</span>
              </div>
              <div className="relative w-full py-5 md:py-4 group">
                <input 
                  type="range" 
                  min="10" 
                  max="95" 
                  value={stagger}
                  onChange={(e) => setStagger(parseInt(e.target.value))}
                  className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-[#5b9bd5] transition-all focus:outline-none`}
                />
              </div>
            </div>

            {/* Viewport Spatial Controllers */}
            <div className="flex flex-col items-end gap-1 md:gap-2 w-full px-2 pt-6 border-t border-current/5">
              <div className="flex flex-col items-end gap-0 w-full">
                <div className="flex justify-between items-end pb-1 overflow-hidden w-full">
                  <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${theme === 'studio' ? 'text-black' : 'text-white'}`}>X</span>
                  <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{viewport.x}</span>
                </div>
                <div className="relative w-full py-5 md:py-4">
                  <input 
                    type="range" min="-300" max="300" step="1" value={viewport.x}
                    onChange={(e) => setViewport(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current focus:outline-none`}
                  />
                </div>
              </div>

              <div className="flex flex-col items-end gap-0 w-full">
                <div className="flex justify-between items-end pb-1 overflow-hidden w-full">
                  <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Y</span>
                  <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{viewport.y}</span>
                </div>
                <div className="relative w-full py-5 md:py-4">
                  <input 
                    type="range" min="-300" max="300" step="1" value={viewport.y}
                    onChange={(e) => setViewport(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current focus:outline-none`}
                  />
                </div>
              </div>

              <div className="flex flex-col items-end gap-0 w-full">
                <div className="flex justify-between items-end pb-1 overflow-hidden w-full">
                  <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${theme === 'studio' ? 'text-black' : 'text-white'}`}>Z</span>
                  <span className={`text-[9px] font-mono font-medium ${theme === 'studio' ? 'text-black/60' : 'text-white/60'}`}>{viewport.z}</span>
                </div>
                <div className="relative w-full py-5 md:py-4">
                  <input 
                    type="range" min="-600" max="600" step="1" value={viewport.z}
                    onChange={(e) => setViewport(prev => ({ ...prev, z: parseInt(e.target.value) }))}
                    className={`w-full h-[1px] ${theme === 'studio' ? 'bg-black/10' : 'bg-white/20'} appearance-none cursor-pointer accent-current focus:outline-none`}
                  />
                </div>
              </div>

              <button 
                onClick={() => setViewport({ x: 0, y: 0, z: 0 })}
                className={`mt-2 text-[8px] font-mono uppercase tracking-[0.2em] border px-3 py-2 transition-all min-h-[44px] flex items-center justify-center ${theme === 'studio' ? 'border-black/10 hover:bg-black/5 text-black/40' : 'border-white/10 hover:bg-white/5 text-white/40'} rounded-md pointer-events-auto w-full`}
              >
                Reset
              </button>
            </div>
          </div>
        </motion.div>

        <div className={`mt-auto px-2 transition-opacity duration-1000 ${theme === 'studio' ? 'opacity-30' : 'opacity-60'} hidden md:block`}>
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
