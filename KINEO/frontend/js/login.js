async function login() {
    limparErros();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;
    let valido = true;

    // EMAIL
    if (!email) {
        mostrarErro("erro-email", "Digite seu email");
        valido = false;
    }
    // SENHA
    if (!senha) {
        mostrarErro("erro-password", "Digite sua senha");
        valido = false;
    }

    if (!valido) return false;

    try {
        // Envia o e-mail e a senha para o Java validar
        const resposta = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (resposta.ok) {
            // Sucesso! Vai para a página principal
            window.location.href = "pagina_principal.html";
        } else {
            mostrarErro("erro-password", "E-mail ou senha incorretos");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro de conexão. O backend está a rodar?");
    }
}


document.getElementById("email").addEventListener("input", () => {mostrarErro("erro-email", "");});
document.getElementById("password").addEventListener("input", () => {mostrarErro("erro-password", "");});