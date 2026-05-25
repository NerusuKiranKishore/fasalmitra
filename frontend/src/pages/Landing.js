import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Animated wave SVG canvas
function WaveCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const waves = [
      { amp: 28, freq: 0.012, speed: 0.018, color: 'rgba(46,139,87,0.18)', y: 0.55 },
      { amp: 20, freq: 0.018, speed: 0.025, color: 'rgba(94,184,138,0.14)', y: 0.62 },
      { amp: 35, freq: 0.009, speed: 0.012, color: 'rgba(13,51,32,0.22)', y: 0.70 },
      { amp: 15, freq: 0.025, speed: 0.032, color: 'rgba(232,160,32,0.10)', y: 0.78 },
    ];

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      waves.forEach(wave => {
        ctx.beginPath();
        const baseY = h * wave.y;
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 2) {
          const y = baseY + Math.sin(x * wave.freq + frame * wave.speed) * wave.amp
                          + Math.sin(x * wave.freq * 1.7 + frame * wave.speed * 0.8) * (wave.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

// Floating particles
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.15,
      emoji: ['🌾','🌱','✨','🍃','🌿'][Math.floor(Math.random()*5)],
      useEmoji: Math.random() > 0.75,
      size: Math.random() * 14 + 10,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        if (p.useEmoji) {
          ctx.globalAlpha = p.alpha * 0.6;
          ctx.font = `${p.size}px serif`;
          ctx.fillText(p.emoji, p.x, p.y);
          ctx.globalAlpha = 1;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(94,184,138,${p.alpha})`;
          ctx.fill();
        }
        p.x += p.vx; p.y += p.vy;
        if (p.y < -20) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -20) p.x = canvas.width + 10;
        if (p.x > canvas.width + 20) p.x = -10;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

// Counter animation
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(timer); }
          else setVal(Math.floor(start));
        }, 20);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// Scroll reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const FEATURES = [
  { icon: '🌱', title: 'AI Crop Advisory', desc: 'Tell us your district, soil & season. Gemini AI recommends the best crops with yield estimates, water needs, and expert tips.', color: '#0d3320', link: '/crop-advisory' },
  { icon: '🌤️', title: 'Weather Forecast', desc: '7-day hyper-local forecast for 15 AP districts. AI-generated irrigation schedules and pest risk alerts based on weather patterns.', color: '#1a5c38', link: '/weather' },
  { icon: '📊', title: 'Mandi Prices', desc: 'Live wholesale prices from government mandis. See min, max, and modal rates with per-kg breakdown — before you sell.', color: '#2e8b57', link: '/mandi' },
  { icon: '📋', title: 'Govt Schemes', desc: '8+ central and AP state schemes. Instant eligibility check, document list, and direct apply links for PMFBY, Rythu Bharosa & more.', color: '#0d3320', link: '/schemes' },
];

const STATS = [
  { value: 15, suffix: '+', label: 'AP Districts Covered' },
  { value: 8,  suffix: '+', label: 'Govt Schemes Listed' },
  { value: 18, suffix: '+', label: 'Crop Varieties' },
  { value: 100, suffix: '%', label: 'Free Forever' },
];

const STEPS = [
  { n: '01', title: 'Select Your District', desc: 'Choose from 15 Andhra Pradesh districts — we know your local soil, climate, and crops.' },
  { n: '02', title: 'Enter Farm Details', desc: 'Tell us your soil type, season, and land size. The more you share, the smarter the advice.' },
  { n: '03', title: 'Get AI Recommendations', desc: 'Gemini AI analyzes your inputs against agricultural databases and generates personalized advice.' },
  { n: '04', title: 'Grow with Confidence', desc: 'Follow crop tips, monitor weather, track mandi prices, and apply for schemes — all in one place.' },
];

const CROPS = ['🌾 Rice', '🌶️ Chilli', '🥜 Groundnut', '🌿 Turmeric', '☀️ Sunflower', '🌱 Cotton', '🍌 Banana', '🧅 Onion'];

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    // ✅ Outer wrapper is light parchment — only hero is dark
    <div style={{ background: '#faf8f3', overflow: 'hidden' }}>

      {/* ── HERO (intentionally dark — brand identity) ── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        background: 'linear-gradient(160deg, #061a0e 0%, #0d3320 35%, #1a5c38 70%, #0d3320 100%)',
      }}>
        {/* Dynamic spotlight */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 60% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(94,184,138,0.12) 0%, transparent 70%)`,
          transition: 'background 0.1s ease',
        }} />
        <Particles />
        <WaveCanvas />

        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Geometric accent lines */}
        <div style={{ position: 'absolute', top: '15%', right: '8%', opacity: 0.08 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#5cb88a" strokeWidth="1"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#5cb88a" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="30" fill="none" stroke="#e8a020" strokeWidth="0.5"/>
            <line x1="20" y1="100" x2="180" y2="100" stroke="#5cb88a" strokeWidth="0.5"/>
            <line x1="100" y1="20" x2="100" y2="180" stroke="#5cb88a" strokeWidth="0.5"/>
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 900, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(94,184,138,0.12)', border: '1px solid rgba(94,184,138,0.25)',
            color: '#5cb88a', padding: '8px 20px', borderRadius: 50, fontSize: '0.8rem',
            fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: 32, backdropFilter: 'blur(8px)',
            animation: 'fadeDown 0.8s ease both',
          }}>
            🌾 Built for Andhra Pradesh Farmers
          </div>

          {/* Main heading */}
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontSize: 'clamp(3rem,7vw,5.5rem)',
            color: '#fff', lineHeight: 1.0, letterSpacing: '-3px', marginBottom: 28,
            animation: 'fadeUp 0.9s ease 0.15s both',
          }}>
            Farm smarter.<br/>
            <span style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #5cb88a 0%, #e8a020 50%, #5cb88a 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              animation: 'shimmer 4s linear infinite',
              display: 'inline-block',
            }}>Grow better.</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.58)', maxWidth: 520,
            margin: '0 auto 48px', lineHeight: 1.75, fontWeight: 400,
            animation: 'fadeUp 0.9s ease 0.3s both',
          }}>
            AI-powered crop advice, live mandi prices, weather forecasts, and government schemes — all free, all in one place.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 64, animation: 'fadeUp 0.9s ease 0.45s both',
          }}>
            <Link to="/crop-advisory" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 50, fontWeight: 800,
              fontSize: '1rem', textDecoration: 'none', fontFamily: "'Cabinet Grotesk', sans-serif",
              background: 'linear-gradient(135deg, #2e8b57, #5cb88a)',
              color: '#fff', boxShadow: '0 8px 32px rgba(46,139,87,0.4)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(46,139,87,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 32px rgba(46,139,87,0.4)'; }}
            >
              🌱 Get Crop Advisory
            </Link>
            <Link to="/schemes" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 50, fontWeight: 800,
              fontSize: '1rem', textDecoration: 'none', fontFamily: "'Cabinet Grotesk', sans-serif",
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
              border: '1.5px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.15)'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}
            >
              📋 View Schemes
            </Link>
          </div>

          {/* Scrolling crop ticker */}
          <div style={{
            animation: 'fadeUp 0.9s ease 0.6s both',
            overflow: 'hidden', borderRadius: 50,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 0',
          }}>
            <div style={{
              display: 'flex', gap: 32, animation: 'ticker 20s linear infinite',
              width: 'max-content', alignItems: 'center',
            }}>
              {[...CROPS, ...CROPS].map((c, i) => (
                <span key={i} style={{
                  color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem',
                  fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.04em',
                }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'bounce 2s ease infinite', opacity: 0.4,
        }}>
          <span style={{ color: '#fff', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)' }} />
        </div>
      </section>

      {/* ── STATS BAR ── ✅ Light themed */}
      <section style={{ background: '#fff', borderBottom: '1px solid #cde3d5', padding: '0' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        }}>
          {STATS.map((s, i) => (
            <RevealSection key={s.label} delay={i * 0.1}>
              <div style={{
                padding: '36px 24px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid #e8f0eb' : 'none',
              }}>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontSize: '2.8rem',
                  color: '#0d3320', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1,
                }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ color: '#6b8f74', fontSize: '0.8rem', marginTop: 6, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── ✅ Light #faf8f3 background */}
      <section style={{ padding: '100px 24px', background: '#faf8f3' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2e8b57', marginBottom: 12 }}>
                What FasalMitra Offers
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0d3320', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 16 }}>
                Four tools. One mission.
              </h2>
              <p style={{ color: '#6b8f74', fontSize: '1.05rem', maxWidth: 460, margin: '0 auto' }}>
                Every feature is built around what an AP farmer needs — simple, accurate, and always available.
              </p>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.12}>
                <Link to={f.link} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    background: '#fff', border: '1.5px solid #cde3d5', borderRadius: 24,
                    padding: 32, height: '100%', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)';
                      e.currentTarget.style.boxShadow = '0 24px 64px rgba(13,51,32,0.12)';
                      e.currentTarget.style.borderColor = '#5cb88a';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                      e.currentTarget.style.borderColor = '#cde3d5';
                    }}
                  >
                    {/* Top accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.color}, #5cb88a)` }} />
                    <div style={{
                      width: 56, height: 56, background: '#e6f4ed', borderRadius: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.7rem', marginBottom: 20, border: '1px solid #cde3d5',
                    }}>{f.icon}</div>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.35rem', color: '#0d3320', marginBottom: 10, letterSpacing: '-0.5px' }}>{f.title}</h3>
                    <p style={{ color: '#6b8f74', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2e8b57', fontWeight: 800, fontSize: '0.85rem' }}>
                      Try it <span style={{ fontSize: '1rem' }}>→</span>
                    </div>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── ✅ Light #f0f8f3 background */}
      <section style={{ padding: '100px 24px', background: '#f0f8f3', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
          <svg width="500" height="500" viewBox="0 0 500 500">
            {[...Array(8)].map((_, i) => (
              <circle key={i} cx="250" cy="250" r={50 + i * 30} fill="none" stroke="#0d3320" strokeWidth="1"/>
            ))}
          </svg>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ marginBottom: 64 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2e8b57', marginBottom: 12 }}>
                How It Works
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#0d3320', letterSpacing: '-2px', lineHeight: 1.1 }}>
                From farm details<br/>to smart advice
              </h2>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 24 }}>
            {STEPS.map((s, i) => (
              <RevealSection key={s.n} delay={i * 0.15}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      fontFamily: "'Fraunces', serif", fontSize: '3rem', fontWeight: 800,
                      color: '#0d3320', opacity: 0.08, lineHeight: 1, marginBottom: -10,
                    }}>{s.n}</div>
                    <div style={{
                      width: 48, height: 48, background: '#0d3320', borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 16,
                    }}>
                      <div style={{ width: 20, height: 20, background: '#5cb88a', borderRadius: 4 }} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.1rem', color: '#0d3320', marginBottom: 8, letterSpacing: '-0.3px' }}>{s.title}</h3>
                    <p style={{ color: '#6b8f74', fontSize: '0.88rem', lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── AP MAP VISUAL ── ✅ Pure white background */}
      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <RevealSection>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2e8b57', marginBottom: 12 }}>
                Andhra Pradesh Focus
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0d3320', letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: 20 }}>
                15 districts.<br/>One dedicated platform.
              </h2>
              <p style={{ color: '#6b8f74', lineHeight: 1.75, marginBottom: 32, fontSize: '0.97rem' }}>
                FasalMitra is built ground-up for Andhra Pradesh's unique agro-climatic zones, soil types, and crop calendars — not a generic tool repurposed for AP.
              </p>
              {[
                { label: 'Coastal AP', crops: 'Rice, Coconut, Chilli, Banana' },
                { label: 'Rayalaseema', crops: 'Groundnut, Cotton, Tobacco, Tomato' },
                { label: 'North AP', crops: 'Maize, Cashew, Coffee, Turmeric' },
              ].map(z => (
                <div key={z.label} style={{
                  padding: '14px 18px', borderRadius: 12, background: '#f0f8f3',
                  border: '1px solid #cde3d5', marginBottom: 10,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0d3320' }}>{z.label}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6b8f74' }}>{z.crops}</span>
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div style={{
              background: 'linear-gradient(135deg, #0d3320 0%, #1a5c38 60%, #2e8b57 100%)',
              borderRadius: 32, padding: 48, position: 'relative', overflow: 'hidden',
              aspectRatio: '1', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
                <svg width="100%" height="100%" viewBox="0 0 400 400">
                  {[...Array(10)].map((_, i) => (
                    <circle key={i} cx="200" cy="200" r={20 + i * 20} fill="none" stroke="#fff" strokeWidth="0.5"/>
                  ))}
                </svg>
              </div>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🗺️</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.6rem', color: '#fff', marginBottom: 8, letterSpacing: '-1px' }}>
                Andhra Pradesh
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: 32 }}>
                Covering all major agricultural districts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {['Vijayawada','Guntur','Kurnool','Tirupati','Nellore','Rajahmundry','Visakhapatnam'].map(d => (
                  <span key={d} style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: 50,
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>{d}</span>
                ))}
                <span style={{
                  background: 'rgba(232,160,32,0.2)', border: '1px solid rgba(232,160,32,0.3)',
                  color: '#e8a020', padding: '4px 12px', borderRadius: 50,
                  fontSize: '0.75rem', fontWeight: 700,
                }}>+8 more</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FINAL CTA ── ✅ Light #faf8f3 background */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden', background: '#faf8f3' }}>
        <RevealSection>
          <div style={{
            maxWidth: 900, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, #061a0e 0%, #0d3320 50%, #1a5c38 100%)',
            borderRadius: 40, padding: '72px 48px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(94,184,138,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(232,160,32,0.06)', pointerEvents: 'none' }} />

            <div style={{ fontSize: '3rem', marginBottom: 20 }}>🌾</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#fff', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 16 }}>
              Ready to farm smarter?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
              Join thousands of AP farmers getting AI-powered advice, live prices, and government scheme updates.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { to: '/crop-advisory', label: '🌱 Crop Advisory', primary: true },
                { to: '/weather', label: '🌤️ Weather', primary: false },
                { to: '/mandi', label: '📊 Mandi Prices', primary: false },
                { to: '/schemes', label: '📋 Schemes', primary: false },
              ].map(btn => (
                <Link key={btn.to} to={btn.to} style={{
                  padding: '13px 24px', borderRadius: 50, fontWeight: 800,
                  fontSize: '0.9rem', textDecoration: 'none', fontFamily: "'Cabinet Grotesk', sans-serif",
                  background: btn.primary ? 'linear-gradient(135deg,#2e8b57,#5cb88a)' : 'rgba(255,255,255,0.08)',
                  color: '#fff', border: btn.primary ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 0.2s ease', backdropFilter: btn.primary ? 'none' : 'blur(8px)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.opacity='0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.opacity='1'; }}
                >{btn.label}</Link>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── FOOTER ── ✅ Kept dark — footers look better dark on light pages */}
      <footer style={{ background: '#061a0e', padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.5px' }}>
            Fasal<span style={{ color: '#e8a020' }}>.</span>Mitra
          </div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}>
            Built for small &amp; marginal farmers of Andhra Pradesh · 100% free
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['🌱','Crop','/crop-advisory'],['🌤️','Weather','/weather'],['📊','Mandi','/mandi'],['📋','Schemes','/schemes']].map(([icon,label,to]) => (
              <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.75)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.35)'}
              >{icon} {label}</Link>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bounce   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}