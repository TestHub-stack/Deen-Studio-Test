// planner.js - Daily Planner functionality with JSON data loading

DeenStudio.Planner = {
    scheduleData: [],
    
    init: function() {
        console.log('Planner initializing...');
        this.loadScheduleData();
    },

    loadScheduleData: function() {
        console.log('Loading schedule data...');
        
        // Try multiple possible paths
        const possiblePaths = [
            'data/ramadan-schedule.json',
            '../data/ramadan-schedule.json',
            '/data/ramadan-schedule.json',
            'ramadan-schedule.json'
        ];
        
        const tryPath = (index) => {
            if (index >= possiblePaths.length) {
                console.log('All paths failed, using fallback data');
                this.useFallbackData();
                return;
            }
            
            fetch(possiblePaths[index])
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Not found');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Schedule data loaded successfully from:', possiblePaths[index]);
                    this.scheduleData = data;
                    this.renderSchedule();
                    this.addAnimationDelays();
                    this.updateTimeDistribution();
                })
                .catch(error => {
                    console.log('Failed to load from:', possiblePaths[index]);
                    tryPath(index + 1);
                });
        };
        
        tryPath(0);
    },
    useFallbackData: function() {
        console.log('Using fallback data');
        // Fallback data with updated schedule
        this.scheduleData = [
            {
                "block": "Magrib",
                "blockIcon": "🌙",
                "startTime": "6:30 PM",
                "endTime": "6:45 PM",
                "items": [
                    { "time": "6:30 PM - 6:45 PM", "activity": "Magrib", "duration": "15 min", "special": true },
                    { "time": "6:45 PM - 8:45 PM", "activity": "Trading", "duration": "2 hr", "special": false },
                    { "time": "8:45 PM - 9:00 PM", "activity": "Wudu", "duration": "15 min", "special": false }
                ]
            },
            {
                "block": "Isha",
                "blockIcon": "✨",
                "startTime": "9:25 PM",
                "endTime": "10:00 PM",
                "items": [
                    { "time": "9:00 PM - 9:05 PM", "activity": "Isha", "duration": "5 min", "special": true },
                    { "time": "9:05 PM - 9:15 PM", "activity": "Nafils", "duration": "10 min", "special": false },
                    { "time": "9:15 PM - 9:20 PM", "activity": "Surah Al-Waqi'ah", "duration": "5 min", "special": false },
                    { "time": "9:20 PM - 9:25 PM", "activity": "Short Dua", "duration": "5 min", "special": false },
                    { "time": "9:25 PM - 10:00 PM", "activity": "Dinner", "duration": "35 min", "special": false },
                    { "time": "10:00 PM - 11:30 PM", "activity": "Relax", "duration": "1 hr 30 min", "special": false }
                ]
            },
            {
                "block": "Sleep",
                "blockIcon": "💤",
                "startTime": "11:30 PM",
                "endTime": "4:00 AM",
                "items": [
                    { "time": "11:30 PM - 4:00 AM", "activity": "Sleep", "duration": "4 hr 30 min", "special": false },
                    { "time": "4:00 AM - 4:45 AM", "activity": "Suhur", "duration": "45 min", "special": false },
                    { "time": "4:45 AM - 5:00 AM", "activity": "Wudu", "duration": "15 min", "special": false },
                    { "time": "5:00 AM - 5:15 AM", "activity": "Tahajjud", "duration": "15 min", "special": false },
                    { "time": "5:15 AM - 5:45 AM", "activity": "Salatul Tasbih", "duration": "30 min", "special": false }
                ]
            },
            {
                "block": "Fajr",
                "blockIcon": "☀️",
                "startTime": "5:45 AM",
                "endTime": "5:55 AM",
                "items": [
                    { "time": "5:45 AM - 5:55 AM", "activity": "Fajr", "duration": "10 min", "special": true },
                    { "time": "5:55 AM - 6:00 AM", "activity": "Short Dua", "duration": "5 min", "special": false },
                    { "time": "6:00 AM - 7:00 AM", "activity": "Quran", "duration": "1 hr", "special": false },
                    { "time": "7:00 AM - 10:00 AM", "activity": "Nap", "duration": "3 hr", "special": false },
                    { "time": "10:00 AM - 10:30 AM", "activity": "Shower", "duration": "30 min", "special": false },
                    { "time": "10:30 AM - 12:30 PM", "activity": "Memorization", "duration": "2 hr", "special": false }
                ]
            },
            {
                "block": "Dhuhr",
                "blockIcon": "🌤️",
                "startTime": "12:30 PM",
                "endTime": "12:45 PM",
                "items": [
                    { "time": "12:30 PM - 12:45 PM", "activity": "Dhuhr", "duration": "15 min", "special": true },
                    { "time": "12:45 PM - 1:00 PM", "activity": "Long Dua", "duration": "15 min", "special": false },
                    { "time": "1:00 PM - 4:00 PM", "activity": "Trading", "duration": "3 hr", "special": false },
                    { "time": "4:00 PM - 4:15 PM", "activity": "Wudu", "duration": "15 min", "special": false },
                    { "time": "4:15 PM - 4:30 PM", "activity": "Revision", "duration": "15 min", "special": false }
                ]
            },
            {
                "block": "Asr",
                "blockIcon": "🌆",
                "startTime": "4:30 PM",
                "endTime": "4:40 PM",
                "items": [
                    { "time": "4:30 PM - 4:40 PM", "activity": "Asr", "duration": "10 min", "special": true },
                    { "time": "4:40 PM - 4:45 PM", "activity": "Short Dua", "duration": "5 min", "special": false },
                    { "time": "4:45 PM - 6:05 PM", "activity": "Quran", "duration": "1 hr 20 min", "special": false },
                    { "time": "6:05 PM - 6:30 PM", "activity": "Long Dua", "duration": "25 min", "special": false }
                ]
            }
        ];
        
        this.renderSchedule();
        this.addAnimationDelays();
        this.updateTimeDistribution();
    },

    renderSchedule: function() {
        console.log('Rendering schedule...');
        const container = document.querySelector('.timeline');
        if (!container) {
            console.log('Timeline container not found');
            return;
        }
        
        container.innerHTML = '';
        
        this.scheduleData.forEach((block, blockIndex) => {
            const blockEl = document.createElement('div');
            blockEl.className = 'timeline-block';
            blockEl.setAttribute('data-block-index', blockIndex);
            
            let itemsHtml = '';
            block.items.forEach((item, itemIndex) => {
                // Create a unique ID for each timeline item
                const itemId = `item-${blockIndex}-${itemIndex}`;
                itemsHtml += `
                    <div class="timeline-item${item.special ? ' special-activity' : ''}" id="${itemId}">
                        <div class="item-time">${item.time}</div>
                        <div class="item-content">
                            <span class="item-activity">${item.activity}</span>
                            <span class="item-duration">${item.duration}</span>
                        </div>
                    </div>
                `;
            });

            // Show header for all blocks
            blockEl.innerHTML = `
                <div class="timeline-block-header">
                    <span class="block-icon">${block.blockIcon}</span>
                    <span class="block-title">${block.block}</span>
                    <span class="block-time">${block.startTime} - ${block.endTime}</span>
                </div>
                <div class="timeline-items">
                    ${itemsHtml}
                </div>
            `;
            
            container.appendChild(blockEl);
        });
        
        // Log what was rendered
        console.log('Schedule rendered. Blocks:', this.scheduleData.length);
        this.scheduleData.forEach((block, i) => {
            console.log(`Block ${i}: ${block.block} - ${block.items.length} items`);
        });
        
        // Force a style recalculation
        document.body.style.display = 'none';
        document.body.style.display = '';
    },

    addAnimationDelays: function() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    },

    updateTimeDistribution: function() {
        // Update the time distribution cards with the new totals
        const distribItems = document.querySelectorAll('.distrib-value');
        if (distribItems.length >= 5) {
            // Deen: 4:15 (Magrib + Isha + Nafils + Tahajjud + Salatul Tasbih + Fajr + Dhuhr + Asr)
            distribItems[0].textContent = '4:15';
            // Quran: 2:25 (Quran after Fajr + Quran after Asr)
            distribItems[1].textContent = '2:25';
            // Memorization: 2:15 (Memorization + Revision)
            distribItems[2].textContent = '2:15';
            // Trading: 5:00 (Trading after Magrib + Trading after Dhuhr)
            distribItems[3].textContent = '5:00';
            // Sleep: 7:30 (Sleep + Nap)
            distribItems[4].textContent = '7:30';
        }
    },

    // Force refresh the schedule
    refresh: function() {
        console.log('Refreshing schedule...');
        this.renderSchedule();
        this.addAnimationDelays();
        this.updateTimeDistribution();
    }
};

// Add refresh function to window
window.refreshPlanner = function() {
    if (DeenStudio.Planner) {
        DeenStudio.Planner.refresh();
    }
};