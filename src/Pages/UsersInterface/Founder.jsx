import React, { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import {
  ArrowRightOutlined, TrophyOutlined, SafetyCertificateOutlined,
  MailOutlined, UserOutlined, StarOutlined, CheckCircleOutlined,
  ShopOutlined, EnvironmentOutlined, PhoneOutlined,
} from '@ant-design/icons';
import { request } from '../../util/request_fixed';
import Config from '../../util/config';

if (typeof document !== 'undefined' && !document.getElementById('sl-founder-css')) {
  const el = document.createElement('style');
  el.id = 'sl-founder-css';
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');

:root {
  --sl-bg:      #ffffff;
  --sl-surface: #f8f8f8;
  --sl-card:    #f2f2f2;
  --sl-card2:   #ebebeb;
  --sl-border:  rgba(0,0,0,0.08);
  --sl-border2: rgba(0,0,0,0.16);
  --sl-muted:   rgba(0,0,0,0.45);
  --sl-black:   #0a0a0a;
  --sl-black2:  #1a1a1a;
  --sl-text:    #111111;
}

.sl-root {
  font-family: 'Space Grotesk', sans-serif;
  background: var(--sl-bg);
  color: var(--sl-text);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--sl-border);
  box-shadow: 0 2px 24px rgba(0,0,0,0.07);
}
.sl-root * { box-sizing: border-box; }

/* ══ TWO-COLUMN ══ */
.sl-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 520px;
  border-bottom: 1px solid var(--sl-border);
}

/* ── LEFT PANEL ── */
.sl-left {
  background: var(--sl-surface);
  border-right: 1px solid var(--sl-border);
  padding: 36px 28px;
  display: flex; flex-direction: column; gap: 0;
  position: relative; overflow: hidden;
}
.sl-left::before {
  content: '';
  position: absolute; bottom: -80px; left: -60px;
  width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%);
  pointer-events: none;
}

/* avatar */
.sl-av-wrap { position: relative; width: 72px; height: 72px; margin-bottom: 18px; }
.sl-av {
  width: 72px; height: 72px; border-radius: 18px;
  background: var(--sl-black);
  border: 2px solid var(--sl-black);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; color: #fff;
  position: relative; z-index: 1;
}
.sl-av-ring {
  position: absolute; inset: -5px; border-radius: 22px;
  border: 1px solid rgba(0,0,0,0.1); pointer-events: none;
}
.sl-av-dot {
  position: absolute; bottom: -3px; right: -3px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #22c55e; border: 2px solid var(--sl-surface); z-index: 2;
}

.sl-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px; letter-spacing: 1.5px; color: var(--sl-black);
  line-height: 1; margin-bottom: 3px;
}
.sl-sub {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 15px; letter-spacing: 2px; color: rgba(0,0,0,0.4);
  display: block; margin-bottom: 14px;
}

.sl-verified {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--sl-black); color: #fff;
  border-radius: 4px; padding: 4px 10px; margin-bottom: 18px;
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 1.5px; text-transform: uppercase;
}

.sl-gline {
  height: 1px;
  background: linear-gradient(90deg, var(--sl-black2), transparent);
  opacity: 0.15; margin-bottom: 20px;
}

/* info */
.sl-info { display: flex; flex-direction: column; gap: 12px; margin-bottom: 22px; }
.sl-irow { display: flex; align-items: flex-start; gap: 10px; }
.sl-iico {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  background: var(--sl-card); border: 1px solid var(--sl-border);
  display: flex; align-items: center; justify-content: center;
  color: var(--sl-black); font-size: 12px; margin-top: 1px;
}
.sl-ilabel {
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(0,0,0,0.3); margin-bottom: 2px;
}
.sl-ival { font-size: 12px; color: var(--sl-black2); font-weight: 500; }

