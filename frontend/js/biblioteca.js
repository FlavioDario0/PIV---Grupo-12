protegerPagina();

// Ainda nao existe endpoint de biblioteca no backend; por enquanto a tela usa mock local.
let grupoSelecionado = null;
let textoBusca = "";

window.onload = () => {

    const inputBusca = document.getElementById("input-busca");

    inputBusca.addEventListener("input", () => {
        console.log("digitando...");

        textoBusca = inputBusca.value.toLowerCase();
        aplicarFiltros();
    });

    aplicarFiltros();
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

    lista.forEach(exercicio => {
        const card = document.createElement("div");
        card.classList.add("container-exercicio");

        card.innerHTML = `
        <div class="card-header">
            <h2 class="nome-exercicio">${exercicio.nome}</h2>
        </div>
        
        <div class="card-body">
            <div class="col-esquerda">
                <img src="${exercicio.imagens[0]}">
                <img src="${exercicio.imagens[1]}">
            </div>

            <div class="conteudo">
                <div class="linha-cima">
                <div class="descricao">
                    <h3> Descrição do exercício </h3>
                    <span>${exercicio.descricao}</span>
                </div>

                <div class="col-direita">
                    <div class="equip">
                        <h3> Equipamentos necessários </h3>
                        <span>${exercicio.equipamentos}</span>
                    </div>
                    <div class="nivel">
                        <h3> Nível de dificuldade </h3>
                        <div class="nivel-linha">
                            <span class="nomes-niveis">${exercicio.niveis.join(" e ")}</span>

                            <div class="cores-niveis">${exercicio.niveis.map(n => `
                                    <div class="classific ${normalizarTexto(n)}"></div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                <div class="linha-baixo">
                    <div class="musculos">
                        <h3> Músucos trabalhados </h3>
                        <span>Principal: ${exercicio.musculos.principal}</span>
                        <br>
                        <span> Secundários: <span>
                        <ul>${exercicio.musculos.secundarios.map(m => `<li>${m}</li>`).join("")}</ul>
                    </div>
                    <div class="erro">
                        <h3> ⚠️ Erros comuns </h3>
                        <ul>${exercicio.erros.map(m => `<li>${m}</li>`).join("")}</ul>
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



// EXEMPLOS
const exerciciosMock = [
    {
        nome: "Supino Reto",
        imagens: ["../assets/img/supino1.png", "../assets/img/supino2.png"],
        descricao: "Exercício para peitoral",
        equipamentos: "Barra",
        niveis: ["Iniciante", "Intermediário"],
        musculos: {
            principal: "peito",
            secundarios: ["bíceps", "tríceps"]
        },
        erros: ["Abrir demais os cotovelos"]
    },
    {
        nome: "Agachamento",
        imagens: ["../assets/img/agacho1.png", "../assets/img/agacho2.png"],
        descricao: "Exercício para pernas",
        equipamentos: "Barra",
        niveis: ["Iniciante"],
        musculos: {
            principal: "quadríceps",
            secundarios: ["glúteo", "posterior de coxa"]
        },
        erros: ["Não curvar a coluna", "Não afastar as pernas"]
    },
    {
        nome: "Pulley Articulado",
        imagens: ["../assets/img/agacho1.png", "../assets/img/agacho2.png"],
        descricao: "Sente-se no equipamento com a postura ereta, pés apoiados e joelhos levemente fixados (se houver apoio). Segure as alças do pulley com os braços estendidos à frente ou acima (dependendo do modelo)."+
                    "Puxe as alças em direção ao tronco, flexionando os cotovelos e contraindo as costas."+
                    "\nRetorne lentamente à posição inicial, controlando o movimento.",
        equipamentos: "Máquina de pulley articulado (com braços independentes) e ajuste de carga por pesos (placas ou pinos)",
        niveis: ["Avançado"],
        musculos: {
            principal: "dorsal (costas)",
            secundarios: ["bíceps", "trapézio", "romboides", "deltoide posterior"]
        },
        erros: ["Curvar as costas durante o movimento", "Usar impulso do corpo ao invés de força muscular", "Puxar com os braços e não com as costas",
            "Não controlar a volta (fase excêntrica muito rápida)","Amplitude incompleta (não estender ou não puxar totalmente)"
        ]
    }
];

let listaCompleta = exerciciosMock;

const mapaGrupos = {
    peito: ["peito"],
    costas: ["dorsal", "costas"],
    pernas: ["quadríceps", "glúteo", "posterior"],
    biceps: ["bíceps"],
    triceps: ["tríceps"],
    ombro: ["deltoide", "ombro"],
    abdomen: ["abdomen"]
};
