// duas.js - Dua list management with external JSON

DeenStudio.Duas = {
    // Duas data (will be loaded from JSON)
    duas: {
        duniya: [],
        akhira: []
    },

    init: function() {
        // Load both dua lists
        Promise.all([
            this.loadDuaData('duniya'),
            this.loadDuaData('akhira')
        ]).then(() => {
            this.renderDuniya();
            this.renderAkhira();
            this.updateTotalCount();
        });
    },

    loadDuaData: function(type) {
        return fetch(`data/${type}-duas.json`)
            .then(response => response.json())
            .then(data => {
                this.duas[type] = data;
                // Save to storage for offline use
                DeenStudio.Storage.save(`duas_${type}`, data);
            })
            .catch(error => {
                console.log(`Error loading ${type} duas, using defaults`, error);
                // Try to load from storage
                const saved = DeenStudio.Storage.load(`duas_${type}`);
                if (saved) {
                    this.duas[type] = saved;
                } else {
                    // Ultimate fallback defaults
                    this.duas[type] = type === 'duniya' 
                        ? ["Guide us in all worldly affairs", "Grant barakah in our rizq", "Bless our homes"]
                        : ["Grant us Jannah", "Forgive our sins", "Make our scales heavy"];
                }
            });
    },

    renderDuniya: function() {
        const container = document.getElementById('duniyaList');
        container.innerHTML = '';
        
        this.duas.duniya.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'dua-item';
            item.innerHTML = `
                <span class="dua-text">${index + 1}. ${text}</span>
            `;
            container.appendChild(item);
        });
    },

    renderAkhira: function() {
        const container = document.getElementById('akhiraList');
        container.innerHTML = '';
        
        this.duas.akhira.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'dua-item';
            item.innerHTML = `
                <span class="dua-text">${index + 1}. ${text}</span>
            `;
            container.appendChild(item);
        });
    },

    updateTotalCount: function() {
        const total = this.duas.duniya.length + this.duas.akhira.length;
        document.getElementById('totalDuas').textContent = total;
    },

    // For future: Add/Edit/Delete functions
    addDua: function(type, text) {
        if (!text.trim()) return;
        this.duas[type].push(text.trim());
        DeenStudio.Storage.save(`duas_${type}`, this.duas[type]);
        
        if (type === 'duniya') this.renderDuniya();
        else this.renderAkhira();
        
        this.updateTotalCount();
    },

    deleteDua: function(type, index) {
        this.duas[type].splice(index, 1);
        DeenStudio.Storage.save(`duas_${type}`, this.duas[type]);
        
        if (type === 'duniya') this.renderDuniya();
        else this.renderAkhira();
        
        this.updateTotalCount();
    }
};