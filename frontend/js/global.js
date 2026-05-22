const API_BASE_URL = "http://localhost:8080";
const AUTH_TOKEN_KEY = "kineoToken";
const AUTH_USER_KEY = "usuarioLogado";

function mostrarErro(id, mensagem) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = mensagem;
    }
}

function limparErros() {
    const erros = document.querySelectorAll(".erro");
    erros.forEach(e => e.textContent = "");
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getUsuarioLogado() {
    const usuario = localStorage.getItem(AUTH_USER_KEY);

    if (!usuario) {
        return null;
    }

    try {
        return JSON.parse(usuario);
    } catch (erro) {
        localStorage.removeItem(AUTH_USER_KEY);
        return null;
    }
}

function salvarSessao(authResponse) {
    if (!authResponse || !authResponse.token || !authResponse.user) {
        throw new Error("Resposta de autenticacao invalida.");
    }

    localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authResponse.user));
}

function atualizarUsuarioSessao(user) {
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
}

function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = "login.html";
}

function protegerPagina() {
    const token = getToken();
    const usuario = getUsuarioLogado();

    if (!token || !usuario || !usuario.id) {
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

async function apiFetch(path, options = {}, config = {}) {
    const auth = config.auth !== false;
    const headers = new Headers(options.headers || {});
    const hasBody = options.body !== undefined && options.body !== null;
    const bodyIsFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

    if (hasBody && !bodyIsFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (auth) {
        const token = getToken();

        if (!token) {
            throw new Error("Usuario nao autenticado.");
        }

        headers.set("Authorization", `Bearer ${token}`);
    }

    const body = hasBody && !bodyIsFormData && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        body
    });

    const contentType = response.headers.get("content-type") || "";
    const hasJson = contentType.includes("application/json");
    const rawBody = await response.text();
    const data = rawBody && hasJson ? JSON.parse(rawBody) : rawBody;

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
        }

        const mensagem = typeof data === "string"
            ? data
            : data.message || data.error || "Erro ao chamar a API.";

        throw new Error(mensagem);
    }

    return data;
}

function escapeHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarDataBr(dataIso) {
    if (!dataIso) {
        return "--/--/----";
    }

    if (dataIso.includes("/")) {
        return dataIso;
    }

    const partes = dataIso.split("-");
    if (partes.length !== 3) {
        return dataIso;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
