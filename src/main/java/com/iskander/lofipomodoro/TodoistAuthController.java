package com.iskander.lofipomodoro;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/todoist")
public class TodoistAuthController {

    @Value("${TODOIST_CLIENT_ID}")
    private String clientId;

    @Value("${TODOIST_REDIRECT_URI}")
    private String redirectUri;

    @Value("${TODOIST_CLIENT_SECRET}")
    private String clientSecret;  // Убедитесь, что эта переменная есть

    @GetMapping("/login")
    public ResponseEntity<Void> loginWithTodoist() {
        String authorizationUrl = "https://todoist.com/oauth/authorize?client_id=" + clientId + "&scope=data:read&state=random_state_string&redirect_uri=" + redirectUri;
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(authorizationUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/callback")
    public ModelAndView todoistCallback(@RequestParam("code") String code) {
        RestTemplate restTemplate = new RestTemplate();

        // Формируем запрос на получение токена
        String url = "https://todoist.com/oauth/access_token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        // Отправляем POST запрос
        ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, request, Map.class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            // Извлекаем access_token из ответа
            Map<String, String> responseBody = responseEntity.getBody();
            String accessToken = responseBody.get("access_token");

            // Выводим токен в лог или сохраняем его по необходимости
            System.out.println("Access Token: " + accessToken);

            // Перенаправляем пользователя на корневую страницу
            return new ModelAndView("redirect:/");
        } else {
            // Обрабатываем ошибку
            return new ModelAndView("error");
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, String>> getUserInfo(HttpSession session) {
        String name = (String) session.getAttribute("userName");
        String avatar = (String) session.getAttribute("avatarUrl");

        if (name != null && avatar != null) {
            return ResponseEntity.ok(Map.of("name", name, "avatar", avatar));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}
