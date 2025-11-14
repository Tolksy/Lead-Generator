const form = document.querySelector('.lead-form');
const statusBox = document.querySelector('.form-status');
const yearEl = document.getElementById('year');
const faqButtons = document.querySelectorAll('.faq-question');
const floatingCta = document.querySelector('[data-floating-cta]');
const floatingCtaBtn = document.querySelector('[data-floating-cta-btn]');
const applySection = document.getElementById('apply');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (form && statusBox) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusBox.textContent = 'Matching you with vetted partners…';
    statusBox.style.color = '#1c63ff';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Fake async send to illustrate integration point
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const firstName = payload.name?.split(' ')[0] || 'Driver';
      statusBox.textContent = `${firstName}, your request is queued. Expect curated Nanaimo matches shortly.`;
      statusBox.style.color = '#0a7c49';
      form.reset();
    } catch (error) {
      console.error(error);
      statusBox.textContent = 'Something went wrong. Please try again or text (250) 800-1234.';
      statusBox.style.color = '#c53030';
    }
  });
}

if (form) {
  const postalInput = form.querySelector('[data-postal-input]');
  const phoneInput = form.querySelector('[data-phone-input]');

  postalInput?.addEventListener('input', () => {
    const cleaned = postalInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    postalInput.value = cleaned.length > 3 ? `${cleaned.slice(0, 3)} ${cleaned.slice(3)}` : cleaned;
  });

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
}

const toggleFloatingCta = () => {
  if (!floatingCta) return;
  const scrolledPastHero = window.scrollY > window.innerHeight * 0.4;

  let formInView = false;
  if (applySection) {
    const rect = applySection.getBoundingClientRect();
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
  applySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
