const usuarioLogadoPerfil = protegerPagina();

const dadosCargasMock = [
    { nome: "Agachamento", ganho: 25 },
    { nome: "Supino reto", ganho: 12 },
    { nome: "Levantamento terra", ganho: 30 },
    { nome: "Leg press", ganho: 18 },
    { nome: "Cadeira extensora", ganho: 8 },
    { nome: "Mesa flexora", ganho: 6 },
    { nome: "Elevacao lateral", ganho: 4 },
    { nome: "Elevacao frontal", ganho: 3 },
    { nome: "Pulley costas", ganho: 15 },
    { nome: "Remada curvada", ganho: 20 },
    { nome: "Rosca direta", ganho: 7 },
    { nome: "Triceps corda", ganho: 5 },
    { nome: "Panturrilha em pe", ganho: 10 },
    { nome: "Panturrilha sentado", ganho: 9 },
    { nome: "Hack machine", ganho: 22 },
    { nome: "Afundo", ganho: 14 },
    { nome: "Desenvolvimento ombro", ganho: 11 },
    { nome: "Crucifixo", ganho: 2 },
    { nome: "Pullover", ganho: 1 },
    { nome: "Abdominal maquina", ganho: 0 }
];

const dadosPesoMock = [
    { mes: "Set/25", peso: 65.2 },
    { mes: "Out/25", peso: 64.8 },
    { mes: "Nov/25", peso: 64.1 },
    { mes: "Dez/25", peso: 63.9 },
    { mes: "Jan/26", peso: 63.5 },
    { mes: "Fev/26", peso: 62.8 },
    { mes: "Mar/26", peso: 62.4 }
];

const historicoMock = [
    {
        treino: "Superiores B",
        data: "17/03/2026",
        observacao: "Treino pesado e completo!",
        exercicios: [
            { nome: "Supino Reto", serie: "3x10", carga: "20kg" },
            { nome: "Supino Inclinado", serie: "3x10", carga: "20kg" },
            { nome: "Rosca Direta", serie: "3x12", carga: "20kg" },
            { nome: "Elevacao Lateral", serie: "3x10", carga: "10kg" },
            { nome: "Triceps Pulley", serie: "3x12", carga: "20kg" }
        ]
    },
    {
        treino: "Inferiores C",
        data: "16/03/2026",
        observacao: "Treino incompleto",
        exercicios: [
            { nome: "Agachamento", serie: "3x10", carga: "20kg" },
            { nome: "Leg Press", serie: "3x10", carga: "20kg" },
            { nome: "Cadeira Extensora", serie: "3x12", carga: "20kg" },
            { nome: "Mesa Flexora", serie: "3x12", carga: "15kg" },
            { nome: "Panturrilha", serie: "3x10", carga: "20kg" }
        ]
    }
];

const medidasMock = {
    quadril: 88,
    peito: 82,
    coxa: 50,
    cintura: 62,
    braco: 24,
    panturrilha: 32
};

function preencherDadosUsuario(usuario) {
    document.getElementById("user").innerText = usuario.nome || "Usuario";
    document.getElementById("data").innerText = new Date().toLocaleDateString("pt-BR");
    document.getElementById("idade").innerText = calcularIdade(usuario.dataNascimento) || "--";
    document.getElementById("altura").innerText = usuario.altura ?? "--";
    document.getElementById("peso").innerText = usuario.peso ?? "--";

    document.getElementById("quadril").innerText = medidasMock.quadril;
    document.getElementById("peito").innerText = medidasMock.peito;
    document.getElementById("coxa").innerText = medidasMock.coxa;
    document.getElementById("cintura").innerText = medidasMock.cintura;
    document.getElementById("braco").innerText = medidasMock.braco;
    document.getElementById("panturrilha").innerText = medidasMock.panturrilha;
}

async function carregarDadosUsuario() {
    if (!usuarioLogadoPerfil) {
        return;
    }

    preencherDadosUsuario(usuarioLogadoPerfil);

    try {
        const usuarioAtualizado = await apiFetch(`/users/${usuarioLogadoPerfil.id}`);
        atualizarUsuarioSessao(usuarioAtualizado);
        preencherDadosUsuario(usuarioAtualizado);
    } catch (erro) {
        console.error(erro);
    }
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento) {
        return null;
    }

    let dia;
    let mes;
    let ano;

    if (dataNascimento.includes("/")) {
        const partes = dataNascimento.split("/");
        dia = parseInt(partes[0], 10);
        mes = parseInt(partes[1], 10) - 1;
        ano = parseInt(partes[2], 10);
    } else {
        const partes = dataNascimento.split("-");
        ano = parseInt(partes[0], 10);
        mes = parseInt(partes[1], 10) - 1;
        dia = parseInt(partes[2], 10);
    }

    if (Number.isNaN(dia) || Number.isNaN(mes) || Number.isNaN(ano)) {
        return null;
    }

    const hoje = new Date();
    const nascimento = new Date(ano, mes, dia);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth() - nascimento.getMonth();

    if (mesAtual < 0 || (mesAtual === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

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
    document.getElementById("idade").innerText = document.getElementById("idade-card").value;
    document.getElementById("altura").innerText = document.getElementById("altura-card").value;
    document.getElementById("peso").innerText = document.getElementById("peso-card").value;
    document.getElementById("quadril").innerText = document.getElementById("quadril-card").value;
    document.getElementById("peito").innerText = document.getElementById("peito-card").value;
    document.getElementById("coxa").innerText = document.getElementById("coxa-card").value;
    document.getElementById("cintura").innerText = document.getElementById("cintura-card").value;
    document.getElementById("braco").innerText = document.getElementById("braco-card").value;
    document.getElementById("panturrilha").innerText = document.getElementById("panturrilha-card").value;
    document.getElementById("data").innerText = new Date().toLocaleDateString("pt-BR");

    modal.classList.add("hidden");
};

function carregarPeso() {
    criarGrafico(dadosPesoMock);
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

function carregarDestaques() {
    renderizarDestaques(dadosCargasMock);
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
                <span>${escapeHtml(ex.nome)}</span>
                <span class="ganho">
                    <img src="../assets/icons/arrow_up.svg" class="icon">
                    &nbsp;&nbsp; <strong>${escapeHtml(ex.ganho)}</strong> kg
                </span>
            </div>
        `;
    });

    coluna2.forEach(ex => {
        col2.innerHTML += `
            <div class="item">
                <span>${escapeHtml(ex.nome)}</span>
                <span class="ganho">
                    <img src="../assets/icons/arrow_up.svg" class="icon">
                    &nbsp;&nbsp; <strong>${escapeHtml(ex.ganho)}</strong> kg
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
                    <span>${escapeHtml(ex.nome)}</span>
                    <span>${escapeHtml(ex.serie)}</span>
                    <span>${escapeHtml(ex.carga)}</span>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="card-historico">
                <div class="topo">
                    <span class="titulo"><strong>Treino: ${escapeHtml(treino.treino)} </strong></span>
                    <span class="data">Data: ${escapeHtml(treino.data)}</span>
                </div>
                <div class="cabecalho">
                    <span>Exercicios:</span>
                    <span>Series e Repeticoes</span>
                    <span>Carga</span>
                </div>
                <div class="lista-exercicios">
                    ${exerciciosHTML}
                </div>
                <div class="obs">
                    Observacao: ${escapeHtml(treino.observacao)}
                </div>
            </div>
        `;
    });
}

carregarDadosUsuario();
carregarPeso();
carregarDestaques();
renderizarHistorico(historicoMock);
