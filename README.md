# Audius Simple App

This is a simple web app that uses the Audius API to display trending songs, search for tracks, and create playlists to queue music.

## Usage

1. Replace `YOUR_API_KEY` and `YOUR_API_SECRET` in `script.js` with your actual Audius API key and secret.
   - You can obtain these from your [Audius Settings page](https://audius.co/settings).
2. Open `index.html` in a web browser to use the app.

## Note on Security

This app includes the API secret in the frontend, which is not secure for production use. For a production app, you should handle write operations (like creating playlists) on a backend server to keep the API secret safe.

## Deployment

- This repository can be deployed directly to Vercel. Simply connect your GitHub repository to Vercel, and it will automatically serve `index.html` as the main page.
