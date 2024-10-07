const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');

const defaulPlaylist = [
    '/audio/memoria.mp3',
    'audio/song2.mp3',
    'audio/song3.mp3'
];

const medievalPlaylist = [
    '/audio/memoria.mp3',
    'audio/song2.mp3',
    'audio/song3.mp3'
];

const halloweenPlaylist = [
    '/audio/memoria.mp3',
    'audio/song2.mp3',
    'audio/song3.mp3'
];

let currentTrack = 0;

document.getElementById('button1').addEventListener('click', function() {
    playDefaultPalylist(0);
});

document.getElementById('button2').addEventListener('click', function() {
    playMedievalPalylist(0);
});

document.getElementById('button3').addEventListener('click', function() {
    playHalloweenPalylist(0);
});

function playDefaultPalylist(trackIndex) {
    currentTrack = trackIndex;
    audioSource.src = defaulPlaylist[trackIndex];
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}

function playMedievalPalylist(trackIndex) {
    currentTrack = trackIndex;
    audioSource.src = medievalPlaylist[trackIndex];
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}

function playHalloweenPalylist(trackIndex) {
    currentTrack = trackIndex;
    audioSource.src = halloweenPlaylist[trackIndex];
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}


// Автоматическое воспроизведение следующего трека по завершению
audioPlayer.addEventListener('ended', function() {
    currentTrack = (currentTrack + 1) % playlist.length;  // Цикл по плейлисту
    playAudio(currentTrack);
});

