package com.iskander.lofipomodoro;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Controller
public class UserController {

    private final TodoistService todoistService;

    // Инъекция TodoistService
    public UserController(TodoistService todoistService) {
        this.todoistService = todoistService;
    }

    @GetMapping("/user-info")
    @ResponseBody
    public Map<String, Object> getUserInfo() {
        // Получаем информацию о пользователе через сервис
        Map<String, Object> userInfo = todoistService.getUserInfo();

        if (userInfo != null) {
            return userInfo;  // Возвращаем данные пользователя в виде JSON
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized");
        }
    }
}
