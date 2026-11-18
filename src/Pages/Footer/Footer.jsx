import React from 'react';
import { useNavigate } from 'react-router-dom';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

.ft-root { font-family: 'Outfit', sans-serif; background: #0f0e0c; color: #fff; width: 100%; }
.ft-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ══ TOP GRID ══ */
.ft-top {
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 52px 60px 48px;
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.2fr;
  gap: 48px;
  align-items: start;
}

/* ══ BRAND ══ */
.ft-brand-name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #fff; margin-bottom: 6px; }
.ft-brand-tag {
  font-size: 10px; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 18px;
}
.ft-brand-desc {
  font-size: 13px; color: rgba(255,255,255,0.42);
  line-height: 1.85; max-width: 260px; font-weight: 300;
}
.ft-socials { display: flex; gap: 8px; margin-top: 24px; flex-wrap: wrap; }
.ft-social {
  width: 36px; height: 36px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: border-color 0.2s, background 0.2s;
  text-decoration: none; background: transparent;
}
.ft-social:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }
.ft-social svg { width: 16px; height: 16px; fill: rgba(255,255,255,0.55); transition: fill 0.2s; }
.ft-social:hover svg { fill: #fff; }

/* ══ NAV COLUMNS ══ */
.ft-col-label {
  font-size: 10px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 18px;
}
.ft-links { display: flex; flex-direction: column; gap: 10px; }
.ft-link {
  font-size: 13px; color: rgba(255,255,255,0.45);
  text-decoration: none; font-weight: 400;
  transition: color 0.18s; cursor: pointer; display: inline;
}
.ft-link:hover { color: #fff; }

/* ══ CONTACT CARD ══ */
.ft-contact-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; padding: 18px 20px;
}
.ft-contact-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.ft-contact-row:last-child { margin-bottom: 0; }
.ft-contact-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ft-contact-label {
  font-size: 9px; font-weight: 700; letter-spacing: 0.8px;
  text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 2px;
}
.ft-contact-val { font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 500; }

/* ══ BOTTOM BAR ══ */
.ft-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 60px; }
.ft-bottom {
  padding: 20px 60px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
}
.ft-copy { font-size: 11px; color: rgba(255,255,255,0.22); font-weight: 400; }
.ft-gold { color: #c8a96e; }
.ft-made { font-size: 11px; color: rgba(255,255,255,0.2); }
.ft-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 4px 12px;
}
.ft-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; }
.ft-badge-text { font-size: 10px; font-weight: 600; letter-spacing: 1px; color: rgba(255,255,255,0.35); }

/* ══ RESPONSIVE ══ */

/* Tablet landscape 1024px */
@media (max-width: 1024px) {
  .ft-top {
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 36px;
    padding: 44px 40px 40px;
  }
  .ft-top > div:nth-child(4) { grid-column: 1 / -1; }
  .ft-contact-card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .ft-contact-row { margin-bottom: 0; }
  .ft-divider { margin: 0 40px; }
  .ft-bottom { padding: 18px 40px; }
  .ft-brand-desc { max-width: 100%; }
}

/* Tablet portrait 768px */
@media (max-width: 768px) {
  .ft-top {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    padding: 36px 24px 32px;
  }
  .ft-top > div:nth-child(1) { grid-column: 1 / -1; }
  .ft-top > div:nth-child(4) { grid-column: 1 / -1; }
  .ft-contact-card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .ft-contact-row { margin-bottom: 0; }
  .ft-divider { margin: 0 24px; }
  .ft-bottom { padding: 16px 24px; gap: 10px; }
  .ft-brand-name { font-size: 20px; }
}

