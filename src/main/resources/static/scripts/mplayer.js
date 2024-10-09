// Получение элементов в новом music-container
const image = document.getElementById('cover');
const title = document.getElementById('music-title');
const artist = document.getElementById('music-artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const playerProgress = document.getElementById('player-progress');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');
const background = document.getElementById('bg-img');

// Используем объект Audio
const music = new Audio();

let musicIndex = 0;
let isPlaying = false;
let currentPlaylist = [];

// Функция для воспроизведения музыки
function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play().catch(error => {
        console.error("Ошибка при воспроизведении музыки:", error);
    });
}

window.playMusic = playMusic;

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    if (music && song.path) {
        music.src = song.path;
    } else {
        console.error('Аудиофайл не найден.');
    }
    if (title) title.textContent = song.displayName || 'Unknown Title';
    if (artist) artist.textContent = song.artist || 'Unknown Artist';
    if (image) image.src = song.cover || '';
    if (background) background.src = song.cover || '';
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + currentPlaylist.length) % currentPlaylist.length;
    loadMusic(currentPlaylist[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    if (progress) progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    if (durationEl) durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    if (currentTimeEl) currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Обработчики для кнопок
if (playBtn) playBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', () => changeMusic(-1));
if (nextBtn) nextBtn.addEventListener('click', () => changeMusic(1));
if (music) music.addEventListener('ended', () => changeMusic(1));
if (music) music.addEventListener('timeupdate', updateProgressBar);
if (playerProgress) playerProgress.addEventListener('click', setProgressBar);

// Плейлисты для кнопок
const defaultPlaylist = [
    {
        path: 'audio/default_music/memoria.mp3',
        displayName: 'Memoria',
        cover: 'images/defaultwallp.jpg',
        artist: 'nezn ayu',
    },
    {
        path: 'audio/default_music/song2.mp3',
        displayName: 'Another Lofi Track',
        cover: 'images/defaultwallp.jpg',
        artist: 'Artist 2',
    }
];

const halloweenPlaylist = [
    {
        path: 'audio/halloween_music/31_october.mp3',
        displayName: 'Spooky Lofi',
        cover: 'images/halloweenwallp.jpg',
        artist: 'Spooky Artist',
    },
    {
        path: 'audio/halloween_music/scary.mp3',
        displayName: 'Scary Track',
        cover: 'images/halloweenwallp.jpg',
        artist: 'Scary Artist',
    }
];

const medievalPlaylist = [
    {
        path: 'audio/medieval_music/rising_queen.mp3',
        displayName: 'Medieval Vibes',
        cover: 'images/medievalwallp.jpg',
        artist: 'Medieval Artist',
    },
    {
        path: 'audio/medieval_music/castle.mp3',
        displayName: 'Castle Lofi',
        cover: 'images/medievalwallp.jpg',
        artist: 'Castle Artist',
    }
];

// Функция для смены плейлиста
function changePlaylist(playlist) {
    console.log('Смена плейлиста...');
    pauseMusic();
    currentPlaylist = playlist; // Обновляем текущий плейлист
    musicIndex = 0; // Сбрасываем индекс на начало
    loadMusic(currentPlaylist[musicIndex]); // Загружаем первую песню
    playMusic(); // Начинаем воспроизведение автоматически
}

//VOLUME

const volumeControl = document.getElementById('volume-control');
const volumeProgress = document.querySelector('.volume-progress');

// Устанавливаем начальное значение прогресса
volumeProgress.style.width = `${volumeControl.value * 100}%`;

// Обновляем прогресс при изменении громкости
volumeControl.addEventListener('input', function () {
    const volume = volumeControl.value;
    music.volume = volume;  // Устанавливаем громкость
    volumeProgress.style.width = `${volume * 100}%`;  // Обновляем ширину прогресса
});



//VOLUME END


// Обработчики для кнопок смены плейлистов
document.getElementById('buttonDefault')?.addEventListener('click', () => {
    console.log('Кнопка Default нажата.');
    changePlaylist(defaultPlaylist);
});

document.getElementById('buttonHalloween')?.addEventListener('click', () => {
    console.log('Кнопка Halloween нажата.');
    changePlaylist(halloweenPlaylist);
});

document.getElementById('buttonMedieval')?.addEventListener('click', () => {
    console.log('Кнопка Medieval нажата.');
    changePlaylist(medievalPlaylist);
});

document.getElementById('buttonDefault').addEventListener('click', function() {
    pauseMusic();
    const backgroundVideo = document.getElementById('backgroundVideo');
    const source = backgroundVideo.querySelector('source');
    source.setAttribute('src', 'videos/defaultvid.mp4'); // Меняем источник видео
    backgroundVideo.load(); // Перезагружаем видео
    backgroundVideo.play(); // Проигрываем новое видео
});


document.getElementById('buttonHalloween').addEventListener('click', function() {
    pauseMusic();
    const backgroundVideo = document.getElementById('backgroundVideo');
    const source = backgroundVideo.querySelector('source');
    source.setAttribute('src', 'videos/halloweenvid.mp4'); // Меняем источник видео
    backgroundVideo.load(); // Перезагружаем видео
    backgroundVideo.play(); // Проигрываем новое видео
});

document.getElementById('buttonMedieval').addEventListener('click', function() {
    pauseMusic();
    const backgroundVideo = document.getElementById('backgroundVideo');
    const source = backgroundVideo.querySelector('source');
    source.setAttribute('src', 'videos/medievalvid.mp4'); // Меняем источник видео
    backgroundVideo.load(); // Перезагружаем видео
    backgroundVideo.play(); // Проигрываем новое видео
});

loadMusic(defaultPlaylist[0]);