/* pills */
.sl-pills { display: flex; flex-direction: column; gap: 7px; margin-bottom: 24px; }
.sl-pill {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; border: 1px solid var(--sl-border);
  border-radius: 9px; padding: 10px 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.sl-pill:hover { border-color: var(--sl-border2); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.sl-pill-l { display: flex; align-items: center; gap: 8px; }
.sl-pill-ico {
  width: 26px; height: 26px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; flex-shrink: 0;
}
.sl-pill-label { font-size: 11px; color: var(--sl-muted); }
.sl-pill-val { font-size: 11px; font-weight: 700; color: var(--sl-black); font-family: 'DM Mono', monospace; }

/* CTA */
.sl-ctabtn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; background: var(--sl-black); color: #fff;
  border: none; border-radius: 9px; padding: 12px 18px; cursor: pointer;
  font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700;
  transition: all 0.2s; margin-top: auto;
}
.sl-ctabtn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,0.2); }

/* ── RIGHT PANEL ── */
.sl-right { background: var(--sl-bg); display: flex; flex-direction: column; overflow: hidden; }

.sl-rtop {
  padding: 36px 40px 28px; border-bottom: 1px solid var(--sl-border);
  flex-shrink: 0; position: relative; overflow: hidden;
}
.sl-rglow {
  position: absolute; top: -100px; right: -60px;
  width: 340px; height: 340px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%);
  pointer-events: none;
}
/* subtle grid pattern */
.sl-rtop::before {
  content: '';
  position: absolute; top: 0; right: 0; bottom: 0; left: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}
.sl-rinner { position: relative; z-index: 1; }

.sl-ticker {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(0,0,0,0.04); border: 1px solid var(--sl-border);
  border-radius: 100px; padding: 5px 12px; margin-bottom: 16px;
  font-family: 'DM Mono', monospace; font-size: 9px;
  color: rgba(0,0,0,0.35); letter-spacing: 1px; text-transform: uppercase;
}
.sl-live { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: sl-pulse 2s infinite; }
@keyframes sl-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.5);} }

.sl-rtitle {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(36px, 4vw, 58px); line-height: 0.9;
  letter-spacing: 1px; color: var(--sl-black); margin: 0 0 5px;
}
.sl-rtitle span { color: rgba(0,0,0,0.3); }
.sl-rdesc {
  font-size: 13px; line-height: 1.9; color: var(--sl-muted);
  margin-top: 14px; max-width: 440px; font-weight: 400;
}

/* rule */
.sl-rule { display: flex; align-items: center; gap: 10px; margin: 16px 0 0; }
.sl-rline { height: 1.5px; width: 32px; background: var(--sl-black); opacity: 0.2; }
.sl-rdiamond { width: 5px; height: 5px; background: var(--sl-black); transform: rotate(45deg); opacity: 0.5; }

/* nums */
.sl-nums { display: flex; border-bottom: 1px solid var(--sl-border); flex-shrink: 0; background: var(--sl-surface); }
.sl-num {
  flex: 1; padding: 16px 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-right: 1px solid var(--sl-border); gap: 3px;
}
.sl-num:last-child { border-right: none; }
.sl-nval {
  font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 1px;
  color: var(--sl-black);
}
.sl-nlabel {
  font-family: 'DM Mono', monospace; font-size: 7px; font-weight: 600;
  letter-spacing: 1.8px; text-transform: uppercase; color: rgba(0,0,0,0.3);
}

/* strip */
.sl-shdr {
  padding: 14px 40px 10px; display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.sl-slbl {
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 2.5px; text-transform: uppercase; color: rgba(0,0,0,0.3);
  display: flex; align-items: center; gap: 8px;
}
.sl-slbl::before { content: ''; display: inline-block; width: 14px; height: 1.5px; background: var(--sl-black); opacity: 0.3; }
.sl-scnt { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(0,0,0,0.2); }

.sl-swrap {
  overflow: hidden; padding: 8px 0 28px; flex: 1;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
}
.sl-strack { display: flex; flex-wrap: nowrap; align-items: center; gap: 10px; padding: 0 28px; will-change: transform; }

.sl-photo {
  flex-shrink: 0; border-radius: 10px; overflow: hidden;
  border: 1px solid var(--sl-border); position: relative; background: var(--sl-card);
  transition: border-color 0.3s, transform 0.35s, box-shadow 0.3s;
}
.sl-photo:hover { border-color: var(--sl-border2); transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
.sl-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
.sl-photo:hover img { transform: scale(1.07); }
.sl-photo-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%);
  opacity: 0; transition: opacity 0.3s;
}
.sl-photo:hover .sl-photo-overlay { opacity: 1; }
.sl-photo-num {
  position: absolute; bottom: 7px; left: 9px;
  font-family: 'DM Mono', monospace; font-size: 9px;
  color: rgba(255,255,255,0.8); letter-spacing: 1px;
  opacity: 0; transition: opacity 0.3s;
}
.sl-photo:hover .sl-photo-num { opacity: 1; }
.sl-photo.sz-sm { width: 160px; height: 160px; }
.sl-photo.sz-md { width: 190px; height: 240px; }
.sl-photo.sz-lg { width: 230px; height: 165px; }

