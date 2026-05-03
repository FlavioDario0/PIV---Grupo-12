function login() {
    
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


    const loginDados = {
        email: email,
        senha: senha
    };

    fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginDados)
    })
    .then(async (resposta) => {
        if (resposta.ok) {
            const usuarioLogado = await resposta.json();
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado)); 
            window.location.href = "pagina_principal.html";
        } else {
            mostrarErro("erro-password", "E-mail ou senha incorretos");
        }
    })
    .catch(erro => {
        console.error("Erro na requisição:", erro);
        alert("Erro de conexão. O backend Java está rodando?");
    });

    return false;
}


document.getElementById("email").addEventListener("input", () => {mostrarErro("erro-email", "");});
document.getElementById("password").addEventListener("input", () => {mostrarErro("erro-password", "");});