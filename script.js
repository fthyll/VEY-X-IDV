/***********************************************
 * VEY X IDV DASHBOARD - COMPLETE SYSTEM
 * Version: 3.0.0
 * Features: Real-time Tracking, Sync System, 
 *           Tier System, Edit Stats System
 ***********************************************/

// ======================
// CONFIGURATION
// ======================
const CONFIG = {
    // API Configuration
    WORKER_URL: "https://vey.m-fatihyumna20.workers.dev",
    SYNC_SERVER: "https://sync.m-fatihyumna20.workers.dev",
    
    // User Information
    USER_ID: 8348455289,
    AVATAR_URL: "https://tr.rbxcdn.com/8348455289/420/420/AvatarHeadshot/Png",
    
    // Timing Configuration
    UPDATE_INTERVAL: 30000,      // 30 seconds
    SYNC_INTERVAL: 30000,        // 30 seconds
    COUNTDOWN_START: 30,         // 30 seconds
    TIER_UPDATE_INTERVAL: 60000, // 60 seconds
    
    // Admin Credentials
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD: "VeyH3H3H3H3",
    
    // System Configuration
    SYNC_ENABLED: true,
    SYNC_MODE: "auto",
    TIER_ENABLED: true,
    
    // Sync Retry Configuration
    SYNC_RETRY_ATTEMPTS: 3,
    SYNC_RETRY_DELAY: 5000
};

// ======================
// STATE MANAGEMENT
// ======================
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
    lastUserStatus: null,
    
    // Sync system
    syncInterval: null,
    isSyncing: false,
    lastSyncTime: null,
    syncAttempts: 0,
    syncedDevices: 0,
    
    // Admin
    isAdminLoggedIn: false,
    
    // Device info
    deviceInfo: null,
    
    // Statistics data
    statsData: {
        avatarWorth: 60,
        collectorPoint: 170145,
        loyaltyPoint: 78,
        fishCaught: 3492,
        loveCount: 28110,
        donationCount: 100,
        giftCount: 1343,
        behaviorPoint: 100
    }
};

// ======================
// DEFAULT STATS
// ======================
const DEFAULT_STATS = {
    avatarWorth: 60,
    collectorPoint: 170145,
    loyaltyPoint: 78,
    fishCaught: 3492,
    loveCount: 28110,
    donationCount: 100,
    giftCount: 1343,
    behaviorPoint: 100
};

// ======================
// TIER SYSTEM CONFIG
// ======================
// ======================
// TIER SYSTEM CONFIG
// ======================
const TIER_SYSTEM = {
    tiers: [
        {
            id: 'stranger',
            name: 'Stranger',
            hours: 0,
            icon: 'https://tr.rbxcdn.com/180DAY-66f69a805b5e98e7afc90eb97f1de9fb/420/420/Image/Png/noFilter',
            color: '#4caf50',
            image: 'https://tr.rbxcdn.com/180DAY-66f69a805b5e98e7afc90eb97f1de9fb/420/420/Image/Png/noFilter',
            rewards: ['Welcome badge'],
            description: 'Just starting your journey'
        },
        {
            id: 'newcomer',
            name: 'Newcomer',
            hours: 1,
            icon: 'https://tr.rbxcdn.com/180DAY-8854b1ca21c46a3a517a948d4c841abf/420/420/Image/Png/noFilter',
            color: '#4caf50',
            image: 'https://tr.rbxcdn.com/180DAY-8854b1ca21c46a3a517a948d4c841abf/420/420/Image/Png/noFilter',
            rewards: ['Beginner badge', '+100 Profile views'],
            description: 'Getting familiar with the game'
        },
        {
            id: 'adapted',
            name: 'Adapted',
            hours: 5,
            icon: 'https://tr.rbxcdn.com/180DAY-6b94947a5770464ece71a71e13a82312/420/420/Image/Png/noFilter',
            color: '#4caf50',
            image: 'https://tr.rbxcdn.com/180DAY-6b94947a5770464ece71a71e13a82312/420/420/Image/Png/noFilter',
            rewards: ['Adapted title', 'Bronze frame'],
            description: 'Comfortable with game mechanics'
        },
        {
            id: 'experienced',
            name: 'Experienced',
            hours: 15,
            icon: 'https://tr.rbxcdn.com/180DAY-5ce0c379266a97d3f75544ee5e772fe0/420/420/Image/Png/noFilter',
            color: '#ffc62a',
            image: 'https://tr.rbxcdn.com/180DAY-5ce0c379266a97d3f75544ee5e772fe0/420/420/Image/Png/noFilter',
            rewards: ['Experienced title', 'Silver frame'],
            description: 'Knows the ins and outs'
        },
        {
            id: 'senior',
            name: 'Senior',
            hours: 30,
            icon: 'https://tr.rbxcdn.com/180DAY-26b586b5c3deea58a4ca23a1492cfb8a/420/420/Image/Png/noFilter',
            color: '#ffc62a',
            image: 'https://tr.rbxcdn.com/180DAY-26b586b5c3deea58a4ca23a1492cfb8a/420/420/Image/Png/noFilter',
            rewards: ['Senior title', 'Gold frame'],
            description: 'Respected veteran player'
        },
        {
            id: 'master',
            name: 'Master',
            hours: 60,
            icon: 'https://tr.rbxcdn.com/180DAY-ab21dfaa3b8ae3989fd90e30107628a9/420/420/Image/Png/noFilter',
            color: '#ffc62a',
            image: 'https://tr.rbxcdn.com/180DAY-ab21dfaa3b8ae3989fd90e30107628a9/420/420/Image/Png/noFilter',
            rewards: ['Master title', 'Platinum frame'],
            description: 'Master of the game'
        },
        {
            id: 'elder',
            name: 'Elder',
            hours: 120,
            icon: 'https://tr.rbxcdn.com/180DAY-5d31df6ef2035c66b917f5d562130931/420/420/Image/Png/noFilter',
            color: '#9121c2',
            image: 'https://tr.rbxcdn.com/180DAY-5d31df6ef2035c66b917f5d562130931/420/420/Image/Png/noFilter',
            rewards: ['Elder title', 'Diamond frame'],
            description: 'Ancient wisdom and skill'
        },
        {
            id: 'legend',
            name: 'Legend',
            hours: 240,
            icon: 'https://tr.rbxcdn.com/180DAY-da28ffc84ba46a46b8bb7dc649b87c58/420/420/Image/Png/noFilter',
            color: '#9121c2',
            image: 'https://tr.rbxcdn.com/180DAY-da28ffc84ba46a46b8bb7dc649b87c58/420/420/Image/Png/noFilter',
            rewards: ['Legend title', 'Ruby frame'],
            description: 'Stories told about your skills'
        },
        {
            id: 'supreme',
            name: 'Supreme',
            hours: 480,
            icon: 'https://tr.rbxcdn.com/180DAY-57142d5ae46cf8b7daa16226c0c532e4/420/420/Image/Png/noFilter',
            color: '#9121c2',
            image: 'https://tr.rbxcdn.com/180DAY-57142d5ae46cf8b7daa16226c0c532e4/420/420/Image/Png/noFilter',
            rewards: ['Supreme title', 'Sapphire frame'],
            description: 'Above all others'
        },
        {
            id: 'immortal',
            name: 'Immortal',
            hours: 960,
            icon: 'https://tr.rbxcdn.com/180DAY-633963fa7bdff14235e5afce47afa5f5/150/150/Image/Webp/noFilter',
            color: '#00BCD4',
            image: 'https://tr.rbxcdn.com/180DAY-633963fa7bdff14235e5afce47afa5f5/150/150/Image/Webp/noFilter',
            rewards: ['Immortal title', 'Emerald frame'],
            description: 'Timeless presence'
        },
        {
            id: 'mythical',
            name: 'Mythical',
            hours: 1920,
            icon: 'https://tr.rbxcdn.com/180DAY-b0e0184d9a459bf94bf913a698ed9d58/150/150/Image/Webp/noFilter',
            color: '#673AB7',
            image: 'https://tr.rbxcdn.com/180DAY-b0e0184d9a459bf94bf913a698ed9d58/150/150/Image/Webp/noFilter',
            rewards: ['Mythical title', 'Amethyst frame'],
            description: 'Myths speak of your power'
        },
        {
            id: 'transcendent',
            name: 'Transcendent',
            hours: 3840,
            icon: 'https://tr.rbxcdn.com/180DAY-09452860550f375f10f2563bd051e22f/150/150/Image/Webp/noFilter',
            color: '#3F51B5',
            image: 'https://tr.rbxcdn.com/180DAY-09452860550f375f10f2563bd051e22f/150/150/Image/Webp/noFilter',
            rewards: ['Transcendent title', 'Rainbow frame'],
            description: 'Beyond mortal comprehension'
        },
        {
            id: 'eternal',
            name: 'Eternal',
            hours: 7680,
            icon: 'https://tr.rbxcdn.com/180DAY-16ec0de045ed9343c9f91e08fde77a75/150/150/Image/Webp/noFilter',
            color: '#009688',
            image: 'https://tr.rbxcdn.com/180DAY-16ec0de045ed9343c9f91e08fde77a75/150/150/Image/Webp/noFilter',
            rewards: ['Eternal title', 'Galaxy frame'],
            description: 'Your legacy lasts forever'
        },
        {
            id: 'omnipotent',
            name: 'Omnipotent',
            hours: 12000,
            icon: 'https://tr.rbxcdn.com/180DAY-c2064cad4a1fe70692ecc3c6476614a8/150/150/Image/Webp/noFilter',
            color: '#FFEB3B',
            image: 'https://tr.rbxcdn.com/180DAY-c2064cad4a1fe70692ecc3c6476614a8/150/150/Image/Webp/noFilter',
            rewards: ['Omnipotent title', 'Universe frame'],
            description: 'All-powerful being'
        }
    ],
    
    tierImages: [
        'https://tr.rbxcdn.com/180DAY-66f69a805b5e98e7afc90eb97f1de9fb/420/420/Image/Png/noFilter',
        'https://tr.rbxcdn.com/180DAY-8854b1ca21c46a3a517a948d4c841abf/420/420/Image/Png/noFilter',
        'https://tr.rbxcdn.com/180DAY-6b94947a5770464ece71a71e13a82312/420/420/Image/Png/noFilter',
        'https://tr.rbxcdn.com/180DAY-5ce0c379266a97d3f75544ee5e772fe0/420/420/Image/Png/noFilter',
        'https://tr.rbxcdn.com/180DAY-26b586b5c3deea58a4ca23a1492cfb8a/420/420/Image/Png/noFilter',
        'https://tr.rbxcdn.com/180DAY-ab21dfaa3b8ae3989fd90e30107628a9/420/420/Image/Png/noFilter',
        'https://tr.rbxcdn.com/180DAY-5d31df6ef2035c66b917f5d562130931/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-da28ffc84ba46a46b8bb7dc649b87c58/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-57142d5ae46cf8b7daa16226c0c532e4/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-633963fa7bdff14235e5afce47afa5f5/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-b0e0184d9a459bf94bf913a698ed9d58/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-09452860550f375f10f2563bd051e22f/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-16ec0de045ed9343c9f91e08fde77a75/150/150/Image/Webp/noFilter',
        'https://tr.rbxcdn.com/180DAY-c2064cad4a1fe70692ecc3c6476614a8/150/150/Image/Webp/noFilter'
    ]
};

