package com.iskander.lofipomodoro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

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
    public ResponseEntity<String> todoistCallback(@RequestParam("code") String code) {
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
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            // Извлекаем access_token из ответа
            Map<String, String> responseBody = response.getBody();
            String accessToken = responseBody.get("access_token");

            // Выводим токен в лог или возвращаем как часть HTTP-ответа
            System.out.println("Access Token: " + accessToken);
            return ResponseEntity.ok("Access Token: " + accessToken);
        } else {
            // Обрабатываем ошибки
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve access token");
        }
    }


}
