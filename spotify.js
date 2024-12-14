let accessToken = null;

async function getAccessToken() {
    if (accessToken) return accessToken;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
}

async function searchSpotifyTracks(query) {
    const token = await getAccessToken();
    
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();
    return data.tracks.items.map(track => ({
        name: track.name,
        artist: track.artists[0].name,
        cover: track.album.images[0]?.url,
        source: track.preview_url,
        url: track.external_urls.spotify,
    }));
}
