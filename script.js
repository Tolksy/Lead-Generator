const form = document.querySelector('[data-form-steps]');
const statusBox = form?.querySelector('.form-status');
const yearEl = document.getElementById('year');
const faqButtons = document.querySelectorAll('.faq-question');
const floatingCta = document.querySelector('[data-floating-cta]');
const floatingCtaBtn = document.querySelector('[data-floating-cta-btn]');
const reportSection = document.getElementById('ally-form');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const getRangeValue = (rangeEl) => `$${rangeEl.value} /mo`;

if (form && statusBox) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusBox.textContent = 'Building your stealth-market analysis…';
    statusBox.style.color = '#1c63ff';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.mustHaves = formData.getAll('mustHaves');

    // Fake async send to illustrate integration point
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const firstName = payload.name?.split(' ')[0] || 'Driver';
      statusBox.textContent = `${firstName}, your report is locking in hidden inventory now. Watch your inbox.`;
      statusBox.style.color = '#0a7c49';
      form.reset();
      resetSteps();
    } catch (error) {
      console.error(error);
      statusBox.textContent = 'Something went wrong. Please try again or text (250) 800-1234.';
      statusBox.style.color = '#c53030';
    }
  });
}

if (form) {
  const phoneInput = form.querySelector('[data-phone-input]');
  const rangeInput = form.querySelector('[data-range]');
  const rangeDisplay = form.querySelector('[data-range-display]');

  phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;

    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }

    phoneInput.value = formatted;
  });

  if (rangeInput && rangeDisplay) {
    rangeDisplay.textContent = getRangeValue(rangeInput);
    rangeInput.addEventListener('input', () => {
      rangeDisplay.textContent = getRangeValue(rangeInput);
    });
  }
}

let currentStep = 0;

const steps = form ? Array.from(form.querySelectorAll('.form-step')) : [];
const progressSteps = form ? Array.from(form.querySelectorAll('[data-progress-step]')) : [];

const setStep = (index) => {
  if (!steps.length) return;
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, idx) => {
    step.classList.toggle('is-active', idx === currentStep);
  });
  progressSteps.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === currentStep);
  });
};

const validateStep = (index) => {
  const step = steps[index];
  if (!step) return true;
  const requiredFields = Array.from(step.querySelectorAll('[required]'));
  return requiredFields.every((field) => {
    if (field.type === 'radio') {
      const groupChecked = step.querySelector(`input[name="${field.name}"]:checked`);
      if (groupChecked) {
        return true;
      }
      field.reportValidity();
      return false;
    }
    return field.reportValidity();
  });
};

const resetSteps = () => {
  setStep(0);
  progressSteps.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === 0);
  });
};

form?.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-next], [data-prev]');
  if (!trigger) return;

  if (trigger.hasAttribute('data-next')) {
    const isValid = validateStep(currentStep);
    if (!isValid) return;
    setStep(currentStep + 1);
  } else if (trigger.hasAttribute('data-prev')) {
    setStep(currentStep - 1);
  }
});

resetSteps();

const toggleFloatingCta = () => {
  if (!floatingCta) return;
  const scrolledPastHero = window.scrollY > window.innerHeight * 0.4;

  let formInView = false;
  if (reportSection) {
    const rect = reportSection.getBoundingClientRect();
    formInView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
  }

  if (scrolledPastHero && !formInView) {
    floatingCta.classList.add('is-visible');
    floatingCta.setAttribute('aria-hidden', 'false');
  } else {
    floatingCta.classList.remove('is-visible');
    floatingCta.setAttribute('aria-hidden', 'true');
  }
};

window.addEventListener('scroll', toggleFloatingCta, { passive: true });
window.addEventListener('resize', toggleFloatingCta);
toggleFloatingCta();

const scrollToForm = () => {
  reportSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

floatingCtaBtn?.addEventListener('click', scrollToForm);

faqButtons.forEach((button) => {
  const answer = button.nextElementSibling;
  if (!(answer instanceof HTMLElement)) return;

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    faqButtons.forEach((otherBtn) => {
      if (otherBtn === button) return;
      const otherAnswer = otherBtn.nextElementSibling;
      otherBtn.setAttribute('aria-expanded', 'false');
      if (otherAnswer instanceof HTMLElement) {
        otherAnswer.hidden = true;
      }
    });

    button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    answer.hidden = isOpen;
  });
});
