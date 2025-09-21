class ContactForm {
    constructor() {
        this.form = document.getElementById('feedback-form');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFAQ();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });

        // Real-time validation
        document.getElementById('name').addEventListener('blur', () => this.validateField('name'));
        document.getElementById('email').addEventListener('blur', () => this.validateField('email'));
        document.getElementById('message').addEventListener('blur', () => this.validateField('message'));
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Toggle current item
                item.classList.toggle('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle answer visibility
                const answer = item.querySelector('.faq-answer');
                answer.classList.toggle('active');
            });
        });
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        let isValid = true;

        switch (fieldName) {
            case 'name':
                isValid = field.value.trim().length >= 2;
                break;
            case 'email':
                isValid = this.isValidEmail(field.value);
                break;
            case 'message':
                isValid = field.value.trim().length >= 10;
                break;
        }

        if (!isValid) {
            errorElement.style.display = 'block';
            field.style.borderColor = '#dc3545';
        } else {
            errorElement.style.display = 'none';
            field.style.borderColor = '';
        }

        return isValid;
    }

    validateForm() {
        const fields = ['name', 'email', 'message'];
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submitForm() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        this.saveFeedback(formData);

        // Show success message
        this.showSuccess();

        // Reset form
        this.form.reset();
    }

    saveFeedback(feedback) {
        const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        existingFeedback.push(feedback);
        localStorage.setItem('feedback', JSON.stringify(existingFeedback));
    }

    showSuccess() {
        const successMessage = document.getElementById('success-message');
        successMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
        question.querySelector('.faq-toggle').textContent = 
            item.classList.contains('active') ? '−' : '+';
    });
});