package com.iskander.lofipomodoro;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todoist")
public class TodoistController {

    private final TodoistService todoistService;

    public TodoistController(TodoistService todoistService) {
        this.todoistService = todoistService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Map<String, Object>>> getTasks(HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Если токен отсутствует
        }
        List<Map<String, Object>> tasks = todoistService.getTasks(accessToken);
        return ResponseEntity.ok(tasks); // Возвращаем JSON с задачами
    }


    // Добавление задачи
    @PostMapping("/tasks")
    public ResponseEntity<String> addTask(@RequestBody Map<String, String> taskData, HttpSession session) {
        String content = taskData.get("content");
        String accessToken = (String) session.getAttribute("accessToken");
        todoistService.addTask(content, accessToken);
        return ResponseEntity.ok("Task added");
    }

    // Удаление задачи
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id, HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");
        todoistService.deleteTask(id, accessToken);
        return ResponseEntity.ok("Task deleted");
    }

    // Завершение задачи
    @PostMapping("/tasks/{id}/complete")
    public ResponseEntity<String> completeTask(@PathVariable Long id, HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");
        todoistService.completeTask(id, accessToken);
        return ResponseEntity.ok("Task completed");
    }
}
