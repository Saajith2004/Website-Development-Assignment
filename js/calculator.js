class CalorieCalculator {
    constructor() {
        this.form = document.getElementById('calorie-form');
        this.results = document.getElementById('results');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateResults();
        });
    }

    calculateResults() {
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const height = parseInt(document.getElementById('height').value);
        const weight = parseInt(document.getElementById('weight').value);
        const activityFactor = parseFloat(document.getElementById('activity').value);

        if (!age || !gender || !height || !weight || !activityFactor) {
            alert('Please fill in all fields correctly.');
            return;
        }

        let bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        const tdee = bmr * activityFactor;

        const carbsGrams = Math.round((tdee * 0.50) / 4);
        const proteinGrams = Math.round((tdee * 0.20) / 4);
        const fatGrams = Math.round((tdee * 0.30) / 9);

        this.displayResults(bmr, tdee, carbsGrams, proteinGrams, fatGrams);
    }

    displayResults(bmr, tdee, carbsGrams, proteinGrams, fatGrams) {
        this.results.style.display = 'block';

        document.getElementById('bmr-result').textContent = `${Math.round(bmr)} calories`;
        document.getElementById('tdee-result').textContent = `${Math.round(tdee)} calories`;

        document.getElementById('carbs-grams').textContent = `${carbsGrams}g`;
        document.getElementById('protein-grams').textContent = `${proteinGrams}g`;
        document.getElementById('fat-grams').textContent = `${fatGrams}g`;

        this.animateProgress('carbs-bar', 50, 1500);
        this.animateProgress('protein-bar', 20, 1500);
        this.animateProgress('fat-bar', 30, 1500);

        this.results.scrollIntoView({ behavior: 'smooth' });
    }

    animateProgress(elementId, targetWidth, duration) {
        const element = document.getElementById(elementId);
        let startWidth = 0;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentWidth = startWidth + (targetWidth - startWidth) * progress;
            element.style.width = currentWidth + '%';

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalorieCalculator();
});