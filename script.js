// Initialize the Audius SDK
const audiusSdk = new AudiusSdk({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET', // Required for write operations like creating playlists
});

let selectedTrackIds = [];

// Fetch trending tracks on page load
window.onload = fetchTrendingTracks;

// Function to fetch and display trending tracks
async function fetchTrendingTracks() {
  try {
    const trendingTracks = await audiusSdk.tracks.getTrending();
    const feedDiv = document.getElementById('trending-feed');
    feedDiv.innerHTML = '';
    trendingTracks.forEach(track => {
      const trackElement = document.createElement('div');
      trackElement.textContent = `${track.title} by ${track.user.name}`;
      feedDiv.appendChild(trackElement);
    });
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
  }
}

// Function to search for tracks
async function searchTracks(query) {
  try {
    const results = await audiusSdk.search.search({ query });
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';
    results.tracks.forEach(track => {
      const trackElement = document.createElement('div');
      trackElement.innerHTML = `
        <input type="checkbox" onchange="toggleTrackSelection('${track.trackId}')">
        ${track.title} by ${track.user.name}
      `;
      searchResultsDiv.appendChild(trackElement);
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
  }
}

// Function to toggle track selection for playlist creation
function toggleTrackSelection(trackId) {
  const index = selectedTrackIds.indexOf(trackId);
  if (index > -1) {
    selectedTrackIds.splice(index, 1);
  } else {
    selectedTrackIds.push(trackId);
  }
}

// Function to create a playlist with selected tracks
async function createPlaylist(playlistName, trackIds) {
  try {
    if (!playlistName || trackIds.length === 0) {
      alert('Please enter a playlist name and select tracks.');
      return;
    }
    const playlist = await audiusSdk.playlists.createPlaylist({
      metadata: {
        playlistName: playlistName,
      },
      trackIds: trackIds,
    });
    console.log('Playlist created:', playlist);
    alert('Playlist created successfully!');
  } catch (error) {
    console.error('Error creating playlist:', error);
    alert('Failed to create playlist.');
  }
}
