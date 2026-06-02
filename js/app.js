/* ══════════════════════════════════════════════════════════════
   LÓGICA DE CONVERSÃO & CRO — CÓDIGO DO SCORE (PREMIUM SCRIPTS)
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initFAQAccordion();
  initScrollReveal();
  initMobileStickyCTA();
  initCheckoutTracking();
  initUrgencyCounter();
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
 * 🏷️ PERSISTENT MOBILE & DESKTOP STICKY CTA
 * Exibe uma barra de compra fixa (no topo em desktop, no rodapé em mobile)
 * de forma persistente ao rolar a página para cima ou para baixo além de 300px.
 */
function initMobileStickyCTA() {
  const stickyBar = document.getElementById('mobile-sticky-bar');
  if (!stickyBar) return;

  function toggleStickyBar() {
    // Exibe a barra persistente após rolar 300px
    if (window.scrollY > 300) {
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

/**
 * ⚡ CONTADOR DINÂMICO DE PESSOAS NA PÁGINA (Urgência Realista)
 * Varia de 2 a 4 para cada usuário (salvo no localStorage)
 * Não muda ao atualizar a página, mas sofre flutuações sutis ao longo do tempo.
 */
function initUrgencyCounter() {
  const counters = document.querySelectorAll('.urgency-tag');
  if (counters.length === 0) return;

  const storageKeyVal = 'page_view_counter_val';
  const storageKeyTime = 'page_view_counter_time';
  
  let currentVal = localStorage.getItem(storageKeyVal);
  let lastTime = localStorage.getItem(storageKeyTime);
  const now = Date.now();

  // Se não houver valor salvo ou se o último foi salvo há mais de 3 minutos, gera um novo
  if (!currentVal || !lastTime || (now - parseInt(lastTime, 10) > 3 * 60 * 1000)) {
    // Escolhe aleatoriamente entre 2, 3 ou 4 pessoas para manter natural e com prova social positiva
    const possibleValues = [2, 3, 4];
    currentVal = possibleValues[Math.floor(Math.random() * possibleValues.length)];
    localStorage.setItem(storageKeyVal, currentVal.toString());
    localStorage.setItem(storageKeyTime, now.toString());
  } else {
    currentVal = parseInt(currentVal, 10);
  }

  // Função para formatar o texto do contador
  function formatUrgencyText(val) {
    return `⚡ ${val} pessoas estão na página agora`;
  }

  // Atualiza todos os elementos na página
  counters.forEach(el => {
    el.innerHTML = formatUrgencyText(currentVal);
  });

  // Flutua o número a cada 30 segundos
  setInterval(() => {
    let val = parseInt(localStorage.getItem(storageKeyVal) || '3', 10);
    const change = Math.random() > 0.5 ? 1 : -1;
    let newVal = val + change;
    
    // Mantém no intervalo de 2 a 4
    if (newVal < 2) newVal = 2;
    if (newVal > 4) newVal = 4;

    localStorage.setItem(storageKeyVal, newVal.toString());
    localStorage.setItem(storageKeyTime, Date.now().toString());

    counters.forEach(el => {
      el.innerHTML = formatUrgencyText(newVal);
    });
  }, 30000);
}

