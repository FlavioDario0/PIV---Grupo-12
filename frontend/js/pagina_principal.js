// ==========================================
// MOCK DE DADOS (Simulando o Banco de Dados/Backend)
// ==========================================
const mockData = {
    streak: {
        current: 30, // Dias seguidos
        days: [
            { name: 'Seg', status: 'descanso' },
            { name: 'Ter', status: 'treinou' },
            { name: 'Qua', status: 'descanso' },
            { name: 'Qui', status: 'treinou' },
            { name: 'Sex', status: 'descanso' },
            { name: 'Sáb', status: 'descanso' },
            { name: 'Dom', status: 'descanso' }
        ]
    },
    treinoDoDia: [
        { nome: 'Supino Reto', series_reps: '3x12' },
        { nome: 'Supino<br>Inclinado', series_reps: '3x10' },
        { nome: 'Rosca Direta', series_reps: '3x10' },
        { nome: 'Elevação<br>Lateral', series_reps: '3x12' },
        { nome: 'Triceps<br>Pulley', series_reps: '3x12' }
    ],
    resumoSemanal: {
        periodo: '9 a 15 de Março',
        diasTreinados: [
            { dia: 'Segunda-feira', treinou: true },
            { dia: 'Terça-feira', treinou: true },
            { dia: 'Quinta-feira', treinou: false },
            { dia: 'Sábado', treinou: true }
        ],
        exerciciosRealizados: [
            { dia: 'Segunda-feira', feitos: 5, meta: 6 },
            { dia: 'Terça-feira', feitos: 5, meta: 6 },
            { dia: 'Quinta-feira', feitos: 0, meta: 0 },
            { dia: 'Sábado', feitos: 6, meta: 6 }
        ],
        totais: {
            treinos_feitos: 3,
            treinos_meta: 5,
            exercicios_feitos: 21,
            exercicios_meta: 30
        }
    }
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
// Aguarda o HTML carregar completamente antes de executar o JS
document.addEventListener('DOMContentLoaded', () => {
    renderStreak();
    renderTreinoDoDia();
    renderResumoSemanal();
});

// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO NO DOM
// ==========================================

function renderStreak() {
    // 1. Atualiza o número grande do Streak
    document.querySelector('.streak-number').textContent = mockData.streak.current;

    // 2. Atualiza os dias do Streak (bolinhas)
    const streakDaysContainer = document.querySelector('.streak-days');
    streakDaysContainer.innerHTML = ''; // Limpa os valores estáticos do HTML

    mockData.streak.days.forEach(day => {
        let iconHtml = '';
        let iconClass = '';

        // Define a classe e o ícone baseado no status
        if (day.status === 'treinou') {
            iconClass = 'checked';
            iconHtml = '✓';
        } else if (day.status === 'descanso') {
            iconClass = 'rest';
            iconHtml = 'Z<small>z</small>';
        } else if (day.status === 'nao_treinou' || day.status === 'pendente') {
            iconClass = 'empty';
            iconHtml = '';
        }

        // Cria o elemento da coluna do dia
        const dayCol = document.createElement('div');
        dayCol.className = 'day-col';
        dayCol.innerHTML = `
            <span class="day-name">${day.name}</span>
            <div class="day-icon ${iconClass}">${iconHtml}</div>
        `;
        streakDaysContainer.appendChild(dayCol);
    });
}

function renderTreinoDoDia() {
    const exercisesRow = document.querySelector('.exercises-row');
    exercisesRow.innerHTML = ''; // Limpa os exercícios estáticos

    if (mockData.treinoDoDia.length === 0) {
        exercisesRow.innerHTML = '<p style="color: white; font-weight: 600; width: 100%; text-align: center; align-self: center;">Hoje é dia de descanso! Aproveite para recarregar as energias. 💤</p>';
        return;
    }

    mockData.treinoDoDia.forEach(ex => {
        // Cria o card de cada exercício
        const item = document.createElement('div');
        item.className = 'exercise-item';
        item.innerHTML = `
            <h4>${ex.nome}</h4>
            <p>${ex.series_reps}</p>
        `;
        exercisesRow.appendChild(item);
    });
}

function renderResumoSemanal() {
    // 1. Atualiza o período
    document.querySelector('.section-header p').textContent = `Período: ${mockData.resumoSemanal.periodo}`;

    // 2. Atualiza a lista de Dias Treinados
    const daysList = document.querySelector('.days-list');
    daysList.innerHTML = '';
    mockData.resumoSemanal.diasTreinados.forEach(dia => {
        const li = document.createElement('li');
        if (dia.treinou) {
            li.innerHTML = `<span class="box-icon green">✓</span> ${dia.dia}`;
        } else {
            li.className = 'text-muted'; // Deixa o texto cinza
            li.innerHTML = `<span class="box-icon red">✗</span> ${dia.dia}`;
        }
        daysList.appendChild(li);
    });

    // 3. Atualiza a lista de Exercícios Realizados
    const exercisesList = document.querySelector('.exercises-list');
    exercisesList.innerHTML = '';
    mockData.resumoSemanal.exerciciosRealizados.forEach(dia => {
        const li = document.createElement('li');
        if (dia.meta > 0) {
            li.innerHTML = `<span>${dia.dia}</span> <strong>${dia.feitos} / ${dia.meta}</strong>`;
        } else {
            li.className = 'text-muted';
            li.innerHTML = `<span>${dia.dia}</span> <strong>----</strong>`;
        }
        exercisesList.appendChild(li);
    });

    // 4. Atualiza os cards de Totais
    // Seleciona os dois cards (índice 0 = treinos, índice 1 = exercícios)
    const totalCards = document.querySelectorAll('.total-card');

    // Total de Treinos
    totalCards[0].querySelector('.large-num').textContent = mockData.resumoSemanal.totais.treinos_feitos;
    totalCards[0].querySelector('.small-num').textContent = `/ ${mockData.resumoSemanal.totais.treinos_meta}`;

    // Total de Exercícios
    totalCards[1].querySelector('.large-num').textContent = mockData.resumoSemanal.totais.exercicios_feitos;
    totalCards[1].querySelector('.small-num').textContent = `/ ${mockData.resumoSemanal.totais.exercicios_meta}`;
}
