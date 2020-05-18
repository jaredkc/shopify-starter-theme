/**
 * Ajax newsletter form
 */
const newsletterForm = document.getElementById('contact_form');

function newsletterResponse(success) {
  const formResponse = document.getElementById('form-response');

  if (!formResponse) return;

  if (success) {
    formResponse.innerHTML = formResponse.dataset.success;
    formResponse.classList.add('banner--success');
  } else {
    formResponse.innerHTML = formResponse.dataset.error;
    formResponse.classList.add('banner--error');
  }
  formResponse.classList.remove('hidden');
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

/*
Example Responses

Success returns empty object
{}

Not a robot challenge has been triggered:
{
  "ok": true,
  "redirected": true,
  "status": 200,
  "statusText": "",
  "type": "basic",
  "url": "https://bb-staged.myshopify.com/challenge"
}
*/
