// ==========================================================================
// CUSTOM.JS — SERENDIPPO RECORDS
// Néo-brutalisme psychédélique : interactions, animations, audio reactif.
// ==========================================================================

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. PALETTE D'ACCENTS — 5 couleurs, une par page
  // --------------------------------------------------------------------------
  const ACCENTS = [
    '#FF2E93', // magenta
    '#2B2BFF', // cobalt
    '#00E5FF', // cyan
    '#8A2BE2', // violet
    '#B6FF00'  // lime
  ];

  // Calcule l'index d'accent depuis le pathname
  function computeAccentIndex(pathname) {
    let hash = 0;
    for (let i = 0; i < pathname.length; i++) {
      hash = ((hash << 5) - hash) + pathname.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % ACCENTS.length;
  }

  function applyPageAccent() {
    const idx = computeAccentIndex(window.location.pathname);
    const accent = ACCENTS[idx];
    document.documentElement.style.setProperty('--accent', accent);
    // Stocker pour les stickers (rotation alternée)
    document.documentElement.style.setProperty('--accent-index', idx);
  }

  // --------------------------------------------------------------------------
  // 2. MODE CLAIR/SOMBRE — prefers-color-scheme + localStorage + bouton
  // --------------------------------------------------------------------------
  function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('theme-toggle-btn');
    const STORAGE_KEY = 'sr-theme-preference';

    // Lecture localStorage (protégé try/catch)
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}

    // Initialisation
    if (saved === 'dark' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else if (saved === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    }

    // Écouteur système (seulement si pas de préférence utilisateur)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let userPref = null;
      try { userPref = localStorage.getItem(STORAGE_KEY); } catch (_) {}
      if (!userPref) {
        if (e.matches) {
          html.classList.add('dark');
          html.classList.remove('light');
        } else {
          html.classList.remove('dark');
          html.classList.add('light');
        }
      }
    });

    // Bouton toggle
    if (btn) {
      btn.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        html.classList.toggle('light', !isDark);
        try { localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light'); } catch (_) {}
        // Mettre à jour l'icône du bouton
        updateThemeButton(btn, isDark);
      });
      updateThemeButton(btn, html.classList.contains('dark'));
    }
  }

  function updateThemeButton(btn, isDark) {
    btn.setAttribute('aria-label', isDark ? 'Passer au mode clair' : 'Passer au mode sombre');
    btn.setAttribute('title', isDark ? 'Mode clair' : 'Mode sombre');
  }

  // --------------------------------------------------------------------------
  // 3. BANDEAU DÉFILANT (marquee) — injecté dans le header
  // --------------------------------------------------------------------------
  function injectMarquee() {
    // Récupérer les mots-clés depuis la config (data attribute sur body ou meta)
    const keywords = [];
    const metaKeywords = document.querySelector('meta[name="sr-keywords"]');
    if (metaKeywords) {
      keywords.push(...metaKeywords.content.split(',').map(s => s.trim()).filter(Boolean));
    }
    // Fallback : nom du site + "RECORDS" + "ART" + "MUSIC"
    const siteName = document.querySelector('meta[name="sr-site-name"]')?.content || 'SERENDIPPO RECORDS';
    const defaultWords = [siteName, 'RECORDS', 'ART', 'MUSIC', 'VISUEL', 'CRÉATIF'];
    const allWords = [...keywords, ...defaultWords].filter(Boolean);

    // Dupliquer pour boucle infinie
    const trackContent = allWords.flatMap(w => [w, '◆']).join(' ');

    const marquee = document.createElement('div');
    marquee.className = 'marquee';
    marquee.setAttribute('aria-hidden', 'true');
    marquee.innerHTML = `
      <div class="marquee__track" aria-hidden="true">
        ${trackContent.repeat(3)}
      </div>
    `;

    // Insérer après le header (index) ou après #header (release)
    const header = document.getElementById('header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(marquee, header.nextSibling);
    } else {
      // Fallback : après le premier section
      const firstSection = document.querySelector('section, main');
      if (firstSection) firstSection.parentNode.insertBefore(marquee, firstSection.nextSibling);
    }
  }

  // --------------------------------------------------------------------------
  // 4. BOUTON HASARD — autocollant fixe bas-droite
  // --------------------------------------------------------------------------
  function injectRandomButton() {
    const btn = document.createElement('button');
    btn.id = 'random-btn';
    btn.className = 'sticker';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Page au hasard');
    btn.textContent = 'HASARD';

    // Collecter tous les liens de navigation (exclure page courante)
    btn.addEventListener('click', () => {
      const navLinks = Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.href)
        .filter(href => {
          try {
            const url = new URL(href);
            return url.origin === window.location.origin && href !== window.location.href;
          } catch { return false; }
        });

      if (navLinks.length > 0) {
        const target = navLinks[Math.floor(Math.random() * navLinks.length)];
        window.location.href = target;
      }
    });

    document.body.appendChild(btn);
  }

  // --------------------------------------------------------------------------
  // 5. POCHETTES / IMAGES VIVANTES — inclinaison 3D au survol + reveal scroll
  // --------------------------------------------------------------------------
  function initLivingImages() {
    const images = document.querySelectorAll('.releasecover, .artist-photo, img[alt*="cover" i]');

    // Inclinaison 3D vers le pointeur
    images.forEach(img => {
      img.addEventListener('pointermove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = img.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotateY = dx * 8; // max 8deg
        const rotateX = -dy * 8;
        img.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      img.addEventListener('pointerleave', () => {
        img.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
      });
    });

    // IntersectionObserver pour reveal au scroll
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

      document.querySelectorAll('section, article, .release, .track, .friend, .releasedescription').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
      });
    } else {
      // Fallback : tout visible immédiatement
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  // --------------------------------------------------------------------------
  // 6. LECTEUR AUDIO VIVANT — écoute événements play/pause/ended en capture
  // --------------------------------------------------------------------------
  function initAudioReactive() {
    const body = document.body;

    function onPlay() {
      body.classList.add('is-playing');
    }
    function onPause() {
      // Ne retirer que si plus rien ne joue
      const playing = document.querySelectorAll('audio:not([paused])');
      if (playing.length === 0) body.classList.remove('is-playing');
    }
    function onEnded() {
      const playing = document.querySelectorAll('audio:not([paused])');
      if (playing.length === 0) body.classList.remove('is-playing');
    }

    // Phase de capture car les événements media ne remontent pas (bubbles: false)
    document.addEventListener('play', onPlay, true);
    document.addEventListener('pause', onPause, true);
    document.addEventListener('ended', onEnded, true);
  }

  // --------------------------------------------------------------------------
  // 7. TITRE HÉRO — s'assurer qu'il a la classe pour typo géante
  // --------------------------------------------------------------------------
  function enhanceHeroTitle() {
    // Index : h2 dans #data
    const h2 = document.querySelector('#data h2');
    if (h2) h2.classList.add('hero-title');

    // Release : h2 dans #data
    const h2r = document.querySelector('#data h2, #header h2');
    if (h2r) h2r.classList.add('hero-title');
  }

  // --------------------------------------------------------------------------
  // 8. META TAGS pour marquee (injectés si absents)
  // --------------------------------------------------------------------------
  function ensureMetaTags() {
    if (!document.querySelector('meta[name="sr-site-name"]')) {
      const meta = document.createElement('meta');
      meta.name = 'sr-site-name';
      meta.content = 'SERENDIPPO RECORDS';
      document.head.appendChild(meta);
    }
    // Mots-clés optionnels depuis config (pourraient être ajoutés via template)
    // On laisse vide par défaut, le marquee utilisera les fallbacks
  }

  // --------------------------------------------------------------------------
  // INIT
  // --------------------------------------------------------------------------
  function init() {
    applyPageAccent();
    initTheme();
    ensureMetaTags();
    injectMarquee();
    injectRandomButton();
    initLivingImages();
    initAudioReactive();
    enhanceHeroTitle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();