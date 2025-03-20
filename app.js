const apiHost = 'https://discoveryprovider2.audius.co';
const audioElement = document.getElementById('player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentTrackInfo = document.getElementById('current-track-info');
const queueToggle = document.getElementById('queue-toggle');
const queuePanel = document.getElementById('queue-panel');
const clearQueueBtn = document.getElementById('clear-queue');
const queueList = document.getElementById('queue-list');

let queue = [];
let currentIndex = -1;

async function fetchTrendingTracks() {
    try {
        const response = await fetch(`${apiHost}/v1/tracks/trending?time=month&app_name=SimpleAudiusApp`);
        const data = await response.json();
        return data.data.slice(0, 15);
    } catch (error) {
        console.error('Error fetching trending tracks:', error);
        return [];
    }
}

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

function createTrackElement(track) {
    const div = document.createElement('div');
    div.className = 'track';
    div.innerHTML = `
        <img src="${track.artwork['150x150']}" alt="Artwork">
        <div class="track-info">
            <p>${track.title}</p>
            <p>by ${track.user.name}</p>
        </div>
        <button class="play-btn">Play</button>
        <button class="add-to-queue">Add to Queue</button>
    `;

    div.querySelector('.play-btn').addEventListener('click', () => {
        queue = [track];
        currentIndex = 0;
        playTrack(currentIndex);
    });

    div.querySelector('.add-to-queue').addEventListener('click', () => {
        addToQueue(track);
    });

    return div;
}

function addToQueue(track) {
    queue.push(track);
    updateQueueUI();
}

function removeFromQueue(index) {
    const idx = parseInt(index, 10);
    if (idx === currentIndex) {
        audioElement.pause();
        currentIndex = -1;
        updatePlayBar();
    } else if (idx < currentIndex) {
        currentIndex--;
    }
    queue.splice(idx, 1);
    updateQueueUI();
}

function playTrack(index) {
    if (index < 0 || index >= queue.length) return;
    currentIndex = index;
    const track = queue[currentIndex];
    audioElement.src = `${apiHost}/v1/tracks/${track.id}/stream?app_name=SimpleAudiusApp`;
    audioElement.play();
    updatePlayBar();
}

function playNext() {
    if (currentIndex < queue.length - 1) {
        playTrack(currentIndex + 1);
    }
}

function playPrevious() {
    if (currentIndex > 0) {
        playTrack(currentIndex - 1);
    }
}

function updateQueueUI() {
    queueList.innerHTML = '';
    queue.forEach((track, index) => {
        const div = document.createElement('div');
        div.className = 'queue-item';
        div.innerHTML = `
            <span>${track.title} by ${track.user.name}</span>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) return;
            playTrack(index);
        });
        queueList.appendChild(div);
    });
}

function updatePlayBar() {
    if (currentIndex >= 0 && currentIndex < queue.length) {
        const track = queue[currentIndex];
        currentTrackInfo.textContent = `${track.title} by ${track.user.name}`;
        playPauseBtn.textContent = '⏸';
    } else {
        currentTrackInfo.textContent = 'No track playing';
        playPauseBtn.textContent = '▶';
    }
}

playPauseBtn.addEventListener('click', () => {
    if (audioElement.paused && currentIndex >= 0 && currentIndex < queue.length) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
});

audioElement.addEventListener('play', () => {
    playPauseBtn.textContent = '⏸';
});

audioElement.addEventListener('pause', () => {
    playPauseBtn.textContent = '▶';
});

audioElement.addEventListener('ended', playNext);

prevBtn.addEventListener('click', playPrevious);

nextBtn.addEventListener('click', playNext);

queueToggle.addEventListener('click', () => {
    queuePanel.classList.toggle('show');
});

clearQueueBtn.addEventListener('click', () => {
    queue = [];
    currentIndex = -1;
    audioElement.pause();
    updateQueueUI();
    updatePlayBar();
});

queueList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const index = e.target.getAttribute('data-index');
        removeFromQueue(index);
    }
});

async function displayTrendingTracks() {
    const tracks = await fetchTrendingTracks();
    const trendingSongsDiv = document.getElementById('trending-songs');
    trendingSongsDiv.innerHTML = '';
    tracks.forEach(track => {
        const trackElement = createTrackElement(track);
        trendingSongsDiv.appendChild(trackElement);
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    displayTrendingTracks();
    document.getElementById('search-button').addEventListener('click', displaySearchResults);
});
