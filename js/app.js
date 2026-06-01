/* ══════════════════════════════════════════════════════════════
   LÓGICA DE CONVERSÃO & CRO — CÓDIGO DO SCORE (PREMIUM SCRIPTS)
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initFAQAccordion();
  initScrollReveal();
  initMobileStickyCTA();
  initCheckoutTracking();
});

/**
 * ⏱️ COUNTDOWN TIMER DE 24 HORAS PERSISTENTE
 * Usa localStorage para manter o cronômetro individual ativo ao atualizar a página.
 */
function initCountdownTimer() {
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  if (!hoursEl || !minutesEl || !secondsEl) return;

  const storageKey = 'score_countdown_target';
  let targetTime = localStorage.getItem(storageKey);

  // Se não houver data salva ou já tiver expirado, cria novo ciclo de 24h
  if (!targetTime || Date.now() > parseInt(targetTime, 10)) {
    targetTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKey, targetTime.toString());
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function updateTimer() {
    const now = Date.now();
    let diff = targetTime - now;

    // Reinicia o ciclo de 24h ao expirar (urgência contínua/perpétua)
    if (diff <= 0) {
      targetTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, targetTime.toString());
      diff = 24 * 60 * 60 * 1000;
    }

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.innerText = hrs.toString().padStart(2, '0');
    minutesEl.innerText = mins.toString().padStart(2, '0');
    secondsEl.innerText = secs.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * ❓ FAQ ACCORDION TRANSITIONS
 * Controla a abertura e fechamento das perguntas frequentes
 * com cálculo de scrollHeight em tempo de execução para animações fluidas.
 */
function initFAQAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const wrapper = trigger.closest('.faq-item-wrapper');
      const panel = wrapper.querySelector('.faq-answer-panel');
      const isActive = wrapper.classList.contains('active');

      // Fechar todos os outros accordions abertos
      document.querySelectorAll('.faq-item-wrapper').forEach(item => {
        if (item !== wrapper) {
          item.classList.remove('active');
          item.querySelector('.faq-answer-panel').style.maxHeight = null;
        }
      });

      // Alternar o atual
      if (isActive) {
        wrapper.classList.remove('active');
        panel.style.maxHeight = null;
      } else {
        wrapper.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 💫 SCROLL REVEAL (INTERSECTION OBSERVER)
 * Anima os blocos de conteúdo conforme entram na tela do usuário
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 📱 MOBILE BOTTOM STICKY CTA INTELIGENTE
 * Exibe um botão CTA fixado na base da tela apenas em dispositivos móveis.
 * O botão desaparece suavemente quando botões de checkout nativos da página entram em cena.
 */
function initMobileStickyCTA() {
  const stickyBar = document.getElementById('mobile-sticky-bar');
  if (!stickyBar) return;

  const mainCTAs = document.querySelectorAll('.hero-cta-container, .final-cta-section');
  const isMobile = () => window.innerWidth <= 768;

  let heroCtaInView = false;
  let finalCtaInView = false;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.classList.contains('hero-cta-container')) {
          heroCtaInView = entry.isIntersecting;
        }
        if (entry.target.classList.contains('final-cta-section')) {
          finalCtaInView = entry.isIntersecting;
        }
      });
      toggleStickyBar();
    }, {
      root: null,
      threshold: 0.05
    });

    mainCTAs.forEach(cta => observer.observe(cta));
  }

  function toggleStickyBar() {
    if (!isMobile()) {
      stickyBar.classList.remove('visible');
      return;
    }

    const anyCtaVisible = heroCtaInView || finalCtaInView;

    // Aparece ao rolar mais de 400px E quando nenhum CTA estático estiver na tela
    if (window.scrollY > 400 && !anyCtaVisible) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleStickyBar, { passive: true });
  window.addEventListener('resize', toggleStickyBar, { passive: true });
  toggleStickyBar();
}

/**
 * 🛒 TRACKING DE CHECKOUT (META PIXEL)
 * Dispara o evento InitiateCheckout no Meta Pixel quando qualquer botão de checkout for clicado.
 */
function initCheckoutTracking() {
  const checkoutButtons = document.querySelectorAll('a[href*="kiwify.com.br"], .checkout-btn-url, #mobile-sticky-btn');

  checkoutButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout');
      } else {
        console.warn('Meta Pixel (fbq) não está carregado ou foi bloqueado pelo navegador.');
      }
    });
  });
}
