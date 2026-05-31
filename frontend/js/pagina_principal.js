const usuarioLogado = protegerPagina();



document.addEventListener("DOMContentLoaded", carregarDashboard);

async function carregarDashboard() {
    if (!usuarioLogado) {
        return;
    }

    try {
        const [streakSummary, streakHistory, workouts] = await Promise.all([
            apiFetch(`/streaks/user/${usuarioLogado.id}/summary`),
            apiFetch(`/streaks/user/${usuarioLogado.id}`),
            apiFetch(`/workouts/user/${usuarioLogado.id}`)
        ]);

        const dashboardData = {
            streak: {
                current: streakSummary.sequenciaTreinando || 0,
                days: montarDiasStreak(streakHistory)
            },
            treinoDoDia: montarTreinoDoDia(workouts),
            resumoSemanal: montarResumoSemanal(streakSummary, streakHistory, workouts)
        };

        renderStreak(dashboardData.streak);
        renderTreinoDoDia(dashboardData.treinoDoDia);
        renderResumoSemanal(dashboardData.resumoSemanal);
    } catch (erro) {
        console.error("Sincronizacao com o Backend falhou:", erro);
        const main = document.querySelector(".main") || document.body;
        main.innerHTML = `<div style="padding: 20px; color: #ff4d4d; text-align: center;">
                            <h2>Falha de Conexao</h2>
                            <p>Nao foi possivel carregar os dados do servidor: ${erro.message}</p>
                          </div>`;
    }
}

function montarDiasStreak(historico) {
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const registrosPorData = new Map((historico || []).map(item => [item.data, item]));
    const hoje = new Date();
    const dias = [];

    for (let i = 6; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - i);

        const chave = data.toISOString().slice(0, 10);
        const registro = registrosPorData.get(chave);

        dias.push({
            name: diasSemana[data.getDay()],
            status: registro ? (registro.treinou ? "treinou" : "nao_treinou") : "pendente"
        });
    }

    return dias;
}

function montarTreinoDoDia(workouts) {
    if (!workouts || workouts.length === 0) {
        return [];
    }

    const exercicios = workouts[0].exercicios || [];

    return exercicios.slice(0, 5).map(ex => ({
        nome: ex.nomeExercicio || "Exercicio",
        series_reps: `${ex.series || "-"}x${ex.repeticoes || "-"}`
    }));
}

function montarResumoSemanal(streakSummary, streakHistory, workouts) {
    const historicoOrdenado = [...(streakHistory || [])]
        .sort((a, b) => a.data.localeCompare(b.data))
        .slice(-7);

    const diasTreinados = historicoOrdenado.map(item => ({
        dia: formatarDataBr(item.data),
        treinou: Boolean(item.treinou)
    }));

    const primeiroTreino = workouts && workouts.length ? workouts[0] : null;
    const totalExercicios = primeiroTreino ? (primeiroTreino.exercicios || []).length : 0;
    const treinouHoje = Boolean(streakSummary.treinouHoje);

    return {
        periodo: formatarPeriodoSemana(),
        diasTreinados,
        exerciciosRealizados: [
            {
                dia: "Treino atual",
                feitos: treinouHoje ? totalExercicios : 0,
                meta: totalExercicios
            }
        ],
        totais: {
            treinos_feitos: streakSummary.totalDiasTreinados || 0,
            treinos_meta: streakSummary.totalDiasRegistrados || 0,
            exercicios_feitos: treinouHoje ? totalExercicios : 0,
            exercicios_meta: totalExercicios
        }
    };
}

function formatarPeriodoSemana() {
    const hoje = new Date();
    const inicio = new Date(hoje);
    const dia = hoje.getDay() || 7;

    inicio.setDate(hoje.getDate() - dia + 1);

    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);

    return `${inicio.toLocaleDateString("pt-BR")} a ${fim.toLocaleDateString("pt-BR")}`;
}

function renderStreak(streak) {
    document.querySelector(".streak-number").textContent = streak.current;

    const streakDaysContainer = document.querySelector(".streak-days");
    streakDaysContainer.innerHTML = "";

    streak.days.forEach(day => {
        let iconHtml = "";
        let iconClass = "";

        if (day.status === "treinou") {
            iconClass = "checked";
            iconHtml = "✓";
        } else if (day.status === "descanso") {
            iconClass = "rest";
            iconHtml = "Z<small>z</small>";
        } else {
            iconClass = "empty";
            iconHtml = "";
        }

        const dayCol = document.createElement("div");
        dayCol.className = "day-col";
        dayCol.innerHTML = `
            <span class="day-name">${escapeHtml(day.name)}</span>
            <div class="day-icon ${iconClass}">${iconHtml}</div>
        `;

        streakDaysContainer.appendChild(dayCol);
    });
}

function renderTreinoDoDia(treinoDoDia) {
    const exercisesRow = document.querySelector(".exercises-row");
    exercisesRow.innerHTML = "";

    if (treinoDoDia.length === 0) {
        exercisesRow.innerHTML = '<p style="color: white; font-weight: 600; width: 100%; text-align: center; align-self: center;">Nenhum treino cadastrado para este usuario.</p>';
        return;
    }

    treinoDoDia.forEach(ex => {
        const item = document.createElement("div");
        item.className = "exercise-item";

        const titulo = document.createElement("h4");
        titulo.textContent = ex.nome;

        const series = document.createElement("p");
        series.textContent = ex.series_reps;

        item.appendChild(titulo);
        item.appendChild(series);
        exercisesRow.appendChild(item);
    });
}

function renderResumoSemanal(resumoSemanal) {
    document.querySelector(".section-header p").textContent = `Periodo: ${resumoSemanal.periodo}`;

    const daysList = document.querySelector(".days-list");
    daysList.innerHTML = "";

    if (resumoSemanal.diasTreinados.length === 0) {
        const li = document.createElement("li");
        li.className = "text-muted";
        li.textContent = "Nenhum registro de treino ainda";
        daysList.appendChild(li);
    } else {
        resumoSemanal.diasTreinados.forEach(dia => {
            const li = document.createElement("li");

            if (dia.treinou) {
                li.innerHTML = `<span class="box-icon green">✓</span> ${escapeHtml(dia.dia)}`;
            } else {
                li.className = "text-muted";
                li.innerHTML = `<span class="box-icon red">✗</span> ${escapeHtml(dia.dia)}`;
            }

            daysList.appendChild(li);
        });
    }

    const exercisesList = document.querySelector(".exercises-list");
    exercisesList.innerHTML = "";

    resumoSemanal.exerciciosRealizados.forEach(dia => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${escapeHtml(dia.dia)}</span> <strong>${escapeHtml(dia.feitos)} / ${escapeHtml(dia.meta)}</strong>`;
        exercisesList.appendChild(li);
    });

    const totalCards = document.querySelectorAll(".total-card");

    totalCards[0].querySelector(".large-num").textContent = resumoSemanal.totais.treinos_feitos;
    totalCards[0].querySelector(".small-num").textContent = `/ ${resumoSemanal.totais.treinos_meta}`;
    totalCards[1].querySelector(".large-num").textContent = resumoSemanal.totais.exercicios_feitos;
    totalCards[1].querySelector(".small-num").textContent = `/ ${resumoSemanal.totais.exercicios_meta}`;
}
