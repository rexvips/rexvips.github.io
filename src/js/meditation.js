// Meditation App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initMeditationApp();
});

// Meditation App State
const meditationState = {
    currentSession: null,
    isRunning: false,
    sessionTimer: null,
    phaseTimer: null,
    sessionStartTime: null,
    sessionDuration: 5 * 60, // 5 minutes in seconds
    currentPhase: 0,
    phaseTimeRemaining: 0,
    cycleCount: 1,
    phases: {
        box: ['Breathe in slowly...', 'Hold your breath...', 'Breathe out slowly...', 'Hold your breath...'],
        '478': ['Breathe in through nose...', 'Hold your breath...', 'Breathe out through mouth...']
    },
    phaseDurations: {
        box: [4, 4, 4, 4],
        '478': [4, 7, 8]
    }
};

function initMeditationApp() {
    console.log('Initializing Meditation App...');
    
    // Bind event listeners
    bindMeditationEvents();
    
    // Initialize progress rings
    initProgressRings();
}

function bindMeditationEvents() {
    // Selection screen buttons
    const boxButton = document.getElementById('start-box-breathing');
    const breathing478Button = document.getElementById('start-478-breathing');
    
    if (boxButton) {
        boxButton.addEventListener('click', () => startMeditationSession('box'));
    }
    
    if (breathing478Button) {
        breathing478Button.addEventListener('click', () => startMeditationSession('478'));
    }
    
    // Complete session buttons
    const boxComplete = document.getElementById('box-complete');
    const breathing478Complete = document.getElementById('breathing-478-complete');
    
    if (boxComplete) {
        boxComplete.addEventListener('click', () => completeMeditationSession('box'));
    }
    
    if (breathing478Complete) {
        breathing478Complete.addEventListener('click', () => completeMeditationSession('478'));
    }
    
    // Haptic feedback on tap
    document.addEventListener('click', function(e) {
        if (meditationState.isRunning && e.target.closest('.meditation-session-screen')) {
            triggerHapticFeedback();
        }
    });
}

function initProgressRings() {
    const boxRing = document.getElementById('box-progress-ring');
    const breathing478Ring = document.getElementById('breathing-478-progress-ring');
    
    if (boxRing) {
        const circumference = 2 * Math.PI * 90;
        boxRing.style.strokeDasharray = circumference;
        boxRing.style.strokeDashoffset = circumference;
    }
    
    if (breathing478Ring) {
        const circumference = 2 * Math.PI * 90;
        breathing478Ring.style.strokeDasharray = circumference;
        breathing478Ring.style.strokeDashoffset = circumference;
    }
}

function startMeditationSession(type) {
    console.log(`Starting ${type} meditation session`);
    
    meditationState.currentSession = type;
    meditationState.isRunning = true;
    meditationState.sessionStartTime = Date.now();
    meditationState.currentPhase = 0;
    meditationState.cycleCount = 1;
    
    // Hide selection screen and show session screen
    document.getElementById('meditation-selection').style.display = 'none';
    document.getElementById(`${type === 'box' ? 'box-breathing' : 'breathing-478'}-session`).style.display = 'flex';
    
    // Start the session
    startSessionTimer(type);
    startPhaseTimer(type);
}