// ======================
// DOM ELEMENTS
// ======================
const elements = {
    // Time indicator
    timeIcon: document.getElementById('timeIcon'),
    timeText: document.getElementById('timeText'),
    syncStatusIndicator: document.getElementById('syncStatusIndicator'),
    syncStatusText: document.getElementById('syncStatusText'),
    
    // Status
    statusIndicator: document.getElementById('statusIndicator'),
    statusText: document.getElementById('statusText'),
    avatarStatus: document.getElementById('avatarStatus'),
    apiStatus: document.getElementById('apiStatus'),
    
    // Profile
    avatarImg: document.getElementById('avatarImg'),
    username: document.getElementById('username'),
    displayName: document.getElementById('displayName'),
    deviceIdBadge: document.getElementById('deviceIdBadge'),
    deviceIdDisplay: document.getElementById('deviceIdDisplay'),
    
    // Playtime
    playtimeCounter: document.getElementById('playtimeCounter'),
    playtimeToday: document.getElementById('playtimeToday'),
    playtimeWeek: document.getElementById('playtimeWeek'),
    playtimeMonth: document.getElementById('playtimeMonth'),
    playtimeSessions: document.getElementById('playtimeSessions'),
    playtimeStatus: document.getElementById('playtimeStatus'),
    playtimeStatusText: document.getElementById('playtimeStatusText'),
    
    // Sync info
    lastSyncTime: document.getElementById('lastSyncTime'),
    syncedDevicesCount: document.getElementById('syncedDevicesCount'),
    manualSyncBtn: document.getElementById('manualSyncBtn'),
    
    // Tier System
    currentTier: document.getElementById('currentTier'),
    currentTierName: document.getElementById('currentTierName'),
    tierProgress: document.getElementById('tierProgress'),
    tierProgressBar: document.getElementById('tierProgressBar'),
    currentHours: document.getElementById('currentHours'),
    nextTierHours: document.getElementById('nextTierHours'),
    headerTierName: document.getElementById('headerTierName'),
    
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
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    deviceInfoBtn: document.getElementById('deviceInfoBtn'),
    
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
    
    // Admin Tier Elements
    adminCurrentTier: document.getElementById('adminCurrentTier'),
    adminTotalHours: document.getElementById('adminTotalHours'),
    adminNextTier: document.getElementById('adminNextTier'),
    adminTierProgress: document.getElementById('adminTierProgress'),
    
    // Edit Stats Elements
    editAvatarWorth: document.getElementById('editAvatarWorth'),
    editCollectorPoint: document.getElementById('editCollectorPoint'),
    editLoyaltyPoint: document.getElementById('editLoyaltyPoint'),
    editFishCaught: document.getElementById('editFishCaught'),
    editLoveCount: document.getElementById('editLoveCount'),
    editDonationCount: document.getElementById('editDonationCount'),
    editGiftCount: document.getElementById('editGiftCount'),
    editBehaviorPoint: document.getElementById('editBehaviorPoint'),
    
    // Admin Controls
    playtimeAdjustment: document.getElementById('playtimeAdjustment'),
    adjustmentType: document.getElementById('adjustmentType'),
    applyAdjustmentBtn: document.getElementById('applyAdjustmentBtn'),
    adminTotalPlaytime: document.getElementById('adminTotalPlaytime'),
    adminSessionCount: document.getElementById('adminSessionCount'),
    adminAvgSession: document.getElementById('adminAvgSession'),
    adminOnlineStatus: document.getElementById('adminOnlineStatus'),
    
    // Sync Controls
    syncMode: document.getElementById('syncMode'),
    syncServer: document.getElementById('syncServer'),
    forceSyncBtn: document.getElementById('forceSyncBtn'),
    resetSyncBtn: document.getElementById('resetSyncBtn'),
    viewSyncLogBtn: document.getElementById('viewSyncLogBtn'),
    
    // Data Management
    resetTodayBtn: document.getElementById('resetTodayBtn'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    backupDataBtn: document.getElementById('backupDataBtn'),
    
    // System Info
    storageStatus: document.getElementById('storageStatus'),
    adminDeviceId: document.getElementById('adminDeviceId'),
    adminLastSync: document.getElementById('adminLastSync'),
    
    // Device Modal
    deviceModal: document.getElementById('deviceModal'),
    closeDeviceModal: document.getElementById('closeDeviceModal'),
    deviceIdFull: document.getElementById('deviceIdFull'),
    deviceFirstSeen: document.getElementById('deviceFirstSeen'),
    deviceSyncCount: document.getElementById('deviceSyncCount'),
    deviceLastActive: document.getElementById('deviceLastActive'),
    devicePlaytimeAdded: document.getElementById('devicePlaytimeAdded'),
    copyDeviceIdBtn: document.getElementById('copyDeviceIdBtn'),
    regenerateDeviceIdBtn: document.getElementById('regenerateDeviceIdBtn'),
    clearDeviceDataBtn: document.getElementById('clearDeviceDataBtn'),
    exportDeviceDataBtn: document.getElementById('exportDeviceDataBtn')
};

// ======================
// UTILITY FUNCTIONS
// ======================
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

function formatDateTime(date) {
    return date.toLocaleString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPlaytime(hours, minutes) {
    return `${formatNumber(hours)} h ${minutes} m`;
}

function formatTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatShortTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}`;
}

function formatHoursAndMinutes(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

// ======================
// TIER SYSTEM FUNCTIONS
// ======================
function calculateCurrentTier(hours) {
    let currentTier = TIER_SYSTEM.tiers[0];
    let nextTier = TIER_SYSTEM.tiers[1];
    
    for (let i = 0; i < TIER_SYSTEM.tiers.length; i++) {
        if (hours >= TIER_SYSTEM.tiers[i].hours) {
            currentTier = TIER_SYSTEM.tiers[i];
            nextTier = TIER_SYSTEM.tiers[i + 1] || TIER_SYSTEM.tiers[i];
        } else {
            nextTier = TIER_SYSTEM.tiers[i];
            break;
        }
    }
    
    return { currentTier, nextTier };
}

function calculateTierProgress(hours, currentTier, nextTier) {
    if (nextTier.hours === currentTier.hours) {
        return 100;
    }
    
    const range = nextTier.hours - currentTier.hours;
    const progress = hours - currentTier.hours;
    const percentage = (progress / range) * 100;
    
    return Math.min(100, Math.max(0, percentage));
}

function updateTierDisplay() {
    if (!state.playtimeData) return;
    
    const totalHours = state.playtimeData.totalSeconds / 3600;
    const { currentTier, nextTier } = calculateCurrentTier(totalHours);
    const progress = calculateTierProgress(totalHours, currentTier, nextTier);
    
    // Update current tier info
    if (elements.currentTierName) elements.currentTierName.textContent = currentTier.name;
    if (elements.tierProgress) elements.tierProgress.textContent = `${progress.toFixed(1)}%`;
    if (elements.tierProgressBar) elements.tierProgressBar.style.width = `${progress}%`;
    
    // Update header tier
    if (elements.headerTierName) {
        elements.headerTierName.textContent = currentTier.name;
    }
    
    // Update progress stats
    if (elements.currentHours) elements.currentHours.textContent = `${totalHours.toFixed(1)} hours`;
    
    if (nextTier.hours > currentTier.hours) {
        const hoursNeeded = nextTier.hours - totalHours;
        if (elements.nextTierHours) elements.nextTierHours.textContent = `${hoursNeeded.toFixed(1)} hours to ${nextTier.name}`;
    } else {
        if (elements.nextTierHours) elements.nextTierHours.textContent = 'Maximum tier achieved!';
    }
    
    // Generate tier cards
    generateTierCards(totalHours);
    
    // Update admin dashboard if open
    if (state.isAdminLoggedIn) {
        updateAdminDashboard();
    }
}

function generateTierCards(currentHours) {
    const tiersGrid = document.getElementById('tiersGrid');
    if (!tiersGrid) return;
    
    tiersGrid.innerHTML = '';
    
    TIER_SYSTEM.tiers.forEach((tier, index) => {
        const isAchieved = currentHours >= tier.hours;
        const isCurrent = calculateCurrentTier(currentHours).currentTier.id === tier.id;
        
        const tierCard = document.createElement('div');
        tierCard.className = 'tier-card';
        if (isCurrent) tierCard.classList.add('current');
        if (isAchieved && !isCurrent) tierCard.classList.add('achieved');
        if (!isAchieved) tierCard.classList.add('locked');
        
        // Calculate progress within this tier
        const nextTierHours = TIER_SYSTEM.tiers[index + 1]?.hours || tier.hours;
        let tierProgress = 0;
        if (currentHours >= tier.hours) {
            if (nextTierHours > tier.hours) {
                tierProgress = Math.min(100, ((currentHours - tier.hours) / (nextTierHours - tier.hours)) * 100);
            } else {
                tierProgress = 100;
            }
        } else if (currentHours > 0 && tier.hours > 0) {
            tierProgress = (currentHours / tier.hours) * 100;
        }
        
        tierCard.innerHTML = `
            ${isCurrent ? '<div class="tier-badge"><i class="fas fa-crown"></i></div>' : ''}
            ${isAchieved && !isCurrent ? '<div class="tier-badge"><i class="fas fa-check"></i></div>' : ''}
            
            <div class="tier-card-header">
                <div class="tier-icon">
                    <img src="${tier.icon}" alt="${tier.name}" style="border: 2px solid ${tier.color}">
                </div>
                <div class="tier-name">${tier.name}</div>
            </div>
            
            <div class="tier-requirements">
                <i class="fas fa-clock"></i>
                <span>${tier.hours} hours</span>
            </div>
            
            <div class="tier-progress-indicator">
                <div class="tier-progress-fill" style="width: ${Math.min(100, tierProgress)}%"></div>
            </div>
            
            <div class="tier-reward">
                <i class="fas fa-gift"></i>
                <span>${tier.rewards[0]}</span>
            </div>
            
            <div class="tier-tooltip">
                <div class="tooltip-header">
                    <div class="tooltip-icon">
                        <img src="${tier.icon}" alt="${tier.name}" style="width: 30px; height: 30px; border-radius: 6px; border: 2px solid ${tier.color}">
                    </div>
                    <div class="tooltip-title">${tier.name}</div>
                </div>
                <div class="tooltip-content">
                    ${tier.description}
                </div>
                <div class="tooltip-rewards">
                    <div class="reward-item">
                        <i class="fas fa-trophy"></i>
                        <span>Requirements: ${tier.hours} hours playtime</span>
                    </div>
                    ${tier.rewards.map(reward => `
                        <div class="reward-item">
                            <i class="fas fa-award"></i>
                            <span>${reward}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        tiersGrid.appendChild(tierCard);
    });
    
    // Add tier images section
    let tierImagesSection = document.getElementById('tierImages');
    if (!tierImagesSection) {
        tierImagesSection = document.createElement('div');
        tierImagesSection.className = 'tier-images';
        tierImagesSection.id = 'tierImages';
        tiersGrid.parentNode.appendChild(tierImagesSection);
    }
    
    updateTierImages(currentHours);
}

function updateTierImages(currentHours) {
    const tierImagesContainer = document.getElementById('tierImages');
    if (!tierImagesContainer) return;
    
    tierImagesContainer.innerHTML = '<h4 style="width: 100%; text-align: center; margin-bottom: 15px; color: var(--text-muted);">Tier Avatars</h4>';
    
    TIER_SYSTEM.tiers.forEach((tier, index) => {
        const isAchieved = currentHours >= tier.hours;
        const isCurrent = calculateCurrentTier(currentHours).currentTier.id === tier.id;
        
        const imageItem = document.createElement('div');
        imageItem.className = 'tier-image-item';
        
        const img = document.createElement('img');
        img.className = 'tier-image';
        img.src = TIER_SYSTEM.tierImages[index] || tier.image;
        img.alt = tier.name;
        img.title = `${tier.name} - ${tier.hours} hours`;
        
        if (isCurrent) img.classList.add('current');
        if (isAchieved && !isCurrent) img.classList.add('achieved');
        if (!isAchieved) img.classList.add('locked');
        
        const label = document.createElement('div');
        label.className = 'tier-image-label';
        label.textContent = tier.name;
        
        imageItem.appendChild(img);
        imageItem.appendChild(label);
        tierImagesContainer.appendChild(imageItem);
    });
}

function initializeTierSystem() {
    updateTierDisplay();
    
    // Update tier display every minute
    setInterval(() => {
        updateTierDisplay();
    }, CONFIG.TIER_UPDATE_INTERVAL);
}

// ======================
// STATISTICS MANAGEMENT
// ======================
function loadStatsData() {
    const savedStats = localStorage.getItem('statsData');
    if (savedStats) {
        try {
            state.statsData = JSON.parse(savedStats);
            console.log('Stats data loaded from localStorage');
        } catch (error) {
            console.error('Error parsing stats data:', error);
            state.statsData = { ...DEFAULT_STATS };
        }
    }
    updateStatsDisplay();
}

function saveStatsData() {
    localStorage.setItem('statsData', JSON.stringify(state.statsData));
    console.log('Stats data saved to localStorage');
}

function updateStatsDisplay() {
    // Update stats grid
    if (elements.avatarWorth) elements.avatarWorth.textContent = state.statsData.avatarWorth;
    if (elements.collectorPoint) elements.collectorPoint.textContent = formatNumber(state.statsData.collectorPoint);
    if (elements.loyaltyPoint) elements.loyaltyPoint.textContent = state.statsData.loyaltyPoint;
    if (elements.fishCaught) elements.fishCaught.textContent = formatNumber(state.statsData.fishCaught);
    if (elements.behaviorPoint) elements.behaviorPoint.textContent = state.statsData.behaviorPoint;
    
    // Update features grid
    if (elements.loveCount) elements.loveCount.textContent = formatNumber(state.statsData.loveCount);
    if (elements.donationCount) elements.donationCount.textContent = state.statsData.donationCount;
    if (elements.giftCount) elements.giftCount.textContent = formatNumber(state.statsData.giftCount);
    
    // Update input placeholders
    updateInputPlaceholders();
}

function updateInputPlaceholders() {
    if (elements.editAvatarWorth) elements.editAvatarWorth.placeholder = `Current: ${state.statsData.avatarWorth}`;
    if (elements.editCollectorPoint) elements.editCollectorPoint.placeholder = `Current: ${formatNumber(state.statsData.collectorPoint)}`;
    if (elements.editLoyaltyPoint) elements.editLoyaltyPoint.placeholder = `Current: ${state.statsData.loyaltyPoint}`;
    if (elements.editFishCaught) elements.editFishCaught.placeholder = `Current: ${formatNumber(state.statsData.fishCaught)}`;
    if (elements.editLoveCount) elements.editLoveCount.placeholder = `Current: ${formatNumber(state.statsData.loveCount)}`;
    if (elements.editDonationCount) elements.editDonationCount.placeholder = `Current: ${state.statsData.donationCount}`;
    if (elements.editGiftCount) elements.editGiftCount.placeholder = `Current: ${formatNumber(state.statsData.giftCount)}`;
    if (elements.editBehaviorPoint) elements.editBehaviorPoint.placeholder = `Current: ${state.statsData.behaviorPoint}`;
}

function formatStatName(statName) {
    const names = {
        avatarWorth: 'Avatar Worth',
        collectorPoint: 'Collector Point',
        loyaltyPoint: 'Loyalty Point',
        fishCaught: 'Fish Caught',
        loveCount: 'Love Count',
        donationCount: 'Donation Count',
        giftCount: 'Gift Count',
        behaviorPoint: 'Behavior Point'
    };
    return names[statName] || statName;
}

function clearInput(statName) {
    const inputId = `edit${statName.charAt(0).toUpperCase() + statName.slice(1)}`;
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        input.placeholder = `Current: ${formatNumber(state.statsData[statName])}`;
    }
}

// ======================
// STAT EDIT FUNCTIONS
// ======================
function updateStat(statName, newValue) {
    const oldValue = state.statsData[statName];
    
    // Validate input
    if (newValue === '' || isNaN(newValue) || newValue < 0) {
        showNotification('error', `Invalid value for ${formatStatName(statName)}! Please enter a valid positive number.`);
        return false;
    }
    
    // Convert to number
    newValue = parseInt(newValue);
    
    // Show confirmation modal
    showStatConfirmModal(statName, oldValue, newValue, () => {
        // Update the stat
        state.statsData[statName] = newValue;
        
        // Update display
        updateStatsDisplay();
        
        // Save to localStorage
        saveStatsData();
        
        // Clear input
        clearInput(statName);
        
        // Show success notification
        showNotification('success', 
            `${formatStatName(statName)} updated: ${formatNumber(oldValue)} → ${formatNumber(newValue)}`
        );
        
        // Sync if enabled
        if (CONFIG.SYNC_ENABLED) {
            syncStatsData();
        }
    });
    
    return true;
}

function resetAllStats() {
    showConfirmModal(
        'Reset All Statistics',
        'Are you sure you want to reset ALL statistics to default values? This action cannot be undone.',
        'warning',
        () => {
            state.statsData = { ...DEFAULT_STATS };
            updateStatsDisplay();
            saveStatsData();
            updateInputPlaceholders();
            
            showNotification('success', 'All statistics have been reset to default values!');
            
            // Clear all inputs
            const inputs = [
                'editAvatarWorth', 'editCollectorPoint', 'editLoyaltyPoint',
                'editFishCaught', 'editLoveCount', 'editDonationCount',
                'editGiftCount', 'editBehaviorPoint'
            ];
            
            inputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = '';
            });
            
            // Sync after reset
            if (CONFIG.SYNC_ENABLED) {
                syncStatsData();
            }
        }
    );
}

function loadDefaultStats() {
    state.statsData = { ...DEFAULT_STATS };
    updateStatsDisplay();
    saveStatsData();
    updateInputPlaceholders();
    
    showNotification('success', 'Default statistics loaded successfully!');
    
    // Sync after loading defaults
    if (CONFIG.SYNC_ENABLED) {
        syncStatsData();
    }
}

function exportStats() {
    const exportData = {
        stats: state.statsData,
        metadata: {
            exportedAt: new Date().toISOString(),
            version: '3.0.0',
            source: 'Vey X IDV Dashboard'
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vey_stats_export_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('success', 'Statistics exported successfully!');
}

function importStats() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (!importedData.stats || typeof importedData.stats !== 'object') {
                    throw new Error('Invalid stats file format');
                }
                
                const requiredStats = Object.keys(DEFAULT_STATS);
                for (const stat of requiredStats) {
                    if (typeof importedData.stats[stat] !== 'number' || importedData.stats[stat] < 0) {
                        throw new Error(`Invalid value for ${stat}`);
                    }
                }
                
                showConfirmModal(
                    'Import Statistics',
                    `Are you sure you want to import statistics? This will overwrite current values.`,
                    'info',
                    () => {
                        state.statsData = { ...importedData.stats };
                        updateStatsDisplay();
                        saveStatsData();
                        updateInputPlaceholders();
                        
                        showNotification('success', 'Statistics imported successfully!');
                        
                        // Sync after import
                        if (CONFIG.SYNC_ENABLED) {
                            syncStatsData();
                        }
                    }
                );
                
            } catch (error) {
                console.error('Import error:', error);
                showNotification('error', 'Failed to import statistics: Invalid file format');
            }
        };
        
        reader.readAsText(file);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// ======================
// DEVICE MANAGEMENT
// ======================
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
        
        const deviceInfo = {
            id: deviceId,
            firstSeen: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            syncCount: 0,
            playtimeAdded: 0,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
        state.deviceInfo = deviceInfo;
    }
    return deviceId;
}

function getDeviceInfo() {
    if (!state.deviceInfo) {
        const savedInfo = localStorage.getItem('deviceInfo');
        if (savedInfo) {
            state.deviceInfo = JSON.parse(savedInfo);
        } else {
            const deviceId = getDeviceId();
            state.deviceInfo = {
                id: deviceId,
                firstSeen: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                syncCount: 0,
                playtimeAdded: 0,
                userAgent: navigator.userAgent,
                platform: navigator.platform
            };
            localStorage.setItem('deviceInfo', JSON.stringify(state.deviceInfo));
        }
    }
    return state.deviceInfo;
}

function updateDeviceInfo() {
    const deviceInfo = getDeviceInfo();
    deviceInfo.lastActive = new Date().toISOString();
    localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
    state.deviceInfo = deviceInfo;
}

function updateDeviceDisplay() {
    const deviceInfo = getDeviceInfo();
    const shortId = deviceInfo.id.substring(0, 8) + '...';
    
    if (elements.deviceIdDisplay) elements.deviceIdDisplay.textContent = shortId;
    if (elements.deviceIdFull) elements.deviceIdFull.textContent = deviceInfo.id;
    if (elements.adminDeviceId) elements.adminDeviceId.textContent = shortId;
    
    if (elements.deviceFirstSeen) elements.deviceFirstSeen.textContent = formatDateTime(new Date(deviceInfo.firstSeen));
    if (elements.deviceSyncCount) elements.deviceSyncCount.textContent = deviceInfo.syncCount;
    if (elements.deviceLastActive) elements.deviceLastActive.textContent = formatDateTime(new Date(deviceInfo.lastActive));
    if (elements.devicePlaytimeAdded) elements.devicePlaytimeAdded.textContent = formatHoursAndMinutes(deviceInfo.playtimeAdded);
}

// ======================
// TIME-BASED INDICATOR
// ======================
function setTimeBasedIndicator() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    let timeText = '';
    let timeIcon = '';
    let timeClass = '';
    
    if (hour >= 4 && hour < 12) {
        timeText = `Pagi ${hour}:${minutes}`;
        timeIcon = '🌅';
        timeClass = 'time-morning';
    } else if (hour >= 12 && hour < 17) {
        timeText = `Siang ${hour}:${minutes}`;
        timeIcon = '☀️';
        timeClass = 'time-afternoon';
    } else if (hour >= 17 && hour < 20) {
        timeText = `Sore ${hour}:${minutes}`;
        timeIcon = '🌇';
        timeClass = 'time-evening';
    } else {
        timeText = `Malam ${hour}:${minutes}`;
        timeIcon = '🌙';
        timeClass = 'time-night';
    }
    
    if (elements.timeIcon) elements.timeIcon.textContent = timeIcon;
    if (elements.timeText) elements.timeText.textContent = timeText;
    
    // Update body class for background
    document.body.className = timeClass;
    
    // Update every minute
    setTimeout(setTimeBasedIndicator, 60000);
}

// ======================
// PLAYTIME SYSTEM
// ======================
function loadPlaytimeData() {
    const savedData = localStorage.getItem('playtimeData');
    const currentDate = new Date();
    const today = currentDate.toDateString();
    
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekStart = firstDayOfWeek.toDateString();
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString();
    
    if (savedData) {
        try {
            state.playtimeData = JSON.parse(savedData);
            
            // Reset daily stats if new day
            if (state.playtimeData.todayDate !== today) {
                state.playtimeData.todaySeconds = 0;
                state.playtimeData.todayDate = today;
            }
            
            // Reset weekly stats if new week
            if (state.playtimeData.weekStartDate !== weekStart) {
                state.playtimeData.weekSeconds = 0;
                state.playtimeData.weekStartDate = weekStart;
            }
            
            // Reset monthly stats if new month
            if (state.playtimeData.monthStartDate !== firstDayOfMonth) {
                state.playtimeData.monthSeconds = 0;
                state.playtimeData.monthStartDate = firstDayOfMonth;
            }
            
            console.log('Playtime data loaded from localStorage');
            
        } catch (error) {
            console.error('Error parsing playtime data:', error);
            initializeNewPlaytimeData();
        }
    } else {
        initializeNewPlaytimeData();
    }
    
    updatePlaytimeDisplay();
}

function initializeNewPlaytimeData() {
    const currentDate = new Date();
    const today = currentDate.toDateString();
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekStart = firstDayOfWeek.toDateString();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString();
    
    state.playtimeData = {
        totalSeconds: 3891 * 3600 + 48 * 60, // 3891 hours 48 minutes
        todaySeconds: 0,
        weekSeconds: 0,
        monthSeconds: 0,
        sessions: 0,
        lastUpdated: new Date().toISOString(),
        todayDate: today,
        weekStartDate: weekStart,
        monthStartDate: firstDayOfMonth,
        isOnline: false,
        lastStatusChange: null,
        deviceContributions: {}
    };
    
    console.log('New playtime data initialized');
}

function savePlaytimeData() {
    if (state.playtimeData) {
        state.playtimeData.lastUpdated = new Date().toISOString();
        localStorage.setItem('playtimeData', JSON.stringify(state.playtimeData));
    }
}

function updatePlaytimeDisplay() {
    if (!state.playtimeData) return;
    
    if (elements.playtimeCounter) elements.playtimeCounter.textContent = formatTimeFromSeconds(state.playtimeData.totalSeconds);
    if (elements.playtimeToday) elements.playtimeToday.textContent = formatShortTimeFromSeconds(state.playtimeData.todaySeconds);
    if (elements.playtimeWeek) elements.playtimeWeek.textContent = formatShortTimeFromSeconds(state.playtimeData.weekSeconds);
    if (elements.playtimeMonth) elements.playtimeMonth.textContent = formatShortTimeFromSeconds(state.playtimeData.monthSeconds);
    if (elements.playtimeSessions) elements.playtimeSessions.textContent = state.playtimeData.sessions;
    
    const totalHours = Math.floor(state.playtimeData.totalSeconds / 3600);
    const totalMinutes = Math.floor((state.playtimeData.totalSeconds % 3600) / 60);
    if (elements.totalPlaytime) elements.totalPlaytime.textContent = formatPlaytime(totalHours, totalMinutes);
    
    updateTierDisplay();
    
    if (state.isAdminLoggedIn) {
        updateAdminDashboard();
    }
}

function startPlaytimeCounter() {
    if (state.playtimeInterval) {
        clearInterval(state.playtimeInterval);
    }
    
    state.playtimeInterval = setInterval(() => {
        if (state.playtimeData && state.playtimeData.isOnline) {
            // Increment all playtime counters
            state.playtimeData.totalSeconds++;
            state.playtimeData.todaySeconds++;
            state.playtimeData.weekSeconds++;
            state.playtimeData.monthSeconds++;
            
            // Track device contribution
            const deviceId = getDeviceId();
            if (!state.playtimeData.deviceContributions[deviceId]) {
                state.playtimeData.deviceContributions[deviceId] = 0;
            }
            state.playtimeData.deviceContributions[deviceId]++;
            
            // Update device info
            const deviceInfo = getDeviceInfo();
            deviceInfo.playtimeAdded++;
            localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
            
            updatePlaytimeDisplay();
            
            // Auto-save every 30 seconds
            if (state.playtimeData.totalSeconds % 30 === 0) {
                savePlaytimeData();
            }
        }
    }, 1000);
}

// ======================
// SYNC SYSTEM
// ======================
async function syncPlaytimeData() {
    if (!CONFIG.SYNC_ENABLED || state.isSyncing || !state.playtimeData) {
        return false;
    }
    
    state.isSyncing = true;
    state.syncAttempts++;
    
    try {
        updateSyncStatus('syncing', 'Syncing...');
        
        const deviceId = getDeviceId();
        const deviceInfo = getDeviceInfo();
        
        const syncData = {
            deviceId: deviceId,
            deviceInfo: deviceInfo,
            playtimeData: {
                totalSeconds: state.playtimeData.totalSeconds,
                sessions: state.playtimeData.sessions,
                isOnline: state.playtimeData.isOnline,
                deviceContributions: state.playtimeData.deviceContributions,
                todaySeconds: state.playtimeData.todaySeconds,
                weekSeconds: state.playtimeData.weekSeconds,
                monthSeconds: state.playtimeData.monthSeconds
            },
            statsData: state.statsData,
            timestamp: new Date().toISOString(),
            action: 'push'
        };
        
        console.log('Sending sync data:', syncData);
        
        const response = await fetch(CONFIG.SYNC_SERVER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Device-ID': deviceId
            },
            body: JSON.stringify(syncData)
        });
        
        if (!response.ok) {
            throw new Error(`Sync failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Merge server data if newer
            if (result.serverData) {
                if (result.serverData.totalSeconds > state.playtimeData.totalSeconds) {
                    console.log('Server has newer data, updating local...');
                    
                    const diff = result.serverData.totalSeconds - state.playtimeData.totalSeconds;
                    state.playtimeData.totalSeconds = result.serverData.totalSeconds;
                    state.playtimeData.todaySeconds += diff;
                    state.playtimeData.weekSeconds += diff;
                    state.playtimeData.monthSeconds += diff;
                    state.playtimeData.sessions = Math.max(state.playtimeData.sessions, result.serverData.sessions || 0);
                    
                    if (result.serverData.deviceContributions) {
                        state.playtimeData.deviceContributions = {
                            ...state.playtimeData.deviceContributions,
                            ...result.serverData.deviceContributions
                        };
                    }
                    
                    updatePlaytimeDisplay();
                    savePlaytimeData();
                }
            }
            
            // Merge stats data
            if (result.statsData) {
                state.statsData = { ...state.statsData, ...result.statsData };
                updateStatsDisplay();
                saveStatsData();
            }
            
            state.lastSyncTime = new Date();
            state.syncedDevices = result.connectedDevices || 0;
            
            // Update device info
            deviceInfo.syncCount++;
            deviceInfo.lastActive = new Date().toISOString();
            localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
            state.deviceInfo = deviceInfo;
            
            // Update UI
            if (elements.lastSyncTime) elements.lastSyncTime.textContent = formatTime(state.lastSyncTime);
            if (elements.syncedDevicesCount) elements.syncedDevicesCount.textContent = state.syncedDevices;
            updateDeviceDisplay();
            
            updateSyncStatus('success', 'Synced');
            
            console.log('Sync successful:', result);
            state.syncAttempts = 0;
            
            return true;
            
        } else {
            throw new Error(result.error || 'Sync failed');
        }
        
    } catch (error) {
        console.error('Sync error:', error);
        
        if (state.syncAttempts < CONFIG.SYNC_RETRY_ATTEMPTS) {
            console.log(`Retrying sync in ${CONFIG.SYNC_RETRY_DELAY/1000} seconds...`);
            updateSyncStatus('retrying', `Retrying (${state.syncAttempts}/${CONFIG.SYNC_RETRY_ATTEMPTS})`);
            
            setTimeout(() => {
                syncPlaytimeData();
            }, CONFIG.SYNC_RETRY_DELAY);
            
        } else {
            updateSyncStatus('error', 'Sync Failed');
            console.error('Max sync retries reached');
        }
        
        return false;
        
    } finally {
        state.isSyncing = false;
    }
}

