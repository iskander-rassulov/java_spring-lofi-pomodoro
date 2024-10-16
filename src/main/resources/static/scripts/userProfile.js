// userProfile.js

// Функция для обновления профиля пользователя
function updateUserProfile(user) {
    document.getElementById('user-avatar').src = user.avatar;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-info').style.display = 'block';
}

// Загружаем данные о пользователе при загрузке страницы
window.onload = function() {
    fetch("/user-info")
        .then(response => response.json())
        .then(user => {
        if (user.name && user.avatar) {
            updateUserProfile(user);
        }
    })
        .catch(error => console.error("Error fetching user info:", error));
};