/* Mobile 480px */
@media (max-width: 480px) {
  .ft-top {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px 16px 28px;
  }
  .ft-top > div:nth-child(1) { grid-column: auto; }
  .ft-top > div:nth-child(4) { grid-column: auto; }
  .ft-contact-card {
    display: flex;
    flex-direction: column;
  }
  .ft-contact-row { margin-bottom: 12px; }
  .ft-contact-row:last-child { margin-bottom: 0; }
  .ft-brand-desc { max-width: 100%; }
  .ft-brand-name { font-size: 18px; }
  .ft-divider { margin: 0 16px; }
  .ft-bottom {
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .ft-socials { gap: 6px; }
  .ft-social { width: 34px; height: 34px; border-radius: 8px; }
  .ft-links { gap: 8px; }
}
`;

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.77a4.85 4.85 0 01-1.02-.08z"/>
  </svg>
);

const TelegramIcon = ({ size = 16, fill = 'rgba(255,255,255,0.55)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIconColored = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.77a4.85 4.85 0 01-1.02-.08z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#c8a96e" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  const shopLinks = [
    { label: 'All Products', path: '/' },
    { label: 'MacBook', path: '/' },
    { label: 'Gaming Laptops', path: '/' },
    { label: 'Smartphones', path: '/' },
    { label: 'Accessories', path: '/' },
  ];

  const companyLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Founder', path: '/founder' },
    { label: 'Our Journey', path: '/founder' },
    { label: 'Delivery Info', path: '/' },
    { label: 'Return Policy', path: '/' },
  ];

  return (
    <footer className="ft-root">
      <style>{CSS}</style>

      <div className="ft-top">

        {/* ── Brand ── */}
        <div>
          <div className="ft-brand-name">SHEERLONG SHOP</div>
          <div className="ft-brand-tag">Electronics &amp; Lifestyle</div>
          <p className="ft-brand-desc">
            Quality products, trusted service. Your go-to destination for
            premium electronics and everyday lifestyle essentials in Cambodia.
          </p>
          <div className="ft-socials">
            <a className="ft-social" href="https://www.tiktok.com/@sealong_coding" target="_blank" rel="noreferrer" title="TikTok">
              <TikTokIcon />
            </a>
            <a className="ft-social" href="https://t.me/Sealong_LEE" target="_blank" rel="noreferrer" title="Telegram">
              <TelegramIcon />
            </a>
            <a className="ft-social" href="https://www.facebook.com" target="_blank" rel="noreferrer" title="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* ── Shop ── */}
        <div>
          <div className="ft-col-label">Shop</div>
          <div className="ft-links">
            {shopLinks.map(({ label, path }) => (
              <span key={label} className="ft-link" onClick={() => navigate(path)}>{label}</span>
            ))}
          </div>
        </div>

        {/* ── Company ── */}
        <div>
          <div className="ft-col-label">Company</div>
          <div className="ft-links">
            {companyLinks.map(({ label, path }) => (
              <span key={label} className="ft-link" onClick={() => navigate(path)}>{label}</span>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div>
          <div className="ft-col-label">Contact</div>
          <div className="ft-contact-card">
            <div className="ft-contact-row">
              <div className="ft-contact-icon" style={{ background: 'rgba(0,136,204,0.15)' }}>
                <TelegramIcon size={16} fill="#29b6f6" />
              </div>
              <div>
                <div className="ft-contact-label">Telegram</div>
                <div className="ft-contact-val">@Sealong_LEE</div>
              </div>
            </div>
            <div className="ft-contact-row">
              <div className="ft-contact-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <TikTokIconColored size={16} />
              </div>
              <div>
                <div className="ft-contact-label">TikTok</div>
                <div className="ft-contact-val">@sealong_coding</div>
              </div>
            </div>
            <div className="ft-contact-row">
              <div className="ft-contact-icon" style={{ background: 'rgba(200,169,110,0.12)' }}>
                <LocationIcon />
              </div>
              <div>
                <div className="ft-contact-label">Location</div>
                <div className="ft-contact-val">Phnom Penh, Cambodia</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="ft-divider" />

      <div className="ft-bottom">
        <span className="ft-copy">
          &copy; {new Date().getFullYear()} <span className="ft-gold">Sheerlong Shop</span>. All rights reserved.
        </span>
        <div className="ft-badge">
          <span className="ft-badge-dot" />
          <span className="ft-badge-text">Open for orders</span>
        </div>
        <span className="ft-made">
          Built with care by <span className="ft-gold">@sealong_coding</span>
        </span>
      </div>

    </footer>
  );
};

export default Footer;