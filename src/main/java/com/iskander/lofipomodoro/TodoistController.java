package com.iskander.lofipomodoro;

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
    public ResponseEntity<List<Map<String, Object>>> getTasks() {
        List<Map<String, Object>> tasks = todoistService.getTasks();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/tasks")
    public ResponseEntity<String> addTask(@RequestBody Map<String, String> taskData) {
        String content = taskData.get("content");
        todoistService.addTask(content);
        return ResponseEntity.ok("Task added");
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        todoistService.deleteTask(id);
        return ResponseEntity.ok("Task deleted");
    }

    @PostMapping("/tasks/{id}/complete")
    public ResponseEntity<String> completeTask(@PathVariable Long id) {
        todoistService.completeTask(id);
        return ResponseEntity.ok("Task completed");
    }
}

