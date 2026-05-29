/* ============================================================
   NARCOLOGICAL CLINIC — main.js
   Production-ready vanilla JS (ES6+). No dependencies.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────
  // Инструкция по настройке Telegram:
  // 1. Создайте бота через @BotFather в Telegram, скопируйте токен и вставьте в telegramBotToken.
  // 2. Добавьте бота в ваш чат/группу, куда должны приходить заявки, и сделайте его администратором.
  // 3. Отправьте в чат тестовое сообщение (например, "тест").
  // 4. Откройте в браузере: https://api.telegram.org/bot<ТОКЕН_БОТА>/getUpdates
  // 5. Найдите в ответе "chat":{"id":-1001234567890} и скопируйте этот ID в telegramChatId.
  const CONFIG = {
    telegramBotToken: '8904124107:AAGJ6jjMbNkXptYdDKWfOP1i0Ii33M8ltBU', // Токен бота от @BotFather
    telegramChatId: '-1003261807424',     // ID чата (начинается с минуса для групп)
    phone: '+79154648724',
    telegramLink: 'https://t.me/MedHe1p24',
  };

  // ── DOM CACHE ───────────────────────────────────────────────
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCard = document.getElementById('modalCard');
  const modalContent = document.getElementById('modalContent');
  const contactForm = document.getElementById('contactForm');
  const sosWidget = document.getElementById('sosWidget');
  const sosBrigadesText = document.getElementById('sosBrigadesText');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const quizProgressBar = document.getElementById('quiz-progress-bar');

  // ── 1. BURGER MENU ─────────────────────────────────────────
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 2. STICKY HEADER ───────────────────────────────────────
  function handleStickyHeader() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ── 3. SMOOTH SCROLL ───────────────────────────────────────
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── 4. ACTIVE NAV HIGHLIGHT ─────────────────────────────────
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ── 5. SCROLL REVEAL ANIMATIONS ────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document
    .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach((el) => revealObserver.observe(el));

  // ── 7. MODAL SYSTEM ─────────────────────────────────────────
  function buildFormField(name, placeholder, type, extraClass) {
    const inputType = type || 'text';
    const cls = extraClass ? ` class="${extraClass}"` : '';
    return `<input type="${inputType}" name="${name}" placeholder="${placeholder}"${cls} required>`;
  }

  function getModalHTML(type, extraInfo) {
    const privacyText = `
      <p style="font-size: 11px; color: var(--text-light); text-align: center; margin-top: 12px; line-height: 1.4; opacity: 0.8;">
        Нажимая на кнопку, вы даете согласие на обработку персональных данных в соответствии с ФЗ-152.
      </p>`;

    switch (type) {
      case 'callback':
        return `
          <h3 class="modal-title">Обратный звонок</h3>
          <form class="modal-form" onsubmit="handleModalSubmit(event)">
            <input type="hidden" name="service" value="Обратный звонок">
            ${buildFormField('phone', '+7 (___) ___-__-__', 'tel', 'phone-mask-modal')}
            <button type="submit" class="btn btn--green">Отправить</button>
            ${privacyText}
          </form>`;

      case 'emergency':
        return `
          <h3 class="modal-title modal-title--red">Экстренный вызов</h3>
          <form class="modal-form" onsubmit="handleModalSubmit(event)">
            <input type="hidden" name="service" value="Экстренный вызов">
            ${buildFormField('name', 'Ваше имя', 'text', '')}
            ${buildFormField('phone', '+7 (___) ___-__-__', 'tel', 'phone-mask-modal')}
            ${buildFormField('address', 'Адрес вызова', 'text', '')}
            <button type="submit" class="btn btn--red">Вызвать бригаду</button>
            ${privacyText}
          </form>`;

      case 'service':
        return `
          <h3 class="modal-title">Заказать услугу</h3>
          <p class="modal-subtitle">${extraInfo || ''}</p>
          <form class="modal-form" onsubmit="handleModalSubmit(event)">
            <input type="hidden" name="service" value="${extraInfo || ''}">
            ${buildFormField('phone', '+7 (___) ___-__-__', 'tel', 'phone-mask-modal')}
            <button type="submit" class="btn btn--green">Заказать</button>
            ${privacyText}
          </form>`;

      case 'promo':
        return `
          <h3 class="modal-title">Активировать предложение</h3>
          <p class="modal-subtitle">${extraInfo || ''}</p>
          <form class="modal-form" onsubmit="handleModalSubmit(event)">
            <input type="hidden" name="service" value="Промо: ${extraInfo || ''}">
            ${buildFormField('phone', '+7 (___) ___-__-__', 'tel', 'phone-mask-modal')}
            <button type="submit" class="btn btn--blue">Активировать</button>
            ${privacyText}
          </form>`;

      default:
        return '';
    }
  }

  function openModal(type, extraInfo) {
    if (!modalOverlay || !modalCard || !modalContent) return;

    const modalType = type || 'callback';
    modalContent.innerHTML = getModalHTML(modalType, extraInfo);

    modalOverlay.classList.add('active');
    modalCard.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Apply phone mask to dynamically created inputs inside modal
    modalContent.querySelectorAll('.phone-mask-modal').forEach((input) => {
      applyPhoneMask(input);
    });

    // Focus first visible input
    const firstInput = modalContent.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal() {
    if (!modalOverlay || !modalCard) return;

    modalCard.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Buttons with [data-modal]
  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.modalType || 'callback';
      openModal(type);
    });
  });

  // Buttons with [data-service]
  document.querySelectorAll('[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal('service', btn.dataset.service);
    });
  });

  // ── 8. PHONE INPUT MASK ─────────────────────────────────────
  function applyPhoneMask(input) {
    if (!input) return;

    // Store digits only — avoids all cursor/formatting issues
    let storedDigits = '';

    function digitsToFormatted(digits) {
      let r = '';
      if (digits.length > 0) r += '+' + digits[0];
      if (digits.length > 1) r += ' (' + digits.substring(1, Math.min(4, digits.length));
      if (digits.length >= 4) r += ')';
      if (digits.length > 4) r += ' ' + digits.substring(4, Math.min(7, digits.length));
      if (digits.length > 7) r += '-' + digits.substring(7, Math.min(9, digits.length));
      if (digits.length > 9) r += '-' + digits.substring(9, Math.min(11, digits.length));
      return r;
    }

    function syncInput() {
      input.value = digitsToFormatted(storedDigits);
    }

    input.addEventListener('keydown', (e) => {
      // Allow navigation, tab, etc.
      if (e.ctrlKey || e.metaKey || e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (storedDigits.length > 1) {
          storedDigits = storedDigits.slice(0, -1);
        } else {
          storedDigits = '';
        }
        syncInput();
        return;
      }

      // Only allow digit input
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        if (storedDigits.length >= 11) return; // max digits

        let digit = e.key;

        if (storedDigits.length === 0) {
          // First digit: 8 → 7, anything else → 7+digit
          if (digit === '8' || digit === '7') {
            storedDigits = '7';
          } else {
            storedDigits = '7' + digit;
          }
        } else {
          storedDigits += digit;
        }
        syncInput();
        return;
      }

      // Block everything else (letters, symbols)
      if (e.key.length === 1) {
        e.preventDefault();
      }
    });

    // Handle paste
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      let digits = pasted.replace(/\D/g, '');
      if (digits.length > 0 && digits[0] === '8') digits = '7' + digits.slice(1);
      if (digits.length > 0 && digits[0] !== '7') digits = '7' + digits;
      if (digits.length > 11) digits = digits.slice(0, 11);
      storedDigits = digits;
      syncInput();
    });

    input.addEventListener('focus', () => {
      if (!storedDigits) {
        storedDigits = '7';
        syncInput();
      }
    });

    input.addEventListener('blur', () => {
      if (storedDigits.length <= 1) {
        storedDigits = '';
        input.value = '';
      }
    });

    // Init from existing value (if any)
    if (input.value) {
      storedDigits = input.value.replace(/\D/g, '');
      if (storedDigits[0] === '8') storedDigits = '7' + storedDigits.slice(1);
      syncInput();
    }
  }

  // Apply phone mask to all telephone inputs already on the page
  document.querySelectorAll("input[type='tel']").forEach((input) => {
    applyPhoneMask(input);
  });

  // ── 9. FORM SUBMISSION → TELEGRAM ──────────────────────────
  async function sendToTelegram(data) {
    const message = [
      '🔔 Новая заявка!',
      '',
      `👤 Имя: ${data.name || 'Не указано'}`,
      `📞 Телефон: ${data.phone || 'Не указан'}`,
      `📋 Услуга: ${data.service || 'Не указана'}`,
      data.address ? `📍 Адрес: ${data.address}` : null,
      `⏰ Время: ${new Date().toLocaleString('ru-RU')}`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.telegramChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Telegram send error:', error);
      return false;
    }
  }

  function extractFormData(form) {
    const formData = new FormData(form);
    return {
      name: formData.get('name') || '',
      phone: formData.get('phone') || '',
      service: formData.get('service') || '',
      address: formData.get('address') || '',
    };
  }

  function isPhoneComplete(phoneStr) {
    const digits = phoneStr.replace(/\D/g, '');
    return digits.length === 11;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = extractFormData(form);
    const phoneInput = form.querySelector('input[type="tel"]');

    if (!isPhoneComplete(data.phone)) {
      if (phoneInput) {
        phoneInput.classList.add('input-error');
        phoneInput.focus();
        phoneInput.addEventListener('input', () => phoneInput.classList.remove('input-error'), { once: true });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
    }

    const success = await sendToTelegram(data);

    if (success) {
      form.innerHTML = `
        <div class="form-success">
          <span class="form-success__icon">✓</span>
          <p class="form-success__title">Заявка отправлена!</p>
          <p class="form-success__text">Мы свяжемся с вами в ближайшее время</p>
        </div>`;
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ошибка. Попробовать снова';
      }
    }
  }

  async function handleModalSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = extractFormData(form);
    const phoneInput = form.querySelector('input[type="tel"]');

    if (!isPhoneComplete(data.phone)) {
      if (phoneInput) {
        phoneInput.classList.add('input-error');
        phoneInput.focus();
        phoneInput.addEventListener('input', () => phoneInput.classList.remove('input-error'), { once: true });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
    }

    const success = await sendToTelegram(data);

    if (success) {
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="modal-success">
            <span class="modal-success__icon">✓</span>
            <p class="modal-success__title">Заявка отправлена!</p>
            <p class="modal-success__text">Мы свяжемся с вами в ближайшее время</p>
          </div>`;
      }
      setTimeout(closeModal, 2500);
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ошибка. Попробовать снова';
      }
    }
  }

  // Main contact form
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  // ── 10. FAQ ACCORDION ───────────────────────────────────────
  function toggleFaq(btn) {
    if (!btn) return;

    const answer = btn.nextElementSibling;
    const chevron = btn.querySelector('.faq-chevron');
    const isOpen = answer && answer.classList.contains('open');

    // Close all other FAQ items first (accordion behaviour)
    document.querySelectorAll('.faq-answer.open').forEach((openAnswer) => {
      openAnswer.classList.remove('open');
    });
    document.querySelectorAll('.faq-chevron.open').forEach((openChevron) => {
      openChevron.classList.remove('open');
    });

    // Toggle clicked item (if it was closed, open it)
    if (!isOpen && answer) {
      answer.classList.add('open');
      if (chevron) chevron.classList.add('open');
    }
  }

  // ── 11. DETOX TABS SWITCHER ─────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.detox-tab-content');

  function switchDetoxTab(index) {
    tabBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    tabContents.forEach((content, i) => {
      content.classList.toggle('active', i === index);
    });
  }

  // Initialise tab 0 as active
  if (tabBtns.length > 0) {
    switchDetoxTab(0);
  }

  // Wire click events to tab buttons
  tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => switchDetoxTab(i));
  });

  // ── 12. QUIZ CALCULATOR ─────────────────────────────────────
  let currentQuizStep = 1;
  const totalQuizSteps = 5;
  const quizStepTitles = [
    '',
    'Кому нужна помощь?',
    'Какое состояние?',
    'Где лечить?',
    'Ваше нахождение',
    'Результат',
  ];

  function updateQuizUI() {
    // Show / hide quiz steps
    document.querySelectorAll('.quiz-step').forEach((step) => {
      const stepNum = parseInt(step.dataset.step, 10);
      step.classList.toggle('active', stepNum === currentQuizStep);
    });

    // Update progress bar
    if (quizProgressBar) {
      const progress = (currentQuizStep / totalQuizSteps) * 100;
      quizProgressBar.style.width = progress + '%';
    }

    // Update step title and subtitle
    const titleEl = document.querySelector('.quiz-step-title');
    const subtitleEl = document.querySelector('.quiz__subtitle');
    if (titleEl && quizStepTitles[currentQuizStep]) {
      titleEl.textContent = quizStepTitles[currentQuizStep];
    }
    if (subtitleEl) {
      subtitleEl.textContent = currentQuizStep <= 4 ? `Шаг ${currentQuizStep} из 4` : 'Результат расчёта';
    }

    // Update nav buttons
    const prevBtn = document.getElementById('prevQuizBtn');
    const nextBtn = document.getElementById('nextQuizBtn');
    if (prevBtn) prevBtn.style.visibility = currentQuizStep > 1 ? 'visible' : 'hidden';
    if (nextBtn) nextBtn.style.display = currentQuizStep >= totalQuizSteps ? 'none' : '';

    // Apply phone mask to quiz phone input if on last step
    if (currentQuizStep === totalQuizSteps) {
      const quizPhoneInput = document.getElementById('quizPhone');
      if (quizPhoneInput) applyPhoneMask(quizPhoneInput);
    }
  }

  function navigateQuiz(stepChange) {
    const nextStep = currentQuizStep + stepChange;
    if (nextStep < 1 || nextStep > totalQuizSteps) return;

    currentQuizStep = nextStep;
    updateQuizUI();
  }

  async function handleQuizSubmit(event) {
    event.preventDefault();
    const form = event.target;

    // Collect all radio values from the quiz
    const quizData = {};
    form.querySelectorAll('input[type="radio"]:checked').forEach((radio) => {
      quizData[radio.name] = radio.value;
    });

    const formData = new FormData(form);
    const data = {
      name: formData.get('name') || '',
      phone: formData.get('phone') || '',
      service:
        'Квиз: ' +
        Object.entries(quizData)
          .map(([key, val]) => `${key}: ${val}`)
          .join('; '),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
    }

    const success = await sendToTelegram(data);

    if (success) {
      const resultStep = form.querySelector('.quiz-step.active');
      if (resultStep) {
        resultStep.innerHTML = `
          <div class="form-success">
            <span class="form-success__icon">✓</span>
            <p class="form-success__title">Спасибо!</p>
            <p class="form-success__text">Мы подберём оптимальную программу и свяжемся с вами</p>
          </div>`;
      }
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ошибка. Попробовать снова';
      }
    }
  }

  // ── 13. SOS WIDGET ──────────────────────────────────────────
  function handleSOSWidget() {
    if (!sosWidget) return;
    if (window.scrollY > 400) {
      sosWidget.classList.add('visible');
    } else {
      sosWidget.classList.remove('visible');
    }
  }

  // Random brigades counter every 15 seconds
  if (sosBrigadesText) {
    function updateBrigadesCount() {
      const count = Math.floor(Math.random() * 3) + 3; // 3-5
      sosBrigadesText.textContent = 'Свободно бригад: ' + count;
    }
    updateBrigadesCount();
    setInterval(updateBrigadesCount, 15000);
  }

  if (sosWidget) {
    sosWidget.addEventListener('click', () => {
      openModal('emergency');
    });
  }

  // ── 14. COUNTER ANIMATION ──────────────────────────────────
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function easeOutQuad(t) {
          return t * (2 - t);
        }

        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutQuad(progress);
          const currentValue = Math.floor(easedProgress * target);

          el.textContent = currentValue + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.counter-value[data-target]').forEach((el) => {
    counterObserver.observe(el);
  });

  // ── QUIZ RADIO OPTION CLICK HANDLER ─────────────────────────
  document.querySelectorAll('.quiz__option').forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', () => {
        // Remove selected from siblings
        const parent = option.closest('.quiz__options');
        if (parent) {
          parent.querySelectorAll('.quiz__option').forEach((o) => o.classList.remove('selected'));
        }
        option.classList.add('selected');
      });
    }
  });

  // ── 15. SCROLL TO TOP ──────────────────────────────────────
  function handleScrollTopBtn() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 16. LICENSE ZOOM ────────────────────────────────────────
  const licenseData = {
    1: {
      title: 'Лицензия на осуществление медицинской деятельности',
      org: 'ООО «Медикал Детокс»',
      description:
        'Лицензия на оказание медицинской помощи, включая наркологическую помощь, детоксикацию, диагностику и лечение.',
      serial: 'Л041-01137-77/00620856',
      date: 'Действующая',
    },
  };

  function zoomLicense(id) {
    const license = licenseData[id];
    if (!license) return;

    if (modalContent && modalOverlay && modalCard) {
      modalContent.innerHTML = `
        <div class="license-detail">
          <h3 class="modal-title">${license.title}</h3>
          <p class="license-org">${license.org}</p>
          <p class="license-desc">${license.description}</p>
          <div class="license-meta">
            <p><strong>Серийный номер:</strong> ${license.serial}</p>
            <p><strong>Дата выдачи:</strong> ${license.date}</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="license.pdf" target="_blank" class="btn btn--green" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;justify-content:center;">
              <span class="material-symbols-outlined">open_in_new</span>
              Открыть оригинал PDF
            </a>
          </div>
        </div>`;

      modalOverlay.classList.add('active');
      modalCard.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // ── UNIFIED SCROLL HANDLER ──────────────────────────────────
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleStickyHeader();
        highlightActiveNav();
        handleSOSWidget();
        handleScrollTopBtn();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Run once on load in case user has already scrolled
  handleStickyHeader();
  highlightActiveNav();
  handleSOSWidget();
  handleScrollTopBtn();

  // ── EXPOSE GLOBAL FUNCTIONS ─────────────────────────────────
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.toggleFaq = toggleFaq;
  window.switchDetoxTab = switchDetoxTab;
  window.navigateQuiz = navigateQuiz;
  window.handleQuizSubmit = handleQuizSubmit;
  window.handleFormSubmit = handleFormSubmit;
  window.handleModalSubmit = handleModalSubmit;
  window.zoomLicense = zoomLicense;
  window.applyPhoneMask = applyPhoneMask;

  // ── COOKIE CONSENT BANNER ──────────────────────────
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  if (cookieBanner && cookieAccept) {
    if (localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('hidden');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.add('hidden');
    });
  }
});
