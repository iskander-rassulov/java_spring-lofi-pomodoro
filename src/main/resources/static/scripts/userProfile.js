// Функция для обновления профиля пользователя
function updateUserProfile(user) {
    document.getElementById('user-avatar').src = user.avatar;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-info').style.display = 'block';

    // Скрыть кнопку входа после авторизации
    document.getElementById('btn_todoist').style.display = 'none';
}

// Загружаем данные о пользователе при загрузке страницы
window.onload = function() {
    fetch("/user-info")
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            // Если пользователь не авторизован, показать кнопку входа
            document.getElementById('btn_todoist').style.display = 'block';
            throw new Error("Не авторизован");
        }
    })
        .then(user => {
        if (user.name && user.avatar) {
            updateUserProfile(user);
        }
    })
        .catch(error => console.error("Ошибка при получении информации о пользователе:", error));
};