async function syncStatsData() {
    if (!CONFIG.SYNC_ENABLED || state.isSyncing) return false;
    
    try {
        const deviceId = getDeviceId();
        
        const syncData = {
            deviceId: deviceId,
            action: 'syncStats',
            statsData: state.statsData,
            timestamp: new Date().toISOString()
        };
        
        console.log('Syncing stats data:', syncData);
        
        const response = await fetch(CONFIG.SYNC_SERVER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Device-ID': deviceId,
                'X-Sync-Type': 'stats'
            },
            body: JSON.stringify(syncData)
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                console.log('Stats sync successful:', result);
                return true;
            }
        }
        
        return false;
        
    } catch (error) {
        console.error('Stats sync error:', error);
        return false;
    }
}

function updateSyncStatus(status, text) {
    if (!elements.syncStatusText || !elements.syncStatusIndicator) return;
    
    elements.syncStatusText.textContent = text;
    elements.syncStatusIndicator.className = 'sync-status';
    
    switch(status) {
        case 'syncing':
            elements.syncStatusIndicator.classList.add('syncing');
            elements.syncStatusIndicator.style.background = 'rgba(0, 168, 255, 0.2)';
            elements.syncStatusIndicator.style.borderColor = 'var(--accent-info)';
            elements.syncStatusIndicator.style.color = 'var(--accent-info)';
            break;
            
        case 'success':
            elements.syncStatusIndicator.style.background = 'rgba(0, 255, 136, 0.2)';
            elements.syncStatusIndicator.style.borderColor = 'var(--accent-success)';
            elements.syncStatusIndicator.style.color = 'var(--accent-success)';
            break;
            
        case 'error':
            elements.syncStatusIndicator.style.background = 'rgba(255, 68, 68, 0.2)';
            elements.syncStatusIndicator.style.borderColor = 'var(--accent-error)';
            elements.syncStatusIndicator.style.color = 'var(--accent-error)';
            break;
            
        case 'retrying':
            elements.syncStatusIndicator.style.background = 'rgba(255, 170, 0, 0.2)';
            elements.syncStatusIndicator.style.borderColor = 'var(--accent-warning)';
            elements.syncStatusIndicator.style.color = 'var(--accent-warning)';
            break;
            
        default:
            elements.syncStatusIndicator.style.background = 'rgba(156, 39, 176, 0.2)';
            elements.syncStatusIndicator.style.borderColor = 'var(--accent-sync)';
            elements.syncStatusIndicator.style.color = 'var(--accent-sync)';
    }
}

