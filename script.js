const defaultTracks = [
    {
        name: "Aankhon Se Tune",
        artist: "Kumar Sanu, Alka Yagnik",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/1.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/1.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Bade Achhe Lagte",
        artist: "Amit Kumar",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/2.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/2.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Ek Pyar Ka Naghma",
        artist: "Sachin Gupta",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/3.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/3.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Ek Ladki Bheegi Bhagi Si",
        artist: "Kishore Kumar",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/4.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/4.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Gali Me Aaj Chand Nikla",
        artist: "Alka Yagnik",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/5.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/5.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Mere Mehboob Qayamat Hogi",
        artist: "Sachin Gupta",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/6.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/6.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "O Mere Dil Ke Chain",
        artist: "Kishore Kumar",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/7.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/7.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Yeh Raaten Yeh Mausam",
        artist: "Sachin Gupta",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/8.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/8.mp3",
        url: "https://t.me/ll_KEX_ll",
    },
    {
        name: "Yeh Sham Mastani",
        artist: "Kishore Kumar",
        cover: "https://raw.githubusercontent.com/KEX001/Mini-player/master/img/9.jpg",
        source: "https://raw.githubusercontent.com/KEX001/Mini-player/master/mp3/9.mp3",
        url: "https://t.me/ll_KEX_ll",
    }
];

let currentTrack = 0;
let isPlaying = false;
let isLooping = false;

const audio = new Audio();
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

function loadTrack(track) {
    document.getElementById('cover-image').src = track.cover;
    document.getElementById('track-name').textContent = track.name;
    document.getElementById('track-artist').textContent = track.artist;
    audio.src = track.source;
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % defaultTracks.length;
    loadTrack(defaultTracks[currentTrack]);
    if (isPlaying) audio.play();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + defaultTracks.length) % defaultTracks.length;
    loadTrack(defaultTracks[currentTrack]);
    if (isPlaying) audio.play();
}

function toggleLoop() {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn.classList.toggle('active');
}

function updateProgressBar() {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
    }
}

function setProgress() {
    const time = (progressBar.value / 100) * audio.duration;
    audio.currentTime = time;
}

function setVolume() {
    audio.volume = volumeBar.value / 100;
}

async function handleSearch() {
    const term = searchInput.value;
    if (term.trim() === "") return;

    try {
        const tracks = await searchSpotifyTracks(term);
        if (tracks.length > 0) {
            defaultTracks.length = 0; // Clear the array
            defaultTracks.push(...tracks);
            currentTrack = 0;
            loadTrack(defaultTracks[currentTrack]);
            audio.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    } catch (error) {
        console.error('Spotify search error:', error);
    }
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
loopBtn.addEventListener('click', toggleLoop);
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', () => {
    if (!isLooping) nextTrack();
});
progressBar.addEventListener('input', setProgress);
volumeBar.addEventListener('input', setVolume);
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
});

// Initial load
loadTrack(defaultTracks[currentTrack]);

