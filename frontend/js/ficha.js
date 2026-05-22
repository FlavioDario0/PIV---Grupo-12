const usuarioLogado = protegerPagina();

let cardEditando = null;
let cardParaExcluir = null;
let treinoAtual = null;
let totalConcluidos = 0;

const modal = document.getElementById("modal-obs");
const btnAbrir = document.querySelector(".btn");
const btnCancelar = document.getElementById("cancelar");
const btnSalvar = document.getElementById("salvar");
const inputObs = document.getElementById("input-obs");
const sidebar = document.querySelector(".sidebar");
const modalDelete = document.getElementById("modal-delete");
const btnCancelarDelete = document.getElementById("cancelar-delete");
const btnConfirmarDelete = document.getElementById("confirmar-delete");
const btnFinalizar = document.querySelector(".finish");

function renderTela(data) {
    const tableBody = document.getElementById("table-body");
    const progressBar = document.getElementById("progress");
    const countAtual = document.getElementById("count-atual");
    const countTotal = document.getElementById("count-total");
    const totalExercicios = data.exercicios.length;

    tableBody.innerHTML = "";
    totalConcluidos = 0;
    countAtual.textContent = "0";
    countTotal.textContent = totalExercicios;
    progressBar.style.width = "0%";
    document.querySelector("h2").textContent = `Treino do Dia: ${data.treino}`;

    document.querySelectorAll(".card-ia").forEach(card => card.remove());

    if (totalExercicios === 0) {
        tableBody.innerHTML = `<div class="row"><span>Nenhum exercicio cadastrado para este treino.</span></div>`;
        return;
    }

    data.exercicios.forEach(ex => {
        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <span>${escapeHtml(ex.nome)}</span>
            <span>${escapeHtml(ex.serie)}</span>
            <span>${escapeHtml(ex.repeticoes)}</span>
            <span>${escapeHtml(ex.carga)}</span>
            <div class="concluido">
                <button class="check"></button>
                <span>Concluido</span>
            </div>
        `;

        const btn = row.querySelector(".check");

        btn.addEventListener("click", () => {
            btn.classList.toggle("done");

            totalConcluidos += btn.classList.contains("done") ? 1 : -1;
            countAtual.textContent = totalConcluidos;

            const porcentagem = (totalConcluidos / totalExercicios) * 100;
            progressBar.style.width = porcentagem + "%";
        });

        tableBody.appendChild(row);
    });

    if (data.insight) {
        const card = document.createElement("div");
        card.classList.add("card-ia");
        card.innerHTML = `
            <h3>IA Insights</h3>
            <p>${escapeHtml(data.insight)}</p>
        `;

        sidebar.prepend(card);
    }
}

function adicionarEventosCard(card) {
    const btnExcluir = card.querySelector(".excluir");
    const btnEditar = card.querySelector(".editar");
    const textoObs = card.querySelector(".texto-obs");

    btnExcluir.addEventListener("click", () => {
        modalDelete.classList.remove("hidden");
        cardParaExcluir = card;
    });

    btnEditar.addEventListener("click", () => {
        modal.classList.remove("hidden");
        inputObs.value = textoObs.textContent;
        cardEditando = card;
    });
}

function ativarGrupo(selector) {
    const botoes = document.querySelectorAll(selector);

    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
        });
    });
}

function mapearTreinoBackend(workout) {
    return {
        treino: workout.titulo || "Treino",
        exercicios: (workout.exercicios || []).map(ex => ({
            nome: ex.nomeExercicio || "-",
            serie: ex.series ? `${ex.series}x` : "-",
            repeticoes: ex.repeticoes || "-",
            carga: "-",
            observacoes: ex.observacoes || "",
            diaSemana: ex.diaSemana || ""
        }))
    };
}

async function carregarTreino() {
    if (!usuarioLogado) {
        return;
    }

    try {
        const workouts = await apiFetch(`/workouts/user/${usuarioLogado.id}`);

        if (!workouts.length) {
            treinoAtual = {
                treino: "Nenhum treino cadastrado",
                exercicios: []
            };
        } else {
            treinoAtual = mapearTreinoBackend(workouts[0]);
        }

        renderTela(treinoAtual);
    } catch (erro) {
        treinoAtual = {
            treino: "Erro ao carregar treino",
            exercicios: []
        };
        renderTela(treinoAtual);
        console.error(erro);
    }
}

async function concluirTreino() {
    if (!usuarioLogado) {
        return;
    }

    try {
        await apiFetch("/streaks/today", {
            method: "POST",
            body: {
                userId: usuarioLogado.id,
                treinou: true
            }
        });

        alert("Treino concluido e streak atualizado!");
    } catch (erro) {
        alert(erro.message || "Nao foi possivel concluir o treino.");
    }
}

ativarGrupo(".dias button");
ativarGrupo(".treinos button");

btnAbrir.addEventListener("click", () => {
    modal.classList.remove("hidden");
    inputObs.value = "";
    cardEditando = null;
});

btnCancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    inputObs.value = "";
});

btnSalvar.addEventListener("click", () => {
    const texto = inputObs.value.trim();
    if (texto === "") {
        return;
    }

    if (cardEditando) {
        const textoObs = cardEditando.querySelector(".texto-obs");
        textoObs.textContent = texto;
        cardEditando = null;
    } else {
        const card = document.createElement("div");
        card.classList.add("card-obs");

        card.innerHTML = `
            <h3>Observacao</h3>
            <p class="texto-obs">${escapeHtml(texto)}</p>
            <div class="acoes-obs">
                <button class="editar">
                    <img src="../assets/icons/edit.svg">
                </button>
                <button class="excluir">
                    <img src="../assets/icons/delete.svg">
                </button>
            </div>
        `;

        adicionarEventosCard(card);
        sidebar.appendChild(card);
    }

    modal.classList.add("hidden");
    inputObs.value = "";
});

btnCancelarDelete.addEventListener("click", () => {
    modalDelete.classList.add("hidden");
    cardParaExcluir = null;
});

btnConfirmarDelete.addEventListener("click", () => {
    if (cardParaExcluir) {
        cardParaExcluir.remove();
    }

    modalDelete.classList.add("hidden");
    cardParaExcluir = null;
});

btnFinalizar.addEventListener("click", concluirTreino);

carregarTreino();
