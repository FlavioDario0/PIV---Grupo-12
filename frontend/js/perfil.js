const dadosCargasMock = [
    { nome: "Agachamento", ganho: 25 }, { nome: "Supino reto", ganho: 12 }, { nome: "Levantamento terra", ganho: 30 },
    { nome: "Leg press", ganho: 18 }, { nome: "Cadeira extensora", ganho: 8 }, { nome: "Mesa flexora", ganho: 6 },
    { nome: "Elevação lateral", ganho: 4 }, { nome: "Elevação frontal", ganho: 3 }, { nome: "Pulley costas", ganho: 15 },
    { nome: "Remada curvada", ganho: 20 }, { nome: "Rosca direta", ganho: 7 }, { nome: "Tríceps corda", ganho: 5 },
    { nome: "Panturrilha em pé", ganho: 10 }, { nome: "Panturrilha sentado", ganho: 9 }, { nome: "Hack machine", ganho: 22 },
    { nome: "Afundo", ganho: 14 }, { nome: "Desenvolvimento ombro", ganho: 11 }, { nome: "Crucifixo", ganho: 2 },
    { nome: "Pullover", ganho: 1 }, { nome: "Abdominal máquina", ganho: 0 } 
];

const dadosPesoMock = [
    { mes: "Set/25", peso: 65.2 }, { mes: "Out/25", peso: 64.8 }, { mes: "Nov/25", peso: 64.1 },
    { mes: "Dez/25", peso: 63.9 }, { mes: "Jan/26", peso: 63.5 }, { mes: "Fev/26", peso: 62.8 },
    { mes: "Mar/26", peso: 62.4 }
];

const historicoMock = [
    {
        treino: "Superiores B", data: "17/03/2026", observacao: "Treino pesado e completo!",
        exercicios: [
            { nome: "Supino Reto", serie: "3x10", carga: "20kg" }, { nome: "Supino Inclinado", serie: "3x10", carga: "20kg" },
            { nome: "Rosca Direta", serie: "3x12", carga: "20kg" }, { nome: "Elevação Lateral", serie: "3x10", carga: "10kg" },
            { nome: "Tríceps Pulley", serie: "3x12", carga: "20kg" }
        ]
    },
    {
        treino: "Inferiores C", data: "16/03/2026", observacao: "Treino incompleto",
        exercicios: [
            { nome: "Agachamento", serie: "3x10", carga: "20kg" }, { nome: "Leg Press", serie: "3x10", carga: "20kg" },
            { nome: "Cadeira Extensora", serie: "3x12", carga: "20kg" }, { nome: "Mesa Flexora", serie: "3x12", carga: "15kg" },
            { nome: "Panturrilha", serie: "3x10", carga: "20kg" }
        ]
    }
];



function carregarDados() {
    const usuarioStorage = localStorage.getItem("usuarioLogado");

    if (!usuarioStorage) {
        window.location.href = "login.html";
        return;
    }

    const usuarioLogado = JSON.parse(usuarioStorage);

    fetch(`http://localhost:8080/users/${usuarioLogado.id}`)
        .then(resposta => {
            if (!resposta.ok) throw new Error("Erro ao buscar dados do servidor");
            return resposta.json();
        })
        .then(dadosDoBanco => {
            // Preenche os dados que vieram do banco de dados
            document.getElementById("user").innerText = dadosDoBanco.nome || "--";
            document.getElementById("altura").innerText = dadosDoBanco.altura || "--";
            document.getElementById("peso").innerText = dadosDoBanco.peso || "--";

            if (dadosDoBanco.dataNascimento) {
         
                const nascimento = new Date(dadosDoBanco.dataNascimento + "T00:00:00");
                const hoje = new Date();

                let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
                const diferencaMes = hoje.getMonth() - nascimento.getMonth();

                if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())) {
                    idadeCalculada--;
                }

                const dia = String(nascimento.getDate()).padStart(2, '0');
                const mesFormatado = String(nascimento.getMonth() + 1).padStart(2, '0');
                const ano = nascimento.getFullYear();

                document.getElementById("idade").innerText = idadeCalculada;
                document.getElementById("data").innerText = `${dia}/${mesFormatado}/${ano}`;
            } else {
                document.getElementById("idade").innerText = "--";
                document.getElementById("data").innerText = "--/--/----";
            }

            document.getElementById("quadril").innerText = "--";
            document.getElementById("peito").innerText = "--";
            document.getElementById("coxa").innerText = "--";
            document.getElementById("cintura").innerText = "--";
            document.getElementById("braco").innerText = "--";
            document.getElementById("panturrilha").innerText = "--";
        })
}


