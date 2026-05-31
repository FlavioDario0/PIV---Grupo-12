package com.kineo.backend;

import com.kineo.backend.dto.AuthResponse;
import com.kineo.backend.dto.LoginRequest;
import com.kineo.backend.dto.RegisterRequest;
import com.kineo.backend.entity.User;
import com.kineo.backend.repository.UserRepository;
import com.kineo.backend.security.JwtService;
import com.kineo.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_shouldCreateNewUserWhenEmailIsAvailable() {
        RegisterRequest request = new RegisterRequest();
        request.setNome("Fulano");
        request.setDataNascimento("01/01/1990");
        request.setEmail("fulano@example.com");
        request.setSenha("senha123");
        request.setObjetivo("Manutenção");
        request.setNivel("Intermediário");
        request.setAltura(1.75);
        request.setPeso(75.0);
        request.setFrequenciaTreinos("3 vezes por semana");

        when(userRepository.findByEmail("fulano@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("senha123")).thenReturn("encodedSenha");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(5L);
            return saved;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUser().getId()).isEqualTo(5L);
        assertThat(response.getUser().getEmail()).isEqualTo("fulano@example.com");

        verify(passwordEncoder).encode("senha123");
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(any(User.class));
    }

    @Test
    void register_shouldThrowWhenEmailAlreadyRegistered() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("fulano@example.com");

        when(userRepository.findByEmail("fulano@example.com")).thenReturn(Optional.of(new User()));

        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnAuthResponseWhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setSenha("senhaValida");

        User user = new User();
        user.setEmail("user@example.com");
        user.setSenha("encodedSenha");
        user.setId(10L);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senhaValida", "encodedSenha")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-login-token");

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("jwt-login-token");
        assertThat(response.getUser().getId()).isEqualTo(10L);
        assertThat(response.getUser().getEmail()).isEqualTo("user@example.com");
    }

    @Test
    void login_shouldThrowWhenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@example.com");
        request.setSenha("senha");

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowWhenPasswordIsInvalid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setSenha("senhaErrada");

        User user = new User();
        user.setEmail("user@example.com");
        user.setSenha("encodedSenha");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senhaErrada", "encodedSenha")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}
