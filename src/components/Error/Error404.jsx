import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

import {
  Home, ArrowLeft, Search, Compass, Zap, Code2,
  LayoutDashboard, BookOpen, Briefcase, Package,
  Mail, ArrowRight, RefreshCw, Terminal
} from 'lucide-react';

const QUICK_LINKS = [
  { icon: <Home size={16} />, label: 'Homepage', to: '/' },
  { icon: <Briefcase size={16} />, label: 'Portfolio', to: '/portfolio' },
  { icon: <Package size={16} />, label: 'Products', to: '/store' },
  { icon: <BookOpen size={16} />, label: 'Blog', to: '/blog' },
  { icon: <Mail size={16} />, label: 'Contact', to: '/contact' },
  { icon: <LayoutDashboard size={16} />, label: 'Services', to: '/services' },
];

const GLITCH_CHARS = '!@#$%^&*<>[]{}|/\\?~`01';

function useGlitchText(text, active) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(null);
  const iterRef = useRef(0);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    iterRef.current = 0;
    const chars = text.split('');
    const totalFrames = chars.length * 4;

    const animate = () => {
      iterRef.current += 1;
      const progress = iterRef.current / totalFrames;
      const resolved = Math.floor(progress * chars.length);

      setDisplay(
        chars.map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < resolved) return ch;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join('')
      );

      if (iterRef.current < totalFrames + 5) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, text]);

  return display;
}

