document.addEventListener('DOMContentLoaded', () => {
    const trendingSongsDiv = document.getElementById('trending-songs');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsDiv = document.getElementById('search-results');

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
            return data.data;
        } catch (error) {
            console.error('Error fetching trending tracks:', error);
            return [];
        }
    }

    // Function to display trending tracks
    async function displayTrendingTracks() {
        const tracks = await fetchTrendingTracks();
        trendingSongsDiv.innerHTML = '';
        tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.textContent = `${track.title} by ${track.user.name}`;
            trendingSongsDiv.appendChild(trackElement);
        });
    }

    // Function to fetch search results
    async function fetchSearchResults(query) {
        if (!apiHost) {
            await selectHost();
        }
        try {
            const response = await fetch(`${apiHost}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=YourAppName`);
            const data = await response.json();
            return data.tracks;
        } catch (error) {
            console.error('Error fetching search results:', error);
            return [];
        }
    }

    // Function to display search results
    async function displaySearchResults() {
        const query = searchInput.value;
        const tracks = await fetchSearchResults(query);
        searchResultsDiv.innerHTML = '';
        tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.textContent = `${track.title} by ${track.user.name}`;
            searchResultsDiv.appendChild(trackElement);
        });
    }

    // Initialize
    selectHost().then(() => {
        displayTrendingTracks();
    });

    // Search button click
    searchButton.addEventListener('click', displaySearchResults);
});
