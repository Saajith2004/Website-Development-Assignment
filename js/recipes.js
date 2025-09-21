class RecipeManager {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.init();
    }

    async init() {
        await this.loadRecipes();
        this.displayRecipes();
        this.setupEventListeners();
    }

    async loadRecipes() {
        try {
            const response = await fetch('data/recipes.json');
            this.recipes = await response.json();
            this.filteredRecipes = [...this.recipes];
        } catch (error) {
            console.error('Error loading recipes:', error);
        }
    }

    displayRecipes() {
        const container = document.getElementById('recipes-container');
        if (!container) return;

        container.innerHTML = this.filteredRecipes.map(recipe => `
            <div class="recipe-card" data-id="${recipe.id}">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-description">${recipe.description}</p>
                    <span class="recipe-category">${recipe.category}</span>
                </div>
            </div>
        `).join('');

        // Add click event to each card
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const recipeId = parseInt(card.dataset.id);
                this.showRecipeModal(recipeId);
            });
        });
    }

    showRecipeModal(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const modal = document.getElementById('recipe-modal');
        const modalContent = document.getElementById('modal-content');

        modalContent.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="modal-image">
            <h2>${recipe.title}</h2>
            <p>${recipe.description}</p>
            
            <h3>Ingredients</h3>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            
            <h3>Instructions</h3>
            <ol>
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            
            <h3>Nutrition Information</h3>
            <table class="nutrition-table">
                <tr>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Carbs</th>
                    <th>Fat</th>
                </tr>
                <tr>
                    <td>${recipe.nutrition.calories}</td>
                    <td>${recipe.nutrition.protein}</td>
                    <td>${recipe.nutrition.carbs}</td>
                    <td>${recipe.nutrition.fat}</td>
                </tr>
            </table>
        `;

        modal.style.display = 'block';
    }

    filterRecipes() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-filter').value;

        this.filteredRecipes = this.recipes.filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) || 
                                recipe.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === '' || recipe.category === category;
            return matchesSearch && matchesCategory;
        });

        this.displayRecipes();
    }

    setupEventListeners() {
        // Search and filter
        document.getElementById('search-input').addEventListener('input', () => this.filterRecipes());
        document.getElementById('category-filter').addEventListener('change', () => this.filterRecipes());

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('recipe-modal').style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('recipe-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipeManager();
});