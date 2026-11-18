import React, { useState, useEffect, useRef } from 'react';
import Config from '../../util/config';

/* ─────────────────────────────────────────────────────────────────
   HOW TO ADD YOUR VIDEOS:
   1. Download your TikTok videos (use snaptik.app or similar)
   2. Rename them: video1.mp4, video2.mp4, etc.
   3. Put them in your Laravel: storage/app/public/videos/
      OR React: public/videos/
   4. Update the `src` field below with the correct path
   
   Example paths:
   - Laravel storage: videos/video1.mp4
   - React public:    /videos/video1.mp4
   - External URL:    https://example.com/video.mp4
─────────────────────────────────────────────────────────────────── */
const VIDEOS = [
  {
    id: 1,
    src: Config.getImage('videos/video1.mp4'),
    thumb: Config.getImage('videos/thumb1.jpg'),
    title: 'ប្រឡងរបស់ប្អូនៗថ្នាក់មធ្យម',
    tag: '#khmer #trending',
    tiktokUrl: 'https://www.tiktok.com/@sealong_coding/video/7615576897522601224',
  },
  {
    id: 2,
    src: Config.getImage('videos/video2.mp4'),
    thumb: null,
    title: 'React Tutorial',
    tag: '#react #coding',
    tiktokUrl: 'https://www.tiktok.com/@sealong_coding',
  },
  {
    id: 3,
    src: Config.getImage('videos/video3.mp4'),
    thumb: null,
    title: 'Laravel Tips',
    tag: '#laravel #php',
    tiktokUrl: 'https://www.tiktok.com/@sealong_coding',
  },
  {
    id: 4,
    src: Config.getImage('videos/video4.mp4'),
    thumb: null,
    title: 'UI Design',
    tag: '#design #ui',
    tiktokUrl: 'https://www.tiktok.com/@sealong_coding',
  },
  {
    id: 5,
    src: Config.getImage('videos/video5.mp4'),
    thumb: null,
    title: 'Full Stack Dev',
    tag: '#fullstack',
    tiktokUrl: 'https://www.tiktok.com/@sealong_coding',
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.vs-root { font-family: 'DM Sans', sans-serif; }
.vs-root * { box-sizing: border-box; }

.vs-track {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  padding: 20px 0 30px;
}

.vs-slot {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  border-radius: 6px;
  background: #111;
}
.vs-slot.side {
  width: 14%;
  height: 420px;
  filter: brightness(0.3) blur(1px);
  transform: scaleY(0.88);
  margin: 0 -6px;
  z-index: 1;
}
.vs-slot.near {
  width: 18%;
  height: 470px;
  filter: brightness(0.5);
  transform: scaleY(0.94);
  margin: 0 4px;
  z-index: 2;
}
.vs-slot.center {
  width: 28%;
  height: 540px;
  filter: brightness(1);
  transform: scaleY(1);
  margin: 0 8px;
  z-index: 10;
  cursor: default;
  box-shadow: 0 28px 70px rgba(0,0,0,0.5);
  border-radius: 10px;
}

/* ── video element fills slot ── */
.vs-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

/* ── overlay gradient ── */
.vs-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(0,0,0,0.85) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px;
  transition: opacity 0.3s;
}

.vs-play-circle {
  width: 46px; height: 46px;
  border-radius: 50%;
  background: rgba(255,255,255,0.14);
  border: 1.5px solid rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 17px;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(4px);
}

.vs-info-tag {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 5px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.vs-info-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.vs-watch-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 22px;
  padding: 8px 18px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: opacity 0.18s, transform 0.18s;
  text-decoration: none;
  align-self: flex-start;
}
.vs-watch-btn:hover { opacity: 0.86; transform: translateY(-2px); }
.vs-tt-icon {
  width: 17px; height: 17px;
  background: #000; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 9px; font-weight: 900; flex-shrink: 0;
}

/* mute toggle button */
.vs-mute-btn {
  position: absolute;
  top: 12px; right: 12px;
  z-index: 30;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.45);
  border: none; color: #fff; font-size: 14px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
  transition: background 0.15s;
}
.vs-mute-btn:hover { background: rgba(0,0,0,0.7); }

