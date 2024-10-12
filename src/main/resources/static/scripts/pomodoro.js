/** Класс CountdownTimer для обратного отсчета */
function CountdownTimer(seconds, tickRate) {
    this.seconds = seconds || (25 * 60); // Значение по умолчанию: 25 минут
    this.tickRate = tickRate || 500; // Интервал тиков в миллисекундах
    this.tickFunctions = []; // Массив функций, вызываемых при каждом тике
    this.isRunning = false; // Флаг, запущен ли таймер
    this.remaining = this.seconds; // Оставшееся время в секундах
    this.timerId = null; // ID таймера для setTimeout
}


/// Включаем сброс на текущий режим после завершения
CountdownTimer.prototype.start = function() {
    if (this.isRunning) return;

    this.isRunning = true;
    hideTimeAdjustmentButtons();
    const startTime = Date.now();
    let thisTimer = this;

    const tick = function() {
        let secondsSinceStart = ((Date.now() - startTime) / 1000) | 0;
        let secondsRemaining = thisTimer.remaining - secondsSinceStart;

        if (!thisTimer.isRunning) {
            thisTimer.remaining = secondsRemaining;
        } else {
            if (secondsRemaining > 0) {
                thisTimer.timerId = setTimeout(tick, thisTimer.tickRate);
            } else {
                thisTimer.end();  // Вызов метода завершения
            }
        }

        let timeRemaining = parseSeconds(secondsRemaining);
        thisTimer.tickFunctions.forEach(function(tickFunction) {
            tickFunction.call(thisTimer, timeRemaining.minutes, timeRemaining.seconds);
        });
    };

    tick();
};

// Метод для паузы таймера
CountdownTimer.prototype.pause = function() {
    this.isRunning = false; // Останавливаем таймер
    clearTimeout(this.timerId); // Очищаем setTimeout
    showTimeAdjustmentButtons(); // Показываем кнопки увеличения/уменьшения времени
};

// Метод для добавления функций при тиках
CountdownTimer.prototype.onTick = function(tickFunction) {
    if (typeof tickFunction === 'function') {
        this.tickFunctions.push(tickFunction); // Добавляем функцию в массив
    }
};

// Метод для изменения оставшегося времени
CountdownTimer.prototype.addTime = function(seconds) {
    this.remaining += seconds;
    if (this.remaining < 0) this.remaining = 0; // Не допускаем отрицательного времени
};

// Вспомогательная функция для преобразования секунд в минуты и секунды
function parseSeconds(seconds) {
    seconds = Math.max(0, seconds); // Нормализация отрицательных значений
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
}

// Функция для воспроизведения уведомления в зависимости от плейлиста
function playCustomAlarm() {
    const backgroundVideo = document.getElementById('backgroundVideo').querySelector('source').getAttribute('src');
    let alarmAudio;

    if (backgroundVideo.includes('defaultvid')) {
        alarmAudio = new Audio('audio/defaultAlarm.mp3');
    } else if (backgroundVideo.includes('halloweenvid')) {
        alarmAudio = new Audio('audio/halloweenAlarm.mp3');
    } else if (backgroundVideo.includes('medievalvid')) {
        alarmAudio = new Audio('audio/medievalAlarm.mp3');
    }

    if (alarmAudio) {
        alarmAudio.volume = 1;  // Максимальная громкость для уведомления
        alarmAudio.play();
    }
}

// Функция изменения фавикона
// Функция для смены иконки сайта
function changeFavicon(status) {
    const favicon = document.getElementById('dynamic-favicon') || document.createElement('link');
    favicon.id = 'dynamic-favicon';
    favicon.rel = 'icon';
    favicon.href = status === 'active' ? 'images/active.jpg' : 'images/inactive.png';

    document.head.appendChild(favicon);
}

// Функции для скрытия/показа кнопок увеличения и уменьшения времени
function hideTimeAdjustmentButtons() {
    document.getElementById('increaseTime').style.display = 'none';
    document.getElementById('decreaseTime').style.display = 'none';
}

function showTimeAdjustmentButtons() {
    document.getElementById('increaseTime').style.display = 'inline';
    document.getElementById('decreaseTime').style.display = 'inline';
}

