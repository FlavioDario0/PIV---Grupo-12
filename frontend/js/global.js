function mostrarErro(id, mensagem) {
    document.getElementById(id).textContent = mensagem;
}

function limparErros() {
    const erros = document.querySelectorAll(".erro");
    erros.forEach(e => e.textContent = "");
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}