const Error404 = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const glitchedTitle = useGlitchText('PAGE NOT FOUND', glitchActive);

  // Boot terminal animation
  useEffect(() => {
    const lines = [
      { text: '> Initializing request...', delay: 300 },
      { text: '> Scanning route map...', delay: 700 },
      { text: '> Route "/unknown-path" not found', delay: 1200 },
      { text: '> Querying fallback routes...', delay: 1800 },
      { text: '> ERROR 404: Resource does not exist', delay: 2400, isError: true },
      { text: '> Suggestion: Return to /home', delay: 3000, isAccent: true },
    ];

    lines.forEach(({ text, delay, isError, isAccent }) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, { text, isError, isAccent }]);
      }, delay);
    });
  }, []);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-trigger glitch every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const themeClass = isDarkMode ? 'dark' : 'light';

  return (
    <div className={`shivam-stack-error404-root ${themeClass}`}>

      {/* ── Animated BG ──────────────────────────────── */}
      <div className="shivam-stack-error404-bg">
        <div className="shivam-stack-error404-bg-grid" />
        <div
          className="shivam-stack-error404-bg-orb shivam-stack-error404-bg-orb-1"
          style={{ transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 12}px)` }}
        />
        <div
          className="shivam-stack-error404-bg-orb shivam-stack-error404-bg-orb-2"
          style={{ transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -10}px)` }}
        />
        <div
          className="shivam-stack-error404-bg-orb shivam-stack-error404-bg-orb-3"
          style={{ transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 16}px)` }}
        />
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="shivam-stack-error404-particle"
            style={{
              left: `${5 + (i * 4.7) % 90}%`,
              animationDelay: `${(i * 0.4) % 6}s`,
              animationDuration: `${8 + (i * 1.3) % 8}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="shivam-stack-error404-content">

        {/* Navbar strip */}
        <nav className="shivam-stack-error404-nav">
          <Link to="/" className="shivam-stack-error404-nav-logo">
            <span className="shivam-stack-error404-nav-logo-icon"><Zap size={16} /></span>
            <span className="shivam-stack-error404-nav-logo-text">Shivam<span>Stack</span></span>
          </Link>
          <button
            className="shivam-stack-error404-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={15} /> Go Back
          </button>
        </nav>

        {/* ── Hero 404 ─────────────────────────────────── */}
        <div className="shivam-stack-error404-hero">

          {/* Giant 404 */}
          <div
            className="shivam-stack-error404-giant-wrap"
            onMouseEnter={() => setGlitchActive(true)}
            onMouseLeave={() => setGlitchActive(false)}
            style={{
              transform: `perspective(800px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg)`
            }}
          >
            <div className={`shivam-stack-error404-giant ${glitchActive ? 'shivam-stack-error404-giant-glitching' : ''}`}>
              <span className="shivam-stack-error404-giant-digit shivam-stack-error404-giant-4a">4</span>
              <span className="shivam-stack-error404-giant-digit shivam-stack-error404-giant-0">0</span>
              <span className="shivam-stack-error404-giant-digit shivam-stack-error404-giant-4b">4</span>
            </div>
            <div className="shivam-stack-error404-giant-shadow" />
          </div>

          {/* Status badge */}
          <div className="shivam-stack-error404-status-badge">
            <span className="shivam-stack-error404-status-dot" />
            <span>HTTP 404 — Resource Not Found</span>
          </div>

          {/* Glitch title */}
          <h1
            className={`shivam-stack-error404-title ${glitchActive ? 'shivam-stack-error404-title-glitch' : ''}`}
            data-text={glitchedTitle}
          >
            {glitchedTitle}
          </h1>

          <p className="shivam-stack-error404-subtitle">
            The page you're hunting for has gone rogue. It might have been deleted, renamed, or never existed in the first place. Let's get you back on track.
          </p>

          {/* CTA Buttons */}
          <div className="shivam-stack-error404-cta-row">
            <Link to="/" className="shivam-stack-error404-btn-primary">
              <Home size={16} /> Back to Home
            </Link>
            <button
              className="shivam-stack-error404-btn-ghost"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} /> Previous Page
            </button>
            <button
              className="shivam-stack-error404-btn-ghost"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>

          {/* Search */}
          <form className="shivam-stack-error404-search-form" onSubmit={handleSearch}>
            <div className="shivam-stack-error404-search-wrap">
              <Search size={16} className="shivam-stack-error404-search-icon" />
              <input
                className="shivam-stack-error404-search-input"
                type="text"
                placeholder="Search for something on this site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search site"
              />
              <button
                type="submit"
                className="shivam-stack-error404-search-btn"
                aria-label="Search"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>

        {/* ── Two Columns: Terminal + Quick Links ──────── */}
        <div className="shivam-stack-error404-lower">

          {/* Terminal Block */}
          <div className="shivam-stack-error404-terminal">
            <div className="shivam-stack-error404-terminal-bar">
              <span className="shivam-stack-error404-terminal-dot shivam-stack-error404-terminal-dot-red" />
              <span className="shivam-stack-error404-terminal-dot shivam-stack-error404-terminal-dot-yellow" />
              <span className="shivam-stack-error404-terminal-dot shivam-stack-error404-terminal-dot-green" />
              <span className="shivam-stack-error404-terminal-title">
                <Terminal size={12} /> error.log
              </span>
            </div>
            <div className="shivam-stack-error404-terminal-body">
              {terminalLines.map((line, i) => (
                <div
                  key={i}
                  className={`shivam-stack-error404-terminal-line ${line.isError ? 'shivam-stack-error404-terminal-error' : ''} ${line.isAccent ? 'shivam-stack-error404-terminal-accent' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {line.text}
                </div>
              ))}
              <span className="shivam-stack-error404-terminal-cursor" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="shivam-stack-error404-quicklinks">
            <div className="shivam-stack-error404-quicklinks-header">
              <Compass size={16} />
              <span>Maybe you were looking for…</span>
            </div>
            <div className="shivam-stack-error404-quicklinks-grid">
              {QUICK_LINKS.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="shivam-stack-error404-quicklink-item"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="shivam-stack-error404-quicklink-icon">{link.icon}</span>
                  <span className="shivam-stack-error404-quicklink-label">{link.label}</span>
                  <ArrowRight size={13} className="shivam-stack-error404-quicklink-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Developer Easter Egg ─────────────────── */}
        <div className="shivam-stack-error404-dev-note">
          <Code2 size={14} />
          <span>Developer? Check the console. Or just </span>
          <Link to="/" className="shivam-stack-error404-dev-link">head home</Link>
          <span> and start fresh.</span>
        </div>

      </div>
    </div>
  );
};

export default Error404;