.vs-nav-btn {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  z-index: 20;
  width: 42px; height: 42px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  border: none; color: #000; font-size: 20px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 18px rgba(0,0,0,0.22);
  transition: background 0.2s, transform 0.2s;
}
.vs-nav-btn:hover { background: #fff; transform: translateY(-50%) scale(1.09); }
.vs-nav-btn.left  { left: 14%; }
.vs-nav-btn.right { right: 14%; }

.vs-dots {
  display: flex; gap: 7px;
  justify-content: center; margin-top: 6px;
}
.vs-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(0,0,0,0.18);
  cursor: pointer; transition: all 0.25s; border: none;
}
.vs-dot.active { width: 24px; border-radius: 3px; background: #141414; }

.vs-header { text-align: center; margin-bottom: 32px; padding: 0 20px; }
.vs-header h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(26px, 3.5vw, 46px);
  font-weight: 700; color: #0f0f0f;
  letter-spacing: -1px; margin: 0 0 6px; line-height: 1;
}
.vs-header p {
  font-size: 11px; color: #888; font-weight: 500;
  margin: 0; letter-spacing: 3px; text-transform: uppercase;
}
.vs-header-line {
  width: 32px; height: 2px; background: #0f0f0f;
  margin: 12px auto 0; border-radius: 2px;
}

@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.vs-shimmer {
  width: 100%; height: 100%;
  background: linear-gradient(90deg, #1c1c1c 25%, #2e2e2e 50%, #1c1c1c 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite;
}

@media (max-width: 900px) {
  .vs-slot.side   { display: none; }
  .vs-slot.near   { width: 22%; height: 360px; margin: 0 4px; }
  .vs-slot.center { width: 52%; height: 420px; margin: 0 6px; }
  .vs-nav-btn.left  { left: 2%; }
  .vs-nav-btn.right { right: 2%; }
}
@media (max-width: 540px) {
  .vs-slot.near   { width: 18%; height: 300px; }
  .vs-slot.center { width: 60%; height: 360px; }
}
`;

/* single video slot */
const VideoSlot = ({ video, slotClass, isCenter, onClick, muted, onToggleMute }) => {
  const videoRef = useRef(null);

  // play/pause based on center or not
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isCenter) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isCenter]);

  // sync mute state on center video
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isCenter) return;
    el.muted = muted;
  }, [muted, isCenter]);

  return (
    <div className={`vs-slot ${slotClass}`} onClick={onClick}>
      <video
        ref={videoRef}
        className="vs-video"
        src={video.src}
        muted          // always start muted (browser autoplay policy)
        loop
        playsInline
        preload="metadata"
        poster={video.thumb || undefined}
      />

      {/* mute toggle — center only */}
      {isCenter && (
        <button
          className="vs-mute-btn"
          onClick={e => { e.stopPropagation(); onToggleMute(); }}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      <div className="vs-overlay">
        {isCenter ? (
          <>
            <div className="vs-info-tag">{video.tag}</div>
            <div className="vs-info-title">{video.title}</div>
            <a
              href={video.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="vs-watch-btn"
              onClick={e => e.stopPropagation()}
            >
              <div className="vs-tt-icon">T</div>
              Watch on TikTok
            </a>
          </>
        ) : (
          <div className="vs-play-circle">▶</div>
        )}
      </div>
    </div>
  );
};

/* ─────────── MAIN ─────────── */
const Videoshow = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted]         = useState(true);
  const total = VIDEOS.length;

  const prev = () => setActiveIdx(i => (i - 1 + total) % total);
  const next = () => setActiveIdx(i => (i + 1) % total);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const offsets   = [-2, -1, 0, 1, 2];
  const slotClass = (o) => o === 0 ? 'center' : Math.abs(o) === 1 ? 'near' : 'side';

  return (
    <div className="vs-root" style={{ padding: '60px 0 40px', background: '#f8f7f5' }}>
      <style>{CSS}</style>

      <div className="vs-header">
        <p>Follow us on TikTok</p>
        <h2>@sealong_coding</h2>
        <div className="vs-header-line" />
      </div>

      <div style={{ position: 'relative' }}>
        <div className="vs-track">
          {offsets.map(offset => {
            const idx   = (activeIdx + offset + total) % total;
            const video = VIDEOS[idx];
            return (
              <VideoSlot
                key={`${video.id}-${offset}`}
                video={video}
                slotClass={slotClass(offset)}
                isCenter={offset === 0}
                muted={muted}
                onToggleMute={() => setMuted(m => !m)}
                onClick={() => {
                  if (offset !== 0) setActiveIdx((activeIdx + offset + total) % total);
                }}
              />
            );
          })}
        </div>
        <button className="vs-nav-btn left"  onClick={prev}>‹</button>
        <button className="vs-nav-btn right" onClick={next}>›</button>
      </div>

      <div className="vs-dots">
        {VIDEOS.map((_, i) => (
          <button key={i}
            className={`vs-dot ${i === activeIdx ? 'active' : ''}`}
            onClick={() => setActiveIdx(i)} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <a
          href="https://www.tiktok.com/@sealong_coding"
          target="_blank" rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#0f0f0f', color: '#fff',
            padding: '13px 32px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.5px',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{
            width: 18, height: 18, background: '#fff', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontSize: 10, fontWeight: 900, flexShrink: 0,
          }}>T</span>
          Follow on TikTok
        </a>
      </div>
    </div>
  );
};

export default Videoshow;
