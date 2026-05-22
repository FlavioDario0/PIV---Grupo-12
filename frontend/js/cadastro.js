function validarCadastro() {
    executarCadastro();
    return false;
}

async function executarCadastro() {
    limparErros();

    let valido = true;

    const nome = document.getElementById("name").value.trim();
    const dataNascimento = document.getElementById("data_nasc").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;
    const objetivo = document.getElementById("obj").value;
    const nivel = document.getElementById("nivel").value;
    const altura = document.getElementById("altura").value.replace(",", ".");
    const peso = document.getElementById("peso").value.replace(",", ".");
    const frequenciaTreinos = document.getElementById("frequencia").value;
    const botao = document.querySelector("button[type='submit']");

    if (!nome) {
        mostrarErro("erro-name", "Digite seu nome");
        valido = false;
    }

    if (!dataNascimento) {
        mostrarErro("erro-data", "Digite sua data");
        valido = false;
    } else if (!dataValida(dataNascimento)) {
        mostrarErro("erro-data", "Data invalida");
        valido = false;
    }

    if (!email) {
        mostrarErro("erro-email", "Digite seu email");
        valido = false;
    } else if (!validarEmail(email)) {
        mostrarErro("erro-email", "Email invalido");
        valido = false;
    }

    if (!senha) {
        mostrarErro("erro-password", "Digite sua senha");
        valido = false;
    } else if (senha.length < 8) {
        mostrarErro("erro-password", "Minimo 8 caracteres");
        valido = false;
    }

    if (!altura || isNaN(parseFloat(altura))) {
        mostrarErro("erro-altura", "Altura invalida");
        valido = false;
    }

    if (!peso || isNaN(parseFloat(peso))) {
        mostrarErro("erro-peso", "Peso invalido");
        valido = false;
    }

    if (!objetivo) {
        mostrarErro("erro-obj", "Selecione um objetivo");
        valido = false;
    }

    if (!nivel) {
        mostrarErro("erro-nivel", "Selecione um nivel");
        valido = false;
    }

    if (!frequenciaTreinos) {
        mostrarErro("erro-frequencia", "Selecione a frequencia");
        valido = false;
    }

    if (!valido) {
        return;
    }

    try {
        if (botao) {
            botao.disabled = true;
            botao.textContent = "Cadastrando...";
        }

        const authResponse = await apiFetch("/auth/register", {
            method: "POST",
            body: {
                nome,
                dataNascimento,
                email,
                senha,
                objetivo,
                nivel,
                altura: parseFloat(altura),
                peso: parseFloat(peso),
                frequenciaTreinos
            }
        }, { auth: false });

        salvarSessao(authResponse);
        window.location.href = "pagina_principal.html";
    } catch (erro) {
        const mensagem = erro.message || "Nao foi possivel cadastrar.";

        if (mensagem.toLowerCase().includes("email")) {
            mostrarErro("erro-email", "Email ja cadastrado");
        } else {
            mostrarErro("erro-password", mensagem);
        }
    } finally {
        if (botao) {
            botao.disabled = false;
            botao.textContent = "Cadastrar";
        }
    }
}

function dataValida(data) {
    const partes = data.split("/");

    if (partes.length !== 3) {
        return false;
    }

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
    const dataObj = new Date(ano, mes, dia);

    return (
        dataObj.getFullYear() === ano &&
        dataObj.getMonth() === mes &&
        dataObj.getDate() === dia
    );
}

function mascaraData(input) {
    let valor = input.value.replace(/\D/g, "");

    if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    }

    if (valor.length > 5) {
        valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    }

    input.value = valor;
}

document.getElementById("name").addEventListener("input", () => { mostrarErro("erro-name", ""); });
document.getElementById("data_nasc").addEventListener("input", () => { mostrarErro("erro-data", ""); });
document.getElementById("email").addEventListener("input", () => { mostrarErro("erro-email", ""); });
document.getElementById("password").addEventListener("input", () => { mostrarErro("erro-password", ""); });
document.getElementById("altura").addEventListener("input", () => { mostrarErro("erro-altura", ""); });
document.getElementById("peso").addEventListener("input", () => { mostrarErro("erro-peso", ""); });
document.getElementById("obj").addEventListener("input", () => { mostrarErro("erro-obj", ""); });
document.getElementById("nivel").addEventListener("input", () => { mostrarErro("erro-nivel", ""); });
document.getElementById("frequencia").addEventListener("input", () => { mostrarErro("erro-frequencia", ""); });