/* ── ANIMATIONS ── */
@keyframes sl-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.sl-a1 { animation: sl-up 0.5s ease 0.05s both; }
.sl-a2 { animation: sl-up 0.5s ease 0.15s both; }
.sl-a3 { animation: sl-up 0.5s ease 0.28s both; }
.sl-a4 { animation: sl-up 0.5s ease 0.4s both; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .sl-layout { grid-template-columns: 1fr; }
  .sl-left { border-right: none; border-bottom: 1px solid var(--sl-border); padding: 28px 20px; }
  .sl-pills { flex-direction: row; flex-wrap: wrap; }
  .sl-pill { min-width: 130px; }
  .sl-ctabtn { width: auto; }
}
@media (max-width: 600px) {
  .sl-rtop { padding: 24px 16px 20px; }
  .sl-shdr { padding: 12px 16px 8px; }
  .sl-strack { padding: 0 14px; }
  .sl-photo.sz-sm { width: 130px; height: 130px; }
  .sl-photo.sz-md { width: 150px; height: 190px; }
  .sl-photo.sz-lg { width: 180px; height: 130px; }
  .sl-nums { flex-wrap: wrap; }
  .sl-num { min-width: 50%; }
}
`;
  document.head.appendChild(el);
}

const SIZES = ['sz-sm', 'sz-md', 'sz-lg', 'sz-md', 'sz-sm', 'sz-lg'];

const Founder = () => {
  const [loading, setLoading]             = useState(true);
  const [founderImages, setFounderImages] = useState([]);
  const [maxOffset, setMaxOffset]         = useState(0);
  const [paused, setPaused]               = useState(false);

  const trackRef   = useRef(null);
  const wrapperRef = useRef(null);
  const animRef    = useRef(null);
  const posRef     = useRef(0);
  const dirRef     = useRef(-1);
  const SPEED      = 0.85;

  useEffect(() => {
    (async () => {
      try {
        const res = await request('founderimage', 'get');
        if (res?.founderImageList)
          setFounderImages(res.founderImageList.filter(i => i.image).map(i => i.image));
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!trackRef.current || !wrapperRef.current || !founderImages.length) return;
    const t = setTimeout(() => {
      const offset = Math.max(0, trackRef.current.scrollWidth - wrapperRef.current.offsetWidth);
      setMaxOffset(offset); posRef.current = 0; dirRef.current = -1;
    }, 100);
    return () => clearTimeout(t);
  }, [founderImages, loading]);

  useEffect(() => {
    if (!maxOffset) return;
    const tick = () => {
      if (!paused) {
        posRef.current += dirRef.current * SPEED;
        if (posRef.current <= -maxOffset) { posRef.current = -maxOffset; dirRef.current = 1; }
        else if (posRef.current >= 0)     { posRef.current = 0;          dirRef.current = -1; }
        if (trackRef.current) trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [maxOffset, paused]);

  if (loading) return (
    <div style={{ minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f2f2f2', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontSize: 20 }}>
        <UserOutlined />
      </div>
      <Spin size="large" />
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>Loading...</span>
    </div>
  );

  return (
    <div className="sl-root">
      <div className="sl-layout">

        {/* ── LEFT ── */}
        <div className="sl-left sl-a1">
          <div className="sl-av-wrap">
            <div className="sl-av"><UserOutlined /></div>
            <div className="sl-av-ring" />
            <div className="sl-av-dot" />
          </div>

          <div className="sl-name">SHEERLONG</div>
          <span className="sl-sub">SHOP</span>

          <div className="sl-verified"><CheckCircleOutlined style={{ fontSize: 8 }} /> Verified Seller</div>
          <div className="sl-gline" />

          <div className="sl-info">
            {[
              { icon: <EnvironmentOutlined />, label: 'Location',    val: 'Phnom Penh, Cambodia' },
              { icon: <ShopOutlined />,        label: 'Established', val: 'Since 2020' },
              { icon: <PhoneOutlined />,       label: 'Contact',     val: '@Sealong_LEE (Telegram)' },
            ].map(({ icon, label, val }) => (
              <div key={label} className="sl-irow">
                <div className="sl-iico">{icon}</div>
                <div>
                  <div className="sl-ilabel">{label}</div>
                  <div className="sl-ival">{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sl-pills">
            {[
              { icon: <TrophyOutlined />,           bg: 'rgba(251,191,36,0.12)', color: '#d97706', label: 'Status',     val: 'Certified' },
              { icon: <SafetyCertificateOutlined />, bg: 'rgba(52,211,153,0.12)', color: '#059669', label: 'Reputation', val: 'Trusted'   },
              { icon: <StarOutlined />,              bg: 'rgba(0,0,0,0.06)',      color: '#0a0a0a', label: 'Rating',     val: '5.0 / 5'   },
            ].map(({ icon, bg, color, label, val }) => (
              <div key={label} className="sl-pill">
                <div className="sl-pill-l">
                  <div className="sl-pill-ico" style={{ background: bg, color }}>{icon}</div>
                  <span className="sl-pill-label">{label}</span>
                </div>
                <span className="sl-pill-val">{val}</span>
              </div>
            ))}
          </div>

          <button className="sl-ctabtn">
            <MailOutlined style={{ fontSize: 13 }} />
            Contact Founder
            <ArrowRightOutlined style={{ fontSize: 10 }} />
          </button>
        </div>

        {/* ── RIGHT ── */}
        <div className="sl-right">
          <div className="sl-rtop sl-a2">
            <div className="sl-rglow" />
            <div className="sl-rinner">
              <div className="sl-ticker">
                <span className="sl-live" />
                Est. 2020 · Electronics &amp; Lifestyle · Phnom Penh
              </div>
              <h2 className="sl-rtitle">FOUNDER <span>&amp; VISION</span></h2>
              <p className="sl-rdesc">
                Founded with a passion for excellence, Sheerlong Shop bridges the gap
                between high-end technology and everyday lifestyle — delivering premium
                quality and unwavering trust to every customer, every single time.
              </p>
              <div className="sl-rule">
                <div className="sl-rline" /><div className="sl-rdiamond" /><div className="sl-rline" />
              </div>
            </div>
          </div>

          <div className="sl-nums sl-a3">
            {[
              { val: '5+',   label: 'Years Active'    },
              { val: '500+', label: 'Orders Delivered' },
              { val: '100%', label: 'Satisfaction'     },
              { val: '24H',  label: 'Support'          },
            ].map(({ val, label }) => (
              <div key={label} className="sl-num">
                <span className="sl-nval">{val}</span>
                <span className="sl-nlabel">{label}</span>
              </div>
            ))}
          </div>

          <div className="sl-shdr sl-a4">
            <span className="sl-slbl">Our Journey</span>
            <span className="sl-scnt">{founderImages.length > 0 ? `${founderImages.length} moments` : ''}</span>
          </div>

          {founderImages.length > 0 ? (
            <div ref={wrapperRef} className="sl-swrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <div ref={trackRef} className="sl-strack">
                {founderImages.map((imgName, i) => (
                  <div key={i} className={`sl-photo ${SIZES[i % SIZES.length]}`}>
                    <img
                      src={Config.getImage(
                        imgName.startsWith('http') || imgName.includes('founderimages/')
                          ? imgName
                          : 'founderimages/' + imgName
                      )}
                      alt={`Moment ${i + 1}`}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/230x165/f2f2f2/aaa?text=Photo'; }}
                    />
                    <div className="sl-photo-overlay" />
                    <div className="sl-photo-num">0{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.2)', fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              No images yet
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Founder;
