function mostrarErro(id, mensagem) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = mensagem;
}

function limparErros() {
    const erros = document.querySelectorAll(".erro");
    erros.forEach(e => e.textContent = "");
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function formatarData(data) {
    const partes = data.split("/");
    if (partes.length !== 3) return null;
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];
    return `${ano}-${mes}-${dia}`; 
}

function dataValida(data) {
    const partes = data.split("/");
    if (partes.length !== 3) return false;
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
    let valor = input.value;
    valor = valor.replace(/\D/g, ""); 
    if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/, "$1/$2"); 
    }
    if (valor.length > 5) {
        valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3"); 
    }
    input.value = valor;
}

async function validarCadastro(event) {   

    if(event) event.preventDefault();

    limparErros();
    
    let valido = true;

    const nome = document.getElementById("name").value.trim();
    const dataNasc = document.getElementById("data_nasc").value;
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;
    const objetivo = document.getElementById("obj").value;
    const nivel = document.getElementById("nivel").value;
    const altura = document.getElementById("altura").value;
    const peso = document.getElementById("peso").value;
    const frequencia = document.getElementById("frequencia").value;

    if (!nome) { mostrarErro("erro-name", "Digite seu nome"); valido = false; }
    
    if (!dataNasc) {
        mostrarErro("erro-data", "Digite sua data");
        valido = false;
    } else if (!dataValida(dataNasc)) {
        mostrarErro("erro-data", "Data inválida");
        valido = false;
    }

    if (!email) {
        mostrarErro("erro-email", "Digite seu email");
        valido = false;
    } else if (!validarEmail(email)) {
        mostrarErro("erro-email", "Email inválido");
        valido = false;
    }

    if (!senha) {
        mostrarErro("erro-password", "Digite sua senha");
        valido = false;
    } else if (senha.length < 8) {
        mostrarErro("erro-password", "Mínimo 8 caracteres");
        valido = false;
    }

    if (!altura || isNaN(parseFloat(altura))) {
        mostrarErro("erro-altura", "Altura inválida");
        valido = false;
    }

    if (!peso || isNaN(parseFloat(peso))) {
        mostrarErro("erro-peso", "Peso inválido");
        valido = false;
    }

    if (!objetivo) { mostrarErro("erro-obj", "Selecione um objetivo"); valido = false; }
    if (!nivel) { mostrarErro("erro-nivel", "Selecione um nível"); valido = false; }
    if (!frequencia) { mostrarErro("erro-frequencia", "Selecione a frequência"); valido = false; }

    if (!valido) return false;

    const dataFormatada = formatarData(dataNasc);

    const usuario = {
        nome: nome,
        dataNascimento: dataFormatada,
        email: email,
        senha: senha,
        objetivo: objetivo,
        nivel: nivel,
        altura: parseFloat(altura),
        peso: parseFloat(peso),
        frequenciaTreinos: frequencia
    };

    const btnSubmit = document.querySelector("button[type='submit']") || document.querySelector("button");
    const textoOriginalBtn = btnSubmit ? btnSubmit.textContent : "Cadastrar";

    if(btnSubmit) {
        btnSubmit.textContent = "Salvando no Banco...";
        btnSubmit.disabled = true;
    }

    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html"; 
        } else {
            mostrarErro("erro-email", "Erro ao cadastrar. O e-mail pode já estar em uso.");
        }
    } catch (error) {
        console.error("Erro na comunicação com o backend:", error);
        alert("Erro de conexão com o servidor. O Java/Spring Boot está rodando?");
    } finally {
        if(btnSubmit) {
            btnSubmit.textContent = textoOriginalBtn;
            btnSubmit.disabled = false;
        }
    }

    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("name")?.addEventListener("input", () => { mostrarErro("erro-name", ""); });
    
    document.getElementById("data_nasc")?.addEventListener("input", (e) => { 
        mostrarErro("erro-data", ""); 
        mascaraData(e.target); 
    });

    document.getElementById("email")?.addEventListener("input", () => { mostrarErro("erro-email", ""); });
    document.getElementById("password")?.addEventListener("input", () => { mostrarErro("erro-password", ""); });
    document.getElementById("altura")?.addEventListener("input", () => { mostrarErro("erro-altura", ""); });
    document.getElementById("peso")?.addEventListener("input", () => { mostrarErro("erro-peso", ""); });
    document.getElementById("obj")?.addEventListener("change", () => { mostrarErro("erro-obj", ""); });
    document.getElementById("nivel")?.addEventListener("change", () => { mostrarErro("erro-nivel", ""); });
    document.getElementById("frequencia")?.addEventListener("change", () => { mostrarErro("erro-frequencia", ""); });
});