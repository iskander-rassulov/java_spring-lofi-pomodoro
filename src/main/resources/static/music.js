const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');

document.getElementById('button1').addEventListener('click', function() {
    playAudio('/audio/memoria.mp3');  // Указываем путь к аудиофайлу
});

document.getElementById('button2').addEventListener('click', function() {
    playAudio('audio/song2.mp3');  // Добавь здесь свои треки
});

document.getElementById('button3').addEventListener('click', function() {
    playAudio('audio/song3.mp3');  // Добавь здесь свои треки
});

function playAudio(track) {
    audioSource.src = track;
    audioPlayer.load();
    audioPlayer.style.display = 'block';  // Показываем аудиоплеер при воспроизведении
    audioPlayer.play();
}
