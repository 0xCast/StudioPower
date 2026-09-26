/**
 * STUDIO POWER — FITNESS PERFORMANCE
 * JavaScript Vanilla Puro
 * Interatividade leve, acessível e focada em performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initVideoPlayer();
  initScrollReveal();
  initSmoothScroll();
  initBackToTop();
});

/**
 * 1. Menu Mobile Dropdown Acessível
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMobile = document.getElementById('navMobile');

  if (!menuToggle || !navMobile) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    navMobile.classList.toggle('active', isOpen);
  }

  menuToggle.addEventListener('click', () => {
    toggleMenu();
  });

  // Fechar ao clicar em um link do menu
  const mobileLinks = navMobile.querySelectorAll('.mobile-link');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Fechar com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  // Fechar se clicar fora do menu
  document.addEventListener('click', (e) => {
    if (
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      !menuToggle.contains(e.target) &&
      !navMobile.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
}

/**
 * 2. Player de Vídeo Teaser (Controle Manual & Overlay Play)
 */
function initVideoPlayer() {
  const video = document.getElementById('teaserVideo');
  const playOverlay = document.getElementById('videoPlayOverlay');

  if (!video || !playOverlay) return;

  // Iniciar vídeo ao clicar no botão de overlay
  playOverlay.addEventListener('click', () => {
    video.play();
  });

  // Esconder overlay quando o vídeo começar a reproduzir
  video.addEventListener('play', () => {
    playOverlay.classList.add('hidden');
  });

  // Reexibir overlay se o vídeo pausar ou terminar
  video.addEventListener('pause', () => {
    // Apenas se o vídeo não estiver no fim
    if (!video.ended) {
      playOverlay.classList.remove('hidden');
    }
  });

  video.addEventListener('ended', () => {
    playOverlay.classList.remove('hidden');
  });
}

/**
 * 3. Revelação Sutil no Scroll (IntersectionObserver)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  // Fallback caso IntersectionObserver não seja suportado
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target); // Libera memória e evita re-trigger
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * 4. Scroll Suave para Âncoras com Compensação do Header Fixo
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.getElementById('header');
  const headerHeight = header ? header.offsetHeight : 72;

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/**
 * 5. Botão Voltar ao Topo
 * Visível só depois de uma rolagem relevante; some perto do topo.
 */
function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  const showAfter = 400;
  let ticking = false;

  function syncVisibility() {
    button.hidden = window.scrollY <= showAfter;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(syncVisibility);
    }
  }, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  syncVisibility();
}
