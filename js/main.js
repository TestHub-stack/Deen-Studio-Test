// main.js - Core namespace and initialization (updated with planner)

const DeenStudio = {
    // State
    state: {
        currentMainTab: 'dua',
        currentSubTab: 'duniya',
        habits: {}  // Will be populated by habits.js
    },

    // Initialize the application
    init: function() {
        // Load settings
        DeenStudio.Settings.init();
        
        // Load duas
        DeenStudio.Duas.init();
        
        // Load habits (this will populate state.habits)
        DeenStudio.Habits.init();
        
        // Initialize planner
        DeenStudio.Planner.init();
        
        // Set up event listeners
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        // Close modal when clicking outside
        document.getElementById('settingsModal').addEventListener('click', function(e) {
            if (e.target === this) {
                DeenStudio.UI.closeSettings();
            }
        });
    },

    // UI Functions
    UI: {
        switchMainTab: function(tab) {
            DeenStudio.state.currentMainTab = tab;
            
            // Update tab buttons
            document.getElementById('tabPlanner').classList.toggle('active', tab === 'planner');
            document.getElementById('tabDua').classList.toggle('active', tab === 'dua');
            document.getElementById('tabHabit').classList.toggle('active', tab === 'habit');
            
            // Show/hide sections
            document.getElementById('plannerSection').classList.toggle('hidden', tab !== 'planner');
            document.getElementById('duaSection').classList.toggle('hidden', tab !== 'dua');
            document.getElementById('habitSection').classList.toggle('hidden', tab !== 'habit');
        },

        switchSubTab: function(tab) {
            DeenStudio.state.currentSubTab = tab;
            
            // Update sub-tab buttons
            document.getElementById('subTabDuniya').classList.toggle('active', tab === 'duniya');
            document.getElementById('subTabAkhira').classList.toggle('active', tab === 'akhira');
            
            // Show/hide sub-sections
            document.getElementById('duniyaSubsection').classList.toggle('hidden', tab !== 'duniya');
            document.getElementById('akhiraSubsection').classList.toggle('hidden', tab !== 'akhira');
        },

        openSettings: function() {
            document.getElementById('settingsModal').classList.add('show');
        },

        closeSettings: function() {
            document.getElementById('settingsModal').classList.remove('show');
        },

        updateSyncStatus: function(text, color) {
            const statusEl = document.getElementById('syncStatus');
            statusEl.textContent = text;
            statusEl.style.color = color;
            statusEl.style.background = `${color}20`;
            statusEl.style.borderColor = `${color}40`;
        }
    },

    // Storage helpers
    Storage: {
        save: function(key, value) {
            try {
                localStorage.setItem('deen_' + key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.log('Storage not available');
                return false;
            }
        },

        load: function(key) {
            try {
                const item = localStorage.getItem('deen_' + key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.log('Storage not available');
                return null;
            }
        }
    }
};