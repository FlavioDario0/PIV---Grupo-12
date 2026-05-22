protegerPagina();

const textarea = document.getElementById("msg");
const botaoEnviar = document.getElementById("enviar");
const chatMensagens = document.getElementById("chat-mensagens");
const historico = document.getElementById("historico");
const tituloChat = document.querySelectorAll(".main h1, .main h2, .acoes");

let chats = [];
let chatAtual = [];

textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
});

function criarMensagem(texto, tipo) {
    const mensagem = document.createElement("div");

    mensagem.classList.add("mensagem");
    mensagem.classList.add(tipo);
    mensagem.innerText = texto;

    chatMensagens.appendChild(mensagem);
    scrollChat();

    return mensagem;
}

function scrollChat() {
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

async function enviarMensagem() {
    const texto = textarea.value.trim();

    if (texto === "") {
        return;
    }

    criarMensagem(texto, "user");

    tituloChat.forEach(elemento => {
        elemento.style.display = "none";
    });

    chatAtual.push({
        tipo: "user",
        texto
    });

    textarea.value = "";
    textarea.style.height = "auto";

    const mensagemCarregando = criarMensagem("Pensando...", "ia");
    botaoEnviar.disabled = true;

    try {
        const resposta = await apiFetch("/chat/perguntar", {
            method: "POST",
            body: { pergunta: texto }
        }, { auth: false });

        const textoResposta = resposta.resposta || "A IA nao retornou uma resposta.";
        mensagemCarregando.innerText = textoResposta;

        chatAtual.push({
            tipo: "ia",
            texto: textoResposta
        });
    } catch (erro) {
        mensagemCarregando.innerText = erro.message || "Erro ao enviar mensagem.";
    } finally {
        botaoEnviar.disabled = false;
    }
}

textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

botaoEnviar.addEventListener("click", enviarMensagem);

document.querySelector(".novo-chat").addEventListener("click", () => {
    if (chatAtual.length > 0) {
        chats.push(chatAtual);
        adicionarHistorico("Chat " + chats.length, chatAtual);
    }

    chatAtual = [];
    chatMensagens.innerHTML = "";

    tituloChat.forEach(elemento => {
        elemento.style.display = "block";
    });
});

function adicionarHistorico(nome, mensagens) {
    const item = document.createElement("div");

    item.classList.add("chat-item");
    item.innerText = nome;

    item.addEventListener("click", () => {
        carregarChat(mensagens);
    });

    historico.appendChild(item);
}

function carregarChat(mensagens) {
    chatMensagens.innerHTML = "";

    tituloChat.forEach(elemento => {
        elemento.style.display = "none";
    });

    mensagens.forEach(msg => {
        criarMensagem(msg.texto, msg.tipo);
    });
}

document.getElementById("treino-btn").addEventListener("click", () => {
    textarea.value = "Monte um treino personalizado para mim";
    textarea.focus();
});

document.getElementById("substituir-btn").addEventListener("click", () => {
    textarea.value = "Sugira substituicoes para um exercicio";
    textarea.focus();
});
