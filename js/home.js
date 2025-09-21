class Home {
    constructor() {
        this.rotatingTexts = [
            "Healthy eating made simple",
            "Fitness routines for everyone",
            "Mindfulness at your fingertips",
            "Your wellness journey starts here",
            "Transform your lifestyle today"
        ];
        
        this.healthTips = [
            "Start your day with a glass of lemon water to kickstart your metabolism.",
            "Remember to take a 5-minute stretch break every hour if you work at a desk.",
            "Aim for at least 30 minutes of moderate activity today.",
            "A handful of nuts is a great source of healthy fats and energy.",
            "Stay hydrated! Drink at least 8 glasses of water daily.",
            "Get 7-9 hours of quality sleep each night for optimal health.",
            "Include a source of protein in every meal to stay full longer.",
            "Practice deep breathing for 2 minutes to reduce stress.",
            "Take the stairs instead of the elevator when possible.",
            "Include colorful vegetables in every meal for diverse nutrients."
        ];
        
        this.init();
    }

    init() {
        this.startTextRotation();
        this.setDailyTip();
        this.animateStats();
        this.setupAnimations();
    }

    startTextRotation() {
        const textElement = document.getElementById('rotating-text');
        if (!textElement) return;

        let currentIndex = 0;

        const rotateText = () => {
            textElement.style.opacity = 0;
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % this.rotatingTexts.length;
                textElement.textContent = this.rotatingTexts[currentIndex];
                textElement.style.opacity = 1;
            }, 500);
        };

        setTimeout(() => {
            setInterval(rotateText, 3000);
        }, 2000);
    }

    setDailyTip() {
        const tipElement = document.getElementById('daily-tip-text');
        if (!tipElement) return;

        tipElement.textContent = this.getDailyTip();
    }

    getDailyTip() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const tipIndex = dayOfYear % this.healthTips.length;
        return this.healthTips[tipIndex];
    }

    animateStats() {
        const statElements = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = Math.round(target * progress);

            element.textContent = currentValue;

            if (frame === totalFrames) {
                clearInterval(counter);
                element.textContent = target;
            }
        }, frameDuration);
    }

    setupAnimations() {
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Home();
});