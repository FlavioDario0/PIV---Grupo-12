async function login() {

    event.preventDefault(); 
    
    limparErros();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;

    let valido = true;

    if (!email) {
        mostrarErro("erro-email", "Digite seu email");
        valido = false;
    }

    if (!senha) {
        mostrarErro("erro-password", "Digite sua senha");
        valido = false;
    }

    if (!valido) return false;

    const btnLogin = document.querySelector("button[type='submit']") || document.querySelector("button");
    const textoOriginal = btnLogin.textContent;
    btnLogin.textContent = "Entrando...";
    btnLogin.disabled = true;

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify({
                email: email,
                senha: senha 
            })
        });

        if (response.ok) {
        
            const dadosUsuario = await response.json();

        
            localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
            
            // Redireciona para a página principal
            window.location.href = "pagina_principal.html";
        } else {
            
            if (response.status === 401 || response.status === 403) {
                mostrarErro("erro-password", "Email ou senha incorretos");
            } else {
                mostrarErro("erro-email", "Erro ao fazer login. Verifique seus dados.");
            }
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        mostrarErro("erro-email", "Erro de conexão com o servidor. O backend está rodando?");
    } finally {
        // Restaura o botão
        btnLogin.textContent = textoOriginal;
        btnLogin.disabled = false;
    }

    return false;
}

document.getElementById("email").addEventListener("input", () => { mostrarErro("erro-email", ""); });
document.getElementById("password").addEventListener("input", () => { mostrarErro("erro-password", ""); });