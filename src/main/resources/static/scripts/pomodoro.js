/** Represents a timer that can count down. */
function CountdownTimer(seconds, tickRate) {
    this.seconds = seconds || (25*60);
    this.tickRate = tickRate || 500; // Milliseconds
    this.tickFunctions = [];
    this.isRunning = false;
    this.remaining = this.seconds;

    /** CountdownTimer starts ticking down and executes all tick
        functions once per tick. */
    this.start = function() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        var startTime = Date.now(),
        thisTimer = this;

        const tick = () => {
            var secondsSinceStart = ((Date.now() - startTime) / 1000) | 0;
            var secondsRemaining = thisTimer.remaining - secondsSinceStart;

            if (!thisTimer.isRunning) {
                thisTimer.remaining = secondsRemaining;
            } else {
                if (secondsRemaining > 0) {
                    setTimeout(tick, thisTimer.tickRate);
                } else {
                    thisTimer.remaining = 0;
                    thisTimer.isRunning = false;
                    playAlarm();
                    changeFavicon('green');
                }

                var timeRemaining = parseSeconds(secondsRemaining);
                thisTimer.tickFunctions.forEach(function(tickFunction) {
                    tickFunction.call(thisTimer, timeRemaining.minutes, timeRemaining.seconds);
                });
            }
        };

        tick(); // Запускаем первую итерацию
    };

    /** Pause the timer. */
    this.pause = function() {
        this.isRunning = false;
    };

    /** Pause the timer and reset to its original time. */
    this.reset = function(seconds) {
        this.isRunning = false;
        this.seconds = seconds;
        this.remaining = seconds;
    };

    /** Add a function to the timer's tickFunctions. */
    this.onTick = function(tickFunction) {
        if (typeof tickFunction === 'function') {
            this.tickFunctions.push(tickFunction);
        }
    };
}

/** Return minutes and seconds from seconds. */
function parseSeconds(seconds) {
    seconds = Math.max(0, seconds); // Нормализация отрицательных значений
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
}

/** Play the selected alarm at selected volume. */
function playAlarm() {
    var alarmValue = document.getElementById('alarm_select').value;
    if (alarmValue != 'none') {
        var alarmAudio = document.getElementById(alarmValue);
        var alarmVolume = document.getElementById('alarm_volume').value;
        alarmAudio.volume = alarmVolume / 100;
        alarmAudio.play();
    }
}

/** Change the color of the favicon. */
function changeFavicon(color) {
    document.head = document.head || document.getElementsByTagName('head')[0];
    var color = color || 'green';

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

/** Window onload functions. */
window.onload = function () {
    var timerDisplay = document.getElementById('timer'),
    customTimeInput = document.getElementById('ipt_custom'),
    timer = new CountdownTimer(),
    timeObj = parseSeconds(25 * 60);

    function setTimeOnAllDisplays(minutes, seconds) {
        var clockMinutes = minutes < 10 ? '0' + minutes : minutes;
        var clockSeconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.textContent = clockMinutes + ':' + clockSeconds;
        document.title = '(' + minutes + 'm) Pomodoro';
    }

    function resetMainTimer(seconds) {
        console.log(`resetMainTimer called with ${seconds} seconds`);
        changeFavicon('red');
        timer.pause();
        timer = new CountdownTimer(seconds);
        timer.onTick(setTimeOnAllDisplays);
        setTimeOnAllDisplays(Math.floor(seconds / 60), seconds % 60);
        console.log(`Timer reset to ${seconds} seconds`);
    }

    function setActiveButton(buttonId) {
        console.log('Switching active button to: ', buttonId);
        // Удаляем класс active у всех кнопок
        document.getElementById('btn_pomodoro').classList.remove('active');
        document.getElementById('btn_shortbreak').classList.remove('active');
        document.getElementById('btn_longbreak').classList.remove('active');

        // Добавляем класс active к выбранной кнопке
        document.getElementById(buttonId).classList.add('active');
        console.log('Active button set: ', document.getElementById(buttonId).classList);
    }


    setTimeOnAllDisplays(timeObj.minutes, timeObj.seconds);
    timer.onTick(setTimeOnAllDisplays);

    // Обработчики для кнопок
    document.getElementById('btn_start').addEventListener('click', function () {
        document.getElementById('btn_start').style.display = 'none';
        document.getElementById('btn_pause').style.display = 'inline';
        timer.start();
    });

    document.getElementById('btn_pause').addEventListener('click', function () {
        document.getElementById('btn_pause').style.display = 'none';
        document.getElementById('btn_start').style.display = 'inline';
        timer.pause();
    });

    document.getElementById('btn_pomodoro').addEventListener('click', function () {
        console.log("Pomodoro button clicked");
        resetMainTimer(25 * 60);
        setActiveButton('btn_pomodoro');
        document.getElementById('btn_pause').style.display = 'none';  // Скрываем кнопку PAUSE
        document.getElementById('btn_start').style.display = 'inline';
    });

    document.getElementById('btn_shortbreak').addEventListener('click', function () {
        console.log("Short break button clicked");
        resetMainTimer(5 * 60);
        setActiveButton('btn_shortbreak');
        document.getElementById('btn_pause').style.display = 'none';  // Скрываем кнопку PAUSE
        document.getElementById('btn_start').style.display = 'inline';
    });

    document.getElementById('btn_longbreak').addEventListener('click', function () {
        console.log("Long break button clicked");
        resetMainTimer(15 * 60);
        setActiveButton('btn_longbreak');
        document.getElementById('btn_pause').style.display = 'none';  // Скрываем кнопку PAUSE
        document.getElementById('btn_start').style.display = 'inline';
    });

    document.getElementById('btn_reset').addEventListener('click', function () {
        resetMainTimer(timer.seconds);
        timer.start();
    });

    document.getElementById('btn_custom').addEventListener('click', function () {
        var customUnits = document.getElementById('custom_units').value;
        if (customUnits === 'minutes') {
            resetMainTimer(customTimeInput.value * 60);
        } else if (customUnits === 'hours') {
            resetMainTimer(customTimeInput.value * 3600);
        } else {
            resetMainTimer(customTimeInput.value);
        }
        timer.start();
    });
};


document.getElementById('btn_start').addEventListener('click', function () {
    document.getElementById('btn_start').style.display = 'none';  // Скрываем кнопку START
    document.getElementById('btn_pause').style.display = 'inline';  // Показываем кнопку PAUSE
    timer.start();  // Запускаем таймер
});

document.getElementById('btn_pause').addEventListener('click', function () {
    document.getElementById('btn_pause').style.display = 'none';  // Скрываем кнопку PAUSE
    document.getElementById('btn_start').style.display = 'inline';  // Показываем кнопку START
    timer.pause();  // Приостанавливаем таймер
});