carregarDados();


const modal = document.getElementById("modal-atualizar");
const btnAbrir = document.querySelector(".btn"); 

if(btnAbrir) {
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
}

if(document.getElementById("cancelar")) {
    document.getElementById("cancelar").onclick = () => {
        modal.classList.add("hidden");
    };
}

if(document.getElementById("salvar")) {
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
}


async function carregarPeso() {
    try {
        const response = await fetch("/api/peso");
        const dadosGraficoPeso = await response.json();
        criarGrafico(dadosGraficoPeso);
    } catch (erro) {
        criarGrafico(dadosPesoMock);
    }
}

function criarGrafico(dadosGrafico) {
    const ctx = document.getElementById("graficoPeso");
    if(ctx) {
        new Chart(ctx, {
            type: "line",
            data: {
            labels: dadosGrafico.map(d => d.mes),
            datasets: [{
                label: "Peso (kg)",
                data: dadosGrafico.map(d => d.peso),
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: false } }
            }
        });
    }
}

async function carregarDestaques() {
    try {
        const response = await fetch("/api/cargas");
        const dadosCargas = await response.json();
        renderizarDestaques(dadosCargas);
    } catch (erro) {
        renderizarDestaques(dadosCargasMock);
    }
}

function renderizarDestaques(lista) {
    const col1 = document.getElementById("coluna1");
    const col2 = document.getElementById("coluna2");
    if(!col1 || !col2) return;
    
    col1.innerHTML = "";
    col2.innerHTML = "";
    lista = lista.filter(ex => ex.ganho > 0);
    lista.sort((a, b) => b.ganho - a.ganho);
    const top = lista.slice(0, 6);
    const metade = Math.ceil(top.length / 2);
    
    top.slice(0, metade).forEach(ex => {
        col1.innerHTML += `
            <div class="item">
            <span>${ex.nome}</span>
            <span class="ganho"><img src="../assets/icons/arrow_up.svg" class="icon">&nbsp;&nbsp; <strong>${ex.ganho}</strong> kg</span>
            </div>`;
    });
    
    top.slice(metade).forEach(ex => {
        col2.innerHTML += `
            <div class="item">
            <span>${ex.nome}</span>
            <span class="ganho"><img src="../assets/icons/arrow_up.svg" class="icon">&nbsp;&nbsp; <strong>${ex.ganho}</strong> kg</span>
            </div>`;
    });
}

function renderizarHistorico(lista) {
    const container = document.querySelector(".table-hist");
    if(!container) return;
    container.innerHTML = "";
    lista.forEach(treino => {
        let exerciciosHTML = "";
        treino.exercicios.forEach(ex => {
            exerciciosHTML += `<div class="linha"><span>${ex.nome}</span><span>${ex.serie}</span><span>${ex.carga}</span></div>`;
        });
        container.innerHTML += `
            <div class="card-historico">
                <div class="topo">
                    <span class="titulo"><strong>Treino: ${treino.treino} </strong></span>
                    <span class="data">Data: ${treino.data}</span>
                </div>
                <div class="cabecalho"><span>Exercícios:</span><span>Séries e Repetições</span><span>Carga</span></div>
                <div class="lista-exercicios">${exerciciosHTML}</div>
                <div class="obs">Observação: ${treino.observacao}</div>
            </div>`;
    });
}

carregarPeso();
carregarDestaques();
renderizarHistorico(historicoMock);