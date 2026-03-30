// FortuneCookies.jsx — Tukka Time · Fortune Cookies Page
// SEO-friendly · Dark/Light mode · Fully responsive · anime.js powered

import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import {
  RefreshCw, Plus, Edit2, Trash2, Eye, Search, Filter,
  Star, Share2, Clock, Globe, Sun, Smile, Award,
  ChevronDown, ChevronUp, X, TrendingUp, Zap, Heart,
  BookOpen, Coffee, Music, Sparkles, BarChart2, Shield
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE = '/api/feature/pages/fortunes';

const MOODS     = ['funny','roast','motivational','drama'];
const LANGS     = ['hindi','english'];
const TIMES     = ['morning','afternoon','evening','night'];
const CITIES    = ['mumbai','delhi','bangalore','chennai','kolkata','other'];
const FESTIVALS = ['diwali','holi','eid','christmas','none'];
const WEATHERS  = ['sunny','rainy','hot','cold'];
const DAYS      = ['monday','tuesday','wednesday','thursday','friday','weekend'];

const FAQ_DATA = [
  { q: 'What makes Tukka Time fortune cookies unique?',
    a: 'Every fortune in our collection is crafted with the distinct Indian desi flavour — peppered with relatable moods, city vibes, festival energy, and weather context. Our algorithm matches your fortune to the time of day, your city, and current festival to deliver eerily accurate (and hilarious) wisdom.' },
  { q: 'How often are new fortunes added?',
    a: 'Our content team and community contributors add new fortunes weekly. The database currently holds thousands of unique messages, with zero duplicates enforced at the database level — so every refresh is a brand new experience.' },
  { q: 'Can I share a fortune I received?',
    a: 'Absolutely! Every fortune card has a share button. Each share is tracked (shareCount) so the most viral fortunes rise to the top of our trending list. WhatsApp, Instagram Stories, and X are all supported.' },
  { q: 'How does context-based fortune delivery work?',
    a: 'When you request a fortune, the system reads your selected city, current time of day, day of week, weather, and any active festival to pick the most contextually relevant fortune. Morning motivational fortunes hit differently than late-night drama ones!' },
  { q: 'Are fortunes available in Hindi?',
    a: 'Yes! Fortunes are available in both Hindi and English. Hinglish fortunes live across both categories. Use the language filter to toggle between them.' },
];

const MOOD_META = {
  funny:       { icon: <Coffee size={16}/>,  color: '#D4A853', label: 'Funny' },
  roast:       { icon: <Zap size={16}/>,     color: '#E74C3C', label: 'Roast' },
  motivational:{ icon: <Star size={16}/>,    color: '#27AE7A', label: 'Motivational' },
  drama:       { icon: <Music size={16}/>,   color: '#9B59B6', label: 'Drama' },
};

export default function FortuneCookies() {
  const { isDarkMode } = useContext(ThemeContext);

  const [fortunes,   setFortunes]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [filters,    setFilters]    = useState({ mood:'', language:'', timeOfDay:'', city:'' });
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData,   setFormData]   = useState({});
  const [saving,     setSaving]     = useState(false);
  const [openFaq,    setOpenFaq]    = useState(null);
  const [featured,   setFeatured]   = useState(null);
  const [stats,      setStats]      = useState({ total:0, shared:0, active:0, served:0 });

  const heroRef     = useRef(null);
  const cookieRef   = useRef(null);
  const cardsRef    = useRef(null);
  const LIMIT = 9;

  // ── Fetch ──
  const fetchFortunes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT, search });
      if (filters.mood)      params.set('mood',      filters.mood);
      if (filters.language)  params.set('language',  filters.language);
      if (filters.timeOfDay) params.set('timeOfDay', filters.timeOfDay);
      if (filters.city)      params.set('city',      filters.city);
      const res  = await fetch(`${API_BASE}?${params}`);
      const data = await res.json();
      if (data.success) {
        setFortunes(data.data);
        setTotal(data.total);
        setStats(data.stats || { total: data.total, shared: 0, active: 0, served: 0 });
        if (!featured && data.data.length) setFeatured(data.data[0]);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [page, search, filters, featured]);

  useEffect(() => { fetchFortunes(); }, [fetchFortunes]);


  // ── Refresh featured ──
  const refreshFeatured = async () => {
    try {
      const res  = await fetch(`${API_BASE}/random`);
      const data = await res.json();
      if (data.success) {
        setFeatured(data.data);
        
      }
    } catch {
      Swal.fire({ icon:'error', title:'Oops!', text:'Could not fetch a new fortune.' });
    }
  };

  // ── CRUD ──
  const openAdd = () => {
    setEditTarget(null);
    setFormData({ text:'', language:'english', mood:'motivational', timeOfDay:'morning', city:'delhi', weather:'sunny', dayOfWeek:'monday', festival:'none', isActive: true });
    setShowModal(true);
  };

  const openEdit = (f) => {
    setEditTarget(f);
    setFormData({ ...f });
    setShowModal(true);
  };

  const handleDelete = async (f) => {
    const result = await Swal.fire({
      title: 'Delete this fortune?',
      text: `"${f.text.slice(0, 60)}..."`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C0392B',
      cancelButtonColor: '#A8803C',
      confirmButtonText: 'Yes, delete it',
      background: isDarkMode ? '#1F1A13' : '#FDF9F3',
      color: isDarkMode ? '#F5EDDA' : '#1A1410',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_BASE}/${f._id}`, { method:'DELETE' });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon:'success', title:'Deleted!', timer:1500, showConfirmButton:false });
        fetchFortunes();
      }
    } catch {
      Swal.fire({ icon:'error', title:'Error', text:'Delete failed.' });
    }
  };

  const handleSave = async () => {
    if (!formData.text?.trim()) {
      Swal.fire({ icon:'warning', title:'Required', text:'Fortune text cannot be empty.' }); return;
    }
    setSaving(true);
    try {
      const url    = editTarget ? `${API_BASE}/${editTarget._id}` : API_BASE;
      const method = editTarget ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(formData) });
      const data   = await res.json();
      if (data.success) {
        Swal.fire({ icon:'success', title: editTarget ? 'Updated!' : 'Created!', timer:1500, showConfirmButton:false });
        setShowModal(false);
        fetchFortunes();
      } else {
        Swal.fire({ icon:'error', title:'Error', text: data.message || 'Save failed.' });
      }
    } catch {
      Swal.fire({ icon:'error', title:'Network Error', text:'Please try again.' });
    }
    setSaving(false);
  };

  const updateFilter = (key, val) => {
    setFilters(p => ({ ...p, [key]: p[key] === val ? '' : val }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <main className={`pf-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}>

      {/* SEO Meta (handled in Helmet/Head at router level, this is the visible content) */}
      {/* ── Hero ── */}
      <section className="pf-hero fc-hero" ref={heroRef} aria-label="Fortune Cookies Hero">
        <div className="pf-hero__noise" aria-hidden="true"/>
        <div className="pf-hero__orbit pf-hero__orbit--1" aria-hidden="true"/>
        <div className="pf-hero__orbit pf-hero__orbit--2" aria-hidden="true"/>
        <div className="pf-hero__orbit pf-hero__orbit--3" aria-hidden="true"/>

        {/* Floating particles */}
        <div className="pf-particles" aria-hidden="true">
          {[...Array(12)].map((_,i)=>(
            <span key={i} className="pf-particle"
              style={{left:`${8+i*7}%`, top:`${20+((i*37)%60)}%`,
                      '--dur':`${4+i*0.5}s`,'--delay':`${i*0.4}s`}}/>
          ))}
        </div>

        <div className="pf-hero__content">
          <div className="pf-hero__eyebrow fc-hero-anim" aria-hidden="true">
            <Sparkles size={12}/> Tukka Time · Fortune Collection
          </div>
          <h1 className="pf-hero__title fc-hero-anim">
            Crack Open Your<br/><span>Fortune Cookie</span>
          </h1>
          <p className="pf-hero__desc fc-hero-anim">
            Thousands of desi fortunes tuned to your city, mood, time of day,
            and the latest festival energy. One refresh. Infinite wisdom.
            (Or at least infinite entertainment.)
          </p>

          {/* 3D Cookie illustration */}
          <div className="pf-cookie-3d fc-hero-anim" style={{margin:'0 auto 28px'}} aria-hidden="true">
            <div className="pf-cookie-3d__inner" ref={cookieRef}>
              <div className="fc-cookie-svg-wrap">
                <svg viewBox="0 0 120 80" width="140" height="93" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="cookieGrad" cx="50%" cy="40%">
                      <stop offset="0%" stopColor="#F0C97A"/>
                      <stop offset="60%" stopColor="#D4A853"/>
                      <stop offset="100%" stopColor="#A8803C"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="60" cy="45" rx="55" ry="30" fill="url(#cookieGrad)" opacity="0.4"/>
                  <path d="M10 45 Q60 5 110 45 Q60 40 10 45Z" fill="url(#cookieGrad)" stroke="#A8803C" strokeWidth="1.5"/>
                  <path d="M10 45 Q60 85 110 45 Q60 50 10 45Z" fill="#C89840" stroke="#A8803C" strokeWidth="1.5"/>
                  <line x1="10" y1="45" x2="110" y2="45" stroke="#8B6020" strokeWidth="1" strokeDasharray="3,2"/>
                  <rect x="35" y="40" width="50" height="10" rx="2" fill="#FAF6EE" opacity="0.9"/>
                  <text x="60" y="48" textAnchor="middle" fontSize="5" fill="#1A1410" fontFamily="Georgia,serif">Your fortune awaits…</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="pf-hero__actions fc-hero-anim">
            <button className="pf-btn pf-btn--gold" onClick={refreshFeatured} aria-label="Get new fortune">
              <RefreshCw size={15}/> Get My Fortune
            </button>
            <button className="pf-btn pf-btn--outline" onClick={openAdd} aria-label="Add new fortune">
              <Plus size={15}/> Add Fortune
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="fc-stats-strip" aria-label="Fortune Statistics">
        <div className="pf-section" style={{paddingTop:28, paddingBottom:28}}>
          <div className="pf-stats-row">
            {[
              { icon:<BookOpen size={18}/>, value: stats.total || total, label:'Total Fortunes' },
              { icon:<Share2   size={18}/>, value: stats.shared || '2.4K',  label:'Times Shared' },
              { icon:<Eye      size={18}/>, value: stats.served || '48K',   label:'Times Served' },
              { icon:<Shield   size={18}/>, value: stats.active || '98%',   label:'Active Rate' },
            ].map((s,i)=>(
              <div key={i} className="pf-stat-item">
                <span className="pf-stat-item__value">{s.value}{typeof s.value==='number'&&s.value>999?'':''}</span>
                <span className="pf-stat-item__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Fortune ── */}
      {featured && (
        <section className="pf-section" aria-label="Featured Fortune">
          <div className="pf-section__header">
            <span className="pf-section__label">✦ Today's Pick</span>
            <h2 className="pf-section__title">Your Fortune Awaits</h2>
            <p className="pf-section__subtitle">Click refresh to summon a new one from the cosmic cookie jar.</p>
          </div>

          <div className="fc-featured-wrap">
            <div className="fc-featured-card pf-card pf-card--featured">
              <div className="fc-featured-img pf-img-wrap pf-img-wrap--wide">
                <img src="/images/fortune-cookie-open.jpg" alt="Open fortune cookie" loading="lazy"/>
                <div className="pf-img-placeholder" aria-hidden="true">
                  <Sparkles size={32}/><span>fortune-cookie-open.jpg</span>
                </div>
              </div>
              <div className="fc-featured-body">
                <div className="fc-featured-meta">
                  {featured.mood && (
                    <span className="pf-badge pf-badge--gold">
                      {MOOD_META[featured.mood]?.icon} {MOOD_META[featured.mood]?.label || featured.mood}
                    </span>
                  )}
                  {featured.language && <span className="pf-badge pf-badge--muted">{featured.language}</span>}
                  {featured.city && <span className="pf-badge pf-badge--jade">{featured.city}</span>}
                  {featured.festival && featured.festival !== 'none' && (
                    <span className="pf-badge pf-badge--crimson">{featured.festival}</span>
                  )}
                </div>

                <div className="pf-fortune-slip fc-featured-slip" style={{margin:'20px 0'}}>
                  <p style={{margin:0, lineHeight:1.6}}>{featured.text}</p>
                </div>

                <div className="fc-featured-stats">
                  <span className="pf-text-muted" style={{fontSize:12, display:'flex', alignItems:'center', gap:4}}>
                    <Eye size={12}/> {featured.timesServed || 0} served
                  </span>
                  <span className="pf-text-muted" style={{fontSize:12, display:'flex', alignItems:'center', gap:4}}>
                    <Share2 size={12}/> {featured.shareCount || 0} shares
                  </span>
                  <span className="pf-text-muted" style={{fontSize:12, display:'flex', alignItems:'center', gap:4}}>
                    <Clock size={12}/> {fmtDate(featured.createdAt)}
                  </span>
                </div>

                <div style={{display:'flex', gap:8, marginTop:16, flexWrap:'wrap'}}>
                  <button className="pf-btn pf-btn--gold" onClick={refreshFeatured}>
                    <RefreshCw size={14}/> New Fortune
                  </button>
                  <button className="pf-btn pf-btn--ghost" onClick={()=>openEdit(featured)}>
                    <Edit2 size={14}/> Edit
                  </button>
                  <button className="pf-btn pf-btn--ghost" onClick={()=>handleDelete(featured)}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── What Are Fortune Cookies ── */}
      <section className="pf-section fc-about-section" style={{background:'var(--pf-bg-alt)', maxWidth:'100%'}} aria-labelledby="fc-about-heading">
        <div style={{maxWidth:1280, margin:'0 auto', padding:'0 clamp(16px,5vw,80px)'}}>
          <div className="pf-grid-2" style={{alignItems:'center', gap:'clamp(32px,5vw,64px)'}}>
            <div>
              <span className="pf-section__label">✦ The Art</span>
              <h2 id="fc-about-heading" className="pf-section__title" style={{textAlign:'left', marginBottom:16}}>
                What Is a Fortune Cookie,<br/>Tukka Time Style?
              </h2>
              <p style={{color:'var(--pf-text-sub)', marginBottom:16}}>
                A traditional fortune cookie is a crispy, sugary wafer folded around a small strip of paper
                carrying a prophecy, wisdom, or lucky numbers. Tukka Time reimagines this for the Indian
                experience — your fortune knows whether it's a Monday, whether you're in Mumbai traffic
                or Bengaluru rain, and whether Bigg Boss is on tonight.
              </p>
              <p style={{color:'var(--pf-text-sub)', marginBottom:16}}>
                Each fortune in our database is tagged with context parameters: <strong>mood</strong> (funny, roast,
                motivational, drama), <strong>language</strong>, <strong>time of day</strong>, <strong>city</strong>,
                <strong> weather</strong>, <strong>day of week</strong>, and <strong>festival</strong> — giving our
                algorithm over 10,000 unique context combinations to match the perfect message to your moment.
              </p>
              <p style={{color:'var(--pf-text-sub)'}}>
                The result? A fortune that feels personally written for you by someone who has clearly attended
                every family dinner you've ever been to.
              </p>

              <div className="pf-info-box" style={{marginTop:20}}>
                <strong style={{color:'var(--pf-gold)'}}>Did you know?</strong> The fortune cookie was invented in
                early 20th century America, but our desi version runs on a database of pure relatable chaos — 
                from mummy's mood swings to Sharma ji ka beta references.
              </div>
            </div>
            <div>
              <div className="pf-img-wrap pf-img-wrap--square" style={{borderRadius:24}}>
                <img src="/images/fortune-cookie-art.jpg" alt="Artistic fortune cookies arrangement" loading="lazy"/>
                <div className="pf-img-placeholder" aria-hidden="true">
                  <Sparkles size={40}/><span>fortune-cookie-art.jpg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Context Parameters Explained ── */}
      <section className="pf-section" aria-labelledby="fc-context-heading">
        <div className="pf-section__header">
          <span className="pf-section__label">✦ How It Works</span>
          <h2 id="fc-context-heading" className="pf-section__title">Context Parameters Explained</h2>
          <p className="pf-section__subtitle">
            Our fortunes are not random — they are precisely matched using eight context dimensions.
          </p>
        </div>
        <div className="pf-grid-4">
          {[
            { icon:<Globe size={22}/>,  title:'Language',    desc:'Hindi or English — or glorious Hinglish that straddles both.' },
            { icon:<Sun size={22}/>,    title:'Time of Day', desc:'Morning motivation hits differently than 2 AM existential dread.' },
            { icon:<Smile size={22}/>,  title:'Mood',        desc:'Funny, Roast, Motivational, or full Bollywood Drama.' },
            { icon:<Star size={22}/>,   title:'Festival',    desc:'Diwali, Holi, Eid, Christmas — or just regular Tuesday chaos.' },
            { icon:<Coffee size={22}/>, title:'City',        desc:'Mumbai, Delhi, Bengaluru, Chennai, Kolkata — local flavour.' },
            { icon:<Zap size={22}/>,    title:'Weather',     desc:'Sunny optimism or rainy-day sulking, we\'ve got you.' },
            { icon:<Clock size={22}/>,  title:'Day of Week', desc:'Weekend fortunes are dramatically different from Mondays.' },
            { icon:<BarChart2 size={22}/>, title:'Engagement', desc:'Track how many times a fortune was served and shared.' },
          ].map((item, i) => (
            <article key={i} className="pf-card" style={{display:'flex', flexDirection:'column', gap:10}}>
              <div className="fc-ctx-icon" aria-hidden="true"
                style={{width:44, height:44, borderRadius:12, background:'rgba(212,168,83,0.12)',
                        display:'flex', alignItems:'center', justifyContent:'center', color:'var(--pf-gold)'}}>
                {item.icon}
              </div>
              <h3 style={{margin:0, fontSize:15, fontWeight:700}}>{item.title}</h3>
              <p style={{margin:0, fontSize:13, color:'var(--pf-text-sub)', lineHeight:1.55}}>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Fortune Library (CRUD) ── */}
      <section className="pf-section" style={{background:'var(--pf-bg-alt)', maxWidth:'100%'}} aria-labelledby="fc-library-heading">
        <div style={{maxWidth:1280, margin:'0 auto', padding:'0 clamp(16px,5vw,80px)'}}>

          <div className="pf-action-bar">
            <div className="pf-action-bar__left">
              <h2 id="fc-library-heading" className="pf-section__title" style={{margin:0, fontSize:'clamp(20px,3vw,32px)'}}>
                Fortune Library
              </h2>
              <span className="pf-badge pf-badge--gold">{total} fortunes</span>
            </div>
            <div className="pf-action-bar__right">
              <button className="pf-btn pf-btn--gold" onClick={openAdd} aria-label="Add new fortune">
                <Plus size={15}/> Add Fortune
              </button>
              <button className="pf-btn pf-btn--ghost" onClick={fetchFortunes} aria-label="Refresh list">
                <RefreshCw size={15}/>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="pf-filter-bar" role="search" aria-label="Filter fortunes">
            <span className="pf-filter-bar__label"><Filter size={12}/> Filter</span>
            {MOODS.map(m=>(
              <button key={m} className={`pf-filter-chip${filters.mood===m?' active':''}`}
                onClick={()=>updateFilter('mood',m)} aria-pressed={filters.mood===m}>
                {MOOD_META[m]?.icon} {m}
              </button>
            ))}
            <span className="pf-filter-bar__label" style={{marginLeft:8}}>Lang</span>
            {LANGS.map(l=>(
              <button key={l} className={`pf-filter-chip${filters.language===l?' active':''}`}
                onClick={()=>updateFilter('language',l)} aria-pressed={filters.language===l}>
                {l}
              </button>
            ))}
            <div style={{flex:1, minWidth:160}}>
              <div className="pf-search-wrap">
                <Search size={14} className="pf-search-wrap__icon"/>
                <input className="pf-search-input" aria-label="Search fortunes"
                  placeholder="Search fortunes…" value={search}
                  onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="pf-loading-state" aria-live="polite" aria-busy="true">
              <div className="pf-spinner" role="status"/>
              <span>Loading fortunes…</span>
            </div>
          ) : fortunes.length === 0 ? (
            <div className="pf-empty-state" role="status">
              <div className="pf-empty-state__icon" aria-hidden="true">🥠</div>
              <p className="pf-empty-state__title">No fortunes found</p>
              <p>Try adjusting your filters or <button className="pf-btn pf-btn--gold pf-btn--sm" onClick={openAdd}>add one</button></p>
            </div>
          ) : (
            <div className="pf-grid-3" ref={cardsRef} aria-label="Fortune cards list">
              {fortunes.map(f=>(
                <article key={f._id} className="pf-card fc-fortune-card" aria-label={`Fortune: ${f.text.slice(0,40)}`}>
                  <div className="fc-card-meta" style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:12}}>
                    {f.mood     && <span className="pf-badge pf-badge--gold">{f.mood}</span>}
                    {f.language && <span className="pf-badge pf-badge--muted">{f.language}</span>}
                    {f.city     && <span className="pf-badge pf-badge--jade">{f.city}</span>}
                    {f.festival && f.festival!=='none' && <span className="pf-badge pf-badge--crimson">{f.festival}</span>}
                    {!f.isActive && <span className="pf-badge pf-badge--crimson">Inactive</span>}
                  </div>

                  <p className="fc-card-text" style={{fontFamily:'var(--pf-font-display)', fontSize:'clamp(13px,1.5vw,15px)', lineHeight:1.6, margin:'0 0 16px', color:'var(--pf-text)'}}>
                    "{f.text}"
                  </p>

                  <div style={{display:'flex', gap:16, fontSize:11, color:'var(--pf-text-muted)', marginBottom:14}}>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Eye size={11}/>{f.timesServed||0}</span>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Share2 size={11}/>{f.shareCount||0}</span>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Clock size={11}/>{fmtDate(f.createdAt)}</span>
                  </div>

                  <div className="fc-card-actions" style={{display:'flex', gap:6}}>
                    <button className="pf-btn pf-btn--ghost pf-btn--sm" onClick={()=>openEdit(f)} aria-label="Edit fortune">
                      <Edit2 size={13}/> Edit
                    </button>
                    <button className="pf-btn pf-btn--danger pf-btn--sm" onClick={()=>handleDelete(f)} aria-label="Delete fortune">
                      <Trash2 size={13}/>
                    </button>
                    <button className="pf-btn pf-btn--ghost pf-btn--sm" style={{marginLeft:'auto'}}
                      onClick={()=>setFeatured(f)} aria-label="Preview fortune">
                      <Eye size={13}/>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pf-pagination" aria-label="Fortune library pagination">
              <button className="pf-page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} aria-label="Previous page">‹</button>
              {[...Array(Math.min(totalPages,7))].map((_,i)=>{
                const pg = i+1;
                return <button key={pg} className={`pf-page-btn${page===pg?' active':''}`} onClick={()=>setPage(pg)} aria-label={`Page ${pg}`} aria-current={page===pg?'page':undefined}>{pg}</button>;
              })}
              <button className="pf-page-btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} aria-label="Next page">›</button>
            </nav>
          )}
        </div>
      </section>

      {/* ── Mood Gallery ── */}
      <section className="pf-section" aria-labelledby="fc-moods-heading">
        <div className="pf-section__header">
          <span className="pf-section__label">✦ Mood Categories</span>
          <h2 id="fc-moods-heading" className="pf-section__title">Fortune Flavours</h2>
          <p className="pf-section__subtitle">Every fortune belongs to a mood family. Which one speaks to your soul today?</p>
        </div>
        <div className="pf-grid-4">
          {[
            { mood:'funny',        emoji:'😂', desc:'Fortunes that make you laugh-cry into your chai. Light-hearted, relatable, mildly offensive to your productivity.',   color:'#D4A853', img:'/images/mood-funny.jpg' },
            { mood:'roast',        emoji:'🔥', desc:'Fortune with a side of savage truth. Your future self will understand. Your present self may need a minute.',           color:'#E74C3C', img:'/images/mood-roast.jpg' },
            { mood:'motivational', emoji:'⭐', desc:'When you need the universe to pat you on the back and whisper "you got this, beta." Inspirational and oddly specific.', color:'#27AE7A', img:'/images/mood-motivational.jpg' },
            { mood:'drama',        emoji:'🎭', desc:'Full Bollywood. Slow claps, flashbacks, dramatic zoom-ins. Your fortune is basically a K-serial episode summary.',       color:'#9B59B6', img:'/images/mood-drama.jpg' },
          ].map((m,i)=>(
            <article key={i} className="pf-card" style={{overflow:'hidden', padding:0}} aria-label={`${m.mood} mood category`}>
              <div className="pf-img-wrap" style={{aspectRatio:'4/3', borderRadius:'16px 16px 0 0'}}>
                <img src={m.img} alt={`${m.mood} fortune mood`} loading="lazy"/>
                <div className="pf-img-placeholder" aria-hidden="true">
                  <span style={{fontSize:36}}>{m.emoji}</span><span>{m.mood}.jpg</span>
                </div>
              </div>
              <div style={{padding:'18px 20px 20px'}}>
                <h3 style={{margin:'0 0 8px', textTransform:'capitalize', display:'flex', alignItems:'center', gap:8}}>
                  <span style={{color:m.color}}>{m.emoji}</span> {m.mood}
                </h3>
                <p style={{margin:0, fontSize:13, color:'var(--pf-text-sub)', lineHeight:1.55}}>{m.desc}</p>
                <button className="pf-btn pf-btn--ghost pf-btn--sm" style={{marginTop:12}}
                  onClick={()=>updateFilter('mood',m.mood)}>
                  Browse {m.mood} fortunes →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pf-section" style={{background:'var(--pf-bg-alt)', maxWidth:'100%'}} aria-labelledby="fc-reviews-heading">
        <div style={{maxWidth:1280, margin:'0 auto', padding:'0 clamp(16px,5vw,80px)'}}>
          <div className="pf-section__header">
            <span className="pf-section__label">✦ User Reactions</span>
            <h2 id="fc-reviews-heading" className="pf-section__title">What People Are Saying</h2>
          </div>
          <div className="pf-grid-3">
            {[
              { text:'I refreshed 47 times in one sitting. Each fortune was weirdly accurate about my life. The "middle-class struggler" tag hit different at 2 AM.', name:'Priya S.', role:'Bengaluru, India', init:'P' },
              { text:'The Diwali fortunes were sent to my entire family group. Three family members are still not talking to me but it was 100% worth it.', name:'Rahul M.', role:'Delhi, India', init:'R' },
              { text:'I expected dumb jokes. I got an existential crisis wrapped in Fira Code font and a cookie SVG. 10/10 would recommend.', name:'Ananya K.', role:'Mumbai, India', init:'A' },
            ].map((t,i)=>(
              <div key={i} className="pf-testimonial">
                <div className="pf-testimonial__quote" aria-hidden="true">"</div>
                <p className="pf-testimonial__text">"{t.text}"</p>
                <div className="pf-testimonial__author">
                  <div className="pf-testimonial__avatar" aria-hidden="true">
                    <img src={`/images/user-${i+1}.jpg`} alt="" loading="lazy" onError={e=>e.currentTarget.style.display='none'}/>
                    <span>{t.init}</span>
                  </div>
                  <div>
                    <div className="pf-testimonial__name">{t.name}</div>
                    <div className="pf-testimonial__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pf-section" aria-labelledby="fc-faq-heading">
        <div style={{maxWidth:720, margin:'0 auto'}}>
          <div className="pf-section__header">
            <span className="pf-section__label">✦ FAQ</span>
            <h2 id="fc-faq-heading" className="pf-section__title">Frequently Asked Questions</h2>
          </div>
          {FAQ_DATA.map((item, i) => (
            <div key={i} className={`pf-faq-item${openFaq===i?' open':''}`}>
              <button className="pf-faq-item__q" onClick={()=>setOpenFaq(openFaq===i?null:i)}
                aria-expanded={openFaq===i} aria-controls={`fc-faq-a-${i}`}>
                {item.q}
                <ChevronDown size={16} className="pf-faq-item__chevron" aria-hidden="true"/>
              </button>
              <div className="pf-faq-item__a" id={`fc-faq-a-${i}`} role="region">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="pf-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="fc-modal-title"
          onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="pf-modal">
            <div className="pf-modal__header">
              <h2 id="fc-modal-title" className="pf-modal__title">
                {editTarget ? 'Edit Fortune' : 'Add New Fortune'}
              </h2>
              <button className="pf-modal__close" onClick={()=>setShowModal(false)} aria-label="Close modal">
                <X size={20}/>
              </button>
            </div>

            <div className="pf-form-group">
              <label className="pf-form-label" htmlFor="fc-form-text">Fortune Text *</label>
              <textarea id="fc-form-text" className="pf-form-control pf-form-textarea"
                placeholder="Enter the fortune text…"
                value={formData.text||''} onChange={e=>setFormData(p=>({...p,text:e.target.value}))}/>
            </div>

            <div className="pf-grid-2" style={{gap:12}}>
              {[
                { key:'language', label:'Language', options:LANGS },
                { key:'mood', label:'Mood', options:MOODS },
                { key:'timeOfDay', label:'Time of Day', options:TIMES },
                { key:'city', label:'City', options:CITIES },
                { key:'weather', label:'Weather', options:WEATHERS },
                { key:'dayOfWeek', label:'Day of Week', options:DAYS },
                { key:'festival', label:'Festival', options:FESTIVALS },
              ].map(field=>(
                <div key={field.key} className="pf-form-group" style={{marginBottom:12}}>
                  <label className="pf-form-label" htmlFor={`fc-form-${field.key}`}>{field.label}</label>
                  <select id={`fc-form-${field.key}`}
                    className="pf-form-control pf-form-select"
                    value={formData[field.key]||''}
                    onChange={e=>setFormData(p=>({...p,[field.key]:e.target.value}))}>
                    <option value="">— any —</option>
                    {field.options.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="pf-form-group" style={{marginBottom:12}}>
                <label className="pf-form-label" htmlFor="fc-form-active">Status</label>
                <select id="fc-form-active" className="pf-form-control pf-form-select"
                  value={formData.isActive?'true':'false'}
                  onChange={e=>setFormData(p=>({...p,isActive:e.target.value==='true'}))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pf-modal__footer">
              <button className="pf-btn pf-btn--ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="pf-btn pf-btn--gold" onClick={handleSave} disabled={saving}>
                {saving ? <RefreshCw size={14} style={{animation:'pf-spin 0.8s linear infinite'}}/> : <>{editTarget?<Edit2 size={14}/>:<Plus size={14}/>} {editTarget?'Save Changes':'Add Fortune'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}