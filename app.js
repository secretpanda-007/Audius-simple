let apiHost = null;

// Function to get a list of API hosts
async function getApiHosts() {
    try {
        const response = await fetch('https://api.audius.co');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching API hosts:', error);
        return [];
    }
}

// Function to select a host
async function selectHost() {
    const hosts = await getApiHosts();
    if (hosts.length > 0) {
        apiHost = hosts[0]; // Select the first host
        console.log('Selected API host:', apiHost);
    } else {
        console.error('No API hosts available');
    }
}

// Function to fetch trending tracks
async function fetchTrendingTracks() {
    if (!apiHost) {
        await selectHost();
    }
    try {
        const response = await fetch(`${apiHost}/v1/tracks/trending?time=month&app_name=YourAppName`);
        const data = await response.json();
        return data.data; // Response structure: { "data": [ ... ] }
    } catch (error) {
        console.error('Error fetching trending tracks:', error);
        return [];
    }
}

// Function to fetch search results
async function fetchSearchResults(query) {
    if (!apiHost) {
        await selectHost();
    }
    try {
        const response = await fetch(`${apiHost}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=YourAppName`);
        const data = await response.json();
        return data.tracks; // Response structure: { "tracks": [ ... ] }
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

// Function to create a track element with playback
function createTrackElement(track) {
    const div = document.createElement('div');
    div.innerHTML = `
        <p>${track.title} by ${track.user.name}</p>
        <audio controls>
            <source src="${apiHost}/v1/tracks/${track.id}/stream?app_name=YourAppName" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
    `;
    return div;
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
    selectHost().then(() => {
        displayTrendingTracks();
    });

    document.getElementById('search-button').addEventListener('click', displaySearchResults);
});
