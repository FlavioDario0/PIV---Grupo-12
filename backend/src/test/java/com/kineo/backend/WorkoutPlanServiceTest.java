package com.kineo.backend;

import com.kineo.backend.dto.WorkoutExerciseRequest;
import com.kineo.backend.dto.WorkoutPlanRequest;
import com.kineo.backend.dto.WorkoutPlanResponse;
import com.kineo.backend.entity.User;
import com.kineo.backend.entity.WorkoutPlan;
import com.kineo.backend.entity.WorkoutExercise;
import com.kineo.backend.repository.UserRepository;
import com.kineo.backend.repository.WorkoutPlanRepository;
import com.kineo.backend.service.WorkoutPlanService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutPlanServiceTest {

    @Mock
    private WorkoutPlanRepository workoutPlanRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WorkoutPlanService workoutPlanService;

    @Test
    void create_shouldSaveWorkoutPlanForExistingUser() {
        User user = new User();
        user.setId(1L);
        user.setNome("Teste");

        WorkoutExerciseRequest exerciseRequest = new WorkoutExerciseRequest();
        exerciseRequest.setDiaSemana("Segunda");
        exerciseRequest.setNomeExercicio("Supino");
        exerciseRequest.setGrupoMuscular("Peito");
        exerciseRequest.setSeries(4);
        exerciseRequest.setRepeticoes(10);
        exerciseRequest.setDescansoSegundos(90);
        exerciseRequest.setObservacoes("Foco na execução");

        WorkoutPlanRequest request = new WorkoutPlanRequest();
        request.setUserId(1L);
        request.setTitulo("Plano de Força");
        request.setObjetivo("Hipertrofia");
        request.setExercicios(List.of(exerciseRequest));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(workoutPlanRepository.save(any(WorkoutPlan.class))).thenAnswer(invocation -> {
            WorkoutPlan saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        WorkoutPlanResponse response = workoutPlanService.create(request);

        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getTitulo()).isEqualTo("Plano de Força");
        assertThat(response.getObjetivo()).isEqualTo("Hipertrofia");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getExercicios()).hasSize(1);
        assertThat(response.getExercicios().get(0).getNomeExercicio()).isEqualTo("Supino");

        ArgumentCaptor<WorkoutPlan> planCaptor = ArgumentCaptor.forClass(WorkoutPlan.class);
        verify(workoutPlanRepository).save(planCaptor.capture());
        WorkoutPlan savedPlan = planCaptor.getValue();
        assertThat(savedPlan.getUser()).isEqualTo(user);
        assertThat(savedPlan.getExercicios()).hasSize(1);
        assertThat(savedPlan.getExercicios().get(0).getNomeExercicio()).isEqualTo("Supino");
    }

    @Test
    void create_shouldThrowWhenUserNotFound() {
        WorkoutPlanRequest request = new WorkoutPlanRequest();
        request.setUserId(99L);
        request.setTitulo("Plano");
        request.setObjetivo("Saúde");

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> workoutPlanService.create(request));
        verify(workoutPlanRepository, never()).save(any());
    }

    @Test
    void findById_shouldReturnMappedWorkoutPlan() {
        WorkoutPlan workoutPlan = new WorkoutPlan();
        workoutPlan.setId(2L);
        workoutPlan.setTitulo("Treino A");
        workoutPlan.setObjetivo("Resistência");
        User user = new User();
        user.setId(5L);
        workoutPlan.setUser(user);

        when(workoutPlanRepository.findById(2L)).thenReturn(Optional.of(workoutPlan));

        WorkoutPlanResponse response = workoutPlanService.findById(2L);

        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getTitulo()).isEqualTo("Treino A");
        assertThat(response.getUserId()).isEqualTo(5L);
    }

    @Test
    void findById_shouldThrowWhenNotFound() {
        when(workoutPlanRepository.findById(3L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> workoutPlanService.findById(3L));
    }

    @Test
    void delete_shouldRemoveExistingWorkoutPlan() {
        when(workoutPlanRepository.existsById(10L)).thenReturn(true);

        workoutPlanService.delete(10L);

        verify(workoutPlanRepository).deleteById(10L);
    }

    @Test
    void delete_shouldThrowWhenWorkoutPlanDoesNotExist() {
        when(workoutPlanRepository.existsById(11L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> workoutPlanService.delete(11L));
        verify(workoutPlanRepository, never()).deleteById(anyLong());
    }

    @Test
    void findByUserId_shouldReturnMappedList() {
        WorkoutPlan workoutPlan = new WorkoutPlan();
        workoutPlan.setId(4L);
        workoutPlan.setTitulo("Plano B");
        workoutPlan.setObjetivo("Condicionamento");
        User user = new User();
        user.setId(7L);
        workoutPlan.setUser(user);

        when(workoutPlanRepository.findByUserId(7L)).thenReturn(List.of(workoutPlan));

        List<WorkoutPlanResponse> responses = workoutPlanService.findByUserId(7L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getUserId()).isEqualTo(7L);
        assertThat(responses.get(0).getTitulo()).isEqualTo("Plano B");
    }
}
