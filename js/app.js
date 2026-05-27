/* ══════════════════════════════════════════════════════════════
   LÓGICA INTERATIVA — CÓDIGO DO SCORE (PREMIUM SCRIPTS)
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initOrderBump();
  initFAQAccordion();
  initScrollReveal();
  initStickyBar();
});




/**
 * 🛒 LÓGICA DO ORDER BUMP DINÂMICO
 * Gerencia a soma do valor do Kit Score Blindado no preço final,
 * atualiza as copys de preço e atualiza o link de checkout Kiwify
 */
function initOrderBump() {
  const checkbox = document.getElementById('ob-checkbox');
  const card = document.getElementById('order-bump-card');
  const checkoutButtons = document.querySelectorAll('.checkout-btn-url');
  const stickyCheckoutLink = document.getElementById('sticky-checkout-link');
  const bumpBundleItem = document.getElementById('bump-bundle-item');
  const priceDisplays = document.querySelectorAll('.main-price-val');
  const checkoutPriceDisplays = document.querySelectorAll('.checkout-price-display');

  if (!checkbox) return;

  const baseCheckoutUrl = 'https://pay.kiwify.com.br/7e3LcJe';
  // Com o order bump, redireciona adicionando a marcação de bump no checkout para acompanhamento visual
  const bumpCheckoutUrl = 'https://pay.kiwify.com.br/7e3LcJe?offertabump=true';

  checkbox.addEventListener('change', () => {
    const isChecked = checkbox.checked;

    if (isChecked) {
      card.classList.add('selected');

      // 1. Atualizar textos de preço
      priceDisplays.forEach(el => el.innerText = '64');
      checkoutPriceDisplays.forEach(el => el.innerText = 'R$ 64');

      // 2. Mostrar item adicional no checklist final
      if (bumpBundleItem) bumpBundleItem.style.display = 'flex';

      // 3. Atualizar links de checkout
      checkoutButtons.forEach(btn => {
        btn.href = bumpCheckoutUrl;
        if (btn.classList.contains('btn-large')) {
          btn.innerHTML = '<span class="btn-shine"></span> 🔓 Quero meu acesso imediato — R$ 64';
        }
      });

      if (stickyCheckoutLink) {
        stickyCheckoutLink.href = bumpCheckoutUrl;
        const stickyText = stickyCheckoutLink.querySelector('.sticky-text');
        if (stickyText) {
          stickyText.innerHTML = 'Quero o Código do Score — <strong>R$ 64</strong>';
        }
      }

      // Adiciona uma discreta notificação visual
      showToast('Kit Documentos Prontos adicionado com sucesso!');
    } else {
      card.classList.remove('selected');

      // 1. Restaurar preços base
      priceDisplays.forEach(el => el.innerText = '47');
      checkoutPriceDisplays.forEach(el => el.innerText = 'R$ 47');

      // 2. Ocultar item adicional no checklist final
      if (bumpBundleItem) bumpBundleItem.style.display = 'none';

      // 3. Restaurar links de checkout
      checkoutButtons.forEach(btn => {
        btn.href = baseCheckoutUrl;
        if (btn.classList.contains('btn-large')) {
          btn.innerHTML = '<span class="btn-shine"></span> 🔓 Quero meu acesso imediato — R$ 47';
        }
      });

      if (stickyCheckoutLink) {
        stickyCheckoutLink.href = baseCheckoutUrl;
        const stickyText = stickyCheckoutLink.querySelector('.sticky-text');
        if (stickyText) {
          stickyText.innerHTML = 'Quero o Código do Score — <strong>R$ 47</strong>';
        }
      }
    }
  });
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
