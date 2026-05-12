const textarea = document.getElementById("msg");
const botaoEnviar = document.getElementById("enviar");
const chatMensagens = document.getElementById("chat-mensagens");
const historico = document.getElementById("historico");
const tituloChat = document.querySelectorAll(".main h1, .main h2, .acoes");

let chats = [];
let chatAtual = [];

// ======================
// AUTO RESIZE TEXTAREA
// ======================

textarea.addEventListener("input", () => {

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

});

// ======================
// CRIAR MENSAGEM
// ======================

function criarMensagem(texto, tipo) {

    const mensagem = document.createElement("div");

    mensagem.classList.add("mensagem");
    mensagem.classList.add(tipo);

    mensagem.innerText = texto;

    chatMensagens.appendChild(mensagem);

    scrollChat();

}

// ======================
// SCROLL AUTOMÁTICO
// ======================

function scrollChat() {

    chatMensagens.scrollTop = chatMensagens.scrollHeight;

}

// ======================
// ENVIAR MENSAGEM
// ======================

async function enviarMensagem() {

    const texto = textarea.value.trim();

    if (texto === "") return;

    criarMensagem(texto, "user");

    // ESCONDE O TÍTULO
    tituloChat.forEach(elemento => {
        elemento.style.display = "none";
    });

    chatAtual.push({
        tipo: "user",
        texto: texto
    });

    textarea.value = "";
    textarea.style.height = "auto";

    // ======================
    // AQUI VAI O BACKEND
    // ======================

    try {

        // EXEMPLO TEMPORÁRIO
        // depois você troca pelo fetch da IA

        const respostaIA = "Resposta da IA aqui";

        setTimeout(() => {

            criarMensagem(respostaIA, "ia");

            chatAtual.push({
                tipo: "ia",
                texto: respostaIA
            });

        }, 500);

    } catch (erro) {

        criarMensagem("Erro ao enviar mensagem.", "ia");

    }

}

// ======================
// ENTER PARA ENVIAR
// ======================

textarea.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        enviarMensagem();

    }

});

// ======================
// BOTÃO ENVIAR
// ======================

botaoEnviar.addEventListener("click", enviarMensagem);

// ======================
// NOVO CHAT
// ======================

document.querySelector(".novo-chat")
.addEventListener("click", () => {

    if (chatAtual.length > 0) {

        chats.push(chatAtual);

        adicionarHistorico(
            "Chat " + chats.length,
            chatAtual
        );

    }

    chatAtual = [];

    chatMensagens.innerHTML = "";

    // MOSTRA O TÍTULO NOVAMENTE
    tituloChat.forEach(elemento => {
        elemento.style.display = "block";
    });

});

// ======================
// HISTÓRICO
// ======================

function adicionarHistorico(nome, mensagens) {

    const item = document.createElement("div");

    item.classList.add("chat-item");

    item.innerText = nome;

    item.addEventListener("click", () => {

        carregarChat(mensagens);

    });

    historico.appendChild(item);

}

// ======================
// CARREGAR CHAT
// ======================

function carregarChat(mensagens) {

    chatMensagens.innerHTML = "";

    // ESCONDE O TÍTULO AO ABRIR CHAT
    tituloChat.forEach(elemento => {
        elemento.style.display = "none";
    });

    mensagens.forEach(msg => {

        criarMensagem(msg.texto, msg.tipo);

    });

}

// ======================
// BOTÕES RÁPIDOS
// ======================

document.getElementById("treino-btn")
.addEventListener("click", () => {

    textarea.value =
        "Monte um treino personalizado para mim";

    textarea.focus();

});

document.getElementById("substituir-btn")
.addEventListener("click", () => {

    textarea.value =
        "Sugira substituições para um exercício";

    textarea.focus();

});