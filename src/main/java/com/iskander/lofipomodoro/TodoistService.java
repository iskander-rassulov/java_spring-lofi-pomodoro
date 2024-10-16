package com.iskander.lofipomodoro;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TodoistService {

    private final TodoistAuthController authController;

    // Инъекция контроллера через конструктор
    public TodoistService(TodoistAuthController authController) {
        this.authController = authController;
    }

    // Пример метода для выполнения запроса к Todoist API
    public Map<String, Object> getUserInfo() {
        String accessToken = authController.getAccessToken();  // Получаем токен

        if (accessToken != null) {
            RestTemplate restTemplate = new RestTemplate();
            String userInfoUrl = "https://api.todoist.com/rest/v2/user";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);  // Устанавливаем заголовок с токеном

            HttpEntity<String> request = new HttpEntity<>(null, headers);

            ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();  // Возвращаем данные пользователя
            }
        }

        return null;  // Если нет токена или запрос не удался
    }
}

