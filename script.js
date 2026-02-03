// CONFIGURATION
const CONFIG = {
    WORKER_URL: "https://vey.m-fatihyumna20.workers.dev",
    USER_ID: 8348455289,
    UPDATE_INTERVAL: 30000, // 30 detik (30000 ms)
    COUNTDOWN_START: 30, // 30 detik
    AVATAR_URL: "https://tr.rbxcdn.com/8348455289/420/420/AvatarHeadshot/Png",
    
    // Admin credentials (in production, should be server-side)
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD: "admin123"
};

// STATE MANAGEMENT
const state = {
    // User status
    countdown: CONFIG.COUNTDOWN_START,
    countdownInterval: null,
    isRefreshing: false,
    lastStatus: null,
    lastRefreshTime: null,
    
    // Playtime system
    playtimeData: null,
    playtimeInterval: null,
    isPlaytimePaused: false,
    lastUserStatus: null,
    
    // Admin
    isAdminLoggedIn: false
};

// DOM ELEMENTS
const elements = {
    // Time indicator
    timeIcon: document.getElementById('timeIcon'),
    timeText: document.getElementById('timeText'),
    
    // Status
    statusIndicator: document.getElementById('statusIndicator'),
    statusText: document.getElementById('statusText'),
    avatarStatus: document.getElementById('avatarStatus'),
    apiStatus: document.getElementById('apiStatus'),
    
    // Profile
    avatarImg: document.getElementById('avatarImg'),
    username: document.getElementById('username'),
    displayName: document.getElementById('displayName'),
    
    // Playtime
    playtimeCounter: document.getElementById('playtimeCounter'),
    playtimeToday: document.getElementById('playtimeToday'),
    playtimeWeek: document.getElementById('playtimeWeek'),
    playtimeMonth: document.getElementById('playtimeMonth'),
    playtimeSessions: document.getElementById('playtimeSessions'),
    playtimeStatus: document.getElementById('playtimeStatus'),
    
    // Stats
    behaviorPoint: document.getElementById('behaviorPoint'),
    avatarWorth: document.getElementById('avatarWorth'),
    collectorPoint: document.getElementById('collectorPoint'),
    loyaltyPoint: document.getElementById('loyaltyPoint'),
    fishCaught: document.getElementById('fishCaught'),
    
    // Features
    totalPlaytime: document.getElementById('totalPlaytime'),
    loveCount: document.getElementById('loveCount'),
    donationCount: document.getElementById('donationCount'),
    giftCount: document.getElementById('giftCount'),
    
    // Game Info
    gameInfoSection: document.getElementById('gameInfoSection'),
    currentGame: document.getElementById('currentGame'),
    gameStatus: document.getElementById('gameStatus'),
    joinButton: document.getElementById('joinButton'),
    
    // Controls
    refreshBtn: document.getElementById('refreshBtn'),
    pausePlaytimeBtn: document.getElementById('pausePlaytimeBtn'),
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    
    // Footer
    lastUpdate: document.getElementById('lastUpdate'),
    countdown: document.getElementById('countdown'),
    
    // Admin Modal
    adminModal: document.getElementById('adminModal'),
    closeModal: document.getElementById('closeModal'),
    loginSection: document.getElementById('loginSection'),
    adminDashboard: document.getElementById('adminDashboard'),
    adminUsername: document.getElementById('adminUsername'),
    adminPassword: document.getElementById('adminPassword'),
    loginBtn: document.getElementById('loginBtn'),
    loginError: document.getElementById('loginError'),
    
    // Admin Controls
    playtimeAdjustment: document.getElementById('playtimeAdjustment'),
    adjustmentType: document.getElementById('adjustmentType'),
    applyAdjustmentBtn: document.getElementById('applyAdjustmentBtn'),
    adminTotalPlaytime: document.getElementById('adminTotalPlaytime'),
    adminSessionCount: document.getElementById('adminSessionCount'),
    adminAvgSession: document.getElementById('adminAvgSession'),
    adminOnlineStatus: document.getElementById('adminOnlineStatus'),
    resetTodayBtn: document.getElementById('resetTodayBtn'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    backupDataBtn: document.getElementById('backupDataBtn'),
    storageStatus: document.getElementById('storageStatus'),
    lastSystemUpdate: document.getElementById('lastSystemUpdate')
};

// UTILITY FUNCTIONS
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatTime(date) {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatPlaytime(hours, minutes) {
    return `${formatNumber(hours)} h ${minutes} m`;
}

function formatTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatShortTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// TIME-BASED BACKGROUND FUNCTIONS
function setTimeBasedIndicator() {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    
    let timeText = '';
    let timeIcon = '';
    
    if (hour >= 4 && hour < 12) {
        timeText = `Pagi ${hour}:${minutes}`;
        timeIcon = '🌅';
    } else if (hour >= 12 && hour < 17) {
        timeText = `Siang ${hour}:${minutes}`;
        timeIcon = '☀️';
    } else if (hour >= 17 && hour < 20) {
        timeText = `Sore ${hour}:${minutes}`;
        timeIcon = '🌇';
    } else {
        timeText = `Malam ${hour}:${minutes}`;
        timeIcon = '🌙';
    }
    
    elements.timeIcon.textContent = timeIcon;
    elements.timeText.textContent = timeText;
}

// PLAYTIME SYSTEM
function loadPlaytimeData() {
    const savedData = localStorage.getItem('playtimeData');
    const currentDate = new Date();
    const today = currentDate.toDateString();
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toDateString();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString();
    
    if (savedData) {
        state.playtimeData = JSON.parse(savedData);
        
        // Reset daily data if day changed
        if (state.playtimeData.todayDate !== today) {
            state.playtimeData.todaySeconds = 0;
            state.playtimeData.todayDate = today;
        }
        
        // Reset weekly data if week changed
        if (state.playtimeData.weekStartDate !== firstDayOfWeek) {
            state.playtimeData.weekSeconds = 0;
            state.playtimeData.weekStartDate = firstDayOfWeek;
        }
        
        // Reset monthly data if month changed
        if (state.playtimeData.monthStartDate !== firstDayOfMonth) {
            state.playtimeData.monthSeconds = 0;
            state.playtimeData.monthStartDate = firstDayOfMonth;
        }
    } else {
        // Initialize new data
        state.playtimeData = {
            totalSeconds: 3891 * 3600 + 48 * 60, // Convert existing playtime to seconds
            todaySeconds: 0,
            weekSeconds: 0,
            monthSeconds: 0,
            sessions: 0,
            lastUpdated: new Date().toISOString(),
            todayDate: today,
            weekStartDate: firstDayOfWeek,
            monthStartDate: firstDayOfMonth,
            isOnline: false,
            lastStatusChange: null
        };
    }
    
    updatePlaytimeDisplay();
    console.log('Playtime data loaded from localStorage');
}

function savePlaytimeData() {
    if (state.playtimeData) {
        state.playtimeData.lastUpdated = new Date().toISOString();
        localStorage.setItem('playtimeData', JSON.stringify(state.playtimeData));
    }
}

function updatePlaytimeDisplay() {
    if (!state.playtimeData) return;
    
    // Update main playtime counter
    elements.playtimeCounter.textContent = formatTimeFromSeconds(state.playtimeData.totalSeconds);
    elements.playtimeToday.textContent = formatShortTimeFromSeconds(state.playtimeData.todaySeconds);
    elements.playtimeWeek.textContent = formatShortTimeFromSeconds(state.playtimeData.weekSeconds);
    elements.playtimeMonth.textContent = formatShortTimeFromSeconds(state.playtimeData.monthSeconds);
    elements.playtimeSessions.textContent = state.playtimeData.sessions;
    
    // Update total playtime in features grid
    const totalHours = Math.floor(state.playtimeData.totalSeconds / 3600);
    const totalMinutes = Math.floor((state.playtimeData.totalSeconds % 3600) / 60);
    elements.totalPlaytime.textContent = formatPlaytime(totalHours, totalMinutes);
    
    // Update admin dashboard if open
    if (state.isAdminLoggedIn) {
        updateAdminDashboard();
    }
}

function startPlaytimeCounter() {
    if (state.playtimeInterval) {
        clearInterval(state.playtimeInterval);
    }
    
    state.playtimeInterval = setInterval(() => {
        if (!state.isPlaytimePaused && state.playtimeData && state.playtimeData.isOnline) {
            state.playtimeData.totalSeconds++;
            state.playtimeData.todaySeconds++;
            state.playtimeData.weekSeconds++;
            state.playtimeData.monthSeconds++;
            
            updatePlaytimeDisplay();
            
            // Auto-save every 10 seconds to avoid excessive localStorage writes
            if (state.playtimeData.totalSeconds % 10 === 0) {
                savePlaytimeData();
            }
        }
    }, 1000);
}

// COUNTDOWN TIMER
function startCountdown() {
    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
    }
    
    state.countdown = CONFIG.COUNTDOWN_START;
    elements.countdown.textContent = state.countdown;
    
    state.countdownInterval = setInterval(() => {
        state.countdown--;
        elements.countdown.textContent = state.countdown;
        
        if (state.countdown <= 0) {
            clearInterval(state.countdownInterval);
            refreshData();
        }
    }, 1000);
}

// UPDATE UI FUNCTIONS
function updateLastUpdateTime() {
    const now = new Date();
    elements.lastUpdate.textContent = formatTime(now);
}

function updateStatusUI(data) {
    if (!data) return;
    
    const presenceType = data.userPresenceType || 0;
    const isOnline = presenceType !== 0;
    const isInGame = presenceType === 2;
    const isInIndoVoice = data.isInIndoVoice || false;
    
    // Save previous status
    const previousStatus = state.lastUserStatus;
    
    // Update API status
    elements.apiStatus.textContent = "Online";
    elements.apiStatus.style.color = "var(--accent-success)";
    
    // Update status indicator and determine if playtime is active
    if (!isOnline) {
        // OFFLINE - Playtime NOT active
        elements.statusIndicator.className = 'status-indicator offline';
        elements.statusText.textContent = 'OFFLINE';
        elements.avatarStatus.className = '';
        elements.avatarStatus.classList.remove('online', 'ingame');
        
        state.lastUserStatus = 'offline';
        if (state.playtimeData) state.playtimeData.isOnline = false;
        
        // Update playtime status
        elements.playtimeStatus.textContent = 'Paused';
        elements.playtimeStatus.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
        elements.playtimeStatus.style.borderColor = 'var(--accent-error)';
        elements.playtimeStatus.style.color = 'var(--accent-error)';
        
        // Hide game info
        elements.gameInfoSection.style.display = 'none';
        
        console.log('Status: OFFLINE - Playtime paused');
        
    } else if (isInIndoVoice) {
        // IN INDO VOICE - Playtime ACTIVE
        elements.statusIndicator.className = 'status-indicator ingame';
        elements.statusText.textContent = 'INDO VOICE';
        elements.avatarStatus.className = 'avatar-status ingame';
        
        state.lastUserStatus = 'ingame';
        if (state.playtimeData) state.playtimeData.isOnline = true;
        
        // Update playtime status
        elements.playtimeStatus.textContent = 'Active';
        elements.playtimeStatus.style.backgroundColor = 'rgba(47, 255, 0, 0.2)';
        elements.playtimeStatus.style.borderColor = 'var(--accent-success)';
        elements.playtimeStatus.style.color = 'var(--accent-success)';
        
        // Show game info
        elements.gameInfoSection.style.display = 'block';
        elements.currentGame.textContent = 'Indo Voice';
        elements.gameStatus.textContent = 'Online';
        elements.joinButton.style.display = 'inline-flex';
        
        console.log('Status: IN INDO VOICE - Playtime active');
        
    } else if (isInGame) {
        // IN OTHER GAME - Playtime ACTIVE
        elements.statusIndicator.className = 'status-indicator ingame';
        elements.statusText.textContent = 'IN GAME';
        elements.avatarStatus.className = 'avatar-status ingame';
        
        state.lastUserStatus = 'ingame';
        if (state.playtimeData) state.playtimeData.isOnline = true;
        
        // Update playtime status
        elements.playtimeStatus.textContent = 'Active';
        elements.playtimeStatus.style.backgroundColor = 'rgba(47, 255, 0, 0.2)';
        elements.playtimeStatus.style.borderColor = 'var(--accent-success)';
        elements.playtimeStatus.style.color = 'var(--accent-success)';
        
        // Show game info
        elements.gameInfoSection.style.display = 'block';
        elements.currentGame.textContent = data.lastLocation || 'Playing a game';
        elements.gameStatus.textContent = 'Online';
        elements.joinButton.style.display = 'none';
        
        console.log('Status: IN GAME - Playtime active');
        
    } else {
        // ONLINE (not in game) - Playtime ACTIVE
        elements.statusIndicator.className = 'status-indicator online';
        elements.statusText.textContent = 'ONLINE';
        elements.avatarStatus.className = 'avatar-status online';
        
        state.lastUserStatus = 'online';
        if (state.playtimeData) state.playtimeData.isOnline = true;
        
        // Update playtime status
        elements.playtimeStatus.textContent = 'Active';
        elements.playtimeStatus.style.backgroundColor = 'rgba(47, 255, 0, 0.2)';
        elements.playtimeStatus.style.borderColor = 'var(--accent-success)';
        elements.playtimeStatus.style.color = 'var(--accent-success)';
        
        // Hide game info
        elements.gameInfoSection.style.display = 'none';
        
        console.log('Status: ONLINE - Playtime active');
    }
    
    // Check if status changed from offline to online
    if (state.playtimeData && previousStatus === 'offline' && isOnline) {
        state.playtimeData.sessions++;
        console.log('New play session started');
    }
    
    // Update username if available
    if (data.username && data.username !== '7VeyForDey h3h3h3') {
        elements.username.textContent = data.username;
    }
    
    if (data.displayName) {
        elements.displayName.textContent = data.displayName;
    }
    
    // Update avatar with timestamp to avoid cache
    if (data.avatarUrl) {
        elements.avatarImg.src = data.avatarUrl + '?t=' + new Date().getTime();
    }
    
    // Handle avatar error
    elements.avatarImg.onerror = function() {
        this.src = CONFIG.AVATAR_URL + '?t=' + new Date().getTime();
    };
}

// API CALLS
async function fetchRobloxData() {
    try {
        console.log('Fetching data from worker...');
        
        const response = await fetch(CONFIG.WORKER_URL, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Worker returned error');
        }
        
        console.log('Data fetched successfully:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching data:', error);
        
        // Update API status
        elements.apiStatus.textContent = "Offline";
        elements.apiStatus.style.color = "var(--accent-error)";
        
        // Return fallback data
        return {
            success: true,
            userPresenceType: 0, // Default to "Offline" on error
            isInIndoVoice: false,
            username: "7VeyForDey h3h3h3",
            displayName: "@VeyH3H3H3H3",
            avatarUrl: CONFIG.AVATAR_URL,
            lastLocation: ""
        };
    }
}

// MAIN REFRESH FUNCTION
async function refreshData() {
    if (state.isRefreshing) return;
    
    try {
        state.isRefreshing = true;
        elements.refreshBtn.classList.add('loading');
        elements.refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        // Fetch data
        const data = await fetchRobloxData();
        state.lastStatus = data;
        
        // Update UI
        updateStatusUI(data);
        updateLastUpdateTime();
        
        console.log('Data refreshed successfully');
        console.log(`Current playtime: ${formatTimeFromSeconds(state.playtimeData.totalSeconds)}`);
        
    } catch (error) {
        console.error('Refresh failed:', error);
        
        // Show error in status
        elements.statusIndicator.className = 'status-indicator offline';
        elements.statusText.textContent = 'ERROR';
        
        elements.apiStatus.textContent = "Error";
        elements.apiStatus.style.color = "var(--accent-error)";
        
    } finally {
        state.isRefreshing = false;
        elements.refreshBtn.classList.remove('loading');
        elements.refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Now';
        
        // Restart countdown
        startCountdown();
    }
}

// INITIALIZE STATS
function initializeStats() {
    // Format numbers with commas
    elements.collectorPoint.textContent = formatNumber(170145);
    elements.fishCaught.textContent = formatNumber(3492);
    elements.loveCount.textContent = formatNumber(28110);
    elements.giftCount.textContent = formatNumber(1343);
    
    // Set avatar with timestamp to avoid cache
    elements.avatarImg.src = CONFIG.AVATAR_URL + '?t=' + new Date().getTime();
    
    console.log('Stats initialized');
}

// ADMIN FUNCTIONS
function updateAdminDashboard() {
    if (!state.playtimeData) return;
    
    elements.adminTotalPlaytime.textContent = formatTimeFromSeconds(state.playtimeData.totalSeconds);
    elements.adminSessionCount.textContent = state.playtimeData.sessions;
    
    // Calculate average session
    const avgSession = state.playtimeData.sessions > 0 ? 
        Math.round(state.playtimeData.totalSeconds / state.playtimeData.sessions) : 0;
    elements.adminAvgSession.textContent = formatShortTimeFromSeconds(avgSession);
    
    elements.adminOnlineStatus.textContent = state.playtimeData.isOnline ? "Online" : "Offline";
    elements.adminOnlineStatus.style.color = state.playtimeData.isOnline ? 
        "var(--accent-success)" : "var(--accent-error)";
    
    // Update system info
    elements.storageStatus.textContent = "Active (" + (JSON.stringify(state.playtimeData).length / 1024).toFixed(2) + " KB)";
    elements.lastSystemUpdate.textContent = formatTime(new Date(state.playtimeData.lastUpdated));
}

// EVENT LISTENERS
function setupEventListeners() {
    // Manual refresh button
    elements.refreshBtn.addEventListener('click', refreshData);
    
    // Pause playtime button
    elements.pausePlaytimeBtn.addEventListener('click', () => {
        state.isPlaytimePaused = !state.isPlaytimePaused;
        
        if (state.isPlaytimePaused) {
            elements.pausePlaytimeBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            elements.playtimeStatus.textContent = 'Paused';
            elements.playtimeStatus.style.backgroundColor = 'rgba(255, 152, 0, 0.2)';
            elements.playtimeStatus.style.borderColor = 'var(--accent-warning)';
            elements.playtimeStatus.style.color = 'var(--accent-warning)';
            console.log('Playtime manually paused');
        } else {
            elements.pausePlaytimeBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            // Restore status-based color
            if (state.playtimeData && state.playtimeData.isOnline) {
                elements.playtimeStatus.textContent = 'Active';
                elements.playtimeStatus.style.backgroundColor = 'rgba(47, 255, 0, 0.2)';
                elements.playtimeStatus.style.borderColor = 'var(--accent-success)';
                elements.playtimeStatus.style.color = 'var(--accent-success)';
            } else {
                elements.playtimeStatus.textContent = 'Paused';
                elements.playtimeStatus.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
                elements.playtimeStatus.style.borderColor = 'var(--accent-error)';
                elements.playtimeStatus.style.color = 'var(--accent-error)';
            }
            console.log('Playtime resumed');
        }
    });
    
    // Copy URL button
    elements.copyUrlBtn.addEventListener('click', () => {
        const url = `https://www.roblox.com/users/${CONFIG.USER_ID}/profile`;
        navigator.clipboard.writeText(url)
            .then(() => {
                const original = elements.copyUrlBtn.innerHTML;
                elements.copyUrlBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    elements.copyUrlBtn.innerHTML = original;
                }, 2000);
            })
            .catch(err => {
                console.error('Copy failed:', err);
                alert('Failed to copy URL. Please copy manually: ' + url);
            });
    });
    
    // Admin login button
    elements.adminLoginBtn.addEventListener('click', () => {
        elements.adminModal.classList.add('active');
        elements.loginSection.style.display = 'block';
        elements.adminDashboard.style.display = 'none';
        elements.loginError.style.display = 'none';
        
        // Reset form
        elements.adminUsername.value = '';
        elements.adminPassword.value = '';
    });
    
    // Close modal button
    elements.closeModal.addEventListener('click', () => {
        elements.adminModal.classList.remove('active');
        state.isAdminLoggedIn = false;
    });
    
    // Admin login
    elements.loginBtn.addEventListener('click', () => {
        const username = elements.adminUsername.value.trim();
        const password = elements.adminPassword.value.trim();
        
        if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
            // Login successful
            elements.loginSection.style.display = 'none';
            elements.adminDashboard.style.display = 'block';
            state.isAdminLoggedIn = true;
            updateAdminDashboard();
        } else {
            // Login failed
            elements.loginError.style.display = 'block';
            elements.adminUsername.value = '';
            elements.adminPassword.value = '';
        }
    });
    
    // Apply adjustment button
    elements.applyAdjustmentBtn.addEventListener('click', () => {
        const adjustment = parseInt(elements.playtimeAdjustment.value);
        const type = elements.adjustmentType.value;
        
        if (isNaN(adjustment) || adjustment < 0) {
            alert("Please enter a valid positive number!");
            return;
        }
        
        let confirmMessage = "";
        let newTotalSeconds = state.playtimeData.totalSeconds;
        
        switch(type) {
            case 'add':
                newTotalSeconds += adjustment;
                confirmMessage = `Add ${adjustment} seconds to playtime?`;
                break;
            case 'subtract':
                newTotalSeconds = Math.max(0, state.playtimeData.totalSeconds - adjustment);
                confirmMessage = `Subtract ${adjustment} seconds from playtime?`;
                break;
            case 'set':
                newTotalSeconds = adjustment;
                confirmMessage = `Set playtime to ${formatTimeFromSeconds(adjustment)}?`;
                break;
        }
        
        if (confirm(confirmMessage)) {
            // Calculate difference for updating daily, weekly, monthly stats
            const diff = newTotalSeconds - state.playtimeData.totalSeconds;
            
            state.playtimeData.totalSeconds = newTotalSeconds;
            state.playtimeData.todaySeconds = Math.max(0, state.playtimeData.todaySeconds + diff);
            state.playtimeData.weekSeconds = Math.max(0, state.playtimeData.weekSeconds + diff);
            state.playtimeData.monthSeconds = Math.max(0, state.playtimeData.monthSeconds + diff);
            
            updatePlaytimeDisplay();
            savePlaytimeData();
            
            alert("Adjustment applied successfully!");
            elements.playtimeAdjustment.value = "";
        }
    });
    
    // Reset today button
    elements.resetTodayBtn.addEventListener('click', () => {
        if (confirm("Reset today's playtime to 0? This action cannot be undone.")) {
            state.playtimeData.todaySeconds = 0;
            updatePlaytimeDisplay();
            savePlaytimeData();
            alert("Today's playtime has been reset!");
        }
    });
    
    // Reset all button
    elements.resetAllBtn.addEventListener('click', () => {
        if (confirm("Reset ALL playtime data? This action cannot be undone.")) {
            const currentDate = new Date();
            const today = currentDate.toDateString();
            const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toDateString();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString();
            
            state.playtimeData = {
                totalSeconds: 0,
                todaySeconds: 0,
                weekSeconds: 0,
                monthSeconds: 0,
                sessions: 0,
                lastUpdated: new Date().toISOString(),
                todayDate: today,
                weekStartDate: firstDayOfWeek,
                monthStartDate: firstDayOfMonth,
                isOnline: false,
                lastStatusChange: null
            };
            
            updatePlaytimeDisplay();
            savePlaytimeData();
            alert("All playtime data has been reset!");
        }
    });
    
    // Backup data button
    elements.backupDataBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(state.playtimeData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `playtime_backup_${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert("Backup downloaded successfully!");
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey) {
            refreshData();
        }
        if (e.key === 'Escape' && elements.adminModal.classList.contains('active')) {
            elements.adminModal.classList.remove('active');
            state.isAdminLoggedIn = false;
        }
    });
    
    // Auto-refresh when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('Page became visible, refreshing...');
            refreshData();
        } else {
            console.log('Page hidden');
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === elements.adminModal) {
            elements.adminModal.classList.remove('active');
            state.isAdminLoggedIn = false;
        }
    });
}

// INITIALIZATION
async function initialize() {
    console.log('Initializing Real-Time Playtime Tracker...');
    
    // Setup time indicator
    setTimeBasedIndicator();
    setInterval(setTimeBasedIndicator, 60000);
    
    // Load playtime data
    loadPlaytimeData();
    
    // Start playtime counter
    startPlaytimeCounter();
    
    // Initialize stats
    initializeStats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial data refresh
    await refreshData();
    
    // Start countdown
    startCountdown();
    
    console.log('Dashboard initialized successfully!');
    console.log('Playtime system active - data persists through page refresh');
    console.log('Admin login: username="admin", password="admin123"');
}

// START APPLICATION
document.addEventListener('DOMContentLoaded', initialize);