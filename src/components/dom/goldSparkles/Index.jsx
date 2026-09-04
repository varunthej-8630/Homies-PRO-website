import React, { useEffect, useRef } from 'react';
import styles from './styles/goldSparkles.module.scss';

const GOLD_PALETTE = [
  'rgba(212, 175, 55, ', // Classic warm gold #D4AF37
  'rgba(201, 162, 39, ', // Deep rich gold #C9A227
  'rgba(224, 193, 90, ', // Soft pale gold #E0C15A
  'rgba(197, 163, 89, ', // Brand metallic gold #C5A359
];

function drawStar(ctx, x, y, size, opacity, colorPrefix) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = `${colorPrefix}${opacity})`;

  ctx.beginPath();
  const arm = size;
  const inner = size * 0.18;

  ctx.moveTo(0, -arm);
  ctx.quadraticCurveTo(0, -inner, arm, 0);
  ctx.quadraticCurveTo(inner, 0, 0, arm);
  ctx.quadraticCurveTo(0, inner, -arm, 0);
  ctx.quadraticCurveTo(-inner, 0, 0, -arm);
  ctx.closePath();
  ctx.fill();

  // Subtle core glint
  ctx.beginPath();
  ctx.arc(0, 0, inner * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = `${colorPrefix}${Math.min(1, opacity * 1.3)})`;
  ctx.fill();

  ctx.restore();
}

export default function GoldSparkles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getParticleCount = (w) => {
      if (w < 768) return 10;
      if (w < 1024) return 18;
      return 30;
    };

    let particleCount = getParticleCount(width);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 6;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const createParticles = (count) => {
      const result = [];
      for (let i = 0; i < count; i += 1) {
        const rand = Math.random();
        let type = 'dust';
        let size = Math.random() * 0.9 + 0.7; // 0.7 - 1.6px
        let maxOpacity = Math.random() * 0.25 + 0.18; // 0.18 - 0.43

        if (rand > 0.96) {
          type = 'star';
          size = Math.random() * 1.8 + 3.2; // 3.2 - 5.0px
          maxOpacity = Math.random() * 0.35 + 0.45; // 0.45 - 0.80
        } else if (rand > 0.85) {
          type = 'ambient';
          size = Math.random() * 1.0 + 1.6; // 1.6 - 2.6px
          maxOpacity = Math.random() * 0.25 + 0.35; // 0.35 - 0.60
        }

        const colorPrefix = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];

        result.push({
          x: Math.random() * width,
          y: Math.random() * height,
          originX: Math.random() * width,
          originY: Math.random() * height,
          size,
          type,
          colorPrefix,
          baseOpacity: maxOpacity,
          currentOpacity: maxOpacity * 0.5,
          twinkleSpeed: Math.random() * 0.0012 + 0.0006, // slow 5-10s cycle
          twinklePhase: Math.random() * Math.PI * 2,
          driftSpeedX: (Math.random() - 0.5) * 0.08,
          driftSpeedY: (Math.random() - 0.5) * 0.06 - 0.02,
          driftRadius: Math.random() * 15 + 8,
          driftAngle: Math.random() * Math.PI * 2,
        });
      }
      return result;
    };

    let particles = createParticles(particleCount);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particleCount = getParticleCount(width);
      particles = createParticles(particleCount);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let isTabVisible = true;
    let lastTime = performance.now();

    const render = (time) => {
      if (!isTabVisible) return;

      const delta = time - lastTime;
      lastTime = time;

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.driftAngle += 0.003;
          p.x += p.driftSpeedX + Math.sin(p.driftAngle) * 0.04;
          p.y += p.driftSpeedY + Math.cos(p.driftAngle) * 0.03;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          p.twinklePhase += p.twinkleSpeed * (delta > 0 && delta < 100 ? delta : 16);
          const wave = Math.sin(p.twinklePhase);
          p.currentOpacity = p.baseOpacity * (0.45 + 0.55 * (wave * 0.5 + 0.5));
        }

        const renderX = p.x + mouseX;
        const renderY = p.y + mouseY;

        if (p.type === 'star') {
          drawStar(ctx, renderX, renderY, p.size, p.currentOpacity, p.colorPrefix);
        } else if (p.type === 'ambient') {
          const grad = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, p.size * 2.2);
          grad.addColorStop(0, `${p.colorPrefix}${p.currentOpacity})`);
          grad.addColorStop(0.5, `${p.colorPrefix}${p.currentOpacity * 0.4})`);
          grad.addColorStop(1, `${p.colorPrefix}0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `${p.colorPrefix}${p.currentOpacity})`;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !prefersReducedMotion) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (prefersReducedMotion) {
      render(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className={styles.canvasWrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
