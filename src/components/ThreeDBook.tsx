import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue, animate, AnimatePresence } from 'motion/react';

interface ThreeDBookProps {
  mode: 'hover' | 'cursor';
  speed: number;
  stagger: number;
  theme: 'studio' | 'blueprint' | 'darkroom' | 'deadnote';
  isAutoPilot?: boolean;
  viewport?: { x: number; y: number; z: number };
}

const PAGE_COUNT = 25;
const WIDTH = 260;
const HEIGHT = 380;

export const ThreeDBook: React.FC<ThreeDBookProps> = ({ 
  mode, 
  speed, 
  stagger, 
  theme, 
  isAutoPilot = false,
  viewport = { x: 0, y: 0, z: 0 }
}) => {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic physics for a slow, premium weighted feel
  const springConfig = {
    type: "spring" as const,
    stiffness: 15 + (speed * 1.5), 
    damping: 25 + (speed * 0.4),  
    mass: 1.2 + (speed * 0.002),   
    restDelta: 0.0001
  };

  // Stagger Factor calculation: refine range for spatial follow feel
  const staggerFactor = (stagger / 100) * 0.8 + 0.1;

  // The primary motion driver
  const intensity = useMotionValue(0);

  // Container tilt for immersion - slightly more restrained for focus
  const tiltX = useSpring(15, { stiffness: 60, damping: 30 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 30 });

  // Auto Pilot Logic
  useEffect(() => {
    if (isAutoPilot) {
      const controls = animate(intensity, [0, 1.1, 0], {
        duration: 12,
        ease: "easeInOut",
        repeat: Infinity,
      });
      return () => controls.stop();
    }
  }, [isAutoPilot, intensity]);
  
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  }, []);

  useEffect(() => {
    if (isAutoPilot) return; // Auto-pilot has control

    if (mode === 'cursor') {
      const handleMove = (x: number, y: number) => {
        const xProgress = Math.min(1.02, Math.max(0, 1.05 - (x / window.innerWidth) * 1.1));
        animate(intensity, xProgress, springConfig);

        const rotateY = (x / window.innerWidth - 0.5) * 35;
        const rotateX = (y / window.innerHeight - 0.5) * -20 + 15;
        tiltY.set(rotateY);
        tiltX.set(rotateX);
      };

      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
      };
    } else {
      tiltX.set(15);
      tiltY.set(0);
      if (!isManualOpen) {
        animate(intensity, 0, springConfig);
      }
    }
  }, [mode, isManualOpen, tiltX, tiltY, intensity, speed, isAutoPilot]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        x: viewport.x,
        y: viewport.y,
        z: viewport.z,
        transformStyle: 'preserve-3d'
      }}
      className="relative w-[280px] h-[380px] preserve-3d cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        if (mode === 'hover' && !isManualOpen && !isAutoPilot) {
          animate(intensity, 1.1, springConfig);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (mode === 'hover' && !isManualOpen && !isAutoPilot) {
          animate(intensity, 0, springConfig);
        }
      }}
      onClick={() => {
        if (mode === 'hover' && !isAutoPilot) {
          const nextState = !isManualOpen;
          setIsManualOpen(nextState);
          animate(intensity, nextState ? 1.1 : 0, springConfig);
        }
      }}
    >
      {/* 3D Premium Nameplate - Top (Layered for Depth) */}
      <div 
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none preserve-3d"
      >
        <div className="relative w-full h-full preserve-3d">
          <span 
            className={`absolute inset-0 text-[12px] font-black tracking-[0.8em] uppercase transition-colors duration-1000 ${theme === 'studio' ? 'text-black/5' : 'text-white/10'}`}
            style={{ transform: 'translateZ(20px) translateY(0px)' }}
          >
            FS FERDOWS
          </span>
          <span 
            className={`absolute inset-0 text-[12px] font-black tracking-[0.8em] uppercase transition-colors duration-1000 ${theme === 'studio' ? 'text-black/10' : 'text-white/20'}`}
            style={{ transform: 'translateZ(40px) translateY(-1px)' }}
          >
            FS FERDOWS
          </span>
          <span 
            className={`relative text-[12px] font-black tracking-[0.8em] uppercase transition-colors duration-1000 ${theme === 'studio' ? 'text-black/60' : 'text-white/80'}`}
            style={{ transform: 'translateZ(70px) translateY(-2px)' }}
          >
            FS FERDOWS
          </span>
        </div>
      </div>

      {/* 3D Premium Nameplate - Bottom (Layered for Refinement) */}
      <div 
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none preserve-3d"
      >
        <div className="relative w-full h-full preserve-3d">
          <span 
            className={`absolute inset-0 text-[9px] font-mono tracking-[0.4em] uppercase transition-colors duration-1000 ${theme === 'studio' ? 'text-black/10' : 'text-white/20'}`}
            style={{ transform: 'translateZ(-10px)' }}
          >
            FS FERDOWS // SPATIAL_EXP
          </span>
          <span 
            className={`relative text-[9px] font-mono tracking-[0.4em] uppercase transition-colors duration-1000 ${theme === 'studio' ? 'text-black/30' : 'text-white/50'}`}
            style={{ transform: 'translateZ(30px)' }}
          >
            FS FERDOWS // SPATIAL_EXP
          </span>
        </div>
      </div>
      
      {/* Atmospheric Lens Flare */}
      <motion.div 
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
        style={{ 
          background: theme === 'blueprint' ? 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' : 'radial-gradient(circle, #5b9bd5 0%, transparent 70%)',
          opacity: useTransform(intensity, [0, 1], [0.1, 0.3])
        }}
      />

       {/* Technical Scanline Effect Overlay */}
       <motion.div 
        className={`absolute inset-0 z-[1000] pointer-events-none overflow-hidden rounded-md ${theme === 'studio' ? 'opacity-[0.03]' : 'opacity-[0.08]'}`}
        style={{ transform: 'translateZ(120px)' }}
      >
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={`absolute w-full h-[2px] ${theme === 'studio' ? 'bg-black' : 'bg-white shadow-[0_0_10px_white]'}`}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]" />
      </motion.div>

      {Array.from({ length: PAGE_COUNT }).map((_, i) => (
        <Page 
          key={i} 
          index={i} 
          count={PAGE_COUNT} 
          intensity={intensity} 
          staggerFactor={staggerFactor} 
          theme={theme}
        />
      ))}
    </motion.div>
  );
};

