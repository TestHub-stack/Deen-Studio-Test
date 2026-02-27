// habits.js - Habit tracker functionality with external data

DeenStudio.Habits = {
    // Storage keys
    storageKey: 'habits_v1',
    lastDateKey: 'last_date_v1',
    
    // Habits data (will be loaded from JSON)
    habitsList: [],

    init: function() {
        // First load habits data from JSON
        this.loadHabitsData()
            .then(() => {
                this.load();
                this.setupAutoReset();
                this.checkStorageAvailability();
            });
    },

    loadHabitsData: function() {
        return fetch('data/habits.json')
            .then(response => response.json())
            .then(data => {
                this.habitsList = data;
                // Initialize state with these habits (all false initially)
                if (Object.keys(DeenStudio.state.habits).length === 0) {
                    data.forEach((_, index) => {
                        DeenStudio.state.habits[index + 1] = false;
                    });
                }
            })
            .catch(error => {
                console.log('Error loading habits data, using defaults', error);
                // Default fallback habits
                this.habitsList = [
                    "Fajr prayer on time",
                    "Read Quran (minimum 1 page)",
                    "Dhuhr prayer on time",
                    "Asr prayer on time",
                    "Maghrib prayer on time",
                    "Isha & Taraweeh prayer",
                    "Make dua after each prayer",
                    "Give charity (even small amount)"
                ];
                // Initialize state with default habits
                this.habitsList.forEach((_, index) => {
                    DeenStudio.state.habits[index + 1] = false;
                });
            });
    },

    load: function() {
        const saved = DeenStudio.Storage.load(this.storageKey);
        if (saved) {
            // Only load if the structure matches current habits count
            if (Object.keys(saved).length === this.habitsList.length) {
                DeenStudio.state.habits = saved;
            }
        }
        
        this.checkAndResetForNewDay();
        this.renderAll();
        this.updateCounter();
    },

    save: function() {
        DeenStudio.Storage.save(this.storageKey, DeenStudio.state.habits);
    },

    checkAndResetForNewDay: function() {
        const today = new Date().toDateString();
        const lastDate = DeenStudio.Storage.load(this.lastDateKey);
        
        if (lastDate && lastDate !== today) {
            // Reset all habits for new day
            for (let id = 1; id <= this.habitsList.length; id++) {
                DeenStudio.state.habits[id] = false;
            }
            DeenStudio.Storage.save(this.lastDateKey, today);
            this.save();
        } else if (!lastDate) {
            DeenStudio.Storage.save(this.lastDateKey, today);
        }
    },

    toggle: function(habitId) {
        DeenStudio.state.habits[habitId] = !DeenStudio.state.habits[habitId];
        this.updateUI(habitId);
        this.save();
        this.updateCounter();
    },

    renderAll: function() {
        const container = document.getElementById('habitList');
        container.innerHTML = '';
        
        this.habitsList.forEach((habit, index) => {
            const habitId = index + 1;
            const item = document.createElement('div');
            item.className = 'habit-item';
            item.setAttribute('onclick', `DeenStudio.Habits.toggle(${habitId})`);
            
            const checked = DeenStudio.state.habits[habitId];
            
            item.innerHTML = `
                <div class="habit-checkbox ${checked ? 'checked' : ''}" id="checkbox-${habitId}">${checked ? '✓' : ''}</div>
                <span class="habit-text ${checked ? 'completed' : ''}" id="habit-text-${habitId}">${habit}</span>
            `;
            
            container.appendChild(item);
        });
    },

    updateUI: function(habitId) {
        const checkbox = document.getElementById(`checkbox-${habitId}`);
        const habitText = document.getElementById(`habit-text-${habitId}`);
        
        if (DeenStudio.state.habits[habitId]) {
            checkbox.classList.add('checked');
            checkbox.textContent = '✓';
            habitText.classList.add('completed');
        } else {
            checkbox.classList.remove('checked');
            checkbox.textContent = '';
            habitText.classList.remove('completed');
        }
    },

    updateCounter: function() {
        const completed = Object.values(DeenStudio.state.habits).filter(h => h).length;
        document.getElementById('habitsDone').textContent = `${completed}/${this.habitsList.length}`;
    },

    setupAutoReset: function() {
        // Check every minute for day change
        setInterval(() => {
            const today = new Date().toDateString();
            const lastDate = DeenStudio.Storage.load(this.lastDateKey);
            
            if (lastDate && lastDate !== today) {
                for (let id = 1; id <= this.habitsList.length; id++) {
                    DeenStudio.state.habits[id] = false;
                }
                DeenStudio.Storage.save(this.lastDateKey, today);
                this.save();
                this.renderAll();
                this.updateCounter();
            }
        }, 60000);
    },

    checkStorageAvailability: function() {
        const storageWorks = DeenStudio.Storage.save('test', 'test');
        if (!storageWorks) {
            DeenStudio.UI.updateSyncStatus('⚠️ private mode', '#ef4444');
        }
    },

    // Future: Add/Edit/Delete habit functions
    addHabit: function(text) {
        if (!text.trim()) return;
        this.habitsList.push(text.trim());
        const newId = this.habitsList.length;
        DeenStudio.state.habits[newId] = false;
        this.renderAll();
        this.updateCounter();
        // Could save to server here if needed
    },

    deleteHabit: function(index) {
        this.habitsList.splice(index, 1);
        // Reorganize state
        const newState = {};
        this.habitsList.forEach((_, idx) => {
            newState[idx + 1] = DeenStudio.state.habits[idx + 2] || false;
        });
        DeenStudio.state.habits = newState;
        this.renderAll();
        this.updateCounter();
    }
};