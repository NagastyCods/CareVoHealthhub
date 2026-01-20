// Small client JS for nav toggle and booking form submission
document.addEventListener('DOMContentLoaded', () => {
    // Nav toggle for mobile
    const toggles = document.querySelectorAll('.nav-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const nav = document.querySelector('.nav-list');
            if (!nav) return;
            nav.classList.toggle('show');
        });
    });

    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const respEl = document.getElementById('bookingResponse');
            respEl.textContent = 'Sending...';

            // Collect form data
            const formData = new FormData(bookingForm);
            const tests = [];
            bookingForm.querySelectorAll('input[name="tests"]:checked').forEach(cb => tests.push(cb.value));

            const payload = {
                fullName: formData.get('fullName') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                age: formData.get('age') || '',
                sex: formData.get('sex') || '',
                institution: formData.get('institution') || '',
                symptoms: formData.get('symptoms') || '',
                conditions: formData.get('conditions') || '',
                meds: formData.get('meds') || '',
                tests,
                date: formData.get('date') || '',
                timeSlot: formData.get('timeSlot') || '',
                consent: formData.get('consent') ? true : false
            };

            // Basic client validation
            if (!payload.fullName || !payload.phone || !payload.age || !payload.sex || !payload.institution || !payload.consent) {
                respEl.textContent = 'Please complete required fields and consent before submitting.';
                return;
            }

            try {
                const res = await fetch("/api/bookings", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (result && result.success) {
                    respEl.textContent = result.message || 'Request sent.';
                    bookingForm.reset();
                } else {
                    respEl.textContent = (result && result.message) || 'Server error. Try again later.';
                }
            } catch (err) {
                console.error(err);
                respEl.textContent = 'Network error. Try again later.';
            }
        });
    }
});