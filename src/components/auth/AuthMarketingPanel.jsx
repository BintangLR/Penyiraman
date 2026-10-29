import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import mpmLogo from '../../../assets/cover login/logo mpm.webp';
import authPageBackground from '../../../assets/cover login/gambar 3.png';

export const AUTH_PAGE_BACKGROUND = authPageBackground;

export function AuthMarketingPanel({ cover, slides, imageAlt, mobileTitle, mobileDescription }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  React.useEffect(() => {
    if (reducedMotion || slides.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [reducedMotion, slides.length]);

  const activeSlide = slides[activeIndex] || slides[0];

  return (
    <div className="auth-left" style={{ backgroundImage: `url(${cover})` }}>
      <div className="auth-left-overlay" />
      <div className="auth-left-content">
        <div className="auth-brand">
          <img className="auth-brand-logo" src={mpmLogo} alt="Logo MPM" />
          <div>
            <div className="auth-brand-name">Irigasi Cerdas</div>
            <div className="auth-brand-sub">Lahan Toraja</div>
          </div>
        </div>

        <div className="auth-marketing-bottom">
          <div key={activeIndex} className="auth-marketing-copy" aria-live="polite">
            <h1 className="auth-headline">{activeSlide.title}</h1>
            <p className="auth-tagline">{activeSlide.description}</p>
            <ul className="auth-features">
              {activeSlide.features.map(feature => (
                <li key={feature.title} className="auth-feature-item">
                  <CheckCircle2 className="auth-feature-icon" size={18} strokeWidth={1.8} />
                  <span><strong>{feature.title}</strong><small>{feature.description}</small></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="auth-mobile-copy">
            <h1 className="auth-headline">{mobileTitle}</h1>
            <p className="auth-tagline">{mobileDescription}</p>
          </div>
          {slides.length > 1 && (
            <div className="auth-slide-indicators" aria-label="Pilihan informasi aplikasi">
              {slides.map((slide, index) => <button key={slide.title} type="button" className={index === activeIndex ? 'active' : ''} aria-label={`Tampilkan informasi ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => setActiveIndex(index)} />)}
            </div>
          )}
        </div>
      </div>
      <span className="sr-only">{imageAlt}</span>
    </div>
  );
}