function startSyncInterval() {
    if (state.syncInterval) {
        clearInterval(state.syncInterval);
    }
    
    if (CONFIG.SYNC_ENABLED && CONFIG.SYNC_MODE === 'auto') {
        state.syncInterval = setInterval(() => {
            syncPlaytimeData();
        }, CONFIG.SYNC_INTERVAL);
        
        console.log('Auto-sync started:', CONFIG.SYNC_INTERVAL + 'ms interval');
    }
}

// ======================
// PLAYER STATUS
// ======================
function updatePlayerStatus(isOnline) {
    if (!state.playtimeData) return;
    
    const wasOnline = state.playtimeData.isOnline;
    state.playtimeData.isOnline = isOnline;
    
    if (isOnline && !wasOnline) {
        // User just came online
        state.playtimeData.sessions++;
        state.playtimeData.lastStatusChange = new Date().toISOString();
        
        if (elements.playtimeStatusText) elements.playtimeStatusText.textContent = 'Active';
        if (elements.playtimeStatus) {
            elements.playtimeStatus.style.background = 'rgba(0, 255, 136, 0.15)';
            elements.playtimeStatus.style.borderColor = 'rgba(0, 255, 136, 0.3)';
            elements.playtimeStatus.style.color = 'var(--accent-success)';
        }
        
        console.log('Playtime started - user is online');
        
    } else if (!isOnline && wasOnline) {
        // User just went offline
        state.playtimeData.lastStatusChange = new Date().toISOString();
        
        if (elements.playtimeStatusText) elements.playtimeStatusText.textContent = 'Paused';
        if (elements.playtimeStatus) {
            elements.playtimeStatus.style.background = 'rgba(255, 68, 68, 0.15)';
            elements.playtimeStatus.style.borderColor = 'rgba(255, 68, 68, 0.3)';
            elements.playtimeStatus.style.color = 'var(--accent-error)';
        }
        
        // Save and sync when going offline
        savePlaytimeData();
        syncPlaytimeData();
        
        console.log('Playtime paused - user is offline');
    }
}

