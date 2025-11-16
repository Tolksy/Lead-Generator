const yearEl = document.getElementById('year');
const form = document.querySelector('.ally-form');
const statusBox = form?.querySelector('.form-status');
const stepDisplay = form?.querySelector('[data-step-count]');
const steps = form ? Array.from(form.querySelectorAll('.form-step')) : [];
const nextBtn = form?.querySelector('[data-next]');
const prevBtn = form?.querySelector('[data-prev]');
const submitBtn = form?.querySelector('[data-submit]');
const slider = form?.querySelector('[data-budget-slider]');
const sliderOutput = form?.querySelector('[data-budget-output]');
const phoneInput = form?.querySelector('[data-phone-input]');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

document.querySelectorAll('[data-scroll]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const target = document.querySelector(trigger.getAttribute('data-scroll'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

phoneInput?.addEventListener('input', () => {
  phoneInput.value = formatPhone(phoneInput.value);
});

slider?.addEventListener('input', () => {
  sliderOutput.textContent = `$${slider.value}/mo`;
});

if (form && steps.length) {
  let currentStep = 0;

  const updateControls = () => {
    steps.forEach((step, index) => {
      const isActive = index === currentStep;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    if (stepDisplay) {
      stepDisplay.textContent = currentStep + 1;
    }

    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) nextBtn.hidden = currentStep === steps.length - 1;
    if (submitBtn) submitBtn.hidden = currentStep !== steps.length - 1;
  };

  const validateStep = () => {
    const step = steps[currentStep];
    if (!step) return true;

    if (currentStep === 0) {
      return Boolean(step.querySelector('input[type="radio"]:checked'));
    }

    if (currentStep === steps.length - 1) {
      const requiredFields = step.querySelectorAll('input[required]');
      return Array.from(requiredFields).every((input) => input.value.trim());
    }

    return true;
  };

  updateControls();

  nextBtn?.addEventListener('click', () => {
    if (!validateStep()) {
      const invalid = steps[currentStep].querySelector('input:invalid') || steps[currentStep].querySelector('input[required]');
      invalid?.reportValidity();
      return;
    }
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    updateControls();
  });

  prevBtn?.addEventListener('click', () => {
    currentStep = Math.max(currentStep - 1, 0);
    updateControls();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateStep()) {
      const invalid = steps[currentStep].querySelector('input:invalid') || steps[currentStep].querySelector('input[required]');
      invalid?.reportValidity();
      return;
    }

    if (statusBox) {
      statusBox.textContent = 'Building your stealth-market analysis…';
    }

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const firstName = payload.firstName || 'Driver';
      if (statusBox) {
        statusBox.textContent = `${firstName}, your Perfect Match report is hitting your inbox. Watch for a text in 10 minutes.`;
      }
      form.reset();
      sliderOutput.textContent = '$450/mo';
      phoneInput?.dispatchEvent(new Event('input'));
      currentStep = 0;
      updateControls();
    } catch (error) {
      console.error(error);
      if (statusBox) {
        statusBox.textContent = 'Something glitched. Reload or text 1 (888) 555-1010.';
      }
    }
  });
}
