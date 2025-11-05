// Vocabulary Word of the Day Application
class VocabularyApp {
    constructor() {
        this.vocabularyData = null;
        this.currentWord = null;
        this.currentCategory = 'all';
        this.favorites = this.loadFavorites();
        this.stats = this.loadStats();
        
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            this.showLoading(true);
            await this.loadVocabularyData();
            this.setupEventListeners();
            this.loadRandomWord();
            this.updateStats();
            this.showLoading(false);
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showToast('Failed to load vocabulary data', 'error');
            this.showLoading(false);
        }
    }

    // Load vocabulary data from JSON file
    async loadVocabularyData() {
        try {
            const response = await fetch('vocabulary-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.vocabularyData = await response.json();
            
            // Update total words count
            const totalWords = this.getAllWords().length;
            document.getElementById('totalWords').textContent = totalWords;
        } catch (error) {
            console.error('Error loading vocabulary data:', error);
            throw error;
        }
    }

    // Get all words from all categories
    getAllWords() {
        if (!this.vocabularyData) return [];
        
        return [
            ...this.vocabularyData.vocabulary.beginner,
            ...this.vocabularyData.vocabulary.intermediate,
            ...this.vocabularyData.vocabulary.expert
        ];
    }

    // Get words by category
    getWordsByCategory(category) {
        if (!this.vocabularyData) return [];
        
        if (category === 'all') {
            return this.getAllWords();
        }
        
        return this.vocabularyData.vocabulary[category] || [];
    }

    // Load a random word based on current category
    loadRandomWord() {
        const words = this.getWordsByCategory(this.currentCategory);
        if (words.length === 0) {
            this.showToast('No words available for this category', 'warning');
            return;
        }

        const randomIndex = Math.floor(Math.random() * words.length);
        this.currentWord = words[randomIndex];
        this.displayWord(this.currentWord);
        this.updateStats();
    }

    // Display word information on the card
    displayWord(word) {
        if (!word) return;

        // Update category badge
        const categoryBadge = document.getElementById('categoryBadge');
        const categoryText = document.getElementById('categoryText');
        categoryBadge.className = `category-badge ${word.category.toLowerCase()}`;
        categoryText.textContent = word.category;

        // Update word title
        document.getElementById('wordTitle').textContent = word.word;

        // Update meaning
        document.getElementById('wordMeaning').textContent = word.meaning;

        // Update conversation
        document.getElementById('conversationSpeaker1').textContent = word.conversation.speaker1;
        document.getElementById('conversationSpeaker2').textContent = word.conversation.speaker2;

        // Update similar words
        this.displaySimilarWords(word.similarWords);

        // Update favorite button state
        this.updateFavoriteButton();

        // Add word animation
        this.animateWordCard();
    }

    // Display similar words as badges
    displaySimilarWords(similarWords) {
        const container = document.getElementById('similarWordsContainer');
        container.innerHTML = '';
        
        similarWords.forEach(word => {
            const badge = document.createElement('span');
            badge.className = 'similar-word';
            badge.textContent = word;
            badge.addEventListener('click', () => {
                this.showToast(`Similar word: ${word}`, 'info');
            });
            container.appendChild(badge);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadRandomWord();
            this.showToast('New word loaded!', 'success');
        });

        // Category filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setCategory(category);
            });
        });

        // Action buttons
        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareWord();
        });

        document.getElementById('studyBtn').addEventListener('click', () => {
            this.enterStudyMode();
        });

        // Pronunciation button
        document.getElementById('pronunciationBtn').addEventListener('click', () => {
            this.speakWord();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                this.loadRandomWord();
            } else if (e.key === 'f' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                this.toggleFavorite();
            }
        });
    }

    // Set active category
    setCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Load new word from selected category
        this.loadRandomWord();
        this.showToast(`Switched to ${category === 'all' ? 'all categories' : category} words`, 'info');
    }

    // Toggle favorite status
    toggleFavorite() {
        if (!this.currentWord) return;

        const wordKey = `${this.currentWord.category}-${this.currentWord.id}`;
        
        if (this.favorites.includes(wordKey)) {
            this.favorites = this.favorites.filter(fav => fav !== wordKey);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(wordKey);
            this.showToast('Added to favorites!', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoriteButton();
        this.updateStats();
    }

    // Update favorite button appearance
    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const icon = favoriteBtn.querySelector('i');
        
        if (!this.currentWord) return;
        
        const wordKey = `${this.currentWord.category}-${this.currentWord.id}`;
        const isFavorite = this.favorites.includes(wordKey);
        
        if (isFavorite) {
            icon.className = 'fas fa-heart';
            favoriteBtn.classList.add('favorited');
        } else {
            icon.className = 'far fa-heart';
            favoriteBtn.classList.remove('favorited');
        }
    }

    // Share current word
    async shareWord() {
        if (!this.currentWord) return;

        const shareText = `Word of the Day: ${this.currentWord.word}\n\nDefinition: ${this.currentWord.meaning}\n\nExample: "${this.currentWord.conversation.speaker1}"\n\nCategory: ${this.currentWord.category}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Word of the Day',
                    text: shareText,
                    url: window.location.href
                });
                this.showToast('Word shared!', 'success');
            } catch (error) {
                this.copyToClipboard(shareText);
            }
        } else {
            this.copyToClipboard(shareText);
        }
    }

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Word copied to clipboard!', 'success');
        } catch (error) {
            this.showToast('Failed to copy word', 'error');
        }
    }

    // Speak current word (Text-to-Speech)
    speakWord() {
        if (!this.currentWord) return;

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentWord.word);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
            this.showToast(`Speaking: ${this.currentWord.word}`, 'info');
        } else {
            this.showToast('Text-to-speech not supported', 'warning');
        }
    }

    // Enter study mode (show multiple words for practice)
    enterStudyMode() {
        const words = this.getWordsByCategory(this.currentCategory);
        const studyWords = words.slice(0, 5); // Show 5 random words
        
        let studyText = 'Study Mode - Practice these words:\n\n';
        studyWords.forEach((word, index) => {
            studyText += `${index + 1}. ${word.word} - ${word.meaning}\n`;
        });
        
        alert(studyText);
        this.showToast('Study mode activated!', 'info');
    }

    // Load favorites from localStorage
    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('vocabularyFavorites') || '[]');
        } catch {
            return [];
        }
    }

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('vocabularyFavorites', JSON.stringify(this.favorites));
    }

    // Load stats from localStorage
    loadStats() {
        try {
            return JSON.parse(localStorage.getItem('vocabularyStats') || '{"wordsLearned": 0, "streak": 0, "lastVisit": null}');
        } catch {
            return { wordsLearned: 0, streak: 0, lastVisit: null };
        }
    }

    // Save stats to localStorage
    saveStats() {
        localStorage.setItem('vocabularyStats', JSON.stringify(this.stats));
    }

    // Update statistics display
    updateStats() {
        document.getElementById('wordsLearned').textContent = this.stats.wordsLearned;
        document.getElementById('currentStreak').textContent = this.stats.streak;
        document.getElementById('favoriteCount').textContent = this.favorites.length;
        
        // Update streak based on daily visits
        this.updateStreak();
    }

    // Update daily streak
    updateStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.stats.lastVisit;
        
        if (lastVisit !== today) {
            if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
                // Consecutive day
                this.stats.streak += 1;
            } else if (lastVisit !== null) {
                // Streak broken
                this.stats.streak = 1;
            } else {
                // First visit
                this.stats.streak = 1;
            }
            
            this.stats.wordsLearned += 1;
            this.stats.lastVisit = today;
            this.saveStats();
        }
    }

    // Show/hide loading overlay
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Animate word card when new word loads
    animateWordCard() {
        const wordCard = document.getElementById('wordCard');
        wordCard.style.transform = 'scale(0.95)';
        wordCard.style.opacity = '0.7';
        
        setTimeout(() => {
            wordCard.style.transform = 'scale(1)';
            wordCard.style.opacity = '1';
        }, 150);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vocabularyApp = new VocabularyApp();
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}