// ======================
// COUNTDOWN TIMER
// ======================
function startCountdown() {
    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
    }
    
    state.countdown = CONFIG.COUNTDOWN_START;
    if (elements.countdown) elements.countdown.textContent = state.countdown;
    
    state.countdownInterval = setInterval(() => {
        state.countdown--;
        if (elements.countdown) elements.countdown.textContent = state.countdown;
        
        if (state.countdown <= 0) {
            clearInterval(state.countdownInterval);
            refreshData();
        }
    }, 1000);
}

// ======================
// UI UPDATE FUNCTIONS
// ======================
function updateLastUpdateTime() {
    const now = new Date();
    if (elements.lastUpdate) elements.lastUpdate.textContent = formatTime(now);
}

function updateStatusUI(data) {
    if (!data) return;
    
    const presenceType = data.userPresenceType || 0;
    const isOnline = presenceType !== 0;
    const isInGame = presenceType === 2;
    const isInIndoVoice = data.isInIndoVoice || false;
    
    if (elements.apiStatus) {
        elements.apiStatus.textContent = "Online";
        elements.apiStatus.style.color = "var(--accent-success)";
    }
    
    updatePlayerStatus(isOnline);
    
    if (!isOnline) {
        if (elements.statusIndicator) elements.statusIndicator.className = 'status-indicator offline';
        if (elements.statusText) elements.statusText.textContent = 'OFFLINE';
        if (elements.avatarStatus) {
            elements.avatarStatus.className = '';
            elements.avatarStatus.classList.remove('online', 'ingame');
        }
        
        if (elements.gameInfoSection) elements.gameInfoSection.style.display = 'none';
        
    } else if (isInIndoVoice) {
        if (elements.statusIndicator) elements.statusIndicator.className = 'status-indicator ingame';
        if (elements.statusText) elements.statusText.textContent = 'INDO VOICE';
        if (elements.avatarStatus) elements.avatarStatus.className = 'avatar-status ingame';
        
        if (elements.gameInfoSection) elements.gameInfoSection.style.display = 'block';
        if (elements.currentGame) elements.currentGame.textContent = 'Indo Voice';
        if (elements.gameStatus) elements.gameStatus.textContent = 'Online';
        if (elements.joinButton) elements.joinButton.style.display = 'inline-flex';
        
    } else if (isInGame) {
        if (elements.statusIndicator) elements.statusIndicator.className = 'status-indicator ingame';
        if (elements.statusText) elements.statusText.textContent = 'IN GAME';
        if (elements.avatarStatus) elements.avatarStatus.className = 'avatar-status ingame';
        
        if (elements.gameInfoSection) elements.gameInfoSection.style.display = 'block';
        if (elements.currentGame) elements.currentGame.textContent = data.lastLocation || 'Playing a game';
        if (elements.gameStatus) elements.gameStatus.textContent = 'Online';
        if (elements.joinButton) elements.joinButton.style.display = 'none';
        
    } else {
        if (elements.statusIndicator) elements.statusIndicator.className = 'status-indicator online';
        if (elements.statusText) elements.statusText.textContent = 'ONLINE';
        if (elements.avatarStatus) elements.avatarStatus.className = 'avatar-status online';
        
        if (elements.gameInfoSection) elements.gameInfoSection.style.display = 'none';
    }
    
    if (data.username && data.username !== '7VeyForDey h3h3h3' && elements.username) {
        elements.username.textContent = data.username;
    }
    
    if (data.displayName && elements.displayName) {
        elements.displayName.textContent = data.displayName;
    }
    
    if (data.avatarUrl && elements.avatarImg) {
        const timestamp = new Date().getTime();
        elements.avatarImg.src = data.avatarUrl + '?t=' + timestamp;
    }
    
    if (elements.avatarImg) {
        elements.avatarImg.onerror = function() {
            const timestamp = new Date().getTime();
            this.src = CONFIG.AVATAR_URL + '?t=' + timestamp;
        };
    }
}

