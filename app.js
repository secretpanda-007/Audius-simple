// Hardcoded API host
const apiHost = 'https://discoveryprovider2.audius.co';

// Function to fetch trending tracks
async function fetchTrendingTracks() {
    try {
        const response = await fetch(`${apiHost}/v1/tracks/trending?time=month&app_name=SimpleAudiusApp`);
        const data = await response.json();
        return data.data; // Response structure: { "data": [ ... ] }
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
        return data.data; // Response structure: { "data": [ ... ] }
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

// Function to create a track element with playback and artwork
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
    `;
    return div;
}

// Function to display trending tracks (limited to 15)
async function displayTrendingTracks() {
    const tracks = await fetchTrendingTracks();
    const trendingSongsDiv = document.getElementById('trending-songs');
    trendingSongsDiv.innerHTML = '';
    tracks.slice(0, 15).forEach(track => {
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
});
