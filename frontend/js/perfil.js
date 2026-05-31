const dadosPesoMock = [
    { mes: "Out/25", peso: 64.8 }, { mes: "Nov/25", peso: 64.1 },
    { mes: "Dez/25", peso: 63.9 }, { mes: "Jan/26", peso: 63.5 },
    { mes: "Fev/26", peso: 62.8 }, { mes: "Mar/26", peso: 62.4 }
];

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

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "--";
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}

async function carregarDadosUsuario() {
    const token = getToken();
    const id = getUserId();

    if (!token || !id) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const usuario = await response.json();
            
            document.getElementById("user").innerText = usuario.nome || "Usuário";
            document.getElementById("idade").innerText = calcularIdade(usuario.dataNascimento);
            document.getElementById("altura").innerText = usuario.altura || "--";
            document.getElementById("peso").innerText = usuario.peso || "--";
            document.getElementById("objetivo").innerText = usuario.objetivo || "--";
            document.getElementById("nivel").innerText = usuario.nivel || "--";
            
            document.getElementById("data").innerText = new Date().toLocaleDateString("pt-BR");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

async function carregarHistoricoEvolucao() {
    const token = getToken();
    const id = getUserId();
    if (!token || !id) return;

    try {
        const response = await fetch(`http://localhost:8080/treino/historico/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const logs = await response.json();
            processarHistorico(logs);
            processarEvolucaoCargas(logs);
        }
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
    }
}

function processarHistorico(logs) {
    const container = document.querySelector(".table-hist");
    container.innerHTML = "";

    if (logs.length === 0) {
        container.innerHTML = "<p style='color:#888; padding: 20px;'>Nenhum treino finalizado ainda. Vá até a ficha de treinos e conclua os seus exercícios!</p>";
        return;
    }

    const treinosPorData = {};
    logs.forEach(log => {
        const partesData = log.data.split("-");
        const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : log.data;
        
        if (!treinosPorData[dataFormatada]) treinosPorData[dataFormatada] = [];
        treinosPorData[dataFormatada].push(log);
    });

    for (const [data, exercicios] of Object.entries(treinosPorData)) {
        let exerciciosHTML = "";
        exercicios.forEach(ex => {
            exerciciosHTML += `<div class="linha"><span>${ex.nomeExercicio}</span><span>${ex.metaSeries}x${ex.repeticoesFeitas}</span><span>${ex.cargaUsada}kg</span></div>`;
        });

        container.innerHTML += `
            <div class="card-historico">
                <div class="topo">
                    <span class="titulo"><strong>Sessão de Treino</strong></span>
                    <span class="data">Data: ${data}</span>
                </div>
                <div class="cabecalho"><span>Exercícios:</span><span>Séries x Reps</span><span>Carga</span></div>
                <div class="lista-exercicios">${exerciciosHTML}</div>
            </div>`;
    }
}

function processarEvolucaoCargas(logs) {
    const exerciciosAgrupados = {};

    logs.forEach(log => {
        if (!exerciciosAgrupados[log.nomeExercicio]) {
            exerciciosAgrupados[log.nomeExercicio] = [];
        }
        exerciciosAgrupados[log.nomeExercicio].push(log);
    });

    const destaques = [];

    for (const [nome, listaLogs] of Object.entries(exerciciosAgrupados)) {
        if (listaLogs.length >= 2) {
            const cargaMaisRecente = listaLogs[0].cargaUsada;
            const cargaMaisAntiga = listaLogs[listaLogs.length - 1].cargaUsada;
            const diferenca = cargaMaisRecente - cargaMaisAntiga;
            
            if (diferenca !== 0) {
                destaques.push({
                    nome: nome,
                    ganho: diferenca
                });
            }
        }
    }

    renderizarDestaques(destaques);
}

function renderizarDestaques(lista) {
    const col1 = document.getElementById("coluna1");
    const col2 = document.getElementById("coluna2");
    col1.innerHTML = ""; col2.innerHTML = "";

    if (lista.length === 0) {
        col1.innerHTML = "<p style='color:#888; font-size:14px;'>Realize o mesmo exercício mais de uma vez com pesos diferentes para ver a sua evolução!</p>";
        return;
    }

    lista.sort((a, b) => b.ganho - a.ganho);
    
    const metade = Math.ceil(lista.length / 2);
    
    lista.slice(0, metade).forEach(ex => {
        const isPositivo = ex.ganho > 0;
        const cor = isPositivo ? "#4CAF50" : "#F44336"; 
        const icone = isPositivo ? "▲" : "▼"; 
        col1.innerHTML += `<div class="item"><span>${ex.nome}</span><span class="ganho" style="color: ${cor}; font-weight: bold;">${icone} ${isPositivo ? '+' : ''}${ex.ganho.toFixed(1)} kg</span></div>`;
    });
    lista.slice(metade).forEach(ex => {
        const isPositivo = ex.ganho > 0;
        const cor = isPositivo ? "#4CAF50" : "#F44336";
        const icone = isPositivo ? "▲" : "▼";
        col2.innerHTML += `<div class="item"><span>${ex.nome}</span><span class="ganho" style="color: ${cor}; font-weight: bold;">${icone} ${isPositivo ? '+' : ''}${ex.ganho.toFixed(1)} kg</span></div>`;
    });
}

function carregarPeso() { criarGrafico(dadosPesoMock); }

function criarGrafico(dados) {
    const ctx = document.getElementById("graficoPeso");
    new Chart(ctx, {
        type: "line",
        data: {
        labels: dados.map(d => d.mes),
        datasets: [{ label: "Peso (kg)", data: dados.map(d => d.peso), borderWidth: 3, tension: 0.4, fill: true, borderColor: "#6c63ff", backgroundColor: "rgba(108, 99, 255, 0.1)" }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

const modal = document.getElementById("modal-atualizar");
const btnAbrir = document.querySelector(".btn"); 

btnAbrir.onclick = () => {
    modal.classList.remove("hidden");
    document.getElementById("altura-card").value = document.getElementById("altura").innerText;
    document.getElementById("peso-card").value = document.getElementById("peso").innerText;
    document.getElementById("nivel-card").value = document.getElementById("nivel").innerText.toLowerCase();
};

document.getElementById("cancelar").onclick = () => {
    modal.classList.add("hidden");
};

document.getElementById("salvar").onclick = () => {
    document.getElementById("altura").innerText = document.getElementById("altura-card").value;
    document.getElementById("peso").innerText = document.getElementById("peso-card").value;
    document.getElementById("nivel").innerText = document.getElementById("nivel-card").value;
    document.getElementById("data").innerText = new Date().toLocaleDateString("pt-BR");
    modal.classList.add("hidden");
    alert("Aviso: Para salvar permanentemente, o backend precisa de uma rota PUT /users/{id}. No momento a alteração é apenas visual.");
};

window.onload = () => {
    carregarDadosUsuario();
    carregarHistoricoEvolucao();
    carregarPeso();
};