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
    lastRefreshTime: null,
    playtime: {
        hours: 3891,
        minutes: 48
    },
    lastUserStatus: null, // 'offline', 'online', 'ingame'
    playtimeActive: false // Status apakah playtime sedang aktif bertambah
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
    return `${formatNumber(hours)} h ${minutes} m`;
}

// TIME-BASED BACKGROUND FUNCTIONS
function setTimeBasedBackground() {
    const hour = new Date().getHours();
    const body = document.body;
    
    // Hapus semua kelas waktu sebelumnya
    body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-night', 'time-day');
    
    // Tentukan waktu dan set class yang sesuai
    if (hour >= 4 && hour < 12) {
        // Pagi: 04:00 - 11:59
        body.classList.add('time-morning');
        updateTimeIndicator('🌅 Pagi', hour);
    } else if (hour >= 12 && hour < 17) {
        // Siang: 12:00 - 16:59
        body.classList.add('time-afternoon');
        updateTimeIndicator('☀️ Siang', hour);
    } else if (hour >= 17 && hour < 20) {
        // Sore: 17:00 - 19:59
        body.classList.add('time-evening');
        updateTimeIndicator('🌇 Sore', hour);
    } else {
        // Malam: 20:00 - 03:59
        body.classList.add('time-night');
        updateTimeIndicator('🌙 Malam', hour);
    }
}

