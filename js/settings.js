// settings.js - Theme and font settings

DeenStudio.Settings = {
    currentTheme: 'dark',
    currentFontSize: 16,

    init: function() {
        // Load saved settings
        const savedTheme = DeenStudio.Storage.load('theme');
        if (savedTheme) this.currentTheme = savedTheme;
        
        const savedFontSize = DeenStudio.Storage.load('font_size');
        if (savedFontSize) this.currentFontSize = parseInt(savedFontSize);
        
        // Apply settings
        this.apply();
        
        // Save defaults if not set
        if (!savedTheme) DeenStudio.Storage.save('theme', 'dark');
        if (!savedFontSize) DeenStudio.Storage.save('font_size', 16);
    },

    apply: function() {
        // Apply theme
        if (this.currentTheme === 'light') {
            document.body.classList.add('light-mode');
            document.getElementById('lightThemeBtn')?.classList.add('active');
            document.getElementById('darkThemeBtn')?.classList.remove('active');
        } else {
            document.body.classList.remove('light-mode');
            document.getElementById('darkThemeBtn')?.classList.add('active');
            document.getElementById('lightThemeBtn')?.classList.remove('active');
        }

        // Apply font size
        document.documentElement.style.setProperty('--font-size-base', this.currentFontSize + 'px');
        document.body.style.fontSize = this.currentFontSize + 'px';
        
        // Update slider and display
        const slider = document.getElementById('fontSizeSlider');
        const display = document.getElementById('fontSizeDisplay');
        if (slider) slider.value = this.currentFontSize;
        if (display) display.textContent = this.currentFontSize + 'px';
    },

    setTheme: function(theme) {
        this.currentTheme = theme;
        DeenStudio.Storage.save('theme', theme);
        this.apply();
    },

    updateFontSize: function(size) {
        this.currentFontSize = parseInt(size);
        DeenStudio.Storage.save('font_size', this.currentFontSize);
        document.getElementById('fontSizeDisplay').textContent = this.currentFontSize + 'px';
        document.documentElement.style.setProperty('--font-size-base', this.currentFontSize + 'px');
        document.body.style.fontSize = this.currentFontSize + 'px';
    }
};