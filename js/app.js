/* ══════════════════════════════════════════════════════════════
   LÓGICA INTERATIVA — CÓDIGO DO SCORE (PREMIUM SCRIPTS)
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScoreSimulator();
  initFAQAccordion();
  initScrollReveal();
  initStickyBar();
  initCheckoutTracking();
});




/**
 * 📊 SIMULADOR DE SCORE INTERATIVO
 * Atualiza dinamicamente a projeção de pontuação e os cards de benefícios desbloqueados.
 */
function initScoreSimulator() {
  const slider = document.getElementById('score-slider');
  const currentScoreVal = document.getElementById('current-score-val');
  const projectedScoreVal = document.getElementById('projected-score-val');
  const projectionBadge = document.getElementById('projection-badge');
  const unlockCards = document.querySelectorAll('.unlock-card');

  if (!slider) return;

  // Track the previous locked states
  const wasLocked = {};
  unlockCards.forEach(card => {
    wasLocked[card.id] = true;
  });

  const updateSimulator = () => {
    const score = parseInt(slider.value, 10);

    // Update current score display
    currentScoreVal.innerText = score;

    // Calculate projection
    let projectedScore, badgeText;
    if (score <= 400) {
      projectedScore = score + 290;
      badgeText = '⬆ +250 a +350 pts';
    } else if (score <= 700) {
      projectedScore = score + 210;
      badgeText = '⬆ +180 a +240 pts';
    } else if (score <= 900) {
      projectedScore = score + 95;
      badgeText = '⬆ +80 a +120 pts';
    } else {
      projectedScore = Math.min(1000, score + 35);
      badgeText = '⬆ +20 a +50 pts';
    }

    projectedScoreVal.innerText = projectedScore;
    if (projectionBadge) {
      projectionBadge.innerText = badgeText;
    }

    // Check unlocks
    unlockCards.forEach(card => {
      const minScore = parseInt(card.getAttribute('data-min-score'), 10);
      const id = card.id;

      if (projectedScore >= minScore) {
        // Should be unlocked
        if (wasLocked[id]) {
          // Transitioned from locked to unlocked!
          card.classList.remove('locked');
          // Trigger flash animation
          card.classList.remove('just-unlocked');
          void card.offsetWidth; // Trigger reflow to restart animation
          card.classList.add('just-unlocked');
          wasLocked[id] = false;
        } else {
          card.classList.remove('locked');
        }
      } else {
        // Should be locked
        card.classList.add('locked');
        card.classList.remove('just-unlocked');
        wasLocked[id] = true;
      }
    });
  };

  slider.addEventListener('input', updateSimulator);
  updateSimulator();
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
        // Define o maxHeight com base na altura real interna
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
          observer.unobserve(entry.target); // Roda apenas uma vez por elemento
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px' // Aciona pouco antes de entrar completamente
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback caso navegador não suporte IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 🏷️ STICKY PURCHASE BAR
 * Exibe a barra de checkout no rodapé da página após passar
 * do bloco principal de introdução e benefícios (500px de scroll).
 */
function initStickyBar() {
  const stickyBar = document.getElementById('sticky-bar');
  if (!stickyBar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 600) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * UTILITY: Custom premium Toast alerts
 */
function showToast(message) {
  // Remove existing toast if present
  const existingToast = document.querySelector('.premium-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'premium-toast';
  toast.innerText = message;

  // Custom temporary styling directly in JS to avoid CSS clutter
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '90px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'rgba(11, 30, 51, 0.95)',
    border: '1px solid hsl(43, 93%, 53%)',
    color: '#FFF',
    padding: '12px 24px',
    borderRadius: '30px',
    boxShadow: '0 8px 30px rgba(245, 197, 24, 0.2)',
    zIndex: '999',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    opacity: '0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none'
  });

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 50);

  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * 🛒 TRACKING DE CHECKOUT (META PIXEL)
 * Dispara o evento InitiateCheckout no Meta Pixel quando qualquer botão de checkout for clicado.
 */
function initCheckoutTracking() {
  const checkoutButtons = document.querySelectorAll('a[href*="kiwify.com.br"], .checkout-btn-url, #sticky-checkout-link');

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