interface PageProps {
  index: number;
  count: number;
  intensity: any;
  staggerFactor: number;
  theme: 'studio' | 'blueprint' | 'darkroom';
}

const DOTS_PATH = Array.from({ length: 48 }).map((_, i) => 
  `M ${(i % 6) * 35 + 40} ${Math.floor(i / 6) * 35 + 60} h 0.1`
).join(' ');

const Page: React.FC<PageProps> = ({ index, count, intensity, staggerFactor, theme }) => {
  const isCover = index === count - 1;
  const ratio = index / count;
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCurrentActive, setIsCurrentActive] = useState(false);
  const pageFlipAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastFlipState = useRef<number>(0);

  // Performance Optimization: Calculate if page is active enough to render content
  useEffect(() => {
    const unsubscribe = intensity.on("change", (v: number) => {
      const pageIndex = 1 - ratio; 
      const startTrigger = pageIndex * (1 - staggerFactor);
      
      // If intensity is near the trigger point for this page, it's active
      const isActive = Math.abs(v - startTrigger) < 0.25 || v > startTrigger;
      setIsCurrentActive(isActive);
    });
    return () => unsubscribe();
  }, [intensity, ratio, staggerFactor]);
  
  // Staggered hydration for performance
  useEffect(() => {
    pageFlipAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50 + (index * 15)); 
    return () => clearTimeout(timer);
  }, [index]);

  // Spatial transforms - Ultra-sequential cascade for "one-by-one" feel
  const angle = useTransform(intensity, (v: number) => {
    // Reverse ratio so cover flips first (index count-1)
    const pageIndex = 1 - ratio; 
    const startTrigger = pageIndex * (1 - staggerFactor);
    const endTrigger = startTrigger + staggerFactor;
    
    // Linearized progress for direct control "up to that point"
    const p = Math.max(0, Math.min(1, (v - startTrigger) / (endTrigger - startTrigger)));
    
    // Smooth but direct easing
    const easedP = p * p * (3 - 2 * p);
    return easedP * -165; 
  });

  // Individual page flip sound trigger
  useEffect(() => {
    const unsubscribe = angle.on("change", (v) => {
      const currentAngle = Math.abs(v as number);
      // Trigger sound when passing the vertical midpoint (approx 82.5 deg)
      const newState = currentAngle > 82 ? 1 : (currentAngle < 10 ? 0 : -1);
      
      if (newState !== -1 && newState !== lastFlipState.current) {
        if (pageFlipAudioRef.current) {
          pageFlipAudioRef.current.currentTime = 0;
          pageFlipAudioRef.current.volume = 0.03; // Ultra subtle
          pageFlipAudioRef.current.playbackRate = 1.5 + (Math.random() * 0.5); // Fast, high-pitched "flicker"
          pageFlipAudioRef.current.play().catch(() => {});
        }
        lastFlipState.current = newState;
      }
    });
    return () => unsubscribe();
  }, [angle]);

  const zIndex = useTransform(angle, (a: number) => {
    // Correct depth sorting during bi-directional flip
    return ((a as number) < -88) ? (count - index) : (count + index);
  });

  const translateX = useTransform(angle, (a) => {
    const progress = Math.abs((a as number) / 165);
    return Math.sin(progress * Math.PI) * (index * 0.1);
  });

  const scale = useTransform(angle, (a: number) => {
    const progress = Math.abs((a as number) / 165);
    return 1 + (Math.sin(progress * Math.PI) * 0.03); // Slight bloom during flip
  });

  const rotateX = useTransform(angle, (a: number) => {
    const progress = Math.abs((a as number) / 165);
    const isEdgePage = index < 3 || index > (count - 4);
    const tilt = isEdgePage ? 10 : 4;
    return Math.sin(progress * Math.PI) * tilt; 
  });

  const rotateZ = useTransform(angle, (a: number) => {
    const progress = Math.abs((a as number) / 165);
    const isEdgePage = index < 3 || index > (count - 4);
    const curlIntensity = isEdgePage ? 12 : 5;
    return Math.sin(progress * Math.PI) * (1 + ratio * curlIntensity);
  });

  const skewY = useTransform(angle, (a: number) => {
    const progress = Math.abs((a as number) / 165);
    const isEdgePage = index < 3 || index > (count - 4);
    const skewFactor = isEdgePage ? -4 : -2;
    return Math.sin(progress * Math.PI) * (ratio * skewFactor);
  });

  const lift = useTransform(angle, (a: number) => {
    const progress = Math.abs((a as number) / 165);
    const isEdgePage = index < 3 || index > (count - 4);
    const liftHeight = isEdgePage ? 60 : 45;
    return Math.sin(progress * Math.PI) * liftHeight;
  });

  const brightness = useTransform(angle, (a: number) => {
    const cosAngle = Math.cos((a as number) * Math.PI / 180);
    const base = 0.9 + (Math.abs(cosAngle) * 0.1);
    // Add a "shimmer" effect when flipping past the light source
    const progress = Math.abs((a as number) / 165);
    const shimmer = Math.sin(progress * Math.PI) * 0.05;
    return base + shimmer;
  });

  const boxShadow = useTransform(angle, (a: number) => {
    const progress = Math.abs((a as number) / 165);
    const liftFactor = Math.sin(progress * Math.PI);
    const blur = 10 + (liftFactor * 40);
    const opacity = 0.05 + (liftFactor * 0.1);
    const xOffset = (a as number) > -90 ? liftFactor * 15 : liftFactor * -15;
    return `${xOffset}px ${liftFactor * 20}px ${blur}px rgba(0,0,0,${opacity})`;
  });

  // Derived motion values for style objects to keep hooks top-level
  const translateZ = useTransform(lift, (l) => (index * 0.6) + (l as number));
  const filterBrightness = useTransform(brightness, (b) => `brightness(${b})`);
  const paperEdgeOpacity = useTransform(angle, (a) => {
      const progress = Math.abs((a as number) / 165);
      return Math.sin(progress * Math.PI) * 0.3;
  });
  const spineOpacity = useTransform(intensity, [0, 1], [0.1, 0.4]);
  const architecturalGridOpacity = useTransform(intensity, [0, 1], [0.1, 0.6]);

  // Perspective warp for content
  const contentSkewX = useTransform(angle, (a) => {
    const progress = Math.abs((a as number) / 165);
    return Math.sin(progress * Math.PI) * (a > -90 ? -3 : 3);
  });

  // Dynamic Page Visuals based on theme
  const pageColors = {
    studio: { bg: '#ffffff', text: '#111111', accent: '#5b9bd5', line: '#000000' },
    blueprint: { bg: '#0f172a', text: '#d1d5db', accent: '#38bdf8', line: '#ffffff' },
    darkroom: { bg: '#0f0f0f', text: '#f5f5f5', accent: '#5b9bd5', line: '#ffffff' },
    deadnote: { bg: '#0a0a0a', text: '#d4d4d4', accent: '#991b1b', line: '#450a0a' }
  };

  // Pages remain white for a physical/premium feel, but technical accents follow the theme
  const colors = {
    bg: '#ffffff',
    text: '#111111',
    accent: pageColors[theme].accent,
    line: '#000000'
  };

  return (
    <motion.div
      style={{
        zIndex,
        rotateY: angle,
        rotateX,
        rotateZ,
        skewY,
        translateX,
        translateZ,
        scale,
        filter: filterBrightness,
        boxShadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        setIsContentVisible(!isContentVisible);
        e.stopPropagation();
      }}
      className="absolute inset-0 origin-left preserve-3d will-change-transform pointer-events-auto"
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`page-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <motion.stop offset="0%" stopColor={colors.bg} />
            <motion.stop 
               offset={useTransform(angle, [-165, -82, 0], ["0%", "50%", "100%"])} 
               stopColor="#f9f9f9" 
               stopOpacity="0.8"
            />
            <motion.stop offset="100%" stopColor={colors.bg} />
          </linearGradient>
          {/* Subtle Crease Shadow */}
          <linearGradient id={`crease-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
            <stop offset="4%" stopColor="rgba(0,0,0,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id={`ao-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="15%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <radialGradient id="gloss-grad" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cover-overlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
          </linearGradient>
          <clipPath id="page-clip">
            <rect width={WIDTH} height={HEIGHT} rx="6" />
          </clipPath>
          <radialGradient id="hero-light-glow" cx="100%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hell-glow" cx="100%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#991b1b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
          </radialGradient>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <pattern id="cover-texture" width="100" height="100" patternUnits="userSpaceOnUse">
             <rect width="100" height="100" filter="url(#noiseFilter)" opacity="0.2" />
          </pattern>
          <pattern id={`grid-pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={theme === 'studio' ? '#000' : '#5b9bd5'} strokeWidth="0.2" opacity="0.05" />
          </pattern>
        </defs>
        <rect
          className={isCover ? "stroke-[#5b9bd5] stroke-[2px]" : "stroke-black/5 stroke-[1px]"}
          fill={`url(#page-grad-${index})`}
          x="0" y="0" width={WIDTH} height={HEIGHT} rx="6"
        />
        
        {/* Subtle grid pattern even on white pages for technical feel */}
        <rect width={WIDTH} height={HEIGHT} fill={`url(#grid-pattern-${index})`} rx="6" />

        {/* Ambient Occlusion Crease Shadow */}
        <rect x="0" y="0" width="40" height={HEIGHT} fill={`url(#ao-grad-${index})`} rx="2" />

        {/* Spine Crease Shadow */}
        <rect x="0" y="0" width="20" height={HEIGHT} fill={`url(#crease-grad-${index})`} rx="2" />

        {/* Edge Highlight for Paper Thinness */}
        <motion.rect
          x={WIDTH - 2} y="0" width="2" height={HEIGHT} rx="1"
          style={{
            fill: theme === 'studio' ? "#fff" : colors.accent,
            opacity: paperEdgeOpacity
          }}
        />
        <motion.line 
          x1="0" y1="5" x2="0" y2={HEIGHT - 5} 
          style={{ 
            opacity: spineOpacity,
          }}
          stroke={colors.accent}
          strokeWidth="3"
        />

        {/* Technical Wireframe Marks */}
        {isHydrated && isCurrentActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: (isHovered || !isContentVisible) ? 0.4 : 0.05 }}
            transition={{ duration: 0.4 }}
            className="stroke-[0.5px] fill-none"
            style={{ skewX: contentSkewX, stroke: colors.accent }}
          >
            {/* Corner Brackets */}
            <path d="M 15 30 L 15 15 L 30 15" />
            <path d={`M ${WIDTH - 30} 15 L ${WIDTH - 15} 15 L ${WIDTH - 15} 30`} />
            <path d={`M 15 ${HEIGHT - 30} L 15 ${HEIGHT - 15} L 30 ${HEIGHT - 15}`} />
            <path d={`M ${WIDTH - 30} ${HEIGHT - 15} L ${WIDTH - 15} ${HEIGHT - 15} L ${WIDTH - 15} ${HEIGHT - 30}`} />

            {/* Focal Crosshair (Staggered per page) */}
            <g transform={`translate(${index % 3 * 20 - 20}, ${index % 4 * 10 - 20})`}>
              <line x1={WIDTH/2 - 10} y1={HEIGHT/2} x2={WIDTH/2 + 10} y2={HEIGHT/2} />
              <line x1={WIDTH/2} y1={HEIGHT/2 - 10} x2={WIDTH/2} y2={HEIGHT/2 + 10} />
              <circle cx={WIDTH/2} cy={HEIGHT/2} r="15" strokeDasharray="2 2" />
            </g>
          </motion.g>
        )}
        
        {/* Toggleable Content Group */}
        {isHydrated && isCurrentActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: isContentVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ skewX: contentSkewX }}
          >
            {/* Architectural Marks - High performance path-based dots */}
            <motion.path 
              d={DOTS_PATH}
              stroke={colors.accent}
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ 
                opacity: architecturalGridOpacity 
              }}
            />

            {!isCover && index !== count - 3 && (
              <g transform="translate(40, 60)" className="opacity-80">
                 <text x="0" y="22" fill={colors.text} fontSize="14" fontWeight="600" className="font-sans tracking-tight leading-none uppercase">{index === 0 ? 'Introduction' : `Concept Architecture // ${index}`}</text>
                 <rect x="0" y="32" width="40" height="1" fill={colors.accent} opacity="0.4" />
                 
                 {/* Visual Aesthetic - Architectural Sketch Component */}
                 <g transform="translate(0, 50)">
                    {index % 3 === 0 ? (
                      <g className="opacity-20 stroke-[0.5px] fill-none" style={{ stroke: colors.text }}>
                        <rect x="0" y="0" width="180" height="120" />
                        <path d="M 0 60 L 180 60 M 90 0 L 90 120" strokeDasharray="2 2" />
                        <rect x="40" y="30" width="100" height="60" className="stroke-[1px]" style={{ stroke: colors.accent }} />
                        <circle cx="90" cy="60" r="40" />
                        <text x="5" y="10" fill={colors.text} fontSize="5" className="font-mono italic">ORTHO_TOP_VIEW</text>
                      </g>
                    ) : index % 3 === 1 ? (
                      <g className="opacity-20 stroke-[0.5px] fill-none" style={{ stroke: colors.text }}>
                         <path d="M 20 100 L 90 20 L 160 100 Z" className="stroke-[1px]" style={{ stroke: colors.accent }} />
                         <line x1="90" y1="20" x2="90" y2="100" />
                         <circle cx="90" cy="100" r="4" fill={colors.text} stroke="none" />
                         <text x="5" y="10" fill={colors.text} fontSize="5" className="font-mono italic">ELEVATION_V_02</text>
                      </g>
                    ) : (
                      <g className="opacity-20 stroke-[0.5px] fill-none" style={{ stroke: colors.text }}>
                         <rect x="10" y="20" width="160" height="80" rx="2" />
                         {Array.from({length: 6}).map((_, i) => (
                           <line key={i} x1={20 + i*28} y1="20" x2={20 + i*28} y2="100" strokeDasharray="1 3" />
                         ))}
                         <text x="5" y="10" fill={colors.text} fontSize="5" className="font-mono italic">STRUCT_GRID_LYT</text>
                      </g>
                    )}
                 </g>

                 <text x="180" y="290" fill={colors.text} opacity="0.1" fontSize="10" fontWeight="700" textAnchor="end" className="font-mono tabular-nums tracking-widest">{(index + 1).toString().padStart(3, '0')}</text>
              </g>
            )}

            {index === count - 3 && (
              <>
                <image 
                  href="https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=1000&auto=format&fit=crop"
                  width={WIDTH} 
                  height={HEIGHT} 
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#page-clip)"
                />
                <rect width={WIDTH} height={HEIGHT} rx="6" fill="url(#cover-overlay)" opacity="0.4" />
                <g transform={`translate(${WIDTH/2}, ${HEIGHT - 40})`} textAnchor="middle">
                  <text 
                    fill="#fff" 
                    fontSize="10" 
                    fontWeight="300" 
                    className="font-sans tracking-[0.8em] uppercase opacity-60"
                  >
                    FS FERDOWS
                  </text>
                </g>
              </>
            )}
            
            {isCover && (
              <>
                {/* Tech Background - Deep gradient and noise mask */}
                <image 
                  href="https://images.unsplash.com/photo-1707343843598-39755549ac9a?q=80&w=1000&auto=format&fit=crop"
                  width={WIDTH} 
                  height={HEIGHT} 
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#page-clip)"
                  className="rounded-md"
                />
                <rect width={WIDTH} height={HEIGHT} rx="6" fill="url(#cover-overlay)" className="pointer-events-none" />
                
                <g transform={`translate(${WIDTH/2}, ${HEIGHT/2})`} textAnchor="middle">
                  <text 
                    y="0" 
                    fill="#fff" 
                    fontSize="18" 
                    fontWeight="300" 
                    className="font-sans tracking-[0.8em] uppercase opacity-95"
                    style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }}
                  >
                    FS FERDOWS
                  </text>
                  <rect x="-15" y="16" width="30" height="0.5" fill="#fff" opacity="0.3" />
                </g>

                {/* Glossy Reflective Highlight */}
                <rect 
                  width={WIDTH} height={HEIGHT} rx="6" 
                  fill="url(#gloss-grad)" 
                  className="pointer-events-none mix-blend-overlay opacity-60" 
                />
              </>
            )}
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};
