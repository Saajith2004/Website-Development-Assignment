// 1. Mobile Navigation Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// 2. Newsletter Form Handler
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('.newsletter-input');
        const email = emailInput.value.trim();

        if (validateEmail(email)) {
            // Save to localStorage
            saveToLocalStorage('newsletterEmails', email);
            alert('Thank you for subscribing!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

// 3. LocalStorage Utilities
function saveToLocalStorage(key, item) {
    const existingData = JSON.parse(localStorage.getItem(key)) || [];
    existingData.push(item);
    localStorage.setItem(key, JSON.stringify(existingData));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// 4. Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 5. Initialize common functionality when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initNewsletter();
});