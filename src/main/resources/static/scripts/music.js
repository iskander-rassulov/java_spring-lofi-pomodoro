const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');

const defaultPlaylist = [
    '/audio/memoria.mp3',
    '/audio/song2.mp3',
    '/audio/song3.mp3'
];

const medievalPlaylist = [
    '/audio/memoria.mp3',
    '/audio/song2.mp3',
    '/audio/song3.mp3'
];

const halloweenPlaylist = [
    '/audio/memoria.mp3',
    '/audio/song2.mp3',
    '/audio/song3.mp3'
];

let currentTrack = 0;

document.getElementById('buttonDefault').addEventListener('click', function() {
    playDefaultPlaylist(0); // Запуск Default плейлиста
    document.body.style.backgroundImage = "url('images/defaultwallp.jpg')"; // Изменение фона
});

document.getElementById('buttonHalloween').addEventListener('click', function() {
    playHalloweenPlaylist(0); // Запуск Halloween плейлиста
    document.body.style.backgroundImage = "url('images/halloweenwallp.jpg')"; // Изменение фона
});

document.getElementById('buttonMedieval').addEventListener('click', function() {
    playMedievalPlaylist(0); // Запуск Medieval плейлиста
    document.body.style.backgroundImage = "url('images/medievalwallp.jpg')"; // Изменение фона
});


function playDefaultPlaylist(trackIndex) {
    currentTrack = trackIndex;
    audioSource.src = defaultPlaylist[trackIndex];
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}

function playMedievalPlaylist(trackIndex) {
    currentTrack = trackIndex;
    audioSource.src = medievalPlaylist[trackIndex];
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}

function playHalloweenPlaylist(trackIndex) {
    currentTrack = trackIndex;
    audioSource.src = halloweenPlaylist[trackIndex];
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}

// Автоматическое воспроизведение следующего трека по завершению
audioPlayer.addEventListener('ended', function() {
    currentTrack = (currentTrack + 1) % defaultPlaylist.length;  // Цикл по плейлисту
    playAudio(currentTrack);
});
