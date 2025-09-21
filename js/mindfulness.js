class MindfulnessApp {
    constructor() {
        this.breathingInterval = null;
        this.meditationTimer = null;
        this.meditationTimeLeft = 600; // 10 minutes in seconds
        this.isMeditationRunning = false;
        this.currentSound = null;
        this.soundElements = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSessionData();
        this.initializeSounds();
    }

    setupEventListeners() {
        // Breathing controls
        document.getElementById('start-breathing').addEventListener('click', () => this.startBreathing());
        document.getElementById('stop-breathing').addEventListener('click', () => this.stopBreathing());

        // Meditation timer controls
        document.getElementById('start-meditation').addEventListener('click', () => this.startMeditation());
        document.getElementById('pause-meditation').addEventListener('click', () => this.pauseMeditation());
        document.getElementById('reset-meditation').addEventListener('click', () => this.resetMeditation());

        // Timer presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const time = parseInt(e.target.dataset.time);
                this.setMeditationTime(time);
            });
        });

        // Sound controls
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sound = e.target.dataset.sound;
                this.toggleSound(sound);
            });
        });
    }

    initializeSounds() {
        // Create audio elements for ambient sounds
        this.soundElements = {
            'rain': new Audio('sounds/rain.mp3'),
            'forest': new Audio('sounds/forest.mp3'),
            'waves': new Audio('sounds/waves.mp3'),
            'ocean': new Audio('sounds/ocean.mp3')
        };

        // Set audio properties
        Object.values(this.soundElements).forEach(audio => {
            audio.loop = true;
            audio.volume = 0.3;
        });
    }

    startBreathing() {
        if (this.breathingInterval) return;

        const circle = document.getElementById('breathing-circle');
        let phase = 'inhale';
        let time = 0;

        this.breathingInterval = setInterval(() => {
            time++;

            if (phase === 'inhale' && time <= 4) {
                circle.classList.add('inhale');
                circle.classList.remove('exhale');
            } else if (phase === 'inhale' && time > 4 && time <= 6) {
                // Hold breath
                circle.classList.add('inhale');
            } else if (phase === 'inhale' && time > 6) {
                phase = 'exhale';
                time = 0;
            } else if (phase === 'exhale' && time <= 6) {
                circle.classList.add('exhale');
                circle.classList.remove('inhale');
            } else if (phase === 'exhale' && time > 6) {
                phase = 'inhale';
                time = 0;
            }
        }, 1000);
    }

    stopBreathing() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
            
            const circle = document.getElementById('breathing-circle');
            circle.classList.remove('inhale', 'exhale');
        }
    }

    setMeditationTime(seconds) {
        this.meditationTimeLeft = seconds;
        this.updateMeditationDisplay();
    }

    startMeditation() {
        if (this.isMeditationRunning) return;

        this.isMeditationRunning = true;
        this.meditationTimer = setInterval(() => {
            this.meditationTimeLeft--;
            this.updateMeditationDisplay();

            if (this.meditationTimeLeft <= 0) {
                this.completeMeditation();
            }
        }, 1000);
    }

    pauseMeditation() {
        if (!this.isMeditationRunning) return;

        this.isMeditationRunning = false;
        clearInterval(this.meditationTimer);
    }

    resetMeditation() {
        this.pauseMeditation();
        this.meditationTimeLeft = 600; // Reset to 10 minutes
        this.updateMeditationDisplay();
    }

    updateMeditationDisplay() {
        const minutes = Math.floor(this.meditationTimeLeft / 60);
        const seconds = this.meditationTimeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('meditation-timer').textContent = display;
    }

    completeMeditation() {
        this.pauseMeditation();
        alert('Meditation session complete! 🧘‍♀️');
        this.recordSession();
    }

    toggleSound(soundName) {
        const sound = this.soundElements[soundName];
        const button = document.querySelector(`[data-sound="${soundName}"]`);

        // Stop current sound if playing
        if (this.currentSound && this.currentSound !== sound) {
            this.currentSound.pause();
            document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('active'));
        }

        // Toggle selected sound
        if (sound.paused) {
            sound.play();
            button.classList.add('active');
            this.currentSound = sound;
        } else {
            sound.pause();
            button.classList.remove('active');
            this.currentSound = null;
        }
    }

    recordSession() {
        const today = new Date().toDateString();
        const sessions = JSON.parse(localStorage.getItem('meditationSessions') || '{}');
        
        sessions[today] = (sessions[today] || 0) + 1;
        localStorage.setItem('meditationSessions', JSON.stringify(sessions));
        
        this.loadSessionData();
    }

    loadSessionData() {
        const sessions = JSON.parse(localStorage.getItem('meditationSessions') || '{}');
        const today = new Date().toDateString();
        const todaySessions = sessions[today] || 0;

        // Calculate weekly sessions
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        let weeklySessions = 0;
        Object.entries(sessions).forEach(([date, count]) => {
            if (new Date(date) >= oneWeekAgo) {
                weeklySessions += count;
            }
        });

        document.getElementById('session-count').textContent = todaySessions;
        document.getElementById('weekly-sessions').textContent = weeklySessions;
    }
}

// Initialize mindfulness app
document.addEventListener('DOMContentLoaded', () => {
    new MindfulnessApp();
});