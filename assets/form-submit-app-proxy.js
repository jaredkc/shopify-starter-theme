document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-submit-app-proxy');
  const getForm = document.getElementById('form-get-app-proxy');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);


      // Get the name and email from the form data
      const name = formData.get('name');
      const email = formData.get('email');

      console.log(JSON.stringify({ name, email }));

      // Send the name and email to the app proxy as a POST request
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email })
        });

        const result = await response.json();
        console.log('Form submission response:', result);

        // Optional: Show success message to user
        alert(`Thanks ${name}, we've received your message.`);

      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
      }
    });
  }

  if (getForm) {
    getForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const response = await fetch(getForm.action, {
          method: 'GET',
        });

        const result = await response.json();
        console.log('Form submission response:', result);

        alert(result.message);

      } catch (error) {
        console.error('Error submitting form:', error);
      }
    });
  }
});