// Основные функции внутри window.onload
window.onload = function() {
    let pomodoroTime = 25 * 60;  // 25 минут
    let shortBreakTime = 5 * 60;  // 5 минут
    let longBreakTime = 15 * 60;  // 15 минут
    let currentModeTime = pomodoroTime;  // Время по умолчанию для Pomodoro
    let currentMode = 'pomodoro'; // Изначально режим Pomodoro

    const MAX_TIME_LIMIT = 995 * 60;  // Максимум 995 минут
    var timerDisplay = document.getElementById('timer');
    var currentTimeDisplay = document.getElementById('currentTimeDisplay');
    var timer = new CountdownTimer(currentModeTime);
    timer.onTick(setTimeOnAllDisplays);
    switchMode(pomodoroTime, 'btn_pomodoro');


    function setTimeOnAllDisplays(minutes, seconds) {
        console.log("Updating display to:", minutes, "minutes and", seconds, "seconds");
        var clockMinutes = minutes < 10 ? '0' + minutes : minutes;
        var clockSeconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.textContent = clockMinutes + ':' + clockSeconds;
        document.title = '(' + minutes + 'm) Pomodoro';
    }


    function updateCurrentTimeDisplay() {
        const minutes = Math.floor(currentModeTime / 60);
        const seconds = currentModeTime % 60;
        currentTimeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    // Общая функция для смены режима (Pomodoro, Short Break, Long Break)
    function switchMode(newModeTime, buttonId) {
        console.log("Switching mode to:", buttonId, "with time:", newModeTime);
        timer.pause(); // Ставим таймер на паузу при смене режима
        currentModeTime = newModeTime; // Обновляем текущее время для нового режима
        timer.remaining = newModeTime; // Обновляем оставшееся время


        // Прямое обновление текста таймера
        const timerElement = document.getElementById('timer');
        const minutes = Math.floor(newModeTime / 60);
        const seconds = newModeTime % 60;
        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        setActiveButton(buttonId); // Устанавливаем активную кнопку
        document.getElementById('btn_start').style.display = 'inline'; // Делаем кнопку "Старт" активной
        document.getElementById('btn_pause').style.display = 'none'; // Скрываем кнопку "Пауза"

        // Обновляем currentMode в зависимости от кнопки
        if (buttonId === 'btn_pomodoro') {
            currentMode = 'pomodoro';
            updateCurrentTimeDisplay();
        } else if (buttonId === 'btn_shortbreak') {
            currentMode = 'shortbreak';
            updateCurrentTimeDisplay();
        } else if (buttonId === 'btn_longbreak') {
            currentMode = 'longbreak';
            updateCurrentTimeDisplay();
        }

        console.log("Current Mode Time:", currentModeTime); // Для отладки
        console.log("Current Mode:", currentMode); // Для отладки
    }




    function setActiveButton(buttonId) {
        document.getElementById('btn_pomodoro').classList.remove('active');
        document.getElementById('btn_shortbreak').classList.remove('active');
        document.getElementById('btn_longbreak').classList.remove('active');
        document.getElementById(buttonId).classList.add('active');
    }

    // Увеличение времени
    document.getElementById('increaseTime').addEventListener('click', function () {
        if (timer.isRunning) return; // Не изменяем время, если таймер работает
        if (currentModeTime + 5 * 60 <= MAX_TIME_LIMIT) {
            currentModeTime += 5 * 60;
            timer.addTime(5 * 60); // Добавляем время к таймеру
            updateCurrentTimeDisplay();
            setTimeOnAllDisplays(Math.floor(timer.remaining / 60), timer.remaining % 60);
        }
    });

    // Уменьшение времени
    document.getElementById('decreaseTime').addEventListener('click', function () {
        if (timer.isRunning) return; // Не изменяем время, если таймер работает
        if (currentModeTime > 5 * 60) {
            currentModeTime -= 5 * 60;
            timer.addTime(-5 * 60); // Уменьшаем время на таймере
            updateCurrentTimeDisplay();
            setTimeOnAllDisplays(Math.floor(timer.remaining / 60), timer.remaining % 60);
        }
    });

    document.getElementById('btn_start').addEventListener('click', function() {
        document.getElementById('btn_pause').style.display = 'inline';
        document.getElementById('btn_start').style.display = 'none';
        timer.start();
        changeFavicon('active');  // Меняем иконку сайта на 'active'

        // Воспроизведение музыки при старте таймера
        if (typeof window.playMusic === 'function') {
            window.playMusic();  // Вызов функции воспроизведения музыки
        } else {
            console.error('Функция playMusic не найдена');
        }
    });


    document.getElementById('btn_pause').addEventListener('click', function() {
        document.getElementById('btn_pause').style.display = 'none';
        document.getElementById('btn_start').style.display = 'inline';
        timer.pause();
    });

    document.getElementById('btn_pomodoro').addEventListener('click', function() {
        switchMode(pomodoroTime, 'btn_pomodoro');
    });

    document.getElementById('btn_shortbreak').addEventListener('click', function() {
        switchMode(shortBreakTime, 'btn_shortbreak');
    });

    document.getElementById('btn_longbreak').addEventListener('click', function() {
        switchMode(longBreakTime, 'btn_longbreak');
    });

    CountdownTimer.prototype.end = function() {
        console.log("Timer ended. Switching to next mode.");
        this.isRunning = false;

        // Обновляем оставшееся время до нового значения перед переключением режима
        if (currentMode === 'pomodoro') {
            currentModeTime = 5 * 60; // Время для короткого перерыва
            console.log("Switching to Short Break");
            switchMode(currentModeTime, 'btn_shortbreak');
        } else if (currentMode === 'shortbreak') {
            currentModeTime = 25 * 60; // Время для длинного перерыва
            console.log("Switching to Pomodoro");
            switchMode(currentModeTime, 'btn_pomodoro');
        } else if (currentMode === 'longbreak') {
            currentModeTime = 25 * 60; // Время для Pomodoro
            console.log("Switching to Pomodoro");
            switchMode(currentModeTime, 'btn_pomodoro');
        }

        playCustomAlarm();  // Воспроизведение уведомления
        changeFavicon('inactive');  // Меняем иконку сайта на 'inactive'

        // Используем setTimeout для того, чтобы убедиться, что DOM обновится корректно
        setTimeout(() => {
            const timerElement = document.getElementById('timer');
            const minutes = Math.floor(currentModeTime / 60);
            const seconds = currentModeTime % 60;
            timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 100); // Задержка на 100 мс для корректного обновления DOM

        // Показываем кнопку 'Старт'
        document.getElementById('btn_start').style.display = 'inline';
        document.getElementById('btn_pause').style.display = 'none';
    };








};
