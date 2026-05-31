let treinoCompleto = [];
let diaSelecionado = "Seg";
let cardEditando = null;
let cardParaExcluir = null;

function getSemanaAtual() {
    const agora = new Date();
    const d = new Date(Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate()));
    const diaSemana = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - diaSemana);
    const inicioAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const numSemana = Math.ceil((((d - inicioAno) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${numSemana}`;
}

function getProgressoSemanal() {
    const semanaAtual = getSemanaAtual();
    try {
        const dados = JSON.parse(localStorage.getItem("progressoSemanal"));
        if (dados && dados.semana === semanaAtual) return dados;
    } catch {}
    const novo = { semana: semanaAtual, diasConcluidos: [] };
    localStorage.setItem("progressoSemanal", JSON.stringify(novo));
    return novo;
}

function isDiaConcluido(dia) {
    return getProgressoSemanal().diasConcluidos.includes(dia);
}

function marcarDiaConcluido(dia) {
    const progresso = getProgressoSemanal();
    if (!progresso.diasConcluidos.includes(dia)) {
        progresso.diasConcluidos.push(dia);
        localStorage.setItem("progressoSemanal", JSON.stringify(progresso));
    }
}

function getDiasComTreino() {
    const abreviacoes = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    const encontrados = new Set();
    
    treinoCompleto.forEach(ex => {
        const diaDoBanco = ex.diaSemana || ex.dia_semana || ex.diaDaSemana || "";
        
        abreviacoes.forEach(abrev => {
            if (diaDoBanco.toLowerCase().startsWith(abrev.toLowerCase())) {
                encontrados.add(abrev);
            }
        });
    });
    return [...encontrados];
}

function criarBarraSemanal() {
    const antiga = document.getElementById("barra-semanal");
    if (antiga) antiga.remove();

    const botoesTreinos = document.querySelector(".treinos");
    if (botoesTreinos) botoesTreinos.style.display = "none";

    const barra = document.createElement("div");
    barra.id = "barra-semanal";
    barra.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 16px;
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
        margin: 8px 16px;
    `;
    barra.innerHTML = `
        <span style="white-space: nowrap; font-size: 11px; color: #aaa;">Semana</span>
        <div style="flex: 1; background: #333; border-radius: 10px; height: 6px; overflow: hidden;">
            <div id="progress-semanal-fill" style="
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #6c63ff, #a78bfa);
                border-radius: 10px;
                transition: width 0.5s ease;
            "></div>
        </div>
        <span id="count-semanal" style="white-space: nowrap; font-size: 11px; color: #aaa;">0/0 dias</span>
    `;

    const diasDiv = document.querySelector(".dias");
    if (diasDiv) {
        diasDiv.insertAdjacentElement("afterend", barra);
    } else {
        document.querySelector(".container").prepend(barra);
    }

    atualizarBarraSemanal();
}

function atualizarBarraSemanal() {
    const diasComTreino = getDiasComTreino();
    const progresso = getProgressoSemanal();
    const concluidos = progresso.diasConcluidos.filter(d => diasComTreino.includes(d)).length;
    const total = diasComTreino.length;
    const porcentagem = total > 0 ? (concluidos / total) * 100 : 0;

    const fill = document.getElementById("progress-semanal-fill");
    const count = document.getElementById("count-semanal");
    if (fill) fill.style.width = porcentagem + "%";
    if (count) count.textContent = `${concluidos}/${total} dias`;
}

function mostrarTelaConclusao(dia) {
    const tableBody = document.getElementById("table-body");
    const progressBar = document.getElementById("progress");
    const countAtual = document.getElementById("count-atual");
    const countTotal = document.getElementById("count-total");
    const finishBtn = document.querySelector(".finish");

    const diasComTreino = getDiasComTreino();
    const progresso = getProgressoSemanal();
    const concluidos = progresso.diasConcluidos.filter(d => diasComTreino.includes(d)).length;
    const total = diasComTreino.length;

    if (concluidos >= total && total > 0) {
        tableBody.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; gap: 14px;">
                <div style="font-size: 52px;">🌟</div>
                <h2 style="margin: 0; font-size: 24px; color: #6DB141;">Semana Concluída!</h2>
                <p style="margin: 0; color: #ddd; font-size: 15px;">
                    Você finalizou todos os <strong>${total}</strong> treinos deste ciclo. Fantástico!
                </p>
                <button id="btn-reset-semana" style="
                    margin-top: 20px;
                    background: #C36E0C;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-family: 'Russo One', sans-serif;
                    cursor: pointer;
                    font-size: 16px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🔥 Iniciar Novo Ciclo
                </button>
            </div>
        `;

        setTimeout(() => {
            document.getElementById("btn-reset-semana").addEventListener("click", () => {
                localStorage.removeItem("progressoSemanal");
                window.location.reload();
            });
        }, 100);

    } else {
        tableBody.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 50px 20px;
                text-align: center;
                gap: 14px;
            ">
                <div style="font-size: 52px;">🏆</div>
                <h2 style="margin: 0; font-size: 22px; color: #a78bfa;">Bom trabalho!</h2>
                <p style="margin: 0; color: #ddd; font-size: 15px;">
                    Treino de <strong>${dia}</strong> concluído com sucesso.
                </p>
                <p style="margin: 0; color: #888; font-size: 13px;">
                    Faltam ${total - concluidos} treinos para fechar a semana! 💪
                </p>
            </div>
        `;
    }

    if (progressBar) progressBar.style.width = "100%";
    if (countAtual) countAtual.textContent = "✓";
    if (countTotal) countTotal.textContent = "";
    if (finishBtn) finishBtn.style.display = "none";
}

window.onload = async () => {
    const usuarioStorage = localStorage.getItem("usuarioLogado");
    if (!usuarioStorage) {
        alert("Você precisa fazer login primeiro!");
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioStorage);
    const containerFicha = document.querySelector(".container");
    const emptyState = document.getElementById("empty-state");
    const idDoUsuario = usuario.id || usuario.userId || usuario.idUsuario;
    const token = usuario.token;

    const labelProgressao = document.querySelector(".progresso label, .progress-label, .label-progresso");
    if (labelProgressao) labelProgressao.textContent = "Progressão Diária";

    try {
        const response = await fetch(`http://localhost:8080/workouts/user/${idDoUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const dadosDoBanco = await response.json();
            
            if (Array.isArray(dadosDoBanco) && dadosDoBanco.length > 0) {
                if (dadosDoBanco[dadosDoBanco.length - 1].exercicios) {
                    treinoCompleto = dadosDoBanco[dadosDoBanco.length - 1].exercicios || [];
                } else {
                    treinoCompleto = dadosDoBanco;
                }
            } else if (dadosDoBanco && dadosDoBanco.exercicios) {
                treinoCompleto = dadosDoBanco.exercicios;
            } else {
                treinoCompleto = dadosDoBanco || [];
            }
        } else {
            treinoCompleto = [];
            console.error("Erro ao buscar fichas. Status:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão ao buscar ficha:", error);
        treinoCompleto = [];
    }

    if (!treinoCompleto || treinoCompleto.length === 0) {
        containerFicha.classList.add("hidden");
        emptyState.classList.remove("hidden");
    } else {
        containerFicha.classList.remove("hidden");
        emptyState.classList.add("hidden");
        
        configurarBotoesDias();
        criarBarraSemanal();
        renderTela(diaSelecionado);
    }
};

function configurarBotoesDias() {
    const botoesDias = document.querySelectorAll(".dias button");

    if (botoesDias.length > 0) {
        botoesDias.forEach(b => b.classList.remove("ativo"));
        botoesDias[0].classList.add("ativo");
        diaSelecionado = botoesDias[0].textContent.trim();
    }

    botoesDias.forEach(btn => {
        btn.addEventListener("click", (e) => {
            botoesDias.forEach(b => b.classList.remove("ativo"));
            e.target.classList.add("ativo");
            diaSelecionado = e.target.textContent.trim();
            renderTela(diaSelecionado);
        });
    });
}

function renderTela(dia) {
    const tableBody = document.getElementById("table-body");
    const progressBar = document.getElementById("progress");
    const countAtual = document.getElementById("count-atual");
    const countTotal = document.getElementById("count-total");
    const finishBtn = document.querySelector(".finish");
    const footer = document.getElementById("footer-treino");
    const subtitulo = document.getElementById("subtitulo-dia");

    tableBody.innerHTML = "";

    if (subtitulo) subtitulo.textContent = dia;

    if (isDiaConcluido(dia)) {
        mostrarTelaConclusao(dia);
        if (footer) footer.style.display = "none";
        return;
    }

    const exerciciosDoDia = treinoCompleto.filter(ex => {
        const diaDoBanco = (ex.diaSemana || ex.dia_semana || ex.diaDaSemana || "").toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // Remove acentos
            
        const diaComparacao = dia.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // Remove acentos
            
        return diaDoBanco.startsWith(diaComparacao.substring(0, 3));
    });

    const totalExercicios = exerciciosDoDia.length;

    if (totalExercicios === 0) {
        tableBody.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color: #888; font-size: 15px;">
                😴 Dia de descanso. Aproveite para recuperar!
            </div>`;
        if (footer) footer.style.display = "none";
        return;
    }

    if (footer) footer.style.display = "";
    if (finishBtn) finishBtn.style.display = "";
    countAtual.textContent = 0;
    countTotal.textContent = totalExercicios;
    progressBar.style.width = "0%";

    let totalConcluidos = 0;

    exerciciosDoDia.forEach(ex => {
        const row = document.createElement("div");
        row.classList.add("row");

        const cargaAtual = ex.cargaRecomendada || ex.carga || ex.carga_recomendada || ex.peso || 0;

        row.innerHTML = `
            <span>${ex.nomeExercicio || ex.nome || "Exercício"}</span>
            <span>${ex.series}x</span>
            <span>
                <input type="number" min="1" class="input-reps" value="${ex.repeticoes}"
                    style="width: 50px; text-align: center; border-radius: 5px; border: none; padding: 5px;">
            </span>
            <span>
                <input type="number" min="0" max="500" step="0.5" class="input-carga" value="${cargaAtual}"
                    style="width: 60px; text-align: center; border-radius: 5px; border: none; padding: 5px;"> kg
            </span>
            <div class="concluido">
                <button class="check" data-id="${ex.id}"></button>
                <span>Concluído</span>
            </div>
        `;

        const btn = row.querySelector(".check");
        btn.addEventListener("click", () => {
            btn.classList.toggle("done");
            totalConcluidos += btn.classList.contains("done") ? 1 : -1;
            countAtual.textContent = totalConcluidos;
            progressBar.style.width = ((totalConcluidos / totalExercicios) * 100) + "%";
        });

        tableBody.appendChild(row);
    });
}

document.getElementById("btn-criar-ficha").addEventListener("click", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const btn = document.getElementById("btn-criar-ficha");
    const idDoUsuario = usuario.id || usuario.userId || usuario.idUsuario;
    const token = usuario.token;

    if (!idDoUsuario) {
        alert("Erro grave: O ID do usuário não foi encontrado. Por favor, faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    btn.textContent = "A IA está montando seu treino... (Aguarde)";
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.7";

    const payload = {
        userId: idDoUsuario,
        objetivo: usuario.objetivo || "Hipertrofia",
        frequenciaTreinos: usuario.frequenciaTreinos || "4 dias por semana",
        nivel: usuario.nivel || "Intermediário"
    };

    try {
        const response = await fetch("http://localhost:8080/chat/gerar-treino", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const novaFicha = await response.json();
            treinoCompleto = novaFicha.exercicios || [];

            document.getElementById("empty-state").classList.add("hidden");
            document.querySelector(".container").classList.remove("hidden");

            configurarBotoesDias();
            criarBarraSemanal();
            renderTela(diaSelecionado);
        } else {
            const err = await response.json();
            alert("Erro ao gerar ficha: " + (err.erro || "Falha no servidor IA"));
        }
    } catch (error) {
        console.error("Erro na IA:", error);
        alert("Erro de conexão. O servidor Java e o Ollama estão rodando?");
    } finally {
        btn.textContent = "Criar Ficha";
        btn.style.pointerEvents = "auto";
        btn.style.opacity = "1";
    }
});

document.querySelector(".finish").addEventListener("click", async () => {
    const botaoFinalizar = document.querySelector(".finish");

    try {
        const botoesCheck = document.querySelectorAll(".check.done");

        if (botoesCheck.length === 0) {
            alert("Você precisa concluir pelo menos um exercício para finalizar o treino!");
            return;
        }

        const usuarioStorage = localStorage.getItem("usuarioLogado");
        if (!usuarioStorage) throw new Error("Utilizador não encontrado no LocalStorage.");
        
        const usuario = JSON.parse(usuarioStorage);
        const idDoUsuario = usuario.id || usuario.userId || usuario.idUsuario;
        const token = usuario.token;

        botaoFinalizar.textContent = "Processando IA...";
        botaoFinalizar.style.pointerEvents = "none";

        const promessasDeReq = [];

        botoesCheck.forEach(btn => {
            const row = btn.closest(".row");
            if (!row) return; 

            const workoutExerciseId = btn.getAttribute("data-id");
            const inputCarga = row.querySelector(".input-carga");
            const inputReps = row.querySelector(".input-reps");

            const cargaUsada = inputCarga ? parseFloat(inputCarga.value) : 0;
            const repsFeitas = inputReps ? parseInt(inputReps.value) : 0;

            const requisicao = fetch("http://localhost:8080/treino/finalizar-exercicio", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    userId: idDoUsuario,
                    workoutExerciseId: parseInt(workoutExerciseId),
                    cargaUsada: cargaUsada,
                    repsFeitas: repsFeitas
                })
            }).then(async (res) => {
                if (!res.ok) throw new Error(`Status ${res.status} do servidor Java.`);
                const texto = await res.text();
                return texto ? JSON.parse(texto) : {}; 
            });

            promessasDeReq.push(requisicao);
        });

        await Promise.all(promessasDeReq);

        marcarDiaConcluido(diaSelecionado);
        atualizarBarraSemanal();
        mostrarTelaConclusao(diaSelecionado);

    } catch (error) {
        console.error("Erro CRÍTICO:", error);
        alert(`Ocorreu um erro: ${error.message}`);
    } finally {
        if (botaoFinalizar) {
            botaoFinalizar.textContent = "Concluir Treino";
            botaoFinalizar.style.pointerEvents = "auto";
        }
    }
});

// Modal Delete e Observações (Lógica Protegida)
const modalDelete = document.getElementById("modal-delete");
const btnCancelarDelete = document.getElementById("cancelar-delete");
const btnConfirmarDelete = document.getElementById("confirmar-delete");

if (btnCancelarDelete && modalDelete) {
    btnCancelarDelete.addEventListener("click", () => {
        modalDelete.classList.add("hidden");
        cardParaExcluir = null;
    });
}

if (btnConfirmarDelete && modalDelete) {
    btnConfirmarDelete.addEventListener("click", () => {
        if (cardParaExcluir) cardParaExcluir.remove();
        modalDelete.classList.add("hidden");
        cardParaExcluir = null;
    });
}

// LÓGICA DO CARROSSEL TUTORIAL
let slideAtual = 0;
const totalSlides = 4;

// Esta função é chamada ao clicar no botão "💡 Como funciona a IA?" no HTML
function abrirTutorial() {
    slideAtual = 0;
    atualizarCarrossel();
    const modalTutorial = document.getElementById("tutorial-modal");
    if (modalTutorial) modalTutorial.classList.remove("hidden");
}

function fecharTutorial() {
    const modalTutorial = document.getElementById("tutorial-modal");
    if (modalTutorial) modalTutorial.classList.add("hidden");
}

function irParaSlide(index) {
    slideAtual = index;
    atualizarCarrossel();
}

function proximoSlide() {
    if (slideAtual < totalSlides - 1) {
        slideAtual++;
        atualizarCarrossel();
    } else {
        fecharTutorial();
    }
}

function atualizarCarrossel() {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const btnProximo = document.getElementById("btn-proximo");

    slides.forEach((slide, i) => {
        if (i === slideAtual) {
            slide.classList.add("active");
            if (dots[i]) dots[i].classList.add("active");
        } else {
            slide.classList.remove("active");
            if (dots[i]) dots[i].classList.remove("active");
        }
    });

    if (btnProximo) {
        if (slideAtual === totalSlides - 1) {
            btnProximo.innerText = "Começar Treino!";
            btnProximo.style.background = "#4CAF50"; 
            btnProximo.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.3)";
        } else {
            btnProximo.innerText = "Próximo";
            btnProximo.style.background = "#6c63ff";
            btnProximo.style.boxShadow = "0 4px 15px rgba(108, 99, 255, 0.3)";
        }
    }
}