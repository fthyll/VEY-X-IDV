// CONFIGURATION
const CONFIG = {
    WORKER_URL: "https://vey.m-fatihyumna20.workers.dev",
    USER_ID: 8348455289,
    UPDATE_INTERVAL: 300000, // 5 menit (300000 ms)
    COUNTDOWN_START: 300, // 5 menit dalam detik
    AVATAR_URL: "https://tr.rbxcdn.com/8348455289/420/420/AvatarHeadshot/Png"
};

// STATE
const state = {
    countdown: CONFIG.COUNTDOWN_START,
    countdownInterval: null,
    isRefreshing: false,
    lastStatus: null,
    playtime: {
        hours: 3885,
        minutes: 30
    }
};

// DOM ELEMENTS
const elements = {
    // Status
    statusIndicator: document.getElementById('statusIndicator'),
    statusText: document.getElementById('statusText'),
    statusDot: document.querySelector('.status-dot'),
    avatarStatus: document.getElementById('avatarStatus'),
    
    // Profile
    avatarImg: document.getElementById('avatarImg'),
    username: document.getElementById('username'),
    displayName: document.getElementById('displayName'),
    
    // Stats
    behaviorPoint: document.getElementById('behaviorPoint'),
    avatarWorth: document.getElementById('avatarWorth'),
    collectorPoint: document.getElementById('collectorPoint'),
    loyaltyPoint: document.getElementById('loyaltyPoint'),
    fishCaught: document.getElementById('fishCaught'),
    
    // Features
    playtime: document.getElementById('playtime'),
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
    
    // Footer
    lastUpdate: document.getElementById('lastUpdate'),
    countdown: document.getElementById('countdown'),
    copyUrlBtn: document.getElementById('copyUrlBtn')
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
    return `${hours} h ${minutes} m`;
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
    
    // Update status indicator
    if (!isOnline) {
        // OFFLINE
        elements.statusIndicator.className = 'status-indicator offline';
        elements.statusText.textContent = 'OFFLINE';
        elements.avatarStatus.className = '';
        
        // Hide game info
        elements.gameInfoSection.style.display = 'none';
        
    } else if (isInIndoVoice) {
        // IN INDO VOICE
        elements.statusIndicator.className = 'status-indicator ingame';
        elements.statusText.textContent = 'INDO VOICE';
        elements.avatarStatus.className = 'avatar-status ingame';
        
        // Show game info
        elements.gameInfoSection.style.display = 'block';
        elements.currentGame.textContent = 'Indo Voice';
        elements.gameStatus.textContent = 'Online';
        elements.joinButton.style.display = 'inline-flex';
        
        // Update playtime (increment by 1 minute)
        state.playtime.minutes += 1;
        if (state.playtime.minutes >= 60) {
            state.playtime.hours += 1;
            state.playtime.minutes = 0;
        }
        elements.playtime.textContent = formatPlaytime(state.playtime.hours, state.playtime.minutes);
        
    } else if (isInGame) {
        // IN OTHER GAME
        elements.statusIndicator.className = 'status-indicator ingame';
        elements.statusText.textContent = 'IN GAME';
        elements.avatarStatus.className = 'avatar-status ingame';
        
        // Show game info
        elements.gameInfoSection.style.display = 'block';
        elements.currentGame.textContent = data.lastLocation || 'Playing a game';
        elements.gameStatus.textContent = 'Online';
        elements.joinButton.style.display = 'none';
        
    } else {
        // ONLINE (not in game)
        elements.statusIndicator.className = 'status-indicator online';
        elements.statusText.textContent = 'ONLINE';
        elements.avatarStatus.className = 'avatar-status online';
        
        // Hide game info
        elements.gameInfoSection.style.display = 'none';
    }
    
    // Update username if available
    if (data.username && data.username !== '7VeyForDey h3h3h3') {
        elements.username.textContent = data.username;
    }
    
    if (data.displayName) {
        elements.displayName.textContent = data.displayName;
    }
    
    // Update avatar
    if (data.avatarUrl) {
        elements.avatarImg.src = data.avatarUrl + '?t=' + new Date().getTime();
    }
    
    // Handle avatar error
    elements.avatarImg.onerror = function() {
        this.src = CONFIG.AVATAR_URL;
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
        
        // Return fallback data
        return {
            success: true,
            userPresenceType: 2, // Default to "In Game" for testing
            isInIndoVoice: true,
            username: "7VeyForDey h3h3h3",
            displayName: "@VeyH3H3H3H3",
            avatarUrl: CONFIG.AVATAR_URL,
            lastLocation: "Indo Voice"
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
        
    } catch (error) {
        console.error('Refresh failed:', error);
        
        // Show error in status
        elements.statusIndicator.className = 'status-indicator offline';
        elements.statusText.textContent = 'ERROR';
        
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
    
    // Format playtime
    elements.playtime.textContent = formatPlaytime(state.playtime.hours, state.playtime.minutes);
    
    // Set avatar with timestamp
    elements.avatarImg.src = CONFIG.AVATAR_URL + '?t=' + new Date().getTime();
}

// EVENT LISTENERS
function setupEventListeners() {
    // Manual refresh button
    elements.refreshBtn.addEventListener('click', refreshData);
    
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            refreshData();
        }
    });
    
    // Auto-refresh when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            refreshData();
        }
    });
}

// INITIALIZATION
async function initialize() {
    console.log('Initializing Roblox Profile Dashboard...');
    
    // Initialize stats
    initializeStats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial data refresh
    await refreshData();
    
    // Start countdown
    startCountdown();
    
    console.log('Dashboard initialized successfully!');
}

// START APPLICATION
document.addEventListener('DOMContentLoaded', initialize);