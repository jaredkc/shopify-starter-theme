/**
 * Ajax newsletter form
 */
const newsletterForm = document.getElementById('contact_form');

function newsletterResponse(success) {
  const resElm = document.getElementById('form-response');

  if (!resElm) return;

  if (success) {
    resElm.innerHTML = resElm.dataset.success;
    resElm.classList.add('banner--success');
  } else {
    resElm.innerHTML = resElm.dataset.error;
    resElm.classList.add('banner--error');
  }
  resElm.classList.remove('hidden');
  newsletterForm.classList.remove('loading');
}

function newsletterSubmit(e) {
  e.preventDefault();

  newsletterForm.classList.add('loading');

  // Handle form submission
  fetch(e.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(e.target)),
  }).then((res) => {
    // Incase Shopify reCAPTCHA is triggered
    if (res.url.includes('/challenge')) {
      window.location.replace(res.url);
    } else {
      newsletterResponse(true);
    }
  }).catch(() => {
    newsletterResponse(false);
  });
}

if (newsletterForm) newsletterForm.addEventListener('submit', newsletterSubmit);
