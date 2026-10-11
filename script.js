document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.simple-contact-form, .contact-form');

    forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                message: form.message ? form.message.value.trim() : ''
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                alert(result.message || 'Your inquiry was submitted.');

                if (response.ok) {
                    form.reset();
                }
            } catch (error) {
                alert('Something went wrong. Please try again later.');
            }
        });
    });
});
