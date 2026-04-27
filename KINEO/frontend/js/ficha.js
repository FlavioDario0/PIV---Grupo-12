/*fetch("")
    .then(response => response.json())
    .then(data => {
        renderTela(data);
    })
    .catch(error => console.error("Erro:", error));
*/

let cardEditando = null;
let cardParaExcluir = null;

function renderTela(data) {
    const tableBody = document.getElementById("table-body");

    const progressBar = document.getElementById("progress"); 

    const countAtual = document.getElementById("count-atual");
    const countTotal = document.getElementById("count-total");

    const totalExercicios = data.exercicios.length;

    countAtual.textContent = 0;
    countTotal.textContent = totalExercicios;

    let total = 0;

    // título
    document.querySelector("h2").textContent = `Treino do Dia: ${data.treino}`;

    // exercícios
    data.exercicios.forEach(ex => {
        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <span>${ex.nome}</span>
            <span>${ex.serie}</span>
            <span>${ex.repeticoes}</span>
            <span>${ex.carga}</span>
            <div class="concluido">
                <button class="check"></button>
                <span>Concluído<span>
            </div>
        `;

        const btn = row.querySelector(".check");

        btn.addEventListener("click", () => {
            btn.classList.toggle("done");

            if (btn.classList.contains("done")) {
                total++;
            } else {
                total--;
            }

            countAtual.textContent = total;

            const porcentagem = (total / totalExercicios) * 100;
            progressBar.style.width = porcentagem + "%";
        });

        tableBody.appendChild(row);
    });

    const sidebar = document.querySelector(".sidebar");

    if (data.insight) {
        const card = document.createElement("div");
        card.classList.add("card-ia");

        card.innerHTML = `
            <h3>IA Insights</h3>
            <p>${data.insight}</p>
        `;

        sidebar.prepend(card);
    }

    btnAbrir.addEventListener("click", () => {
        modal.classList.remove("hidden");
        inputObs.value = "";
        cardEditando = null; 
    });

    btnSalvar.addEventListener("click", () => {
        const texto = inputObs.value.trim();
        if (texto === "") return;

        if (cardEditando) {
            const textoObs = cardEditando.querySelector(".texto-obs");
            textoObs.textContent = texto;

            cardEditando = null;
        } 
        else {
            const card = document.createElement("div");
            card.classList.add("card-obs");

            card.innerHTML = `
                <h3>Observação</h3>
                <p class="texto-obs">${texto}</p>

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

ativarGrupo(".dias button");
ativarGrupo(".treinos button");



// MODAL OBSERVAÇÃO
const modal = document.getElementById("modal-obs");
const btnAbrir = document.querySelector(".btn");
const btnCancelar = document.getElementById("cancelar");
const btnSalvar = document.getElementById("salvar");
const inputObs = document.getElementById("input-obs");
const sidebar = document.querySelector(".sidebar");

btnAbrir.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

btnCancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
    inputObs.value = "";
});


// MODAL EXCLUIR
const modalDelete = document.getElementById("modal-delete");
const btnCancelarDelete = document.getElementById("cancelar-delete");
const btnConfirmarDelete = document.getElementById("confirmar-delete");

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



// EXEMPLO
function getTreinoExemplo() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                treino: "Superiores B",
                exercicios: [
                    { nome: "Supino Reto", serie: "3x", repeticoes: "10-12", carga: "20kg" },
                    { nome: "Supino Inclinado", serie: "3x", repeticoes: "10-12", carga: "20kg" },
                    { nome: "Rosca Direta", serie: "3x", repeticoes: "10-12", carga: "15kg" }
                ],
                insight: "Tente aumentar 1kg no Supino Reto",
                observacao: "Treino pesado e completo!"
            });
        }, 200); 
    });
}

getTreinoExemplo().then(data => {
    renderTela(data);
});