function updateTimeIndicator(timeText, hour) {
    let timeIndicator = document.querySelector('.time-indicator');
    
    if (!timeIndicator) {
        timeIndicator = document.createElement('div');
        timeIndicator.className = 'time-indicator';
        document.body.appendChild(timeIndicator);
    }
    
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    const timeIcon = timeText.split(' ')[0];
    timeIndicator.innerHTML = `<i>${timeIcon}</i> ${timeText} ${hour}:${minutes}`;
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

// UPDATE PLAYTIME FUNCTION
function updatePlaytime() {
    const now = new Date();
    
    // Jika ini pertama kali atau status berubah
    if (!state.lastRefreshTime) {
        state.lastRefreshTime = now;
        return;
    }
    
    // Hitung selisih waktu dalam menit sejak refresh terakhir
    const diffInMinutes = Math.floor((now - state.lastRefreshTime) / (1000 * 60));
    
    if (diffInMinutes > 0 && state.playtimeActive) {
        // Update playtime berdasarkan waktu yang berlalu
        state.playtime.minutes += diffInMinutes;
        
        // Konversi menit ke jam jika lebih dari 60
        while (state.playtime.minutes >= 60) {
            state.playtime.hours += 1;
            state.playtime.minutes -= 60;
        }
        
        // Update tampilan
        elements.playtime.textContent = formatPlaytime(state.playtime.hours, state.playtime.minutes);
        
        console.log(`Playtime updated: +${diffInMinutes} minutes`);
    }
    
    state.lastRefreshTime = now;
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
    
    // Simpan status sebelumnya
    const previousStatus = state.lastUserStatus;
    
    // Update status indicator dan tentukan apakah playtime aktif
    if (!isOnline) {
        // OFFLINE - Playtime TIDAK aktif
        elements.statusIndicator.className = 'status-indicator offline';
        elements.statusText.textContent = 'OFFLINE';
        elements.avatarStatus.className = '';
        elements.avatarStatus.classList.remove('online', 'ingame');
        
        state.lastUserStatus = 'offline';
        state.playtimeActive = false;
        
        // Hide game info
        elements.gameInfoSection.style.display = 'none';
        
        console.log('Status: OFFLINE - Playtime tidak aktif');
        
    } else if (isInIndoVoice) {
        // IN INDO VOICE - Playtime AKTIF
        elements.statusIndicator.className = 'status-indicator ingame';
        elements.statusText.textContent = 'INDO VOICE';
        elements.avatarStatus.className = 'avatar-status ingame';
        
        state.lastUserStatus = 'ingame';
        state.playtimeActive = true;
        
        // Show game info
        elements.gameInfoSection.style.display = 'block';
        elements.currentGame.textContent = 'Indo Voice';
        elements.gameStatus.textContent = 'Online';
        elements.joinButton.style.display = 'inline-flex';
        
        console.log('Status: IN INDO VOICE - Playtime aktif');
        
    } else if (isInGame) {
        // IN OTHER GAME - Playtime AKTIF
        elements.statusIndicator.className = 'status-indicator ingame';
        elements.statusText.textContent = 'IN GAME';
        elements.avatarStatus.className = 'avatar-status ingame';
        
        state.lastUserStatus = 'ingame';
        state.playtimeActive = true;
        
        // Show game info
        elements.gameInfoSection.style.display = 'block';
        elements.currentGame.textContent = data.lastLocation || 'Playing a game';
        elements.gameStatus.textContent = 'Online';
        elements.joinButton.style.display = 'none';
        
        console.log('Status: IN GAME - Playtime aktif');
        
    } else {
        // ONLINE (not in game) - Playtime AKTIF
        elements.statusIndicator.className = 'status-indicator online';
        elements.statusText.textContent = 'ONLINE';
        elements.avatarStatus.className = 'avatar-status online';
        
        state.lastUserStatus = 'online';
        state.playtimeActive = true;
        
        // Hide game info
        elements.gameInfoSection.style.display = 'none';
        
        console.log('Status: ONLINE - Playtime aktif');
    }
    
    // Update playtime jika status berubah atau masih aktif
    if (state.playtimeActive) {
        updatePlaytime();
        
        // Jika status berubah dari offline ke online/ingame, beri pesan
        if (previousStatus === 'offline') {
            console.log('Status berubah dari OFFLINE menjadi AKTIF - Playtime mulai bertambah');
        }
    }
    
    // Update username jika tersedia
    if (data.username && data.username !== '7VeyForDey h3h3h3') {
        elements.username.textContent = data.username;
    }
    
    if (data.displayName) {
        elements.displayName.textContent = data.displayName;
    }
    
    // Update avatar dengan timestamp untuk menghindari cache
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
        
        // Return fallback data (untuk testing: online status)
        return {
            success: true,
            userPresenceType: 1, // Default ke "Online" untuk testing
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
        console.log(`Current playtime: ${state.playtime.hours}h ${state.playtime.minutes}m`);
        
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
    
    // Set avatar dengan timestamp untuk menghindari cache
    elements.avatarImg.src = CONFIG.AVATAR_URL + '?t=' + new Date().getTime();
    
    console.log(`Initial playtime: ${state.playtime.hours}h ${state.playtime.minutes}m`);
}

// REAL-TIME PLAYTIME UPDATER
function startRealTimePlaytimeUpdater() {
    // Update playtime setiap menit jika status aktif
    setInterval(() => {
        if (state.playtimeActive) {
            // Tambah 1 menit
            state.playtime.minutes += 1;
            
            // Konversi menit ke jam jika lebih dari 60
            if (state.playtime.minutes >= 60) {
                state.playtime.hours += 1;
                state.playtime.minutes = 0;
            }
            
            // Update tampilan
            elements.playtime.textContent = formatPlaytime(state.playtime.hours, state.playtime.minutes);
            
            // Update last refresh time untuk perhitungan akurat
            state.lastRefreshTime = new Date();
            
            console.log(`Playtime +1 minute (real-time): ${state.playtime.hours}h ${state.playtime.minutes}m`);
        }
    }, 60000); // Update setiap 1 menit
    
    console.log('Real-time playtime updater started');
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
        if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey) {
            refreshData();
        }
    });
    
    // Auto-refresh ketika page menjadi visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('Page became visible, refreshing...');
            refreshData();
        } else {
            console.log('Page hidden');
        }
    });
    
    // Tab/window close warning untuk save playtime
    window.addEventListener('beforeunload', (e) => {
        if (state.playtimeActive) {
            // Tampilkan pesan untuk memastikan playtime tersimpan
            const message = 'Playtime masih berjalan. Pastikan untuk menyimpan progress?';
            e.returnValue = message;
            return message;
        }
    });
}

// INITIALIZATION
async function initialize() {
    console.log('Initializing Roblox Profile Dashboard...');
    
    // Setup time-based background
    setTimeBasedBackground();
    
    // Update background setiap menit
    setInterval(setTimeBasedBackground, 60000);
    
    // Initialize stats
    initializeStats();
    
    // Start real-time playtime updater
    startRealTimePlaytimeUpdater();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial data refresh
    await refreshData();
    
    // Start countdown
    startCountdown();
    
    console.log('Dashboard initialized successfully!');
    console.log('Playtime akan bertambah setiap menit jika status ONLINE atau IN GAME');
}

// START APPLICATION
document.addEventListener('DOMContentLoaded', initialize);