// ======================
// API FUNCTIONS
// ======================
async function fetchRobloxData() {
    try {
        console.log('Fetching data from API...');
        
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
            throw new Error(data.error || 'API returned error');
        }
        
        console.log('API data fetched successfully');
        return data;
        
    } catch (error) {
        console.error('Error fetching API data:', error);
        
        if (elements.apiStatus) {
            elements.apiStatus.textContent = "Offline";
            elements.apiStatus.style.color = "var(--accent-error)";
        }
        
        return {
            success: true,
            userPresenceType: 0,
            isInIndoVoice: false,
            username: "7VeyForDey h3h3h3",
            displayName: "@VeyH3H3H3H3",
            avatarUrl: CONFIG.AVATAR_URL,
            lastLocation: ""
        };
    }
}

// ======================
// MAIN REFRESH FUNCTION
// ======================
async function refreshData() {
    if (state.isRefreshing) return;
    
    try {
        state.isRefreshing = true;
        if (elements.refreshBtn) {
            elements.refreshBtn.classList.add('loading');
            elements.refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        }
        
        const data = await fetchRobloxData();
        state.lastStatus = data;
        
        updateStatusUI(data);
        updateLastUpdateTime();
        
        console.log('Data refreshed successfully');
        if (state.playtimeData) {
            console.log(`Current playtime: ${formatTimeFromSeconds(state.playtimeData.totalSeconds)}`);
            console.log(`Status: ${state.playtimeData.isOnline ? 'Online (Playtime Active)' : 'Offline (Playtime Paused)'}`);
        }
        
    } catch (error) {
        console.error('Refresh failed:', error);
        
        if (elements.statusIndicator) {
            elements.statusIndicator.className = 'status-indicator offline';
            if (elements.statusText) elements.statusText.textContent = 'ERROR';
        }
        
        if (elements.apiStatus) {
            elements.apiStatus.textContent = "Error";
            elements.apiStatus.style.color = "var(--accent-error)";
        }
        
    } finally {
        state.isRefreshing = false;
        if (elements.refreshBtn) {
            elements.refreshBtn.classList.remove('loading');
            elements.refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Now';
        }
        
        startCountdown();
    }
}

