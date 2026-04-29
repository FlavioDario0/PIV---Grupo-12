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

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );

    // EMAIL NÃO EXISTE
    if (!usuario) {
        mostrarErro("erro-email", "Email não cadastrado");
        return false;
    }

    // SENHA ERRADA
    if (usuario.senha !== senha) {
        mostrarErro("erro-password", "Senha incorreta");
        return false;
    }

    // SUCESSO
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    window.location.href = "home.html";

    return false;
}


document.getElementById("email").addEventListener("input", () => {mostrarErro("erro-email", "");});
document.getElementById("password").addEventListener("input", () => {mostrarErro("erro-password", "");});