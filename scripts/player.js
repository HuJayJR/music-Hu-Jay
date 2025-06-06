class AudioController {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = 0;
        this.setupElements();
        this.setupEvents();
    }

    setupElements() {
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressBar = document.querySelector('.progress');
        this.currentTimeSpan = document.querySelector('.current-time');
        this.totalTimeSpan = document.querySelector('.total-time');
    }

    setupEvents() {
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTimeSpan.textContent = this.formatTime(this.audio.duration);
        });
        this.audio.addEventListener('ended', () => this.next());

        this.playBtn?.addEventListener('click', () => this.togglePlay());
        this.prevBtn?.addEventListener('click', () => this.previous());
        this.nextBtn?.addEventListener('click', () => this.next());
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
            this.isPlaying = true;
        } else {
            this.audio.pause();
            this.isPlaying = false;
        }
        this.updatePlayButton();
    }

    updatePlayButton() {
        const icon = this.playBtn.querySelector('i');
        icon.classList.replace(
            this.isPlaying ? 'fa-play' : 'fa-pause',
            this.isPlaying ? 'fa-pause' : 'fa-play'
        );
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    async playSong(url) {
        try {
            this.audio.src = url;
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayButton();
        } catch (err) {
            console.error('Failed to play song:', err);
        }
    }

    previous() {
    }

    next() {
    }
}

window.AudioController = AudioController;

class MusicPlayerUI {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
    }

    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', 
                this.debounce(() => this.handleSearch(), 500)
            );
        }
    }

    async handleSearch() {
        try {
            const query = this.searchInput.value.trim();
            if (query.length < 2) {
                this.searchResults.innerHTML = '';
                return;
            }

            const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const songs = await response.json();
            this.displaySearchResults(songs);

        } catch (error) {
            console.error('Search failed:', error);
            this.searchResults.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to connect to server. Please try again later.</p>
                </div>`;
        }
    }

    displaySearchResults(songs) {
        if (!songs.length) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No songs found</p>
                </div>`;
            return;
        }

        this.searchResults.innerHTML = songs.map(song => `
            <div class="search-result-item" data-song-id="${song.id}">
                <img src="${song.coverImage}" alt="${song.title}">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            </div>
        `).join('');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayerUI();
});