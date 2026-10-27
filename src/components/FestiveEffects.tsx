import React, { useRef, useEffect } from 'react';

interface FestiveEffectsProps {
  festiveMode: 'christmas' | 'new_year' | 'off';
  snowIntensity: 'off' | 'light' | 'medium' | 'heavy';
  snowScope: 'home_only' | 'all_screens';
  fireworksScope: 'home_only' | 'home_sky' | 'all_screens';
  fireworksPosition: 'sky_top' | 'full_screen';
  fireworksIntensity: 'light' | 'medium' | 'heavy';
  currentScreenId: string;
  isSoundEnabled: boolean;
  onPlayFireworkBoom: () => void;
}

export const FestiveEffects: React.FC<FestiveEffectsProps> = ({
  festiveMode,
  snowIntensity,
  snowScope,
  fireworksScope,
  fireworksPosition,
  fireworksIntensity,
  currentScreenId,
  isSoundEnabled,
  onPlayFireworkBoom,
}) => {
  const snowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Snow Canvas
  useEffect(() => {
    const canvas = snowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (
      snowIntensity === 'off' || 
      currentScreenId === 'admin_dashboard' || 
      (snowScope === 'home_only' && currentScreenId !== 'home')
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    const flakeCount = snowIntensity === 'light' ? 25 : snowIntensity === 'medium' ? 55 : 95;

    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const flakes: { x: number; y: number; r: number; d: number; s: number }[] = [];
    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * (canvas.width || 400),
        y: Math.random() * (canvas.height || 800),
        r: Math.random() * 2.8 + 1,
        d: Math.random() * flakeCount,
        s: Math.random() * 1.1 + 0.6
      });
    }

    let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.beginPath();
      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();

      angle += 0.01;
      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        f.y += Math.cos(angle + f.d) + 1 + f.s;
        f.x += Math.sin(angle) * 0.75;
        if (f.x > canvas.width + 5 || f.x < -5 || f.y > canvas.height) {
          flakes[i] = {
            x: Math.random() * canvas.width,
            y: -8,
            r: f.r,
            d: f.d,
            s: f.s
          };
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [snowIntensity, snowScope, currentScreenId]);

  // Fireworks Canvas
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isExcludedScreen = currentScreenId === 'admin_dashboard';
    const isNotOnHome = (fireworksScope === 'home_only' || fireworksScope === 'home_sky') && currentScreenId !== 'home';

    if (festiveMode !== 'new_year' || isExcludedScreen || isNotOnHome) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
    }

    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      trail: { x: number; y: number; alpha: number }[];
    }

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    const colors = ['#FF5964', '#FEE180', '#35A7FF', '#38BDF8', '#38EF7D', '#FF7EB6', '#FFFFFF', '#F59E0B', '#E879F9'];

    const spawnExplosion = (x: number, y: number, baseColor?: string) => {
      if (isSoundEnabled) {
        onPlayFireworkBoom();
      }
      const count = fireworksIntensity === 'heavy' ? 52 : fireworksIntensity === 'medium' ? 36 : 22;
      const col = baseColor || colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 3.4 + 1.6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.35 ? col : '#FFFFFF',
          size: Math.random() * 2 + 1.2,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    const launchRocket = () => {
      const width = canvas.width || 400;
      const height = canvas.height || 800;
      const x = Math.random() * (width * 0.76) + width * 0.12;
      const targetY = fireworksPosition === 'sky_top' || fireworksScope === 'home_sky'
        ? Math.random() * (height * 0.32) + (height * 0.08)
        : Math.random() * (height * 0.45) + (height * 0.15);

      rockets.push({
        x,
        y: height,
        targetY,
        vy: -(Math.random() * 3.5 + 6.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    };

    const intervalTime = fireworksIntensity === 'heavy' ? 1100 : fireworksIntensity === 'medium' ? 2200 : 3600;
    const rocketInterval = setInterval(launchRocket, intervalTime);
    launchRocket();

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y, alpha: 0.85 });
        if (r.trail.length > 7) r.trail.shift();
        r.y += r.vy;

        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          ctx.save();
          ctx.globalAlpha = (t / r.trail.length) * 0.5;
          ctx.fillStyle = r.color;
          ctx.beginPath();
          ctx.arc(pt.x + (Math.random() - 0.5) * 1.5, pt.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.shadowColor = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY) {
          spawnExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055;
        p.vx *= 0.98;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      clearInterval(rocketInterval);
      cancelAnimationFrame(animId);
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [festiveMode, fireworksScope, fireworksPosition, fireworksIntensity, currentScreenId, isSoundEnabled]);

  return (
    <>
      {snowIntensity !== 'off' && (
        <canvas 
          ref={snowCanvasRef}
          className="absolute inset-0 pointer-events-none z-20"
        />
      )}

      {festiveMode === 'new_year' && (
        <canvas 
          ref={fireworksCanvasRef}
          className={`absolute pointer-events-none z-10 transition-all duration-300 ${
            fireworksPosition === 'sky_top' || fireworksScope === 'home_sky'
              ? 'top-0 left-0 right-0 h-[50%]'
              : 'inset-0'
          }`}
        />
      )}
    </>
  );
};
