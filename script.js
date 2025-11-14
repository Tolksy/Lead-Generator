const form = document.querySelector('.lead-form');
const statusBox = document.querySelector('.form-status');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (form) {
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
