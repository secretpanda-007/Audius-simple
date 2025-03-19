// Hardcoded API host
const apiHost = 'https://discoveryprovider2.audius.co';

// Queue array and current index
let queue = [];
let currentQueueIndex = 0;

// Function to fetch trending tracks
async function fetchTrendingTracks() {
    try {
        const response = await fetch(`${apiHost}/v1/tracks/trending?time=month&app_name=SimpleAudiusApp`);
        const data = await response.json();
        return data.data.slice(0, 15); // Limit to 15 tracks
    } catch (error) {
        console.error('Error fetching trending tracks:', error);
        return [];
    }
}

// Function to fetch search results
async function fetchSearchResults(query) {
    try {
        const response = await fetch(`${apiHost}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=SimpleAudiusApp`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

// Function to create a track element with playback and add to queue
function createTrackElement(track) {
    const div = document.createElement('div');
    div.className = 'track';
    div.innerHTML = `
        <div class="track-info">
            <img src="${track.artwork['150x150']}" alt="Artwork">
            <div>
                <p>${track.title}</p>
                <p>by ${track.user.name}</p>
            </div>
        </div>
        <audio controls>
            <source src="${apiHost}/v1/tracks/${track.id}/stream?app_name=SimpleAudiusApp" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <button class="add-to-queue">Add to Queue</button>
    `;

    // Add event listener to "Add to Queue" button
    const addButton = div.querySelector('.add-to-queue');
    addButton.addEventListener('click', () => {
        addToQueue(track);
    });

    return div;
}

// Function to add track to queue
function addToQueue(track) {
    queue.push(track);
    updateQueueDisplay();
}

// Function to remove track from queue
function removeFromQueue(index) {
    const idx = parseInt(index, 10);
    queue.splice(idx, 1);
    updateQueueDisplay();
}

// Function to update queue display
function updateQueueDisplay() {
    const queueListDiv = document.getElementById('queue-list');
    queueListDiv.innerHTML = '';
    queue.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'queue-track';
        trackElement.innerHTML = `
            <p>${track.title} by ${track.user.name}</p>
            <button data-index="${index}">Remove</button>
        `;
        queueListDiv.appendChild(trackElement);
    });
}

// Function to play the queue
function playQueue() {
    if (queue.length === 0) return;
    currentQueueIndex = 0;
    const queuePlayer = document.getElementById('queue-player');
    queuePlayer.src = `${apiHost}/v1/tracks/${queue[currentQueueIndex].id}/stream?app_name=SimpleAudiusApp`;
    queuePlayer.play();
    queuePlayer.onended = playNext;
}

// Function to play the next track in the queue
function playNext() {
    currentQueueIndex++;
    if (currentQueueIndex < queue.length) {
        const queuePlayer = document.getElementById('queue-player');
        queuePlayer.src = `${apiHost}/v1/tracks/${queue[currentQueueIndex].id}/stream?app_name=SimpleAudiusApp`;
        queuePlayer.play();
    } else {
        // Queue finished
        queuePlayer.onended = null;
    }
}

// Function to display trending tracks
async function displayTrendingTracks() {
    const tracks = await fetchTrendingTracks();
    const trendingSongsDiv = document.getElementById('trending-songs');
    trendingSongsDiv.innerHTML = '';
    tracks.forEach(track => {
        const trackElement = createTrackElement(track);
        trendingSongsDiv.appendChild(trackElement);
    });
}

// Function to display search results
async function displaySearchResults() {
    const query = document.getElementById('search-input').value;
    const tracks = await fetchSearchResults(query);
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';
    tracks.forEach(track => {
        const trackElement = createTrackElement(track);
        searchResultsDiv.appendChild(trackElement);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    displayTrendingTracks();
    document.getElementById('search-button').addEventListener('click', displaySearchResults);
    document.getElementById('play-queue').addEventListener('click', playQueue);

    // Event listener for remove buttons in queue
    document.getElementById('queue-list').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.getAttribute('data-index');
            removeFromQueue(index);
        }
    });
});