// ======================
// ADMIN FUNCTIONS
// ======================
function updateAdminDashboard() {
    if (!state.playtimeData) return;
    
    if (elements.adminTotalPlaytime) elements.adminTotalPlaytime.textContent = formatTimeFromSeconds(state.playtimeData.totalSeconds);
    if (elements.adminSessionCount) elements.adminSessionCount.textContent = state.playtimeData.sessions;
    
    const avgSession = state.playtimeData.sessions > 0 ? 
        Math.round(state.playtimeData.totalSeconds / state.playtimeData.sessions) : 0;
    if (elements.adminAvgSession) elements.adminAvgSession.textContent = formatShortTimeFromSeconds(avgSession);
    
    if (elements.adminOnlineStatus) {
        elements.adminOnlineStatus.textContent = state.playtimeData.isOnline ? "Online" : "Offline";
        elements.adminOnlineStatus.style.color = state.playtimeData.isOnline ? 
            "var(--accent-success)" : "var(--accent-error)";
    }
    
    const totalHours = state.playtimeData.totalSeconds / 3600;
    const { currentTier, nextTier } = calculateCurrentTier(totalHours);
    const progress = calculateTierProgress(totalHours, currentTier, nextTier);
    
    if (elements.adminCurrentTier) elements.adminCurrentTier.textContent = currentTier.name;
    if (elements.adminTotalHours) elements.adminTotalHours.textContent = totalHours.toFixed(1) + ' hours';
    if (elements.adminNextTier) elements.adminNextTier.textContent = nextTier.name;
    if (elements.adminTierProgress) elements.adminTierProgress.textContent = progress.toFixed(1) + '%';
    
    const dataSize = JSON.stringify(state.playtimeData).length / 1024;
    if (elements.storageStatus) elements.storageStatus.textContent = `Active (${dataSize.toFixed(2)} KB)`;
    if (elements.adminLastSync) elements.adminLastSync.textContent = state.lastSyncTime ? formatTime(state.lastSyncTime) : 'Never';
}

