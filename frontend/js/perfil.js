// EXEMPLO
const dadosCargasMock = [
    { nome: "Agachamento", ganho: 25 },
    { nome: "Supino reto", ganho: 12 },
    { nome: "Levantamento terra", ganho: 30 },
    { nome: "Leg press", ganho: 18 },
    { nome: "Cadeira extensora", ganho: 8 },
    { nome: "Mesa flexora", ganho: 6 },
    { nome: "Elevação lateral", ganho: 4 },
    { nome: "Elevação frontal", ganho: 3 },
    { nome: "Pulley costas", ganho: 15 },
    { nome: "Remada curvada", ganho: 20 },
    { nome: "Rosca direta", ganho: 7 },
    { nome: "Tríceps corda", ganho: 5 },
    { nome: "Panturrilha em pé", ganho: 10 },
    { nome: "Panturrilha sentado", ganho: 9 },
    { nome: "Hack machine", ganho: 22 },
    { nome: "Afundo", ganho: 14 },
    { nome: "Desenvolvimento ombro", ganho: 11 },
    { nome: "Crucifixo", ganho: 2 },
    { nome: "Pullover", ganho: 1 },
    { nome: "Abdominal máquina", ganho: 0 } 
];


const dadosPesoMock = [
    { mes: "Set/25", peso: 65.2 },
    { mes: "Out/25", peso: 64.8 },
    { mes: "Nov/25", peso: 64.1 },
    { mes: "Dez/25", peso: 63.9 },
    { mes: "Jan/26", peso: 63.5 },
    { mes: "Fev/26", peso: 62.8 },
    { mes: "Mar/26", peso: 62.4 },
    
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
            { nome: "Elevação Lateral", serie: "3x10", carga: "10kg" },
            { nome: "Tríceps Pulley", serie: "3x12", carga: "20kg" }
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


const dados = {
    nome: "Eduarda Luiza",
    data: "20/02/2026",
    idade: 20,
    altura: 1.70,
    peso: 60.2,
    quadril: 88,
    peito: 82,
    coxa: 50,
    cintura: 62,
    braco: 24,
    panturrilha: 32
};

function carregarDados() {
    document.getElementById("user").innerText = dados.nome;
    document.getElementById("data").innerText = dados.data;
    document.getElementById("idade").innerText = dados.idade;
    document.getElementById("altura").innerText = dados.altura;
    document.getElementById("peso").innerText = dados.peso;

    document.getElementById("quadril").innerText = dados.quadril;
    document.getElementById("peito").innerText = dados.peito;
    document.getElementById("coxa").innerText = dados.coxa;
    document.getElementById("cintura").innerText = dados.cintura;
    document.getElementById("braco").innerText = dados.braco;
    document.getElementById("panturrilha").innerText = dados.panturrilha;
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
        const response = await fetch("/api/peso");
        const dados = await response.json();

        criarGrafico(dados);
    } catch (erro) {
        console.log("Usando mock de peso...");
        criarGrafico(dadosPesoMock);
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
        const response = await fetch("/api/cargas");
        const dados = await response.json();

        renderizarDestaques(dados);
    } catch (erro) {
        console.log("Usando mock de cargas...");
        renderizarDestaques(dadosCargasMock);
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

carregarPeso();
carregarDestaques();
renderizarHistorico(historicoMock);
