const textarea = document.getElementById("msg");
const botaoEnviar = document.getElementById("enviar");
const chatMensagens = document.getElementById("chat-mensagens");
const historico = document.getElementById("historico");
const tituloChat = document.querySelectorAll(".main h1, .main h2, .acoes");

let chats = [];
let chatAtual = [];

//CARREGAR CHATS DO LOCALSTORAGE AO INICIAR
document.addEventListener("DOMContentLoaded", () => {
    //Carrega o histórico de chats da barra lateral
    const historicoSalvo = localStorage.getItem("kineo_historico_chats");
    if (historicoSalvo) {
        chats = JSON.parse(historicoSalvo);
        chats.forEach((chat, index) => {
            const nomeDoChat = gerarNomeDoChat(chat, index + 1);
            adicionarHistorico(nomeDoChat, chat);
        });
    }

    //Carrega a conversa ativa que estava aberta
    const chatAtualSalvo = localStorage.getItem("kineo_chat_atual");
    if (chatAtualSalvo) {
        chatAtual = JSON.parse(chatAtualSalvo);
        if (chatAtual.length > 0) {
            tituloChat.forEach(elemento => elemento.style.display = "none");
            chatAtual.forEach(msg => {
                criarMensagem(msg.texto, msg.tipo);
            });
        }
    }
});

//AUTO RESIZE TEXTAREA

textarea.addEventListener("input", () => {

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

});

// CRIAR MENSAGEM

function criarMensagem(texto, tipo) {

    const mensagem = document.createElement("div");

    mensagem.classList.add("mensagem");
    mensagem.classList.add(tipo);

    //Converte o negrito
    let textoFormatado = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    //Converte as quebras de linha 
    textoFormatado = textoFormatado.replace(/\n/g, '<br>');

    //Usa innerHTML no lugar de innerText para que o navegador leia as tags geradas
    mensagem.innerHTML = textoFormatado;

    chatMensagens.appendChild(mensagem);

    scrollChat();

}

// SCROLL AUTOMÁTICO

function scrollChat() {

    chatMensagens.scrollTop = chatMensagens.scrollHeight;

}

// ENVIAR MENSAGEM

async function enviarMensagem() {
    const texto = textarea.value.trim();
    if (texto === "") return;

    criarMensagem(texto, "user");

    tituloChat.forEach(elemento => {
        elemento.style.display = "none";
    });

    chatAtual.push({
        tipo: "user",
        texto: texto
    });
    
    //Salva apenas a conversa atual, sem jogar para a barra lateral
    localStorage.setItem("kineo_chat_atual", JSON.stringify(chatAtual));

    textarea.value = "";
    textarea.style.height = "auto";

    try {
        criarMensagem("Digitando...", "ia"); 
        const ultimaMensagem = chatMensagens.lastElementChild;

        const requisicao = await fetch("http://localhost:8080/chat/perguntar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta: texto })
        });

        if (!requisicao.ok) throw new Error(`Erro: ${requisicao.status}`);

        const dados = await requisicao.json();
        
        let textoFormatado = dados.resposta.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        textoFormatado = textoFormatado.replace(/\n/g, '<br>');

        ultimaMensagem.innerHTML = textoFormatado;

        chatAtual.push({
            tipo: "ia",
            texto: dados.resposta
        });
        
        //Atualiza a conversa atual no armazenamento
        localStorage.setItem("kineo_chat_atual", JSON.stringify(chatAtual));

    } catch (erro) {
        console.error(erro);
        const ultimaMensagem = chatMensagens.lastElementChild;
        if(ultimaMensagem && ultimaMensagem.classList.contains('ia')){
             ultimaMensagem.innerText = "Erro ao enviar mensagem.";
        } else {
             criarMensagem("Erro ao enviar mensagem.", "ia");
        }
    }
}

// ENTER PARA ENVIAR

textarea.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        enviarMensagem();

    }

});

// BOTÃO ENVIAR

botaoEnviar.addEventListener("click", enviarMensagem);

// NOVO CHAT

document.querySelector(".novo-chat").addEventListener("click", () => {
    // Só cria um novo chat na lateral se a conversa atual não estiver vazia
    if (chatAtual.length > 0) {
        chats.push(chatAtual);

        const nomeDoChat = gerarNomeDoChat(chatAtual, chats.length);
        adicionarHistorico(nomeDoChat, chatAtual);
        
        localStorage.setItem("kineo_historico_chats", JSON.stringify(chats));
    }

    // Zera a tela para a nova conversa
    chatAtual = [];
    localStorage.removeItem("kineo_chat_atual");
    chatMensagens.innerHTML = "";

    tituloChat.forEach(elemento => {
        elemento.style.display = "block";
    });
});

// HISTÓRICO

function adicionarHistorico(nome, mensagens) {

    const item = document.createElement("div");

    item.classList.add("chat-item");

    item.innerText = nome;

    item.addEventListener("click", () => {

        carregarChat(mensagens);

    });

    historico.appendChild(item);

}

// GERAR NOME DO CHAT

function gerarNomeDoChat(mensagens, numeroDoChat) {
    if (mensagens && mensagens.length > 0 && mensagens[0].texto) {
        const palavras = mensagens[0].texto.split(" ");
        
        let nome = palavras.slice(0, 7).join(" ");
        
        if (palavras.length > 7) {
            nome += "...";
        }
        return nome;
    }
    return "Chat " + numeroDoChat;
}

// CARREGAR CHAT

function carregarChat(mensagens) {
    chatMensagens.innerHTML = "";

    tituloChat.forEach(elemento => {
        elemento.style.display = "none";
    });

    // Define que o chat clicado passa a ser o chat ativo no momento
    chatAtual = mensagens;
    localStorage.setItem("kineo_chat_atual", JSON.stringify(chatAtual));

    mensagens.forEach(msg => {
        // Usa a mesma formatação para as mensagens antigas não perderem o HTML
        const mensagem = document.createElement("div");
        mensagem.classList.add("mensagem", msg.tipo);
        
        let textoFormatado = msg.texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        textoFormatado = textoFormatado.replace(/\n/g, '<br>');
        
        mensagem.innerHTML = textoFormatado;
        chatMensagens.appendChild(mensagem);
    });
    
    // Faz o scroll para o final da conversa carregada
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

// BOTÕES RÁPIDOS

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