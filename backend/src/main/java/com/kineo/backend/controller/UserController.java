package com.kineo.backend.controller;

import com.kineo.backend.entity.User;
import com.kineo.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin("*") // Permite que o seu frontend acesse esta rota sem erros de segurança
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Rota para buscar os dados do perfil: GET http://localhost:8080/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> getPerfil(@PathVariable Long id) {
        try {
            User user = userService.buscarPorId(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}