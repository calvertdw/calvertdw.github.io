"use strict";

class YouTubeEnhancer {
    constructor() {
        this.onYouTubeIframeAPIReadyCallbacks = [];
        this.apiLoaded = false;
        this.players = new Map();
    }

    // Main function to enhance all YouTube iframes on the page
    enhanceAllYouTubeVideos() {
        if (window.hideYTActivated) return;

        // Find all YouTube iframes
        const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com/embed"], iframe[src*="youtu.be"]');

        youtubeIframes.forEach(iframe => {
            this.enhanceYouTubeVideo(iframe);
        });

        this.loadYouTubeAPI();
        window.hideYTActivated = true;
    }

    // Enhance a single YouTube iframe
    enhanceYouTubeVideo(iframe) {
        // Create wrapper structure
        const outerWrap = document.createElement('div');
        outerWrap.className = 'hytPlayerWrapOuter';

        const playerWrap = document.createElement('div');
        playerWrap.className = 'hytPlayerWrap';

        // Insert wrapper before iframe
        iframe.parentNode.insertBefore(outerWrap, iframe);
        outerWrap.appendChild(playerWrap);
        playerWrap.appendChild(iframe);

        // Modify iframe src to include necessary parameters
        this.modifyIframeSrc(iframe);

        // Set up player events
        this.setupPlayerEvents(playerWrap, iframe);
    }

    modifyIframeSrc(iframe) {
        let src = iframe.src;

        // Add necessary YouTube parameters if not already present
        const params = {
            'fs': '0',
            'loop': '1', 
            'modestbranding': '1',
            'rel': '0',
            'enablejsapi': '1'
        };

        Object.keys(params).forEach(param => {
            if (!src.includes(param + '=')) {
                const separator = src.includes('?') ? '&' : '?';
                src += separator + param + '=' + params[param];
            }
        });

        iframe.src = src;
        iframe.setAttribute('frameborder', '0');
    }

    setupPlayerEvents(playerWrap, playerFrame) {
        const onPlayerStateChange = (event) => {
            if (event.data == YT.PlayerState.ENDED) {
                playerWrap.classList.add("ended");
            } else if (event.data == YT.PlayerState.PAUSED) {
                playerWrap.classList.add("paused");
            } else if (event.data == YT.PlayerState.PLAYING) {
                playerWrap.classList.remove("ended");
                playerWrap.classList.remove("paused");
            }
        };

        let player;
        this.onYouTubeIframeAPIReadyCallbacks.push(() => {
            player = new YT.Player(playerFrame, {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
            this.players.set(playerWrap, player);
        });

        playerWrap.addEventListener("click", () => {
            if (player) {
                const playerState = player.getPlayerState();
                if (playerState == YT.PlayerState.ENDED) {
                    player.seekTo(0);
                } else if (playerState == YT.PlayerState.PAUSED) {
                    player.playVideo();
                }
            }
        });
    }

    loadYouTubeAPI() {
        if (!this.apiLoaded) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            this.apiLoaded = true;
        }
    }

    onAPIReady() {
        this.onYouTubeIframeAPIReadyCallbacks.forEach(callback => callback());
    }
}

// Create global instance
const youtubeEnhancer = new YouTubeEnhancer();

// Set up global YouTube API callback
window.onYouTubeIframeAPIReady = function() {
    youtubeEnhancer.onAPIReady();
};

// Auto-enhance all YouTube videos when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    youtubeEnhancer.enhanceAllYouTubeVideos();
});

// Utility function to enhance YouTube videos added dynamically
window.enhanceYouTubeVideos = function() {
    youtubeEnhancer.enhanceAllYouTubeVideos();
};
