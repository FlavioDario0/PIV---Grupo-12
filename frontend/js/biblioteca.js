let grupoSelecionado = null;
let textoBusca = "";
let listaCompleta = []; //preenchida pelo back

window.onload = () => {
    fetch("http://localhost:8080/api/exercises")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return response.json();
        })
        .then(data => {
            listaCompleta = data; // Salva os dados vindos do banco
            aplicarFiltros();     // Renderiza na tela a primeira vez
        })
        .catch(error => {
            console.error("Erro ao buscar exercícios:", error);
            document.getElementById("lista-exercicios").innerHTML = 
                "<p style='color: white; text-align: center;'>Erro ao carregar o catálogo de exercícios. O backend está rodando?</p>";
        });

    // 2. Configura a barra de pesquisa por texto
    const inputBusca = document.getElementById("input-busca");
    if (inputBusca) {
        inputBusca.addEventListener("input", () => {
            textoBusca = inputBusca.value.toLowerCase();
            aplicarFiltros();
        });
    }
};

function filtrarGrupo(grupo) {
    // se clicar no mesmo grupo - desativa
    if (grupoSelecionado === grupo) {
        grupoSelecionado = null;
    } else {
        grupoSelecionado = grupo;
    }
    atualizarMenuAtivo(grupoSelecionado);
    aplicarFiltros();
}

function aplicarFiltros() {
    let filtrados = listaCompleta;

    if (grupoSelecionado) {
        const musculosGrupo = mapaGrupos[grupoSelecionado] || [];
        filtrados = filtrados.filter(e => 
             musculosGrupo.some(m =>
                e.musculos.principal.toLowerCase().includes(m)
            )
        );
    }

    if (textoBusca) {
        filtrados = filtrados.filter(exercicio => {
            return (
                exercicio.nome.toLowerCase().includes(textoBusca) ||
                exercicio.descricao.toLowerCase().includes(textoBusca) ||
                exercicio.musculos.principal.toLowerCase().includes(textoBusca) ||
                exercicio.musculos.secundarios.some(m => m.toLowerCase().includes(textoBusca))
            );
        });
    }

    renderizarExercicios(filtrados);
}

function atualizarMenuAtivo(grupo) {
    const links = document.querySelectorAll(".filtro a");
    links.forEach(link => {
        link.classList.remove("ativo");
        if (link.dataset.grupo === grupo) {
            link.classList.add("ativo");
        }
    });
}

function renderizarExercicios(lista) {
    const container = document.getElementById("lista-exercicios");
    container.innerHTML = "";
    
    if (lista.length === 0) {
        container.innerHTML = "<p style='color: white; text-align: center; margin-top: 20px;'>Nenhum exercício encontrado.</p>";
        return;
    }

    lista.forEach(exercicio => {
        const card = document.createElement("div");
        card.classList.add("container-exercicio");
        
        // Proteção para garantir que as arrays existam mesmo se o banco de dados retornar null
        const imagens = exercicio.imagens || ["", ""];
        const niveis = exercicio.niveis || [];
        const secundarios = exercicio.musculos?.secundarios || [];
        const erros = exercicio.erros || [];

        card.innerHTML = `
        <div class="card-header">
            <h2 class="nome-exercicio">${exercicio.nome}</h2>
        </div>
        
        <div class="card-body">
            <div class="col-esquerda">
                <img src="${imagens[0] || ''}" alt="Imagem 1">
                <img src="${imagens[1] || ''}" alt="Imagem 2">
            </div>
            <div class="conteudo">
                <div class="linha-cima">
                <div class="descricao">
                    <h3> Descrição do exercício </h3>
                    <span>${exercicio.descricao || ''}</span>
                </div>
                <div class="col-direita">
                    <div class="equip">
                        <h3> Equipamentos necessários </h3>
                        <span>${exercicio.equipamentos || ''}</span>
                    </div>
                    <div class="nivel">
                        <h3> Nível de dificuldade </h3>
                        <div class="nivel-linha">
                            <span class="nomes-niveis">${niveis.join(" e ")}</span>
                            <div class="cores-niveis">${niveis.map(n => `
                                    <div class="classific ${normalizarTexto(n)}"></div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div class="linha-baixo">
                    <div class="musculos">
                        <h3> Músculos trabalhados </h3>
                        <span>Principal: ${exercicio.musculos?.principal || ''}</span>
                        <br>
                        <span> Secundários: <span>
                        <ul>${secundarios.map(m => `<li>${m}</li>`).join("")}</ul>
                    </div>
                    <div class="erro">
                        <h3> Erros comuns </h3>
                        <ul>${erros.map(m => `<li>${m}</li>`).join("")}</ul>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <br>
        `;
        container.appendChild(card);
    });
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); 
}

const mapaGrupos = {
    peito: ["peito"],
    costas: ["dorsal", "costas"],
    pernas: ["quadríceps", "glúteo", "posterior"],
    biceps: ["bíceps"],
    triceps: ["tríceps"],
    ombro: ["deltoide", "ombro"],
    abdomen: ["abdomen"]
};