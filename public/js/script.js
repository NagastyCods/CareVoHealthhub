// Small client JS for nav toggle, theme toggle, and booking form submission
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

    // Theme toggle (light / dark)
    const themeToggle = document.getElementById('themeToggle');
    const rootBody = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            rootBody.classList.add('dark');
        } else {
            rootBody.classList.remove('dark');
        }
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (rootBody.classList.contains('dark')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        }
    };

    // Initialize theme from localStorage or system preference
    const storedTheme = window.localStorage.getItem('carevo-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
        applyTheme(storedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = rootBody.classList.toggle('dark');
            const newTheme = isDark ? 'dark' : 'light';
            window.localStorage.setItem('carevo-theme', newTheme);
            applyTheme(newTheme);
        });
    }

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