// ======================
// NOTIFICATION SYSTEM
// ======================
function showNotification(type, message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.15)' :
                      type === 'error' ? 'rgba(255, 68, 68, 0.15)' :
                      type === 'warning' ? 'rgba(255, 170, 0, 0.15)' : 
                      'rgba(0, 168, 255, 0.15)'};
        border: 1px solid ${type === 'success' ? 'var(--accent-success)' :
                           type === 'error' ? 'var(--accent-error)' :
                           type === 'warning' ? 'var(--accent-warning)' : 
                           'var(--accent-info)'};
        color: ${type === 'success' ? 'var(--accent-success)' :
                type === 'error' ? 'var(--accent-error)' :
                type === 'warning' ? 'var(--accent-warning)' : 
                'var(--accent-info)'};
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 3000;
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--shadow-lg);
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s;
    `;
    
    closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    };
    
    closeBtn.onmouseout = () => {
        closeBtn.style.background = 'none';
    };
    
    closeBtn.onclick = () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    };
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ======================
// CONFIRMATION MODALS
// ======================
function showConfirmModal(title, message, type, onConfirm) {
    const existingModal = document.querySelector('.confirm-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    
    const icon = type === 'warning' ? 'fa-exclamation-triangle' :
                 type === 'danger' ? 'fa-skull-crossbones' :
                 type === 'success' ? 'fa-check-circle' : 'fa-question-circle';
    
    const iconColor = type === 'warning' ? 'var(--accent-warning)' :
                      type === 'danger' ? 'var(--accent-error)' :
                      type === 'success' ? 'var(--accent-success)' : 'var(--accent-info)';
    
    modal.innerHTML = `
        <div class="confirm-modal-content">
            <div class="confirm-modal-header">
                <i class="fas ${icon}" style="color: ${iconColor}"></i>
                <h3>${title}</h3>
            </div>
            <div class="confirm-modal-body">
                <p>${message}</p>
            </div>
            <div class="confirm-modal-buttons">
                <button class="confirm-modal-btn cancel">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="confirm-modal-btn confirm ${type}">
                    <i class="fas fa-check"></i> Confirm
                </button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
    `;
    
    const modalContent = modal.querySelector('.confirm-modal-content');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, 
            rgba(30, 30, 60, 0.95), 
            rgba(20, 20, 40, 0.98));
        width: 90%;
        max-width: 500px;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
        transform: translateY(30px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid var(--border-color);
        backdrop-filter: var(--glass-blur);
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modalContent.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    modal.querySelector('.confirm-modal-btn.cancel').onclick = () => {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.confirm-modal-btn.confirm').onclick = () => {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => {
            modal.remove();
            if (onConfirm) onConfirm();
        }, 300);
    };
}

function showStatConfirmModal(statName, oldValue, newValue, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'stat-confirm-modal';
    
    const formattedOldValue = formatNumber(oldValue);
    const formattedNewValue = formatNumber(newValue);
    const displayName = formatStatName(statName);
    
    modal.innerHTML = `
        <div class="stat-confirm-content">
            <div class="stat-confirm-header">
                <i class="fas fa-edit"></i>
                <h3>Confirm Stat Change</h3>
            </div>
            <div class="stat-confirm-body">
                <div class="stat-change-info">
                    <div class="stat-change-item">
                        <span class="stat-change-label">Statistic:</span>
                        <span class="stat-change-value">${displayName}</span>
                    </div>
                    <div class="stat-change-item">
                        <span class="stat-change-label">Current Value:</span>
                        <span class="stat-change-value old">${formattedOldValue}</span>
                    </div>
                    <div class="stat-change-item">
                        <span class="stat-change-label">New Value:</span>
                        <span class="stat-change-value new">${formattedNewValue}</span>
                    </div>
                    <div class="stat-change-item">
                        <span class="stat-change-label">Difference:</span>
                        <span class="stat-change-value ${newValue >= oldValue ? 'new' : 'old'}">
                            ${newValue >= oldValue ? '+' : ''}${formatNumber(newValue - oldValue)}
                        </span>
                    </div>
                </div>
            </div>
            <div class="stat-confirm-buttons">
                <button class="stat-confirm-btn cancel">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="stat-confirm-btn confirm">
                    <i class="fas fa-check"></i> Confirm Change
                </button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
    `;
    
    const modalContent = modal.querySelector('.stat-confirm-content');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, 
            rgba(30, 30, 60, 0.95), 
            rgba(20, 20, 40, 0.98));
        width: 90%;
        max-width: 500px;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
        transform: translateY(30px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid var(--border-color);
        backdrop-filter: var(--glass-blur);
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modalContent.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    modal.querySelector('.stat-confirm-btn.cancel').onclick = () => {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.stat-confirm-btn.confirm').onclick = () => {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => {
            modal.remove();
            if (onConfirm) onConfirm();
        }, 300);
    };
}

// ======================
// EVENT LISTENERS SETUP
// ======================
function setupEditStatsListeners() {
    // Setup edit stat buttons
    document.querySelectorAll('.btn-edit-stat').forEach(button => {
        button.addEventListener('click', () => {
            const stat = button.dataset.stat;
            const inputId = `edit${stat.charAt(0).toUpperCase() + stat.slice(1)}`;
            const input = document.getElementById(inputId);
            
            if (input && input.value.trim() !== '') {
                updateStat(stat, input.value.trim());
            } else {
                showNotification('warning', `Please enter a value for ${formatStatName(stat)}`);
            }
        });
    });
    
    // Setup enter key for inputs
    const statInputs = [
        'editAvatarWorth', 'editCollectorPoint', 'editLoyaltyPoint',
        'editFishCaught', 'editLoveCount', 'editDonationCount',
        'editGiftCount', 'editBehaviorPoint'
    ];
    
    statInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const stat = inputId.replace('edit', '');
                    const statName = stat.charAt(0).toLowerCase() + stat.slice(1);
                    
                    if (input.value.trim() !== '') {
                        updateStat(statName, input.value.trim());
                    }
                }
            });
        }
    });
    
    // Setup other stat control buttons
    if (elements.resetAllStatsBtn) {
        elements.resetAllStatsBtn.addEventListener('click', resetAllStats);
    }
    
    if (elements.loadDefaultStatsBtn) {
        elements.loadDefaultStatsBtn.addEventListener('click', loadDefaultStats);
    }
    
    if (elements.exportStatsBtn) {
        elements.exportStatsBtn.addEventListener('click', exportStats);
    }
    
    if (elements.importStatsBtn) {
        elements.importStatsBtn.addEventListener('click', importStats);
    }
}

function setupEventListeners() {
    // Manual refresh button
    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', refreshData);
    }
    
    // Manual sync button
    if (elements.manualSyncBtn) {
        elements.manualSyncBtn.addEventListener('click', () => {
            syncPlaytimeData();
        });
    }
    
    // Copy URL button
    if (elements.copyUrlBtn) {
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
    }
    
    // Device info button
    if (elements.deviceInfoBtn) {
        elements.deviceInfoBtn.addEventListener('click', () => {
            updateDeviceDisplay();
            elements.deviceModal.classList.add('active');
        });
    }
    
    // Admin login button
    if (elements.adminLoginBtn) {
        elements.adminLoginBtn.addEventListener('click', () => {
            elements.adminModal.classList.add('active');
            if (elements.loginSection) elements.loginSection.style.display = 'block';
            if (elements.adminDashboard) elements.adminDashboard.style.display = 'none';
            if (elements.loginError) elements.loginError.style.display = 'none';
            
            if (elements.adminUsername) elements.adminUsername.value = '';
            if (elements.adminPassword) elements.adminPassword.value = '';
        });
    }
    
    // Close modal buttons
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', () => {
            elements.adminModal.classList.remove('active');
            state.isAdminLoggedIn = false;
        });
    }
    
    if (elements.closeDeviceModal) {
        elements.closeDeviceModal.addEventListener('click', () => {
            elements.deviceModal.classList.remove('active');
        });
    }
    
    // Admin login
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => {
            const username = elements.adminUsername ? elements.adminUsername.value.trim() : '';
            const password = elements.adminPassword ? elements.adminPassword.value.trim() : '';
            
            if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
                if (elements.loginSection) elements.loginSection.style.display = 'none';
                if (elements.adminDashboard) elements.adminDashboard.style.display = 'block';
                state.isAdminLoggedIn = true;
                updateAdminDashboard();
                updateDeviceDisplay();
            } else {
                if (elements.loginError) elements.loginError.style.display = 'block';
                if (elements.adminUsername) elements.adminUsername.value = '';
                if (elements.adminPassword) elements.adminPassword.value = '';
            }
        });
    }
    
    // Apply adjustment button
    if (elements.applyAdjustmentBtn) {
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
                const diff = newTotalSeconds - state.playtimeData.totalSeconds;
                
                state.playtimeData.totalSeconds = newTotalSeconds;
                state.playtimeData.todaySeconds = Math.max(0, state.playtimeData.todaySeconds + diff);
                state.playtimeData.weekSeconds = Math.max(0, state.playtimeData.weekSeconds + diff);
                state.playtimeData.monthSeconds = Math.max(0, state.playtimeData.monthSeconds + diff);
                
                updatePlaytimeDisplay();
                savePlaytimeData();
                syncPlaytimeData();
                
                alert("Adjustment applied and synced!");
                if (elements.playtimeAdjustment) elements.playtimeAdjustment.value = "";
            }
        });
    }
    
    // Sync mode change
    if (elements.syncMode) {
        elements.syncMode.addEventListener('change', () => {
            CONFIG.SYNC_MODE = elements.syncMode.value;
            startSyncInterval();
            alert(`Sync mode changed to: ${CONFIG.SYNC_MODE}`);
        });
    }
    
    // Force sync button
    if (elements.forceSyncBtn) {
        elements.forceSyncBtn.addEventListener('click', () => {
            if (confirm("Force sync all devices? This will push local data to server.")) {
                syncPlaytimeData();
            }
        });
    }
    
    // Reset sync button
    if (elements.resetSyncBtn) {
        elements.resetSyncBtn.addEventListener('click', () => {
            if (confirm("Reset sync data? This will clear sync history but keep playtime.")) {
                state.syncAttempts = 0;
                state.lastSyncTime = null;
                if (elements.lastSyncTime) elements.lastSyncTime.textContent = 'Never';
                alert("Sync data reset!");
            }
        });
    }
    
    // Reset today button
    if (elements.resetTodayBtn) {
        elements.resetTodayBtn.addEventListener('click', () => {
            if (confirm("Reset today's playtime to 0? This action cannot be undone.")) {
                state.playtimeData.todaySeconds = 0;
                updatePlaytimeDisplay();
                savePlaytimeData();
                syncPlaytimeData();
                alert("Today's playtime has been reset and synced!");
            }
        });
    }
    
    // Reset all button
    if (elements.resetAllBtn) {
        elements.resetAllBtn.addEventListener('click', () => {
            if (confirm("Reset ALL playtime data? This action cannot be undone.")) {
                const currentDate = new Date();
                const today = currentDate.toDateString();
                const firstDayOfWeek = new Date(currentDate);
                firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                const weekStart = firstDayOfWeek.toDateString();
                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString();
                
                state.playtimeData = {
                    totalSeconds: 3891 * 3600 + 48 * 60,
                    todaySeconds: 0,
                    weekSeconds: 0,
                    monthSeconds: 0,
                    sessions: 0,
                    lastUpdated: new Date().toISOString(),
                    todayDate: today,
                    weekStartDate: weekStart,
                    monthStartDate: firstDayOfMonth,
                    isOnline: false,
                    lastStatusChange: null,
                    deviceContributions: {}
                };
                
                updatePlaytimeDisplay();
                savePlaytimeData();
                syncPlaytimeData();
                alert("All playtime data has been reset and synced!");
            }
        });
    }
    
    // Backup data button
    if (elements.backupDataBtn) {
        elements.backupDataBtn.addEventListener('click', () => {
            const backupData = {
                playtimeData: state.playtimeData,
                statsData: state.statsData,
                deviceInfo: state.deviceInfo,
                timestamp: new Date().toISOString(),
                version: '3.0.0'
            };
            
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `vey_backup_${new Date().toISOString().slice(0, 10)}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('success', 'Data backed up successfully!');
        });
    }
    
    // Device modal buttons
    if (elements.copyDeviceIdBtn) {
        elements.copyDeviceIdBtn.addEventListener('click', () => {
            const deviceId = getDeviceId();
            navigator.clipboard.writeText(deviceId)
                .then(() => {
                    showNotification('success', 'Device ID copied to clipboard!');
                })
                .catch(err => {
                    console.error('Copy failed:', err);
                    showNotification('error', 'Failed to copy Device ID');
                });
        });
    }
    
    if (elements.regenerateDeviceIdBtn) {
        elements.regenerateDeviceIdBtn.addEventListener('click', () => {
            if (confirm("Generate new Device ID? This will reset device statistics.")) {
                localStorage.removeItem('deviceId');
                localStorage.removeItem('deviceInfo');
                state.deviceInfo = null;
                getDeviceId(); // Generate new ID
                updateDeviceDisplay();
                showNotification('success', 'New Device ID generated!');
            }
        });
    }
    
    if (elements.clearDeviceDataBtn) {
        elements.clearDeviceDataBtn.addEventListener('click', () => {
            if (confirm("Clear all local data? This will reset all local statistics and playtime data.")) {
                localStorage.clear();
                location.reload(); // Reload the page
            }
        });
    }
    
    if (elements.exportDeviceDataBtn) {
        elements.exportDeviceDataBtn.addEventListener('click', () => {
            const deviceData = {
                deviceInfo: getDeviceInfo(),
                statsData: state.statsData,
                playtimeData: state.playtimeData,
                timestamp: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(deviceData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `vey_device_data_${new Date().toISOString().slice(0, 10)}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('success', 'Device data exported!');
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', (event) => {
        if (event.target === elements.adminModal) {
            elements.adminModal.classList.remove('active');
            state.isAdminLoggedIn = false;
        }
        
        if (event.target === elements.deviceModal) {
            elements.deviceModal.classList.remove('active');
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (elements.adminModal.classList.contains('active')) {
                elements.adminModal.classList.remove('active');
                state.isAdminLoggedIn = false;
            }
            
            if (elements.deviceModal.classList.contains('active')) {
                elements.deviceModal.classList.remove('active');
            }
        }
    });
}

// ======================
// INITIALIZATION
// ======================
function initialize() {
    console.log('Initializing Vey X IDV Dashboard...');
    
    // Set initial time
    setTimeBasedIndicator();
    
    // Load data
    loadStatsData();
    loadPlaytimeData();
    updateDeviceDisplay();
    
    // Initialize systems
    initializeTierSystem();
    startPlaytimeCounter();
    startSyncInterval();
    
    // Setup event listeners
    setupEventListeners();
    setupEditStatsListeners();
    
    // Initial refresh
    refreshData();
    
    // Perform initial sync
    setTimeout(() => {
        if (CONFIG.SYNC_ENABLED) {
            syncPlaytimeData();
        }
    }, 2000);
    
    console.log('Dashboard initialized successfully!');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);