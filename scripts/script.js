class MusicPlayer {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.initializeEventListeners();
        });
        this.currentPlaylist = [];
    }

    initializeElements() {
        this.searchInput = document.querySelector('#search-input');
        this.searchResults = document.querySelector('#search-results');
        this.playlist = document.querySelector('#playlist');
        this.shareButton = document.querySelector('#share-btn');
        
        if (!this.searchInput) console.warn('Search input not found');
        if (!this.searchResults) console.warn('Search results container not found');
        if (!this.playlist) console.warn('Playlist container not found');
        if (!this.shareButton) console.warn('Share button not found');
    }

    initializeEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', 
                this.debounce(this.handleSearch.bind(this), 500)
            );
        }
        if (this.shareButton) {
            this.shareButton.addEventListener('click', this.handleShare.bind(this));
        }
    }
    
    debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    handleSearch(event) {
        const query = event.target.value;
        console.log(`Searching for: ${query}`);
    }

    handleShare() {
        console.log('Share button clicked');
    }
}

const player = new MusicPlayer();

document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
});