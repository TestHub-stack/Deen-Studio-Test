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
        // Fallback data in case JSON file can't be loaded
        this.scheduleData = [
            {
                "block": "Magrib",
                "blockIcon": "🌙",
                "startTime": "6:30 PM",
                "endTime": "6:50 PM",
                "items": [
                    { "time": "6:30 PM - 6:50 PM", "activity": "Magrib", "duration": "20 min", "special": true },
                    { "time": "6:50 PM - 7:20 PM", "activity": "Shower", "duration": "30 min", "special": false },
                    { "time": "7:20 PM - 8:30 PM", "activity": "Study", "duration": "1 hr 10 min", "special": false }
                ]
            },
            {
                "block": "Isha",
                "blockIcon": "✨",
                "startTime": "8:30 PM",
                "endTime": "9:40 PM",
                "items": [
                    { "time": "8:30 PM - 9:00 PM", "activity": "Isha", "duration": "30 min", "special": true },
                    { "time": "9:00 PM - 9:40 PM", "activity": "Taraweeh", "duration": "40 min", "special": false },
                    { "time": "9:40 PM - 9:55 PM", "activity": "Surah Al-Waqi'ah & Al-Mulk", "duration": "15 min", "special": false },
                    { "time": "9:55 PM - 10:15 PM", "activity": "Dinner", "duration": "20 min", "special": false },
                    { "time": "10:15 PM - 10:25 PM", "activity": "Skincare", "duration": "10 min", "special": false }
                ]
            },
            {
                "block": "Sleep",
                "blockIcon": "💤",
                "startTime": "10:25 PM",
                "endTime": "4:30 AM",
                "items": [
                    { "time": "10:25 PM - 3:30 AM", "activity": "Sleep", "duration": "5 hr 5 min", "special": false },
                    { "time": "3:30 AM - 3:50 AM", "activity": "Wudu", "duration": "20 min", "special": false },
                    { "time": "3:50 AM - 4:10 AM", "activity": "Tahajjud", "duration": "20 min", "special": false },
                    { "time": "4:10 AM - 4:30 AM", "activity": "Suhur", "duration": "20 min", "special": false }
                ]
            },
            {
                "block": "Fajr",
                "blockIcon": "☀️",
                "startTime": "6:00 AM",
                "endTime": "6:15 AM",
                "items": [
                    { "time": "4:30 AM - 5:00 AM", "activity": "Salatul Tasbih", "duration": "30 min", "special": false },
                    { "time": "5:00 AM - 6:00 AM", "activity": "Quran", "duration": "1 hr", "special": false },
                    { "time": "6:00 AM - 6:15 AM", "activity": "Fajr", "duration": "15 min", "special": true },
                    { "time": "6:15 AM - 6:25 AM", "activity": "Surah Yaseen", "duration": "10 min", "special": false },
                    { "time": "6:25 AM - 6:35 AM", "activity": "Long Dua", "duration": "10 min", "special": false },
                    { "time": "6:35 AM - 7:10 AM", "activity": "Get Ready & Leave", "duration": "35 min", "special": false }
                ]
            },
            {
                "block": "College",
                "blockIcon": "📚",
                "startTime": "7:10 AM",
                "endTime": "5:30 PM",
                "items": [
                    { "time": "7:10 AM - 5:30 PM", "activity": "College / Study", "duration": "10 hr 20 min", "special": false }
                ]
            },
            {
                "block": "Asr",
                "blockIcon": "🌤️",
                "startTime": "5:30 PM",
                "endTime": "6:30 PM",
                "items": [
                    { "time": "5:30 PM - 5:45 PM", "activity": "Wudu", "duration": "15 min", "special": false },
                    { "time": "5:45 PM - 6:00 PM", "activity": "Asr", "duration": "15 min", "special": true },
                    { "time": "6:00 PM - 6:15 PM", "activity": "Quran", "duration": "15 min", "special": false },
                    { "time": "6:15 PM - 6:30 PM", "activity": "Long Dua", "duration": "15 min", "special": false }
                ]
            }
        ];
        
        this.renderSchedule();
        this.addAnimationDelays();
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

    // Force refresh the schedule
    refresh: function() {
        console.log('Refreshing schedule...');
        this.renderSchedule();
        this.addAnimationDelays();
    }
};

// Add refresh function to window
window.refreshPlanner = function() {
    if (DeenStudio.Planner) {
        DeenStudio.Planner.refresh();
    }
};