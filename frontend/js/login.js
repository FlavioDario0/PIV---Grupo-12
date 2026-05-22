function login() {
    executarLogin();
    return false;
}

async function executarLogin() {
    limparErros();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;
    const botao = document.querySelector("button[type='submit']");

    let valido = true;

    if (!email) {
        mostrarErro("erro-email", "Digite seu email");
        valido = false;
    }

    if (!senha) {
        mostrarErro("erro-password", "Digite sua senha");
        valido = false;
    }

    if (!valido) {
        return;
    }

    try {
        if (botao) {
            botao.disabled = true;
            botao.textContent = "Entrando...";
        }

        const authResponse = await apiFetch("/auth/login", {
            method: "POST",
            body: { email, senha }
        }, { auth: false });

        salvarSessao(authResponse);
        window.location.href = "pagina_principal.html";
    } catch (erro) {
        const mensagem = erro.message || "Nao foi possivel fazer login.";

        if (mensagem.toLowerCase().includes("senha")) {
            mostrarErro("erro-password", "Senha incorreta");
        } else if (mensagem.toLowerCase().includes("usuario") || mensagem.toLowerCase().includes("email")) {
            mostrarErro("erro-email", "Email nao cadastrado");
        } else {
            mostrarErro("erro-password", mensagem);
        }
    } finally {
        if (botao) {
            botao.disabled = false;
            botao.textContent = "Entrar";
        }
    }
}

document.getElementById("email").addEventListener("input", () => { mostrarErro("erro-email", ""); });
document.getElementById("password").addEventListener("input", () => { mostrarErro("erro-password", ""); });
