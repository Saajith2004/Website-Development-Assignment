class WorkoutGenerator {
    constructor() {
        this.workouts = [];
        this.currentWorkout = null;
        this.filteredWorkouts = [];
        this.init();
    }

    async init() {
        await this.loadWorkouts();
        this.setupEventListeners();
        console.log('Workout generator initialized');
    }

    async loadWorkouts() {
        try {
            const response = await fetch('data/workouts.json');
            this.workouts = await response.json();
            console.log('Loaded workouts:', this.workouts);
        } catch (error) {
            console.error('Error loading workouts:', error);
            // Fallback to basic workouts if JSON fails
            this.workouts = this.getFallbackWorkouts();
        }
    }

    getFallbackWorkouts() {
        return [
            {
                "id": 1,
                "name": "Jumping Jacks",
                "description": "A full-body cardiovascular exercise. Stand with feet together and arms at sides, then jump while raising arms and spreading legs.",
                "bodyPart": "Full Body",
                "equipment": "None",
                "image": "images/workout-placeholder.jpg",
                "duration": 60
            },
            {
                "id": 2,
                "name": "Push-Ups",
                "description": "A classic upper body exercise. Keep your body in a straight line from head to heels, lower your chest to the floor, then push back up.",
                "bodyPart": "Arms",
                "equipment": "None",
                "image": "images/workout-placeholder.jpg",
                "duration": 45
            }
        ];
    }

    setupEventListeners() {
        const form = document.getElementById('workout-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generateWorkout();
            });
        }
    }

    generateWorkout() {
        const bodyPart = document.getElementById('body-part').value;
        const equipment = document.getElementById('equipment').value;

        if (!bodyPart || !equipment) {
            alert('Please select both body part and equipment.');
            return;
        }

        // Filter workouts based on selection
        this.filteredWorkouts = this.workouts.filter(workout => 
            workout.bodyPart === bodyPart && workout.equipment === equipment
        );

        if (this.filteredWorkouts.length === 0) {
            this.showNoWorkoutsMessage();
            return;
        }

        // Select random workout
        this.currentWorkout = this.filteredWorkouts[Math.floor(Math.random() * this.filteredWorkouts.length)];
        this.displayWorkout(this.currentWorkout);
    }

    showNoWorkoutsMessage() {
        document.getElementById('workout-result').style.display = 'none';
        document.getElementById('no-workouts').style.display = 'block';
    }

    displayWorkout(workout) {
        document.getElementById('no-workouts').style.display = 'none';
        const resultSection = document.getElementById('workout-result');
        resultSection.style.display = 'block';

        // Update workout details
        document.getElementById('exercise-name').textContent = workout.name;
        document.getElementById('exercise-description').textContent = workout.description;
        
        // Set image - use placeholder if image doesn't exist
        const imageElement = document.getElementById('workout-image');
        imageElement.src = workout.image;
        imageElement.alt = workout.name;
        imageElement.onerror = function() {
            this.src = 'images/workout-placeholder.jpg';
        };

        // Update metadata
        document.getElementById('workout-bodypart').textContent = workout.bodyPart;
        document.getElementById('workout-equipment').textContent = workout.equipment;
        document.getElementById('workout-duration').textContent = `${workout.duration} seconds`;

        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateNewWorkout() {
        if (this.filteredWorkouts.length > 1) {
            // Get a different random workout from the filtered list
            let newWorkout;
            do {
                newWorkout = this.filteredWorkouts[Math.floor(Math.random() * this.filteredWorkouts.length)];
            } while (newWorkout.id === this.currentWorkout.id && this.filteredWorkouts.length > 1);
            
            this.currentWorkout = newWorkout;
            this.displayWorkout(this.currentWorkout);
        } else {
            alert('Only one workout available for this selection.');
        }
    }
}

// Global function for the button
function generateNewWorkout() {
    if (window.workoutGenerator) {
        window.workoutGenerator.generateNewWorkout();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.workoutGenerator = new WorkoutGenerator();
});