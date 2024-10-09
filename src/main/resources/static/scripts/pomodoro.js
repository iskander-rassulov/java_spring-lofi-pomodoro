/** Класс CountdownTimer для обратного отсчета */
function CountdownTimer(seconds, tickRate) {
    this.seconds = seconds || (25 * 60); // Значение по умолчанию: 25 минут
    this.tickRate = tickRate || 500; // Интервал тиков в миллисекундах
    this.tickFunctions = []; // Массив функций, вызываемых при каждом тике
    this.isRunning = false; // Флаг, запущен ли таймер
    this.remaining = this.seconds; // Оставшееся время в секундах
    this.timerId = null; // ID таймера для setTimeout
}

// Метод для старта таймера
CountdownTimer.prototype.start = function() {
    if (this.isRunning) return; // Если таймер уже запущен, ничего не делаем

    this.isRunning = true; // Устанавливаем флаг работы таймера
    hideTimeAdjustmentButtons(); // Скрываем кнопки увеличения/уменьшения времени
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
                thisTimer.remaining = 0;
                thisTimer.isRunning = false;
                playAlarm();
                changeFavicon('green');
                showTimeAdjustmentButtons(); // Показываем кнопки увеличения/уменьшения времени после завершения
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

// Функция воспроизведения сигнала
function playAlarm() {
    var alarmValue = document.getElementById('alarm_select').value;
    if (alarmValue !== 'none') {
        var alarmAudio = document.getElementById(alarmValue);
        var alarmVolume = document.getElementById('alarm_volume').value;
        alarmAudio.volume = alarmVolume / 100;
        alarmAudio.play();
    }
}

// Функция изменения фавикона
function changeFavicon(color) {
    document.head = document.head || document.getElementsByTagName('head')[0];
    var newFavicon = document.createElement('link'),
    oldFavicon = document.getElementById('dynamic-favicon');
    newFavicon.id = 'dynamic-favicon';
    newFavicon.type = 'image/ico';
    newFavicon.rel = 'icon';
    newFavicon.href = 'images/' + color + '_tomato.ico';

    if (oldFavicon) {
        document.head.removeChild(oldFavicon);
    }
    document.head.appendChild(newFavicon);
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

    const MAX_TIME_LIMIT = 995 * 60;  // Максимум 995 минут
    var timerDisplay = document.getElementById('timer');
    var currentTimeDisplay = document.getElementById('currentTimeDisplay');
    var timer = new CountdownTimer(currentModeTime);

    function setTimeOnAllDisplays(minutes, seconds) {
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
        timer.pause(); // Ставим таймер на паузу при смене режима
        currentModeTime = newModeTime; // Устанавливаем время для нового режима
        timer.remaining = newModeTime; // Обновляем оставшееся время
        setTimeOnAllDisplays(Math.floor(newModeTime / 60), newModeTime % 60); // Обновляем отображение времени
        setActiveButton(buttonId); // Устанавливаем активную кнопку
        document.getElementById('btn_start').style.display = 'inline'; // Делаем кнопку "Старт" активной
        document.getElementById('btn_pause').style.display = 'none'; // Скрываем кнопку "Пауза"
        updateCurrentTimeDisplay(); // Обновляем текущее время на дисплее
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

    setActiveButton('btn_pomodoro');
    setTimeOnAllDisplays(25, 0);
    timer.onTick(setTimeOnAllDisplays);

    document.getElementById('btn_start').addEventListener('click', function() {
        document.getElementById('btn_pause').style.display = 'inline';
        document.getElementById('btn_start').style.display = 'none';
        timer.start();

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
};
