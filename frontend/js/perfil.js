async function carregarDados() {
    try {
        const usuarioStr = localStorage.getItem('usuarioLogado');
        if (!usuarioStr) return;
        const usuarioLogado = JSON.parse(usuarioStr);
        
        // Chamada real ao backend
        const response = await fetch(`http://localhost:8080/users/${usuarioLogado.id}`);
        if (!response.ok) throw new Error("Falha ao carregar dados do servidor");
        const dados = await response.json();

        document.getElementById("user").innerText = dados.nome || "-";
        document.getElementById("data").innerText = dados.dataNascimento || "-";
        document.getElementById("idade").innerText = dados.idade || "-";
        document.getElementById("altura").innerText = dados.altura || "-";
        document.getElementById("peso").innerText = dados.peso || "-";

        document.getElementById("quadril").innerText = dados.quadril || "-";
        document.getElementById("peito").innerText = dados.peito || "-";
        document.getElementById("coxa").innerText = dados.coxa || "-";
        document.getElementById("cintura").innerText = dados.cintura || "-";
        document.getElementById("braco").innerText = dados.braco || "-";
        document.getElementById("panturrilha").innerText = dados.panturrilha || "-";
    } catch (erro) {
        console.error("Sincronizacao com o Backend falhou:", erro);
        document.getElementById("user").innerText = "Falha de Conexao";
    }
}

carregarDados();


// MODAL
const modal = document.getElementById("modal-atualizar");
const btnAbrir = document.querySelector(".btn"); 

btnAbrir.onclick = () => {
    modal.classList.remove("hidden");

    document.getElementById("idade-card").value = document.getElementById("idade").innerText;
    document.getElementById("altura-card").value = document.getElementById("altura").innerText;
    document.getElementById("peso-card").value = document.getElementById("peso").innerText;

    document.getElementById("quadril-card").value = document.getElementById("quadril").innerText;
    document.getElementById("peito-card").value = document.getElementById("peito").innerText;
    document.getElementById("coxa-card").value = document.getElementById("coxa").innerText;

    document.getElementById("cintura-card").value = document.getElementById("cintura").innerText;
    document.getElementById("braco-card").value = document.getElementById("braco").innerText;
    document.getElementById("panturrilha-card").value = document.getElementById("panturrilha").innerText;
};

document.getElementById("cancelar").onclick = () => {
    modal.classList.add("hidden");
};

document.getElementById("salvar").onclick = () => {
  // pegar valores do modal
    document.getElementById("idade").innerText = document.getElementById("idade-card").value;
    document.getElementById("altura").innerText = document.getElementById("altura-card").value;
    document.getElementById("peso").innerText = document.getElementById("peso-card").value;

    document.getElementById("quadril").innerText = document.getElementById("quadril-card").value;
    document.getElementById("peito").innerText = document.getElementById("peito-card").value;
    document.getElementById("coxa").innerText = document.getElementById("coxa-card").value;

    document.getElementById("cintura").innerText = document.getElementById("cintura-card").value;
    document.getElementById("braco").innerText = document.getElementById("braco-card").value;
    document.getElementById("panturrilha").innerText = document.getElementById("panturrilha-card").value;

    // atualiza data automaticamente
    document.getElementById("data").innerText =
        new Date().toLocaleDateString("pt-BR");

    // fechar modal
    modal.classList.add("hidden");
};


async function carregarPeso() {
    try {
        const response = await fetch("http://localhost:8080/api/peso");
        if (!response.ok) throw new Error("Erro na requisição");
        const dados = await response.json();

        criarGrafico(dados);
    } catch (erro) {
        console.error("Sincronizacao com o Backend falhou:", erro);
        const container = document.getElementById("graficoPeso").parentElement;
        container.innerHTML = `<p style="color: #ff4d4d; text-align: center; margin-top: 50px;">Falha ao carregar gráfico: ${erro.message}</p>`;
    }
}

function criarGrafico(dados) {
    const ctx = document.getElementById("graficoPeso");

    new Chart(ctx, {
        type: "line",
        data: {
        labels: dados.map(d => d.mes),
        datasets: [{
            label: "Peso (kg)",
            data: dados.map(d => d.peso),
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}


async function carregarDestaques() {
    try {
        const response = await fetch("http://localhost:8080/api/cargas");
        if (!response.ok) throw new Error("Erro na requisição");
        const dados = await response.json();

        renderizarDestaques(dados);
    } catch (erro) {
        console.error("Sincronizacao com o Backend falhou:", erro);
        const col1 = document.getElementById("coluna1");
        const col2 = document.getElementById("coluna2");
        col1.innerHTML = "";
        col2.innerHTML = `<p style="color: #ff4d4d;">Falha ao carregar destaques: ${erro.message}</p>`;
    }
}

function renderizarDestaques(lista) {
    const col1 = document.getElementById("coluna1");
    const col2 = document.getElementById("coluna2");

    col1.innerHTML = "";
    col2.innerHTML = "";

    lista = lista.filter(ex => ex.ganho > 0);

    lista.sort((a, b) => b.ganho - a.ganho);

    const top = lista.slice(0, 6);

    const metade = Math.ceil(top.length / 2);
    const coluna1 = top.slice(0, metade);
    const coluna2 = top.slice(metade);

    coluna1.forEach(ex => {
        col1.innerHTML += `
            <div class="item">
            <span>${ex.nome}</span>
            <span class="ganho">
                <img src="../assets/icons/arrow_up.svg" class="icon">
                &nbsp;&nbsp; <strong>${ex.ganho}</strong> kg
            </span>
        </div>
        `;
    });

    coluna2.forEach(ex => {
        col2.innerHTML += `
            <div class="item">
            <span>${ex.nome}</span>
            <span class="ganho">
                <img src="../assets/icons/arrow_up.svg" class="icon">
                &nbsp;&nbsp; <strong>${ex.ganho}</strong> kg
            </span>
        </div>
        `;
    });
}

function renderizarHistorico(lista) {
    const container = document.querySelector(".table-hist");
    container.innerHTML = "";

    lista.forEach(treino => {
        let exerciciosHTML = "";

        treino.exercicios.forEach(ex => {
            exerciciosHTML += `
                <div class="linha">
                    <span>${ex.nome}</span>
                    <span>${ex.serie}</span>
                    <span>${ex.carga}</span>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="card-historico">
                <div class="topo">
                    <span class="titulo"><strong>Treino: ${treino.treino} </strong></span>
                    <span class="data">Data: ${treino.data}</span>
                </div>

                <div class="cabecalho">
                    <span>Exercícios:</span>
                    <span>Séries e Repetições</span>
                    <span>Carga</span>
                </div>

                <div class="lista-exercicios">
                    ${exerciciosHTML}
                </div>

                <div class="obs">
                    Observação: ${treino.observacao}
                </div>
            </div>
        `;
    });
}

async function carregarHistorico() {
    try {
        const usuarioStr = localStorage.getItem('usuarioLogado');
        if (!usuarioStr) return;
        const usuarioLogado = JSON.parse(usuarioStr);

        const response = await fetch(`http://localhost:8080/workouts/user/${usuarioLogado.id}/history`);
        if (!response.ok) throw new Error("Erro na requisição");
        const dados = await response.json();

        renderizarHistorico(dados);
    } catch (erro) {
        console.error("Sincronizacao com o Backend falhou:", erro);
        document.querySelector(".table-hist").innerHTML = `<p style="color: #ff4d4d; text-align: center; padding: 20px;">Falha ao carregar histórico: ${erro.message}</p>`;
    }
}

carregarPeso();
carregarDestaques();
carregarHistorico();