function startSessionTimer(type) {
    const sessionTimeElement = document.getElementById(`${type === 'box' ? 'box' : 'breathing-478'}-time-remaining`);
    
    meditationState.sessionTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - meditationState.sessionStartTime) / 1000);
        const remaining = Math.max(0, meditationState.sessionDuration - elapsed);
        
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        
        if (sessionTimeElement) {
            sessionTimeElement.textContent = `• ${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
        }
        
        // Update progress ring
        updateProgressRing(type, elapsed / meditationState.sessionDuration);
        
        if (remaining <= 0) {
            completeMeditationSession(type);
        }
    }, 1000);
}

function startPhaseTimer(type) {
    const phases = meditationState.phases[type];
    const durations = meditationState.phaseDurations[type];
    
    meditationState.phaseTimeRemaining = durations[meditationState.currentPhase];
    
    updatePhaseDisplay(type);
    
    meditationState.phaseTimer = setInterval(() => {
        meditationState.phaseTimeRemaining--;
        
        // Update counter
        const counterElement = document.getElementById(`${type === 'box' ? 'box' : 'breathing-478'}-counter`);
        if (counterElement) {
            counterElement.textContent = meditationState.phaseTimeRemaining;
        }
        
        if (meditationState.phaseTimeRemaining <= 0) {
            // Move to next phase
            meditationState.currentPhase = (meditationState.currentPhase + 1) % phases.length;
            
            // Update cycle count when starting a new cycle
            if (meditationState.currentPhase === 0) {
                meditationState.cycleCount++;
                const cycleElement = document.getElementById(`${type === 'box' ? 'box' : 'breathing-478'}-cycle`);
                if (cycleElement) {
                    cycleElement.textContent = `Cycle ${meditationState.cycleCount}`;
                }
            }
            
            meditationState.phaseTimeRemaining = durations[meditationState.currentPhase];
            updatePhaseDisplay(type);
        }
    }, 1000);
}

function updatePhaseDisplay(type) {
    const phases = meditationState.phases[type];
    const phaseElement = document.getElementById(`${type === 'box' ? 'box' : 'breathing-478'}-phase`);
    const counterElement = document.getElementById(`${type === 'box' ? 'box' : 'breathing-478'}-counter`);
    
    if (phaseElement) {
        phaseElement.textContent = phases[meditationState.currentPhase];
    }
    
    if (counterElement) {
        counterElement.textContent = meditationState.phaseTimeRemaining;
    }
}

function updateProgressRing(type, progress) {
    const ringElement = document.getElementById(`${type === 'box' ? 'box' : 'breathing-478'}-progress-ring`);
    
    if (ringElement) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (progress * circumference);
        ringElement.style.strokeDashoffset = offset;
    }
}

function completeMeditationSession(type) {
    console.log(`Completing ${type} meditation session`);
    
    meditationState.isRunning = false;
    
    // Clear timers
    if (meditationState.sessionTimer) {
        clearInterval(meditationState.sessionTimer);
        meditationState.sessionTimer = null;
    }
    
    if (meditationState.phaseTimer) {
        clearInterval(meditationState.phaseTimer);
        meditationState.phaseTimer = null;
    }
    
    // Show completion notification
    showCompletionNotification(type);
    
    // Return to selection screen after a delay
    setTimeout(() => {
        returnToSelectionScreen(type);
    }, 2000);
}

function showCompletionNotification(type) {
    // Create completion overlay
    const sessionScreen = document.getElementById(`${type === 'box' ? 'box-breathing' : 'breathing-478'}-session`);
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">✓</div>
            <h3>Session Complete!</h3>
            <p>Great job! You completed your ${type === 'box' ? 'Box Breathing' : '4-7-8 Breathing'} session.</p>
        </div>
    `;
    
    sessionScreen.appendChild(overlay);
    
    // Trigger haptic feedback if available
    triggerHapticFeedback();
}

function returnToSelectionScreen(type) {
    // Hide session screen
    document.getElementById(`${type === 'box' ? 'box-breathing' : 'breathing-478'}-session`).style.display = 'none';
    
    // Remove completion overlay
    const overlay = document.querySelector('.completion-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Show selection screen
    document.getElementById('meditation-selection').style.display = 'flex';
    
    // Reset state
    meditationState.currentSession = null;
    meditationState.currentPhase = 0;
    meditationState.cycleCount = 1;
    
    // Reset progress rings
    initProgressRings();
}

function triggerHapticFeedback() {
    // Haptic feedback for supported devices
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Visual feedback
    document.body.style.background = 'rgba(255, 255, 255, 0.1)';
    setTimeout(() => {
        document.body.style.background = '';
    }, 100);
}

// Navigation functionality for meditation page
function initMeditationNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage === 'meditate.html' && href === 'meditate.html') {
            link.classList.add('active');
        }
    });
}

// Export functions for use in other files
window.meditationApp = {
    initMeditationApp,
    startMeditationSession,
    completeMeditationSession,
    triggerHapticFeedback
};