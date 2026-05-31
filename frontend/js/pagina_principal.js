function getToken() {
    const usuarioStorage = localStorage.getItem("usuarioLogado");
    return usuarioStorage ? JSON.parse(usuarioStorage).token : null;
}

function getUserId() {
    const usuarioStorage = localStorage.getItem("usuarioLogado");
    if (!usuarioStorage) return null;
    const user = JSON.parse(usuarioStorage);
    return user.id || user.userId || user.idUsuario;
}

async function carregarHome() {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
        window.location.href = "login.html";
        return;
    }

    try {
        fetch(`http://localhost:8080/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json()).then(user => {
            const saudacao = document.getElementById("nome-usuario");
            if (saudacao) saudacao.innerText = `Olá, ${user.nome.split(" ")[0]}!`;
        }).catch(err => console.log(err));

        let treinouHoje = false;
        const resSummary = await fetch(`http://localhost:8080/streaks/user/${userId}/summary`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (resSummary.ok) {
            const summary = await resSummary.json();
            const streakElement = document.querySelector(".streak-number");
            if (streakElement) streakElement.innerText = summary.sequenciaAtual || summary.sequenciaTreinando || 0;
            treinouHoje = summary.treinouHoje; 
        }

        const resHistorico = await fetch(`http://localhost:8080/streaks/user/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (resHistorico.ok) {
            const historico = await resHistorico.json();
            renderizarBolinhas(historico);
        }

        carregarFichaNaHome(userId, token, treinouHoje);

    } catch (error) {
        console.error(error);
    }
}

async function carregarFichaNaHome(userId, token, treinouHoje) {
    try {
        const response = await fetch(`http://localhost:8080/workouts/user/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const planos = await response.json();
            if (planos.length > 0) {
                const planoAtual = planos[planos.length - 1];
                const exercicios = planoAtual.exercicios || [];

                renderizarTreinoDoDia(exercicios, treinouHoje);
                renderizarResumoSemanal(exercicios);
            } else {
                renderizarTreinoDoDia([], false);
                renderizarResumoSemanal([]);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function renderizarBolinhas(historico) {
    const container = document.querySelector(".streak-days");
    if (!container) return;
    
    container.innerHTML = ""; 
    const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

    historico.forEach(diaLog => {
        const partes = diaLog.data.split('-'); 
        const dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
        const letraDia = diasSemana[dataObj.getDay()];

        const classeStatus = diaLog.treinou ? "checked" : "rest";

        container.innerHTML += `
            <div class="day">
                <span class="day-name">${letraDia}</span>
                <div class="day-icon ${classeStatus}"></div>
            </div>
        `;
    });
}

function renderizarTreinoDoDia(exercicios, treinouHoje) {
    const container = document.getElementById("lista-treino-dia"); 
    if (!container) return;

    if (treinouHoje) {
         container.innerHTML = `
            <div style="text-align:center; padding: 30px; background: rgba(255,255,255,0.02); border-radius: 12px; margin-top: 15px;">
                <h3 style="color:#4CAF50; margin: 0; font-family: 'Russo One', sans-serif;">✅ Treino Concluído!</h3>
                <p style="color: #aaa; margin-top: 10px;">Excelente trabalho! O seu treino de hoje já foi registado. Bom descanso.</p>
            </div>`;
         return;
    }

    const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"];
    const hojeNome = diasDaSemana[new Date().getDay()].toLowerCase(); 

    const exerciciosHoje = exercicios.filter(ex => {
        const diaBanco = (ex.diaSemana || "").toLowerCase();
        return diaBanco.startsWith(hojeNome.substring(0, 3)); 
    });

    container.innerHTML = "";

    if (exercicios.length === 0) {
        container.innerHTML = "<p style='color: #888; text-align: center; padding: 20px;'>Nenhuma ficha criada. Vá à página de Fichas para gerar um treino!</p>";
        return;
    }

    if (exerciciosHoje.length === 0) {
        container.innerHTML = "<p style='color: #888; text-align: center; padding: 20px;'>Hoje é o seu dia de descanso (ou não há exercícios programados). Recupere as energias!</p>";
        return;
    }

    exerciciosHoje.forEach(ex => {
        const cargaTexto = ex.cargaRecomendada ? `${ex.cargaRecomendada}kg` : "Ajustar";
        
        container.innerHTML += `
            <div style="background: rgba(255,255,255,0.05); padding: 15px 20px; border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #6c63ff;">
                <div>
                    <h4 style="margin: 0; color: #fff; text-transform: capitalize; font-size: 16px;">${ex.nomeExercicio}</h4>
                    <span style="font-size: 13px; color: #aaa; text-transform: capitalize;">${ex.grupoMuscular}</span>
                </div>
                <div style="text-align: right;">
                    <span style="display: block; color: #6c63ff; font-weight: bold; font-size: 16px;">${ex.series} x ${ex.repeticoes}</span>
                    <span style="font-size: 12px; color: #ddd; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; margin-top: 4px; display: inline-block;">Carga: ${cargaTexto}</span>
                </div>
            </div>
        `;
    });
}

function renderizarResumoSemanal(exercicios) {
    const container = document.getElementById("lista-resumo-semanal"); 
    if (!container) return;

    if (exercicios.length === 0) {
        container.innerHTML = "<p style='color: #888; padding: 20px;'>Sem dados.</p>";
        return;
    }

    const resumo = {};
    exercicios.forEach(ex => {
        const dia = ex.diaSemana || "Indefinido";
        if (!resumo[dia]) resumo[dia] = new Set();
        if (ex.grupoMuscular) resumo[dia].add(ex.grupoMuscular);
    });

    container.innerHTML = "";
    
    for (const [dia, musculosSet] of Object.entries(resumo)) {
        const musculosText = Array.from(musculosSet).join(", ") || "Treino Geral";
        
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); margin-bottom: 5px; border-radius: 6px;">
                <span style="color: #fff; font-family: 'Russo One', sans-serif; font-size: 14px; text-transform: capitalize; width: 30%;">${dia}</span>
                <span style="color: #a78bfa; text-transform: capitalize; font-size: 14px; text-align: right; width: 70%; font-weight: bold;">${musculosText}</span>
            </div>
        `;
    }
}

window.onload = () => {
    carregarHome();
};