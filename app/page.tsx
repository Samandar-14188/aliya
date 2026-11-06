"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ─── Screen type ──────────────────────────────────────────────────────────────
type Screen = "seal" | "loading" | "party" | "cake" | "prize" | "gallery" | "letter" | "message";

// ─── Particle config (fixed — no Math.random at module level) ─────────────────
const PARTICLES = [
  { emoji: "✨", x: 5,  size: 14, duration: 12, delay: 0 },
  { emoji: "💖", x: 12, size: 12, duration: 15, delay: 2 },
  { emoji: "🌸", x: 20, size: 16, duration: 11, delay: 4 },
  { emoji: "⭐", x: 28, size: 11, duration: 14, delay: 1 },
  { emoji: "💫", x: 36, size: 13, duration: 13, delay: 5 },
  { emoji: "🌷", x: 45, size: 15, duration: 10, delay: 3 },
  { emoji: "✨", x: 53, size: 12, duration: 16, delay: 6 },
  { emoji: "💕", x: 62, size: 14, duration: 12, delay: 2 },
  { emoji: "🦋", x: 70, size: 16, duration: 11, delay: 7 },
  { emoji: "⭐", x: 78, size: 11, duration: 15, delay: 1 },
  { emoji: "🌸", x: 86, size: 13, duration: 13, delay: 4 },
  { emoji: "💖", x: 93, size: 12, duration: 14, delay: 0 },
];

function ParticleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle select-none"
          style={{
            left: `${p.x}%`,
            bottom: "-10%",
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

// ─── Glass Window Wrapper (Standardized Mobile & Desktop Modal) ───────────────
function GlassWindow({
  title,
  badge,
  children,
  className = "",
  bodyClass = "",
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <div
      className={`glass-window max-w-[420px] w-[95%] max-h-[88vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden mx-auto ${className}`}
    >
      {/* Title bar with proper flex spacing to prevent overlap */}
      <div className="window-bar flex-shrink-0 flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {badge && <span className="retro-badge flex-shrink-0">{badge}</span>}
          <span
            className="text-white font-bold truncate text-[8px] sm:text-[9px]"
            style={{ fontFamily: "'Press Start 2P', monospace", letterSpacing: "0.06em" }}
          >
            {title}
          </span>
        </div>
        <div className="flex gap-1.5 flex-shrink-0 items-center">
          <span className="win-dot bg-yellow-300 text-yellow-800">─</span>
          <span className="win-dot bg-green-400 text-green-900">□</span>
          <span className="win-dot bg-red-400 text-red-900">✕</span>
        </div>
      </div>
      {/* Scrollable body with comfortable padding & spacing */}
      <div className={`p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain flex flex-col ${bodyClass}`}>
        {children}
      </div>
    </div>
  );
}

// ─── Sound Toggle Button ───────────────────────────────────────────────────────
function SoundButton({ playing, muted, onToggle }: { playing: boolean; muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full
        bg-white/80 backdrop-blur-md border border-white/90
        shadow-[0_4px_16px_rgba(255,107,157,0.25)]
        hover:scale-105 active:scale-95 transition-all cursor-pointer"
    >
      {muted ? (
        <span className="text-sm sm:text-base">🔇</span>
      ) : playing ? (
        <span className="flex items-end gap-0.5 h-3.5 sm:h-4">
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
        </span>
      ) : (
        <span className="text-sm sm:text-base">🔈</span>
      )}
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px" }} className="text-rose-500">
        {muted ? "MUTE" : "SND"}
      </span>
    </button>
  );
}

// ─── Cat & cake SVG for PARTY.EXE ─────────────────────────────────────────────
function BirthdayCatSVG() {
  const candleColors = ["#FF6B9D","#C9B8FF","#F7C948","#7ECCCA","#FFB347","#FF8DC7","#A8E6CF","#FFD700","#B5DEFF"];
  return (
    <svg viewBox="0 0 120 140" className="w-36 h-44 sm:w-44 sm:h-52 mx-auto drop-shadow-md" style={{ imageRendering: "auto" }}>
      <ellipse cx="60" cy="122" rx="38" ry="6" fill="#F5E6D0" />
      <rect x="28" y="82" width="64" height="40" rx="4" fill="#FFD6E8" />
      <rect x="28" y="82" width="64" height="14" rx="2" fill="#FF9FC5" />
      <path d="M28 82 Q35 72 42 82 Q49 72 56 82 Q63 72 70 82 Q77 72 84 82 Q91 72 92 82 Z" fill="white" />
      <text x="60" y="110" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FF6B9D" fontFamily="Plus Jakarta Sans, sans-serif">18</text>
      {[[38,96,"#C9B8FF"],[52,100,"#F7C948"],[70,98,"#7ECCCA"],[80,103,"#FF6B9D"],[44,108,"#F7C948"],[75,106,"#C9B8FF"]].map(([cx,cy,fill],i) => (
        <rect key={i} x={+cx-3} y={+cy-1} width="6" height="2" rx="1" fill={fill as string} transform={`rotate(${i*35} ${cx} ${cy})`} />
      ))}
      {candleColors.map((c, i) => {
        const cx = 33 + i * 7;
        return <rect key={i} x={cx - 2} y={62} width={4} height={22} rx="2" fill={c} />;
      })}
      {candleColors.map((_, i) => {
        const cx = 33 + i * 7;
        return (
          <g key={i} className="flame" style={{ animationDelay: `${i * 0.07}s` }}>
            <ellipse cx={cx} cy={58} rx={3.5} ry={5} fill="#FFF176" />
            <ellipse cx={cx} cy={59} rx={2} ry={3} fill="#FFB300" />
            <ellipse cx={cx} cy={60} rx={1} ry={1.5} fill="#FF6B00" />
          </g>
        );
      })}
      <rect x="34" y="40" width="52" height="38" rx="12" fill="#FFB6C1" />
      <polygon points="38,42 30,22 50,36" fill="#FFB6C1" />
      <polygon points="82,42 90,22 70,36" fill="#FFB6C1" />
      <polygon points="39,41 33,26 48,37" fill="#FF8DC7" />
      <polygon points="81,41 87,26 72,37" fill="#FF8DC7" />
      <ellipse cx="50" cy="52" rx="6" ry="6.5" fill="#2D1B69" />
      <ellipse cx="70" cy="52" rx="6" ry="6.5" fill="#2D1B69" />
      <ellipse cx="51.5" cy="50" rx="2" ry="2.5" fill="white" />
      <ellipse cx="71.5" cy="50" rx="2" ry="2.5" fill="white" />
      <circle cx="52.5" cy="50.5" r="1" fill="white" opacity="0.8" />
      <circle cx="72.5" cy="50.5" r="1" fill="white" opacity="0.8" />
      <ellipse cx="44" cy="60" rx="5" ry="3" fill="#FF9FC5" opacity="0.6" />
      <ellipse cx="76" cy="60" rx="5" ry="3" fill="#FF9FC5" opacity="0.6" />
      <polygon points="60,58 57,62 63,62" fill="#FF6B9D" />
      <path d="M57 63 Q60 67 63 63" stroke="#FF6B9D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <line x1="35" y1="59" x2="52" y2="61" stroke="#C9A0A0" strokeWidth="1" opacity="0.7" />
      <line x1="35" y1="63" x2="52" y2="63" stroke="#C9A0A0" strokeWidth="1" opacity="0.7" />
      <line x1="85" y1="59" x2="68" y2="61" stroke="#C9A0A0" strokeWidth="1" opacity="0.7" />
      <line x1="85" y1="63" x2="68" y2="63" stroke="#C9A0A0" strokeWidth="1" opacity="0.7" />
      <path d="M82 72 Q100 68 102 80 Q104 92 90 88" stroke="#FFB6C1" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — SEAL.EXE
// ═══════════════════════════════════════════════════════════════════════════════
function SealScreen({ onComplete, audioRef }: { onComplete: () => void; audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [holding, setHolding] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const holdTimer        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef     = useRef<number | null>(null);

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    }
  }, [audioRef]);

  const startHold = useCallback(() => {
    if (countdownRef.current !== null) return;
    setHolding(true);
    setProgress(0);
    tryPlay();

    let p = 0;
    progressInterval.current = setInterval(() => {
      p = Math.min(p + 2, 100);
      setProgress(p);
    }, 40);

    holdTimer.current = setTimeout(() => {
      clearInterval(progressInterval.current!);
      setProgress(100);
      setCountdown(3);
      countdownRef.current = 3;
      let c = 3;
      countdownTimer.current = setInterval(() => {
        c--;
        if (c <= 0) {
          clearInterval(countdownTimer.current!);
          onComplete();
        } else {
          setCountdown(c);
          countdownRef.current = c;
        }
      }, 700);
    }, 2000);
  }, [tryPlay, onComplete]);

  const cancelHold = useCallback(() => {
    if (countdownRef.current !== null) return;
    setHolding(false);
    setProgress(0);
    clearTimeout(holdTimer.current!);
    clearInterval(progressInterval.current!);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />
      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="SEAL.EXE" badge="🔒 APP">
          <div className="flex flex-col items-center gap-3 sm:gap-4 text-center my-auto">
            <div>
              <p className="text-[11px] font-semibold text-rose-400 tracking-widest uppercase mb-0.5">
                Maxsus Syurpriz
              </p>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-800">
                Aliyaga 🌸
              </h2>
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed px-2">
              OCHILMAGUNCHA TUGMANI QO'YIB YUBORMA!
            </p>

            {/* Hold button */}
            <div className="relative my-1">
              <motion.button
                className="relative w-28 h-28 sm:w-34 sm:h-34 rounded-full overflow-hidden
                  flex items-center justify-center select-none
                  bg-gradient-to-br from-pink-300 via-rose-400 to-purple-400
                  shadow-[0_8px_32px_rgba(255,107,157,0.5)]
                  border-4 border-white/70 glow-pulse"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={(e) => { e.preventDefault(); startHold(); }}
                onTouchEnd={cancelHold}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ cursor: "pointer" }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 w-full bg-white/35"
                  style={{ height: `${progress}%` }}
                />
                <AnimatePresence mode="wait">
                  {countdown !== null ? (
                    <motion.span
                      key={countdown}
                      initial={{ scale: 2.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg z-10 relative"
                    >
                      {countdown}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="heart"
                      className={`text-4xl sm:text-5xl z-10 relative ${holding ? "" : "heartbeat"}`}
                    >
                      💖
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {!holding && (
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-300/60 animate-spin" style={{ animationDuration: "8s" }} />
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-pink-100 overflow-hidden border border-pink-200">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #FF6B9D, #C9B8FF, #F7C948)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["0% center", "100% center"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div>
              <p className="font-bold text-gray-700 text-xs sm:text-sm tracking-wide">BOSIB TUR</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {holding
                  ? countdown !== null ? "✨ Yuklanmoqda..." : "Yaxshi, qo'yib yuborma!"
                  : "Tugmani bosib turing..."}
              </p>
            </div>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — LOADING
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />
      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="YUKLANMOQDA..." badge="⏳">
          <div className="flex flex-col items-center gap-4 py-6 text-center my-auto">
            <motion.div
              className="text-5xl sm:text-6xl"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              🎁
            </motion.div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-2.5">Syurpriz yuklanmoqda</p>
              <div className="flex gap-2 justify-center">
                {["dot-1","dot-2","dot-3"].map(cls => (
                  <div key={cls} className={`w-2.5 h-2.5 rounded-full bg-pink-400 ${cls}`} />
                ))}
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <p className="text-xs text-gray-400">Aliyaning eng yaxshi kuni tayyorlanmoqda... ✨</p>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — PARTY.EXE
// ═══════════════════════════════════════════════════════════════════════════════
function PartyScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />
      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="PARTY.EXE" badge="🎉 18">
          <div className="flex flex-col items-center gap-3.5 text-center my-auto">
            {/* Header */}
            <motion.div initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              <span className="inline-block text-[11px] font-semibold tracking-widest text-rose-400 uppercase mb-1">
                🌸 Tabriklaymiz
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-gray-800 leading-snug">
                Qadrdon do'stim <span className="rainbow inline-block">Aliya</span> bugun{" "}
                <span className="text-rose-500">18 yoshga</span> to'ldi! 🎉
              </h1>
            </motion.div>

            {/* Cat */}
            <motion.div
              className="float-bob"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
            >
              <BirthdayCatSVG />
            </motion.div>

            {/* Subtext card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/60 p-3"
            >
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Eng zo'r do'stimiz uchun kichik bayramona syurpriz tayyorladik... ✨
              </p>
            </motion.div>

            {/* CTA */}
            <motion.button
              onClick={onNext}
              className="btn-primary w-full py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              SYURPRIZNI BOSHLASH ✨
            </motion.button>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — CAKE.EXE (18 Candles, 2-Tier Pastel Cake, Interactive Slice)
// ═══════════════════════════════════════════════════════════════════════════════

// 18 Candles coordinates: 10 on top tier + 4 on left shoulder + 4 on right shoulder
const CANDLES_18 = [
  // Top tier (10 candles)
  { id: 1,  x: 108, y: 108, h: 22, color: "#FF6B9D" },
  { id: 2,  x: 120, y: 106, h: 24, color: "#C9B8FF" },
  { id: 3,  x: 132, y: 104, h: 26, color: "#F7C948" },
  { id: 4,  x: 144, y: 103, h: 27, color: "#7ECCCA" },
  { id: 5,  x: 156, y: 102, h: 28, color: "#FFB347" },
  { id: 6,  x: 168, y: 102, h: 28, color: "#FF8DC7" },
  { id: 7,  x: 180, y: 103, h: 27, color: "#A8E6CF" },
  { id: 8,  x: 192, y: 104, h: 26, color: "#FFD700" },
  { id: 9,  x: 204, y: 106, h: 24, color: "#B5DEFF" },
  { id: 10, x: 216, y: 108, h: 22, color: "#FF6B9D" },
  // Bottom tier left shoulder (4 candles)
  { id: 11, x: 48,  y: 176, h: 22, color: "#F7C948" },
  { id: 12, x: 60,  y: 174, h: 24, color: "#C9B8FF" },
  { id: 13, x: 72,  y: 172, h: 26, color: "#FF8DC7" },
  { id: 14, x: 84,  y: 170, h: 28, color: "#7ECCCA" },
  // Bottom tier right shoulder (4 candles)
  { id: 15, x: 240, y: 170, h: 28, color: "#FFB347" },
  { id: 16, x: 252, y: 172, h: 26, color: "#B5DEFF" },
  { id: 17, x: 264, y: 174, h: 24, color: "#FF6B9D" },
  { id: 18, x: 276, y: 176, h: 22, color: "#A8E6CF" },
];

function CakeScreen({ onNext }: { onNext: () => void }) {
  const [cut, setCut] = useState(false);
  const [dragDist, setDragDist] = useState(0);
  const isDragging = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (cut) return;
    isDragging.current = true;
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || !startPos.current || cut) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    const dist = Math.hypot(dx, dy);
    setDragDist(dist);

    if (dist > 65) {
      isDragging.current = false;
      setCut(true);
      // Explosive confetti with stars and colorful particles
      confetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FF6B9D", "#C9B8FF", "#F7C948", "#FF1493", "#FFF5F7", "#6EE7B7", "#FFD700"],
        shapes: ["star", "circle"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0.1, y: 0.6 },
          colors: ["#FF6B9D", "#F7C948", "#C9B8FF"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#FF6B9D", "#F7C948", "#C9B8FF"],
        });
      }, 250);
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />
      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="CAKE.EXE" badge="🎂 18">
          <div className="flex flex-col items-center gap-3 text-center my-auto">
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-rose-400 uppercase mb-0.5">
                Tortni Kesish
              </p>
              <p className="text-xs text-gray-600">
                Tortni kesish uchun barmog'ingizni yoki sichqonchani suring! 🎂
              </p>
            </div>

            {/* Interactive 2-Tier Cake with 18 Candles */}
            <div
              className="relative w-full max-w-[310px] rounded-2xl p-2 bg-gradient-to-b from-rose-50/70 via-pink-50/50 to-purple-50/70 border border-pink-200/80 shadow-inner select-none cursor-crosshair touch-none"
              onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => {
                const t = e.touches[0];
                handleStart(t.clientX, t.clientY);
              }}
              onTouchMove={(e) => {
                const t = e.touches[0];
                handleMove(t.clientX, t.clientY);
              }}
              onTouchEnd={handleEnd}
            >
              <svg viewBox="0 0 320 280" className="w-full h-auto drop-shadow-md">
                {/* Cake Stand / Plate */}
                <ellipse cx="160" cy="254" rx="124" ry="14" fill="#F4EDE4" stroke="#E2D4C6" strokeWidth="2" />
                <ellipse cx="160" cy="250" rx="116" ry="10" fill="#FFF9F5" />

                {/* ── BOTTOM TIER (Pastel Pink) ── */}
                <g>
                  {/* Bottom tier base */}
                  <path
                    d="M 36,182 Q 160,196 284,182 L 284,242 Q 160,256 36,242 Z"
                    fill="url(#botTierGrad)"
                  />
                  {/* Bottom tier top ellipse */}
                  <ellipse cx="160" cy="182" rx="124" ry="16" fill="#FFE2EC" stroke="#FFC2D6" strokeWidth="1.5" />
                  {/* Bottom tier cream icing drips */}
                  <path
                    d="M 36,182
                       Q 48,206 58,190
                       Q 70,214 84,188
                       Q 98,212 112,192
                       Q 128,216 142,190
                       Q 160,218 178,190
                       Q 196,216 210,192
                       Q 226,214 240,188
                       Q 254,212 268,190
                       Q 278,204 284,182
                       Q 160,196 36,182 Z"
                    fill="#FFFDF7"
                    opacity="0.95"
                  />
                  {/* Bottom tier sugar sprinkles */}
                  {[[55,220,"#FF6B9D"],[75,232,"#F7C948"],[95,224,"#C9B8FF"],[115,235,"#7ECCCA"],
                    [135,225,"#FF8DC7"],[155,236,"#F7C948"],[175,226,"#A8E6CF"],[195,234,"#FF6B9D"],
                    [215,225,"#C9B8FF"],[235,232,"#F7C948"],[255,222,"#7ECCCA"]].map(([cx,cy,c],i) => (
                    <circle key={i} cx={+cx} cy={+cy} r="2.5" fill={c as string} />
                  ))}
                  {/* Scalloped buttercream pearls along bottom base */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <circle key={i} cx={46 + i * 16} cy={242 + Math.sin((i / 14) * Math.PI) * 7} r="4" fill="#FFF5F8" stroke="#FFD1DF" strokeWidth="1" />
                  ))}
                </g>

                {/* ── TOP TIER (Cream Vanilla with Rose Drips) ── */}
                <g>
                  {/* Top tier base */}
                  <path
                    d="M 96,112 Q 160,124 224,112 L 224,168 Q 160,180 96,168 Z"
                    fill="url(#topTierGrad)"
                  />
                  {/* Top tier top ellipse */}
                  <ellipse cx="160" cy="112" rx="64" ry="12" fill="#FFFDF8" stroke="#FFE4EC" strokeWidth="1.5" />
                  {/* Rose frosting drips on top tier */}
                  <path
                    d="M 96,112
                       Q 106,134 116,120
                       Q 128,138 140,118
                       Q 152,136 164,122
                       Q 176,138 188,118
                       Q 200,136 212,120
                       Q 220,130 224,112
                       Q 160,124 96,112 Z"
                    fill="#FFB6CE"
                    opacity="0.9"
                  />
                  {/* "18" Golden Birthday Badge */}
                  <ellipse cx="160" cy="144" rx="20" ry="12" fill="#FFF8EB" stroke="#F7C948" strokeWidth="1.5" />
                  <text
                    x="160"
                    y="149"
                    textAnchor="middle"
                    fill="#D48B00"
                    fontSize="13"
                    fontWeight="800"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  >
                    18
                  </text>
                  {/* Buttercream pearls along top tier base */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <circle key={i} cx={104 + i * 14} cy={168 + Math.sin((i / 8) * Math.PI) * 5} r="3.2" fill="#FFF8FB" stroke="#FFD6E5" strokeWidth="0.8" />
                  ))}
                </g>

                {/* ── 18 CANDLES WITH ANIMATED GLOW & SMOKE PUFFS ── */}
                {CANDLES_18.map((c, i) => {
                  const flameY = c.y - c.h - 6;
                  return (
                    <g key={c.id}>
                      {/* Candle Stick with stripes */}
                      <rect x={c.x - 2} y={c.y - c.h} width="4" height={c.h} rx="1.5" fill={c.color} />
                      <line x1={c.x - 2} y1={c.y - c.h + 4} x2={c.x + 2} y2={c.y - c.h + 7} stroke="white" strokeWidth="1" opacity="0.7" />
                      <line x1={c.x - 2} y1={c.y - c.h + 11} x2={c.x + 2} y2={c.y - c.h + 14} stroke="white" strokeWidth="1" opacity="0.7" />
                      {/* Wick */}
                      <line x1={c.x} y1={c.y - c.h} x2={c.x} y2={c.y - c.h - 3} stroke="#555" strokeWidth="0.8" />

                      {/* Glowing Flame (if !cut) */}
                      {!cut && (
                        <g className="animate-pulse" style={{ animationDuration: `${0.8 + (i % 5) * 0.15}s` }}>
                          {/* Soft radial glow aura */}
                          <circle cx={c.x} cy={flameY} r="7" fill="rgba(255, 235, 59, 0.35)" />
                          {/* Outer yellow flame */}
                          <ellipse cx={c.x} cy={flameY} rx="3" ry="5.5" fill="#FFF176" />
                          {/* Inner orange flame */}
                          <ellipse cx={c.x} cy={flameY + 1} rx="1.8" ry="3.5" fill="#FFB300" />
                          {/* Flame core */}
                          <ellipse cx={c.x} cy={flameY + 2} rx="0.8" ry="1.5" fill="#FF5722" />
                        </g>
                      )}

                      {/* Extinguished Smoke Puff (if cut) */}
                      {cut && (
                        <g className="smoke-puff" style={{ animationDelay: `${(i % 6) * 0.08}s` }}>
                          <circle cx={c.x} cy={flameY - 2} r="3" fill="#D8B4E2" opacity="0.7" />
                          <circle cx={c.x + 2} cy={flameY - 6} r="4" fill="#E2E8F0" opacity="0.5" />
                          <circle cx={c.x - 2} cy={flameY - 11} r="5" fill="#CBD5E1" opacity="0.3" />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Slicing Knife Cut Effect Overlay */}
                {cut && (
                  <g>
                    {/* Clean slice line cut */}
                    <line
                      x1="160"
                      y1="90"
                      x2="175"
                      y2="255"
                      stroke="white"
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                      className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                    />
                    <line x1="160" y1="90" x2="175" y2="255" stroke="#FF6B9D" strokeWidth="1.5" opacity="0.8" />
                    {/* Sparkles along the cut */}
                    <text x="156" y="125" fontSize="11">✨</text>
                    <text x="170" y="185" fontSize="12">✨</text>
                    <text x="162" y="235" fontSize="10">✨</text>
                  </g>
                )}

                {/* SVG Gradients */}
                <defs>
                  <linearGradient id="botTierGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFD1DE" />
                    <stop offset="50%" stopColor="#FFAEC9" />
                    <stop offset="100%" stopColor="#FF94B4" />
                  </linearGradient>
                  <linearGradient id="topTierGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFDF7" />
                    <stop offset="50%" stopColor="#FFF3E8" />
                    <stop offset="100%" stopColor="#FFE0EA" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Swipe Guide Hint (if !cut) */}
              {!cut && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8], x: [-10, 10, -10] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white/85 backdrop-blur-sm rounded-full px-3 py-1 shadow-md border border-pink-200 text-[11px] font-semibold text-rose-500"
                  >
                    ↔ suring va kesing! 🎂
                  </motion.div>
                </div>
              )}
            </div>

            {/* Post-Slice Celebratory Badge */}
            <AnimatePresence>
              {cut && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 border-2 border-pink-300 p-2.5 shadow-md"
                >
                  <p className="text-xs sm:text-sm font-extrabold text-gray-800 rainbow">
                    18 Yoshing Qutlug' Bo'lsin, Aliya! 🎂✨
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Step Button */}
            <button onClick={onNext} className="btn-primary w-full py-3 mt-1">
              KEYINGISI →
            </button>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 5 — PRIZE.EXE (Money Game, Card Input, Fully Visible Tap Buttons)
// ═══════════════════════════════════════════════════════════════════════════════
function PrizeScreen({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [card, setCard] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const boxes = [
    { emoji: "🎁", label: "SOVG'A 1", gradient: "from-pink-100 to-pink-200", border: "border-pink-300" },
    { emoji: "🎀", label: "SOVG'A 2", gradient: "from-purple-100 to-purple-200", border: "border-purple-300" },
    { emoji: "💝", label: "SOVG'A 3", gradient: "from-yellow-100 to-yellow-200", border: "border-yellow-300" },
  ];

  const openBox = (i: number) => {
    if (won) return;
    setOpened(i);
    setWon(true);
    const burst = (o: { x: number; y: number }) =>
      confetti({ particleCount: 80, spread: 80, origin: o, colors: ["#FF6B9D","#C9B8FF","#F7C948","#FF1493"] });
    burst({ x: 0.5, y: 0.5 });
    setTimeout(() => { burst({ x: 0.2, y: 0.4 }); burst({ x: 0.8, y: 0.4 }); }, 300);
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const handleSubmit = async () => {
    if (card.replace(/\s/g, "").length < 16) return;
    setLoading(true);
    try {
      await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: card, amount: "50,000 so'm" }),
      });
    } catch { /* silent */ }
    setLoading(false);
    setSubmitted(true);
    setToast(true);
    setTimeout(() => setToast(false), 5000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            className="toast fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 w-[92vw] max-w-sm text-center shadow-xl"
          >
            <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">
              ✅ Yutuq so'rovi qabul qilindi! 50,000 so'm tez orada kartangizga o'tkaziladi ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="PRIZE.EXE" badge="🎁 50K">
          <div className="flex flex-col gap-3 sm:gap-3.5 my-auto">
            <div className="text-center">
              <span className="text-[11px] font-semibold tracking-widest text-rose-400 uppercase">
                Omadli Sovg'a Qutisi
              </span>
              <p className="text-xs text-gray-600 mt-0.5">
                O'zingizga yoqqan sovg'a qutisini tanlang va bosing!
              </p>
            </div>

            {/* Gift Boxes */}
            <div className="flex gap-2.5 sm:gap-3 justify-center">
              {boxes.map((box, i) => (
                <motion.button
                  key={i}
                  onClick={() => openBox(i)}
                  className={`relative w-20 h-22 sm:w-24 sm:h-26 rounded-xl bg-gradient-to-b ${box.gradient}
                    border-2 ${box.border} flex flex-col items-center justify-center gap-1
                    shadow-sm overflow-hidden`}
                  whileHover={!won ? { scale: 1.08, y: -4 } : {}}
                  whileTap={!won ? { scale: 0.94 } : {}}
                  animate={opened === i ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] } : {}}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
                  style={{ cursor: won ? "default" : "pointer" }}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20" style={{ clipPath: "polygon(45% 0,55% 0,55% 100%,45% 100%)" }} />
                  <div className="absolute inset-y-0 left-0 w-full bg-white/20" style={{ clipPath: "polygon(0 45%,100% 45%,100% 55%,0 55%)" }} />
                  <span className="text-2xl sm:text-3xl z-10 relative">
                    {opened === i ? "🎊" : box.emoji}
                  </span>
                  <span className="text-[9px] font-bold text-gray-600 z-10">{box.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Win result & Card Submission Section */}
            <AnimatePresence>
              {won && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220 }}
                  className="w-full flex flex-col gap-2.5 pt-1"
                >
                  {/* Winning Announcement Card */}
                  <div className="rounded-xl bg-gradient-to-r from-pink-100 via-purple-50 to-yellow-100 border border-pink-200/80 p-3 text-center">
                    <p className="font-bold text-gray-800 text-xs">TABRIKLAYMIZ! 🎉</p>
                    <p className="rainbow font-extrabold text-sm sm:text-base mt-0.5">
                      Siz 50,000 SO'M pul mukofotini yutib oldingiz! 🎉
                    </p>
                  </div>

                  {/* Form or Success Notice */}
                  {!submitted ? (
                    <div className="flex flex-col gap-2 text-left">
                      <label className="text-[11px] font-semibold text-gray-600">
                        Karta raqamingizni kiriting (Humo / Uzcard):
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card}
                        onChange={(e) => setCard(formatCard(e.target.value))}
                        placeholder="#### #### #### ####"
                        className="card-input py-2.5 text-sm"
                        maxLength={19}
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={loading || card.replace(/\s/g, "").length < 16}
                        className="btn-primary btn-gold w-full py-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Yuborilmoqda..." : "YUTUQNI OLISH 💳"}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-2.5 text-center">
                      <p className="text-xs text-green-700 font-semibold">
                        ✅ So'rov yuborildi! 50,000 so'm tez orada o'tkaziladi.
                      </p>
                    </div>
                  )}

                  {/* Button to Proceed to Memories */}
                  <motion.button
                    onClick={onNext}
                    className="btn-primary w-full py-3 text-xs mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    XOTIRALARNI KO'RISH 📸
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 6 — GALLERY.EXE (Swipable Polaroid Card Deck with Zoom Modal)
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryPhoto {
  id: number;
  src: string;
  caption: string;
  note: string;
  tag: string;
  emoji: string;
  bg: string;
  rotation: number;
}

const GALLERY_PHOTOS: MemoryPhoto[] = [
  { id: 1, src: "/photos/photo1.jpg", caption: "Eng quvnoq kunlar 🌸", note: "Har doim shunday kulib yur!", tag: "18th Birthday", emoji: "🌸", bg: "from-pink-200 via-rose-100 to-pink-100", rotation: -2 },
  { id: 2, src: "/photos/photo2.jpg", caption: "Unutilmas xotiralar ✨", note: "Barcha go'zal lahzalarimiz", tag: "Xotiralar", emoji: "✨", bg: "from-purple-200 via-indigo-100 to-pink-100", rotation: 2.5 },
  { id: 3, src: "/photos/photo3.jpg", caption: "18 yoshlik baxt 🎂", note: "Eng orziqib kutilgan kun", tag: "Happy 18", emoji: "🎂", bg: "from-amber-200 via-yellow-100 to-rose-100", rotation: -1.5 },
  { id: 4, src: "/photos/photo4.jpg", caption: "Eng samimiy kulgular 💖", note: "Do'stlikning eng sof aksi", tag: "Qadrdonim", emoji: "💖", bg: "from-rose-200 via-pink-100 to-purple-100", rotation: 3 },
  { id: 5, src: "/photos/photo5.jpg", caption: "Har doim birgamiz 🦋", note: "Katta marralar sari birga", tag: "Doimo birga", emoji: "🦋", bg: "from-sky-200 via-teal-100 to-indigo-100", rotation: -2 },
  { id: 6, src: "/photos/photo6.jpg", caption: "Yorqin orzular sari 🌷", note: "Barcha niyatlaring amalga oshsin", tag: "Orzular", emoji: "🌷", bg: "from-emerald-200 via-teal-100 to-pink-100", rotation: 1.8 },
];

function PolaroidItem({
  photo,
  onZoom,
}: {
  photo: MemoryPhoto;
  onZoom: (p: MemoryPhoto) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      onClick={() => onZoom(photo)}
      className="polaroid bg-white rounded-lg p-2.5 pb-4 shadow-xl border border-gray-100 cursor-pointer select-none relative group"
    >
      {/* Washi Tape at Top */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape rounded-xs z-10" />

      {/* Photo Frame / Image Area */}
      <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center">
        {!imgFailed ? (
          <img
            src={photo.src}
            alt={photo.caption}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Aesthetic Pastel Placeholder if /photos/photo*.jpg not uploaded yet */
          <div className={`w-full h-full bg-gradient-to-br ${photo.bg} flex flex-col items-center justify-center gap-1 p-2 text-center`}>
            <span className="text-3xl drop-shadow">{photo.emoji}</span>
            <span className="text-[9px] font-bold text-gray-600/80 tracking-wide uppercase">
              {photo.tag}
            </span>
          </div>
        )}

        {/* Zoom Magnifier Pill */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/40 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity">
          🔍 Kattalashtirish
        </div>
      </div>

      {/* Caption & Handwriting detail */}
      <div className="mt-2.5 text-center px-1">
        <p className="text-xs font-bold text-gray-800 leading-tight">
          {photo.caption}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {photo.note}
        </p>
      </div>
    </div>
  );
}

function GalleryScreen({ onNext }: { onNext: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedPhoto, setZoomedPhoto] = useState<MemoryPhoto | null>(null);

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
  };

  const currentPhoto = GALLERY_PHOTOS[currentIndex];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />

      {/* Zoom Modal Preview */}
      <AnimatePresence>
        {zoomedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-4 sm:p-5 max-w-sm w-full shadow-2xl relative text-center"
            >
              <button
                onClick={() => setZoomedPhoto(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>

              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-3">
                <img
                  src={zoomedPhoto.src}
                  alt={zoomedPhoto.caption}
                  onError={(e) => {
                    // Fallback to emoji banner
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="text-6xl">{zoomedPhoto.emoji}</span>
              </div>

              <h3 className="text-sm font-extrabold text-gray-800">{zoomedPhoto.caption}</h3>
              <p className="text-xs text-gray-500 mt-1">{zoomedPhoto.note}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="GALLERY.EXE" badge="📸 DECK">
          <div className="flex flex-col items-center gap-3 text-center my-auto">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-rose-400 uppercase">
                Bizning Chiroyli Xotiralarimiz
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Kartochkani suring yoki kattalashtirib ko'ring! 💕
              </p>
            </div>

            {/* Interactive Swipable Card Stack */}
            <div className="relative w-full max-w-[260px] h-[250px] flex items-center justify-center my-1">
              {/* Ghost card behind for realistic deck depth */}
              <div
                className="absolute inset-0 bg-white/70 rounded-lg shadow-md border border-gray-200 pointer-events-none"
                style={{
                  transform: "translateY(8px) scale(0.93) rotate(3deg)",
                  zIndex: 1,
                }}
              />
              <div
                className="absolute inset-0 bg-white/50 rounded-lg shadow-sm border border-gray-200 pointer-events-none"
                style={{
                  transform: "translateY(14px) scale(0.88) rotate(-3deg)",
                  zIndex: 0,
                }}
              />

              {/* Main Swipable Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto.id}
                  className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, { offset, velocity }) => {
                    if (offset.x > 70 || velocity.x > 350) {
                      prevCard();
                    } else if (offset.x < -70 || velocity.x < -350) {
                      nextCard();
                    }
                  }}
                  initial={{ scale: 0.9, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0, rotate: currentPhoto.rotation }}
                  exit={{ scale: 0.9, opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                >
                  <PolaroidItem photo={currentPhoto} onZoom={(p) => setZoomedPhoto(p)} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Deck Stepper Controls (Prev / Counter / Next) */}
            <div className="flex items-center justify-between w-full max-w-[260px] px-2 py-0.5">
              <button
                onClick={prevCard}
                className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-gray-700 text-xs font-bold border border-pink-200 shadow-xs cursor-pointer"
              >
                ← Oldingi
              </button>
              <div className="flex gap-1">
                {GALLERY_PHOTOS.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === i ? "bg-rose-500 w-3" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextCard}
                className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-gray-700 text-xs font-bold border border-pink-200 shadow-xs cursor-pointer"
              >
                Keyingi →
              </button>
            </div>

            {/* Proceed to Letter Button */}
            <button onClick={onNext} className="btn-primary w-full py-3 mt-1">
              XATNI O'QISH ✉️
            </button>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 7 — LETTER.EXE (Wax Seal Envelope)
// ═══════════════════════════════════════════════════════════════════════════════
function LetterScreen({ onOpenMessage }: { onOpenMessage: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />
      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="LETTER.EXE" badge="💌 MSG">
          <div className="flex flex-col items-center gap-4 text-center my-auto">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-rose-400 uppercase">
                Siz Uchun Maxsus Xat
              </span>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Aliyaga atalgan samimiy tilaklar sizni kutmoqda... 💌
              </p>
            </div>

            {/* Envelope with Wax Seal */}
            <motion.button
              onClick={onOpenMessage}
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              className="relative focus:outline-none my-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-52 h-34 sm:w-60 sm:h-38 rounded-2xl overflow-hidden relative
                border-2 border-pink-200 shadow-[0_8px_30px_rgba(255,107,157,0.25)]
                bg-gradient-to-br from-pink-50 to-purple-50"
              >
                <motion.div
                  className="absolute top-0 left-0 w-full"
                  animate={{ height: hovered ? "55%" : "45%" }}
                  style={{
                    background: "linear-gradient(160deg, #FFD6E8 0%, #E8D5FF 100%)",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    transformOrigin: "top",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl">💌</span>
                </div>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2
                  w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-600
                  border-2 border-white shadow-md flex items-center justify-center text-lg"
                >
                  🌸
                </div>
              </div>
              <p className="text-[11px] font-bold text-rose-500 mt-2.5 tracking-wider uppercase">
                OCHISH UCHUN BOSING
              </p>
            </motion.button>

            <div className="flex gap-2 items-center justify-center">
              {["💖","✨","🌸","💕","⭐"].map((e,i) => (
                <span key={i} className="text-lg" style={{ animation: `floatBob ${2.5+i*0.3}s ease-in-out infinite`, animationDelay: `${i*0.2}s` }}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 8 — MESSAGE.TXT (Polished Vintage Lined Notepad with Typewriter Effect)
// ═══════════════════════════════════════════════════════════════════════════════
const LETTER_TEXT = `Qadrdon do'stim Aliya! 🌸✨

Bugun hayotingdagi eng quvonchli va esda qolarli kunlardan biri — 18 yoshing muborak bo'lsin! 🎂

Sen bilan do'st bo'lganimdan juda xursandman. Sening samimiyliging, quvnoqliging, ishonchli do'stliging va har doim qo'llab-quvvatlashing men uchun juda qadrli.

Ushbu go'zal 18 yoshing senga ulkan muvaffaqiyatlar, o'qishlaringda va kelajakdagi barcha rejalaringda katta yutuqlar olib kelsin. Har doim shunday ochiqko'ngil, quvnoq va ajoyib do'st bo'lib yur!

18 yoshing qutlug' bo'lsin, qadrdonim! 🎉🎈`;

function MessageScreen() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const iv = setInterval(() => {
      if (idxRef.current < LETTER_TEXT.length) {
        const ch = LETTER_TEXT[idxRef.current];
        setDisplayed((prev) => prev + ch);
        idxRef.current++;
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        setDone(true);
        clearInterval(iv);
      }
    }, 30);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative">
      <ParticleBackground />
      <div className="z-10 w-full flex justify-center">
        <GlassWindow title="MESSAGE.TXT" badge="📝 XAT">
          <div className="flex flex-col gap-3 my-auto">
            <div className="text-center">
              <span className="text-[11px] font-semibold tracking-widest text-rose-400 uppercase">
                Qadrdon Do'stim Aliyaga Xat 🌸
              </span>
            </div>

            {/* Polished Vintage Lined Notepad with Spiral Top & Left Red Margin */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200/90 shadow-md">
              {/* Retro Spiral Binding Holes at Top */}
              <div className="bg-[#FAF3E8] border-b border-amber-200/80 px-4 py-1 flex justify-around items-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300 shadow-inner border border-gray-400" />
                ))}
              </div>

              {/* Lined Paper Area with Perfect 30px Line-Height Alignment */}
              <div
                ref={scrollRef}
                className="vintage-notepad overflow-y-auto pl-11 pr-4 py-3"
                style={{
                  height: "280px",
                }}
              >
                <pre
                  className="whitespace-pre-wrap break-words font-mono select-text"
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "18px",
                    lineHeight: "30px",
                    color: "#2C2640",
                  }}
                >
                  {displayed}
                  {!done && <span className="cursor-blink text-rose-500 font-bold">▌</span>}
                </pre>
              </div>
            </div>

            {/* Celebratory Completion Button */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-2 pt-1"
                >
                  <p className="text-xs font-semibold text-gray-600 text-center">
                    18 yoshing qutlug' bo'lsin, do'stim Aliya! 🎉✨
                  </p>
                  <button
                    onClick={() =>
                      confetti({
                        particleCount: 120,
                        spread: 85,
                        origin: { y: 0.6 },
                        colors: ["#FF6B9D", "#C9B8FF", "#F7C948", "#FF1493"],
                        shapes: ["star", "circle"],
                      })
                    }
                    className="btn-primary btn-gold w-full py-2.5 text-xs"
                  >
                    🎉 TABRIKLAR! 🎉
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassWindow>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE — hydration-safe, persistent audio & smooth navigation
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<Screen>("seal");
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Prevent hydration mismatch — render nothing until client is ready
  useEffect(() => {
    setMounted(true);
  }, []);

  // Global click-anywhere audio unlock
  useEffect(() => {
    if (!mounted) return;
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused && !muted) {
        audio.play().then(() => {
          setPlaying(true);
        }).catch(() => {});
      }
    };
    document.addEventListener("click", unlock, { passive: true });
    document.addEventListener("touchstart", unlock, { passive: true });
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, [mounted, muted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    setMuted(next);
    audio.muted = next;
    if (!next && audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!mounted) return null;

  const go = (s: Screen) => setScreen(s);

  return (
    <main>
      {/* Hidden persistent audio element */}
      <audio
        ref={audioRef}
        src="/music/music.mp3"
        loop
        preload="auto"
        playsInline
        style={{ display: "none" }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Floating Sound Toggle */}
      <SoundButton playing={playing} muted={muted} onToggle={toggleMute} />

      {/* Screen Transitions */}
      <AnimatePresence mode="wait">
        {screen === "seal" && (
          <motion.div key="seal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
            <SealScreen audioRef={audioRef} onComplete={() => go("loading")} />
          </motion.div>
        )}
        {screen === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingScreen onComplete={() => go("party")} />
          </motion.div>
        )}
        {screen === "party" && (
          <motion.div key="party" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PartyScreen onNext={() => go("cake")} />
          </motion.div>
        )}
        {screen === "cake" && (
          <motion.div key="cake" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CakeScreen onNext={() => go("prize")} />
          </motion.div>
        )}
        {screen === "prize" && (
          <motion.div key="prize" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PrizeScreen onNext={() => go("gallery")} />
          </motion.div>
        )}
        {screen === "gallery" && (
          <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <GalleryScreen onNext={() => go("letter")} />
          </motion.div>
        )}
        {screen === "letter" && (
          <motion.div key="letter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <LetterScreen onOpenMessage={() => go("message")} />
          </motion.div>
        )}
        {screen === "message" && (
          <motion.div key="message" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <MessageScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
